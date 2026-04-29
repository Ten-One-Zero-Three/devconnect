import { pool } from '../config/database.js'

export const getAllPosts = async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, u.username,
        COUNT(DISTINCT uv.user_id) AS upvote_count,
        COUNT(DISTINCT c.id)       AS comment_count,
        ARRAY_AGG(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL) AS tags
      FROM posts p
      JOIN users u ON u.id = p.user_id
      LEFT JOIN upvotes uv ON uv.post_id = p.id
      LEFT JOIN comments c ON c.post_id = p.id
      LEFT JOIN post_tags pt ON pt.post_id = p.id
      LEFT JOIN tags t ON t.id = pt.tag_id
      GROUP BY p.id, u.username
      ORDER BY p.created_at DESC
    `)
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' })
  }
}

export const getPostById = async (req, res) => {
  const { id } = req.params
  try {
    const postResult = await pool.query(`
      SELECT p.*, u.username,
        COUNT(DISTINCT uv.user_id) AS upvote_count,
        ARRAY_AGG(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL) AS tags
      FROM posts p
      JOIN users u ON u.id = p.user_id
      LEFT JOIN upvotes uv ON uv.post_id = p.id
      LEFT JOIN post_tags pt ON pt.post_id = p.id
      LEFT JOIN tags t ON t.id = pt.tag_id
      WHERE p.id = $1
      GROUP BY p.id, u.username
    `, [id])

    if (postResult.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' })
    }

    const commentsResult = await pool.query(`
      SELECT c.*, u.username
      FROM comments c
      JOIN users u ON u.id = c.user_id
      WHERE c.post_id = $1
      ORDER BY c.created_at ASC
    `, [id])

    const flat = commentsResult.rows
    const topLevel = flat.filter(c => !c.parent_id).map(c => ({ ...c, replies: [] }))
    const byId = Object.fromEntries(topLevel.map(c => [c.id, c]))
    flat.filter(c => c.parent_id).forEach(r => {
      if (byId[r.parent_id]) byId[r.parent_id].replies.push(r)
    })

    res.json({ ...postResult.rows[0], comments: topLevel })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch post' })
  }
}

export const createPost = async (req, res) => {
  const { title, content, tags = [] } = req.body
  const userId = req.user.id

  try {
    const postResult = await pool.query(
      'INSERT INTO posts (title, content, user_id) VALUES ($1, $2, $3) RETURNING *',
      [title, content, userId]
    )
    const post = postResult.rows[0]

    for (const tagName of tags) {
      const tagResult = await pool.query(
        'INSERT INTO tags (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id',
        [tagName.toLowerCase()]
      )
      await pool.query(
        'INSERT INTO post_tags (post_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [post.id, tagResult.rows[0].id]
      )
    }

    res.status(201).json(post)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' })
  }
}

export const updatePost = async (req, res) => {
  const { id } = req.params
  const { title, content } = req.body
  const userId = req.user.id

  try {
    const existing = await pool.query('SELECT user_id FROM posts WHERE id = $1', [id])
    if (existing.rows.length === 0) return res.status(404).json({ error: 'Post not found' })
    if (existing.rows[0].user_id !== userId) return res.status(403).json({ error: 'Forbidden' })

    const result = await pool.query(
      'UPDATE posts SET title = $1, content = $2 WHERE id = $3 RETURNING *',
      [title, content, id]
    )
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: 'Failed to update post' })
  }
}

export const deletePost = async (req, res) => {
  const { id } = req.params
  const userId = req.user.id

  try {
    const existing = await pool.query('SELECT user_id FROM posts WHERE id = $1', [id])
    if (existing.rows.length === 0) return res.status(404).json({ error: 'Post not found' })
    if (existing.rows[0].user_id !== userId) return res.status(403).json({ error: 'Forbidden' })

    await pool.query('DELETE FROM posts WHERE id = $1', [id])
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete post' })
  }
}

export const toggleUpvote = async (req, res) => {
  const { id } = req.params
  const userId = req.user.id

  try {
    const existing = await pool.query(
      'SELECT 1 FROM upvotes WHERE post_id = $1 AND user_id = $2',
      [id, userId]
    )

    if (existing.rows.length > 0) {
      await pool.query('DELETE FROM upvotes WHERE post_id = $1 AND user_id = $2', [id, userId])
      return res.json({ upvoted: false })
    }

    await pool.query('INSERT INTO upvotes (post_id, user_id) VALUES ($1, $2)', [id, userId])
    res.json({ upvoted: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle upvote' })
  }
}

export const addComment = async (req, res) => {
  const { id } = req.params
  const { content } = req.body
  const userId = req.user.id

  try {
    const result = await pool.query(
      'INSERT INTO comments (content, user_id, post_id) VALUES ($1, $2, $3) RETURNING *',
      [content, userId, id]
    )
    const comment = await pool.query(
      'SELECT c.*, u.username FROM comments c JOIN users u ON u.id = c.user_id WHERE c.id = $1',
      [result.rows[0].id]
    )
    res.status(201).json({ ...comment.rows[0], replies: [] })
  } catch (error) {
    console.error('addComment error:', error.message)
    res.status(500).json({ error: 'Failed to add comment' })
  }
}

export const addReply = async (req, res) => {
  const { id, commentId } = req.params
  const { content } = req.body
  const userId = req.user.id

  try {
    const parent = await pool.query('SELECT id FROM comments WHERE id = $1 AND post_id = $2', [commentId, id])
    if (parent.rows.length === 0) return res.status(404).json({ error: 'Comment not found' })

    const result = await pool.query(
      'INSERT INTO comments (content, user_id, post_id, parent_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [content, userId, id, commentId]
    )
    const reply = await pool.query(
      'SELECT c.*, u.username FROM comments c JOIN users u ON u.id = c.user_id WHERE c.id = $1',
      [result.rows[0].id]
    )
    res.status(201).json(reply.rows[0])
  } catch (error) {
    res.status(500).json({ error: 'Failed to add reply' })
  }
}

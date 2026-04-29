import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../config/database.js', () => ({
  pool: { query: vi.fn() }
}))

vi.mock('../config/dotenv.js', () => ({}))

const { pool } = await import('../config/database.js')
const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  toggleUpvote,
  addComment,
} = await import('../controllers/post.js')

const mockRes = () => {
  const res = {}
  res.status = vi.fn().mockReturnValue(res)
  res.json = vi.fn().mockReturnValue(res)
  res.send = vi.fn().mockReturnValue(res)
  return res
}

beforeEach(() => vi.clearAllMocks())

// ─── getAllPosts ──────────────────────────────────────────────────────────────

describe('getAllPosts', () => {
  it('returns all posts', async () => {
    const rows = [{ id: 1, title: 'Test', username: 'an_lam', upvote_count: '2', tags: ['react'] }]
    pool.query.mockResolvedValueOnce({ rows })

    const res = mockRes()
    await getAllPosts({}, res)

    expect(res.json).toHaveBeenCalledWith(rows)
  })

  it('returns 500 on db error', async () => {
    pool.query.mockRejectedValueOnce(new Error('DB error'))

    const res = mockRes()
    await getAllPosts({}, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch posts' })
  })
})

// ─── getPostById ─────────────────────────────────────────────────────────────

describe('getPostById', () => {
  it('returns post with comments', async () => {
    const post = { id: 1, title: 'Test', username: 'an_lam', tags: ['react'] }
    const comments = [{ id: 1, content: 'Nice', username: 'emma_dev', parent_id: null }]

    pool.query
      .mockResolvedValueOnce({ rows: [post] })
      .mockResolvedValueOnce({ rows: comments })

    const req = { params: { id: '1' } }
    const res = mockRes()
    await getPostById(req, res)

    expect(res.json).toHaveBeenCalledWith({ ...post, comments: [{ ...comments[0], replies: [] }] })
  })

  it('returns 404 when post not found', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] })

    const req = { params: { id: '99' } }
    const res = mockRes()
    await getPostById(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ error: 'Post not found' })
  })

  it('returns 500 on db error', async () => {
    pool.query.mockRejectedValueOnce(new Error('DB error'))

    const req = { params: { id: '1' } }
    const res = mockRes()
    await getPostById(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch post' })
  })
})

// ─── createPost ──────────────────────────────────────────────────────────────

describe('createPost', () => {
  it('creates a post without tags', async () => {
    const post = { id: 1, title: 'Hello', content: 'World', user_id: 1 }
    pool.query.mockResolvedValueOnce({ rows: [post] })

    const req = { body: { title: 'Hello', content: 'World' }, user: { id: 1 } }
    const res = mockRes()
    await createPost(req, res)

    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(post)
  })

  it('creates a post with tags', async () => {
    const post = { id: 1, title: 'Hello', content: 'World', user_id: 1 }
    pool.query
      .mockResolvedValueOnce({ rows: [post] })          // insert post
      .mockResolvedValueOnce({ rows: [{ id: 10 }] })   // upsert tag
      .mockResolvedValueOnce({ rows: [] })               // insert post_tag

    const req = { body: { title: 'Hello', content: 'World', tags: ['react'] }, user: { id: 1 } }
    const res = mockRes()
    await createPost(req, res)

    expect(pool.query).toHaveBeenCalledTimes(3)
    expect(res.status).toHaveBeenCalledWith(201)
  })

  it('returns 500 on db error', async () => {
    pool.query.mockRejectedValueOnce(new Error('DB error'))

    const req = { body: { title: 'Hello', content: 'World' }, user: { id: 1 } }
    const res = mockRes()
    await createPost(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to create post' })
  })
})

// ─── updatePost ──────────────────────────────────────────────────────────────

describe('updatePost', () => {
  it('updates post when user is owner', async () => {
    const updated = { id: 1, title: 'New Title', content: 'New Content', user_id: 1 }
    pool.query
      .mockResolvedValueOnce({ rows: [{ user_id: 1 }] })
      .mockResolvedValueOnce({ rows: [updated] })

    const req = { params: { id: '1' }, body: { title: 'New Title', content: 'New Content' }, user: { id: 1 } }
    const res = mockRes()
    await updatePost(req, res)

    expect(res.json).toHaveBeenCalledWith(updated)
  })

  it('returns 403 when user is not owner', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ user_id: 2 }] })

    const req = { params: { id: '1' }, body: { title: 'X', content: 'Y' }, user: { id: 1 } }
    const res = mockRes()
    await updatePost(req, res)

    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.json).toHaveBeenCalledWith({ error: 'Forbidden' })
  })

  it('returns 404 when post not found', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] })

    const req = { params: { id: '99' }, body: { title: 'X', content: 'Y' }, user: { id: 1 } }
    const res = mockRes()
    await updatePost(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ error: 'Post not found' })
  })
})

// ─── deletePost ──────────────────────────────────────────────────────────────

describe('deletePost', () => {
  it('deletes post when user is owner', async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [{ user_id: 1 }] })
      .mockResolvedValueOnce({ rows: [] })

    const req = { params: { id: '1' }, user: { id: 1 } }
    const res = mockRes()
    await deletePost(req, res)

    expect(res.status).toHaveBeenCalledWith(204)
    expect(res.send).toHaveBeenCalled()
  })

  it('returns 403 when user is not owner', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ user_id: 2 }] })

    const req = { params: { id: '1' }, user: { id: 1 } }
    const res = mockRes()
    await deletePost(req, res)

    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.json).toHaveBeenCalledWith({ error: 'Forbidden' })
  })

  it('returns 404 when post not found', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] })

    const req = { params: { id: '99' }, user: { id: 1 } }
    const res = mockRes()
    await deletePost(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ error: 'Post not found' })
  })
})

// ─── toggleUpvote ─────────────────────────────────────────────────────────────

describe('toggleUpvote', () => {
  it('adds upvote when not yet upvoted', async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [] })   // no existing upvote
      .mockResolvedValueOnce({ rows: [] })   // insert

    const req = { params: { id: '1' }, user: { id: 1 } }
    const res = mockRes()
    await toggleUpvote(req, res)

    expect(res.json).toHaveBeenCalledWith({ upvoted: true })
  })

  it('removes upvote when already upvoted', async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [{ 1: 1 }] })  // existing upvote
      .mockResolvedValueOnce({ rows: [] })            // delete

    const req = { params: { id: '1' }, user: { id: 1 } }
    const res = mockRes()
    await toggleUpvote(req, res)

    expect(res.json).toHaveBeenCalledWith({ upvoted: false })
  })

  it('returns 500 on db error', async () => {
    pool.query.mockRejectedValueOnce(new Error('DB error'))

    const req = { params: { id: '1' }, user: { id: 1 } }
    const res = mockRes()
    await toggleUpvote(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to toggle upvote' })
  })
})

// ─── addComment ───────────────────────────────────────────────────────────────

describe('addComment', () => {
  it('adds a comment', async () => {
    const inserted = { id: 1, content: 'Great post!', user_id: 1, post_id: 1 }
    const withUsername = { ...inserted, username: 'an_lam' }
    pool.query
      .mockResolvedValueOnce({ rows: [inserted] })
      .mockResolvedValueOnce({ rows: [withUsername] })

    const req = { params: { id: '1' }, body: { content: 'Great post!' }, user: { id: 1 } }
    const res = mockRes()
    await addComment(req, res)

    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({ ...withUsername, replies: [] })
  })

  it('returns 500 on db error', async () => {
    pool.query.mockRejectedValueOnce(new Error('DB error'))

    const req = { params: { id: '1' }, body: { content: 'Hi' }, user: { id: 1 } }
    const res = mockRes()
    await addComment(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to add comment' })
  })
})

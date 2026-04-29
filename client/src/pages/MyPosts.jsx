import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import { getPosts, deletePost } from '../lib/api'
import '../css/MyPosts.css'

const MyPosts = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const user = (() => {
    try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
  })()

  useEffect(() => {
    if (!user) { setLoading(false); return }
    getPosts()
      .then(all => setPosts(all.filter(p => p.username === user.username)))
      .catch(() => setError('Failed to load posts.'))
      .finally(() => setLoading(false))
  }, [])

  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return posts
    return posts.filter(p =>
      `${p.title} ${p.content} ${(p.tags || []).join(' ')}`.toLowerCase().includes(q)
    )
  }, [query, posts])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post? This cannot be undone.')) return
    try {
      await deletePost(id)
      setPosts(prev => prev.filter(p => p.id !== id))
    } catch {
      alert('Failed to delete post.')
    }
  }

  if (!user) return (
    <div className="my-posts-empty">
      Please <Link to="/login">log in</Link> to see your posts.
    </div>
  )

  if (loading) return <div className="my-posts-empty">Loading...</div>
  if (error) return <div className="my-posts-empty">{error}</div>

  return (
    <div className="my-posts-page">
      <h2 className="my-posts-heading">My Posts</h2>

      <SearchBar value={query} onChange={setQuery} onSubmit={() => {}} />

      {filteredPosts.length === 0 ? (
        <div className="my-posts-empty">
          {posts.length === 0
            ? 'You have not created any posts yet.'
            : 'No posts match your search.'}
        </div>
      ) : (
        <ul className="my-posts-list">
          {filteredPosts.map(post => (
            <li key={post.id} className="my-post-row">
              <Link to={`/posts/${post.id}`} className="my-post-title">
                {post.title}
              </Link>
              <span className="my-post-meta">
                {post.comment_count} 💬 &nbsp;·&nbsp; {post.upvote_count} ▲
              </span>
              <div className="my-post-actions">
                <button
                  className="btn-edit"
                  onClick={() => navigate(`/posts/${post.id}/edit`)}
                >
                  Edit
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(post.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default MyPosts

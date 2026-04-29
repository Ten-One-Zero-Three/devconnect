import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import CommentList from '../components/CommentList'
import { getPost, toggleUpvote, addComment, addReply } from '../lib/api'
import '../css/SinglePost.css'

const SinglePost = () => {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [commentText, setCommentText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const token = localStorage.getItem('token')

  useEffect(() => {
    getPost(id)
      .then(setPost)
      .catch(() => setPost(null))
      .finally(() => setLoading(false))
  }, [id])

  const handleUpvote = async () => {
    if (!token) return
    try {
      const { upvoted } = await toggleUpvote(id)
      setPost(prev => ({
        ...prev,
        upvote_count: String(Number(prev.upvote_count) + (upvoted ? 1 : -1)),
      }))
    } catch {}
  }

  const handleComment = async (e) => {
    e.preventDefault()
    const text = commentText.trim()
    if (!text || !token) return
    setSubmitting(true)
    try {
      const comment = await addComment(id, text)
      setPost(prev => ({ ...prev, comments: [...(prev.comments || []), comment] }))
      setCommentText('')
    } catch {} finally {
      setSubmitting(false)
    }
  }

  const handleReply = async (commentId, replyText) => {
    const reply = await addReply(id, commentId, replyText)
    setPost(prev => ({
      ...prev,
      comments: prev.comments.map(c =>
        c.id === commentId ? { ...c, replies: [...(c.replies || []), reply] } : c
      ),
    }))
  }

  if (loading) return <div className="not-found-container">Loading...</div>

  if (!post) {
    return (
      <div className="not-found-container">
        <h2>Post Not Found</h2>
        <p>The post you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn-primary">← Back to Feed</Link>
      </div>
    )
  }

  const createdAt = new Date(post.created_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })

  return (
    <div className="single-post-layout">
      <article className="single-post-card">
        <div className="single-post-header">
          <h1 className="single-post-title">{post.title}</h1>
          <div className="single-post-meta">
            <span className="single-post-author">{post.username}</span>
            <span className="single-post-separator">·</span>
            <span className="single-post-time">{createdAt}</span>
          </div>
        </div>

        <div className="single-post-body">{post.content}</div>

        <div className="single-post-footer">
          <div className="tags-container">
            {(post.tags || []).map(tag => (
              <span key={tag} className="tag-pill">#{tag}</span>
            ))}
          </div>

          <div className="single-post-stats">
            <span>{(post.comments || []).length} comments</span>
            <button
              onClick={handleUpvote}
              style={{ background: 'none', border: 'none', cursor: token ? 'pointer' : 'default', color: 'inherit' }}
            >
              {post.upvote_count} ▲
            </button>
          </div>
        </div>
      </article>

      <section className="comments-section">
        {token && (
          <form onSubmit={handleComment} style={{ marginBottom: 16 }}>
            <textarea
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              rows={3}
              style={{ width: '100%', padding: 8, borderRadius: 8, background: '#07101a', color: 'inherit', border: '1px solid rgba(255,255,255,0.08)', boxSizing: 'border-box' }}
            />
            <button type="submit" className="btn-primary" disabled={submitting} style={{ marginTop: 8 }}>
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        )}

        <h3 className="comments-section-title">
          {(post.comments || []).length} {(post.comments || []).length === 1 ? 'Comment' : 'Comments'}
        </h3>
        <CommentList comments={post.comments || []} token={token} onReply={handleReply} />
      </section>
    </div>
  )
}

export default SinglePost

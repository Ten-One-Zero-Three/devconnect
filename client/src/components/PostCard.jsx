import { Link } from 'react-router-dom'
import '../css/PostCard.css'

const PostCard = ({ post }) => {
  const createdAt = new Date(post.created_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })

  return (
    <article className="post-card">
      <div className="post-card-header">
        <Link to={`/posts/${post.id}`} className="post-card-title-link">
          <h2 className="post-card-title">{post.title}</h2>
        </Link>
        <div className="post-card-meta">
          <span className="post-card-author">{post.username}</span>
          <span className="post-card-separator">·</span>
          <time className="post-card-time">{createdAt}</time>
        </div>
      </div>

      <div className="post-card-footer">
        <div className="post-card-metrics">
          <span className="metric-item">{post.comment_count} 💬</span>
          <span className="metric-item upvote-metric">{post.upvote_count} ▲</span>
        </div>
        <Link to={`/posts/${post.id}`} className="view-post-btn">
          View Post
        </Link>
      </div>
    </article>
  )
}

export default PostCard

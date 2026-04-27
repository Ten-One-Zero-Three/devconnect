import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import data from '../data'
import CommentList from '../components/CommentList'
import '../css/SinglePost.css'

const SinglePost = () => {
  const { id } = useParams()
  const [post, setPost] = useState(null)

  useEffect(() => {
    const found = data.posts.find(p => p.id === id)
    setPost(found || null)
  }, [id])

  if (!post) {
    return (
      <div className="not-found-container">
        <h2>Post Not Found</h2>
        <p>The post you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn-primary">← Back to Feed</Link>
      </div>
    )
  }

  const postComments = data.comments.filter(c => c.postId === post.id)

  return (
    <div className="single-post-layout">
      <article className="single-post-card">
        <div className="single-post-header">
          <h1 className="single-post-title">{post.title}</h1>
          <div className="single-post-meta">
            <span className="single-post-author">{post.author}</span>
            <span className="single-post-separator">·</span>
            <span className="single-post-time">{post.timestamp}</span>
          </div>
        </div>

        <div className="single-post-body">{post.body}</div>

        <div className="single-post-footer">
          <div className="tags-container">
            {post.tags.map(tag => (
              <span key={tag} className="tag-pill">#{tag}</span>
            ))}
          </div>

          <div className="single-post-stats">
            <span>{post.metrics.comments} comments</span>
            <span>{post.metrics.upvotes} upvotes</span>
          </div>
        </div>
      </article>

      <section className="comments-section">
        <h3 className="comments-section-title">
          {postComments.length} {postComments.length === 1 ? 'Comment' : 'Comments'}
        </h3>
        <CommentList comments={postComments} />
      </section>
    </div>
  )
}

export default SinglePost
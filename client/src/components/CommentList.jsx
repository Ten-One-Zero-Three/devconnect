import React from 'react'
import '../css/CommentList.css'

const CommentList = ({ comments = [] }) => {
  if (!comments.length) {
    return <div className="comments-empty">Be the first to comment.</div>
  }

  return (
    <div className="comments-list">
      {comments.map((comment) => (
        <article key={comment.id} className="comment-card">
          <div className="comment-avatar">
            {comment.author?.charAt(0) ?? 'U'}
          </div>
          <div className="comment-content">
            <div className="comment-header">
              <span className="comment-author">{comment.author}</span>
              <span className="comment-time">{comment.timestamp}</span>
            </div>
            <p className="comment-body">{comment.text}</p>
          </div>
        </article>
      ))}
    </div>
  )
}

export default CommentList
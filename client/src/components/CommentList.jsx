import { useState } from 'react'
import '../css/CommentList.css'

const formatDate = (ts) =>
  new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

const ReplyForm = ({ onSubmit }) => {
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const val = text.trim()
    if (!val) return
    setSubmitting(true)
    try {
      await onSubmit(val)
      setText('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="reply-form">
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Write a reply..."
        rows={2}
        className="reply-textarea"
      />
      <button type="submit" className="reply-submit" disabled={submitting}>
        {submitting ? 'Posting...' : 'Post Reply'}
      </button>
    </form>
  )
}

const CommentCard = ({ comment, token, onReply, isReply = false }) => {
  const [showReplyForm, setShowReplyForm] = useState(false)

  const handleReply = async (text) => {
    await onReply(comment.id, text)
    setShowReplyForm(false)
  }

  return (
    <div className={isReply ? 'comment-reply' : ''}>
      <article className="comment-card">
        <div className="comment-avatar">
          {comment.username?.charAt(0)?.toUpperCase() ?? 'U'}
        </div>
        <div className="comment-content">
          <div className="comment-header">
            <span className="comment-author">{comment.username}</span>
            <span className="comment-time">{formatDate(comment.created_at)}</span>
          </div>
          <p className="comment-body">{comment.content}</p>
          {token && !isReply && (
            <button
              className="reply-toggle"
              onClick={() => setShowReplyForm(prev => !prev)}
            >
              {showReplyForm ? 'Cancel' : 'Reply'}
            </button>
          )}
        </div>
      </article>

      {showReplyForm && (
        <div className="reply-form-wrapper">
          <ReplyForm onSubmit={handleReply} />
        </div>
      )}

      {!isReply && (comment.replies || []).length > 0 && (
        <div className="replies-list">
          {comment.replies.map(reply => (
            <CommentCard key={reply.id} comment={reply} token={null} onReply={null} isReply />
          ))}
        </div>
      )}
    </div>
  )
}

const CommentList = ({ comments = [], token, onReply }) => {
  if (!comments.length) {
    return <div className="comments-empty">Be the first to comment.</div>
  }

  return (
    <div className="comments-list">
      {comments.map(comment => (
        <CommentCard
          key={comment.id}
          comment={comment}
          token={token}
          onReply={onReply}
        />
      ))}
    </div>
  )
}

export default CommentList

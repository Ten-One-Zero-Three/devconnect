import '../css/CommentList.css'

const CommentList = ({ comments = [] }) => {
  if (!comments.length) {
    return <div className="comments-empty">Be the first to comment.</div>
  }

  return (
    <div className="comments-list">
      {comments.map((comment) => {
        const date = new Date(comment.created_at).toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric',
        })
        return (
          <article key={comment.id} className="comment-card">
            <div className="comment-avatar">
              {comment.username?.charAt(0)?.toUpperCase() ?? 'U'}
            </div>
            <div className="comment-content">
              <div className="comment-header">
                <span className="comment-author">{comment.username}</span>
                <span className="comment-time">{date}</span>
              </div>
              <p className="comment-body">{comment.content}</p>
            </div>
          </article>
        )
      })}
    </div>
  )
}

export default CommentList

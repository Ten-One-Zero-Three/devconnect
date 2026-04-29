import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getPost, updatePost } from '../lib/api'
import '../css/NewPost.css'

const EditPost = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', body: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    getPost(id)
      .then(post => setForm({ title: post.title, body: post.content }))
      .catch(() => setError('Failed to load post.'))
      .finally(() => setLoading(false))
  }, [id])

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.body.trim()) {
      setError('Title and body are required.')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      await updatePost(id, { title: form.title.trim(), content: form.body.trim() })
      navigate(`/posts/${id}`)
    } catch (err) {
      setError(err.message || 'Failed to update post.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="form-container">Loading...</div>

  return (
    <div className="form-container">
      <h2 className="form-title">Edit Post</h2>
      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="body">Body</label>
          <textarea
            id="body"
            name="body"
            value={form.body}
            onChange={handleChange}
            rows="10"
            required
          />
        </div>

        {error && <p className="form-error">{error}</p>}

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
          <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditPost

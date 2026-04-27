// client/src/pages/NewPost.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/NewPost.css';

const NewPost = () => {
  const [form, setForm] = useState({ title: '', body: '', tags: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) {
      setError('Title and body are required.');
      return;
    }
    // In a real app, you would send this to an API
    console.log('Submitting new post:', {
      ...form,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    });
    setError('');
    // Navigate to the feed or the new post's page on success
    navigate('/');
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Create a New Post</h2>
      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="What's the title of your post?"
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
            placeholder="Write your post content here..."
            rows="10"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="tags">Tags (comma-separated)</label>
          <input
            id="tags"
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="e.g., react, javascript, performance"
          />
        </div>

        {error && <p className="form-error">{error}</p>}

        <div className="form-actions">
          <button type="submit" className="btn-primary">Publish Post</button>
          <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewPost;
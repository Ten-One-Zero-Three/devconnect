const BASE = '/api'

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
})

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, options)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `Request failed: ${res.status}`)
  }
  if (res.status === 204) return null
  return res.json()
}

export const getPosts = () => request('/posts')

export const getPost = (id) => request(`/posts/${id}`)

export const createPost = ({ title, content, tags }) =>
  request('/posts', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ title, content, tags }),
  })

export const updatePost = (id, { title, content }) =>
  request(`/posts/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ title, content }),
  })

export const deletePost = (id) =>
  request(`/posts/${id}`, { method: 'DELETE', headers: authHeaders() })

export const toggleUpvote = (id) =>
  request(`/posts/${id}/upvote`, { method: 'POST', headers: authHeaders() })

export const addComment = (id, content) =>
  request(`/posts/${id}/comments`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ content }),
  })

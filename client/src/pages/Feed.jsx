import { useEffect, useMemo, useState } from 'react'
import SearchBar from '../components/SearchBar'
import PostCard from '../components/PostCard'
import { getPosts } from '../lib/api'

const Feed = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')

  useEffect(() => {
    getPosts()
      .then(setPosts)
      .catch(() => setError('Failed to load posts'))
      .finally(() => setLoading(false))
  }, [])

  const filteredPosts = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return posts
    return posts.filter((post) => {
      const text = `${post.title} ${post.content} ${post.username} ${(post.tags || []).join(' ')}`
      return text.toLowerCase().includes(normalized)
    })
  }, [query, posts])

  if (loading) return <div className="empty-state">Loading posts...</div>
  if (error) return <div className="empty-state">{error}</div>

  return (
    <div className="feed-page">
      <SearchBar value={query} onChange={setQuery} onSubmit={() => {}} />

      {filteredPosts.length === 0 ? (
        <div className="empty-state">No posts match your search. Try another keyword.</div>
      ) : (
        filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
      )}
    </div>
  )
}

export default Feed

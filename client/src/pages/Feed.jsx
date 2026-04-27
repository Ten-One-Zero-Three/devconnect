import { useMemo, useState } from 'react'
import SearchBar from '../components/SearchBar'
import data from '../data'
import PostCard from '../components/PostCard'

const Feed = () => {
  const [query, setQuery] = useState('')

  const filteredPosts = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return data.posts

    return data.posts.filter((post) => {
      const text = `${post.title} ${post.body} ${post.author} ${post.tags.join(' ')}`
      return text.toLowerCase().includes(normalized)
    })
  }, [query])

  return (
    <div className="feed-page">
      <SearchBar
        value={query}
        onChange={setQuery}
        onSubmit={() => {}}
      />

      {filteredPosts.length === 0 ? (
        <div className="empty-state">
          No posts match your search. Try another keyword.
        </div>
      ) : (
        filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
      )}
    </div>
  )
}

export default Feed
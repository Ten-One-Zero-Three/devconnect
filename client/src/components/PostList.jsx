import React from 'react'
import PostCard from './PostCard'

export default function PostList({posts}){
  if(!posts) return null
  if(posts.length === 0) return <div className="card">No posts found.</div>

  return (
    <div>
      {posts.map(p=> <PostCard key={p.id} post={p} />)}
    </div>
  )
}

import React, { useEffect, useState } from 'react'
import PostList from '../components/PostList'
import { getPosts } from '../lib/api'

export default function Home(){
  const [posts, setPosts] = useState([])
  const [query, setQuery] = useState('')

  useEffect(()=>{
    let mounted = true
    getPosts().then(data => {
      if(mounted) setPosts(data)
    })
    return ()=>{ mounted = false }
  },[])

  const filtered = posts.filter(p => {
    const q = query.trim().toLowerCase()
    if(!q) return true
    return p.title.toLowerCase().includes(q) || p.body.toLowerCase().includes(q) || p.tags.join(' ').includes(q)
  })

  return (
    <section>
      <h2>Home</h2>
      <div style={{marginBottom:12}}>
        <input
          placeholder="Search posts, tags, or text..."
          value={query}
          onChange={e=>setQuery(e.target.value)}
          style={{width:'100%',padding:10,borderRadius:8,border:'1px solid rgba(255,255,255,0.06)',background:'#07101a',color:'inherit'}}
        />
      </div>
      <PostList posts={filtered} />
    </section>
  )
}

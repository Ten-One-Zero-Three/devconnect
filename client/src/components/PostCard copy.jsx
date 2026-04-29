import React from 'react'
import { Link } from 'react-router-dom'

export default function PostCard({post}){
  return (
    <article className="card" style={{marginBottom:12}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h3 style={{margin:0}}><Link to={`/post/${post.id}`}>{post.title}</Link></h3>
        <div style={{color:'var(--muted)'}}>▲ {post.upvotes}</div>
      </div>
      <p style={{color:'var(--muted)'}}>{post.body}</p>
      <div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:8}}>
        {post.tags.map(t=> <span key={t} style={{background:'#081217',padding:'4px 8px',borderRadius:999,color:'var(--muted)',fontSize:12}}>{t}</span>)}
      </div>
    </article>
  )
}

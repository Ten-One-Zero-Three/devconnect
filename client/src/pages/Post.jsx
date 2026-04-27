import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getPost } from '../lib/api'

export default function Post(){
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')

  useEffect(()=>{
    let mounted = true
    setLoading(true)
    getPost(id).then(p=>{
      if(!mounted) return
      setPost(p || null)
      // simple mock comments for UI
      setComments(p ? [
        { id: 'c1', author: 'UserB', text: 'This helped me, thanks!', createdAt: '2026-04-09' },
        { id: 'c2', author: 'UserC', text: 'Consider using useEffect cleanup.', createdAt: '2026-04-10' }
      ] : [])
      setLoading(false)
    })
    return ()=>{ mounted = false }
  },[id])

  function handleSubmit(e){
    e.preventDefault()
    const text = commentText.trim()
    if(!text) return
    const newComment = { id: `c-${Date.now()}`, author: 'You', text, createdAt: new Date().toISOString().slice(0,10) }
    setComments(prev=>[newComment,...prev])
    setCommentText('')
  }

  if(loading) return <div className="card">Loading post...</div>
  if(!post) return <div className="card">Post not found. <Link to="/">Go home</Link></div>

  return (
    <article>
      <header style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>
          <h2 style={{margin:0}}>{post.title}</h2>
          <div style={{color:'var(--muted)',fontSize:13}}>{post.author} • {post.createdAt}</div>
        </div>
        <div style={{textAlign:'right'}}>
          <div style={{color:'var(--muted)'}}>▲ {post.upvotes}</div>
        </div>
      </header>

      <section className="card" style={{marginTop:12}}>
        <p>{post.body}</p>
        <div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:8}}>
          {post.tags.map(t=> <span key={t} style={{background:'#081217',padding:'4px 8px',borderRadius:999,color:'var(--muted)',fontSize:12}}>{t}</span>)}
        </div>
      </section>

      <section style={{marginTop:14}}>
        <h3>Answers / Comments</h3>
        <form onSubmit={handleSubmit} style={{marginBottom:12}}>
          <textarea
            value={commentText}
            onChange={e=>setCommentText(e.target.value)}
            placeholder="Write a comment..."
            rows={3}
            style={{width:'100%',padding:8,borderRadius:8,background:'#07101a',color:'inherit',border:'1px solid rgba(255,255,255,0.04)'}}
          />
          <div style={{marginTop:8}}>
            <button className="primary" type="submit">Submit</button>
          </div>
        </form>

        {comments.length === 0 && <div className="card">No comments yet.</div>}
        {comments.map(c=> (
          <div key={c.id} className="card" style={{marginBottom:10}}>
            <div style={{display:'flex',justifyContent:'space-between'}}>
              <strong>{c.author}</strong>
              <span style={{color:'var(--muted)'}}>{c.createdAt}</span>
            </div>
            <p style={{marginTop:8}}>{c.text}</p>
          </div>
        ))}
      </section>
    </article>
  )
}

import React from 'react'
import { Link } from 'react-router-dom'

export default function NavBar(){
  return (
    <header className="nav-bar card">
      <div className="site-title">DevConnect</div>
      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/new">Post</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/login">Login</Link>
      </nav>
    </header>
  )
}

import { Link, useNavigate } from 'react-router-dom'

const NavBar = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const handleLogout = async () => {
    const confirmed = window.confirm('Would you like to log out?')
    if (!confirmed) return

    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    })
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <nav>
      <ul>
        <li><strong><Link to="/">DevConnect</Link></strong></li>
      </ul>
      <ul>
        <li><Link to="/">🏠 Home</Link></li>
        <li><Link to="/new">➕ Post</Link></li>
        <li><Link to="/profile">👤 Profile</Link></li>
        <li>
          {token
            ? <a onClick={handleLogout} style={{ cursor: 'pointer' }}>Logout</a>
            : <Link to="/login">Login</Link>
          }
        </li>
      </ul>
    </nav>
  )
}

export default NavBar

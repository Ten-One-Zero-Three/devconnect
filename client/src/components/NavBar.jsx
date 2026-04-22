import { Link } from 'react-router-dom'

const NavBar = () => {
  return (
    <nav>
      <ul>
        <li><strong><Link to="/">DevConnect</Link></strong></li>
      </ul>
      <ul>
        <li><Link to="/">🏠 Home</Link></li>
        <li><Link to="/new">➕ Post</Link></li>
        <li><Link to="/profile">👤 Profile</Link></li>
        <li><Link to="/login">Login</Link></li>
      </ul>
    </nav>
  )
}

export default NavBar

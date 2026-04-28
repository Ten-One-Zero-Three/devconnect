// client/src/components/NavBar.jsx
import { Link, useNavigate } from 'react-router-dom';
import '../css/NavBar.css'// We will create this file next

const NavBar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = async () => {
    if (!window.confirm('Are you sure you want to log out?')) return;

    // This is a mock logout. In a real app, you might invalidate the token on the server.
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          <strong>DevConnect</strong>
        </Link>
        <nav className="navbar-links">
          <Link to="/">🏠 Home</Link>
          {token && <Link to="/new">➕ New Post</Link>}
          <Link to="/profile">👤 Profile</Link>
          {token ? (
            <a onClick={handleLogout} className="navbar-action-link">Logout</a>
          ) : (
            <Link to="/login" className="navbar-action-link">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
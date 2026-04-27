// client/src/pages/Profile.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import data from '../data';
import '../css/Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [myPosts, setMyPosts] = useState([]);

  useEffect(() => {
    try {
      const rawUser = localStorage.getItem('user');
      const parsedUser = rawUser ? JSON.parse(rawUser) : null;
      setUser(parsedUser);

      if (parsedUser) {
        const userPosts = data.posts.filter(p => p.author === (parsedUser.username || parsedUser.name));
        setMyPosts(userPosts);
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="profile-card text-center">
        <h2>Not Logged In</h2>
        <p className="text-secondary">Please log in to view your profile.</p>
        <Link to="/login" className="btn-primary">Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="profile-layout">
      <div className="profile-card">
        <div className="profile-info">
          <div className="profile-avatar">{(user.name || user.username || 'U').charAt(0)}</div>
          <div className="profile-details">
            <h2 className="profile-name">{user.name || user.username}</h2>
            <p className="profile-email text-secondary">{user.email}</p>
          </div>
        </div>
        <div className="profile-actions">
          <button onClick={handleLogout} className="btn-secondary">Logout</button>
        </div>
      </div>

      <div className="profile-posts-card">
        <h3 className="profile-posts-title">Your Posts</h3>
        {myPosts.length > 0 ? (
          <ul className="posts-list">
            {myPosts.map(post => (
              <li key={post.id}>
                <Link to={`/posts/${post.id}`} className="post-item">
                  <span className="post-item-title">{post.title}</span>
                  <span className="post-item-stats text-secondary">
                    {post.metrics.comments} 💬 / {post.metrics.upvotes} ▲
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-secondary text-center">You have not created any posts yet.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
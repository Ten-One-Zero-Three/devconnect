import React from 'react'
import { useRoutes } from 'react-router-dom'
import NavBar from './components/NavBar'
import GuestRoute from './components/GuestRoute'
import Feed from './pages/Feed'
import SinglePost from './pages/SinglePost'
import NewPost from './pages/NewPost'
import Profile from './pages/Profile'
import Login from './pages/Login'
import './App.css'
import './css/theme.css'; 

const App = () => {
  let element = useRoutes([
    { path: '/',            element: <Feed /> },
    { path: '/posts/:id',   element: <SinglePost /> },
    { path: '/new',         element: <NewPost /> },
    { path: '/profile',     element: <Profile /> },
    { path: '/login',       element: <GuestRoute><Login /></GuestRoute> },
  ])

  return (
    <div className='app-container'> {/* Use app-container */}
      <NavBar />
      <main className='main-content'> {/* Wrap content in main-content */}
        {element}
      </main>
    </div>
  );
};

export default App
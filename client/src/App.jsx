import React from 'react'
import { useRoutes } from 'react-router-dom'
import './App.css'

const App = () => {
  let element = useRoutes([
    
  ])

  return (
    <div className='app'>
      DEV CONNECT FRONT END
      { element }

    </div>
  )
}

export default App
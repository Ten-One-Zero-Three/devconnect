import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../css/Login.css'

const Login = () => {
  const [tab, setTab] = useState('login')
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const endpoint = tab === 'login' ? '/api/auth/login' : '/api/auth/register'

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong')
        return
      }

      if (tab === 'signup') {
        setTab('login')
        setForm({ email: '', password: '' })
      } else {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        setSuccess('Successfully logged in!')
        setTimeout(() => navigate('/'), 1000)
      }
    } catch (err) {
      setError('Could not connect to server')
    }
  }

  return (
    <main className="container login-container">
      <hgroup className="login-header">
        <h1>DevConnect</h1>
        <p>Where developers get answers</p>
      </hgroup>

      <div role="group" className="login-tab-group">
        <button
          onClick={() => setTab('login')}
          className={tab === 'login' ? '' : 'secondary outline'}
        >
          Login
        </button>
        <button
          onClick={() => setTab('signup')}
          className={tab === 'signup' ? '' : 'secondary outline'}
        >
          Sign Up
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Password
          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </label>

        {error && <p className="login-error">{error}</p>}
        {success && <p className="login-success">{success}</p>}

        <button type="submit" className="login-submit">
          {tab === 'login' ? 'Log In' : 'Create Account'}
        </button>
      </form>

      <p className="login-footer">
        {tab === 'login' ? (
          <>Don't have an account? <a onClick={() => setTab('signup')}>Sign Up →</a></>
        ) : (
          <>Already have an account? <a onClick={() => setTab('login')}>Log In →</a></>
        )}
      </p>
    </main>
  )
}

export default Login

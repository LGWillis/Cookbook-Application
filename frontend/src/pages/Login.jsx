import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UsersAPI } from '../lib/api'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      const tokens = await UsersAPI.login(username, password)
      localStorage.setItem('access', tokens.access)
      localStorage.setItem('refresh', tokens.refresh)
      navigate('/recipes')
    } catch (err) {
      setError(err?.data?.detail || 'Login failed')
    }
  }

  return (
    <div style={{ padding: 24, maxWidth: 420 }}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Username</label><br />
          <input value={username} onChange={e => setUsername(e.target.value)} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Password</label><br />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>Need an account? <Link to="/register">Register</Link></p>
    </div>
  )
}

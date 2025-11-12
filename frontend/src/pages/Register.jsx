import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UsersAPI } from '../lib/api'

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', first_name: '', last_name: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  function update(field) {
    return e => setForm({ ...form, [field]: e.target.value })
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      await UsersAPI.register(form)
      navigate('/login')
    } catch (err) {
      const data = err?.data
      setError(typeof data === 'string' ? data : (data?.detail || 'Registration failed'))
    }
  }

  return (
    <div style={{ padding: 24, maxWidth: 520 }}>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={onSubmit}>
        <div style={{ display: 'grid', gap: 12 }}>
          <label>Username<br /><input value={form.username} onChange={update('username')} /></label>
          <label>Email<br /><input value={form.email} onChange={update('email')} /></label>
          <label>First name<br /><input value={form.first_name} onChange={update('first_name')} /></label>
          <label>Last name<br /><input value={form.last_name} onChange={update('last_name')} /></label>
          <label>Password<br /><input type="password" value={form.password} onChange={update('password')} /></label>
        </div>
        <div style={{ marginTop: 12 }}>
          <button type="submit">Create account</button>
        </div>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  )
}

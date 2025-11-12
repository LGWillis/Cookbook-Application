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
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-2xl mb-4">
            <span className="text-3xl">🔐</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to your Cookbook account</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-accent-danger/20 border border-accent-danger/50 rounded-lg">
            <p className="text-accent-danger text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Username Field */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full px-4 py-3 bg-dark-surface border border-dark-surface-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 transition-all duration-250"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 bg-dark-surface border border-dark-surface-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 transition-all duration-250"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-accent-primary to-accent-secondary text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-250 mt-2"
          >
            Sign In
          </button>
        </form>

        {/* Register Link */}
        <p className="text-center text-gray-400 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-accent-primary hover:text-accent-secondary transition-colors duration-250 font-medium">
            Create one
          </Link>
        </p>

        {/* Back to Home */}
        <div className="text-center mt-4">
          <Link to="/" className="text-sm text-gray-500 hover:text-gray-300 transition-colors duration-250">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}

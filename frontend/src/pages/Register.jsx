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
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-2xl mb-4">
            <span className="text-3xl">👨‍🍳</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Join Cookbook</h1>
          <p className="text-gray-400">Create your account to get started</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-accent-danger/20 border border-accent-danger/50 rounded-lg">
            <p className="text-accent-danger text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Username Field */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={form.username}
              onChange={update('username')}
              placeholder="Choose a username"
              className="w-full px-4 py-3 bg-dark-surface border border-dark-surface-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 transition-all duration-250"
              required
            />
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={update('email')}
              placeholder="Enter your email"
              className="w-full px-4 py-3 bg-dark-surface border border-dark-surface-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 transition-all duration-250"
              required
            />
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-gray-300 mb-2">
                First Name
              </label>
              <input
                id="first_name"
                type="text"
                value={form.first_name}
                onChange={update('first_name')}
                placeholder="First name"
                className="w-full px-4 py-3 bg-dark-surface border border-dark-surface-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 transition-all duration-250"
              />
            </div>
            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-gray-300 mb-2">
                Last Name
              </label>
              <input
                id="last_name"
                type="text"
                value={form.last_name}
                onChange={update('last_name')}
                placeholder="Last name"
                className="w-full px-4 py-3 bg-dark-surface border border-dark-surface-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 transition-all duration-250"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={update('password')}
              placeholder="Create a strong password"
              className="w-full px-4 py-3 bg-dark-surface border border-dark-surface-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 transition-all duration-250"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-accent-primary to-accent-secondary text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-250 mt-2"
          >
            Create Account
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-gray-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-accent-primary hover:text-accent-secondary transition-colors duration-250 font-medium">
            Sign in
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

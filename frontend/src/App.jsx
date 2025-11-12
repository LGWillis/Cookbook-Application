import { Link, Outlet } from 'react-router-dom'
import './App.css'

export default function App() {
  const isAuthed = Boolean(localStorage.getItem('access'))

  function logout() {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-bg to-dark-surface flex flex-col">
      {/* Modern Navigation Bar */}
      <nav className="bg-dark-surface border-b border-dark-surface-light shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-lg flex items-center justify-center font-bold text-white group-hover:shadow-lg transition-shadow duration-250">
                🍳
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
                Cookbook
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center gap-8">
              <div className="hidden md:flex gap-6">
                <Link
                  to="/"
                  className="text-gray-300 hover:text-accent-primary transition-colors duration-250 font-medium"
                >
                  Home
                </Link>
                <Link
                  to="/recipes"
                  className="text-gray-300 hover:text-accent-primary transition-colors duration-250 font-medium"
                >
                  Recipes
                </Link>
              </div>

              {/* Auth Section */}
              <div className="flex items-center gap-3">
                {!isAuthed ? (
                  <>
                    <Link
                      to="/login"
                      className="px-4 py-2 text-accent-primary hover:text-accent-primary-hover transition-colors duration-250 font-medium"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="px-4 py-2 bg-gradient-to-r from-accent-primary to-accent-secondary text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-250 font-medium"
                    >
                      Register
                    </Link>
                  </>
                ) : (
                  <button
                    onClick={logout}
                    className="px-4 py-2 bg-dark-surface-light hover:bg-accent-danger text-white rounded-lg transition-all duration-250 font-medium"
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}

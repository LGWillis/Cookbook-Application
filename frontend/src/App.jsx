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
    <div>
      <nav style={{ padding: 12, borderBottom: '1px solid #eee', display: 'flex', gap: 12 }}>
        <Link to="/">Home</Link>
        <Link to="/recipes">Recipes</Link>
        {!isAuthed ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <button onClick={logout}>Logout</button>
        )}
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  )
}

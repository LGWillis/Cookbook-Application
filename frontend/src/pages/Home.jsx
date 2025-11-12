import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div style={{ padding: 24 }}>
      <h1>Cookbook</h1>
      <p>
        <Link to="/login">Login</Link> · <Link to="/register">Register</Link> · <Link to="/recipes">Recipes</Link>
      </p>
    </div>
  )
}

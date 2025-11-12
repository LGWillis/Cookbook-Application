import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { RecipesAPI } from '../lib/api'

export default function RecipeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    (async () => {
      try {
        const data = await RecipesAPI.get(id)
        setItem(data)
      } catch (err) {
        setError(err?.data?.detail || 'Failed to load recipe')
      }
    })()
  }, [id])

  async function onDelete() {
    if (!confirm('Delete this recipe?')) return
    try {
      await RecipesAPI.remove(id)
      navigate('/recipes')
    } catch (e) {
      alert('Delete failed')
    }
  }

  if (error) return <div className="max-w-3xl mx-auto p-6 text-red-600">{error}</div>
  if (!item) return <div className="max-w-3xl mx-auto p-6">Loading…</div>

  const ingredients = (item.ingredients || '').split('\n').filter(Boolean)
  const steps = (item.steps || '').split('\n').filter(Boolean)

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{item.title}</h1>
        <div className="flex gap-2">
          <Link to="/recipes" className="px-3 py-1 border rounded">Back</Link>
          <button onClick={onDelete} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
        </div>
      </div>

      {item.image_url && (
        <img src={item.image_url} alt="" className="w-full max-h-[420px] object-cover rounded" />
      )}

      {item.youtube_url && (
        <a className="text-blue-600" href={item.youtube_url} target="_blank" rel="noreferrer">View on YouTube</a>
      )}

      <section>
        <h2 className="text-xl font-medium mb-2">Ingredients</h2>
        <ul className="list-disc pl-6 space-y-1">
          {ingredients.map((line, i) => <li key={i}>{line}</li>)}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-medium mb-2">Steps</h2>
        <ol className="list-decimal pl-6 space-y-1">
          {steps.map((line, i) => <li key={i}>{line}</li>)}
        </ol>
      </section>
    </div>
  )
}

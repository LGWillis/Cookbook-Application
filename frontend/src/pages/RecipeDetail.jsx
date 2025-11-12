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

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center space-y-4">
          <p className="text-accent-danger text-lg">{error}</p>
          <Link to="/recipes" className="inline-block px-6 py-2 bg-accent-primary text-white rounded-lg">
            ← Back to Recipes
          </Link>
        </div>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-400 text-lg">Loading…</p>
        </div>
      </div>
    )
  }

  const ingredients = (item.ingredients || '').split('\n').filter(Boolean)
  const steps = (item.steps || '').split('\n').filter(Boolean)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header with Navigation */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{item.title}</h1>
          {item.description && (
            <p className="text-lg text-gray-300">{item.description}</p>
          )}
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Link
            to="/recipes"
            className="px-4 py-2 bg-dark-surface border border-dark-surface-light text-white rounded-lg hover:border-accent-primary transition-all duration-250 font-medium"
          >
            ← Back
          </Link>
          <button
            onClick={onDelete}
            className="px-4 py-2 bg-accent-danger/20 text-accent-danger border border-accent-danger/50 rounded-lg hover:bg-accent-danger/30 transition-all duration-250 font-medium"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Main Image */}
      {item.image_url && (
        <div className="w-full rounded-2xl overflow-hidden">
          <img
            src={item.image_url}
            alt={item.title}
            className="w-full h-96 object-cover"
          />
        </div>
      )}

      {/* Video Link */}
      {item.youtube_url && (
        <div className="bg-dark-surface border border-dark-surface-light rounded-xl p-6">
          <div className="flex items-center gap-4">
            <span className="text-3xl">▶️</span>
            <div>
              <p className="text-gray-400 text-sm mb-1">Watch on YouTube</p>
              <a
                className="text-accent-primary hover:text-accent-secondary font-semibold text-lg transition-colors duration-250"
                href={item.youtube_url}
                target="_blank"
                rel="noreferrer"
              >
                Open Video Tutorial
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Ingredients and Steps Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Ingredients */}
        <section className="bg-dark-surface rounded-xl p-6 border border-dark-surface-light">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">🥘</span> Ingredients
          </h2>
          {ingredients.length > 0 ? (
            <ul className="space-y-3">
              {ingredients.map((line, i) => (
                <li key={i} className="flex gap-3 text-gray-200">
                  <span className="text-accent-primary flex-shrink-0 mt-0.5">✓</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No ingredients listed</p>
          )}
        </section>

        {/* Steps */}
        <section className="bg-dark-surface rounded-xl p-6 border border-dark-surface-light">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">👨‍🍳</span> Steps
          </h2>
          {steps.length > 0 ? (
            <ol className="space-y-3">
              {steps.map((line, i) => (
                <li key={i} className="flex gap-3 text-gray-200">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary text-white text-xs font-bold flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{line}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-gray-400">No steps listed</p>
          )}
        </section>
      </div>

      {/* CTA Section */}
      <div className="text-center pt-8">
        <Link
          to="/recipes"
          className="inline-block px-8 py-3 bg-gradient-to-r from-accent-primary to-accent-secondary text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-250"
        >
          ← Back to All Recipes
        </Link>
      </div>
    </div>
  )
}

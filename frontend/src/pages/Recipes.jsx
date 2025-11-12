import { useEffect, useState } from 'react'
import { RecipesAPI } from '../lib/api'
import { Link } from 'react-router-dom'

export default function Recipes() {
  const [items, setItems] = useState([])
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const [count, setCount] = useState(0)
  const [form, setForm] = useState({ title: '', description: '', ingredients: '', steps: '', youtube_url: '' })
  const [image, setImage] = useState(null)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)

  async function load(p = page) {
    try {
      const data = await RecipesAPI.list(q, p)
      setItems(data.results || [])
      setCount(data.count || 0)
      setPage(p)
    } catch (err) {
      setError(err?.data?.detail || 'Failed to load recipes')
    }
  }

  useEffect(() => { load(1) }, [])

  async function onSearch(e) {
    e.preventDefault(); await load(1)
  }

  function update(field) {
    return e => setForm({ ...form, [field]: e.target.value })
  }

  async function onCreate(e) {
    e.preventDefault()
    setError('')
    try {
      const fd = new FormData()
      for (const [k, v] of Object.entries(form)) fd.append(k, v)
      if (image) fd.append('image', image)
      await RecipesAPI.create(fd)
      setForm({ title: '', description: '', ingredients: '', steps: '', youtube_url: '' })
      setImage(null)
      setShowForm(false)
      await load(1)
    } catch (err) {
      setError(err?.data?.detail || 'Failed to create recipe')
    }
  }

  async function onDelete(id) {
    if (!confirm('Delete this recipe?')) return
    try {
      await RecipesAPI.remove(id)
      await load(page)
    } catch (err) {
      alert('Delete failed')
    }
  }

  const totalPages = Math.max(1, Math.ceil(count / 10))

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Section */}
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white">Your Recipes</h1>
        <p className="text-gray-400 text-lg">Manage and discover your favorite recipes</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-accent-danger/20 border border-accent-danger/50 rounded-lg">
          <p className="text-accent-danger font-medium">{error}</p>
        </div>
      )}

      {/* Search Section */}
      <form onSubmit={onSearch} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <input
            className="w-full px-4 py-3 bg-dark-surface border border-dark-surface-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 transition-all duration-250"
            placeholder="🔍 Search by title or ingredients..."
            value={q}
            onChange={e => setQ(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-gradient-to-r from-accent-primary to-accent-secondary text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-250"
        >
          Search
        </button>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-dark-surface border border-accent-success text-accent-success rounded-lg font-semibold hover:bg-accent-success/10 transition-all duration-250"
        >
          {showForm ? '✕ Cancel' : '+ New Recipe'}
        </button>
      </form>

      {/* Create Recipe Form */}
      {showForm && (
        <div className="bg-dark-surface border border-dark-surface-light rounded-xl p-6 sm:p-8 shadow-card">
          <h2 className="text-2xl font-bold text-white mb-6">Create New Recipe</h2>
          <form onSubmit={onCreate} className="grid gap-4 max-w-2xl">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Recipe Title *</label>
              <input
                className="w-full px-4 py-3 bg-dark-bg border border-dark-surface-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 transition-all duration-250"
                placeholder="Enter recipe title"
                value={form.title}
                onChange={update('title')}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea
                className="w-full px-4 py-3 bg-dark-bg border border-dark-surface-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 transition-all duration-250 min-h-24 resize-none"
                placeholder="Describe your recipe..."
                value={form.description}
                onChange={update('description')}
              />
            </div>

            {/* Ingredients and Steps */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Ingredients (one per line)</label>
                <textarea
                  className="w-full px-4 py-3 bg-dark-bg border border-dark-surface-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 transition-all duration-250 min-h-32 resize-none"
                  placeholder="• 2 cups flour&#10;• 1 cup sugar&#10;..."
                  value={form.ingredients}
                  onChange={update('ingredients')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Steps (one per line)</label>
                <textarea
                  className="w-full px-4 py-3 bg-dark-bg border border-dark-surface-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 transition-all duration-250 min-h-32 resize-none"
                  placeholder="1. Preheat oven&#10;2. Mix ingredients&#10;..."
                  value={form.steps}
                  onChange={update('steps')}
                />
              </div>
            </div>

            {/* YouTube URL */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">YouTube URL (optional)</label>
              <input
                className="w-full px-4 py-3 bg-dark-bg border border-dark-surface-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 transition-all duration-250"
                placeholder="https://youtube.com/watch?v=..."
                value={form.youtube_url}
                onChange={update('youtube_url')}
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Recipe Image</label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setImage(e.target.files?.[0] || null)}
                  className="hidden"
                  id="image-input"
                />
                <label
                  htmlFor="image-input"
                  className="block w-full px-4 py-3 border-2 border-dashed border-dark-surface-light rounded-lg text-center cursor-pointer hover:border-accent-primary transition-colors duration-250"
                >
                  <span className="text-gray-400">
                    {image ? `📷 ${image.name}` : '📸 Click to upload image'}
                  </span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-accent-success to-accent-primary text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-250 mt-2"
            >
              Create Recipe
            </button>
          </form>
        </div>
      )}

      {/* Recipes Grid */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">
          {count > 0 ? `${count} Recipe${count !== 1 ? 's' : ''}` : 'No recipes found'}
        </h2>
        
        {items.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(r => (
              <Link
                key={r.id}
                to={`/recipes/${r.id}`}
                className="group bg-dark-surface border border-dark-surface-light rounded-xl overflow-hidden hover:border-accent-primary/50 hover:shadow-card transition-all duration-250"
              >
                {/* Image */}
                <div className="relative h-48 bg-dark-bg overflow-hidden">
                  {r.image_thumbnail_url ? (
                    <img
                      src={r.image_thumbnail_url}
                      alt={r.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : r.image_url ? (
                    <img
                      src={r.image_url}
                      alt={r.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">🍽️</div>
                  )}
                  {r.youtube_url && (
                    <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      ▶ Video
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <h3 className="text-lg font-bold text-white group-hover:text-accent-primary transition-colors duration-250 line-clamp-2">
                    {r.title}
                  </h3>
                  
                  {r.description && (
                    <p className="text-sm text-gray-400 line-clamp-2">
                      {r.description}
                    </p>
                  )}

                  {/* Delete Button */}
                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={e => {
                        e.preventDefault()
                        onDelete(r.id)
                      }}
                      className="flex-1 px-3 py-2 bg-accent-danger/20 text-accent-danger rounded-lg hover:bg-accent-danger/30 transition-colors duration-250 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg mb-4">No recipes found</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-block px-6 py-3 bg-gradient-to-r from-accent-primary to-accent-secondary text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-250"
            >
              Create Your First Recipe
            </button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 py-8">
          <button
            disabled={page <= 1}
            onClick={() => load(page - 1)}
            className="px-4 py-2 bg-dark-surface border border-dark-surface-light text-white rounded-lg hover:border-accent-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-250"
          >
            ← Previous
          </button>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => load(p)}
                className={`w-10 h-10 rounded-lg font-semibold transition-all duration-250 ${
                  page === p
                    ? 'bg-gradient-to-r from-accent-primary to-accent-secondary text-white'
                    : 'bg-dark-surface border border-dark-surface-light text-gray-300 hover:border-accent-primary'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            disabled={page >= totalPages}
            onClick={() => load(page + 1)}
            className="px-4 py-2 bg-dark-surface border border-dark-surface-light text-white rounded-lg hover:border-accent-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-250"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}

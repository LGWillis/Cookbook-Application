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
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Your Recipes</h2>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </div>

      <form onSubmit={onSearch} className="flex gap-2">
        <input className="flex-1 border rounded px-3 py-2" placeholder="Search by title or ingredients" value={q} onChange={e => setQ(e.target.value)} />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Search</button>
      </form>

      <div className="bg-white rounded border p-4 shadow-sm">
        <h3 className="text-lg font-medium mb-3">Create Recipe</h3>
        <form onSubmit={onCreate} className="grid gap-3 max-w-xl">
          <input className="border rounded px-3 py-2" placeholder="Title" value={form.title} onChange={update('title')} required />
          <textarea className="border rounded px-3 py-2" placeholder="Description" value={form.description} onChange={update('description')} />
          <textarea className="border rounded px-3 py-2" placeholder="Ingredients (one per line)" value={form.ingredients} onChange={update('ingredients')} />
          <textarea className="border rounded px-3 py-2" placeholder="Steps (one per line)" value={form.steps} onChange={update('steps')} />
          <input className="border rounded px-3 py-2" placeholder="YouTube URL (optional)" value={form.youtube_url} onChange={update('youtube_url')} />
          <input className="border rounded px-3 py-2" type="file" accept="image/*" onChange={e => setImage(e.target.files?.[0] || null)} />
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Add</button>
        </form>
      </div>

      <ul className="grid gap-3">
        {items.map(r => (
          <li key={r.id} className="bg-white border rounded p-3 shadow-sm">
            <div className="flex gap-4">
              {r.image_thumbnail_url ? (
                <Link to={`/recipes/${r.id}`}><img src={r.image_thumbnail_url} alt="" className="w-24 h-24 object-cover rounded" /></Link>
              ) : r.image_url ? (
                <Link to={`/recipes/${r.id}`}><img src={r.image_url} alt="" className="w-24 h-24 object-cover rounded" /></Link>
              ) : (
                <div className="w-24 h-24 bg-gray-100 rounded" />
              )}
              <div className="flex-1">
                <div className="font-semibold"><Link to={`/recipes/${r.id}`}>{r.title}</Link></div>
                {r.youtube_url && (
                  <div><a className="text-blue-600" href={r.youtube_url} target="_blank" rel="noreferrer">YouTube</a></div>
                )}
                <div className="mt-2">
                  <button onClick={() => onDelete(r.id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-2">
        <button disabled={page <= 1} onClick={() => load(page - 1)} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
        <span className="text-sm">Page {page} of {totalPages}</span>
        <button disabled={page >= totalPages} onClick={() => load(page + 1)} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
      </div>
    </div>
  )
}

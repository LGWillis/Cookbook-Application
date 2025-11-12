import { useEffect, useState } from 'react'
import { RecipesAPI } from '../lib/api'

export default function Recipes() {
  const [items, setItems] = useState([])
  const [q, setQ] = useState('')
  const [form, setForm] = useState({ title: '', description: '', ingredients: '', steps: '', youtube_url: '' })
  const [image, setImage] = useState(null)
  const [error, setError] = useState('')

  async function load() {
    try {
      const data = await RecipesAPI.list(q)
      setItems(data)
    } catch (err) {
      setError(err?.data?.detail || 'Failed to load recipes')
    }
  }

  useEffect(() => { load() }, [])

  async function onSearch(e) {
    e.preventDefault(); await load()
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
      await load()
    } catch (err) {
      setError(err?.data?.detail || 'Failed to create recipe')
    }
  }

  async function onDelete(id) {
    if (!confirm('Delete this recipe?')) return
    try {
      await RecipesAPI.remove(id)
      await load()
    } catch (err) {
      alert('Delete failed')
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Your Recipes</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={onSearch} style={{ marginBottom: 16 }}>
        <input placeholder="Search by title or ingredients" value={q} onChange={e => setQ(e.target.value)} />
        <button type="submit" style={{ marginLeft: 8 }}>Search</button>
      </form>

      <div style={{ display: 'grid', gap: 8, marginBottom: 24 }}>
        <h3>Create Recipe</h3>
        <form onSubmit={onCreate} style={{ display: 'grid', gap: 8, maxWidth: 520 }}>
          <input placeholder="Title" value={form.title} onChange={update('title')} required />
          <textarea placeholder="Description" value={form.description} onChange={update('description')} />
          <textarea placeholder="Ingredients (one per line)" value={form.ingredients} onChange={update('ingredients')} />
          <textarea placeholder="Steps (one per line)" value={form.steps} onChange={update('steps')} />
          <input placeholder="YouTube URL (optional)" value={form.youtube_url} onChange={update('youtube_url')} />
          <input type="file" accept="image/*" onChange={e => setImage(e.target.files?.[0] || null)} />
          <button type="submit">Add</button>
        </form>
      </div>

      <ul style={{ display: 'grid', gap: 12, padding: 0, listStyle: 'none' }}>
        {items.map(r => (
          <li key={r.id} style={{ border: '1px solid #eee', padding: 12 }}>
            <div style={{ display: 'flex', gap: 12 }}>
              {r.image_url ? <img src={r.image_url} alt="" style={{ width: 96, height: 96, objectFit: 'cover' }} /> : null}
              <div>
                <strong>{r.title}</strong>
                {r.youtube_url && (
                  <div><a href={r.youtube_url} target="_blank" rel="noreferrer">YouTube</a></div>
                )}
                <div style={{ marginTop: 8 }}>
                  <button onClick={() => onDelete(r.id)}>Delete</button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

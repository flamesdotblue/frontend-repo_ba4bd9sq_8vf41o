import { useEffect, useState } from 'react'
import { Tags, RefreshCw } from 'lucide-react'

export default function AdminDashboard({ baseUrl, token }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchItems = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${baseUrl}/admin/feedbacks`, { headers: { 'Authorization': `Bearer ${token}` } })
      if (!res.ok) throw new Error('Failed to load feedback')
      const data = await res.json()
      setItems(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchItems() }, [])

  const updateItem = async (id, payload) => {
    await fetch(`${baseUrl}/admin/feedbacks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(payload)
    })
    fetchItems()
  }

  const regen = async (id) => {
    await fetch(`${baseUrl}/admin/feedbacks/${id}/suggestion`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    fetchItems()
  }

  if (loading) return <div className="bg-white rounded-xl p-6 shadow">Loading…</div>
  if (error) return <div className="bg-white rounded-xl p-6 shadow text-red-600">{error}</div>

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Admin dashboard</h2>
        <button onClick={fetchItems} className="text-sm text-indigo-600 hover:underline inline-flex items-center gap-1"><RefreshCw size={16}/>Refresh</button>
      </div>
      <div className="space-y-6">
        {items.map(item => (
          <div key={item.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{item.name} <span className="text-gray-500">• {item.email}</span></p>
                <p className="text-gray-800 mt-1">{item.message}</p>
                {item.summary && <p className="text-gray-700 mt-2"><span className="font-semibold">Summary:</span> {item.summary}</p>}
                {item.suggested_response && <p className="text-gray-700 mt-2"><span className="font-semibold">Suggested reply:</span> {item.suggested_response}</p>}
              </div>
              <div className="text-sm">
                <select value={item.status} onChange={(e)=>updateItem(item.id,{ status: e.target.value })} className="border rounded px-2 py-1">
                  <option value="new">new</option>
                  <option value="in_review">in_review</option>
                  <option value="resolved">resolved</option>
                  <option value="archived">archived</option>
                </select>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Tags size={16} className="text-gray-500"/>
              <TagEditor value={item.tags} onChange={(tags)=>updateItem(item.id,{ tags })} />
              <button onClick={()=>regen(item.id)} className="ml-auto text-sm text-indigo-600 hover:underline">Regenerate reply</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TagEditor({ value, onChange }) {
  const [input, setInput] = useState('')
  const tags = value || []
  const add = () => {
    const v = input.trim()
    if (!v) return
    if (!tags.includes(v)) onChange([...tags, v])
    setInput('')
  }
  const remove = (t) => onChange(tags.filter(x => x !== t))
  return (
    <div className="flex flex-wrap items-center gap-2">
      {tags.map(t => (
        <span key={t} className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 rounded-full px-2 py-0.5 text-xs">
          {t}
          <button onClick={()=>remove(t)} className="text-gray-500 hover:text-black">×</button>
        </span>
      ))}
      <input value={input} onChange={(e)=>setInput(e.target.value)} onKeyDown={(e)=>{ if(e.key==='Enter'){ e.preventDefault(); add()} }} placeholder="Add tag" className="border rounded px-2 py-1 text-sm" />
      <button onClick={add} className="text-sm text-indigo-600 hover:underline">Add</button>
    </div>
  )
}

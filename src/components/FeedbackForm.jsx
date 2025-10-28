import { useState } from 'react'
import { Send } from 'lucide-react'

export default function FeedbackForm({ baseUrl, token }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${baseUrl}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ name, email, message })
      })
      if (!res.ok) throw new Error('Failed to submit feedback')
      const data = await res.json()
      setResult(data)
      setName(''); setEmail(''); setMessage('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold mb-2">Send us feedback</h2>
      <p className="text-gray-600 mb-4">We auto-summarize your message and draft a suggested reply.</p>
      <form onSubmit={submit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input value={name} onChange={(e)=>setName(e.target.value)} required placeholder="Your name" className="rounded-md border px-3 py-2 focus:outline-none focus:ring" />
          <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required placeholder="you@example.com" className="rounded-md border px-3 py-2 focus:outline-none focus:ring" />
        </div>
        <textarea value={message} onChange={(e)=>setMessage(e.target.value)} required placeholder="Your message" rows={5} className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring" />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button disabled={loading} className="inline-flex items-center gap-2 rounded-md bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700 disabled:opacity-60"><Send size={16}/>{loading ? 'Submitting…' : 'Submit feedback'}</button>
      </form>
      {result && (
        <div className="mt-6 border-t pt-4">
          <h3 className="font-semibold mb-2">AI summary</h3>
          <p className="text-gray-800 mb-3">{result.summary}</p>
          <h3 className="font-semibold mb-2">Suggested reply</h3>
          <p className="text-gray-800">{result.suggested_response}</p>
        </div>
      )}
    </div>
  )
}

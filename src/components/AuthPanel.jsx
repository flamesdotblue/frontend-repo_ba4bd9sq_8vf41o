import { useState } from 'react'

export default function AuthPanel({ onClose, onAuth, baseUrl }) {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const url = mode === 'login' ? `${baseUrl}/auth/login` : `${baseUrl}/auth/register`
      const body = mode === 'login' ? { email, password } : { name, email, password }
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      if (!res.ok) throw new Error((await res.json()).detail || 'Request failed')
      const data = await res.json()
      onAuth(data)
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-30 bg-black/40 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{mode === 'login' ? 'Login' : 'Create account'}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-black">✕</button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-sm text-gray-600 mb-1">Name</label>
              <input value={name} onChange={(e)=>setName(e.target.value)} required className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring" placeholder="Your name" />
            </div>
          )}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Password</label>
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring" placeholder="••••••••" />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button disabled={loading} className="w-full rounded-md bg-indigo-600 text-white py-2 font-medium hover:bg-indigo-700 disabled:opacity-60">
            {loading ? 'Please wait…' : (mode === 'login' ? 'Login' : 'Register')}
          </button>
        </form>
        <p className="text-sm text-gray-600 mt-4 text-center">
          {mode === 'login' ? (
            <>No account? <button onClick={()=>setMode('register')} className="text-indigo-600 hover:underline">Create one</button></>
          ) : (
            <>Already have an account? <button onClick={()=>setMode('login')} className="text-indigo-600 hover:underline">Login</button></>
          )}
        </p>
      </div>
    </div>
  )
}

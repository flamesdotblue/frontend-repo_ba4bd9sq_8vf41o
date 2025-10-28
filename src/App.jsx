import { useEffect, useMemo, useState } from 'react'
import Navbar from './components/Navbar'
import AuthPanel from './components/AuthPanel'
import FeedbackForm from './components/FeedbackForm'
import AdminDashboard from './components/AdminDashboard'
import PricingBanner from './components/PricingBanner'

export default function App() {
  const BASE_URL = useMemo(() => import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000', [])
  const [showAuth, setShowAuth] = useState(false)
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  })
  const [showAdmin, setShowAdmin] = useState(false)

  const handleAuth = (data) => {
    setToken(data.token)
    const info = { name: data.name, email: data.email, is_admin: data.is_admin, is_premium: data.is_premium }
    setUser(info)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(info))
  }

  const logout = async () => {
    try { await fetch(`${BASE_URL}/auth/logout`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } }) } catch {}
    setToken(''); setUser(null); localStorage.removeItem('token'); localStorage.removeItem('user')
  }

  const upgrade = async () => {
    const res = await fetch(`${BASE_URL}/billing/upgrade`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } })
    if (res.ok) {
      const u = { ...(user||{}), is_premium: true }
      setUser(u)
      localStorage.setItem('user', JSON.stringify(u))
    }
  }

  useEffect(() => {
    if (token && !user) {
      fetch(`${BASE_URL}/auth/me`, { headers: { 'Authorization': `Bearer ${token}` } })
        .then(r => r.ok ? r.json() : null)
        .then(data => { if (data) { setUser(data); localStorage.setItem('user', JSON.stringify(data)) } })
        .catch(()=>{})
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <Navbar user={user} onLogout={logout} onShowAuth={()=>setShowAuth(true)} onToggleAdmin={()=>setShowAdmin(v=>!v)} />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {!user?.is_premium && (
          <PricingBanner onUpgrade={upgrade} />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow p-6">
              <h1 className="text-2xl font-bold">Gather feedback the smart way</h1>
              <p className="text-gray-600 mt-2">Users can submit their thoughts. We summarize every message and draft reply suggestions automatically.</p>
            </div>
            <FeedbackForm baseUrl={BASE_URL} token={token} />
          </div>

          <div className="space-y-6">
            {user?.is_admin ? (
              showAdmin ? (
                <AdminDashboard baseUrl={BASE_URL} token={token} />
              ) : (
                <div className="bg-white rounded-xl p-6 shadow">
                  <h2 className="text-xl font-semibold">Admin dashboard</h2>
                  <p className="text-gray-600 mt-2">Toggle the Admin button in the header to view feedback, assign tags, change status, and regenerate reply suggestions.</p>
                </div>
              )
            ) : (
              <div className="bg-white rounded-xl p-6 shadow">
                <h2 className="text-xl font-semibold">How it works</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-1 mt-2">
                  <li>Login or create an account</li>
                  <li>Submit feedback using the form</li>
                  <li>Admins can review and triage submissions</li>
                </ol>
              </div>
            )}
          </div>
        </div>
      </main>

      {showAuth && (
        <AuthPanel baseUrl={BASE_URL} onAuth={handleAuth} onClose={()=>setShowAuth(false)} />
      )}
    </div>
  )
}

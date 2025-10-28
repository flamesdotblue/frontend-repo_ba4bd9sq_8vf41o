import { LogIn, LogOut, Shield, User, Star } from 'lucide-react'

export default function Navbar({ user, onLogout, onShowAuth, onToggleAdmin }) {
  return (
    <header className="w-full sticky top-0 z-20 bg-white/80 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-indigo-600 text-white font-bold">FB</span>
          <span className="font-semibold">Feedback AI</span>
          {user?.is_admin && (
            <button onClick={onToggleAdmin} className="ml-4 text-sm text-indigo-600 hover:underline inline-flex items-center gap-1"><Shield size={16}/>Admin</button>
          )}
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-gray-600 inline-flex items-center gap-2"><User size={16}/>{user.name} {user.is_premium && <span className="ml-2 inline-flex items-center gap-1 text-amber-600"><Star size={14}/>Premium</span>}</span>
              <button onClick={onLogout} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-gray-900 text-white hover:bg-black"><LogOut size={16}/>Logout</button>
            </>
          ) : (
            <button onClick={onShowAuth} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-gray-900 text-white hover:bg-black"><LogIn size={16}/>Login</button>
          )}
        </div>
      </div>
    </header>
  )
}

import { Star } from 'lucide-react'

export default function PricingBanner({ onUpgrade }) {
  return (
    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border rounded-xl p-5 flex items-center gap-4">
      <div className="h-10 w-10 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center"><Star/></div>
      <div className="flex-1">
        <p className="font-semibold">Go Premium</p>
        <p className="text-sm text-amber-900/80">Faster AI responses and advanced analytics on the admin dashboard.</p>
      </div>
      <button onClick={onUpgrade} className="rounded-md bg-amber-600 text-white px-4 py-2 hover:bg-amber-700">Upgrade</button>
    </div>
  )
}

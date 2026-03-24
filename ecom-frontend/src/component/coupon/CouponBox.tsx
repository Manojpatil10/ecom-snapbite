import { useState } from 'react'
import { useCoupon, VALID_COUPONS } from '../../context/CouponContext'

interface CouponBoxProps {
  cartTotal: number
}

export default function CouponBox({ cartTotal }: CouponBoxProps) {
  const { appliedCoupon, discount, applyCoupon, removeCoupon } = useCoupon()
  const [input, setInput] = useState('')
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)

  function handleApply() {
    if (!input.trim()) return
    const result = applyCoupon(input, cartTotal)
    setMsg({ text: result.message, ok: result.success })
    if (result.success) { setInput(''); setShowSuggestions(false) }
  }

  if (appliedCoupon) {
    return (
      <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-green-600 text-lg">🏷️</span>
          <div>
            <p className="text-sm font-bold text-green-800">{appliedCoupon.code}</p>
            <p className="text-xs text-green-600">You save ₹{discount}</p>
          </div>
        </div>
        <button onClick={removeCoupon} className="text-xs text-red-400 hover:text-red-600 font-semibold transition-colors">
          Remove
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => { setInput(e.target.value); setMsg(null) }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={e => e.key === 'Enter' && handleApply()}
          placeholder="Enter coupon code"
          className="flex-1 h-10 px-3 rounded-xl border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100 uppercase placeholder:normal-case placeholder:text-stone-400 transition-all"
        />
        <button
          onClick={handleApply}
          disabled={!input.trim()}
          className="px-4 h-10 bg-stone-900 text-white text-sm font-semibold rounded-xl hover:bg-stone-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Apply
        </button>
      </div>

      {msg && (
        <p className={`text-xs font-medium px-1 ${msg.ok ? 'text-green-600' : 'text-red-500'}`}>
          {msg.ok ? '✓' : '✕'} {msg.text}
        </p>
      )}

      {/* Available coupons hint */}
      {showSuggestions && !msg && (
        <div className="bg-white border border-stone-100 rounded-xl shadow-md overflow-hidden">
          <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wide px-3 pt-2.5 pb-1">Available Coupons</p>
          {VALID_COUPONS.map(c => (
            <button
              key={c.code}
              onClick={() => { setInput(c.code); setShowSuggestions(false) }}
              className="w-full flex items-center gap-3 px-3 py-2 hover:bg-amber-50 transition-colors text-left"
            >
              <span className="text-xs font-mono font-bold text-stone-800 bg-stone-100 px-2 py-0.5 rounded-md">{c.code}</span>
              <span className="text-xs text-stone-500 flex-1">{c.description}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
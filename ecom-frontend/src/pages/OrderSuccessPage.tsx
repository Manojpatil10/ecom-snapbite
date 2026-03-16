import { useSearchParams, Link } from 'react-router-dom'

const ORDER_STEPS = [
  { label: 'Order Placed', icon: '✅', done: true },
  { label: 'Confirmed', icon: '📦', done: true },
  { label: 'Out for Delivery', icon: '🚚', done: false },
  { label: 'Delivered', icon: '🏠', done: false },
]

export default function OrderSuccessPage() {
  const [params] = useSearchParams()
  const orderId = params.get('id') ?? 'SB000000'

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        {/* Success card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center space-y-6">
          {/* Animated checkmark */}
          <div className="relative w-20 h-20 mx-auto">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-4xl animate-bounce-once">
              🎉
            </div>
          </div>

          <div>
            <h1 className="font-display font-extrabold text-2xl text-stone-900 mb-1">
              Order Placed!
            </h1>
            <p className="text-stone-500 text-sm">
              Your order has been confirmed and is being prepared.
            </p>
          </div>

          {/* Order ID */}
          <div className="bg-stone-50 rounded-xl px-6 py-4 inline-block w-full">
            <p className="text-xs text-stone-400 uppercase tracking-widest mb-1">Order ID</p>
            <p className="font-display font-bold text-xl text-stone-900 tracking-wider">{orderId}</p>
            <p className="text-xs text-stone-400 mt-1">Save this for tracking your order</p>
          </div>

          {/* Tracking steps */}
          <div className="relative">
            <div className="absolute left-5 top-4 bottom-4 w-0.5 bg-stone-100" />
            <div className="space-y-4">
              {ORDER_STEPS.map((s, i) => (
                <div key={i} className="flex items-center gap-4 relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 z-10 ${
                    s.done ? 'bg-emerald-100' : 'bg-stone-100'
                  }`}>
                    {s.icon}
                  </div>
                  <div className="text-left">
                    <p className={`text-sm font-semibold ${s.done ? 'text-stone-900' : 'text-stone-400'}`}>
                      {s.label}
                    </p>
                    {i === 1 && (
                      <p className="text-xs text-stone-400">Expected by tomorrow, 7 PM</p>
                    )}
                  </div>
                  {s.done && (
                    <span className="ml-auto text-emerald-500 text-xs font-semibold">✓ Done</span>
                  )}
                  {i === 2 && (
                    <span className="ml-auto text-amber-500 text-xs font-semibold animate-pulse">Upcoming</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="flex gap-3 pt-2">
            <Link
              to="/"
              className="flex-1 bg-stone-900 hover:bg-stone-700 text-white font-bold py-3 rounded-xl text-sm transition-colors text-center"
            >
              Continue Shopping
            </Link>
            <button
              onClick={() => alert('Order tracking coming soon!')}
              className="flex-1 border border-stone-200 text-stone-600 font-semibold py-3 rounded-xl text-sm hover:bg-stone-50 transition-colors"
            >
              Track Order
            </button>
          </div>
        </div>

        {/* Additional note */}
        <p className="text-center text-xs text-stone-400 mt-4">
          A confirmation will be sent to your registered contact. 🍌
        </p>
      </div>
    </div>
  )
}

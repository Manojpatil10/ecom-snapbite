import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { QtyControl } from '../component/ui'

export default function CartPage() {
  const { state, totalPrice, deliveryFee, savings, removeItem, updateQty, clearCart } = useCart()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const total = totalPrice + deliveryFee

  if (state.items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-5 px-6 text-center">
        <span className="text-7xl">🛒</span>
        <h2 className="font-display font-bold text-2xl text-stone-800">Your cart is empty</h2>
        <p className="text-stone-500 text-sm max-w-xs">Looks like you haven't added anything yet. Explore our fresh bananas and chips!</p>
        <Link to="/" className="bg-stone-900 text-white px-8 py-3 rounded-xl font-semibold hover:bg-stone-700 transition-colors">
          Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display font-bold text-3xl text-stone-900">Your Cart</h1>
        <button
          onClick={() => { clearCart(); addToast('Cart cleared', 'info') }}
          className="text-sm text-stone-400 hover:text-red-500 transition-colors"
        >
          Clear all
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {state.items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-stone-100 p-4 flex gap-4 hover:shadow-md transition-shadow">
              <div className="w-20 h-20 bg-amber-50 rounded-xl flex items-center justify-center text-4xl flex-shrink-0">
                {item.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.slug}`} className="font-bold text-stone-900 hover:text-amber-600 transition-colors text-sm sm:text-base">
                  {item.name}
                </Link>
                <p className="text-xs text-stone-400 mt-0.5">{item.weight}</p>
                <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                  <QtyControl
                    qty={item.qty}
                    onInc={() => updateQty(item.id, item.qty + 1)}
                    onDec={() => updateQty(item.id, item.qty - 1)}
                    size="sm"
                  />
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-stone-900">₹{item.price * item.qty}</span>
                    <button
                      onClick={() => { removeItem(item.id); addToast('Item removed', 'info') }}
                      className="text-stone-300 hover:text-red-400 transition-colors"
                      aria-label="Remove"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-stone-100 p-6 space-y-4 sticky top-24">
            <h3 className="font-display font-bold text-lg text-stone-900">Order Summary</h3>

            {savings > 0 && (
              <div className="bg-emerald-50 rounded-xl px-4 py-3 flex justify-between text-sm">
                <span className="text-emerald-700">🎉 Total savings</span>
                <span className="font-bold text-emerald-700">₹{savings}</span>
              </div>
            )}

            <div className="space-y-3 text-sm border-t border-stone-100 pt-4">
              <div className="flex justify-between text-stone-500">
                <span>Subtotal ({state.items.reduce((s, i) => s + i.qty, 0)} items)</span>
                <span className="font-medium text-stone-800">₹{totalPrice}</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Delivery</span>
                <span className={`font-semibold ${deliveryFee === 0 ? 'text-emerald-600' : ''}`}>
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>
              {deliveryFee > 0 && (
                <p className="text-xs text-amber-600">Add ₹{299 - totalPrice} more for free delivery</p>
              )}
              <div className="flex justify-between font-bold text-stone-900 text-base border-t border-stone-100 pt-3">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-stone-900 hover:bg-stone-700 text-white font-bold py-3.5 rounded-xl text-sm transition-all hover:shadow-lg flex items-center justify-center gap-2"
            >
              Proceed to Checkout
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>

            <Link to="/" className="block text-center text-sm text-stone-500 hover:text-stone-700 transition-colors">
              ← Continue Shopping
            </Link>

            {/* Accepted payments */}
            <div className="border-t border-stone-100 pt-4">
              <p className="text-xs text-stone-400 text-center mb-2">We accept</p>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {['UPI', 'VISA', 'Mastercard', 'COD'].map((p) => (
                  <span key={p} className="text-[10px] font-bold bg-stone-100 text-stone-500 px-2 py-1 rounded">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useCart } from '../../context/CartContext'
import { useToast } from '../../context/ToastContext'
import { useNavigate } from 'react-router-dom'
import { QtyControl } from '../ui'

export default function CartDrawer() {
  const {
    state, cartOpen, setCartOpen,
    totalItems, totalPrice, deliveryFee, savings,
    removeItem, updateQty, clearCart,
  } = useCart()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const total = totalPrice + deliveryFee
  const freeDeliveryThreshold = 299
  const progressPct = Math.min((totalPrice / freeDeliveryThreshold) * 100, 100)

  function handleCheckout() {
    setCartOpen(false)
    navigate('/checkout')
  }

  if (!cartOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={() => setCartOpen(false)}
      />

      {/* Drawer */}
      <aside className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-[420px] bg-white shadow-2xl flex flex-col animate-slide-in-right">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <div>
            <h2 className="font-display font-bold text-xl text-stone-900">Your Cart</h2>
            {totalItems > 0 && (
              <p className="text-xs text-stone-400 mt-0.5">{totalItems} item{totalItems > 1 ? 's' : ''}</p>
            )}
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="w-9 h-9 rounded-xl bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 transition-colors"
            aria-label="Close cart"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Free delivery progress */}
        {totalPrice > 0 && totalPrice < freeDeliveryThreshold && (
          <div className="mx-4 mt-3 bg-amber-50 border border-amber-100 rounded-xl p-3">
            <p className="text-xs text-amber-800 font-medium mb-2">
              Add <span className="font-bold">₹{freeDeliveryThreshold - totalPrice}</span> more for free delivery 🚚
            </p>
            <div className="h-1.5 bg-amber-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}
        {totalPrice >= freeDeliveryThreshold && (
          <div className="mx-4 mt-3 bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-xs text-emerald-700 font-semibold">
            🎉 You've unlocked free delivery!
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {state.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-20 text-center">
              <span className="text-6xl">🛒</span>
              <p className="font-semibold text-stone-700 text-lg">Your cart is empty</p>
              <p className="text-sm text-stone-400">Add some delicious items to get started</p>
              <button
                onClick={() => setCartOpen(false)}
                className="mt-2 bg-stone-900 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-stone-700 transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            state.items.map((item) => (
              <div key={item.id} className="flex gap-3 bg-stone-50 rounded-2xl p-3">
                <div className="w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                  {item.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-stone-900 text-sm leading-snug truncate">{item.name}</p>
                  <p className="text-xs text-stone-400 mt-0.5">{item.weight}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-stone-900 text-sm">₹{item.price * item.qty}</span>
                    <QtyControl
                      qty={item.qty}
                      onInc={() => updateQty(item.id, item.qty + 1)}
                      onDec={() => updateQty(item.id, item.qty - 1)}
                    />
                  </div>
                </div>
                <button
                  onClick={() => { removeItem(item.id); addToast('Item removed', 'info') }}
                  className="w-6 h-6 flex items-center justify-center text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0 mt-0.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {state.items.length > 0 && (
          <div className="border-t border-stone-100 px-5 py-4 space-y-3 bg-stone-50">
            {savings > 0 && (
              <div className="flex items-center justify-between text-sm bg-emerald-50 rounded-xl px-3 py-2">
                <span className="text-emerald-700 font-medium">🎉 You're saving</span>
                <span className="font-bold text-emerald-700">₹{savings}</span>
              </div>
            )}

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-stone-500">
                <span>Subtotal</span>
                <span className="font-medium text-stone-800">₹{totalPrice}</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Delivery</span>
                <span className={`font-semibold ${deliveryFee === 0 ? 'text-emerald-600' : 'text-stone-800'}`}>
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between text-stone-900 font-bold text-base border-t border-stone-200 pt-2">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-stone-900 hover:bg-stone-700 text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:shadow-lg active:scale-95"
            >
              Proceed to Checkout
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>

            <button
              onClick={() => { clearCart(); addToast('Cart cleared', 'info') }}
              className="w-full text-center text-xs text-stone-400 hover:text-red-500 transition-colors py-1"
            >
              Clear cart
            </button>
          </div>
        )}
      </aside>
    </>
  )
}

import { createContext, useContext, useReducer, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { CartItem, Product } from '../types'

// ── State ─────────────────────────────────────────────
interface CartState {
  items: CartItem[]
  wishlist: number[]
}

type CartAction =
  | { type: 'ADD'; product: Product }
  | { type: 'REMOVE'; id: number }
  | { type: 'UPDATE_QTY'; id: number; qty: number }
  | { type: 'CLEAR' }
  | { type: 'TOGGLE_WISHLIST'; id: number }

// ── Reducer ───────────────────────────────────────────
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const exists = state.items.find((i) => i.id === action.product.id)
      if (exists) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.product.id ? { ...i, qty: i.qty + 1 } : i
          ),
        }
      }
      return { ...state, items: [...state.items, { ...action.product, qty: 1 }] }
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter((i) => i.id !== action.id) }
    case 'UPDATE_QTY':
      if (action.qty < 1)
        return { ...state, items: state.items.filter((i) => i.id !== action.id) }
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.id ? { ...i, qty: action.qty } : i
        ),
      }
    case 'CLEAR':
      return { ...state, items: [] }
    case 'TOGGLE_WISHLIST': {
      const has = state.wishlist.includes(action.id)
      return {
        ...state,
        wishlist: has
          ? state.wishlist.filter((id) => id !== action.id)
          : [...state.wishlist, action.id],
      }
    }
    default:
      return state
  }
}

// ── Context ───────────────────────────────────────────
interface CartContextValue {
  state: CartState
  dispatch: React.Dispatch<CartAction>
  cartOpen: boolean
  setCartOpen: (v: boolean) => void
  totalItems: number
  totalPrice: number
  deliveryFee: number
  savings: number
  addItem: (product: Product) => void
  removeItem: (id: number) => void
  updateQty: (id: number, qty: number) => void
  isInCart: (id: number) => boolean
  isWishlisted: (id: number) => boolean
  toggleWishlist: (id: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], wishlist: [] })
  const [cartOpen, setCartOpen] = useState(false)

  const totalItems = state.items.reduce((s, i) => s + i.qty, 0)
  const totalPrice = state.items.reduce((s, i) => s + i.price * i.qty, 0)
  const deliveryFee = totalPrice === 0 ? 0 : totalPrice >= 299 ? 0 : 40
  const savings = state.items.reduce(
    (s, i) => s + (i.originalPrice - i.price) * i.qty,
    0
  )

  const addItem = useCallback((product: Product) => dispatch({ type: 'ADD', product }), [])
  const removeItem = useCallback((id: number) => dispatch({ type: 'REMOVE', id }), [])
  const updateQty = useCallback(
    (id: number, qty: number) => dispatch({ type: 'UPDATE_QTY', id, qty }),
    []
  )
  const isInCart = useCallback(
    (id: number) => state.items.some((i) => i.id === id),
    [state.items]
  )
  const isWishlisted = useCallback(
    (id: number) => state.wishlist.includes(id),
    [state.wishlist]
  )
  const toggleWishlist = useCallback(
    (id: number) => dispatch({ type: 'TOGGLE_WISHLIST', id }),
    []
  )
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR' }), [])

  return (
    <CartContext.Provider
      value={{
        state,
        dispatch,
        cartOpen,
        setCartOpen,
        totalItems,
        totalPrice,
        deliveryFee,
        savings,
        addItem,
        removeItem,
        updateQty,
        isInCart,
        isWishlisted,
        toggleWishlist,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}

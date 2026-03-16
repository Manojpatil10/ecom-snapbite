import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useToast } from '../../context/ToastContext'
import { Badge, Stars, QtyControl } from '../ui'
import type { Product } from '../../types'

interface Props {
  product: Product
  className?: string
}

export default function ProductCard({ product, className = '' }: Props) {
  const { addItem, updateQty, isInCart, isWishlisted, toggleWishlist, state } = useCart()
  const { addToast } = useToast()
  const cartItem = state.items.find((i) => i.id === product.id)
  const wishlisted = isWishlisted(product.id)
  const inCart = isInCart(product.id)

  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  )

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault()
    addItem(product)
    addToast(`${product.name} added to cart 🛒`)
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault()
    toggleWishlist(product.id)
    addToast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist ❤️', wishlisted ? 'info' : 'success')
  }

  function handleInc(e: React.MouseEvent) {
    e.preventDefault()
    if (cartItem) updateQty(product.id, cartItem.qty + 1)
  }

  function handleDec(e: React.MouseEvent) {
    e.preventDefault()
    if (cartItem) updateQty(product.id, cartItem.qty - 1)
  }

  return (
    <Link
      to={`/products/${product.slug}`}
      className={`group bg-white rounded-2xl border border-stone-100 overflow-hidden hover:shadow-xl hover:border-transparent hover:-translate-y-1 transition-all duration-300 flex flex-col ${className}`}
    >
      {/* Image area */}
      <div className="relative h-44 bg-gradient-to-br from-stone-50 to-amber-50 flex items-center justify-center overflow-hidden">
        <span className="text-7xl leading-none transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6 filter drop-shadow-md">
          {product.emoji}
        </span>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.badge && (
            <Badge label={product.badge} color={product.badgeColor} />
          )}
          {discount > 0 && (
            <Badge label={`${discount}% OFF`} color="coral" />
          )}
        </div>

        {/* Out of stock overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="bg-stone-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
              Out of Stock
            </span>
          </div>
        )}

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-base hover:scale-110 transition-transform"
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {wishlisted ? '❤️' : '🤍'}
        </button>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="text-[10px] text-stone-400 font-semibold uppercase tracking-widest">
          {product.weight}
        </div>

        <h3 className="font-display font-bold text-stone-900 text-[15px] leading-snug line-clamp-2">
          {product.name}
        </h3>

        <div className="flex items-center gap-1.5">
          <Stars rating={product.rating} />
          <span className="text-xs font-semibold text-stone-700">{product.rating}</span>
          <span className="text-xs text-stone-400">({product.reviews.toLocaleString()})</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {product.tags.slice(0, 2).map((t) => (
            <span key={t} className="px-2 py-0.5 bg-stone-100 text-stone-500 rounded-full text-[10px] font-medium">
              {t}
            </span>
          ))}
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-stone-100">
          <div className="flex items-baseline gap-1.5">
            <span className="font-display font-bold text-stone-900 text-lg">₹{product.price}</span>
            <span className="text-xs text-stone-400 line-through">₹{product.originalPrice}</span>
          </div>

          {product.inStock ? (
            inCart && cartItem ? (
              <QtyControl
                qty={cartItem.qty}
                onInc={handleInc}
                onDec={handleDec}
              />
            ) : (
              <button
                onClick={handleAdd}
                className="bg-stone-900 hover:bg-stone-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all hover:shadow-md active:scale-95"
              >
                + Add
              </button>
            )
          ) : (
            <button
              onClick={(e) => e.preventDefault()}
              className="text-xs font-semibold px-3 py-2 rounded-xl bg-stone-100 text-stone-400 cursor-not-allowed"
              disabled
            >
              Notify Me
            </button>
          )}
        </div>
      </div>
    </Link>
  )
}

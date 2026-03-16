import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import ProductCard from '../component/products/ProductCard'
import { products } from '../data/products'

export default function WishlistPage() {
  const { state } = useCart()
  const { addToast } = useToast()

  const wishlisted = products.filter((p) => state.wishlist.includes(p.id))

  if (wishlisted.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-5 px-6 text-center">
        <span className="text-7xl">🤍</span>
        <h2 className="font-display font-bold text-2xl text-stone-800">Your wishlist is empty</h2>
        <p className="text-stone-500 text-sm max-w-xs">
          Tap the heart icon on any product to save it here for later.
        </p>
        <Link
          to="/"
          className="bg-stone-900 text-white px-8 py-3 rounded-xl font-semibold hover:bg-stone-700 transition-colors"
        >
          Explore Products
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl text-stone-900">My Wishlist</h1>
          <p className="text-stone-500 text-sm mt-1">{wishlisted.length} saved item{wishlisted.length > 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {wishlisted.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  )
}

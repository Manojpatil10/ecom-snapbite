// import { useState } from 'react'
// import { useParams, Link, useNavigate } from 'react-router-dom'
// import { products } from '../data/products'
// import { useCart } from '../context/CartContext'
// import { useToast } from '../context/ToastContext'
// import { Badge, Stars, QtyControl } from '../component/ui'
// import ProductCard from '../component/products/ProductCard'

// type Tab = 'description' | 'nutrition' | 'delivery'

// export default function ProductPage() {
//   const { slug } = useParams<{ slug: string }>()
//   const navigate = useNavigate()
//   const product = products.find((p) => p.slug === slug)

//   const { addItem, updateQty, isInCart, isWishlisted, toggleWishlist, state } = useCart()
//   const { addToast } = useToast()
//   const [qty, setQty] = useState(1)
//   const [tab, setTab] = useState<Tab>('description')

//   if (!product) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-6">
//         <span className="text-6xl">😕</span>
//         <h2 className="font-display font-bold text-2xl text-stone-800">Product not found</h2>
//         <Link to="/" className="bg-stone-900 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-stone-700">
//           Back to Shop
//         </Link>
//       </div>
//     )
//   }

//   const cartItem = state.items.find((i) => i.id === product.id)
//   const wishlisted = isWishlisted(product.id)
//   const inCart = isInCart(product.id)
//   const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
//   const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)

//   function handleAdd() {
//     for (let i = 0; i < qty; i++) addItem(product)
//     addToast(`${qty}× ${product.name} added to cart 🛒`)
//   }

//   function handleBuyNow() {
//     for (let i = 0; i < qty; i++) addItem(product)
//     navigate('/checkout')
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-6 py-8">

//       {/* Breadcrumb */}
//       <nav className="flex items-center gap-2 text-xs text-stone-400 mb-8">
//         <Link to="/" className="hover:text-stone-600">Home</Link>
//         <span>›</span>
//         <Link to={`/?cat=${product.category}`} className="hover:text-stone-600 capitalize">{product.category}</Link>
//         <span>›</span>
//         <span className="text-stone-600">{product.name}</span>
//       </nav>

//       <div className="grid md:grid-cols-2 gap-10 lg:gap-16">

//         {/* Image panel */}
//         <div className="space-y-4">
//           <div className="bg-gradient-to-br from-stone-50 to-amber-50 rounded-3xl flex items-center justify-center h-72 sm:h-96 relative overflow-hidden">
//             <span className="text-[130px] sm:text-[160px] leading-none filter drop-shadow-2xl animate-float">
//               {product.emoji}
//             </span>
//             <div className="absolute top-4 left-4 flex flex-col gap-2">
//               {product.badge && <Badge label={product.badge} color={product.badgeColor} />}
//               {discount > 0 && <Badge label={`${discount}% OFF`} color="coral" />}
//             </div>
//           </div>

//           {/* Share / wishlist row */}
//           <div className="flex gap-3">
//             <button
//               onClick={() => { toggleWishlist(product.id); addToast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist ❤️', wishlisted ? 'info' : 'success') }}
//               className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
//                 wishlisted
//                   ? 'border-red-300 bg-red-50 text-red-600'
//                   : 'border-stone-200 text-stone-600 hover:border-stone-400'
//               }`}
//             >
//               {wishlisted ? '❤️ Wishlisted' : '🤍 Wishlist'}
//             </button>
//             <button
//               onClick={() => { navigator.clipboard.writeText(window.location.href); addToast('Link copied!', 'info') }}
//               className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-stone-200 text-stone-600 text-sm font-semibold hover:border-stone-400 transition-all"
//             >
//               🔗 Share
//             </button>
//           </div>
//         </div>

//         {/* Info panel */}
//         <div className="space-y-5">
//           <div>
//             <p className="text-xs text-stone-400 uppercase tracking-widest font-semibold mb-1">
//               {product.category} · {product.weight}
//             </p>
//             <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-stone-900 leading-tight">
//               {product.name}
//             </h1>
//           </div>

//           {/* Rating */}
//           <div className="flex items-center gap-2">
//             <Stars rating={product.rating} size="md" />
//             <span className="font-bold text-stone-800">{product.rating}</span>
//             <span className="text-stone-400 text-sm">({product.reviews.toLocaleString()} reviews)</span>
//           </div>

//           {/* Price */}
//           <div className="flex items-baseline gap-3">
//             <span className="font-display font-extrabold text-4xl text-stone-900">₹{product.price}</span>
//             <span className="text-stone-400 text-lg line-through">₹{product.originalPrice}</span>
//             <span className="text-emerald-600 font-bold text-sm bg-emerald-50 px-2 py-0.5 rounded-lg">
//               Save ₹{product.originalPrice - product.price}
//             </span>
//           </div>

//           {/* Tags */}
//           <div className="flex flex-wrap gap-2">
//             {product.tags.map((t) => (
//               <span key={t} className="px-3 py-1 bg-stone-100 text-stone-600 rounded-full text-xs font-medium">
//                 #{t}
//               </span>
//             ))}
//           </div>

//           {/* Tabs */}
//           <div className="border-b border-stone-200">
//             <div className="flex gap-0">
//               {(['description', 'nutrition', 'delivery'] as Tab[]).map((t) => (
//                 <button
//                   key={t}
//                   onClick={() => setTab(t)}
//                   className={`px-4 py-2.5 text-sm font-semibold capitalize border-b-2 transition-all -mb-px ${
//                     tab === t
//                       ? 'border-stone-900 text-stone-900'
//                       : 'border-transparent text-stone-400 hover:text-stone-600'
//                   }`}
//                 >
//                   {t}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="text-sm text-stone-600 leading-relaxed min-h-[80px]">
//             {tab === 'description' && <p>{product.longDescription}</p>}
//             {tab === 'nutrition' && (
//               product.nutrition ? (
//                 <div className="grid grid-cols-3 gap-3">
//                   {Object.entries(product.nutrition).map(([k, v]) => (
//                     <div key={k} className="bg-stone-50 rounded-xl p-3 text-center">
//                       <div className="font-bold text-stone-900 text-lg">{v}</div>
//                       <div className="text-xs text-stone-400 capitalize mt-0.5">{k}</div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-stone-400 italic">Nutritional info not available for combo packs.</p>
//               )
//             )}
//             {tab === 'delivery' && (
//               <ul className="space-y-2">
//                 {[
//                   '🚚 Free delivery on orders above ₹299',
//                   '⚡ Same-day delivery for orders placed before 2 PM',
//                   '📦 Eco-friendly, temperature-controlled packaging',
//                   '↩️ Easy 24-hour return policy for damaged items',
//                   '📍 Delivery available across all major Indian cities',
//                 ].map((line) => (
//                   <li key={line} className="flex items-start gap-2">{line}</li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           {/* Stock indicator */}
//           {product.inStock && product.stock < 50 && (
//             <div className="flex items-center gap-2 text-sm">
//               <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
//               <span className="text-orange-600 font-medium">Only {product.stock} left in stock!</span>
//             </div>
//           )}
//           {!product.inStock && (
//             <div className="flex items-center gap-2 text-sm">
//               <span className="w-2 h-2 rounded-full bg-red-500" />
//               <span className="text-red-500 font-medium">Out of stock</span>
//             </div>
//           )}

//           {/* Qty + CTA */}
//           {product.inStock ? (
//             <div className="space-y-3 pt-2">
//               {inCart && cartItem ? (
//                 <div className="flex items-center gap-4">
//                   <QtyControl
//                     qty={cartItem.qty}
//                     onInc={() => updateQty(product.id, cartItem.qty + 1)}
//                     onDec={() => updateQty(product.id, cartItem.qty - 1)}
//                     size="md"
//                   />
//                   <span className="text-sm text-emerald-600 font-semibold">✓ In your cart</span>
//                 </div>
//               ) : (
//                 <div className="flex items-center gap-3">
//                   <span className="text-sm text-stone-500 font-medium">Qty:</span>
//                   <QtyControl
//                     qty={qty}
//                     onInc={() => setQty((q) => q + 1)}
//                     onDec={() => setQty((q) => Math.max(1, q - 1))}
//                     size="md"
//                   />
//                 </div>
//               )}
//               <div className="flex gap-3">
//                 <button
//                   onClick={handleAdd}
//                   className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-900 font-bold py-3.5 rounded-xl text-sm transition-colors border border-stone-200 hover:border-stone-300"
//                 >
//                   Add to Cart
//                 </button>
//                 <button
//                   onClick={handleBuyNow}
//                   className="flex-1 bg-stone-900 hover:bg-stone-700 text-white font-bold py-3.5 rounded-xl text-sm transition-all hover:shadow-lg"
//                 >
//                   Buy Now
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <button
//               disabled
//               className="w-full bg-stone-100 text-stone-400 font-bold py-3.5 rounded-xl text-sm cursor-not-allowed"
//             >
//               Out of Stock — Notify Me
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Related products */}
//       {related.length > 0 && (
//         <section className="mt-20">
//           <h2 className="font-display font-bold text-2xl text-stone-900 mb-6">You Might Also Like</h2>
//           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
//             {related.map((p) => <ProductCard key={p.id} product={p} />)}
//           </div>
//         </section>
//       )}
//     </div>
//   )
// }




import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { products } from '../data/products'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { Badge, Stars, QtyControl } from '../component/ui'
import ProductCard from '../component/products/ProductCard'
import ProductReviews from '../component/review/ProductReviews'

type Tab = 'description' | 'nutrition' | 'delivery'

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  // const product = products.find((p) => p.slug === slug)
  const foundProduct = products.find((p) => p.slug === slug)

  const { addItem, updateQty, isInCart, isWishlisted, toggleWishlist, state } = useCart()
  const { addToast } = useToast()
  const [qty, setQty] = useState(1)
  const [tab, setTab] = useState<Tab>('description')

  // if (!product) {
  //   return (
  //     <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-6">
  //       <span className="text-6xl">😕</span>
  //       <h2 className="font-display font-bold text-2xl text-stone-800">Product not found</h2>
  //       <Link to="/" className="bg-stone-900 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-stone-700">
  //         Back to Shop
  //       </Link>
  //     </div>
  //   )
  // }

  if (!foundProduct) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-6">
        <span className="text-6xl">😕</span>
        <h2 className="font-display font-bold text-2xl text-stone-800">Product not found</h2>
        <Link to="/" className="bg-stone-900 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-stone-700">
          Back to Shop
        </Link>
      </div>
    )
  }

  const product = foundProduct
  const cartItem = state.items.find((i) => i.id === product.id)
  const wishlisted = isWishlisted(product.id)
  const inCart = isInCart(product.id)
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)

  function handleAdd() {
    for (let i = 0; i < qty; i++) addItem(product)
    addToast(`${qty}× ${product.name} added to cart 🛒`)
  }

  function handleBuyNow() {
    for (let i = 0; i < qty; i++) addItem(product)
    navigate('/checkout')
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 pb-28 sm:pb-8">

      {/* ── Sticky mobile bottom bar ── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-white/95 backdrop-blur border-t border-stone-100 px-4 py-3 flex items-center gap-3 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
        <div className="flex-1 min-w-0">
          <p className="font-bold text-stone-900 text-sm truncate">{product.name}</p>
          <p className="text-amber-600 font-semibold text-sm">₹{product.price}</p>
        </div>
        {product.inStock ? (
          <button
            onClick={inCart ? () => navigate('/cart') : handleAdd}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 ${inCart
              ? 'bg-emerald-600 text-white'
              : 'bg-stone-900 text-white hover:bg-stone-700'
              }`}
          >
            {inCart ? '✓ In Cart' : 'Add to Cart'}
          </button>
        ) : (
          <button disabled className="px-5 py-2.5 rounded-xl font-bold text-sm bg-stone-100 text-stone-400 cursor-not-allowed">
            Out of Stock
          </button>
        )}
      </div>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-stone-400 mb-8">
        <Link to="/" className="hover:text-stone-600">Home</Link>
        <span>›</span>
        <Link to={`/?cat=${product.category}`} className="hover:text-stone-600 capitalize">{product.category}</Link>
        <span>›</span>
        <span className="text-stone-600">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10 lg:gap-16">

        {/* Image panel */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-stone-50 to-amber-50 rounded-3xl flex items-center justify-center h-72 sm:h-96 relative overflow-hidden">
            <span className="text-[130px] sm:text-[160px] leading-none filter drop-shadow-2xl animate-float">
              {product.emoji}
            </span>
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.badge && (
                <Badge
                  label={product.badge}
                  {...(product.badgeColor ? { color: product.badgeColor } : {})}
                />
              )}
              {discount > 0 && <Badge label={`${discount}% OFF`} color="coral" />}
            </div>
          </div>

          {/* Share / wishlist row */}
          <div className="flex gap-3">
            <button
              onClick={() => { toggleWishlist(product.id); addToast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist ❤️', wishlisted ? 'info' : 'success') }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${wishlisted
                ? 'border-red-300 bg-red-50 text-red-600'
                : 'border-stone-200 text-stone-600 hover:border-stone-400'
                }`}
            >
              {wishlisted ? '❤️ Wishlisted' : '🤍 Wishlist'}
            </button>
            <button
              onClick={() => { navigator.clipboard.writeText(window.location.href); addToast('Link copied!', 'info') }}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-stone-200 text-stone-600 text-sm font-semibold hover:border-stone-400 transition-all"
            >
              🔗 Share
            </button>
          </div>
        </div>

        {/* Info panel */}
        <div className="space-y-5">
          <div>
            <p className="text-xs text-stone-400 uppercase tracking-widest font-semibold mb-1">
              {product.category} · {product.weight}
            </p>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-stone-900 leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <Stars rating={product.rating} size="md" />
            <span className="font-bold text-stone-800">{product.rating}</span>
            <span className="text-stone-400 text-sm">({product.reviews.toLocaleString()} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="font-display font-extrabold text-4xl text-stone-900">₹{product.price}</span>
            <span className="text-stone-400 text-lg line-through">₹{product.originalPrice}</span>
            <span className="text-emerald-600 font-bold text-sm bg-emerald-50 px-2 py-0.5 rounded-lg">
              Save ₹{product.originalPrice - product.price}
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {product.tags.map((t) => (
              <span key={t} className="px-3 py-1 bg-stone-100 text-stone-600 rounded-full text-xs font-medium">
                #{t}
              </span>
            ))}
          </div>

          {/* Tabs */}
          <div className="border-b border-stone-200">
            <div className="flex gap-0">
              {(['description', 'nutrition', 'delivery'] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-4 py-2.5 text-sm font-semibold capitalize border-b-2 transition-all -mb-px ${tab === t
                    ? 'border-stone-900 text-stone-900'
                    : 'border-transparent text-stone-400 hover:text-stone-600'
                    }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="text-sm text-stone-600 leading-relaxed min-h-[80px]">
            {tab === 'description' && <p>{product.longDescription}</p>}
            {tab === 'nutrition' && (
              product.nutrition ? (
                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(product.nutrition).map(([k, v]) => (
                    <div key={k} className="bg-stone-50 rounded-xl p-3 text-center">
                      <div className="font-bold text-stone-900 text-lg">{v}</div>
                      <div className="text-xs text-stone-400 capitalize mt-0.5">{k}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-stone-400 italic">Nutritional info not available for combo packs.</p>
              )
            )}
            {tab === 'delivery' && (
              <ul className="space-y-2">
                {[
                  '🚚 Free delivery on orders above ₹299',
                  '⚡ Same-day delivery for orders placed before 2 PM',
                  '📦 Eco-friendly, temperature-controlled packaging',
                  '↩️ Easy 24-hour return policy for damaged items',
                  '📍 Delivery available across all major Indian cities',
                ].map((line) => (
                  <li key={line} className="flex items-start gap-2">{line}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Stock indicator */}
          {product.inStock && product.stock < 50 && (
            <div className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-orange-600 font-medium">Only {product.stock} left in stock!</span>
            </div>
          )}
          {!product.inStock && (
            <div className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-red-500 font-medium">Out of stock</span>
            </div>
          )}

          {/* Qty + CTA */}
          {product.inStock ? (
            <div className="space-y-3 pt-2">
              {inCart && cartItem ? (
                <div className="flex items-center gap-4">
                  <QtyControl
                    qty={cartItem.qty}
                    onInc={() => updateQty(product.id, cartItem.qty + 1)}
                    onDec={() => updateQty(product.id, cartItem.qty - 1)}
                    size="md"
                  />
                  <span className="text-sm text-emerald-600 font-semibold">✓ In your cart</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-stone-500 font-medium">Qty:</span>
                  <QtyControl
                    qty={qty}
                    onInc={() => setQty((q) => q + 1)}
                    onDec={() => setQty((q) => Math.max(1, q - 1))}
                    size="md"
                  />
                </div>
              )}
              <div className="flex gap-3">
                <button
                  onClick={handleAdd}
                  className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-900 font-bold py-3.5 rounded-xl text-sm transition-colors border border-stone-200 hover:border-stone-300"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-stone-900 hover:bg-stone-700 text-white font-bold py-3.5 rounded-xl text-sm transition-all hover:shadow-lg"
                >
                  Buy Now
                </button>
              </div>
            </div>
          ) : (
            <button
              disabled
              className="w-full bg-stone-100 text-stone-400 font-bold py-3.5 rounded-xl text-sm cursor-not-allowed"
            >
              Out of Stock — Notify Me
            </button>
          )}
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display font-bold text-2xl text-stone-900 mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* Reviews */}
      <ProductReviews productId={product.id} rating={product.rating} reviewCount={product.reviews} />
    </div>
  )
}
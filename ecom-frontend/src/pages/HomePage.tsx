import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import HeroBanner from '../component/home/HeroBanner'
import ProductCard from '../component/products/ProductCard'
import { products, categories, testimonials } from '../data/products'
import { Stars } from '../component/ui'

const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'discount', label: 'Best Discount' },
]

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeCat = searchParams.get('cat') ?? 'all'
  const searchQuery = searchParams.get('q') ?? ''
  const [sortBy, setSortBy] = useState('popular')
  const [priceMax, setPriceMax] = useState(500)

  const featured = products.filter((p) => p.featured)

  const filtered = useMemo(() => {
    let list = [...products]
    if (activeCat !== 'all') list = list.filter((p) => p.category === activeCat)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      )
    }
    list = list.filter((p) => p.price <= priceMax)
    switch (sortBy) {
      case 'price_asc': return list.sort((a, b) => a.price - b.price)
      case 'price_desc': return list.sort((a, b) => b.price - a.price)
      case 'rating': return list.sort((a, b) => b.rating - a.rating)
      case 'discount':
        return list.sort(
          (a, b) =>
            (b.originalPrice - b.price) / b.originalPrice -
            (a.originalPrice - a.price) / a.originalPrice
        )
      default: return list.sort((a, b) => b.reviews - a.reviews)
    }
  }, [activeCat, searchQuery, sortBy, priceMax])

  function setCategory(cat: string) {
    const params = new URLSearchParams(searchParams)
    if (cat === 'all') params.delete('cat')
    else params.set('cat', cat)
    setSearchParams(params)
  }

  const categoryLabel = categories.find((c) => c.id === activeCat)?.name ?? 'All Products'

  return (
    <div>
      {/* Hero */}
      <HeroBanner />

      {/* Feature strip */}
      <div className="bg-stone-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: '🌿', title: '100% Natural', sub: 'No artificial additives' },
            { icon: '🚚', title: 'Free Delivery', sub: 'On orders above ₹299' },
            { icon: '⚡', title: 'Same-Day', sub: 'Order before 2 PM' },
            { icon: '🔒', title: 'Secure Pay', sub: 'UPI, cards, COD' },
          ].map((f) => (
            <div key={f.title} className="flex items-center gap-3">
              <span className="text-2xl">{f.icon}</span>
              <div>
                <div className="font-bold text-sm">{f.title}</div>
                <div className="text-stone-400 text-xs">{f.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      {activeCat === 'all' && !searchQuery && (
        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display font-bold text-2xl text-stone-900">⭐ Featured Products</h2>
              <p className="text-sm text-stone-500 mt-1">Handpicked bestsellers</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* All Products with filters */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                activeCat === cat.id
                  ? 'bg-stone-900 text-white shadow-md'
                  : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-400 hover:text-stone-900'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Filter + sort row */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-white border border-stone-100 rounded-2xl p-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-semibold text-stone-700">
              {searchQuery ? `Results for "${searchQuery}"` : categoryLabel}
              <span className="ml-2 text-xs font-normal text-stone-400">({filtered.length} products)</span>
            </span>
            {searchQuery && (
              <button
                onClick={() => { const p = new URLSearchParams(searchParams); p.delete('q'); setSearchParams(p) }}
                className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
              >
                ✕ Clear search
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Price filter */}
            <div className="flex items-center gap-2 text-sm text-stone-600">
              <span className="font-medium">Max ₹</span>
              <input
                type="range"
                min={30}
                max={500}
                step={10}
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-24 accent-amber-500"
              />
              <span className="font-bold text-stone-800 min-w-[36px]">₹{priceMax}</span>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-stone-200 text-sm text-stone-700 px-3 py-2 rounded-xl focus:outline-none focus:border-amber-400 bg-white"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <span className="text-6xl">🔍</span>
            <h3 className="font-display font-bold text-xl text-stone-800">No products found</h3>
            <p className="text-stone-500 text-sm">Try adjusting your filters or search query</p>
            <button
              onClick={() => { setSearchParams({}); setPriceMax(500) }}
              className="mt-2 bg-stone-900 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-stone-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* Why us */}
      <section className="bg-amber-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="font-display font-bold text-3xl text-stone-900">Why Choose SnapBite?</h2>
            <p className="text-stone-500 mt-2">Because you deserve the freshest, every time</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🌾', title: 'Farm-to-Door', desc: 'Bananas sourced directly from partner farms in Karnataka and Kerala, no middlemen.' },
              { icon: '🏭', title: 'Small-Batch Chips', desc: 'Kettle-cooked in small batches to ensure maximum crunch and flavour in every pack.' },
              { icon: '🧪', title: 'Lab Tested', desc: 'Every batch tested for pesticides and quality before it reaches your doorstep.' },
              { icon: '♻️', title: 'Eco Packaging', desc: 'Biodegradable and minimal packaging to keep our carbon footprint low.' },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-6 shadow-sm border border-amber-100 hover:shadow-md transition-shadow">
                <span className="text-4xl block mb-4">{item.icon}</span>
                <h3 className="font-bold text-stone-900 mb-2">{item.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="font-display font-bold text-3xl text-stone-900">What Our Customers Say</h2>
          <p className="text-stone-500 mt-2">Loved by thousands of happy snackers across India</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-white border border-stone-100 rounded-2xl p-5 hover:shadow-lg transition-shadow flex flex-col gap-3">
              <Stars rating={t.rating} size="md" />
              <p className="text-sm text-stone-600 leading-relaxed flex-1">"{t.text}"</p>
              <div className="flex items-center gap-3 border-t border-stone-100 pt-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${t.avatarBg}`}>
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-sm text-stone-800">{t.name}</div>
                  <div className="text-xs text-stone-400">{t.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-stone-900 py-14">
        <div className="max-w-xl mx-auto px-6 text-center">
          <h2 className="font-display font-bold text-3xl text-white mb-2">Get Fresh Deals</h2>
          <p className="text-stone-400 text-sm mb-6">Subscribe for exclusive offers, new arrivals, and early access to combos.</p>
          <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); alert('Thanks for subscribing!') }}>
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 rounded-xl text-sm bg-stone-800 text-white placeholder:text-stone-500 border border-stone-700 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              required
            />
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold px-5 py-3 rounded-xl text-sm transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}

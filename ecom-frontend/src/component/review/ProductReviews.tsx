import { useState } from 'react'

// ── Types ─────────────────────────────────────────────
interface Review {
  id: number
  author: string
  rating: number
  date: string
  title: string
  body: string
  helpful: number
  verified: boolean
  avatar: string
}

// ── Mock review seeds per product id ─────────────────
const SEED_REVIEWS: Review[] = [
  { id: 1, author: 'Priya S.', rating: 5, date: '2025-03-10', title: 'Absolutely fresh!', body: 'Got them the same day, perfectly ripe. My family loved them. Will definitely order again!', helpful: 12, verified: true, avatar: 'P' },
  { id: 2, author: 'Rahul M.', rating: 4, date: '2025-03-05', title: 'Good quality, fast delivery', body: 'Quality was great. One or two were slightly overripe but overall very happy with the purchase.', helpful: 8, verified: true, avatar: 'R' },
  { id: 3, author: 'Ananya K.', rating: 5, date: '2025-02-28', title: 'Best bananas I\'ve had', body: 'Sweeter than what I get at the local store. Packaging was also very nice and eco-friendly.', helpful: 5, verified: false, avatar: 'A' },
  { id: 4, author: 'Vikram N.', rating: 3, date: '2025-02-20', title: 'Decent but pricey', body: 'Quality is good but I feel the price is a bit high compared to local vendors. Delivery was fast though.', helpful: 3, verified: true, avatar: 'V' },
]

// ── Star renderer ─────────────────────────────────────
function Stars({ rating, size = 'sm', interactive = false, onRate }: {
  rating: number
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  onRate?: (r: number) => void
}) {
  const [hovered, setHovered] = useState(0)
  const sz = size === 'lg' ? 'w-7 h-7' : size === 'md' ? 'w-5 h-5' : 'w-4 h-4'
  const display = interactive ? (hovered || rating) : rating

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg
          key={i}
          className={`${sz} transition-colors ${i <= display ? 'text-amber-400' : 'text-stone-200'} ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          onMouseEnter={() => interactive && setHovered(i)}
          onMouseLeave={() => interactive && setHovered(0)}
          onClick={() => interactive && onRate?.(i)}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

// ── Rating distribution bar ───────────────────────────
function RatingBar({ star, count, total }: { star: number; count: number; total: number }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-stone-500 w-4">{star}</span>
      <svg className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      <div className="flex-1 bg-stone-100 rounded-full h-2">
        <div className="bg-amber-400 h-2 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-stone-400 w-6 text-right">{count}</span>
    </div>
  )
}

// ── Write review form ─────────────────────────────────
function WriteReviewForm({ onSubmit }: { onSubmit: (r: Review) => void }) {
  const [rating, setRating] = useState(0)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  function submit() {
    if (!rating) { setError('Please select a rating'); return }
    if (!title.trim()) { setError('Please add a title'); return }
    if (!body.trim()) { setError('Please write your review'); return }
    if (!name.trim()) { setError('Please enter your name'); return }
    setError('')
    onSubmit({
      id: Date.now(),
      author: name,
      rating,
      date: new Date().toISOString().slice(0, 10),
      title,
      body,
      helpful: 0,
      verified: false,
      avatar: name.charAt(0).toUpperCase(),
    })
    setRating(0); setTitle(''); setBody(''); setName('')
  }

  return (
    <div className="bg-stone-50 rounded-2xl border border-stone-100 p-5 space-y-4">
      <h4 className="font-bold text-stone-900 text-sm">Write a Review</h4>

      <div>
        <p className="text-xs text-stone-500 font-medium mb-2">Your Rating *</p>
        <Stars rating={rating} size="lg" interactive onRate={setRating} />
      </div>

      <div>
        <label className="text-xs text-stone-500 font-medium block mb-1">Your Name *</label>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Priya S."
          className="w-full h-9 px-3 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100" />
      </div>

      <div>
        <label className="text-xs text-stone-500 font-medium block mb-1">Review Title *</label>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Summarise your experience"
          className="w-full h-9 px-3 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100" />
      </div>

      <div>
        <label className="text-xs text-stone-500 font-medium block mb-1">Your Review *</label>
        <textarea value={body} onChange={e => setBody(e.target.value)} rows={3}
          placeholder="Tell others what you liked or disliked…"
          className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100 resize-none" />
      </div>

      {error && <p className="text-xs text-red-500">✕ {error}</p>}

      <button onClick={submit}
        className="w-full py-2.5 bg-stone-900 text-white rounded-xl font-semibold text-sm hover:bg-stone-700 transition-colors">
        Submit Review
      </button>
    </div>
  )
}

// ── Review card ───────────────────────────────────────
function ReviewCard({ review }: { review: Review }) {
  const [helpful, setHelpful] = useState(review.helpful)
  const [voted, setVoted] = useState(false)

  return (
    <div className="bg-white rounded-2xl border border-stone-100 p-5 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 font-bold text-sm flex items-center justify-center flex-shrink-0">
            {review.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-semibold text-stone-800">{review.author}</p>
              {review.verified && (
                <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  ✓ Verified
                </span>
              )}
            </div>
            <p className="text-[11px] text-stone-400">{new Date(review.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
          </div>
        </div>
        <Stars rating={review.rating} size="sm" />
      </div>

      <div>
        <p className="text-sm font-semibold text-stone-800 mb-1">{review.title}</p>
        <p className="text-sm text-stone-600 leading-relaxed">{review.body}</p>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <span className="text-xs text-stone-400">Helpful?</span>
        <button
          disabled={voted}
          onClick={() => { setHelpful(h => h + 1); setVoted(true) }}
          className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg border transition-all ${voted ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-stone-200 text-stone-500 hover:border-stone-400 hover:text-stone-700'}`}
        >
          👍 Yes ({helpful})
        </button>
      </div>
    </div>
  )
}

// ── Main ProductReviews component ─────────────────────
interface ProductReviewsProps {
  productId: number
  rating: number
  reviewCount: number
}

export default function ProductReviews({ productId, rating, reviewCount }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>(SEED_REVIEWS)
  const [showForm, setShowForm] = useState(false)
  const [sort, setSort] = useState<'recent' | 'helpful' | 'high' | 'low'>('recent')
  const [submitted, setSubmitted] = useState(false)

  // Rating distribution
  const dist = [5, 4, 3, 2, 1].map(s => ({
    star: s,
    count: reviews.filter(r => r.rating === s).length
  }))

  const sorted = [...reviews].sort((a, b) => {
    if (sort === 'helpful') return b.helpful - a.helpful
    if (sort === 'high') return b.rating - a.rating
    if (sort === 'low') return a.rating - b.rating
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  function handleNewReview(r: Review) {
    setReviews(prev => [r, ...prev])
    setShowForm(false)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : rating.toFixed(1)

  return (
    <section className="mt-14 space-y-6">
      <h2 className="font-display font-bold text-2xl text-stone-900">Ratings & Reviews</h2>

      {/* Summary row */}
      <div className="bg-white rounded-2xl border border-stone-100 p-5 grid sm:grid-cols-2 gap-6">
        {/* Average */}
        <div className="flex items-center gap-5">
          <div className="text-center">
            <p className="text-5xl font-extrabold text-stone-900 leading-none">{avgRating}</p>
            <Stars rating={Math.round(parseFloat(avgRating))} size="md" />
            <p className="text-xs text-stone-400 mt-1">{reviews.length} reviews</p>
          </div>
          <div className="flex-1 space-y-1.5">
            {dist.map(d => <RatingBar key={d.star} star={d.star} count={d.count} total={reviews.length} />)}
          </div>
        </div>

        {/* Write review CTA */}
        <div className="flex flex-col items-start sm:items-end justify-center gap-3">
          <p className="text-sm text-stone-500">Share your experience with this product</p>
          <button
            onClick={() => setShowForm(v => !v)}
            className="px-5 py-2.5 bg-stone-900 text-white rounded-xl font-semibold text-sm hover:bg-stone-700 transition-colors"
          >
            {showForm ? 'Cancel' : '✏️ Write a Review'}
          </button>
          {submitted && <p className="text-xs text-emerald-600 font-medium">✓ Review submitted, thank you!</p>}
        </div>
      </div>

      {/* Write form */}
      {showForm && <WriteReviewForm onSubmit={handleNewReview} />}

      {/* Sort */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-stone-400 font-medium">Sort by:</span>
        {(['recent', 'helpful', 'high', 'low'] as const).map(s => (
          <button key={s} onClick={() => setSort(s)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-colors ${sort === s ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}>
            {s === 'high' ? 'Highest Rated' : s === 'low' ? 'Lowest Rated' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Review list */}
      <div className="space-y-4">
        {sorted.map(r => <ReviewCard key={r.id} review={r} />)}
      </div>
    </section>
  )
}
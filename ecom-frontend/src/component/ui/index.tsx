// ─── Badge ────────────────────────────────────────────
const badgeStyles: Record<string, string> = {
  amber:  'bg-amber-100 text-amber-700 border border-amber-200',
  coral:  'bg-red-100 text-red-600 border border-red-200',
  green:  'bg-emerald-100 text-emerald-700 border border-emerald-200',
  purple: 'bg-violet-100 text-violet-700 border border-violet-200',
  teal:   'bg-teal-100 text-teal-700 border border-teal-200',
  yellow: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
}

export function Badge({
  label,
  color = 'amber',
  className = '',
}: {
  label: string
  color?: string
  className?: string
}) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wide whitespace-nowrap ${badgeStyles[color] ?? badgeStyles.amber} ${className}`}
    >
      {label}
    </span>
  )
}

// ─── Stars ────────────────────────────────────────────
export function Stars({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const sz = size === 'md' ? 'text-base' : 'text-sm'
  return (
    <div className={`flex gap-0.5 ${sz}`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= Math.round(rating) ? 'text-amber-400' : 'text-stone-200'}>
          ★
        </span>
      ))}
    </div>
  )
}

// ─── QtyControl ───────────────────────────────────────
export function QtyControl({
  qty,
  onInc,
  onDec,
  size = 'sm',
}: {
  qty: number
  onInc: () => void
  onDec: () => void
  size?: 'sm' | 'md'
}) {
  const base =
    size === 'md'
      ? 'flex items-center border-2 border-amber-400 rounded-xl overflow-hidden'
      : 'flex items-center border border-amber-400 rounded-lg overflow-hidden'
  const btn =
    size === 'md'
      ? 'w-9 h-9 flex items-center justify-center text-lg font-bold bg-amber-50 hover:bg-amber-400 hover:text-white transition-colors text-stone-700'
      : 'w-7 h-7 flex items-center justify-center text-sm font-bold bg-amber-50 hover:bg-amber-400 hover:text-white transition-colors text-stone-700'
  const num =
    size === 'md'
      ? 'min-w-[36px] text-center text-sm font-bold text-stone-800'
      : 'min-w-[26px] text-center text-xs font-bold text-stone-800'

  return (
    <div className={base}>
      <button onClick={onDec} className={btn}>−</button>
      <span className={num}>{qty}</span>
      <button onClick={onInc} className={btn}>+</button>
    </div>
  )
}

// ─── Skeleton ─────────────────────────────────────────
export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`bg-stone-200 animate-pulse rounded-lg ${className}`} />
}

// ─── Spinner ──────────────────────────────────────────
export function Spinner() {
  return (
    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
  )
}

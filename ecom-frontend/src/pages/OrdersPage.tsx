// import { useState, useEffect } from 'react'
// import { Link } from 'react-router-dom'

// // ══════════════════════════════════════════════════════
// // ── Types
// // ══════════════════════════════════════════════════════

// type OrderStatus = 'PLACED' | 'CONFIRMED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED'

// interface OrderItem {
//   productId: number
//   productName: string
//   quantity: number
//   price: number
//   imageUrl?: string
// }

// interface Order {
//   id: number
//   orderDate: string
//   status: OrderStatus
//   totalAmount: number
//   items: OrderItem[]
//   deliveryAddress?: string
// }

// // ══════════════════════════════════════════════════════
// // ── Status config
// // ══════════════════════════════════════════════════════

// const STATUS_CONFIG: Record<OrderStatus, {
//   label: string
//   color: string
//   bg: string
//   border: string
//   icon: string
//   step: number
// }> = {
//   PLACED: { label: 'Order Placed', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', icon: '📋', step: 1 },
//   CONFIRMED: { label: 'Confirmed', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200', icon: '✅', step: 2 },
//   PREPARING: { label: 'Preparing', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', icon: '👨‍🍳', step: 3 },
//   OUT_FOR_DELIVERY: { label: 'Out for Delivery', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', icon: '🚴', step: 4 },
//   DELIVERED: { label: 'Delivered', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: '🎉', step: 5 },
//   CANCELLED: { label: 'Cancelled', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', icon: '❌', step: 0 },
// }

// const TRACKER_STEPS: OrderStatus[] = ['PLACED', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED']

// // ══════════════════════════════════════════════════════
// // ── Status Badge
// // ══════════════════════════════════════════════════════

// function StatusBadge({ status }: { status: OrderStatus }) {
//   const cfg = STATUS_CONFIG[status]
//   return (
//     <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.color} ${cfg.bg} ${cfg.border}`}>
//       <span>{cfg.icon}</span>
//       {cfg.label}
//     </span>
//   )
// }

// // ══════════════════════════════════════════════════════
// // ── Progress Tracker
// // ══════════════════════════════════════════════════════

// function OrderTracker({ status }: { status: OrderStatus }) {
//   if (status === 'CANCELLED') return null

//   const currentStep = STATUS_CONFIG[status].step

//   return (
//     <div className="flex items-center gap-0 mt-4">
//       {TRACKER_STEPS.map((s, i) => {
//         const cfg = STATUS_CONFIG[s]
//         const done = cfg.step <= currentStep
//         const active = cfg.step === currentStep
//         const isLast = i === TRACKER_STEPS.length - 1

//         return (
//           <div key={s} className="flex items-center flex-1 last:flex-none">
//             {/* Dot */}
//             <div className="flex flex-col items-center gap-1">
//               <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm border-2 transition-all ${done
//                   ? active
//                     ? 'border-amber-500 bg-amber-500 text-white shadow-md shadow-amber-200'
//                     : 'border-emerald-500 bg-emerald-500 text-white'
//                   : 'border-stone-200 bg-white text-stone-300'
//                 }`}>
//                 {done && !active ? (
//                   <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
//                   </svg>
//                 ) : (
//                   <span className="text-[10px]">{cfg.icon}</span>
//                 )}
//               </div>
//               <span className={`text-[9px] font-medium text-center leading-tight w-14 ${done ? 'text-stone-700' : 'text-stone-400'}`}>
//                 {cfg.label}
//               </span>
//             </div>

//             {/* Connector line */}
//             {!isLast && (
//               <div className={`flex-1 h-0.5 mx-1 mb-4 rounded-full transition-all ${i + 1 < TRACKER_STEPS.length && STATUS_CONFIG[TRACKER_STEPS[i + 1]!].step <= currentStep
//                   ? 'bg-emerald-400'
//                   : 'bg-stone-200'
//                 }`} />
//             )}
//           </div>
//         )
//       })}
//     </div>
//   )
// }

// // ══════════════════════════════════════════════════════
// // ── Order Card
// // ══════════════════════════════════════════════════════

// function OrderCard({ order }: { order: Order }) {
//   const [expanded, setExpanded] = useState(false)

//   const date = new Date(order.orderDate).toLocaleDateString('en-IN', {
//     day: 'numeric', month: 'short', year: 'numeric'
//   })
//   const time = new Date(order.orderDate).toLocaleTimeString('en-IN', {
//     hour: '2-digit', minute: '2-digit'
//   })

//   return (
//     <div className="bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">

//       {/* Header */}
//       <div className="px-5 pt-5 pb-4">
//         <div className="flex items-start justify-between gap-3">
//           <div>
//             <div className="flex items-center gap-2 flex-wrap">
//               <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">
//                 Order #{order.id}
//               </span>
//               <StatusBadge status={order.status} />
//             </div>
//             <p className="text-xs text-stone-400 mt-1">{date} at {time}</p>
//           </div>
//           <div className="text-right flex-shrink-0">
//             <p className="text-base font-bold text-stone-900">₹{order.totalAmount.toFixed(2)}</p>
//             <p className="text-xs text-stone-400">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
//           </div>
//         </div>

//         {/* Tracker */}
//         <OrderTracker status={order.status} />
//       </div>

//       {/* Divider */}
//       <div className="border-t border-stone-100" />

//       {/* Items preview */}
//       <div className="px-5 py-3">
//         <div className="flex items-center gap-2">
//           {/* Stacked product names */}
//           <div className="flex-1 flex flex-wrap gap-1.5">
//             {order.items.slice(0, expanded ? undefined : 2).map((item) => (
//               <span
//                 key={item.productId}
//                 className="inline-flex items-center gap-1 text-xs bg-stone-50 border border-stone-100 text-stone-600 rounded-lg px-2.5 py-1"
//               >
//                 🍌 {item.productName}
//                 <span className="text-stone-400">×{item.quantity}</span>
//               </span>
//             ))}
//             {!expanded && order.items.length > 2 && (
//               <span className="text-xs text-stone-400 self-center">
//                 +{order.items.length - 2} more
//               </span>
//             )}
//           </div>

//           {/* Expand toggle */}
//           <button
//             onClick={() => setExpanded((v) => !v)}
//             className="flex-shrink-0 text-xs text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1"
//           >
//             {expanded ? 'Less' : 'Details'}
//             <svg className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
//             </svg>
//           </button>
//         </div>

//         {/* Expanded detail */}
//         {expanded && (
//           <div className="mt-3 space-y-2">
//             {order.items.map((item) => (
//               <div key={item.productId} className="flex items-center justify-between text-sm">
//                 <div className="flex items-center gap-2">
//                   <span className="text-base">🍌</span>
//                   <div>
//                     <p className="font-medium text-stone-800 text-xs">{item.productName}</p>
//                     <p className="text-[11px] text-stone-400">Qty: {item.quantity}</p>
//                   </div>
//                 </div>
//                 <p className="font-semibold text-stone-700 text-xs">₹{(item.price * item.quantity).toFixed(2)}</p>
//               </div>
//             ))}

//             <div className="border-t border-stone-100 pt-2 flex justify-between text-sm font-bold text-stone-800">
//               <span>Total</span>
//               <span>₹{order.totalAmount.toFixed(2)}</span>
//             </div>

//             {order.deliveryAddress && (
//               <div className="flex items-start gap-2 bg-stone-50 rounded-xl px-3 py-2.5 mt-1">
//                 <svg className="w-4 h-4 text-stone-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z" />
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
//                 </svg>
//                 <p className="text-xs text-stone-600 leading-relaxed">{order.deliveryAddress}</p>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// // ══════════════════════════════════════════════════════
// // ── Empty state
// // ══════════════════════════════════════════════════════

// function EmptyOrders() {
//   return (
//     <div className="flex flex-col items-center justify-center py-20 text-center">
//       <span className="text-6xl mb-4">📦</span>
//       <h2 className="text-xl font-bold text-stone-800 mb-2">No orders yet</h2>
//       <p className="text-stone-500 text-sm mb-6 max-w-xs">
//         Looks like you haven't placed any orders. Start snacking!
//       </p>
//       <Link
//         to="/"
//         className="bg-stone-900 hover:bg-stone-700 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors"
//       >
//         Browse Products →
//       </Link>
//     </div>
//   )
// }

// // ══════════════════════════════════════════════════════
// // ── Filter tabs
// // ══════════════════════════════════════════════════════

// type FilterTab = 'ALL' | 'ACTIVE' | 'DELIVERED' | 'CANCELLED'

// const FILTER_TABS: { key: FilterTab; label: string }[] = [
//   { key: 'ALL', label: 'All' },
//   { key: 'ACTIVE', label: 'Active' },
//   { key: 'DELIVERED', label: 'Delivered' },
//   { key: 'CANCELLED', label: 'Cancelled' },
// ]

// function filterOrders(orders: Order[], tab: FilterTab): Order[] {
//   switch (tab) {
//     case 'ACTIVE':
//       return orders.filter(o => !['DELIVERED', 'CANCELLED'].includes(o.status))
//     case 'DELIVERED':
//       return orders.filter(o => o.status === 'DELIVERED')
//     case 'CANCELLED':
//       return orders.filter(o => o.status === 'CANCELLED')
//     default:
//       return orders
//   }
// }

// // ══════════════════════════════════════════════════════
// // ── OrdersPage
// // ══════════════════════════════════════════════════════

// export function OrdersPage() {
//   const [orders, setOrders] = useState<Order[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [activeTab, setActiveTab] = useState<FilterTab>('ALL')

//   useEffect(() => {
//     async function fetchOrders() {
//       setLoading(true)
//       setError(null)
//       try {
//         const token = localStorage.getItem('token')
//         const res = await fetch('https://ecom-snapbite.onrender.com/api/orders/my', {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         if (!res.ok) throw new Error('Failed to fetch orders')
//         const data: Order[] = await res.json()
//         // Sort newest first
//         data.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
//         setOrders(data)
//       } catch (err: any) {
//         setError(err.message || 'Something went wrong')
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetchOrders()
//   }, [])

//   const filtered = filterOrders(orders, activeTab)

//   const tabCounts: Record<FilterTab, number> = {
//     ALL: orders.length,
//     ACTIVE: filterOrders(orders, 'ACTIVE').length,
//     DELIVERED: filterOrders(orders, 'DELIVERED').length,
//     CANCELLED: filterOrders(orders, 'CANCELLED').length,
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-amber-50 to-stone-100">
//       <div className="max-w-2xl mx-auto px-4 py-8">

//         {/* Page header */}
//         <div className="mb-6">
//           <div className="flex items-center gap-2 mb-1">
//             <Link
//               to="/"
//               className="flex items-center gap-1 text-xs font-medium text-stone-400 hover:text-stone-600 transition-colors"
//             >
//               <span className="text-sm">←</span> Home
//             </Link>
//           </div>
//           <h1 className="text-2xl font-extrabold text-stone-900">My Orders</h1>
//           <p className="text-stone-500 text-sm mt-0.5">
//             {orders.length > 0 ? `${orders.length} order${orders.length !== 1 ? 's' : ''} placed` : 'Track all your orders here'}
//           </p>
//         </div>

//         {/* Filter tabs */}
//         {!loading && orders.length > 0 && (
//           <div className="flex gap-1.5 mb-5 bg-white rounded-2xl p-1.5 shadow-sm border border-stone-100">
//             {FILTER_TABS.map((tab) => (
//               <button
//                 key={tab.key}
//                 onClick={() => setActiveTab(tab.key)}
//                 className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all ${activeTab === tab.key
//                     ? 'bg-stone-900 text-white shadow'
//                     : 'text-stone-500 hover:text-stone-800 hover:bg-stone-50'
//                   }`}
//               >
//                 {tab.label}
//                 {tabCounts[tab.key] > 0 && (
//                   <span className={`text-[10px] font-bold rounded-full px-1.5 py-0.5 ${activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500'
//                     }`}>
//                     {tabCounts[tab.key]}
//                   </span>
//                 )}
//               </button>
//             ))}
//           </div>
//         )}

//         {/* Content */}
//         {loading ? (
//           <div className="flex flex-col items-center justify-center py-20 gap-3">
//             <div className="w-8 h-8 border-2 border-stone-200 border-t-amber-500 rounded-full animate-spin" />
//             <p className="text-sm text-stone-400">Loading your orders…</p>
//           </div>
//         ) : error ? (
//           <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 text-sm text-red-700 flex items-start gap-2.5">
//             <span>⚠️</span>
//             <span>{error}</span>
//           </div>
//         ) : orders.length === 0 ? (
//           <EmptyOrders />
//         ) : filtered.length === 0 ? (
//           <div className="text-center py-16">
//             <p className="text-stone-400 text-sm">No {activeTab.toLowerCase()} orders found.</p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {filtered.map((order) => (
//               <OrderCard key={order.id} order={order} />
//             ))}
//           </div>
//         )}

//       </div>
//     </div>
//   )
// }



import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

// ══════════════════════════════════════════════════════
// ── Types
// ══════════════════════════════════════════════════════

type OrderStatus = 'PLACED' | 'CONFIRMED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED'

interface OrderItem {
  productId: number
  productName: string
  quantity: number
  price: number
  imageUrl?: string
}

interface Order {
  id: number
  orderDate: string
  status: OrderStatus
  totalAmount: number
  items: OrderItem[]
  deliveryAddress?: string
}

// ══════════════════════════════════════════════════════
// ── Status config
// ══════════════════════════════════════════════════════

const STATUS_CONFIG: Record<OrderStatus, {
  label: string
  color: string
  bg: string
  border: string
  icon: string
  step: number
}> = {
  PLACED: { label: 'Order Placed', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', icon: '📋', step: 1 },
  CONFIRMED: { label: 'Confirmed', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200', icon: '✅', step: 2 },
  PREPARING: { label: 'Preparing', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', icon: '👨‍🍳', step: 3 },
  OUT_FOR_DELIVERY: { label: 'Out for Delivery', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', icon: '🚴', step: 4 },
  DELIVERED: { label: 'Delivered', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: '🎉', step: 5 },
  CANCELLED: { label: 'Cancelled', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', icon: '❌', step: 0 },
}

const TRACKER_STEPS: OrderStatus[] = ['PLACED', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED']

// ══════════════════════════════════════════════════════
// ── Status Badge
// ══════════════════════════════════════════════════════

function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.color} ${cfg.bg} ${cfg.border}`}>
      <span>{cfg.icon}</span>
      {cfg.label}
    </span>
  )
}

// ══════════════════════════════════════════════════════
// ── Progress Tracker
// ══════════════════════════════════════════════════════

const STEP_DETAILS: Record<OrderStatus, { time: string; desc: string }> = {
  PLACED: { time: 'Just now', desc: 'Your order has been received and is being reviewed.' },
  CONFIRMED: { time: '+10 min', desc: 'Great! Our team has confirmed your order.' },
  PREPARING: { time: '+30 min', desc: 'Your items are being packed with care.' },
  OUT_FOR_DELIVERY: { time: '+2 hrs', desc: 'Your order is on its way to you!' },
  DELIVERED: { time: '+4 hrs', desc: 'Delivered successfully. Enjoy your snacks! 🎉' },
  CANCELLED: { time: '', desc: 'This order was cancelled.' },
}

function OrderTracker({ status, orderDate }: { status: OrderStatus; orderDate: string }) {
  if (status === 'CANCELLED') return (
    <div className="mt-4 flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
      <span className="text-red-500">❌</span>
      <span className="text-sm text-red-600 font-medium">This order was cancelled.</span>
    </div>
  )

  const currentStep = STATUS_CONFIG[status].step
  const baseTime = new Date(orderDate).getTime()

  return (
    <div className="mt-4 pl-1">
      {TRACKER_STEPS.map((s, i) => {
        const cfg = STATUS_CONFIG[s]
        const done = cfg.step <= currentStep
        const active = cfg.step === currentStep
        const isLast = i === TRACKER_STEPS.length - 1

        return (
          <div key={s} className="flex gap-3">
            {/* Dot + line */}
            <div className="flex flex-col items-center">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm border-2 flex-shrink-0 z-10 transition-all ${active
                ? 'border-amber-500 bg-amber-500 text-white shadow-md shadow-amber-200'
                : done
                  ? 'border-emerald-500 bg-emerald-500 text-white'
                  : 'border-stone-200 bg-white text-stone-300'
                }`}>
                {done && !active
                  ? <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  : <span className="text-[11px]">{cfg.icon}</span>
                }
              </div>
              {!isLast && <div className={`w-0.5 flex-1 my-0.5 ${done && cfg.step < currentStep ? 'bg-emerald-300' : 'bg-stone-100'}`} style={{ minHeight: 24 }} />}
            </div>

            {/* Content */}
            <div className={`pb-4 ${isLast ? '' : ''}`}>
              <p className={`text-sm font-semibold leading-tight ${done ? 'text-stone-800' : 'text-stone-300'}`}>{cfg.label}</p>
              {done && (
                <p className={`text-xs mt-0.5 ${active ? 'text-amber-600 font-medium' : 'text-stone-400'}`}>
                  {STEP_DETAILS[s].desc}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ══════════════════════════════════════════════════════
// ── Order Card
// ══════════════════════════════════════════════════════

function OrderCard({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false)

  const date = new Date(order.orderDate).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
  const time = new Date(order.orderDate).toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit'
  })

  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">

      {/* Header */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                Order #{order.id}
              </span>
              <StatusBadge status={order.status} />
            </div>
            <p className="text-xs text-stone-400 mt-1">{date} at {time}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-base font-bold text-stone-900">₹{order.totalAmount.toFixed(2)}</p>
            <p className="text-xs text-stone-400">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {/* Tracker */}
        <OrderTracker status={order.status} orderDate={order.orderDate} />
      </div>

      {/* Divider */}
      <div className="border-t border-stone-100" />

      {/* Items preview */}
      <div className="px-5 py-3">
        <div className="flex items-center gap-2">
          {/* Stacked product names */}
          <div className="flex-1 flex flex-wrap gap-1.5">
            {order.items.slice(0, expanded ? undefined : 2).map((item) => (
              <span
                key={item.productId}
                className="inline-flex items-center gap-1 text-xs bg-stone-50 border border-stone-100 text-stone-600 rounded-lg px-2.5 py-1"
              >
                🍌 {item.productName}
                <span className="text-stone-400">×{item.quantity}</span>
              </span>
            ))}
            {!expanded && order.items.length > 2 && (
              <span className="text-xs text-stone-400 self-center">
                +{order.items.length - 2} more
              </span>
            )}
          </div>

          {/* Expand toggle */}
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex-shrink-0 text-xs text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1"
          >
            {expanded ? 'Less' : 'Details'}
            <svg className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Expanded detail */}
        {expanded && (
          <div className="mt-3 space-y-2">
            {order.items.map((item) => (
              <div key={item.productId} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-base">🍌</span>
                  <div>
                    <p className="font-medium text-stone-800 text-xs">{item.productName}</p>
                    <p className="text-[11px] text-stone-400">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-semibold text-stone-700 text-xs">₹{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}

            <div className="border-t border-stone-100 pt-2 flex justify-between text-sm font-bold text-stone-800">
              <span>Total</span>
              <span>₹{order.totalAmount.toFixed(2)}</span>
            </div>

            {order.deliveryAddress && (
              <div className="flex items-start gap-2 bg-stone-50 rounded-xl px-3 py-2.5 mt-1">
                <svg className="w-4 h-4 text-stone-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                </svg>
                <p className="text-xs text-stone-600 leading-relaxed">{order.deliveryAddress}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════
// ── Empty state
// ══════════════════════════════════════════════════════

function EmptyOrders() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <span className="text-6xl mb-4">📦</span>
      <h2 className="text-xl font-bold text-stone-800 mb-2">No orders yet</h2>
      <p className="text-stone-500 text-sm mb-6 max-w-xs">
        Looks like you haven't placed any orders. Start snacking!
      </p>
      <Link
        to="/"
        className="bg-stone-900 hover:bg-stone-700 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors"
      >
        Browse Products →
      </Link>
    </div>
  )
}

// ══════════════════════════════════════════════════════
// ── Filter tabs
// ══════════════════════════════════════════════════════

type FilterTab = 'ALL' | 'ACTIVE' | 'DELIVERED' | 'CANCELLED'

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'ALL', label: 'All' },
  { key: 'ACTIVE', label: 'Active' },
  { key: 'DELIVERED', label: 'Delivered' },
  { key: 'CANCELLED', label: 'Cancelled' },
]

function filterOrders(orders: Order[], tab: FilterTab): Order[] {
  switch (tab) {
    case 'ACTIVE':
      return orders.filter(o => !['DELIVERED', 'CANCELLED'].includes(o.status))
    case 'DELIVERED':
      return orders.filter(o => o.status === 'DELIVERED')
    case 'CANCELLED':
      return orders.filter(o => o.status === 'CANCELLED')
    default:
      return orders
  }
}

// ══════════════════════════════════════════════════════
// ── OrdersPage
// ══════════════════════════════════════════════════════

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL')

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true)
      setError(null)
      try {
        const token = localStorage.getItem('token')
        const res = await fetch('https://ecom-snapbite.onrender.com/api/orders/my', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error('Failed to fetch orders')
        const data: Order[] = await res.json()
        // Sort newest first
        data.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
        setOrders(data)
      } catch (err: any) {
        setError(err.message || 'Something went wrong')
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const filtered = filterOrders(orders, activeTab)

  const tabCounts: Record<FilterTab, number> = {
    ALL: orders.length,
    ACTIVE: filterOrders(orders, 'ACTIVE').length,
    DELIVERED: filterOrders(orders, 'DELIVERED').length,
    CANCELLED: filterOrders(orders, 'CANCELLED').length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-stone-100">
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Page header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Link
              to="/"
              className="flex items-center gap-1 text-xs font-medium text-stone-400 hover:text-stone-600 transition-colors"
            >
              <span className="text-sm">←</span> Home
            </Link>
          </div>
          <h1 className="text-2xl font-extrabold text-stone-900">My Orders</h1>
          <p className="text-stone-500 text-sm mt-0.5">
            {orders.length > 0 ? `${orders.length} order${orders.length !== 1 ? 's' : ''} placed` : 'Track all your orders here'}
          </p>
        </div>

        {/* Filter tabs */}
        {!loading && orders.length > 0 && (
          <div className="flex gap-1.5 mb-5 bg-white rounded-2xl p-1.5 shadow-sm border border-stone-100">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all ${activeTab === tab.key
                  ? 'bg-stone-900 text-white shadow'
                  : 'text-stone-500 hover:text-stone-800 hover:bg-stone-50'
                  }`}
              >
                {tab.label}
                {tabCounts[tab.key] > 0 && (
                  <span className={`text-[10px] font-bold rounded-full px-1.5 py-0.5 ${activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500'
                    }`}>
                    {tabCounts[tab.key]}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 border-2 border-stone-200 border-t-amber-500 rounded-full animate-spin" />
            <p className="text-sm text-stone-400">Loading your orders…</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 text-sm text-red-700 flex items-start gap-2.5">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        ) : orders.length === 0 ? (
          <EmptyOrders />
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-stone-400 text-sm">No {activeTab.toLowerCase()} orders found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
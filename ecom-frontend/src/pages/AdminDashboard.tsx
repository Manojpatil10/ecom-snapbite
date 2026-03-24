import { useState, useEffect, JSX } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { products as allProducts } from '../data/products'
import type { Product } from '../types'

// ── Auth guard ────────────────────────────────────────
function getRole(): string | null {
  const token = localStorage.getItem('accessToken')
  if (!token) return null
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    const decoded = JSON.parse(atob(payload))
    return decoded?.role ?? decoded?.roles ?? null
  } catch {
    return null
  }
}

// ── Mock data ─────────────────────────────────────────
const MOCK_ORDERS = [
  { id: 'ORD-1001', customer: 'Priya Sharma', items: 3, total: 347, status: 'delivered', date: '2025-03-20', address: 'Pune, MH' },
  { id: 'ORD-1002', customer: 'Rahul Mehta', items: 1, total: 49, status: 'shipped', date: '2025-03-21', address: 'Mumbai, MH' },
  { id: 'ORD-1003', customer: 'Ananya Reddy', items: 5, total: 612, status: 'confirmed', date: '2025-03-22', address: 'Hyderabad, TS' },
  { id: 'ORD-1004', customer: 'Kiran Patil', items: 2, total: 199, status: 'placed', date: '2025-03-23', address: 'Pune, MH' },
  { id: 'ORD-1005', customer: 'Sneha Joshi', items: 4, total: 488, status: 'shipped', date: '2025-03-23', address: 'Nagpur, MH' },
  { id: 'ORD-1006', customer: 'Vikram Nair', items: 2, total: 158, status: 'delivered', date: '2025-03-19', address: 'Chennai, TN' },
]

const MOCK_CUSTOMERS = [
  { id: 'U001', name: 'Priya Sharma', email: 'priya@example.com', orders: 12, spent: 3840, joined: '2024-08-15', status: 'active' },
  { id: 'U002', name: 'Rahul Mehta', email: 'rahul@example.com', orders: 5, spent: 1250, joined: '2024-11-02', status: 'active' },
  { id: 'U003', name: 'Ananya Reddy', email: 'ananya@example.com', orders: 8, spent: 2100, joined: '2024-09-20', status: 'active' },
  { id: 'U004', name: 'Kiran Patil', email: 'kiran@example.com', orders: 3, spent: 640, joined: '2025-01-10', status: 'inactive' },
  { id: 'U005', name: 'Sneha Joshi', email: 'sneha@example.com', orders: 19, spent: 5670, joined: '2024-07-05', status: 'active' },
]

const WEEKLY_REVENUE = [1200, 1850, 1400, 2100, 1700, 2600, 2200]
const WEEKLY_ORDERS = [14, 22, 17, 28, 21, 33, 27]
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

type SidebarSection = 'overview' | 'products' | 'add-product' | 'orders' | 'create-order' | 'customers' | 'inventory' | 'settings'

// ── Sidebar Items ─────────────────────────────────────
const sidebarItems: { id: SidebarSection; label: string; icon: JSX.Element; badge?: number }[] = [
  {
    id: 'overview', label: 'Overview', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <rect x={3} y={3} width={7} height={7} rx={1} /><rect x={14} y={3} width={7} height={7} rx={1} />
        <rect x={3} y={14} width={7} height={7} rx={1} /><rect x={14} y={14} width={7} height={7} rx={1} />
      </svg>
    )
  },
  {
    id: 'orders', label: 'Orders', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
        <rect x={9} y={3} width={6} height={4} rx={1} /><path strokeLinecap="round" d="M9 12h6M9 16h4" />
      </svg>
    ), badge: 4
  },
  {
    id: 'create-order', label: 'Create Order', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" d="M12 5v14M5 12h14" />
      </svg>
    )
  },
  {
    id: 'products', label: 'Products', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" d="M20 7l-8-4-8 4m16 0-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
      </svg>
    )
  },
  {
    id: 'add-product', label: 'Add Product', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" d="M12 5v14M5 12h14" /><rect x={3} y={3} width={18} height={18} rx={2} />
      </svg>
    )
  },
  {
    id: 'customers', label: 'Customers', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx={9} cy={7} r={4} />
        <path strokeLinecap="round" d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    )
  },
  {
    id: 'inventory', label: 'Inventory', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" d="M5 8h14M5 8a2 2 0 1 0 0-4h14a2 2 0 1 0 0 4M5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8M10 12h4" />
      </svg>
    )
  },
  {
    id: 'settings', label: 'Settings', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <circle cx={12} cy={12} r={3} />
        <path strokeLinecap="round" d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    )
  },
]

// ── Stat Card ─────────────────────────────────────────
function StatCard({ label, value, sub, color, icon }: { label: string; value: string; sub: string; color: string; icon: JSX.Element }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-100 p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">{label}</span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>{icon}</div>
      </div>
      <div>
        <div className="text-2xl font-bold text-stone-900">{value}</div>
        <div className="text-xs text-stone-400 mt-0.5">{sub}</div>
      </div>
    </div>
  )
}

// ── Mini Bar Chart ────────────────────────────────────
function BarChart({ data, labels, color, prefix = '' }: { data: number[]; labels: string[]; color: string; prefix?: string }) {
  const max = Math.max(...data)
  return (
    <div className="flex items-end gap-1.5 h-28 w-full">
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full rounded-t-md transition-all duration-500" style={{ height: `${(v / max) * 100}%`, background: color }} title={`${prefix}${v}`} />
          <span className="text-[9px] text-stone-400 font-medium">{labels[i]}</span>
        </div>
      ))}
    </div>
  )
}

const STATUS_STYLES: Record<string, string> = {
  placed: 'bg-blue-50 text-blue-700',
  confirmed: 'bg-amber-50 text-amber-700',
  shipped: 'bg-violet-50 text-violet-700',
  delivered: 'bg-green-50 text-green-700',
  active: 'bg-green-50 text-green-700',
  inactive: 'bg-stone-100 text-stone-500',
}

// ══════════════════════════════════════════════════════
// ── SECTIONS ──────────────────────────────────────────
// ══════════════════════════════════════════════════════

function OverviewSection() {
  const totalRevenue = MOCK_ORDERS.reduce((s, o) => s + o.total, 0)
  const totalOrders = MOCK_ORDERS.length
  const pendingOrders = MOCK_ORDERS.filter(o => o.status !== 'delivered').length
  const totalProducts = allProducts.length

  return (
    <div className="flex flex-col gap-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} sub="This month" color="bg-amber-50 text-amber-600"
          icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>} />
        <StatCard label="Orders" value={`${totalOrders}`} sub={`${pendingOrders} pending`} color="bg-violet-50 text-violet-600"
          icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" /><rect x={9} y={3} width={6} height={4} rx={1} /></svg>} />
        <StatCard label="Products" value={`${totalProducts}`} sub="In catalogue" color="bg-teal-50 text-teal-600"
          icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" d="M20 7l-8-4-8 4m16 0-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" /></svg>} />
        <StatCard label="Customers" value={`${MOCK_CUSTOMERS.length}`} sub={`${MOCK_CUSTOMERS.filter(c => c.status === 'active').length} active`} color="bg-rose-50 text-rose-600"
          icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx={9} cy={7} r={4} /></svg>} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-stone-900 text-sm">Weekly Revenue</h3>
              <p className="text-xs text-stone-400">Last 7 days</p>
            </div>
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">↑ 12%</span>
          </div>
          <BarChart data={WEEKLY_REVENUE} labels={DAYS} color="#f59e0b" prefix="₹" />
        </div>
        <div className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-stone-900 text-sm">Weekly Orders</h3>
              <p className="text-xs text-stone-400">Last 7 days</p>
            </div>
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">↑ 8%</span>
          </div>
          <BarChart data={WEEKLY_ORDERS} labels={DAYS} color="#8b5cf6" />
        </div>
      </div>

      {/* Category breakdown */}
      <div className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm">
        <h3 className="font-semibold text-stone-900 text-sm mb-4">Category Breakdown</h3>
        <div className="flex flex-col gap-3">
          {(['bananas', 'chips', 'combos'] as const).map(cat => {
            const count = allProducts.filter(p => p.category === cat).length
            const pct = Math.round((count / allProducts.length) * 100)
            const colorMap = { bananas: 'bg-amber-400', chips: 'bg-teal-400', combos: 'bg-violet-400' }
            return (
              <div key={cat} className="flex items-center gap-3">
                <span className="text-xs font-medium text-stone-500 w-16 capitalize">{cat}</span>
                <div className="flex-1 bg-stone-100 rounded-full h-2">
                  <div className={`h-2 rounded-full ${colorMap[cat]}`} style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs font-semibold text-stone-700 w-8 text-right">{pct}%</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <h3 className="font-semibold text-stone-900 text-sm">Recent Orders</h3>
          <span className="text-xs text-violet-600 font-medium cursor-pointer hover:underline">View all →</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-stone-50">
              {['Order', 'Customer', 'Amount', 'Status', 'Date'].map(h => (
                <th key={h} className="text-left px-5 py-2.5 text-xs font-semibold text-stone-400 uppercase tracking-wide">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {MOCK_ORDERS.slice(0, 4).map(o => (
                <tr key={o.id} className="border-t border-stone-50 hover:bg-stone-50 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs text-stone-600">{o.id}</td>
                  <td className="px-5 py-3 font-medium text-stone-800">{o.customer}</td>
                  <td className="px-5 py-3 font-semibold text-stone-900">₹{o.total}</td>
                  <td className="px-5 py-3"><span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${STATUS_STYLES[o.status]}`}>{o.status}</span></td>
                  <td className="px-5 py-3 text-stone-400 text-xs">{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function OrdersSection() {
  const [filter, setFilter] = useState<string>('all')
  const [search, setSearch] = useState('')
  const statuses = ['all', 'placed', 'confirmed', 'shipped', 'delivered']
  const filtered = MOCK_ORDERS.filter(o =>
    (filter === 'all' || o.status === filter) &&
    (o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase()))
  )
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <h2 className="text-lg font-bold text-stone-900">All Orders</h2>
        <div className="flex gap-2 flex-wrap">
          {statuses.map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-colors ${filter === s ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by order ID or customer…"
        className="w-full h-10 px-4 rounded-xl border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-stone-50">
              {['Order ID', 'Customer', 'Location', 'Items', 'Total', 'Status', 'Date', 'Action'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.length === 0 && <tr><td colSpan={8} className="text-center py-10 text-stone-400 text-sm">No orders found</td></tr>}
              {filtered.map(o => (
                <tr key={o.id} className="border-t border-stone-50 hover:bg-stone-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-stone-600 whitespace-nowrap">{o.id}</td>
                  <td className="px-4 py-3 font-medium text-stone-800 whitespace-nowrap">{o.customer}</td>
                  <td className="px-4 py-3 text-stone-400 text-xs whitespace-nowrap">{o.address}</td>
                  <td className="px-4 py-3 text-stone-600">{o.items}</td>
                  <td className="px-4 py-3 font-semibold text-stone-900">₹{o.total}</td>
                  <td className="px-4 py-3"><span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${STATUS_STYLES[o.status]}`}>{o.status}</span></td>
                  <td className="px-4 py-3 text-stone-400 text-xs whitespace-nowrap">{o.date}</td>
                  <td className="px-4 py-3">
                    <button className="text-xs text-violet-600 font-medium hover:underline">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function CreateOrderSection() {
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '', address: '', city: '', pincode: '' })
  const [cart, setCart] = useState<{ product: Product; qty: number }[]>([])
  const [payment, setPayment] = useState('COD')
  const [submitted, setSubmitted] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = allProducts.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) && p.inStock
  )

  function addToCart(p: Product) {
    setCart(prev => {
      const ex = prev.find(c => c.product.id === p.id)
      if (ex) return prev.map(c => c.product.id === p.id ? { ...c, qty: c.qty + 1 } : c)
      return [...prev, { product: p, qty: 1 }]
    })
  }

  function removeFromCart(id: number) {
    setCart(prev => prev.filter(c => c.product.id !== id))
  }

  const subtotal = cart.reduce((s, c) => s + c.product.price * c.qty, 0)
  const delivery = subtotal > 300 ? 0 : 40
  const total = subtotal + delivery

  if (submitted) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl">✅</div>
      <h2 className="text-xl font-bold text-stone-900">Order Created!</h2>
      <p className="text-stone-500 text-sm">Order has been placed for {customer.name}</p>
      <button onClick={() => { setSubmitted(false); setCart([]); setCustomer({ name: '', email: '', phone: '', address: '', city: '', pincode: '' }) }}
        className="mt-2 px-6 py-2.5 bg-stone-900 text-white rounded-xl font-semibold text-sm hover:bg-stone-700 transition-colors">
        Create Another Order
      </button>
    </div>
  )

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-bold text-stone-900">Create Order for Customer</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left — product picker */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-stone-100 p-4 shadow-sm">
            <h3 className="font-semibold text-stone-800 text-sm mb-3">Select Products</h3>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…"
              className="w-full h-9 px-3 rounded-lg border border-stone-200 bg-stone-50 text-sm mb-3 focus:outline-none focus:border-amber-400" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
              {filtered.map(p => (
                <div key={p.id} className="flex items-center gap-2.5 border border-stone-100 rounded-xl p-2.5 hover:border-amber-300 hover:bg-amber-50 transition-all cursor-pointer" onClick={() => addToCart(p)}>
                  <span className="text-xl">{p.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-stone-800 truncate">{p.name}</p>
                    <p className="text-xs text-stone-400">{p.weight} • ₹{p.price}</p>
                  </div>
                  <button className="w-6 h-6 rounded-full bg-stone-900 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">+</button>
                </div>
              ))}
            </div>
          </div>

          {/* Customer info */}
          <div className="bg-white rounded-2xl border border-stone-100 p-4 shadow-sm">
            <h3 className="font-semibold text-stone-800 text-sm mb-3">Customer Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { key: 'name', label: 'Full Name', placeholder: 'Priya Sharma' },
                { key: 'email', label: 'Email', placeholder: 'priya@example.com' },
                { key: 'phone', label: 'Phone', placeholder: '+91 98765 43210' },
                { key: 'pincode', label: 'Pincode', placeholder: '411001' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs text-stone-500 font-medium block mb-1">{f.label}</label>
                  <input value={(customer as any)[f.key]} onChange={e => setCustomer(c => ({ ...c, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full h-9 px-3 rounded-lg border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100" />
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="text-xs text-stone-500 font-medium block mb-1">Address</label>
                <input value={customer.address} onChange={e => setCustomer(c => ({ ...c, address: e.target.value }))}
                  placeholder="Street, landmark…"
                  className="w-full h-9 px-3 rounded-lg border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100" />
              </div>
              <div>
                <label className="text-xs text-stone-500 font-medium block mb-1">City</label>
                <input value={customer.city} onChange={e => setCustomer(c => ({ ...c, city: e.target.value }))}
                  placeholder="Pune"
                  className="w-full h-9 px-3 rounded-lg border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100" />
              </div>
              <div>
                <label className="text-xs text-stone-500 font-medium block mb-1">Payment Method</label>
                <select value={payment} onChange={e => setPayment(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:border-amber-400">
                  <option>COD</option><option>UPI</option><option>Card</option><option>Net Banking</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right — cart summary */}
        <div className="bg-white rounded-2xl border border-stone-100 p-4 shadow-sm h-fit sticky top-4">
          <h3 className="font-semibold text-stone-800 text-sm mb-3">Order Summary</h3>
          {cart.length === 0 ? (
            <div className="text-center py-8 text-stone-400 text-xs">No items added yet</div>
          ) : (
            <div className="flex flex-col gap-2 mb-4 max-h-52 overflow-y-auto">
              {cart.map(c => (
                <div key={c.product.id} className="flex items-center gap-2 text-xs">
                  <span>{c.product.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-stone-800 truncate">{c.product.name}</p>
                    <p className="text-stone-400">₹{c.product.price} × {c.qty}</p>
                  </div>
                  <span className="font-semibold text-stone-900">₹{c.product.price * c.qty}</span>
                  <button onClick={() => removeFromCart(c.product.id)} className="text-red-400 hover:text-red-600 ml-1">✕</button>
                </div>
              ))}
            </div>
          )}
          <div className="border-t border-stone-100 pt-3 flex flex-col gap-1.5 text-xs">
            <div className="flex justify-between text-stone-500"><span>Subtotal</span><span>₹{subtotal}</span></div>
            <div className="flex justify-between text-stone-500"><span>Delivery</span><span>{delivery === 0 ? 'Free' : `₹${delivery}`}</span></div>
            <div className="flex justify-between font-bold text-stone-900 text-sm border-t border-stone-100 pt-2 mt-1"><span>Total</span><span>₹{total}</span></div>
          </div>
          <button
            disabled={cart.length === 0 || !customer.name}
            onClick={() => setSubmitted(true)}
            className="mt-4 w-full py-2.5 bg-stone-900 text-white rounded-xl font-semibold text-sm hover:bg-stone-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Place Order
          </button>
          {cart.length === 0 && <p className="text-center text-xs text-stone-400 mt-2">Add products to continue</p>}
        </div>
      </div>
    </div>
  )
}

function ProductsSection() {
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState<string>('all')
  const filtered = allProducts.filter(p =>
    (catFilter === 'all' || p.category === catFilter) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  )
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <h2 className="text-lg font-bold text-stone-900">Products</h2>
        <div className="flex gap-2">
          {['all', 'bananas', 'chips', 'combos'].map(c => (
            <button key={c} onClick={() => setCatFilter(c)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-colors ${catFilter === c ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}>
              {c}
            </button>
          ))}
        </div>
      </div>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…"
        className="w-full h-10 px-4 rounded-xl border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-stone-50">
              {['Product', 'Category', 'Price', 'Stock', 'Rating', 'Status'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-t border-stone-50 hover:bg-stone-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{p.emoji}</span>
                      <div>
                        <p className="font-medium text-stone-800 text-sm">{p.name}</p>
                        <p className="text-xs text-stone-400">{p.weight}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 capitalize text-stone-500 text-xs">{p.category}</td>
                  <td className="px-4 py-3">
                    <div><p className="font-semibold text-stone-900">₹{p.price}</p>
                      {p.originalPrice > p.price && <p className="text-xs text-stone-400 line-through">₹{p.originalPrice}</p>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold ${p.stock < 30 ? 'text-red-600' : 'text-stone-700'}`}>{p.stock}</span>
                  </td>
                  <td className="px-4 py-3 text-amber-500 text-xs font-medium">★ {p.rating}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.inStock ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                      {p.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function AddProductSection() {
  const [form, setForm] = useState({ name: '', category: 'bananas', price: '', originalPrice: '', weight: '', stock: '', description: '', badge: '', emoji: '🍌', featured: false, inStock: true })
  const [saved, setSaved] = useState(false)

  function f(k: string, v: string | boolean) { setForm(p => ({ ...p, [k]: v })) }

  if (saved) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl">✅</div>
      <h2 className="text-xl font-bold text-stone-900">Product Added!</h2>
      <p className="text-stone-500 text-sm">"{form.name}" has been added to the catalogue.</p>
      <button onClick={() => { setSaved(false); setForm({ name: '', category: 'bananas', price: '', originalPrice: '', weight: '', stock: '', description: '', badge: '', emoji: '🍌', featured: false, inStock: true }) }}
        className="mt-2 px-6 py-2.5 bg-stone-900 text-white rounded-xl font-semibold text-sm hover:bg-stone-700 transition-colors">
        Add Another
      </button>
    </div>
  )

  return (
    <div className="flex flex-col gap-5 max-w-2xl">
      <h2 className="text-lg font-bold text-stone-900">Add New Product</h2>
      <div className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="text-xs text-stone-500 font-medium block mb-1">Product Name *</label>
            <input value={form.name} onChange={e => f('name', e.target.value)} placeholder="e.g. Red Banana"
              className="w-full h-10 px-3 rounded-xl border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100" />
          </div>
          <div>
            <label className="text-xs text-stone-500 font-medium block mb-1">Category *</label>
            <select value={form.category} onChange={e => f('category', e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:border-amber-400">
              <option value="bananas">Bananas</option><option value="chips">Chips</option><option value="combos">Combos</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-stone-500 font-medium block mb-1">Emoji</label>
            <input value={form.emoji} onChange={e => f('emoji', e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:border-amber-400" />
          </div>
          <div>
            <label className="text-xs text-stone-500 font-medium block mb-1">Price (₹) *</label>
            <input type="number" value={form.price} onChange={e => f('price', e.target.value)} placeholder="99"
              className="w-full h-10 px-3 rounded-xl border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:border-amber-400" />
          </div>
          <div>
            <label className="text-xs text-stone-500 font-medium block mb-1">Original Price (₹)</label>
            <input type="number" value={form.originalPrice} onChange={e => f('originalPrice', e.target.value)} placeholder="129"
              className="w-full h-10 px-3 rounded-xl border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:border-amber-400" />
          </div>
          <div>
            <label className="text-xs text-stone-500 font-medium block mb-1">Weight</label>
            <input value={form.weight} onChange={e => f('weight', e.target.value)} placeholder="1 kg"
              className="w-full h-10 px-3 rounded-xl border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:border-amber-400" />
          </div>
          <div>
            <label className="text-xs text-stone-500 font-medium block mb-1">Stock</label>
            <input type="number" value={form.stock} onChange={e => f('stock', e.target.value)} placeholder="100"
              className="w-full h-10 px-3 rounded-xl border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:border-amber-400" />
          </div>
          <div>
            <label className="text-xs text-stone-500 font-medium block mb-1">Badge Label</label>
            <input value={form.badge} onChange={e => f('badge', e.target.value)} placeholder="Best Seller"
              className="w-full h-10 px-3 rounded-xl border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:border-amber-400" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs text-stone-500 font-medium block mb-1">Description</label>
            <textarea value={form.description} onChange={e => f('description', e.target.value)} rows={3} placeholder="Short product description…"
              className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100 resize-none" />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={e => f('featured', e.target.checked)} className="rounded" />
              <span className="text-xs text-stone-600 font-medium">Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.inStock} onChange={e => f('inStock', e.target.checked)} className="rounded" />
              <span className="text-xs text-stone-600 font-medium">In Stock</span>
            </label>
          </div>
        </div>
        <button
          disabled={!form.name || !form.price}
          onClick={() => setSaved(true)}
          className="w-full py-2.5 bg-stone-900 text-white rounded-xl font-semibold text-sm hover:bg-stone-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Add Product
        </button>
      </div>
    </div>
  )
}

function CustomersSection() {
  const [search, setSearch] = useState('')
  const filtered = MOCK_CUSTOMERS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
  )
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-lg font-bold text-stone-900">Customers</h2>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email…"
        className="w-full h-10 px-4 rounded-xl border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-stone-50">
              {['Customer', 'Email', 'Orders', 'Total Spent', 'Joined', 'Status'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} className="border-t border-stone-50 hover:bg-stone-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {c.name.charAt(0)}
                      </div>
                      <span className="font-medium text-stone-800">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-stone-500 text-xs">{c.email}</td>
                  <td className="px-4 py-3 text-stone-700 font-medium">{c.orders}</td>
                  <td className="px-4 py-3 font-semibold text-stone-900">₹{c.spent.toLocaleString()}</td>
                  <td className="px-4 py-3 text-stone-400 text-xs">{c.joined}</td>
                  <td className="px-4 py-3"><span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${STATUS_STYLES[c.status]}`}>{c.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function InventorySection() {
  const lowStock = allProducts.filter(p => p.stock < 50)
  const outOfStock = allProducts.filter(p => !p.inStock)
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-lg font-bold text-stone-900">Inventory</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-stone-100 p-4 shadow-sm">
          <p className="text-xs text-stone-400 font-medium uppercase tracking-wide mb-1">Total Items</p>
          <p className="text-2xl font-bold text-stone-900">{allProducts.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-amber-100 p-4 shadow-sm">
          <p className="text-xs text-amber-500 font-medium uppercase tracking-wide mb-1">Low Stock</p>
          <p className="text-2xl font-bold text-amber-600">{lowStock.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-red-100 p-4 shadow-sm">
          <p className="text-xs text-red-400 font-medium uppercase tracking-wide mb-1">Out of Stock</p>
          <p className="text-2xl font-bold text-red-500">{outOfStock.length}</p>
        </div>
      </div>
      {lowStock.length > 0 && (
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3 bg-amber-50 border-b border-amber-100">
            <h3 className="text-sm font-semibold text-amber-700">⚠️ Low Stock Alert</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-stone-50">
                {['Product', 'Category', 'Stock', 'Action'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {lowStock.map(p => (
                  <tr key={p.id} className="border-t border-stone-50">
                    <td className="px-4 py-3 flex items-center gap-2"><span>{p.emoji}</span><span className="font-medium text-stone-800">{p.name}</span></td>
                    <td className="px-4 py-3 text-stone-500 capitalize text-xs">{p.category}</td>
                    <td className="px-4 py-3"><span className="font-bold text-red-600">{p.stock}</span></td>
                    <td className="px-4 py-3"><button className="text-xs text-violet-600 font-medium hover:underline">Restock</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function SettingsSection() {
  const [saved, setSaved] = useState(false)
  return (
    <div className="flex flex-col gap-5 max-w-2xl">
      <h2 className="text-lg font-bold text-stone-900">Settings</h2>
      {saved && <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-2.5 text-sm text-green-700 font-medium">✓ Settings saved successfully</div>}
      <div className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm flex flex-col gap-4">
        <h3 className="font-semibold text-stone-800 text-sm">Store Settings</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[['Store Name', 'snapbite'], ['Support Email', 'support@snapbite.in'], ['Phone', '+91 98765 43210'], ['GST Number', '27ABCDE1234F1Z5']].map(([label, val]) => (
            <div key={label}>
              <label className="text-xs text-stone-500 font-medium block mb-1">{label}</label>
              <input defaultValue={val} className="w-full h-10 px-3 rounded-xl border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:border-amber-400" />
            </div>
          ))}
        </div>
        <div className="border-t border-stone-100 pt-4">
          <h3 className="font-semibold text-stone-800 text-sm mb-3">Delivery Settings</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-stone-500 font-medium block mb-1">Delivery Fee (₹)</label>
              <input type="number" defaultValue={40} className="w-full h-10 px-3 rounded-xl border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:border-amber-400" />
            </div>
            <div>
              <label className="text-xs text-stone-500 font-medium block mb-1">Free Delivery Above (₹)</label>
              <input type="number" defaultValue={300} className="w-full h-10 px-3 rounded-xl border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:border-amber-400" />
            </div>
          </div>
        </div>
        <button onClick={() => setSaved(true)}
          className="w-full py-2.5 bg-stone-900 text-white rounded-xl font-semibold text-sm hover:bg-stone-700 transition-colors">
          Save Settings
        </button>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════
// ── MAIN DASHBOARD ────────────────────────────────────
// ══════════════════════════════════════════════════════

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [active, setActive] = useState<SidebarSection>('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (getRole() !== 'ROLE_ADMIN') {
      navigate('/')
    }
  }, [navigate])

  const sectionMap: Record<SidebarSection, JSX.Element> = {
    overview: <OverviewSection />,
    orders: <OrdersSection />,
    'create-order': <CreateOrderSection />,
    products: <ProductsSection />,
    'add-product': <AddProductSection />,
    customers: <CustomersSection />,
    inventory: <InventorySection />,
    settings: <SettingsSection />,
  }

  return (
    <div className="min-h-screen bg-stone-50 flex">

      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-40 h-screen w-60 bg-white border-r border-stone-100 flex flex-col transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-14 border-b border-stone-100 flex-shrink-0">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl">🍌</span>
            <span className="font-extrabold text-base tracking-tight text-stone-900">
              snap<span className="text-amber-500">bite</span>
            </span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1 rounded-lg text-stone-400 hover:text-stone-700">✕</button>
        </div>

        <div className="px-3 py-2 flex-shrink-0">
          <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest px-2 mb-1">Admin Panel</p>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto px-3 pb-4 flex flex-col gap-0.5">
          {sidebarItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setActive(item.id); setSidebarOpen(false) }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${active === item.id
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
            >
              {item.icon}
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${active === item.id ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Back to store */}
        <div className="px-3 py-3 border-t border-stone-100 flex-shrink-0">
          <Link to="/" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-stone-500 hover:bg-stone-100 hover:text-stone-800 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Store
          </Link>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-20 h-14 bg-white border-b border-stone-100 flex items-center px-4 sm:px-6 gap-4">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 rounded-lg text-stone-500 hover:bg-stone-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="font-bold text-stone-900 text-sm capitalize">
              {active.replace('-', ' ')}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 text-xs text-stone-500 bg-stone-50 px-3 py-1.5 rounded-full border border-stone-100">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              Admin
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {sectionMap[active]}
        </main>
      </div>
    </div>
  )
}
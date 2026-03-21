// import { useState, useEffect, useRef } from 'react'
// import { Link, useNavigate, useLocation } from 'react-router-dom'
// import { useCart } from '../../context/CartContext'

// export default function Navbar() {
//   const { totalItems, setCartOpen } = useCart()
//   const [scrolled, setScrolled] = useState(false)
//   const [searchOpen, setSearchOpen] = useState(false)
//   const [searchVal, setSearchVal] = useState('')
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
//   const searchRef = useRef<HTMLInputElement>(null)
//   const navigate = useNavigate()
//   const location = useLocation()

//   useEffect(() => {
//     const handler = () => setScrolled(window.scrollY > 10)
//     window.addEventListener('scroll', handler, { passive: true })
//     return () => window.removeEventListener('scroll', handler)
//   }, [])

//   useEffect(() => {
//     if (searchOpen) searchRef.current?.focus()
//   }, [searchOpen])

//   // close mobile menu on route change
//   useEffect(() => { setMobileMenuOpen(false) }, [location.pathname])

//   function handleSearch(e: React.FormEvent) {
//     e.preventDefault()
//     if (searchVal.trim()) {
//       navigate(`/?q=${encodeURIComponent(searchVal.trim())}`)
//       setSearchOpen(false)
//       setSearchVal('')
//     }
//   }

//   const navLinks = [
//     { to: '/', label: 'Home' },
//     { to: '/?cat=bananas', label: '🍌 Bananas' },
//     { to: '/?cat=chips', label: '🥔 Chips' },
//     { to: '/?cat=combos', label: '🎁 Combos' },
//   ]

//   return (
//     <>
//       <nav
//         className={`sticky top-0 z-50 transition-all duration-300 ${
//           scrolled
//             ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-stone-100'
//             : 'bg-white border-b border-stone-100'
//         }`}
//       >
//         <div className="max-w-7xl mx-auto px-4 sm:px-6">
//           <div className="flex items-center h-16 gap-4">

//             {/* Logo */}
//             <Link to="/" className="flex items-center gap-2 flex-shrink-0">
//               <span className="text-2xl">🍌</span>
//               <span className="font-extrabold text-xl tracking-tight text-stone-900 font-display">
//                 snap<span className="text-amber-500">bite</span>
//               </span>
//             </Link>

//             {/* Desktop nav links */}
//             <div className="hidden md:flex items-center gap-1 ml-6">
//               {navLinks.map((l) => (
//                 <Link
//                   key={l.to}
//                   to={l.to}
//                   className="px-3 py-1.5 rounded-lg text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
//                 >
//                   {l.label}
//                 </Link>
//               ))}
//             </div>

//             {/* Search bar — desktop */}
//             <form
//               onSubmit={handleSearch}
//               className="hidden md:flex flex-1 max-w-md mx-auto items-center relative"
//             >
//               <span className="absolute left-3 text-stone-400">
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
//                   <circle cx={11} cy={11} r={8} /><path d="m21 21-4.35-4.35" strokeLinecap="round" />
//                 </svg>
//               </span>
//               <input
//                 ref={searchRef}
//                 type="text"
//                 value={searchVal}
//                 onChange={(e) => setSearchVal(e.target.value)}
//                 placeholder="Search bananas, chips, combos…"
//                 className="w-full h-10 pl-9 pr-4 rounded-full border border-stone-200 bg-stone-50 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
//               />
//               {searchVal && (
//                 <button
//                   type="button"
//                   onClick={() => setSearchVal('')}
//                   className="absolute right-3 text-stone-400 hover:text-stone-600 text-xs"
//                 >
//                   ✕
//                 </button>
//               )}
//             </form>

//             {/* Actions */}
//             <div className="flex items-center gap-1 ml-auto">
//               {/* Mobile search */}
//               <button
//                 onClick={() => setSearchOpen(true)}
//                 className="md:hidden p-2 rounded-lg text-stone-500 hover:bg-stone-100 transition-colors"
//                 aria-label="Search"
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
//                   <circle cx={11} cy={11} r={8} /><path d="m21 21-4.35-4.35" strokeLinecap="round" />
//                 </svg>
//               </button>

//               {/* Wishlist */}
//               <Link
//                 to="/wishlist"
//                 className="hidden sm:flex p-2 rounded-lg text-stone-500 hover:bg-stone-100 transition-colors"
//                 aria-label="Wishlist"
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
//                 </svg>
//               </Link>

//               {/* Account */}
//               <Link
//                 to="/login"
//                 className="hidden sm:flex p-2 rounded-lg text-stone-500 hover:bg-stone-100 transition-colors"
//                 aria-label="Account"
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
//                   <circle cx={12} cy={7} r={4} />
//                 </svg>
//               </Link>

//               {/* Cart */}
//               <button
//                 onClick={() => setCartOpen(true)}
//                 className="relative flex items-center gap-2 bg-stone-900 hover:bg-stone-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-lg active:scale-95"
//               >
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
//                   <circle cx={9} cy={21} r={1} /><circle cx={20} cy={21} r={1} />
//                   <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" strokeLinecap="round" />
//                 </svg>
//                 <span className="hidden sm:inline">Cart</span>
//                 {totalItems > 0 && (
//                   <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-white">
//                     {totalItems > 99 ? '99+' : totalItems}
//                   </span>
//                 )}
//               </button>

//               {/* Mobile menu button */}
//               <button
//                 onClick={() => setMobileMenuOpen((v) => !v)}
//                 className="md:hidden p-2 rounded-lg text-stone-500 hover:bg-stone-100 transition-colors"
//                 aria-label="Menu"
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
//                   {mobileMenuOpen
//                     ? <path strokeLinecap="round" strokeLinejoin="round" d="M18 6 6 18M6 6l12 12" />
//                     : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
//                   }
//                 </svg>
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Mobile menu */}
//         {mobileMenuOpen && (
//           <div className="md:hidden border-t border-stone-100 bg-white px-4 py-3 flex flex-col gap-1">
//             {navLinks.map((l) => (
//               <Link
//                 key={l.to}
//                 to={l.to}
//                 className="px-3 py-2.5 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-100 transition-colors"
//               >
//                 {l.label}
//               </Link>
//             ))}
//             <div className="border-t border-stone-100 mt-2 pt-2 flex gap-3">
//               <Link to="/login" className="flex-1 text-center py-2 text-sm font-semibold text-stone-700 border border-stone-200 rounded-lg hover:bg-stone-50">
//                 Login
//               </Link>
//               <Link to="/register" className="flex-1 text-center py-2 text-sm font-semibold text-white bg-stone-900 rounded-lg hover:bg-stone-700">
//                 Sign Up
//               </Link>
//             </div>
//           </div>
//         )}
//       </nav>

//       {/* Mobile search overlay */}
//       {searchOpen && (
//         <div className="fixed inset-0 z-[60] bg-black/40 flex items-start pt-4 px-4" onClick={() => setSearchOpen(false)}>
//           <form
//             onSubmit={handleSearch}
//             className="w-full max-w-lg mx-auto bg-white rounded-2xl shadow-2xl p-4"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="relative">
//               <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
//                   <circle cx={11} cy={11} r={8} /><path d="m21 21-4.35-4.35" strokeLinecap="round" />
//                 </svg>
//               </span>
//               <input
//                 type="text"
//                 value={searchVal}
//                 onChange={(e) => setSearchVal(e.target.value)}
//                 placeholder="Search products…"
//                 className="w-full h-11 pl-9 pr-4 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
//                 autoFocus
//               />
//             </div>
//             <div className="flex gap-2 mt-3">
//               <button type="submit" className="flex-1 bg-stone-900 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-stone-700 transition-colors">
//                 Search
//               </button>
//               <button type="button" onClick={() => setSearchOpen(false)} className="px-4 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-600 hover:bg-stone-50">
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       )}
//     </>
//   )
// }




import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../../context/CartContext'

// ══════════════════════════════════════════════════════
// ── Auth utils (inline — or import from utils/auth.ts)
// ══════════════════════════════════════════════════════

function getToken(): string | null {
  return localStorage.getItem('token')
}

function getRole(): string | null {
  const token = getToken()
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

function isLoggedIn(): boolean {
  return !!getToken()
}

function doLogout(): void {
  localStorage.removeItem('token')
}

// ══════════════════════════════════════════════════════
// ── AccountMenu ───────────────────────────────────────
// ══════════════════════════════════════════════════════

function AccountMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const loggedIn = isLoggedIn()
  const role = getRole()
  const isAdmin = role === 'ROLE_ADMIN'

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleLogout() {
    doLogout()
    setOpen(false)
    navigate('/login')
  }

  // ── Not logged in → plain icon link to /login
  if (!loggedIn) {
    return (
      <Link
        to="/login"
        className="hidden sm:flex p-2 rounded-lg text-stone-500 hover:bg-stone-100 transition-colors"
        aria-label="Account"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx={12} cy={7} r={4} />
        </svg>
      </Link>
    )
  }

  // ── Logged in → dropdown
  return (
    <div className="relative hidden sm:block" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Account menu"
        className={`p-2 rounded-lg transition-colors ${open
            ? 'bg-stone-100 text-stone-900'
            : 'text-stone-500 hover:bg-stone-100 hover:text-stone-900'
          }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx={12} cy={7} r={4} />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-stone-100 py-2 z-50 animate-in">

          {/* Admin badge + Dashboard */}
          {isAdmin && (
            <>
              <div className="px-4 pt-1 pb-2">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-violet-600 bg-violet-50 border border-violet-100 rounded-full px-2.5 py-0.5">
                  🛡️ Admin
                </span>
              </div>
              <Link
                to="/admin/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-violet-700 hover:bg-violet-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                  <rect x={3} y={3} width={7} height={7} rx={1} />
                  <rect x={14} y={3} width={7} height={7} rx={1} />
                  <rect x={3} y={14} width={7} height={7} rx={1} />
                  <rect x={14} y={14} width={7} height={7} rx={1} />
                </svg>
                Dashboard
              </Link>
              <div className="h-px bg-stone-100 my-1 mx-3" />
            </>
          )}

          {/* Customer links */}
          <Link
            to="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
          >
            <svg className="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx={12} cy={7} r={4} />
            </svg>
            My Profile
          </Link>

          <Link
            to="/orders"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
          >
            <svg className="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
              <rect x={9} y={3} width={6} height={4} rx={1} />
              <path strokeLinecap="round" d="M9 12h6M9 16h4" />
            </svg>
            My Orders
          </Link>

          <Link
            to="/wishlist"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
          >
            <svg className="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            Wishlist
          </Link>

          <div className="h-px bg-stone-100 my-1 mx-3" />

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0-4-4m4 4H7m6 4v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1" />
            </svg>
            Logout
          </button>

        </div>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════
// ── Navbar ────────────────────────────────────────────
// ══════════════════════════════════════════════════════

export default function Navbar() {
  const { totalItems, setCartOpen } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchVal, setSearchVal] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const location = useLocation()

  const loggedIn = isLoggedIn()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus()
  }, [searchOpen])

  // close mobile menu on route change
  useEffect(() => { setMobileMenuOpen(false) }, [location.pathname])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (searchVal.trim()) {
      navigate(`/?q=${encodeURIComponent(searchVal.trim())}`)
      setSearchOpen(false)
      setSearchVal('')
    }
  }

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/?cat=bananas', label: '🍌 Bananas' },
    { to: '/?cat=chips', label: '🥔 Chips' },
    { to: '/?cat=combos', label: '🎁 Combos' },
  ]

  return (
    <>
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-stone-100'
            : 'bg-white border-b border-stone-100'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center h-16 gap-4">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <span className="text-2xl">🍌</span>
              <span className="font-extrabold text-xl tracking-tight text-stone-900 font-display">
                snap<span className="text-amber-500">bite</span>
              </span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-1 ml-6">
              {navLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>

            {/* Search bar — desktop */}
            <form
              onSubmit={handleSearch}
              className="hidden md:flex flex-1 max-w-md mx-auto items-center relative"
            >
              <span className="absolute left-3 text-stone-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                  <circle cx={11} cy={11} r={8} /><path d="m21 21-4.35-4.35" strokeLinecap="round" />
                </svg>
              </span>
              <input
                ref={searchRef}
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Search bananas, chips, combos…"
                className="w-full h-10 pl-9 pr-4 rounded-full border border-stone-200 bg-stone-50 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
              />
              {searchVal && (
                <button
                  type="button"
                  onClick={() => setSearchVal('')}
                  className="absolute right-3 text-stone-400 hover:text-stone-600 text-xs"
                >
                  ✕
                </button>
              )}
            </form>

            {/* Actions */}
            <div className="flex items-center gap-1 ml-auto">

              {/* Mobile search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="md:hidden p-2 rounded-lg text-stone-500 hover:bg-stone-100 transition-colors"
                aria-label="Search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                  <circle cx={11} cy={11} r={8} /><path d="m21 21-4.35-4.35" strokeLinecap="round" />
                </svg>
              </button>

              {/* Wishlist — only show when logged in on desktop */}
              {loggedIn && (
                <Link
                  to="/wishlist"
                  className="hidden sm:flex p-2 rounded-lg text-stone-500 hover:bg-stone-100 transition-colors"
                  aria-label="Wishlist"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </Link>
              )}

              {/* Account — smart dropdown or login link */}
              <AccountMenu />

              {/* Cart */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative flex items-center gap-2 bg-stone-900 hover:bg-stone-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-lg active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                  <circle cx={9} cy={21} r={1} /><circle cx={20} cy={21} r={1} />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" strokeLinecap="round" />
                </svg>
                <span className="hidden sm:inline">Cart</span>
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-white">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen((v) => !v)}
                className="md:hidden p-2 rounded-lg text-stone-500 hover:bg-stone-100 transition-colors"
                aria-label="Menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                  {mobileMenuOpen
                    ? <path strokeLinecap="round" strokeLinejoin="round" d="M18 6 6 18M6 6l12 12" />
                    : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  }
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile menu ───────────────────────────────── */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-stone-100 bg-white px-4 py-3 flex flex-col gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-100 transition-colors"
              >
                {l.label}
              </Link>
            ))}

            <div className="border-t border-stone-100 mt-2 pt-2 flex flex-col gap-1">
              {loggedIn ? (
                <>
                  {/* Admin dashboard in mobile menu */}
                  {getRole() === 'ROLE_ADMIN' && (
                    <Link
                      to="/admin/dashboard"
                      className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                        <rect x={3} y={3} width={7} height={7} rx={1} />
                        <rect x={14} y={3} width={7} height={7} rx={1} />
                        <rect x={3} y={14} width={7} height={7} rx={1} />
                        <rect x={14} y={14} width={7} height={7} rx={1} />
                      </svg>
                      Dashboard
                    </Link>
                  )}
                  <Link to="/profile" className="px-3 py-2.5 rounded-lg text-sm text-stone-700 hover:bg-stone-100 transition-colors">
                    👤 My Profile
                  </Link>
                  <Link to="/orders" className="px-3 py-2.5 rounded-lg text-sm text-stone-700 hover:bg-stone-100 transition-colors">
                    📦 My Orders
                  </Link>
                  <Link to="/wishlist" className="px-3 py-2.5 rounded-lg text-sm text-stone-700 hover:bg-stone-100 transition-colors">
                    🤍 Wishlist
                  </Link>
                  <button
                    onClick={() => { doLogout(); navigate('/login') }}
                    className="text-left px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    🚪 Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-3">
                  <Link to="/login" className="flex-1 text-center py-2 text-sm font-semibold text-stone-700 border border-stone-200 rounded-lg hover:bg-stone-50">
                    Login
                  </Link>
                  <Link to="/register" className="flex-1 text-center py-2 text-sm font-semibold text-white bg-stone-900 rounded-lg hover:bg-stone-700">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Mobile search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[60] bg-black/40 flex items-start pt-4 px-4" onClick={() => setSearchOpen(false)}>
          <form
            onSubmit={handleSearch}
            className="w-full max-w-lg mx-auto bg-white rounded-2xl shadow-2xl p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                  <circle cx={11} cy={11} r={8} /><path d="m21 21-4.35-4.35" strokeLinecap="round" />
                </svg>
              </span>
              <input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Search products…"
                className="w-full h-11 pl-9 pr-4 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                autoFocus
              />
            </div>
            <div className="flex gap-2 mt-3">
              <button type="submit" className="flex-1 bg-stone-900 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-stone-700 transition-colors">
                Search
              </button>
              <button type="button" onClick={() => setSearchOpen(false)} className="px-4 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-600 hover:bg-stone-50">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
import { Link } from 'react-router-dom'

export default function Footer() {
  const footerLinks = {
    Shop: [
      { label: 'All Products', to: '/' },
      { label: 'Bananas', to: '/?cat=bananas' },
      { label: 'Potato Chips', to: '/?cat=chips' },
      { label: 'Combo Packs', to: '/?cat=combos' },
    ],
    Account: [
      { label: 'Login', to: '/login' },
      { label: 'Register', to: '/register' },
      { label: 'My Orders', to: '/orders' },
      { label: 'Wishlist', to: '/wishlist' },
    ],
    Support: [
      { label: 'FAQs', to: '/faq' },
      { label: 'Track Order', to: '/track' },
      { label: 'Returns & Refunds', to: '/returns' },
      { label: 'Contact Us', to: '/contact' },
    ],
    Legal: [
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'Terms of Service', to: '/terms' },
      { label: 'Cookie Policy', to: '/cookies' },
    ],
  }

  return (
    <footer className="bg-stone-900 text-stone-300 mt-20">
      {/* Top strip */}
      <div className="bg-amber-500 text-stone-900">
        <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap items-center justify-center gap-8 text-sm font-semibold">
          <span className="flex items-center gap-2">🚚 Free delivery on orders ₹299+</span>
          <span className="flex items-center gap-2">🌿 100% Natural products</span>
          <span className="flex items-center gap-2">⚡ Same-day delivery available</span>
          <span className="flex items-center gap-2">🔒 Secure checkout</span>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🍌</span>
              <span className="text-white font-extrabold text-xl tracking-tight">
                snap<span className="text-amber-400">bite</span>
              </span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed mb-4">
              Fresh bananas & artisan potato chips delivered to your door. Farm-to-table quality, every single day.
            </p>
            <div className="flex gap-3">
              {['Instagram', 'Twitter', 'Facebook'].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="w-8 h-8 bg-stone-800 hover:bg-amber-500 hover:text-stone-900 rounded-lg flex items-center justify-center text-xs font-bold transition-colors"
                  aria-label={s}
                >
                  {s[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-white font-semibold text-sm mb-4">{section}</h4>
              <ul className="space-y-2">
                {links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="text-sm text-stone-400 hover:text-amber-400 transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-stone-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <span>© 2026 SnapBite. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2">
              <span className="bg-stone-800 px-2 py-1 rounded text-[10px] font-mono">VISA</span>
              <span className="bg-stone-800 px-2 py-1 rounded text-[10px] font-mono">MASTERCARD</span>
              <span className="bg-stone-800 px-2 py-1 rounded text-[10px] font-mono">UPI</span>
              <span className="bg-stone-800 px-2 py-1 rounded text-[10px] font-mono">COD</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

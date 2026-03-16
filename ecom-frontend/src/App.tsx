import { CartProvider } from './context/CartContext'
import { ToastProvider } from './context/ToastContext'
import Navbar from './component/layout/Navbar'
import Footer from './component/layout/Footer'
import CartDrawer from './component/cart/CartDrawer'
import AppRoutes from './routes/AppRoutes'
import { useLocation } from 'react-router-dom'

// Hide navbar/footer on auth pages and order success
const CLEAN_ROUTES = ['/login', '/register', '/forgot-password', '/order-success']

function Layout() {
  const { pathname } = useLocation()
  const isClean = CLEAN_ROUTES.some((r) => pathname.startsWith(r))

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      {!isClean && <Navbar />}
      <main className="flex-1">
        <AppRoutes />
      </main>
      {!isClean && <Footer />}
      {!isClean && <CartDrawer />}
    </div>
  )
}

export default function App() {
  return (
    <CartProvider>
      <ToastProvider>
        <Layout />
      </ToastProvider>
    </CartProvider>
  )
}

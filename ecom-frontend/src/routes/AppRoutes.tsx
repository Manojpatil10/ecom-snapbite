import { Routes, Route } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import ProductPage from '../pages/ProductPage'
import CartPage from '../pages/CartPage'
import CheckoutPage from '../pages/CheckoutPage'
import OrderSuccessPage from '../pages/OrderSuccessPage'
import WishlistPage from '../pages/WishlistPage'
import { LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage } from '../component/auth/AuthPages'
import { OrdersPage } from '../pages/OrdersPage'
import { ProfilePage } from '../pages/ProfilePage'
import AdminDashboard from '../pages/AdminDashboard'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/products/:slug" element={<ProductPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/order-success" element={<OrderSuccessPage />} />
      <Route path="/wishlist" element={<WishlistPage />} />
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-center px-6">
      <span className="text-7xl">🍌</span>
      <h1 className="font-display font-bold text-4xl text-stone-900">404</h1>
      <p className="text-stone-500 text-lg">Oops! This page doesn't exist.</p>
      <a href="/" className="bg-stone-900 text-white px-8 py-3 rounded-xl font-semibold hover:bg-stone-700 transition-colors">
        Go Home
      </a>
    </div>
  )
}

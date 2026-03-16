import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from '../../context/ToastContext'
import { Spinner } from '../ui'

// ── LoginPage ─────────────────────────────────────────
export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const { addToast } = useToast()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    // TODO: replace with real API call
    // const res = await fetch('http://localhost:8080/api/auth/login', { method:'POST', ... })
    await new Promise((r) => setTimeout(r, 1000))
    setLoading(false)
    addToast('Logged in successfully! 🎉')
    navigate('/')
  }

  return (
    <AuthShell
      title="Welcome back"
      sub="Login to your SnapBite account"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Email address">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className={inputCls}
          />
        </FormField>

        <FormField label="Password">
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className={`${inputCls} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-sm"
            >
              {showPw ? '🙈' : '👁'}
            </button>
          </div>
        </FormField>

        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-xs text-amber-600 hover:text-amber-700 font-medium">
            Forgot password?
          </Link>
        </div>

        <button type="submit" disabled={loading} className={submitCls}>
          {loading ? <><Spinner /> Logging in…</> : 'Login'}
        </button>
      </form>

      <Divider />
      <SocialButtons />

      <p className="text-center text-sm text-stone-500 mt-4">
        Don't have an account?{' '}
        <Link to="/register" className="text-stone-900 font-semibold hover:text-amber-600">
          Create one →
        </Link>
      </p>
    </AuthShell>
  )
}

// ── RegisterPage ──────────────────────────────────────
export function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const { addToast } = useToast()
  const navigate = useNavigate()

  const up = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.password !== form.confirm) {
      addToast('Passwords do not match', 'error')
      return
    }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setLoading(false)
    addToast('Account created! Welcome to SnapBite 🍌')
    navigate('/')
  }

  return (
    <AuthShell title="Create account" sub="Join SnapBite and start snacking smarter">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Full Name">
          <input type="text" value={form.name} onChange={up('name')} placeholder="Rahul Mehta" required className={inputCls} />
        </FormField>
        <FormField label="Email address">
          <input type="email" value={form.email} onChange={up('email')} placeholder="you@example.com" required className={inputCls} />
        </FormField>
        <FormField label="Phone">
          <input type="tel" value={form.phone} onChange={up('phone')} placeholder="9876543210" maxLength={10} required className={inputCls} />
        </FormField>
        <FormField label="Password">
          <div className="relative">
            <input type={showPw ? 'text' : 'password'} value={form.password} onChange={up('password')} placeholder="Min 8 characters" required minLength={8} className={`${inputCls} pr-10`} />
            <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">
              {showPw ? '🙈' : '👁'}
            </button>
          </div>
        </FormField>
        <FormField label="Confirm Password">
          <input type="password" value={form.confirm} onChange={up('confirm')} placeholder="Re-enter password" required className={inputCls} />
        </FormField>
        <button type="submit" disabled={loading} className={submitCls}>
          {loading ? <><Spinner /> Creating account…</> : 'Create Account'}
        </button>
      </form>
      <p className="text-center text-sm text-stone-500 mt-4">
        Already have an account?{' '}
        <Link to="/login" className="text-stone-900 font-semibold hover:text-amber-600">Login →</Link>
      </p>
    </AuthShell>
  )
}

// ── ForgotPasswordPage ────────────────────────────────
export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setLoading(false)
    setSent(true)
  }

  return (
    <AuthShell title="Reset password" sub="We'll send you a link to reset your password">
      {sent ? (
        <div className="text-center space-y-4 py-4">
          <span className="text-5xl block">📧</span>
          <p className="font-semibold text-stone-800">Check your inbox</p>
          <p className="text-sm text-stone-500">We've sent a reset link to <strong>{email}</strong>.</p>
          <Link to="/login" className="block mt-4 text-sm text-amber-600 hover:text-amber-700 font-medium">
            ← Back to Login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Email address">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className={inputCls} />
          </FormField>
          <button type="submit" disabled={loading} className={submitCls}>
            {loading ? <><Spinner /> Sending…</> : 'Send Reset Link'}
          </button>
          <p className="text-center text-sm text-stone-500">
            Remembered?{' '}
            <Link to="/login" className="text-stone-900 font-semibold hover:text-amber-600">Login →</Link>
          </p>
        </form>
      )}
    </AuthShell>
  )
}

// ── Shared helpers ────────────────────────────────────
const inputCls =
  'w-full border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all'

const submitCls =
  'w-full bg-stone-900 hover:bg-stone-700 text-white font-bold py-3.5 rounded-xl text-sm transition-all hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed'

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5 block">{label}</label>
      {children}
    </div>
  )
}

function AuthShell({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-stone-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <span className="text-3xl">🍌</span>
            <span className="font-extrabold text-2xl text-stone-900">snap<span className="text-amber-500">bite</span></span>
          </Link>
          <h1 className="font-display font-bold text-2xl text-stone-900">{title}</h1>
          <p className="text-stone-500 text-sm mt-1">{sub}</p>
        </div>
        <div className="bg-white rounded-3xl shadow-xl p-8">
          {children}
        </div>
      </div>
    </div>
  )
}

function Divider() {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px bg-stone-100" />
      <span className="text-xs text-stone-400 font-medium">or continue with</span>
      <div className="flex-1 h-px bg-stone-100" />
    </div>
  )
}

function SocialButtons() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {[
        { label: 'Google', icon: '🔍' },
        { label: 'Phone OTP', icon: '📱' },
      ].map((s) => (
        <button
          key={s.label}
          onClick={() => alert(`${s.label} auth coming soon!`)}
          className="flex items-center justify-center gap-2 border border-stone-200 text-stone-600 text-sm font-medium py-2.5 rounded-xl hover:bg-stone-50 transition-colors"
        >
          <span>{s.icon}</span> {s.label}
        </button>
      ))}
    </div>
  )
}

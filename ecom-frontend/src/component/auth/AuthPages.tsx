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

// ── Role definitions ─────────────────────────────────
type Role = 'user' | 'admin'

interface RoleOption {
  value: Role
  label: string
  description: string
  icon: string
  iconBg: string
  activeBorder: string
  activeBg: string
  activeText: string
  activeBadge: string
}

const ROLES: RoleOption[] = [
  {
    value: 'user',
    label: 'Customer',
    description: 'Browse products, place orders, track deliveries',
    icon: '🛒',
    iconBg: 'bg-amber-50',
    activeBorder: 'border-amber-400',
    activeBg: 'bg-amber-50',
    activeText: 'text-amber-700',
    activeBadge: 'bg-amber-100 text-amber-700',
  },
  {
    value: 'admin',
    label: 'Admin',
    description: 'Manage products, orders, users & analytics',
    icon: '🛡️',
    iconBg: 'bg-violet-50',
    activeBorder: 'border-violet-400',
    activeBg: 'bg-violet-50',
    activeText: 'text-violet-700',
    activeBadge: 'bg-violet-100 text-violet-700',
  },
]

// ── RegisterPage ──────────────────────────────────────
export function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirm: '',
    role: 'user' as Role,
  })
  const [showPw, setShowPw] = useState(false)
  const [showConfirmPw, setShowConfirmPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const { addToast } = useToast()
  const navigate = useNavigate()

  // Generic field updater for text inputs
  const up =
    (k: keyof typeof form) =>
      (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((f) => ({ ...f, [k]: e.target.value }))

  // Password strength
  const pwStrength = (() => {
    const p = form.password
    if (!p) return null
    let score = 0
    if (p.length >= 8) score++
    if (/[A-Z]/.test(p)) score++
    if (/[0-9]/.test(p)) score++
    if (/[^A-Za-z0-9]/.test(p)) score++
    if (score <= 1) return { label: 'Weak', color: 'bg-red-400', width: 'w-1/4' }
    if (score === 2) return { label: 'Fair', color: 'bg-amber-400', width: 'w-2/4' }
    if (score === 3) return { label: 'Good', color: 'bg-teal-400', width: 'w-3/4' }
    return { label: 'Strong', color: 'bg-emerald-500', width: 'w-full' }
  })()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setApiError(null)

    // Client-side validation
    if (form.password !== form.confirm) {
      addToast('Passwords do not match', 'error')
      return
    }
    if (form.phone.length !== 10 || !/^\d{10}$/.test(form.phone)) {
      addToast('Enter a valid 10-digit phone number', 'error')
      return
    }

    setLoading(true)

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        password: form.password,
        role: form.role,
      }

      const res = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        // Surface backend validation / conflict errors
        const msg =
          data?.message ||
          data?.error ||
          (res.status === 409 ? 'An account with this email already exists.' : 'Registration failed. Please try again.')
        setApiError(msg)
        addToast(msg, 'error')
        return
      }

      // Optionally store token if backend returns one
      if (data?.token) {
        localStorage.setItem('token', data.token)
      }

      addToast('Account created! Welcome to SnapBite 🍌')
      navigate(form.role === 'admin' ? '/admin' : '/')
    } catch (err) {
      const msg = 'Could not connect to the server. Please try again.'
      setApiError(msg)
      addToast(msg, 'error')
    } finally {
      setLoading(false)
    }
  }

  const selectedRole = ROLES.find((r) => r.value === form.role)!

  return (
    <AuthShell title="Create account" sub="Join SnapBite and start snacking smarter">
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* ── Role selector ── */}
        <FormField label="I am registering as">
          <div className="grid grid-cols-2 gap-3 mt-1">
            {ROLES.map((role) => {
              const active = form.role === role.value
              return (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, role: role.value }))}
                  className={`relative flex flex-col items-start gap-2 p-3.5 rounded-xl border-2 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-amber-400 ${active
                    ? `${role.activeBorder} ${role.activeBg}`
                    : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  aria-pressed={active}
                >
                  {/* Active check */}
                  {active && (
                    <span className={`absolute top-2.5 right-2.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white ${role.value === 'user' ? 'bg-amber-400' : 'bg-violet-500'}`}>
                      ✓
                    </span>
                  )}

                  {/* Icon */}
                  <span className={`w-9 h-9 rounded-xl flex items-center justify-center text-xl ${active ? role.iconBg : 'bg-stone-100'}`}>
                    {role.icon}
                  </span>

                  {/* Label */}
                  <div>
                    <p className={`text-sm font-bold leading-tight ${active ? role.activeText : 'text-stone-700'}`}>
                      {role.label}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </FormField>

        {/* ── Text fields ── */}
        <FormField label="Full Name">
          <input
            type="text"
            value={form.name}
            onChange={up('name')}
            placeholder="Rahul Mehta"
            required
            className={inputCls}
          />
        </FormField>

        <FormField label="Email address">
          <input
            type="email"
            value={form.email}
            onChange={up('email')}
            placeholder="you@example.com"
            required
            className={inputCls}
          />
        </FormField>

        <FormField label="Phone">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-sm font-medium">+91</span>
            <input
              type="tel"
              value={form.phone}
              onChange={up('phone')}
              placeholder="9876543210"
              maxLength={10}
              required
              className={`${inputCls} pl-12`}
            />
          </div>
        </FormField>

        <FormField label="Password">
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              value={form.password}
              onChange={up('password')}
              placeholder="Min 8 characters"
              required
              minLength={8}
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
          {/* Password strength meter */}
          {pwStrength && (
            <div className="mt-2 space-y-1">
              <div className="h-1 bg-stone-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-300 ${pwStrength.color} ${pwStrength.width}`} />
              </div>
              <p className={`text-[11px] font-medium ${pwStrength.label === 'Weak' ? 'text-red-500' :
                pwStrength.label === 'Fair' ? 'text-amber-500' :
                  pwStrength.label === 'Good' ? 'text-teal-600' : 'text-emerald-600'
                }`}>
                Password strength: {pwStrength.label}
              </p>
            </div>
          )}
        </FormField>

        <FormField label="Confirm Password">
          <div className="relative">
            <input
              type={showConfirmPw ? 'text' : 'password'}
              value={form.confirm}
              onChange={up('confirm')}
              placeholder="Re-enter password"
              required
              className={`${inputCls} pr-10 ${form.confirm && form.password !== form.confirm
                ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                : form.confirm && form.password === form.confirm
                  ? 'border-emerald-300 focus:border-emerald-400 focus:ring-emerald-100'
                  : ''
                }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-sm"
            >
              {showConfirmPw ? '🙈' : '👁'}
            </button>
            {form.confirm && (
              <span className="absolute right-9 top-1/2 -translate-y-1/2 text-xs">
                {form.password === form.confirm ? '✅' : '❌'}
              </span>
            )}
          </div>
        </FormField>

        {/* API error banner */}
        {apiError && (
          <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
            <span className="flex-shrink-0 mt-0.5">⚠️</span>
            <span>{apiError}</span>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`${submitCls} ${selectedRole.value === 'admin'
            ? 'bg-violet-700 hover:bg-violet-600'
            : 'bg-stone-900 hover:bg-stone-700'
            }`}
        >
          {loading ? (
            <><Spinner /> Creating account…</>
          ) : (
            <>
              <span>{selectedRole.icon}</span>
              Create {selectedRole.label} Account
            </>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-stone-500 mt-4">
        Already have an account?{' '}
        <Link to="/login" className="text-stone-900 font-semibold hover:text-amber-600">
          Login →
        </Link>
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
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Spinner } from '../ui'
import { useToast } from '../../context/ToastContext'
import axios from 'axios'

// ══════════════════════════════════════════════════════
// ── Validators ────────────────────────────────────────
// ══════════════════════════════════════════════════════

const validators = {
  name: (v: string) => {
    if (!v.trim()) return 'Full name is required'
    if (v.trim().length < 2) return 'Name must be at least 2 characters'
    return null
  },
  email: (v: string) => {
    if (!v.trim()) return 'Email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Enter a valid email address'
    return null
  },
  phone: (v: string) => {
    if (!v) return 'Phone number is required'
    if (!/^\d{10}$/.test(v)) return 'Enter a valid 10-digit phone number'
    return null
  },
  password: (v: string) => {
    if (!v) return 'Password is required'
    if (v.length < 8) return 'At least 8 characters required'
    if (!/[A-Z]/.test(v)) return 'Must include at least one uppercase letter'
    if (!/[0-9]/.test(v)) return 'Must include at least one number'
    if (!/[^A-Za-z0-9]/.test(v)) return 'Must include at least one special character'
    return null
  },
  confirm: (v: string, password: string) => {
    if (!v) return 'Please confirm your password'
    if (v !== password) return 'Passwords do not match'
    return null
  },
}

// ══════════════════════════════════════════════════════
// ── Shared UI helpers ─────────────────────────────────
// ══════════════════════════════════════════════════════

const inputCls =
  'w-full border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all'

const submitCls =
  'w-full bg-stone-900 hover:bg-stone-700 text-white font-bold py-3.5 rounded-xl text-sm transition-all hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed'

/** Returns extra border classes based on touched + error state */
function fieldBorder(touched: boolean, error: string | null): string {
  if (!touched) return ''
  return error
    ? ' border-red-300 focus:border-red-400 focus:ring-red-100'
    : ' border-emerald-300 focus:border-emerald-400 focus:ring-emerald-100'
}

function FieldError({ msg }: { msg: string | null }) {
  if (!msg) return null
  return (
    <p className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-red-500">
      <span>⚠</span> {msg}
    </p>
  )
}

function FormField({
  label,
  error,
  children,
}: {
  label: string
  error?: string | null
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5 block">
        {label}
      </label>
      {children}
      <FieldError msg={error ?? null} />
    </div>
  )
}

function AuthShell({
  title,
  sub,
  children,
}: {
  title: string
  sub: string
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-stone-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-5">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <span className="text-3xl">🍌</span>
            <span className="font-extrabold text-2xl text-stone-900">
              snap<span className="text-amber-500">bite</span>
            </span>
          </Link>
          <h1 className="font-display font-bold text-2xl text-stone-900">{title}</h1>
          <p className="text-stone-500 text-sm mt-1">{sub}</p>
        </div>

        {/* ✅ Add relative here + home button */}
        <div className="relative bg-white rounded-3xl shadow-xl p-8">
          <Link
            to="/"
            className="absolute top-4 right-4 flex items-center gap-1.5 text-xs font-medium text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors rounded-full px-2 py-0.5 border border-stone-200 hover:border-stone-300"
          >
            <span className="text-sm">←</span> Home
          </Link>
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
          type="button"
          onClick={() => alert(`${s.label} auth coming soon!`)}
          className="flex items-center justify-center gap-2 border border-stone-200 text-stone-600 text-sm font-medium py-2.5 rounded-xl hover:bg-stone-50 transition-colors"
        >
          <span>{s.icon}</span> {s.label}
        </button>
      ))}
    </div>
  )
}

// ══════════════════════════════════════════════════════
// ── LoginPage ─────────────────────────────────────────
// ══════════════════════════════════════════════════════

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [touched, setTouched] = useState({ email: false, password: false })
  const { addToast } = useToast()
  const navigate = useNavigate()

  const errors = {
    email: validators.email(email),
    password: !password ? 'Password is required' : null, // login only checks empty
  }

  const touch = (k: keyof typeof touched) =>
    setTouched((t) => ({ ...t, [k]: true }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setTouched({ email: true, password: true })

    if (errors.email || errors.password) {
      addToast('Please fix the errors before continuing', 'warning')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.message || 'Login failed')
      }

      localStorage.setItem('accessToken', data.accessToken)

      addToast('Logged in successfully! 🎉', 'success')
      navigate('/')

    } catch (err: any) {
      addToast(err.message || 'Login failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell title="Welcome back" sub="Login to your SnapBite account">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <FormField label="Email address" error={touched.email ? errors.email : null}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => touch('email')}
            placeholder="you@example.com"
            className={inputCls + fieldBorder(touched.email, errors.email)}
          />
        </FormField>

        <FormField label="Password" error={touched.password ? errors.password : null}>
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => touch('password')}
              placeholder="••••••••"
              className={`${inputCls} pr-10` + fieldBorder(touched.password, errors.password)}
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
          <Link
            to="/forgot-password"
            className="text-xs text-amber-600 hover:text-amber-700 font-medium"
          >
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

// ══════════════════════════════════════════════════════
// ── Role definitions ──────────────────────────────────
// ══════════════════════════════════════════════════════

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

// ══════════════════════════════════════════════════════
// ── RegisterPage ──────────────────────────────────────
// ══════════════════════════════════════════════════════

export function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirm: '',
  })
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [showPw, setShowPw] = useState(false)
  const [showConfirmPw, setShowConfirmPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const { addToast } = useToast()
  const navigate = useNavigate()

  const up =
    (k: keyof typeof form) =>
      (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((f) => ({ ...f, [k]: e.target.value }))

  const touch = (k: string) => setTouched((t) => ({ ...t, [k]: true }))

  const errors = {
    name: validators.name(form.name),
    email: validators.email(form.email),
    phone: validators.phone(form.phone),
    password: validators.password(form.password),
    confirm: validators.confirm(form.confirm, form.password),
  }

  const isFormValid = Object.values(errors).every((e) => e === null)

  const err = (k: keyof typeof errors) => (touched[k] ? errors[k] : null)

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
    setTouched({ name: true, email: true, phone: true, password: true, confirm: true })

    if (!isFormValid) {
      addToast('Please fix all errors before submitting', 'warning')
      return
    }

    setLoading(true)
    try {
      const payload = {
        fullName: form.name, // ✅ FIX
        email: form.email,
        phone: form.phone,
        password: form.password,
      }

      const res = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        const msg =
          data?.message ||
          data?.error ||
          (res.status === 409
            ? 'An account with this email already exists.'
            : 'Registration failed. Please try again.')
        setApiError(msg)
        addToast(msg, 'error')
        return
      }

      // if (data?.token) localStorage.setItem('token', data.token)
      if (data?.accessToken) {
        localStorage.setItem('accessToken', data.accessToken)
      }
      if (data?.role) {
        localStorage.setItem('role', data.role)
      }
      addToast('Account created successfully! Please login.', 'success')
      navigate('/')
    } catch {
      const msg = 'Could not connect to the server. Please try again.'
      setApiError(msg)
      addToast(msg, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell title="Create account" sub="Join SnapBite and start snacking smarter">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">

        {/* Full Name */}
        <FormField label="Full Name" error={err('name')}>
          <input
            type="text"
            value={form.name}
            onChange={up('name')}
            onBlur={() => touch('name')}
            placeholder="Rahul Mehta"
            className={inputCls + fieldBorder(!!touched.name, errors.name)}
          />
        </FormField>

        {/* Email */}
        <FormField label="Email address" error={err('email')}>
          <input
            type="email"
            value={form.email}
            onChange={up('email')}
            onBlur={() => touch('email')}
            placeholder="you@example.com"
            className={inputCls + fieldBorder(!!touched.email, errors.email)}
          />
        </FormField>

        {/* Phone */}
        <FormField label="Phone" error={err('phone')}>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-sm font-medium">
              +91
            </span>
            <input
              type="tel"
              value={form.phone}
              onChange={up('phone')}
              onBlur={() => touch('phone')}
              placeholder="9876543210"
              maxLength={10}
              className={`${inputCls} pl-12` + fieldBorder(!!touched.phone, errors.phone)}
            />
          </div>
        </FormField>

        {/* Password */}
        <FormField label="Password" error={err('password')}>
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              value={form.password}
              onChange={up('password')}
              onBlur={() => touch('password')}
              placeholder="Min 8 characters"
              minLength={8}
              className={`${inputCls} pr-10` + fieldBorder(!!touched.password, errors.password)}
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-sm"
            >
              {showPw ? '🙈' : '👁'}
            </button>
          </div>

          {/* Strength meter */}
          {pwStrength && (
            <div className="mt-2 space-y-1">
              <div className="h-1 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${pwStrength.color} ${pwStrength.width}`}
                />
              </div>
              <p
                className={`text-[11px] font-medium ${pwStrength.label === 'Weak'
                  ? 'text-red-500'
                  : pwStrength.label === 'Fair'
                    ? 'text-amber-500'
                    : pwStrength.label === 'Good'
                      ? 'text-teal-600'
                      : 'text-emerald-600'
                  }`}
              >
                Password strength: {pwStrength.label}
              </p>
            </div>
          )}

          {/* Rules checklist */}
          {form.password && (
            <ul className="mt-2 space-y-0.5">
              {[
                { ok: form.password.length >= 8, text: 'At least 8 characters' },
                { ok: /[A-Z]/.test(form.password), text: 'One uppercase letter' },
                { ok: /[0-9]/.test(form.password), text: 'One number' },
                { ok: /[^A-Za-z0-9]/.test(form.password), text: 'One special character (!@#$…)' },
              ].map(({ ok, text }) => (
                <li
                  key={text}
                  className={`flex items-center gap-1.5 text-[11px] font-medium ${ok ? 'text-emerald-600' : 'text-stone-400'
                    }`}
                >
                  <span>{ok ? '✅' : '○'}</span> {text}
                </li>
              ))}
            </ul>
          )}
        </FormField>

        {/* Confirm Password */}
        <FormField label="Confirm Password" error={err('confirm')}>
          <div className="relative">
            <input
              type={showConfirmPw ? 'text' : 'password'}
              value={form.confirm}
              onChange={up('confirm')}
              onBlur={() => touch('confirm')}
              placeholder="Re-enter password"
              className={`${inputCls} pr-16` + fieldBorder(!!touched.confirm, errors.confirm)}
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
        <button type="submit" disabled={loading} className={submitCls}>
          {loading ? <><Spinner /> Creating account…</> : 'Create Account'}
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

// ══════════════════════════════════════════════════════
// ── ForgotPasswordPage ────────────────────────────────
// ══════════════════════════════════════════════════════

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [touched, setTouched] = useState(false)
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const { addToast } = useToast()

  const emailError = validators.email(email)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setTouched(true)

    if (emailError) {
      addToast('Please enter a valid email address', 'warning')
      return
    }

    setLoading(true)

    try {
      const res = await axios.post(
        'http://localhost:8080/api/auth/forgot',
        { email }
      )

      // ✅ success
      addToast(res.data || 'Reset link sent!', 'success')
      setSent(true)

    } catch (err: any) {
      // ❌ error handling (this is the best part)
      const message =
        err.response?.data || 'Failed to send reset link. Try again.'

      addToast(message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell title="Reset password" sub="We'll send you a link to reset your password">
      {sent ? (
        <div className="text-center space-y-4 py-4">
          <span className="text-5xl block">📧</span>
          <p className="font-semibold text-stone-800">Check your inbox</p>
          <p className="text-sm text-stone-500">
            We've sent a reset link to <strong>{email}</strong>.
          </p>
          <Link
            to="/login"
            className="block mt-4 text-sm text-amber-600 hover:text-amber-700 font-medium"
          >
            ← Back to Login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <FormField label="Email address" error={touched ? emailError : null}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched(true)}
              placeholder="you@example.com"
              className={inputCls + fieldBorder(touched, emailError)}
            />
          </FormField>

          <button type="submit" disabled={loading} className={submitCls}>
            {loading ? <><Spinner /> Sending…</> : 'Send Reset Link'}
          </button>

          <p className="text-center text-sm text-stone-500">
            Remembered?{' '}
            <Link to="/login" className="text-stone-900 font-semibold hover:text-amber-600">
              Login →
            </Link>
          </p>
        </form>
      )}
    </AuthShell>
  )
}

// ══════════════════════════════════════════════════════
// ── ResetPasswordPage ────────────────────────────────
// ══════════════════════════════════════════════════════

export function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)

  const { addToast } = useToast()
  const navigate = useNavigate()
  const token = new URLSearchParams(useLocation().search).get('token')

  async function handleSubmit(e: any) {
    e.preventDefault()

    if (password !== confirm) {
      addToast("Passwords do not match", "warning")
      return
    }

    setLoading(true)

    try {
      const res = await fetch('http://localhost:8080/api/auth/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      })

      const msg = await res.text()

      if (!res.ok) throw new Error(msg)

      addToast('Password updated successfully 🎉', 'success')
      navigate('/login')

    } catch (err: any) {
      addToast(err.message || 'Reset failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell title="Set new password" sub="Enter your new password">
      <form onSubmit={handleSubmit} className="space-y-4">

        <FormField label="New Password">
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            className={inputCls}
          />
        </FormField>

        <FormField label="Confirm Password">
          <input
            type="password"
            onChange={(e) => setConfirm(e.target.value)}
            className={inputCls}
          />
        </FormField>

        <button type="submit" disabled={loading} className={submitCls}>
          {loading ? <><Spinner /> Resetting…</> : 'Reset Password'}
        </button>

        <p className="text-center text-sm">
          <Link to="/login" className="text-amber-600">Back to login</Link>
        </p>

      </form>
    </AuthShell>
  )
}

// ══════════════════════════════════════════════════════
// ── Logout ────────────────────────────────
// ══════════════════════════════════════════════════════

function Logout() {
  const navigate = useNavigate()

  async function handleLogout() {
    try {
      await fetch('http://localhost:8080/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
    } catch (err) {
      console.error('Logout API failed', err)
    } finally {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('role')
      navigate('/')
    }
  }

  return (
    <button onClick={handleLogout}>Logout</button>
  )
}
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

// ══════════════════════════════════════════════════════
// ── Types
// ══════════════════════════════════════════════════════

interface UserProfile {
  fullName: string
  email: string
  phone: string
  role: string
}

// ══════════════════════════════════════════════════════
// ── Helpers
// ══════════════════════════════════════════════════════

function getToken(): string | null {
  return localStorage.getItem('token')
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// ══════════════════════════════════════════════════════
// ── Field row (view mode)
// ══════════════════════════════════════════════════════

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 py-3.5 border-b border-stone-100 last:border-0">
      <div className="w-8 h-8 rounded-xl bg-stone-50 flex items-center justify-center flex-shrink-0 text-stone-400">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-0.5">{label}</p>
        <p className="text-sm font-medium text-stone-800 truncate">{value}</p>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════
// ── ProfilePage
// ══════════════════════════════════════════════════════

export function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Edit state
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ fullName: '', phone: '' })
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Password state
  const [pwSection, setPwSection] = useState(false)
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' })
  const [pwSaving, setPwSaving] = useState(false)
  const [pwError, setPwError] = useState<string | null>(null)
  const [pwSuccess, setPwSuccess] = useState(false)
  const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false })

  // ── Fetch profile
  useEffect(() => {
    async function fetchProfile() {
      setLoading(true)
      setError(null)
      try {
        const token = getToken()
        const res = await fetch('https://ecom-snapbite.onrender.com/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error('Failed to load profile')
        const data: UserProfile = await res.json()
        setProfile(data)
        setForm({ fullName: data.fullName, phone: data.phone })
      } catch (err: any) {
        setError(err.message || 'Something went wrong')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  // ── Save profile edits
  async function handleSave() {
    if (!form.fullName.trim() || !form.phone.trim()) {
      setSaveError('Name and phone cannot be empty')
      return
    }
    setSaving(true)
    setSaveError(null)
    setSaveSuccess(false)
    try {
      const token = getToken()
      const res = await fetch('https://ecom-snapbite.onrender.com/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fullName: form.fullName, phone: form.phone }),
      })
      if (!res.ok) throw new Error('Failed to update profile')
      const updated: UserProfile = await res.json()
      setProfile(updated)
      setEditing(false)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err: any) {
      setSaveError(err.message || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  // ── Change password
  async function handleChangePassword() {
    if (!pwForm.current || !pwForm.next || !pwForm.confirm) {
      setPwError('All fields are required')
      return
    }
    if (pwForm.next !== pwForm.confirm) {
      setPwError('New passwords do not match')
      return
    }
    if (pwForm.next.length < 8) {
      setPwError('New password must be at least 8 characters')
      return
    }
    setPwSaving(true)
    setPwError(null)
    setPwSuccess(false)
    try {
      const token = getToken()
      const res = await fetch('https://ecom-snapbite.onrender.com/api/users/me/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.next }),
      })
      const msg = await res.text()
      if (!res.ok) throw new Error(msg)
      setPwSuccess(true)
      setPwForm({ current: '', next: '', confirm: '' })
      setTimeout(() => { setPwSuccess(false); setPwSection(false) }, 3000)
    } catch (err: any) {
      setPwError(err.message || 'Password change failed')
    } finally {
      setPwSaving(false)
    }
  }

  // ══════════════════════════════════════════════════════
  // ── Render
  // ══════════════════════════════════════════════════════

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-stone-100">
      <div className="max-w-lg mx-auto px-4 py-8">

        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            to="/"
            className="flex items-center gap-1 text-xs font-medium text-stone-400 hover:text-stone-600 transition-colors w-fit"
          >
            <span className="text-sm">←</span> Home
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-8 h-8 border-2 border-stone-200 border-t-amber-500 rounded-full animate-spin" />
            <p className="text-sm text-stone-400">Loading profile…</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 text-sm text-red-700 flex items-start gap-2.5">
            <span>⚠️</span><span>{error}</span>
          </div>
        )}

        {/* Profile content */}
        {!loading && profile && (
          <div className="space-y-4">

            {/* Avatar card */}
            <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-6 flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-xl font-extrabold shadow-lg shadow-amber-200 flex-shrink-0">
                {getInitials(profile.fullName)}
              </div>
              <div className="min-w-0">
                <h1 className="text-lg font-extrabold text-stone-900 truncate">{profile.fullName}</h1>
                <p className="text-sm text-stone-500 truncate">{profile.email}</p>
                <span className={`inline-flex items-center gap-1 mt-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${profile.role === 'ROLE_ADMIN'
                  ? 'bg-violet-100 text-violet-600 border border-violet-200'
                  : 'bg-amber-100 text-amber-700 border border-amber-200'
                  }`}>
                  {profile.role === 'ROLE_ADMIN' ? '🛡️ Admin' : '🛒 Customer'}
                </span>
              </div>
            </div>

            {/* Success toast */}
            {saveSuccess && (
              <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 text-sm text-emerald-700">
                <span>✅</span> Profile updated successfully!
              </div>
            )}

            {/* Info card */}
            <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
              <div className="px-5 pt-4 pb-2 flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-widest text-stone-400">
                  Account Details
                </h2>
                {!editing && (
                  <button
                    onClick={() => { setEditing(true); setSaveError(null) }}
                    className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5m-1.414-9.414a2 2 0 1 1 2.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                )}
              </div>

              <div className="px-5 pb-4">
                {editing ? (
                  // ── Edit mode
                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 block mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={form.fullName}
                        onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                        className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 block mb-1.5">
                        Phone
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-sm font-medium">+91</span>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                          maxLength={10}
                          className="w-full border border-stone-200 rounded-xl pl-12 pr-4 py-2.5 text-sm text-stone-800 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                        />
                      </div>
                    </div>

                    {saveError && (
                      <p className="text-xs text-red-500 flex items-center gap-1"><span>⚠</span>{saveError}</p>
                    )}

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 bg-stone-900 hover:bg-stone-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                      >
                        {saving
                          ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</>
                          : 'Save Changes'
                        }
                      </button>
                      <button
                        onClick={() => { setEditing(false); setSaveError(null); setForm({ fullName: profile.fullName, phone: profile.phone }) }}
                        className="px-4 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-600 hover:bg-stone-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // ── View mode
                  <div>
                    <InfoRow
                      label="Full Name"
                      value={profile.fullName}
                      icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx={12} cy={7} r={4} />
                        </svg>
                      }
                    />
                    <InfoRow
                      label="Email Address"
                      value={profile.email}
                      icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />
                        </svg>
                      }
                    />
                    <InfoRow
                      label="Phone"
                      value={`+91 ${profile.phone}`}
                      icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 0 1 2-2h3.28a1 1 0 0 1 .948.684l1.498 4.493a1 1 0 0 1-.502 1.21l-2.257 1.13a11.042 11.042 0 0 0 5.516 5.516l1.13-2.257a1 1 0 0 1 1.21-.502l4.493 1.498a1 1 0 0 1 .684.949V19a2 2 0 0 1-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      }
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Change password card */}
            <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
              <button
                onClick={() => { setPwSection((v) => !v); setPwError(null); setPwSuccess(false) }}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-stone-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-stone-50 flex items-center justify-center text-stone-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <rect x={3} y={11} width={18} height={11} rx={2} />
                      <path strokeLinecap="round" d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-stone-700">Change Password</span>
                </div>
                <svg className={`w-4 h-4 text-stone-400 transition-transform ${pwSection ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {pwSection && (
                <div className="px-5 pb-5 space-y-3 border-t border-stone-100 pt-4">

                  {pwSuccess && (
                    <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2.5 text-sm text-emerald-700">
                      <span>✅</span> Password changed successfully!
                    </div>
                  )}

                  {(['current', 'next', 'confirm'] as const).map((field) => {
                    const labels = { current: 'Current Password', next: 'New Password', confirm: 'Confirm New Password' }
                    return (
                      <div key={field}>
                        <label className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 block mb-1.5">
                          {labels[field]}
                        </label>
                        <div className="relative">
                          <input
                            type={showPw[field] ? 'text' : 'password'}
                            value={pwForm[field]}
                            onChange={(e) => setPwForm((f) => ({ ...f, [field]: e.target.value }))}
                            placeholder="••••••••"
                            className="w-full border border-stone-200 rounded-xl px-4 pr-10 py-2.5 text-sm text-stone-800 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPw((s) => ({ ...s, [field]: !s[field] }))}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-sm"
                          >
                            {showPw[field] ? '🙈' : '👁'}
                          </button>
                        </div>
                      </div>
                    )
                  })}

                  {pwError && (
                    <p className="text-xs text-red-500 flex items-center gap-1"><span>⚠</span>{pwError}</p>
                  )}

                  <button
                    onClick={handleChangePassword}
                    disabled={pwSaving}
                    className="w-full bg-stone-900 hover:bg-stone-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-1"
                  >
                    {pwSaving
                      ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Updating…</>
                      : 'Update Password'
                    }
                  </button>
                </div>
              )}
            </div>

            {/* Quick links */}
            <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
              <div className="px-5 pt-4 pb-2">
                <h2 className="text-xs font-bold uppercase tracking-widest text-stone-400">Quick Links</h2>
              </div>
              <div className="divide-y divide-stone-100">
                {[
                  { to: '/orders', icon: '📦', label: 'My Orders' },
                  { to: '/wishlist', icon: '🤍', label: 'My Wishlist' },
                ].map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex items-center gap-3 px-5 py-3.5 hover:bg-stone-50 transition-colors"
                  >
                    <span className="text-base">{item.icon}</span>
                    <span className="text-sm font-medium text-stone-700 flex-1">{item.label}</span>
                    <svg className="w-4 h-4 text-stone-300" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}
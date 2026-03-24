import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

// ── Valid coupons ─────────────────────────────────────
export interface Coupon {
  code: string
  type: 'percent' | 'flat'
  value: number          // % or ₹
  minOrder: number       // minimum cart value
  description: string
  maxDiscount?: number   // cap for percent coupons
}

export const VALID_COUPONS: Coupon[] = [
  { code: 'SNAP10', type: 'percent', value: 10, minOrder: 0, description: '10% off on all orders', maxDiscount: 100 },
  { code: 'FIRST50', type: 'flat', value: 50, minOrder: 200, description: '₹50 off on orders above ₹200' },
  { code: 'BANANA20', type: 'percent', value: 20, minOrder: 150, description: '20% off, min order ₹150', maxDiscount: 80 },
  { code: 'SAVE100', type: 'flat', value: 100, minOrder: 500, description: '₹100 off on orders above ₹500' },
  { code: 'NEWUSER', type: 'percent', value: 15, minOrder: 0, description: '15% off for new users', maxDiscount: 120 },
]

interface CouponContextType {
  appliedCoupon: Coupon | null
  discount: number
  applyCoupon: (code: string, cartTotal: number) => { success: boolean; message: string }
  removeCoupon: () => void
  calcDiscount: (coupon: Coupon, cartTotal: number) => number
}

const CouponCtx = createContext<CouponContextType | null>(null)

export function CouponProvider({ children }: { children: ReactNode }) {
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null)
  const [discount, setDiscount] = useState(0)

  function calcDiscount(coupon: Coupon, cartTotal: number): number {
    if (coupon.type === 'flat') return Math.min(coupon.value, cartTotal)
    const raw = Math.round(cartTotal * coupon.value / 100)
    return coupon.maxDiscount ? Math.min(raw, coupon.maxDiscount) : raw
  }

  function applyCoupon(code: string, cartTotal: number): { success: boolean; message: string } {
    const coupon = VALID_COUPONS.find(c => c.code === code.trim().toUpperCase())
    if (!coupon) return { success: false, message: 'Invalid coupon code' }
    if (cartTotal < coupon.minOrder) return { success: false, message: `Min order ₹${coupon.minOrder} required` }
    const d = calcDiscount(coupon, cartTotal)
    setAppliedCoupon(coupon)
    setDiscount(d)
    return { success: true, message: `Coupon applied! You save ₹${d}` }
  }

  function removeCoupon() {
    setAppliedCoupon(null)
    setDiscount(0)
  }

  return (
    <CouponCtx.Provider value={{ appliedCoupon, discount, applyCoupon, removeCoupon, calcDiscount }}>
      {children}
    </CouponCtx.Provider>
  )
}

export function useCoupon() {
  const ctx = useContext(CouponCtx)
  if (!ctx) throw new Error('useCoupon must be used inside CouponProvider')
  return ctx
}
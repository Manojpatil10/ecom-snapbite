// import { useState } from 'react'
// import { useNavigate, Link } from 'react-router-dom'
// import { useCart } from '../context/CartContext'
// import { useToast } from '../context/ToastContext'
// import { Spinner } from '../component/ui'
// import type { Address } from '../types'

// type Step = 'address' | 'payment' | 'review'

// const INDIAN_STATES = [
//   'Andhra Pradesh','Assam','Bihar','Chhattisgarh','Delhi','Goa','Gujarat',
//   'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
//   'Maharashtra','Manipur','Meghalaya','Odisha','Punjab','Rajasthan','Tamil Nadu',
//   'Telangana','Uttar Pradesh','Uttarakhand','West Bengal',
// ]

// const PAYMENT_METHODS = [
//   { id: 'upi', label: 'UPI', icon: '📱', sub: 'Pay via PhonePe, GPay, Paytm' },
//   { id: 'card', label: 'Credit / Debit Card', icon: '💳', sub: 'Visa, Mastercard, RuPay' },
//   { id: 'netbanking', label: 'Net Banking', icon: '🏦', sub: 'All major Indian banks' },
//   { id: 'cod', label: 'Cash on Delivery', icon: '💵', sub: 'Pay when your order arrives' },
// ]

// export default function CheckoutPage() {
//   const { state, totalPrice, deliveryFee, clearCart } = useCart()
//   const { addToast } = useToast()
//   const navigate = useNavigate()

//   const [step, setStep] = useState<Step>('address')
//   const [placing, setPlacing] = useState(false)
//   const [paymentMethod, setPaymentMethod] = useState('upi')
//   const [address, setAddress] = useState<Address>({
//     fullName: '', phone: '', pincode: '', line1: '', line2: '', city: '', state: '',
//   })

//   const total = totalPrice + deliveryFee

//   if (state.items.length === 0) {
//     return (
//       <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
//         <span className="text-6xl">🛒</span>
//         <h2 className="font-display font-bold text-2xl text-stone-800">Nothing to checkout</h2>
//         <Link to="/" className="bg-stone-900 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-stone-700">
//           Go Shopping
//         </Link>
//       </div>
//     )
//   }

//   const steps: { id: Step; label: string }[] = [
//     { id: 'address', label: 'Address' },
//     { id: 'payment', label: 'Payment' },
//     { id: 'review', label: 'Review' },
//   ]

//   async function placeOrder() {
//     setPlacing(true)
//     // Simulate API call — replace with real backend when ready
//     await new Promise((r) => setTimeout(r, 1500))
//     const orderId = `SB${Date.now().toString().slice(-6)}`
//     clearCart()
//     addToast('Order placed successfully! 🎉')
//     navigate(`/order-success?id=${orderId}`)
//   }

//   function updateAddr(k: keyof Address, v: string) {
//     setAddress((a) => ({ ...a, [k]: v }))
//   }

//   const addrValid =
//     address.fullName && address.phone.length >= 10 && address.pincode.length === 6 &&
//     address.line1 && address.city && address.state

//   return (
//     <div className="max-w-5xl mx-auto px-6 py-10">
//       <h1 className="font-display font-bold text-3xl text-stone-900 mb-8">Checkout</h1>

//       {/* Step indicator */}
//       <div className="flex items-center gap-3 mb-10">
//         {steps.map((s, i) => (
//           <div key={s.id} className="flex items-center gap-3">
//             <div className={`flex items-center gap-2 ${step === s.id ? 'text-stone-900' : steps.indexOf({ id: step, label: '' }) > i ? 'text-emerald-600' : 'text-stone-300'}`}>
//               <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
//                 step === s.id
//                   ? 'border-stone-900 bg-stone-900 text-white'
//                   : (step === 'payment' && s.id === 'address') || (step === 'review')
//                     ? 'border-emerald-500 bg-emerald-500 text-white'
//                     : 'border-stone-200 text-stone-300'
//               }`}>
//                 {(step === 'payment' && s.id === 'address') || step === 'review' && s.id !== 'review' ? '✓' : i + 1}
//               </div>
//               <span className="text-sm font-semibold hidden sm:block">{s.label}</span>
//             </div>
//             {i < steps.length - 1 && <div className="w-8 h-0.5 bg-stone-200 flex-shrink-0" />}
//           </div>
//         ))}
//       </div>

//       <div className="grid lg:grid-cols-3 gap-8">
//         {/* Main form */}
//         <div className="lg:col-span-2">

//           {/* STEP 1: Address */}
//           {step === 'address' && (
//             <div className="bg-white rounded-2xl border border-stone-100 p-6 space-y-5">
//               <h2 className="font-bold text-lg text-stone-900">Delivery Address</h2>
//               <div className="grid sm:grid-cols-2 gap-4">
//                 <div className="sm:col-span-2">
//                   <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1 block">Full Name *</label>
//                   <input
//                     value={address.fullName}
//                     onChange={(e) => updateAddr('fullName', e.target.value)}
//                     placeholder="Rahul Mehta"
//                     className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
//                   />
//                 </div>
//                 <div>
//                   <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1 block">Phone *</label>
//                   <input
//                     value={address.phone}
//                     onChange={(e) => updateAddr('phone', e.target.value)}
//                     placeholder="9876543210"
//                     maxLength={10}
//                     className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
//                   />
//                 </div>
//                 <div>
//                   <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1 block">Pincode *</label>
//                   <input
//                     value={address.pincode}
//                     onChange={(e) => updateAddr('pincode', e.target.value)}
//                     placeholder="411001"
//                     maxLength={6}
//                     className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
//                   />
//                 </div>
//                 <div className="sm:col-span-2">
//                   <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1 block">Address Line 1 *</label>
//                   <input
//                     value={address.line1}
//                     onChange={(e) => updateAddr('line1', e.target.value)}
//                     placeholder="House / Flat / Block No., Street"
//                     className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
//                   />
//                 </div>
//                 <div className="sm:col-span-2">
//                   <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1 block">Address Line 2</label>
//                   <input
//                     value={address.line2}
//                     onChange={(e) => updateAddr('line2', e.target.value)}
//                     placeholder="Landmark, Colony, Area (optional)"
//                     className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
//                   />
//                 </div>
//                 <div>
//                   <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1 block">City *</label>
//                   <input
//                     value={address.city}
//                     onChange={(e) => updateAddr('city', e.target.value)}
//                     placeholder="Pune"
//                     className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
//                   />
//                 </div>
//                 <div>
//                   <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1 block">State *</label>
//                   <select
//                     value={address.state}
//                     onChange={(e) => updateAddr('state', e.target.value)}
//                     className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 bg-white transition-all"
//                   >
//                     <option value="">Select state</option>
//                     {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
//                   </select>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setStep('payment')}
//                 disabled={!addrValid}
//                 className="w-full bg-stone-900 hover:bg-stone-700 disabled:bg-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl text-sm transition-all hover:shadow-lg"
//               >
//                 Continue to Payment →
//               </button>
//             </div>
//           )}

//           {/* STEP 2: Payment */}
//           {step === 'payment' && (
//             <div className="bg-white rounded-2xl border border-stone-100 p-6 space-y-5">
//               <h2 className="font-bold text-lg text-stone-900">Payment Method</h2>
//               <div className="space-y-3">
//                 {PAYMENT_METHODS.map((pm) => (
//                   <label
//                     key={pm.id}
//                     className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
//                       paymentMethod === pm.id
//                         ? 'border-stone-900 bg-stone-50'
//                         : 'border-stone-100 hover:border-stone-300'
//                     }`}
//                   >
//                     <input
//                       type="radio"
//                       name="payment"
//                       value={pm.id}
//                       checked={paymentMethod === pm.id}
//                       onChange={() => setPaymentMethod(pm.id)}
//                       className="accent-stone-900 w-4 h-4"
//                     />
//                     <span className="text-2xl">{pm.icon}</span>
//                     <div>
//                       <div className="font-semibold text-stone-800 text-sm">{pm.label}</div>
//                       <div className="text-xs text-stone-400">{pm.sub}</div>
//                     </div>
//                   </label>
//                 ))}
//               </div>
//               <div className="flex gap-3">
//                 <button onClick={() => setStep('address')} className="flex-1 border border-stone-200 text-stone-600 font-semibold py-3 rounded-xl text-sm hover:bg-stone-50 transition-colors">
//                   ← Back
//                 </button>
//                 <button onClick={() => setStep('review')} className="flex-1 bg-stone-900 hover:bg-stone-700 text-white font-bold py-3 rounded-xl text-sm transition-all hover:shadow-lg">
//                   Review Order →
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* STEP 3: Review */}
//           {step === 'review' && (
//             <div className="bg-white rounded-2xl border border-stone-100 p-6 space-y-6">
//               <h2 className="font-bold text-lg text-stone-900">Review Your Order</h2>

//               {/* Delivery summary */}
//               <div className="bg-stone-50 rounded-xl p-4 space-y-1 text-sm">
//                 <p className="font-semibold text-stone-700 flex items-center gap-2">📍 Delivering to</p>
//                 <p className="text-stone-600">{address.fullName} · {address.phone}</p>
//                 <p className="text-stone-500">{address.line1}{address.line2 ? `, ${address.line2}` : ''}, {address.city}, {address.state} - {address.pincode}</p>
//               </div>

//               {/* Payment summary */}
//               <div className="bg-stone-50 rounded-xl p-4 text-sm">
//                 <p className="font-semibold text-stone-700 flex items-center gap-2">
//                   💳 Payment via {PAYMENT_METHODS.find((p) => p.id === paymentMethod)?.label}
//                 </p>
//               </div>

//               {/* Items */}
//               <div className="space-y-3">
//                 {state.items.map((item) => (
//                   <div key={item.id} className="flex items-center gap-3">
//                     <span className="text-2xl w-10 text-center">{item.emoji}</span>
//                     <div className="flex-1 text-sm">
//                       <p className="font-medium text-stone-800">{item.name}</p>
//                       <p className="text-stone-400 text-xs">Qty: {item.qty} × ₹{item.price}</p>
//                     </div>
//                     <span className="font-bold text-stone-900 text-sm">₹{item.price * item.qty}</span>
//                   </div>
//                 ))}
//               </div>

//               <div className="flex gap-3 pt-2">
//                 <button onClick={() => setStep('payment')} className="flex-1 border border-stone-200 text-stone-600 font-semibold py-3 rounded-xl text-sm hover:bg-stone-50 transition-colors">
//                   ← Back
//                 </button>
//                 <button
//                   onClick={placeOrder}
//                   disabled={placing}
//                   className="flex-1 bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold py-3 rounded-xl text-sm transition-all hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
//                 >
//                   {placing ? <><Spinner /> Placing Order…</> : `🎉 Place Order · ₹${total}`}
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Order summary sidebar */}
//         <div className="lg:col-span-1">
//           <div className="bg-white rounded-2xl border border-stone-100 p-5 space-y-4 sticky top-24">
//             <h3 className="font-bold text-stone-900">Order Summary</h3>
//             <div className="space-y-2 max-h-56 overflow-y-auto">
//               {state.items.map((item) => (
//                 <div key={item.id} className="flex items-center gap-2 text-sm">
//                   <span className="text-xl w-7 text-center">{item.emoji}</span>
//                   <span className="flex-1 text-stone-600 truncate">{item.name} ×{item.qty}</span>
//                   <span className="font-semibold text-stone-800">₹{item.price * item.qty}</span>
//                 </div>
//               ))}
//             </div>
//             <div className="border-t border-stone-100 pt-3 space-y-2 text-sm">
//               <div className="flex justify-between text-stone-500">
//                 <span>Subtotal</span><span>₹{totalPrice}</span>
//               </div>
//               <div className="flex justify-between text-stone-500">
//                 <span>Delivery</span>
//                 <span className={deliveryFee === 0 ? 'text-emerald-600 font-semibold' : ''}>
//                   {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
//                 </span>
//               </div>
//               <div className="flex justify-between font-bold text-stone-900 text-base border-t pt-2">
//                 <span>Total</span><span>₹{total}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }



import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { useCoupon } from '../context/CouponContext'
import { Spinner } from '../component/ui'
import CouponBox from '../component/coupon/CouponBox'
import type { Address } from '../types'

type Step = 'address' | 'payment' | 'review'

const INDIAN_STATES = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Odisha', 'Punjab', 'Rajasthan', 'Tamil Nadu',
  'Telangana', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
]

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI', icon: '📱', sub: 'Pay via PhonePe, GPay, Paytm' },
  { id: 'card', label: 'Credit / Debit Card', icon: '💳', sub: 'Visa, Mastercard, RuPay' },
  { id: 'netbanking', label: 'Net Banking', icon: '🏦', sub: 'All major Indian banks' },
  { id: 'cod', label: 'Cash on Delivery', icon: '💵', sub: 'Pay when your order arrives' },
]

export default function CheckoutPage() {
  const { state, totalPrice, deliveryFee, clearCart } = useCart()
  const { addToast } = useToast()
  const { appliedCoupon, discount } = useCoupon()
  const navigate = useNavigate()

  const [step, setStep] = useState<Step>('address')
  const [placing, setPlacing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('upi')
  const [address, setAddress] = useState<Address>({
    fullName: '', phone: '', pincode: '', line1: '', line2: '', city: '', state: '',
  })

  const total = totalPrice + deliveryFee - discount

  if (state.items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <span className="text-6xl">🛒</span>
        <h2 className="font-display font-bold text-2xl text-stone-800">Nothing to checkout</h2>
        <Link to="/" className="bg-stone-900 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-stone-700">
          Go Shopping
        </Link>
      </div>
    )
  }

  const steps: { id: Step; label: string }[] = [
    { id: 'address', label: 'Address' },
    { id: 'payment', label: 'Payment' },
    { id: 'review', label: 'Review' },
  ]

  async function placeOrder() {
    setPlacing(true)
    // Simulate API call — replace with real backend when ready
    await new Promise((r) => setTimeout(r, 1500))
    const orderId = `SB${Date.now().toString().slice(-6)}`
    clearCart()
    addToast('Order placed successfully! 🎉')
    navigate(`/order-success?id=${orderId}`)
  }

  function updateAddr(k: keyof Address, v: string) {
    setAddress((a) => ({ ...a, [k]: v }))
  }

  const addrValid =
    address.fullName && address.phone.length >= 10 && address.pincode.length === 6 &&
    address.line1 && address.city && address.state

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="font-display font-bold text-3xl text-stone-900 mb-8">Checkout</h1>

      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-10">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center gap-3">
            <div className={`flex items-center gap-2 ${step === s.id ? 'text-stone-900' : steps.indexOf({ id: step, label: '' }) > i ? 'text-emerald-600' : 'text-stone-300'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${step === s.id
                ? 'border-stone-900 bg-stone-900 text-white'
                : (step === 'payment' && s.id === 'address') || (step === 'review')
                  ? 'border-emerald-500 bg-emerald-500 text-white'
                  : 'border-stone-200 text-stone-300'
                }`}>
                {(step === 'payment' && s.id === 'address') || step === 'review' && s.id !== 'review' ? '✓' : i + 1}
              </div>
              <span className="text-sm font-semibold hidden sm:block">{s.label}</span>
            </div>
            {i < steps.length - 1 && <div className="w-8 h-0.5 bg-stone-200 flex-shrink-0" />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main form */}
        <div className="lg:col-span-2">

          {/* STEP 1: Address */}
          {step === 'address' && (
            <div className="bg-white rounded-2xl border border-stone-100 p-6 space-y-5">
              <h2 className="font-bold text-lg text-stone-900">Delivery Address</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1 block">Full Name *</label>
                  <input
                    value={address.fullName}
                    onChange={(e) => updateAddr('fullName', e.target.value)}
                    placeholder="Rahul Mehta"
                    className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1 block">Phone *</label>
                  <input
                    value={address.phone}
                    onChange={(e) => updateAddr('phone', e.target.value)}
                    placeholder="9876543210"
                    maxLength={10}
                    className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1 block">Pincode *</label>
                  <input
                    value={address.pincode}
                    onChange={(e) => updateAddr('pincode', e.target.value)}
                    placeholder="411001"
                    maxLength={6}
                    className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1 block">Address Line 1 *</label>
                  <input
                    value={address.line1}
                    onChange={(e) => updateAddr('line1', e.target.value)}
                    placeholder="House / Flat / Block No., Street"
                    className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1 block">Address Line 2</label>
                  <input
                    value={address.line2}
                    onChange={(e) => updateAddr('line2', e.target.value)}
                    placeholder="Landmark, Colony, Area (optional)"
                    className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1 block">City *</label>
                  <input
                    value={address.city}
                    onChange={(e) => updateAddr('city', e.target.value)}
                    placeholder="Pune"
                    className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1 block">State *</label>
                  <select
                    value={address.state}
                    onChange={(e) => updateAddr('state', e.target.value)}
                    className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 bg-white transition-all"
                  >
                    <option value="">Select state</option>
                    {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <button
                onClick={() => setStep('payment')}
                disabled={!addrValid}
                className="w-full bg-stone-900 hover:bg-stone-700 disabled:bg-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl text-sm transition-all hover:shadow-lg"
              >
                Continue to Payment →
              </button>
            </div>
          )}

          {/* STEP 2: Payment */}
          {step === 'payment' && (
            <div className="bg-white rounded-2xl border border-stone-100 p-6 space-y-5">
              <h2 className="font-bold text-lg text-stone-900">Payment Method</h2>
              <div className="space-y-3">
                {PAYMENT_METHODS.map((pm) => (
                  <label
                    key={pm.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === pm.id
                      ? 'border-stone-900 bg-stone-50'
                      : 'border-stone-100 hover:border-stone-300'
                      }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={pm.id}
                      checked={paymentMethod === pm.id}
                      onChange={() => setPaymentMethod(pm.id)}
                      className="accent-stone-900 w-4 h-4"
                    />
                    <span className="text-2xl">{pm.icon}</span>
                    <div>
                      <div className="font-semibold text-stone-800 text-sm">{pm.label}</div>
                      <div className="text-xs text-stone-400">{pm.sub}</div>
                    </div>
                  </label>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep('address')} className="flex-1 border border-stone-200 text-stone-600 font-semibold py-3 rounded-xl text-sm hover:bg-stone-50 transition-colors">
                  ← Back
                </button>
                <button onClick={() => setStep('review')} className="flex-1 bg-stone-900 hover:bg-stone-700 text-white font-bold py-3 rounded-xl text-sm transition-all hover:shadow-lg">
                  Review Order →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Review */}
          {step === 'review' && (
            <div className="bg-white rounded-2xl border border-stone-100 p-6 space-y-6">
              <h2 className="font-bold text-lg text-stone-900">Review Your Order</h2>

              {/* Delivery summary */}
              <div className="bg-stone-50 rounded-xl p-4 space-y-1 text-sm">
                <p className="font-semibold text-stone-700 flex items-center gap-2">📍 Delivering to</p>
                <p className="text-stone-600">{address.fullName} · {address.phone}</p>
                <p className="text-stone-500">{address.line1}{address.line2 ? `, ${address.line2}` : ''}, {address.city}, {address.state} - {address.pincode}</p>
              </div>

              {/* Payment summary */}
              <div className="bg-stone-50 rounded-xl p-4 text-sm">
                <p className="font-semibold text-stone-700 flex items-center gap-2">
                  💳 Payment via {PAYMENT_METHODS.find((p) => p.id === paymentMethod)?.label}
                </p>
              </div>

              {/* Items */}
              <div className="space-y-3">
                {state.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <span className="text-2xl w-10 text-center">{item.emoji}</span>
                    <div className="flex-1 text-sm">
                      <p className="font-medium text-stone-800">{item.name}</p>
                      <p className="text-stone-400 text-xs">Qty: {item.qty} × ₹{item.price}</p>
                    </div>
                    <span className="font-bold text-stone-900 text-sm">₹{item.price * item.qty}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep('payment')} className="flex-1 border border-stone-200 text-stone-600 font-semibold py-3 rounded-xl text-sm hover:bg-stone-50 transition-colors">
                  ← Back
                </button>
                <button
                  onClick={placeOrder}
                  disabled={placing}
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold py-3 rounded-xl text-sm transition-all hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {placing ? <><Spinner /> Placing Order…</> : `🎉 Place Order · ₹${Math.max(0, total)}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-stone-100 p-5 space-y-4 sticky top-24">
            <h3 className="font-bold text-stone-900">Order Summary</h3>
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {state.items.map((item) => (
                <div key={item.id} className="flex items-center gap-2 text-sm">
                  <span className="text-xl w-7 text-center">{item.emoji}</span>
                  <span className="flex-1 text-stone-600 truncate">{item.name} ×{item.qty}</span>
                  <span className="font-semibold text-stone-800">₹{item.price * item.qty}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-stone-100 pt-3 space-y-2 text-sm">
              <div className="flex justify-between text-stone-500">
                <span>Subtotal</span><span>₹{totalPrice}</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Delivery</span>
                <span className={deliveryFee === 0 ? 'text-emerald-600 font-semibold' : ''}>
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Coupon ({appliedCoupon?.code})</span>
                  <span>-₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-stone-900 text-base border-t pt-2">
                <span>Total</span><span>₹{Math.max(0, total)}</span>
              </div>
            </div>
            <CouponBox cartTotal={totalPrice} />
          </div>
        </div>
      </div>
    </div>
  )
}

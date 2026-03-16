export interface Product {
  id: number
  name: string
  slug: string
  category: 'bananas' | 'chips' | 'combos'
  price: number
  originalPrice: number
  weight: string
  rating: number
  reviews: number
  badge?: string
  badgeColor?: 'amber' | 'coral' | 'green' | 'purple' | 'teal' | 'yellow'
  description: string
  longDescription: string
  tags: string[]
  emoji: string
  inStock: boolean
  stock: number
  featured: boolean
  nutrition?: {
    calories: number
    carbs: string
    protein: string
    fat: string
    fiber: string
  }
}

export interface CartItem extends Product {
  qty: number
}

export interface Address {
  fullName: string
  phone: string
  pincode: string
  line1: string
  line2: string
  city: string
  state: string
}

export interface Order {
  id: string
  items: CartItem[]
  address: Address
  paymentMethod: string
  total: number
  deliveryFee: number
  placedAt: string
  status: 'placed' | 'confirmed' | 'shipped' | 'delivered'
}

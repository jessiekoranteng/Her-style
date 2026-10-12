export interface Product {
  id: string
  name: string
  slug: string
  description: string
  shortDescription: string
  price: number
  compareAtPrice?: number
  images: string[]
  category: string
  tags: string[]
  variants: ProductVariant[]
  inventory: number
  sku: string
  weight?: number
  dimensions?: {
    length: number
    width: number
    height: number
  }
  isActive: boolean
  isFeatured: boolean
  createdAt: string
  updatedAt: string
}

export interface ProductVariant {
  id: string
  name: string
  sku: string
  price: number
  inventory: number
  options: Record<string, string>
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  image: string
  parentId?: string
  isActive: boolean
  sortOrder: number
}

export interface CartItem {
  id: string
  productId: string
  variantId?: string
  quantity: number
  product: Product
  variant?: ProductVariant
}

export interface ShippingAddress {
  firstName: string
  lastName: string
  email: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface BillingAddress extends ShippingAddress {}

export interface Order {
  id: string
  orderNumber: string
  status: OrderStatus
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  discount: number
  total: number
  currency: string
  shippingAddress: ShippingAddress
  billingAddress: BillingAddress
  paymentMethod: string
  paymentStatus: PaymentStatus
  paymentReference?: string
  notes?: string
  createdAt: string
  updatedAt: string
  shippedAt?: string
  deliveredAt?: string
}

export interface OrderItem {
  id: string
  productId: string
  variantId?: string
  productName: string
  variantName?: string
  sku: string
  price: number
  quantity: number
  total: number
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded"

export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded"
  | "partially_refunded"

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  avatar?: string
  addresses: Address[]
  orders: string[]
  createdAt: string
  updatedAt: string
}

export interface Address {
  id: string
  type: "shipping" | "billing"
  isDefault: boolean
  firstName: string
  lastName: string
  company?: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone?: string
}

export interface Review {
  id: string
  productId: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  title: string
  content: string
  isVerifiedPurchase: boolean
  createdAt: string
}

export interface WishlistItem {
  id: string
  productId: string
  userId: string
  createdAt: string
}
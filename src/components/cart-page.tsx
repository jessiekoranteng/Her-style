"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useCartStore } from "@/lib/store"
import { ShoppingBag, ArrowLeft, ArrowRight, Trash2 } from "lucide-react"

export function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getSubtotal, getItemCount } = useCartStore()
  const subtotal = getSubtotal()
  const shipping = subtotal > 100000 ? 0 : 15000
  const total = subtotal + shipping
  const itemCount = getItemCount()

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-100 to-neutral-200" />
        <div className="container-custom h-full flex items-center">
          <div className="max-w-2xl animate-slide-up">
            <p className="text-black/50 text-sm uppercase tracking-widest mb-4">YOUR BAG</p>
            <h1 className="font-display font-medium text-4xl sm:text-5xl mb-2">Shopping Bag</h1>
            <p className="text-neutral-600 text-lg">{itemCount} {itemCount === 1 ? "item" : "items"} in your bag</p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="h-16 w-16 mx-auto text-neutral-300 mb-6" />
              <h2 className="font-display font-medium text-3xl text-neutral-900 mb-4">Your bag is empty</h2>
              <p className="text-neutral-600 mb-8 max-w-md mx-auto">
                Looks like you haven’t added any products yet. Start shopping to fill your bag with beautiful pieces.
              </p>
              <Link href="/shop" className="btn-primary inline-flex">
                Continue Shopping
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>
          ) : (
            <>
              <div className="grid lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
                    <h2 className="font-medium text-neutral-900">
                      Bag ({itemCount} {itemCount === 1 ? "item" : "items"})
                    </h2>
                    <button
                      onClick={clearCart}
                      className="text-sm text-neutral-500 hover:text-black transition-colors"
                    >
                      Clear all
                    </button>
                  </div>

                  <div className="space-y-4">
                    {items.map((item) => (
                      <CartItem
                        key={item.id}
                        item={item}
                        onRemove={removeItem}
                        onUpdateQuantity={updateQuantity}
                      />
                    ))}
                  </div>

                  <div className="flex justify-between pt-4 border-t border-neutral-200">
                    <Link
                      href="/shop"
                      className="btn-outline"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Continue Shopping
                    </Link>
                    <Link
                      href="/checkout"
                      className="btn-primary"
                    >
                      Proceed to Checkout
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <div className="sticky top-24 bg-neutral-50 rounded-lg p-6">
                    <h2 className="font-medium text-neutral-900 mb-6">Order Summary</h2>
                    <div className="space-y-4">
                      <div className="flex justify-between text-neutral-600">
                        <span>Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})</span>
                        <span className="font-medium text-neutral-900">GHS {subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-neutral-600">
                        <span>Shipping</span>
                        <span className="font-medium text-neutral-900">
                          {shipping === 0 ? (
                            <span className="text-emerald-600">Free</span>
                          ) : (
                            `GHS ${shipping.toLocaleString()}`
                          )}
                        </span>
                      </div>
                      {shipping > 0 && (
                        <p className="text-xs text-neutral-500">
                          Free shipping on orders over GHS 100,000
                        </p>
                      )}
                      <div className="flex justify-between text-base font-semibold text-neutral-900 border-t border-neutral-200 pt-4">
                        <span>Total</span>
                        <span>GHS {total.toLocaleString()}</span>
                      </div>
                    </div>
                    <Link
                      href="/checkout"
                      className="btn-primary w-full mt-6 py-3"
                    >
                      Proceed to Checkout
                    </Link>
                    <p className="text-xs text-neutral-500 text-center mt-4">
                      Shipping and taxes calculated at checkout
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-16 py-12 border-y border-neutral-200">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div className="trust-item">
                    <div className="trust-icon">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-10V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1M13 16h8a1 1 0 001-1V8a1 1 0 00-1-1h-1M5 16h8a1 1 0 001-1v-1a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1z" /></svg>
                    </div>
                    <h4 className="font-medium text-sm text-neutral-900">Fast Delivery</h4>
                    <p className="text-xs text-neutral-500">Get your orders on time</p>
                  </div>
                  <div className="trust-item">
                    <div className="trust-icon">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    </div>
                    <h4 className="font-medium text-sm text-neutral-900">Secure Payment</h4>
                    <p className="text-xs text-neutral-500">100% secure checkout</p>
                  </div>
                  <div className="trust-item">
                    <div className="trust-icon">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    </div>
                    <h4 className="font-medium text-sm text-neutral-900">Easy Returns</h4>
                    <p className="text-xs text-neutral-500">Hassle-free returns</p>
                  </div>
                  <div className="trust-item">
                    <div className="trust-icon">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    </div>
                    <h4 className="font-medium text-sm text-neutral-900">Support</h4>
                    <p className="text-xs text-neutral-500">We’re here to help</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}

function CartItem({
  item,
  onRemove,
  onUpdateQuantity,
}: {
  item: {
    id: string
    productId: string
    variantId?: string
    quantity: number
    product: {
      name: string
      slug: string
      price: number
      images: string[]
    }
    variant?: {
      name: string
      price: number
    }
  }
  onRemove: (id: string) => void
  onUpdateQuantity: (id: string, quantity: number) => void
}) {
  const price = item.variant?.price ?? item.product.price
  const image = item.product.images[0]
  const variantName = item.variant?.name
  const lineTotal = price * item.quantity

  return (
    <div className="flex gap-4 p-4 bg-white border border-neutral-200 rounded-lg hover:border-neutral-300 transition-colors">
      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
        {image ? (
          <Image
            src={image}
            alt={item.product.name}
            fill
            className="object-cover"
            sizes="96px"
          />
        ) : (
          <div className="h-full w-full bg-neutral-200" />
        )}
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <Link
            href={`/product/${item.product.slug}`}
            className="font-medium text-neutral-900 hover:text-black transition-colors truncate block"
          >
            {item.product.name}
          </Link>
          {variantName && (
            <p className="text-sm text-neutral-500 mt-1">{variantName}</p>
          )}
          <p className="text-sm font-semibold text-neutral-900 mt-1">
            GHS {price.toLocaleString()}
          </p>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2 border border-neutral-300 rounded-lg">
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              className="h-10 w-10 flex items-center justify-center text-neutral-500 hover:bg-neutral-100 transition-colors"
              aria-label="Decrease quantity"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4"/></svg>
            </button>
            <span className="w-10 text-center font-medium">{item.quantity}</span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="h-10 w-10 flex items-center justify-center text-neutral-500 hover:bg-neutral-100 transition-colors"
              aria-label="Increase quantity"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
            </button>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-semibold text-neutral-900">
              GHS {lineTotal.toLocaleString()}
            </span>
            <button
              onClick={() => onRemove(item.id)}
              className="text-neutral-400 hover:text-red-500 transition-colors"
              aria-label="Remove item"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

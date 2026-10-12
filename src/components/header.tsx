"use client"

import * as React from "react"
import Link from "next/link"
import { useCartStore } from "@/lib/store"
import {
  ShoppingBag,
  Search,
  User,
  Menu,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

export function Header() {
  const { items, isOpen, toggleCart, getItemCount } = useCartStore()
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const [isSearchOpen, setIsSearchOpen] = React.useState(false)
  const itemCount = getItemCount()

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop", hasDropdown: true },
    { href: "/new-arrivals", label: "New Arrivals" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-200">
      <nav className="container-custom" aria-label="Main navigation">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3" aria-label="HerStyle Home">
              <div className="h-10 w-10 rounded-full bg-black flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                </svg>
              </div>
              <div className="hidden sm:block">
                <span className="text-2xl font-display font-medium text-black">HerStyle</span>
                <p className="text-xs text-neutral-500 uppercase tracking-wider leading-none">CLOTHES • LACES • ACCESSORIES • SHOES • BAGS</p>
              </div>
            </Link>

            <div className="hidden lg:flex lg:gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-neutral-700 transition-colors hover:text-black"
                >
                  {link.label}
                  {link.hasDropdown && (
                    <svg className="ml-1 inline h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            <Link
              href="/account"
              className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 transition-colors"
              aria-label="Account"
            >
              <User className="h-5 w-5" />
            </Link>

            <button
              onClick={() => toggleCart()}
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 transition-colors"
              aria-label={`Shopping bag${itemCount > 0 ? ` with ${itemCount} items` : ""}`}
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black text-white text-xs font-bold">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden h-10 w-10 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 transition-colors"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isSearchOpen && (
          <div className="lg:hidden py-4 border-t border-neutral-200 animate-slide-down">
            <form className="flex gap-2" role="search">
              <label htmlFor="mobile-search" className="sr-only">
                Search products
              </label>
              <input
                id="mobile-search"
                type="search"
                placeholder="Search products..."
                className="flex-1 h-11 rounded-lg border border-neutral-300 bg-white px-4 text-neutral-900 placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
              />
              <button type="submit" className="h-11 px-6 bg-black text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors">
                Search
              </button>
            </form>
          </div>
        )}
      </nav>

      {isMenuOpen && (
        <div className="lg:hidden border-t border-neutral-200 bg-white animate-slide-down">
          <div className="container-custom px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-3 rounded-lg text-base font-medium text-neutral-700 hover:bg-neutral-100"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-4 pt-4 border-t border-neutral-200">
              <Link
                href="/account"
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-base font-medium text-neutral-700 hover:bg-neutral-100"
              >
                <User className="h-5 w-5" />
                Account
              </Link>
            </div>
          </div>
        </div>
      )}

      <CartDrawer />
    </header>
  )
}

function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal } =
    useCartStore()
  const subtotal = getSubtotal()
  const shipping = subtotal > 100000 ? 0 : 15000
  const total = subtotal + shipping

  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
        onClick={closeCart}
        aria-hidden="true"
      />
      <aside
        className={cn(
          "fixed right-0 top-20 z-50 h-[calc(100vh-5rem)] w-full max-w-md bg-white border-l border-neutral-200 shadow-2xl flex flex-col overflow-hidden",
          "animate-slide-in-right"
        )}
        role="dialog"
        aria-label="Shopping bag"
      >
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <h2 className="text-lg font-display font-medium">Shopping Bag</h2>
          <button
            onClick={closeCart}
            className="h-10 w-10 rounded-full text-neutral-500 hover:bg-neutral-100 transition-colors"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="h-16 w-16 text-neutral-300 mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">
                Your bag is empty
              </h3>
              <p className="text-neutral-500 mb-6">
                Looks like you haven't added any products yet.
              </p>
              <button
                onClick={closeCart}
                className="btn-primary w-full sm:w-auto"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <CartItem key={item.id} item={item} onRemove={removeItem} onUpdateQuantity={updateQuantity} />
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-neutral-200 p-4 space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span>GHS {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-emerald-600 font-medium">Free</span>
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
              <div className="flex justify-between text-base font-semibold text-neutral-900 border-t border-neutral-200 pt-2">
                <span>Total</span>
                <span>GHS {total.toLocaleString()}</span>
              </div>
            </div>
            <button
              className="btn-primary w-full"
              onClick={() => { closeCart(); window.location.href = "/checkout"; }}
            >
              Proceed to Checkout
            </button>
            <button
              className="btn-secondary w-full"
              onClick={closeCart}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </aside>
    </>
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

  return (
    <div className="flex gap-4 p-2 bg-neutral-50 rounded-lg">
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
        {image ? (
          <img
            src={image}
            alt={item.product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-neutral-200" />
        )}
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <h4 className="font-medium text-neutral-900 truncate">
            {item.product.name}
          </h4>
          {variantName && (
            <p className="text-sm text-neutral-500">
              {variantName}
            </p>
          )}
          <p className="text-sm font-semibold text-neutral-900 mt-1">
            GHS {price.toLocaleString()}
          </p>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2 border border-neutral-300 rounded-lg">
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              className="h-8 w-8 flex items-center justify-center text-neutral-500 hover:bg-neutral-100 transition-colors"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-8 text-center font-medium">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="h-8 w-8 flex items-center justify-center text-neutral-500 hover:bg-neutral-100 transition-colors"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <button
            onClick={() => onRemove(item.id)}
            className="text-neutral-400 hover:text-red-500 transition-colors"
            aria-label="Remove item"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
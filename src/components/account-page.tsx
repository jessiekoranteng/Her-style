"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { User, Package, Heart, Settings, LogOut, CreditCard, MapPin, Bell } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/account", label: "Overview", icon: User },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/account/payment", label: "Payment Methods", icon: CreditCard },
  { href: "/account/notifications", label: "Notifications", icon: Bell },
  { href: "/account/settings", label: "Settings", icon: Settings },
]

export function AccountPage() {
  const [activeTab, setActiveTab] = React.useState("overview")

  // Mock user data
  const user: {
    name: string
    email: string
    phone: string
    memberSince: string
    avatar: string | null
  } = {
    name: "Ama Serwaa",
    email: "ama.serwaa@email.com",
    phone: "+233 20 123 4567",
    memberSince: "January 2024",
    avatar: null,
  }

  const recentOrders = [
    { id: "HS2024001", date: "2024-06-15", status: "Delivered", total: 450, items: 1 },
    { id: "HS2024002", date: "2024-05-28", status: "Shipped", total: 890, items: 2 },
    { id: "HS2024003", date: "2024-05-10", status: "Delivered", total: 320, items: 1 },
  ]

  const wishlistCount = 5
  const addressesCount = 2

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-8 animate-slide-up">
            <div className="bg-neutral-50 rounded-lg p-6">
              <h2 className="font-medium text-neutral-900 mb-4">Welcome back, {user.name.split(" ")[0]}!</h2>
              <p className="text-neutral-600">Here’s a quick summary of your account activity.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <AccountStatCard icon={Package} label="Total Orders" value="12" href="/account/orders" />
              <AccountStatCard icon={Heart} label="Wishlist Items" value={wishlistCount} href="/account/wishlist" />
              <AccountStatCard icon={MapPin} label="Saved Addresses" value={addressesCount} href="/account/addresses" />
              <AccountStatCard icon={CreditCard} label="Payment Methods" value="1" href="/account/payment" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-neutral-900">Recent Orders</h3>
                <Link href="/account/orders" className="link-arrow text-sm">View All</Link>
              </div>
              <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-200">
                      <th className="text-left p-4 font-medium text-sm text-neutral-700">Order</th>
                      <th className="text-left p-4 font-medium text-sm text-neutral-700">Date</th>
                      <th className="text-left p-4 font-medium text-sm text-neutral-700">Status</th>
                      <th className="text-right p-4 font-medium text-sm text-neutral-700">Total</th>
                      <th className="text-right p-4 font-medium text-sm text-neutral-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map(order => (
                      <tr key={order.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                        <td className="p-4 font-medium text-neutral-900">{order.id}</td>
                        <td className="p-4 text-neutral-600">{new Date(order.date).toLocaleDateString("en-GH", { year: "numeric", month: "short", day: "numeric" })}</td>
                        <td className="p-4">
                          <span className={cn(
                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                            order.status === "Delivered" && "bg-emerald-100 text-emerald-800",
                            order.status === "Shipped" && "bg-blue-100 text-blue-800",
                            order.status === "Processing" && "bg-amber-100 text-amber-800",
                            order.status === "Pending" && "bg-neutral-100 text-neutral-800",
                          )}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4 text-right font-medium text-neutral-900">GHS {order.total.toLocaleString()}</td>
                        <td className="p-4 text-right">
                          <Link href={`/account/orders/${order.id}`} className="text-sm text-black hover:underline">View</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )

      case "orders":
        return (
          <div className="animate-slide-up">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display font-medium text-2xl">My Orders</h2>
            </div>
            <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-200">
                    <th className="text-left p-4 font-medium text-sm text-neutral-700">Order Number</th>
                    <th className="text-left p-4 font-medium text-sm text-neutral-700">Date</th>
                    <th className="text-left p-4 font-medium text-sm text-neutral-700">Items</th>
                    <th className="text-left p-4 font-medium text-sm text-neutral-700">Status</th>
                    <th className="text-right p-4 font-medium text-sm text-neutral-700">Total</th>
                    <th className="text-right p-4 font-medium text-sm text-neutral-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => (
                    <tr key={order.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                      <td className="p-4 font-medium text-neutral-900">{order.id}</td>
                      <td className="p-4 text-neutral-600">{new Date(order.date).toLocaleDateString("en-GH", { year: "numeric", month: "short", day: "numeric" })}</td>
                      <td className="p-4 text-neutral-600">{order.items} {order.items === 1 ? "item" : "items"}</td>
                      <td className="p-4">
                        <span className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                          order.status === "Delivered" && "bg-emerald-100 text-emerald-800",
                          order.status === "Shipped" && "bg-blue-100 text-blue-800",
                          order.status === "Processing" && "bg-amber-100 text-amber-800",
                        )}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 text-right font-medium text-neutral-900">GHS {order.total.toLocaleString()}</td>
                      <td className="p-4 text-right">
                        <Link href={`/account/orders/${order.id}`} className="text-sm text-black hover:underline">View Details</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )

      case "wishlist":
        return (
          <div className="animate-slide-up">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display font-medium text-2xl">My Wishlist</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[
                { id: 1, name: "Elegant Maxi Dress", price: 450, image: "/images/products/dress-1.jpg" },
                { id: 2, name: "Premium Lace Fabric", price: 120, image: "/images/products/lace-1.jpg" },
                { id: 3, name: "Gold Plated Chain", price: 150, image: "/images/products/chain-1.jpg" },
                { id: 4, name: "Designer Handbag", price: 480, image: "/images/products/bag-1.jpg" },
              ].map(item => (
                <div key={item.id} className="bg-white border border-neutral-200 rounded-lg overflow-hidden hover:border-neutral-300 transition-colors">
                  <div className="relative aspect-square overflow-hidden bg-neutral-100">
                    <Image src={item.image} alt={item.name} fill sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
                    <button className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white shadow-md">
                      <Heart className="h-4 w-4 text-red-500 fill-current" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-neutral-900 mb-1 line-clamp-1">{item.name}</h3>
                    <p className="text-sm font-semibold text-neutral-900 mb-2">GHS {item.price.toLocaleString()}</p>
                    <div className="flex gap-2">
                      <button className="btn-secondary flex-1 text-sm py-2">Add to Bag</button>
                      <button className="btn-outline flex-1 text-sm py-2">Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case "addresses":
        return (
          <div className="animate-slide-up">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display font-medium text-2xl">Saved Addresses</h2>
              <button className="btn-primary text-sm">Add New Address</button>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { id: 1, type: "Home", isDefault: true, name: "Ama Serwaa", line1: "123 Oxford Street", city: "Accra", region: "Greater Accra", phone: "+233 20 123 4567" },
                { id: 2, type: "Work", isDefault: false, name: "Ama Serwaa", line1: "456 Independence Avenue", city: "Accra", region: "Greater Accra", phone: "+233 20 123 4567" },
              ].map(addr => (
                <div key={addr.id} className="bg-white border border-neutral-200 rounded-lg p-6 relative">
                  {addr.isDefault && (
                    <span className="absolute top-4 right-4 bg-black text-white text-xs px-2 py-1 rounded">Default</span>
                  )}
                  <div className="flex items-start justify-between mb-4">
                    <span className="font-medium text-neutral-900 capitalize">{addr.type}</span>
                    <div className="flex gap-2">
                      <button className="text-sm text-neutral-600 hover:text-black">Edit</button>
                      <button className="text-sm text-neutral-600 hover:text-red-500">Delete</button>
                    </div>
                  </div>
                  <address className="text-neutral-600 not-italic leading-relaxed">
                    {addr.name}<br />
                    {addr.line1}<br />
                    {addr.city}, {addr.region}<br />
                    Ghana<br />
                    {addr.phone}
                  </address>
                  {!addr.isDefault && (
                    <button className="mt-4 text-sm text-black hover:underline">Set as default</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )

      default:
        return (
          <div className="animate-slide-up">
            <h2 className="font-display font-medium text-2xl mb-4 capitalize">{activeTab.replace("-", " ")}</h2>
            <p className="text-neutral-600">This section is under development.</p>
          </div>
        )
    }
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[30vh] min-h-[250px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-100 to-neutral-200" />
        <div className="container-custom h-full flex items-center">
          <div className="max-w-2xl animate-slide-up">
            <p className="text-black/50 text-sm uppercase tracking-widest mb-4">MY ACCOUNT</p>
            <h1 className="font-display font-medium text-4xl sm:text-5xl mb-2">My Account</h1>
            <p className="text-neutral-600 text-lg">Manage your profile, orders, and preferences.</p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Sidebar Navigation */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="bg-neutral-50 rounded-lg p-6 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-full bg-black flex items-center justify-center flex-shrink-0">
                      {user.avatar ? (
                        <Image src={user.avatar} alt={user.name} fill sizes="64px" className="object-cover" />
                      ) : (
                        <span className="text-2xl font-display font-medium text-white">{user.name.charAt(0)}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-medium text-neutral-900 truncate">{user.name}</h3>
                      <p className="text-sm text-neutral-500 truncate">{user.email}</p>
                      <p className="text-xs text-neutral-400">Member since {user.memberSince}</p>
                    </div>
                  </div>
                </div>

                <nav className="space-y-1" aria-label="Account navigation">
                  {navItems.map(item => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={e => {
                        e.preventDefault()
                        setActiveTab(item.label.toLowerCase().replace(" ", "-"))
                      }}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                        activeTab === item.label.toLowerCase().replace(" ", "-")
                          ? "bg-black text-white"
                          : "text-neutral-600 hover:bg-neutral-100 hover:text-black"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  ))}
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-neutral-600 hover:bg-neutral-100 hover:text-red-500 transition-colors">
                    <LogOut className="h-5 w-5" />
                    Sign Out
                  </button>
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <main className="lg:col-span-3">
              {renderTabContent()}
            </main>
          </div>
        </div>
      </section>
    </div>
  )
}

function AccountStatCard({ icon: Icon, label, value, href }: { icon: React.ComponentType<{ className?: string }>, label: string, value: string | number, href: string }) {
  return (
    <Link href={href} className="bg-white border border-neutral-200 rounded-lg p-6 hover:border-neutral-300 hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-2">
        <Icon className="h-6 w-6 text-black" />
      </div>
      <p className="font-display font-medium text-3xl text-neutral-900">{value}</p>
      <p className="text-sm text-neutral-500 mt-1">{label}</p>
    </Link>
  )
}

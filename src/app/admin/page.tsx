import { Metadata } from "next"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { cn, formatPrice } from "@/lib/utils"
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  Tag,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Admin dashboard overview",
}

async function getStats() {
  const [totalProducts, totalOrders, totalCustomers, totalRevenue, recentOrders, lowStockProducts] = await Promise.all([
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.count(),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.order.aggregate({
      where: { paymentStatus: "PAID" },
      _sum: { total: true },
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { product: { select: { name: true } } } },
      },
    }),
    prisma.productVariant.findMany({
      where: { inventory: { lte: 10 }, product: { isActive: true } },
      take: 5,
      include: { product: { select: { name: true, slug: true } } },
      orderBy: { inventory: "asc" },
    }),
  ])

  return {
    totalProducts,
    totalOrders,
    totalCustomers,
    totalRevenue: totalRevenue._sum.total || 0,
    recentOrders,
    lowStockProducts,
  }
}

const statCards = [
  { name: "Total Products", value: "totalProducts", icon: Package, color: "bg-blue-500" },
  { name: "Total Orders", value: "totalOrders", icon: ShoppingCart, color: "bg-green-500" },
  { name: "Customers", value: "totalCustomers", icon: Users, color: "bg-purple-500" },
  { name: "Revenue", value: "totalRevenue", icon: DollarSign, color: "bg-orange-500", isCurrency: true },
]

export default async function AdminDashboard() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  const stats = await getStats()

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl border border-neutral-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">{stat.name}</p>
                <p className="mt-2 text-3xl font-bold text-neutral-900">
                  {stat.isCurrency
                    ? formatPrice(Number(stats[stat.value as keyof typeof stats]))
                    : String(stats[stat.value as keyof typeof stats])}
                </p>
              </div>
              <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center", stat.color)}>
                <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders & Low Stock */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-neutral-200">
          <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
            <h2 className="font-medium text-neutral-900">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-black hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-neutral-200">
            {stats.recentOrders.length === 0 ? (
              <div className="px-6 py-8 text-center text-neutral-500">No orders yet</div>
            ) : (
              stats.recentOrders.map((order) => (
                <div key={order.id} className="px-6 py-4 hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-neutral-900">{order.orderNumber}</p>
                      <p className="text-sm text-neutral-500">
                        {order.user.name || order.user.email} • {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-neutral-900">{formatPrice(Number(order.total))}</p>
                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                          order.status === "DELIVERED" && "bg-emerald-100 text-emerald-800",
                          order.status === "SHIPPED" && "bg-blue-100 text-blue-800",
                          order.status === "PROCESSING" && "bg-yellow-100 text-yellow-800",
                          order.status === "PENDING" && "bg-neutral-100 text-neutral-800",
                          order.status === "CANCELLED" && "bg-red-100 text-red-800"
                        )}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-xl border border-neutral-200">
          <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
            <h2 className="font-medium text-neutral-900 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-500" aria-hidden="true" />
              Low Stock Alert
            </h2>
          </div>
          <div className="divide-y divide-neutral-200">
            {stats.lowStockProducts.length === 0 ? (
              <div className="px-6 py-8 text-center text-neutral-500">All products well stocked</div>
            ) : (
              stats.lowStockProducts.map((variant) => (
                <div key={variant.id} className="px-6 py-4 hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-neutral-900">{variant.product.name}</p>
                      <p className="text-sm text-neutral-500">{variant.name}</p>
                    </div>
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                        variant.inventory === 0 ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
                      )}
                    >
                      {variant.inventory === 0 ? "Out of Stock" : `${variant.inventory} left`}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="font-medium text-neutral-900 mb-4">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/admin/products/new" className="btn-primary flex items-center justify-center gap-2">
            <Package className="h-5 w-5" aria-hidden="true" />
            Add Product
          </Link>
          <Link href="/admin/categories/new" className="btn-outline flex items-center justify-center gap-2">
            <Tag className="h-5 w-5" aria-hidden="true" />
            Add Category
          </Link>
          <Link href="/admin/orders" className="btn-outline flex items-center justify-center gap-2">
            <ShoppingCart className="h-5 w-5" aria-hidden="true" />
            View Orders
          </Link>
          <Link href="/admin/customers" className="btn-outline flex items-center justify-center gap-2">
            <Users className="h-5 w-5" aria-hidden="true" />
            Manage Customers
          </Link>
        </div>
      </div>
    </div>
  )
}

import { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { OrderStatus, type Prisma } from "@prisma/client"
import { ListFilters } from "@/components/admin/list-filters"
import { cn, formatPrice } from "@/lib/utils"
import { Truck, CheckCircle, Clock, XCircle, Package } from "lucide-react"

export const metadata: Metadata = {
  title: "Orders",
  description: "Manage customer orders",
}

const statusOptions = [
  { value: "PENDING", label: "Pending", icon: Clock, color: "bg-yellow-100 text-yellow-800" },
  { value: "CONFIRMED", label: "Confirmed", icon: CheckCircle, color: "bg-blue-100 text-blue-800" },
  { value: "PROCESSING", label: "Processing", icon: Package, color: "bg-purple-100 text-purple-800" },
  { value: "SHIPPED", label: "Shipped", icon: Truck, color: "bg-indigo-100 text-indigo-800" },
  { value: "DELIVERED", label: "Delivered", icon: CheckCircle, color: "bg-emerald-100 text-emerald-800" },
  { value: "CANCELLED", label: "Cancelled", icon: XCircle, color: "bg-red-100 text-red-800" },
  { value: "REFUNDED", label: "Refunded", icon: XCircle, color: "bg-neutral-100 text-neutral-800" },
]

async function getOrders(searchParams: { status?: string; page?: string; search?: string }) {
  const page = parseInt(searchParams.page || "1")
  const limit = 20
  const skip = (page - 1) * limit

  const where: Prisma.OrderWhereInput = {}
  if (searchParams.status && Object.values(OrderStatus).includes(searchParams.status as OrderStatus)) {
    where.status = searchParams.status as OrderStatus
  }
  if (searchParams.search) {
    where.OR = [
      { orderNumber: { contains: searchParams.search, mode: "insensitive" } },
      { user: { name: { contains: searchParams.search, mode: "insensitive" } } },
      { user: { email: { contains: searchParams.search, mode: "insensitive" } } },
    ]
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { product: { select: { name: true } } } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: 20,
    }),
    prisma.order.count({ where }),
  ])

  return { orders, total, totalPages: Math.ceil(total / limit) }
}

function getStatusBadge(status: string) {
  const statusConfig = statusOptions.find(s => s.value === status)
  if (!statusConfig) return <span>{status}</span>
  return (
    <span className={cn("inline-flex items-center px-2 py-1 rounded-full text-xs font-medium", statusConfig.color)}>
      <statusConfig.icon className="h-3 w-3 mr-1" aria-hidden="true" />
      {statusConfig.label}
    </span>
  )
}

function getPaymentBadge(status: string) {
  return (
    <span className={cn(
      "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
      status === "PAID" ? "bg-emerald-100 text-emerald-800" :
      status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
      "bg-red-100 text-red-800"
    )}>
      {status}
    </span>
  )
}

function renderPagination(currentPage: number, totalPages: number, search?: string, status?: string) {
  if (totalPages <= 1) return null

  const params = new URLSearchParams()
  if (search) params.set("search", search)
  if (status) params.set("status", status)

  params.set("page", String(Math.max(1, currentPage - 1)))
  const prevUrl = `/admin/orders?${params.toString()}`

  params.set("page", String(Math.min(totalPages, currentPage + 1)))
  const nextUrl = `/admin/orders?${params.toString()}`

  return (
    <div className="px-6 py-4 border-t border-neutral-200 flex items-center justify-between">
      <p className="text-sm text-neutral-600">
        Showing page {currentPage} of {totalPages}
      </p>
      <div className="flex gap-2">
        <Link
          href={prevUrl}
          className={`h-10 px-4 rounded-lg border border-neutral-300 text-sm font-medium transition-colors ${
            currentPage === 1
              ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
              : "bg-white text-neutral-700 hover:bg-neutral-50"
          }`}
          aria-disabled={currentPage === 1}
        >
          Previous
        </Link>
        <Link
          href={nextUrl}
          className={`h-10 px-4 rounded-lg border border-neutral-300 text-sm font-medium transition-colors ${
            currentPage === totalPages
              ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
              : "bg-white text-neutral-700 hover:bg-neutral-50"
          }`}
          aria-disabled={currentPage === totalPages}
        >
          Next
        </Link>
      </div>
    </div>
  )
}

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ status?: string; page?: string; search?: string }> }) {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  const resolvedParams = await searchParams
  const { orders, total, totalPages } = await getOrders(resolvedParams)
  const currentPage = parseInt(resolvedParams.page || "1")

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display font-medium text-2xl text-black">Orders</h1>
          <p className="text-neutral-600 mt-1">{total} order{total !== 1 ? "s" : ""} total</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 p-4">
        <ListFilters
          search={resolvedParams.search}
          searchPlaceholder="Search orders..."
          filterName="status"
          filterValue={resolvedParams.status}
          filterLabel="Statuses"
          options={statusOptions.map((status) => ({ value: status.value, label: status.label }))}
        />
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-neutral-500">No orders found</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/admin/orders/${order.id}`} className="font-medium text-neutral-900 hover:text-black">
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-neutral-900">{order.user.name || "Guest"}</p>
                        <p className="text-sm text-neutral-500">{order.user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600">
                      {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-neutral-900">{formatPrice(Number(order.total))}</span>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                    <td className="px-6 py-4">{getPaymentBadge(order.paymentStatus)}</td>
                    <td className="px-6 py-4 text-sm text-neutral-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right pr-6">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="h-10 w-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-neutral-200 transition-colors"
                        aria-label="View order"
                      >
                        <Package className="h-5 w-5" aria-hidden="true" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {renderPagination(currentPage, totalPages, resolvedParams.search, resolvedParams.status)}
      </div>
    </div>
  )
}

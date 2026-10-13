import { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { cn, formatPrice } from "@/lib/utils"
import { Mail, MapPin, Package, CreditCard, Shield, UserX, UserCheck, MoreVertical, Download, Edit } from "lucide-react"

interface CustomerPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: CustomerPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const customer = await prisma.user.findUnique({
    where: { id: resolvedParams.id },
    select: { name: true, email: true },
  })
  return { title: customer ? `${customer.name || customer.email}` : "Customer Not Found" }
}

async function getCustomer(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      addresses: true,
      orders: {
        include: {
          items: {
            include: {
              product: { select: { name: true, images: true } },
              variant: { select: { name: true } },
            },
          },
              },
              orderBy: { createdAt: "desc" },
      },
      _count: { select: { orders: true, addresses: true, reviews: true, wishlist: true } },
    },
  })
}

function getSegment(customer: any) {
  const totalSpent = customer.orders.reduce((sum: number, order: any) => sum + Number(order.total), 0)
  const orderCount = customer.orders.length
  const avgOrderValue = orderCount > 0 ? totalSpent / orderCount : 0
  const daysSinceLastOrder = customer.orders[0] 
    ? Math.floor((Date.now() - new Date(customer.orders[0].createdAt).getTime()) / (1000 * 60 * 60 * 24))
    : null

  if (orderCount === 0) return { label: "New", color: "bg-blue-100 text-blue-800", description: "Never ordered" }
  if (orderCount >= 10 || totalSpent >= 500000) return { label: "VIP", color: "bg-purple-100 text-purple-800", description: "High value customer" }
  if (orderCount >= 5 || totalSpent >= 200000) return { label: "Loyal", color: "bg-emerald-100 text-emerald-800", description: "Repeat customer" }
  if (daysSinceLastOrder !== null && daysSinceLastOrder > 90) return { label: "At Risk", color: "bg-yellow-100 text-yellow-800", description: "No order in 90+ days" }
  return { label: "Active", color: "bg-green-100 text-green-800", description: "Recent activity" }
}

function getLifetimeValue(customer: any) {
  return customer.orders.reduce((sum: number, order: any) => sum + Number(order.total), 0)
}

export default async function CustomerDetailPage({ params }: CustomerPageProps) {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  const resolvedParams = await params
  const customer = await getCustomer(resolvedParams.id)

  if (!customer) {
    notFound()
  }

  const segment = getSegment(customer)
  const lifetimeValue = getLifetimeValue(customer)
  const totalOrders = customer.orders.length
  const avgOrderValue = totalOrders > 0 ? lifetimeValue / totalOrders : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/customers" className="h-10 w-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-neutral-200 transition-colors">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </Link>
          <div>
            <h1 className="font-display text-2xl font-medium text-black">{customer.name || "Unnamed Customer"}</h1>
            <p className="text-neutral-600">{customer.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn("inline-flex items-center px-3 py-1 rounded-full text-sm font-medium", segment.color)}>
            {segment.label}
          </span>
          <Link href={`/admin/customers/${customer.id}/edit`} className="btn-outline flex items-center gap-2">
            <Edit className="h-4 w-4" /> Edit
          </Link>
        </div>
      </div>

      {/* Segment Info */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="flex items-center gap-4">
          <div className={cn("h-16 w-16 rounded-2xl flex items-center justify-center", segment.color.replace("100", "500").replace("800", "100"))}>
            <Shield className="h-8 w-8" />
          </div>
          <div>
            <h3 className="font-medium text-neutral-900">Customer Segment: {segment.label}</h3>
            <p className="text-neutral-600 text-sm">{segment.description}</p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <p className="text-sm text-neutral-600">Lifetime Value</p>
          <p className="text-2xl font-bold text-neutral-900 mt-1">{formatPrice(lifetimeValue)}</p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <p className="text-sm text-neutral-600">Total Orders</p>
          <p className="text-2xl font-bold text-neutral-900 mt-1">{totalOrders}</p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <p className="text-sm text-neutral-600">Avg Order Value</p>
          <p className="text-2xl font-bold text-neutral-900 mt-1">{formatPrice(avgOrderValue)}</p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <p className="text-sm text-neutral-600">Member Since</p>
          <p className="text-2xl font-bold text-neutral-900 mt-1">{new Date(customer.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Orders */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-neutral-200">
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
              <h2 className="font-medium text-neutral-900">Order History ({customer._count.orders})</h2>
            </div>
            <div className="divide-y divide-neutral-200">
              {customer.orders.length === 0 ? (
                <div className="px-6 py-12 text-center text-neutral-500">No orders yet</div>
              ) : (
                customer.orders.map((order) => (
                  <Link key={order.id} href={`/admin/orders/${order.id}`} className="px-6 py-4 flex items-center justify-between hover:bg-neutral-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-neutral-100 flex items-center justify-center">
                        <Package className="h-6 w-6 text-neutral-400" />
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">{order.orderNumber}</p>
                        <p className="text-sm text-neutral-500">{order.items.length} items • {new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-neutral-900">{formatPrice(Number(order.total))}</p>
                      <span className={cn(
                        "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                        order.status === "DELIVERED" && "bg-emerald-100 text-emerald-800",
                        order.status === "SHIPPED" && "bg-blue-100 text-blue-800",
                        order.status === "PROCESSING" && "bg-yellow-100 text-yellow-800",
                        order.status === "PENDING" && "bg-neutral-100 text-neutral-800",
                        order.status === "CANCELLED" && "bg-red-100 text-red-800"
                      )}>
                        {order.status}
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Addresses */}
          <div className="bg-white rounded-xl border border-neutral-200">
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
              <h2 className="font-medium text-neutral-900">Addresses ({customer._count.addresses})</h2>
            </div>
            <div className="p-6">
              {customer.addresses.length === 0 ? (
                <p className="text-neutral-500 text-center py-8">No addresses saved</p>
              ) : (
                <div className="space-y-4">
                  {customer.addresses.map((address) => (
                    <div key={address.id} className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-neutral-900">{address.firstName} {address.lastName}</p>
                          <p className="text-sm text-neutral-600">{address.addressLine1}</p>
                          {address.addressLine2 && <p className="text-sm text-neutral-600">{address.addressLine2}</p>}
                          <p className="text-sm text-neutral-600">{address.city}, {address.state} {address.postalCode}</p>
                          <p className="text-sm text-neutral-600">{address.country}</p>
                          <p className="text-sm text-neutral-600">Phone: {address.phone}</p>
                        </div>
                        <span className={cn(
                          "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                          address.isDefault ? "bg-emerald-100 text-emerald-800" : "bg-neutral-100 text-neutral-800"
                        )}>
                          {address.isDefault ? "Default" : address.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Access & Actions */}
        <div className="space-y-6">
          {/* Account Status */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h3 className="font-medium text-neutral-900 mb-4">Account Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-neutral-600">Account Status</span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-600">Role</span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                  {customer.role}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-600">Email Verified</span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                  Yes
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h3 className="font-medium text-neutral-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link href={`/admin/customers/${customer.id}/edit`} className="btn-outline w-full flex items-center justify-center gap-2">
                <Edit className="h-4 w-4" /> Edit Customer
              </Link>
              <button className="btn-outline w-full flex items-center justify-center gap-2 text-red-600 border-red-300 hover:bg-red-50">
                <UserX className="h-4 w-4" /> Deactivate Account
              </button>
              <button className="btn-outline w-full flex items-center justify-center gap-2">
                <Download className="h-4 w-4" /> Export Data
              </button>
              <button className="btn-outline w-full flex items-center justify-center gap-2">
                <CreditCard className="h-4 w-4" /> View Payment Methods
              </button>
            </div>
          </div>

          {/* Segmentation Info */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h3 className="font-medium text-neutral-900 mb-4">Segmentation Profile</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-600">Segment</span>
                <span className="font-medium text-neutral-900">{segment.label}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Total Spent</span>
                <span className="font-medium text-neutral-900">{formatPrice(lifetimeValue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Orders</span>
                <span className="font-medium text-neutral-900">{totalOrders}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Avg Order</span>
                <span className="font-medium text-neutral-900">{formatPrice(avgOrderValue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Wishlist Items</span>
                <span className="font-medium text-neutral-900">{customer._count.wishlist}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Reviews</span>
                <span className="font-medium text-neutral-900">{customer._count.reviews}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
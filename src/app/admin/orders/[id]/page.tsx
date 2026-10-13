import { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { cn, formatPrice } from "@/lib/utils"
import { Truck, CheckCircle, Clock, XCircle, Package, Mail, ArrowLeft } from "lucide-react"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const order = await prisma.order.findUnique({
    where: { id: resolvedParams.id },
    select: { orderNumber: true },
  })
  return { title: order ? `Order ${order.orderNumber}` : "Order Not Found" }
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

async function getOrder(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true } },
      items: {
        include: {
          product: { select: { name: true, slug: true, images: true } },
          variant: true,
        },
      },
    },
  })
}

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  const resolvedParams = await params
  const order = await getOrder(resolvedParams.id)

  if (!order) {
    notFound()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders" className="h-10 w-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-neutral-200 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="font-display font-medium text-2xl text-black">{order.orderNumber}</h1>
            <p className="text-neutral-600">Placed {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {(() => {
            const status = statusOptions.find(s => s.value === order.status)
            if (!status) return <span>{order.status}</span>
            return (
              <span className={cn("inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium", status.color)}>
                <status.icon className="h-4 w-4 mr-1.5" aria-hidden="true" />
                {status.label}
              </span>
            )
          })()}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-neutral-200">
            <div className="px-6 py-4 border-b border-neutral-200">
              <h2 className="font-medium text-neutral-900">Order Items ({order.items.length})</h2>
            </div>
            <div className="divide-y divide-neutral-200">
              {order.items.map((item) => (
                <div key={item.id} className="px-6 py-4 flex items-center gap-4">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                    {item.product.images[0] ? (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-neutral-300">{item.product.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/product/${item.product.slug}`} className="font-medium text-neutral-900 hover:text-black truncate block">
                      {item.productName}
                    </Link>
                    {item.variantName && <p className="text-sm text-neutral-500">{item.variantName}</p>}
                    <p className="text-sm text-neutral-500">Qty: {item.quantity} × {formatPrice(Number(item.price))}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-neutral-900">{formatPrice(Number(item.total))}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Totals */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h2 className="font-medium text-neutral-900 mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal ({order.items.length} items)</span>
                <span className="font-medium text-neutral-900">{formatPrice(Number(order.subtotal))}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Shipping</span>
                <span className="font-medium text-neutral-900">{formatPrice(Number(order.shipping))}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Tax</span>
                <span className="font-medium text-neutral-900">{formatPrice(Number(order.tax))}</span>
              </div>
              {Number(order.discount) > 0 && (
                <div className="flex justify-between text-neutral-600">
                  <span>Discount</span>
                  <span className="font-medium text-emerald-600">-{formatPrice(Number(order.discount))}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-semibold text-neutral-900 border-t border-neutral-200 pt-3">
                <span>Total</span>
                <span>{formatPrice(Number(order.total))}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="space-y-6">
          {/* Status & Actions */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h2 className="font-medium text-neutral-900 mb-4">Order Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-neutral-600">Current Status</span>
                {(() => {
                  const status = statusOptions.find(s => s.value === order.status)
                  if (!status) return <span>{order.status}</span>
                  return (
                    <span className={cn("inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium", status.color)}>
                      <status.icon className="h-4 w-4 mr-1.5" aria-hidden="true" />
                      {status.label}
                    </span>
                  )
                })()}
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Payment Status</span>
                <span className={cn(
                  "inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium",
                  order.paymentStatus === "PAID" ? "bg-emerald-100 text-emerald-800" :
                  order.paymentStatus === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                  "bg-red-100 text-red-800"
                )}>
                  {order.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Payment Method</span>
                <span className="font-medium text-neutral-900 capitalize">{order.paymentMethod.replace("_", " ")}</span>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h2 className="font-medium text-neutral-900 mb-4">Customer</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-neutral-400" />
                <div>
                  <p className="text-sm text-neutral-500">Email</p>
                  <p className="font-medium text-neutral-900">{order.user.email}</p>
                </div>
              </div>
              {order.user.name && (
                              <div className="flex items-center gap-3">
                                <span className="h-5 w-5 text-neutral-400">👤</span>
                                <div>
                                  <p className="text-sm text-neutral-500">Name</p>
                                  <p className="font-medium text-neutral-900">{order.user.name}</p>
                                </div>
                              </div>
                            )}
                          </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h2 className="font-medium text-neutral-900 mb-4">Shipping Address</h2>
            <address className="not-italic space-y-1">
                        {(() => {
                          const addr = order.shippingAddress as { firstName: string; lastName: string; addressLine1: string; addressLine2?: string; city: string; state: string; postalCode: string; country: string; phone: string } | null
                          if (!addr) return null
                          return (
                            <>
                              <p className="font-medium text-neutral-900">{addr.firstName} {addr.lastName}</p>
                              <p className="text-neutral-600">{addr.addressLine1}</p>
                              {addr.addressLine2 && <p className="text-neutral-600">{addr.addressLine2}</p>}
                              <p className="text-neutral-600">{addr.city}, {addr.state} {addr.postalCode}</p>
                              <p className="text-neutral-600">{addr.country}</p>
                              <p className="text-neutral-600">Phone: {addr.phone}</p>
                            </>
                          )
                        })()}
                      </address>
                    </div>

                    {/* Billing Address */}
                    <div className="bg-white rounded-xl border border-neutral-200 p-6">
                      <h2 className="font-medium text-neutral-900 mb-4">Billing Address</h2>
                      <address className="not-italic space-y-1">
                        {(() => {
                          const addr = order.billingAddress as { firstName: string; lastName: string; addressLine1: string; addressLine2?: string; city: string; state: string; postalCode: string; country: string } | null
                          if (!addr) return null
                          return (
                            <>
                              <p className="font-medium text-neutral-900">{addr.firstName} {addr.lastName}</p>
                              <p className="text-neutral-600">{addr.addressLine1}</p>
                              {addr.addressLine2 && <p className="text-neutral-600">{addr.addressLine2}</p>}
                              <p className="text-neutral-600">{addr.city}, {addr.state} {addr.postalCode}</p>
                              <p className="text-neutral-600">{addr.country}</p>
                            </>
                          )
                        })()}
                      </address>
                    </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h2 className="font-medium text-neutral-900 mb-2">Notes</h2>
              <p className="text-neutral-600 whitespace-pre-wrap">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

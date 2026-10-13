import { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Role, type Prisma } from "@prisma/client"
import { ListFilters } from "@/components/admin/list-filters"
import { cn, formatPrice } from "@/lib/utils"
import { Mail } from "lucide-react"

export const metadata: Metadata = {
  title: "Customers",
  description: "Manage customers",
}

async function getCustomers(searchParams: { search?: string; page?: string }) {
  const page = parseInt(searchParams.page || "1")
  const limit = 20
  const skip = (page - 1) * limit

  const where: Prisma.UserWhereInput = { role: Role.CUSTOMER }
  if (searchParams.search) {
    where.OR = [
      { name: { contains: searchParams.search, mode: "insensitive" } },
      { email: { contains: searchParams.search, mode: "insensitive" } },
    ]
  }

  const [customers, total] = await Promise.all([
    prisma.user.findMany({
      where,
      include: {
        _count: { select: { orders: true, addresses: true } },
        orders: {
          take: 1,
          orderBy: { createdAt: "desc" },
          select: { total: true, createdAt: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
          }),
          prisma.user.count({ where }),
        ])

        return { customers, total, totalPages: Math.ceil(total / limit) }
      }

      export default async function AdminCustomersPage({ searchParams }: { searchParams: Promise<{ search?: string; page?: string }> }) {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  const resolvedParams = await searchParams
  const { customers, total, totalPages } = await getCustomers(resolvedParams)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display font-medium text-2xl text-black">Customers</h1>
          <p className="text-neutral-600 mt-1">{total} customer{total !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-neutral-200 p-4">
        <ListFilters search={resolvedParams.search} searchPlaceholder="Search customers..." />
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Total Spent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Last Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider pr-6">Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {customers.length === 0 ? (
                <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-neutral-500">No customers found</td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center">
                          <span className="text-neutral-600 font-medium">
                            {customer.name?.charAt(0) || customer.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-neutral-900">{customer.name || "Unnamed"}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <a href={`mailto:${customer.email}`} className="text-neutral-600 hover:text-black">{customer.email}</a>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600">
                      {customer._count.orders}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-neutral-900">
                        {customer.orders[0] ? formatPrice(Number(customer.orders[0].total)) : "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600">
                      {customer.orders[0] ? new Date(customer.orders[0].createdAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600">
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right pr-6">
                      <a
                        href={`mailto:${customer.email}`}
                        className="h-10 w-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-neutral-200 transition-colors"
                        aria-label={`Email ${customer.name || customer.email}`}
                      >
                        <Mail className="h-5 w-5" aria-hidden="true" />
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-neutral-200 flex items-center justify-between">
            <p className="text-sm text-neutral-600">
              Showing page {resolvedParams.page || "1"} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Link
                href={`/admin/customers?page=${Math.max(1, (parseInt(resolvedParams.page || "1") - 1))}${resolvedParams.search ? `&search=${resolvedParams.search}` : ""}`}
                className={cn(
                  "h-10 px-4 rounded-lg border border-neutral-300 text-sm font-medium transition-colors",
                  parseInt(resolvedParams.page || "1") === 1 ? "bg-neutral-100 text-neutral-400 cursor-not-allowed" : "bg-white text-neutral-700 hover:bg-neutral-50"
                )}
                aria-disabled={parseInt(resolvedParams.page || "1") === 1}
              >
                Previous
              </Link>
              <Link
                href={`/admin/customers?page=${Math.min(totalPages, (parseInt(resolvedParams.page || "1") + 1))}${resolvedParams.search ? `&search=${resolvedParams.search}` : ""}`}
                className={cn(
                  "h-10 px-4 rounded-lg border border-neutral-300 text-sm font-medium transition-colors",
                  parseInt(resolvedParams.page || "1") === totalPages ? "bg-neutral-100 text-neutral-400 cursor-not-allowed" : "bg-white text-neutral-700 hover:bg-neutral-50"
                )}
                aria-disabled={parseInt(resolvedParams.page || "1") === totalPages}
              >
                Next
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

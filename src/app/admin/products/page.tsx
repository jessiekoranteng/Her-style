import { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import type { Prisma } from "@prisma/client"
import { ListFilters } from "@/components/admin/list-filters"
import { RemoveProductButton } from "@/components/admin/remove-product-button"
import { cn, formatPrice } from "@/lib/utils"
import { Plus, Edit, Eye } from "lucide-react"

export const metadata: Metadata = {
  title: "Products",
  description: "Manage products",
}

async function getProducts(searchParams: { search?: string; category?: string; page?: string }) {
  const page = parseInt(searchParams.page || "1")
  const limit = 20
  const skip = (page - 1) * limit

  const where: Prisma.ProductWhereInput = {}
  if (searchParams.search) {
    where.OR = [
      { name: { contains: searchParams.search, mode: "insensitive" } },
      { sku: { contains: searchParams.search, mode: "insensitive" } },
    ]
  }
  if (searchParams.category) {
    where.category = { slug: searchParams.category }
  }

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        variants: true,
        _count: { select: { orderItems: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
  ])

  return { products, total, totalPages: Math.ceil(total / limit), categories }
}

export default async function AdminProductsPage({ searchParams }: { searchParams: Promise<{ search?: string; category?: string; page?: string }> }) {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  const resolvedParams = await searchParams
  const { products, total, totalPages, categories } = await getProducts(resolvedParams)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display font-medium text-2xl text-black">Products</h1>
          <p className="text-neutral-600 mt-1">{total} product{total !== 1 ? "s" : ""} total</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary flex items-center gap-2">
          <Plus className="h-5 w-5" aria-hidden="true" />
          Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-neutral-200 p-4">
        <ListFilters
          search={resolvedParams.search}
          searchPlaceholder="Search products..."
          filterName="category"
          filterValue={resolvedParams.category}
          filterLabel="Categories"
          options={categories.map((category) => ({ value: category.slug, label: category.name }))}
        />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Sales</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-neutral-500">
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                          {product.images[0] ? (
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <span className="text-2xl font-bold text-neutral-300">{product.name.charAt(0)}</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <Link href={`/admin/products/${product.id}`} className="font-medium text-neutral-900 hover:text-black transition-colors block truncate max-w-xs">
                            {product.name}
                          </Link>
                          <p className="text-sm text-neutral-500 truncate max-w-xs">{product.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-neutral-900">{product.category.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-neutral-900">{formatPrice(Number(product.price))}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                        product.variants.some(v => v.inventory === 0) ? "bg-red-100 text-red-800" :
                        product.variants.some(v => v.inventory <= 10) ? "bg-yellow-100 text-yellow-800" :
                        "bg-emerald-100 text-emerald-800"
                      )}>
                        {product.variants.reduce((sum, v) => sum + v.inventory, 0)} in stock
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                        product.isActive ? "bg-emerald-100 text-emerald-800" : "bg-neutral-100 text-neutral-800"
                      )}>
                        {product.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600">
                      {product._count.orderItems}
                    </td>
                    <td className="px-6 py-4 text-right pr-6">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/product/${product.slug}`}
                          target="_blank"
                          className="h-10 w-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-neutral-200 transition-colors"
                          aria-label="View on store"
                        >
                          <Eye className="h-5 w-5" aria-hidden="true" />
                        </Link>
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="h-10 w-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-neutral-200 transition-colors"
                          aria-label="Edit"
                        >
                          <Edit className="h-5 w-5" aria-hidden="true" />
                        </Link>
                        <RemoveProductButton productId={product.id} productName={product.name} />
                      </div>
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
                href={`/admin/products?page=${Math.max(1, (parseInt(resolvedParams.page || "1") - 1))}${resolvedParams.search ? `&search=${resolvedParams.search}` : ""}${resolvedParams.category ? `&category=${resolvedParams.category}` : ""}`}
                className={cn(
                  "h-10 px-4 rounded-lg border border-neutral-300 text-sm font-medium transition-colors",
                  parseInt(resolvedParams.page || "1") === 1 ? "bg-neutral-100 text-neutral-400 cursor-not-allowed" : "bg-white text-neutral-700 hover:bg-neutral-50"
                )}
                aria-disabled={parseInt(resolvedParams.page || "1") === 1}
              >
                Previous
              </Link>
              <Link
                href={`/admin/products?page=${Math.min(totalPages, (parseInt(resolvedParams.page || "1") + 1))}${resolvedParams.search ? `&search=${resolvedParams.search}` : ""}${resolvedParams.category ? `&category=${resolvedParams.category}` : ""}`}
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

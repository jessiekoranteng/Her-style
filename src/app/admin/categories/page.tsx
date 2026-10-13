import { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Plus } from "lucide-react"

export const metadata: Metadata = {
  title: "Categories",
  description: "Manage product categories",
}

async function getCategories() {
  return prisma.category.findMany({
    include: {
      _count: { select: { products: true } },
      children: true,
      parent: true,
    },
    orderBy: { sortOrder: "asc" },
  })
}

export default async function AdminCategoriesPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  const categories = await getCategories()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display font-medium text-2xl text-black">Categories</h1>
          <p className="text-neutral-600 mt-1">{categories.length} categor{categories.length === 1 ? "y" : "ies"}</p>
        </div>
        <Link href="/admin/categories/new" className="btn-primary flex items-center gap-2">
          <Plus className="h-5 w-5" aria-hidden="true" />
          Add Category
        </Link>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Slug</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Parent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Products</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-neutral-500">
                    No categories yet. <Link href="/admin/categories/new" className="text-black underline">Create one</Link>
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                          {category.image ? (
                            <Image
                              src={category.image}
                              alt={category.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <span className="text-2xl font-bold text-neutral-300">{category.name.charAt(0)}</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="font-medium text-neutral-900">{category.name}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-sm text-neutral-600 bg-neutral-100 px-2 py-1 rounded">{category.slug}</code>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-neutral-600">{category.parent?.name || "—"}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600">
                      {category._count.products}
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600">
                      {category.sortOrder}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                        category.isActive ? "bg-emerald-100 text-emerald-800" : "bg-neutral-100 text-neutral-800"
                      )}>
                        {category.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

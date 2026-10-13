import { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"

export const metadata: Metadata = {
  title: "New Category",
  description: "Create a new category",
}

async function getParentCategories() {
  return prisma.category.findMany({
    where: { isActive: true, parentId: null },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  })
}

async function createCategory(formData: FormData) {
  "use server"

  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }

  const name = String(formData.get("name") || "").trim()
  const slug = String(formData.get("slug") || "").trim()
  if (!name || !slug) throw new Error("Name and slug are required")

  await prisma.category.create({
    data: {
      name,
      slug,
      description: String(formData.get("description") || "").trim() || null,
      image: String(formData.get("image") || "").trim() || null,
      parentId: String(formData.get("parentId") || "").trim() || null,
      sortOrder: Math.max(0, Number.parseInt(String(formData.get("sortOrder") || "0"), 10) || 0),
      isActive: formData.get("isActive") === "on",
    },
  })

  redirect("/admin/categories")
}

export default async function NewCategoryPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  const parentCategories = await getParentCategories()

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display font-medium text-2xl text-black">Create Category</h1>
        <p className="text-neutral-600 mt-1">Add a new category to your store</p>
      </div>

      <form action={createCategory} className="bg-white rounded-xl border border-neutral-200 p-6 space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
          />
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-neutral-700 mb-2">Slug *</label>
          <input
            type="text"
            id="slug"
            name="slug"
            required
            className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-2">Description</label>
          <textarea
            id="description"
            name="description"
            rows={3}
            className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
          />
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-neutral-700 mb-2">Image URL</label>
          <input
            type="text"
            id="image"
            name="image"
            className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
            placeholder="/images/categories/category.jpg"
          />
        </div>

        <div>
          <label htmlFor="parentId" className="block text-sm font-medium text-neutral-700 mb-2">Parent Category</label>
          <select
            id="parentId"
            name="parentId"
            className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
          >
            <option value="">None (Top Level)</option>
            {parentCategories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="sortOrder" className="block text-sm font-medium text-neutral-700 mb-2">Sort Order</label>
          <input
            type="number"
            id="sortOrder"
            name="sortOrder"
            min="0"
            defaultValue="0"
            className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            defaultChecked
            className="h-4 w-4 rounded border-neutral-300 text-black focus-visible:ring-2 focus-visible:ring-black"
          />
          <label htmlFor="isActive" className="text-sm text-neutral-700">Active</label>
        </div>

        <div className="flex items-center justify-end gap-4 pt-6 border-t border-neutral-200">
          <Link href="/admin/categories" className="btn-outline">Cancel</Link>
          <button type="submit" className="btn-primary">Create Category</button>
        </div>
      </form>
    </div>
  )
}

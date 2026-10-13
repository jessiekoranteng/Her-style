import { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ProductForm } from "@/components/admin/product-form"

interface ProductVariantInput {
  name: string
  sku: string
  price: number
  inventory: number
  options: Record<string, string>
}

export const metadata: Metadata = {
  title: "New Product",
  description: "Create a new product",
}

async function getCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  })
}

export default async function NewProductPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  const categories = await getCategories()

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display font-medium text-2xl text-black">Create Product</h1>
        <p className="text-neutral-600 mt-1">Add a new product to your store</p>
      </div>
      <ProductForm
        categories={categories}
        onSubmit={async (formData) => {
          "use server"

          const actionSession = await auth()
          if (!actionSession?.user || actionSession.user.role !== "ADMIN") {
            throw new Error("Unauthorized")
          }

          const data = {
            name: formData.get("name") as string,
            slug: formData.get("slug") as string,
            description: formData.get("description") as string,
            shortDescription: formData.get("shortDescription") as string,
            price: parseFloat(formData.get("price") as string),
            compareAtPrice: formData.get("compareAtPrice") ? parseFloat(formData.get("compareAtPrice") as string) : null,
            images: JSON.parse(formData.get("images") as string),
            categoryId: formData.get("categoryId") as string,
            tags: JSON.parse(formData.get("tags") as string),
            sku: formData.get("sku") as string,
            weight: formData.get("weight") ? parseFloat(formData.get("weight") as string) : null,
            dimensions: JSON.parse(formData.get("dimensions") as string),
            isActive: formData.get("isActive") === "on",
            isFeatured: formData.get("isFeatured") === "on",
            variants: (JSON.parse(formData.get("variants") as string) as ProductVariantInput[]).map((variant) => ({
              name: variant.name,
              sku: variant.sku,
              price: variant.price,
              inventory: variant.inventory,
              options: variant.options,
            })),
          }

          const product = await prisma.product.create({
            data: {
              ...data,
              variants: { create: data.variants },
            },
          })

          redirect(`/admin/products/${product.id}`)
        }}
        isLoading={false}
      />
    </div>
  )
}

import { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ProductForm } from "@/components/admin/product-form"

interface ProductVariantInput {
  id?: string
  name: string
  sku: string
  price: number
  inventory: number
  options: Record<string, string>
}

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const product = await prisma.product.findUnique({
    where: { id: resolvedParams.id },
    select: { name: true },
  })
  return { title: product ? `Edit ${product.name}` : "Product Not Found" }
}

async function getProduct(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      variants: true,
    },
  })
}

async function getCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  })
}

export default async function EditProductPage({ params }: ProductPageProps) {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  const resolvedParams = await params
  const product = await getProduct(resolvedParams.id)
  const categories = await getCategories()

  if (!product) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display font-medium text-2xl text-black">Edit Product</h1>
        <p className="text-neutral-600 mt-1">Update product details</p>
      </div>
      <ProductForm
        initialData={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          shortDescription: product.shortDescription,
          price: Number(product.price),
          compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : undefined,
          images: product.images,
          categoryId: product.categoryId,
          tags: product.tags,
          sku: product.sku,
          weight: product.weight ? Number(product.weight) : undefined,
          dimensions: product.dimensions as { length: number; width: number; height: number } | undefined,
          isActive: product.isActive,
          isFeatured: product.isFeatured,
          variants: product.variants.map(v => ({
            id: v.id,
            name: v.name,
            sku: v.sku,
            price: Number(v.price),
            inventory: v.inventory,
            options: v.options as Record<string, string>,
          })),
        }}
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
              id: variant.id || undefined,
              name: variant.name,
              sku: variant.sku,
              price: variant.price,
              inventory: variant.inventory,
              options: variant.options,
            })),
          }

          await prisma.$transaction(async (tx) => {
            await tx.product.update({
              where: { id: product.id },
              data: {
                name: data.name,
                slug: data.slug,
                description: data.description,
                shortDescription: data.shortDescription,
                price: data.price,
                compareAtPrice: data.compareAtPrice,
                images: data.images,
                categoryId: data.categoryId,
                tags: data.tags,
                sku: data.sku,
                weight: data.weight,
                dimensions: data.dimensions,
                isActive: data.isActive,
                isFeatured: data.isFeatured,
              },
            })

            const existingVariantIds = product.variants.map((variant) => variant.id)
            const submittedVariantIds = data.variants.flatMap((variant) => variant.id ? [variant.id] : [])
            const toDelete = existingVariantIds.filter((id) => !submittedVariantIds.includes(id))

            if (toDelete.length > 0) {
              await tx.productVariant.deleteMany({ where: { id: { in: toDelete } } })
            }

            for (const variant of data.variants) {
              if (variant.id) {
                await tx.productVariant.update({
                  where: { id: variant.id },
                  data: {
                    name: variant.name,
                    sku: variant.sku,
                    price: variant.price,
                    inventory: variant.inventory,
                    options: variant.options,
                  },
                })
              } else {
                await tx.productVariant.create({
                  data: {
                    productId: product.id,
                    name: variant.name,
                    sku: variant.sku,
                    price: variant.price,
                    inventory: variant.inventory,
                    options: variant.options,
                  },
                })
              }
            }
          })

          redirect(`/admin/products/${product.id}`)
        }}
        isLoading={false}
      />
    </div>
  )
}

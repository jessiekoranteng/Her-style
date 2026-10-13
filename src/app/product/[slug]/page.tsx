import { Metadata } from "next"
import { notFound } from "next/navigation"
import { ProductDetail } from "@/components/product-detail"
import { prisma } from "@/lib/prisma"

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      variants: true,
    },
  })
  
  if (!product) return null
  
  // Compute total inventory from variants
  const inventory = product.variants.reduce((sum, v) => sum + v.inventory, 0)
  
  return {
    ...product,
    inventory,
    category: product.category.name,
    tags: product.tags,
    price: Number(product.price),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : undefined,
    weight: product.weight ? Number(product.weight) : undefined,
    dimensions: product.dimensions ? product.dimensions as { length: number; width: number; height: number } : undefined,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    variants: product.variants.map(v => ({
      ...v,
      price: Number(v.price),
      options: v.options as Record<string, string>,
    })),
  }
}

async function getFeaturedProducts() {
  const products = await prisma.product.findMany({
    where: { isFeatured: true, isActive: true },
    include: {
      category: true,
      variants: true,
    },
    take: 4,
  })
  
  return products.map(product => ({
    ...product,
    inventory: product.variants.reduce((sum, v) => sum + v.inventory, 0),
    category: product.category.name,
    tags: product.tags,
    price: Number(product.price),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : undefined,
    weight: product.weight ? Number(product.weight) : undefined,
    dimensions: product.dimensions ? product.dimensions as { length: number; width: number; height: number } : undefined,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    variants: product.variants.map(v => ({
      ...v,
      price: Number(v.price),
      options: v.options as Record<string, string>,
    })),
  }))
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const product = await getProductBySlug(resolvedParams.slug)
  
  if (!product) {
    return { title: "Product Not Found" }
  }
  
  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: product.images[0] ? [{ url: product.images[0] }] : [],
      type: "website",
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params
  const product = await getProductBySlug(resolvedParams.slug)
  const relatedProducts = await getFeaturedProducts()

  if (!product) {
    notFound()
  }

  return (
    <div className="bg-white">
      <ProductDetail product={product} relatedProducts={relatedProducts.filter(p => p.id !== product.id)} />
    </div>
  )
}

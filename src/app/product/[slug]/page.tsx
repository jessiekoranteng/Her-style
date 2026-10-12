import { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import { ProductDetail } from "@/components/product-detail"
import { getProductBySlug, getFeaturedProducts } from "@/lib/data"

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const product = getProductBySlug(resolvedParams.slug)
  
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
  const product = getProductBySlug(resolvedParams.slug)
  const relatedProducts = getFeaturedProducts().filter(p => p.id !== product?.id).slice(0, 4)

  if (!product) {
    notFound()
  }

  return (
    <div className="bg-white">
      <ProductDetail product={product} relatedProducts={relatedProducts} />
    </div>
  )
}
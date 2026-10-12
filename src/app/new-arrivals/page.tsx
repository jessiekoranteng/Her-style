import { Metadata } from "next"
import { ProductGrid } from "@/components/product-grid"
import { getFeaturedProducts } from "@/lib/data"

export const metadata: Metadata = {
  title: "New Arrivals",
  description: "Discover the latest additions to HerStyle's collection. Fresh styles for the season.",
}

export default function NewArrivalsPage() {
  const products = getFeaturedProducts()

  return (
    <div className="section-padding bg-white">
      <div className="container-custom">
        <div className="mb-12">
          <h1 className="font-display font-medium text-3xl sm:text-4xl mb-4">New Arrivals</h1>
          <p className="text-neutral-600 text-lg max-w-2xl">
            Be the first to shop our latest collection. Fresh styles, new trends, and seasonal favorites just arrived.
          </p>
        </div>

        <ProductGrid products={products} />
      </div>
    </div>
  )
}
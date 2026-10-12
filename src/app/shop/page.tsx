import { Metadata } from "next"
import { ProductGrid } from "@/components/product-grid"
import { getAllCategories, getFeaturedProducts } from "@/lib/data"

export const metadata: Metadata = {
  title: "Shop All Products",
  description: "Browse our complete collection of women's fashion including clothing, laces, accessories, shoes, and bags.",
}

export default function ShopPage() {
  const categories = getAllCategories()
  const products = getFeaturedProducts()

  return (
    <div className="section-padding bg-white">
      <div className="container-custom">
        <div className="mb-12">
          <h1 className="font-display font-medium text-3xl sm:text-4xl mb-4">Shop All Products</h1>
          <p className="text-neutral-600 text-lg max-w-2xl">
            Discover our curated collection of women's fashion. From elegant dresses to premium lace fabrics, stylish accessories to comfortable footwear.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-10 overflow-x-auto pb-4">
          <div className="flex gap-3 min-w-max">
            <button className="btn-primary whitespace-nowrap">All Products</button>
            {categories.map((category) => (
              <button
                key={category.id}
                className="btn-outline whitespace-nowrap"
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Sort & View Options */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <p className="text-neutral-600">
            Showing <span className="font-medium text-neutral-900">{products.length}</span> products
          </p>
          <div className="flex items-center gap-4">
            <select className="h-10 px-4 rounded-lg border border-neutral-300 bg-white text-neutral-900 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black">
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="bestselling">Best Selling</option>
            </select>
            <div className="flex gap-2 border border-neutral-300 rounded-lg p-1">
              <button className="h-9 w-9 rounded flex items-center justify-center bg-black text-white">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <button className="h-9 w-9 rounded flex items-center justify-center text-neutral-600 hover:bg-neutral-100">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <ProductGrid products={products} />
      </div>
    </div>
  )
}
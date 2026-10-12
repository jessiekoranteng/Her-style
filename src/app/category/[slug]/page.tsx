import { Metadata } from "next"
import { notFound } from "next/navigation"
import { ProductGrid } from "@/components/product-grid"
import { getAllCategories, getProductsByCategory, getCategoryBySlug } from "@/lib/data"

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const category = getCategoryBySlug(resolvedParams.slug)
  
  if (!category) {
    return { title: "Category Not Found" }
  }
  
  return {
    title: category.name,
    description: category.description,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params
  const category = getCategoryBySlug(resolvedParams.slug)
  const categories = getAllCategories()
  const products = getProductsByCategory(resolvedParams.slug)

  if (!category) {
    notFound()
  }

  return (
    <div className="section-padding bg-white">
      <div className="container-custom">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm" aria-label="Breadcrumb">
          <Link href="/" className="text-neutral-500 hover:text-black transition-colors">Home</Link>
          <span className="text-neutral-300">/</span>
          <Link href="/shop" className="text-neutral-500 hover:text-black transition-colors">Shop</Link>
          <span className="text-neutral-300">/</span>
          <span className="text-neutral-900 font-medium" aria-current="page">{category.name}</span>
        </nav>

        <div className="mb-12">
          <h1 className="font-display font-medium text-3xl sm:text-4xl mb-4">{category.name}</h1>
          <p className="text-neutral-600 text-lg max-w-2xl">{category.description}</p>
        </div>

        {/* Category Filter */}
        <div className="mb-10 overflow-x-auto pb-4">
          <div className="flex gap-3 min-w-max">
            <Link
              href="/shop"
              className="btn-outline whitespace-nowrap"
            >
              All Categories
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className={`whitespace-nowrap ${cat.slug === category.slug ? "btn-primary" : "btn-outline"}`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <p className="text-neutral-600">
            Showing <span className="font-medium text-neutral-900">{products.length}</span> products
          </p>
          <select className="h-10 px-4 rounded-lg border border-neutral-300 bg-white text-neutral-900 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black">
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="bestselling">Best Selling</option>
          </select>
        </div>

        <ProductGrid products={products} />
      </div>
    </div>
  )
}

import Link from "next/link"
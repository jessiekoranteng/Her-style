import Link from "next/link"
import Image from "next/image"
import { ProductCard } from "@/components/product-card"
import { HeroCarousel } from "@/components/hero-carousel"
import { getFeaturedProducts, getAllCategories } from "@/lib/data"
import { ArrowRight } from "lucide-react"

export default function Home() {
  const featuredProducts = getFeaturedProducts()
  const categories = getAllCategories()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Category Grid */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="relative aspect-square overflow-hidden rounded-lg bg-neutral-100 transition-all duration-300 hover:shadow-lg group"
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 14vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute bottom-4 left-4 right-4 text-center text-white">
                  <h3 className="font-display font-medium text-lg mb-1">{category.name}</h3>
                  <span className="link-arrow text-sm inline-flex items-center justify-center gap-1 mx-auto">
                    Shop Now
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-12">
            <h2 className="font-display font-medium text-2xl sm:text-3xl">Featured Products</h2>
            <Link
              href="/shop"
              className="link-arrow text-neutral-600 hover:text-black"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {featuredProducts.slice(0, 8).map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                priority={index < 4}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-yellow-300 to-orange-400 opacity-20" />
              <Image
                src="/images/promo-banner.jpg"
                alt="Quality products - handbag, shoes, sunglasses"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="lg:pl-8">
              <h2 className="font-display font-medium text-2xl sm:text-3xl lg:text-4xl mb-4">
                Quality Products You&apos;ll Love
              </h2>
              <p className="text-neutral-600 text-lg mb-8 max-w-xl">
                From everyday essentials to statement pieces, we bring you the best in women&apos;s fashion.
              </p>
              <Link
                href="/shop"
                className="btn-primary inline-flex"
              >
                Shop All Products
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-12 border-y border-neutral-200 bg-neutral-50">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="trust-item">
              <div className="trust-icon">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-10V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1M13 16h8a1 1 0 001-1V8a1 1 0 00-1-1h-1M5 16h8a1 1 0 001-1v-1a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1z" />
                </svg>
              </div>
              <h4 className="font-medium text-sm text-neutral-900">Fast & Reliable Delivery</h4>
              <p className="text-xs text-neutral-500">Get your orders on time</p>
            </div>
            <div className="trust-item">
              <div className="trust-icon">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="font-medium text-sm text-neutral-900">Secure Payments</h4>
              <p className="text-xs text-neutral-500">Shop with confidence</p>
            </div>
            <div className="trust-item">
              <div className="trust-icon">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h4 className="font-medium text-sm text-neutral-900">Easy Returns</h4>
              <p className="text-xs text-neutral-500">Hassle-free returns</p>
            </div>
            <div className="trust-item">
              <div className="trust-icon">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h4 className="font-medium text-sm text-neutral-900">Customer Support</h4>
              <p className="text-xs text-neutral-500">We&apos;re here to help</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

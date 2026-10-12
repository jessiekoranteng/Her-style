"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useCartStore } from "@/lib/store"
import { Heart, ShoppingBag, ChevronLeft, ChevronRight, Minus, Plus, Truck, Shield, RotateCcw, Headphones } from "lucide-react"
import { cn, formatPrice } from "@/lib/utils"
import type { Product } from "@/lib/types"
import { ProductCard } from "@/components/product-card"

interface ProductDetailProps {
  product: Product
  relatedProducts: Product[]
}

export function ProductDetail({ product, relatedProducts }: ProductDetailProps) {
  const { addItem } = useCartStore()
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0)
  const [selectedVariant, setSelectedVariant] = React.useState<string | null>(null)
  const [quantity, setQuantity] = React.useState(1)
  const [isWishlisted, setIsWishlisted] = React.useState(false)
  const [isAdding, setIsAdding] = React.useState(false)

  const currentImage = product.images[selectedImageIndex]
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0

  const handleAddToCart = () => {
    setIsAdding(true)
    const variant = product.variants.find(v => v.id === selectedVariant)
    addItem(product, variant, quantity)
    setTimeout(() => setIsAdding(false), 300)
  }

  const handleVariantSelect = (variantId: string) => {
    setSelectedVariant(variantId)
  }

  const variantGroups = product.variants.reduce((acc, variant) => {
    Object.entries(variant.options).forEach(([key, value]) => {
      if (!acc[key]) acc[key] = new Set()
      acc[key].add(value)
    })
    return acc
  }, {} as Record<string, Set<string>>)

  const getSelectedVariant = () => {
    if (!selectedVariant) return product.variants[0]
    return product.variants.find(v => v.id === selectedVariant) || product.variants[0]
  }

  const selectedVariantData = getSelectedVariant()
  const currentPrice = selectedVariantData.price
  const currentInventory = selectedVariantData.inventory

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <nav className="container-custom py-6 border-b border-neutral-200" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm">
          <li><Link href="/" className="text-neutral-500 hover:text-black transition-colors">Home</Link></li>
          <li><span className="text-neutral-300">/</span></li>
          <li><Link href="/shop" className="text-neutral-500 hover:text-black transition-colors">Shop</Link></li>
          <li><span className="text-neutral-300">/</span></li>
          <li><Link href={`/category/${product.category}`} className="text-neutral-500 hover:text-black transition-colors">{product.category}</Link></li>
          <li><span className="text-neutral-300">/</span></li>
          <li><span className="text-neutral-900 font-medium" aria-current="page">{product.name}</span></li>
        </ol>
      </nav>

      <div className="container-custom section-padding">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Product Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-neutral-100">
              <Image
                src={currentImage}
                alt={product.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {hasDiscount && (
                <div className="absolute top-4 left-4">
                  <span className="bg-black text-white text-sm font-medium px-3 py-1 rounded">
                    -{discountPercent}%
                  </span>
                </div>
              )}
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={cn(
                  "absolute top-4 right-4 h-10 w-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-md",
                  isWishlisted
                    ? "bg-black text-white"
                    : "bg-white/90 text-neutral-600 hover:bg-white"
                )}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart
                  className={cn("h-5 w-5 transition-transform", isWishlisted && "fill-current scale-110")}
                  fill={isWishlisted ? "currentColor" : "none"}
                  strokeWidth={isWishlisted ? 0 : 2}
                />
              </button>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={cn(
                        "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-200",
                        index === selectedImageIndex
                          ? "border-black"
                          : "border-transparent hover:border-neutral-300"
                      )}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - view ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-neutral-500 mb-2">{product.category}</p>
              <h1 className="font-display font-medium text-3xl sm:text-4xl text-neutral-900 mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <span className="text-lg font-semibold text-neutral-900">GHS {currentPrice.toLocaleString()}</span>
                  {hasDiscount && (
                    <span className="text-sm text-neutral-400 line-through">GHS {product.compareAtPrice!.toLocaleString()}</span>
                  )}
                </div>
                {hasDiscount && (
                  <span className="bg-black text-white text-xs font-medium px-2 py-1 rounded">Save {discountPercent}%</span>
                )}
              </div>

              <p className="text-neutral-600 mb-6 leading-relaxed">{product.description}</p>
            </div>

            {/* Variant Selection */}
            {Object.keys(variantGroups).length > 0 && (
              <div className="space-y-4 border-t border-neutral-200 pt-6">
                <h3 className="font-medium text-neutral-900">Select Options</h3>
                <div className="space-y-4">
                  {Object.entries(variantGroups).map(([optionName, values]) => (
                    <div key={optionName}>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">{optionName.charAt(0).toUpperCase() + optionName.slice(1)}</label>
                      <div className="flex flex-wrap gap-2">
                        {Array.from(values).map((value) => (
                          <button
                            key={value}
                            onClick={() => {
                              const matchingVariant = product.variants.find(v => v.options[optionName] === value)
                              if (matchingVariant) handleVariantSelect(matchingVariant.id)
                            }}
                            className={cn(
                              "px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all duration-200",
                              selectedVariantData.options[optionName] === value
                                ? "border-black bg-black text-white"
                                : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400"
                            )}
                          >
                            {value}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="border-t border-neutral-200 pt-6">
              <label className="block text-sm font-medium text-neutral-700 mb-2">Quantity</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-neutral-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-12 w-12 flex items-center justify-center text-neutral-500 hover:bg-neutral-100 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                  <span className="w-16 text-center text-lg font-medium text-neutral-900 border-x border-neutral-300">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(currentInventory, quantity + 1))}
                    className="h-12 w-12 flex items-center justify-center text-neutral-500 hover:bg-neutral-100 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
                <span className="text-sm text-neutral-500">
                  {currentInventory > 0 ? `In stock (${currentInventory} available)` : "Out of stock"}
                </span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="border-t border-neutral-200 pt-6">
              <button
                onClick={handleAddToCart}
                disabled={currentInventory === 0 || isAdding}
                className="btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAdding ? (
                  <>
                    <svg className="h-5 w-5 animate-spin mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Adding to Bag...
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    Add to Bag
                  </>
                )}
              </button>
            </div>

            {/* Trust Badges */}
            <div className="border-t border-neutral-200 pt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-lg">
                <div className="h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center">
                  <Truck className="h-5 w-5 text-black" />
                </div>
                <div>
                  <p className="font-medium text-sm text-neutral-900">Fast Delivery</p>
                  <p className="text-xs text-neutral-500">Get your orders on time</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-lg">
                <div className="h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-black" />
                </div>
                <div>
                  <p className="font-medium text-sm text-neutral-900">Secure Payment</p>
                  <p className="text-xs text-neutral-500">100% secure checkout</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-lg">
                <div className="h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center">
                  <RotateCcw className="h-5 w-5 text-black" />
                </div>
                <div>
                  <p className="font-medium text-sm text-neutral-900">Easy Returns</p>
                  <p className="text-xs text-neutral-500">Hassle-free returns</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-lg">
                <div className="h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center">
                  <Headphones className="h-5 w-5 text-black" />
                </div>
                <div>
                  <p className="font-medium text-sm text-neutral-900">Support</p>
                  <p className="text-xs text-neutral-500">We're here to help</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 border-t border-neutral-200 pt-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display font-medium text-2xl sm:text-3xl">You May Also Like</h2>
              <Link href="/shop" className="link-arrow text-neutral-600 hover:text-black">
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {relatedProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} priority={index < 4} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

import { ArrowRight } from "lucide-react"
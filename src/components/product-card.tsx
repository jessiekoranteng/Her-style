"use client"

import Link from "next/link"
import Image from "next/image"
import { useCartStore } from "@/lib/store"
import { Heart, ShoppingBag } from "lucide-react"
import { cn, formatPrice } from "@/lib/utils"
import type { Product } from "@/lib/types"
import * as React from "react"

interface ProductCardProps {
  product: Product
  variant?: "default" | "compact" | "featured"
  priority?: boolean
}

export function ProductCard({ product, variant = "default", priority = false }: ProductCardProps) {
  const { addItem } = useCartStore()
  const [isWishlisted, setIsWishlisted] = React.useState(false)
  const [isAdding, setIsAdding] = React.useState(false)

  const image = product.images[0]
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsAdding(true)
    addItem(product)
    setTimeout(() => setIsAdding(false), 300)
  }

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
  }

  if (variant === "compact") {
    return (
      <Link
        href={`/product/${product.slug}`}
        className="flex gap-4 p-2 bg-neutral-50 rounded-lg group"
      >
        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
          {image ? (
            <Image
              src={image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="80px"
            />
          ) : (
            <div className="h-full w-full bg-neutral-200" />
          )}
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <h4 className="font-medium text-neutral-900 truncate group-hover:text-black transition-colors">
              {product.name}
            </h4>
            <p className="text-sm font-semibold text-neutral-900 mt-1">
              GHS {product.price.toLocaleString()}
            </p>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <article className="product-card group">
      <div className="relative aspect-square overflow-hidden bg-neutral-100">
        <Link href={`/product/${product.slug}`} className="block h-full" aria-label={product.name}>
          {image ? (
            <Image
              src={image}
              alt={product.name}
              fill
              priority={priority}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="h-full w-full bg-neutral-200 flex items-center justify-center">
              <span className="text-4xl font-bold text-neutral-300">{product.name.charAt(0)}</span>
            </div>
          )}
        </Link>

        {hasDiscount && (
          <div className="absolute top-3 left-3">
            <span className="bg-black text-white text-xs font-medium px-2 py-1 rounded">
              -{discountPercent}%
            </span>
          </div>
        )}

        <button
          onClick={handleToggleWishlist}
          className={cn(
            "absolute top-3 right-3 h-9 w-9 rounded-full flex items-center justify-center transition-all duration-200",
            isWishlisted
              ? "bg-black text-white shadow-lg"
              : "bg-white/90 text-neutral-600 hover:bg-white shadow-md"
          )}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={cn("h-4 w-4 transition-transform", isWishlisted && "fill-current scale-110")}
            fill={isWishlisted ? "currentColor" : "none"}
            strokeWidth={isWishlisted ? 0 : 2}
          />
        </button>

        <div className="absolute bottom-3 left-3 right-3 flex justify-center gap-2 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="h-10 px-4 rounded-lg bg-white/90 text-neutral-900 font-medium text-sm flex items-center gap-2 shadow-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Add to cart"
          >
            {isAdding ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Adding...
              </>
            ) : (
              <>
                <ShoppingBag className="h-4 w-4" />
                Add to Cart
              </>
            )}
          </button>
          <Link
            href={`/product/${product.slug}`}
            className="h-10 w-10 rounded-lg bg-white/90 text-neutral-600 flex items-center justify-center shadow-lg hover:bg-white"
            aria-label="Quick view"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </Link>
        </div>
      </div>

      <div className="p-4 pt-3 flex flex-col">
        <div className="mb-2">
          <Link
            href={`/category/${product.category}`}
            className="text-xs text-neutral-500 hover:text-black transition-colors"
          >
            {product.category}
          </Link>
        </div>
        <h3 className="font-display font-medium text-neutral-900 mb-1 line-clamp-1 group-hover:text-black transition-colors">
          <Link href={`/product/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className="text-sm text-neutral-500 line-clamp-2 flex-1 mb-3">
          {product.shortDescription}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-neutral-900">
            GHS {product.price.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-sm text-neutral-400 line-through">
              GHS {product.compareAtPrice!.toLocaleString()}
            </span>
          )}
        </div>
      </div>

      <div className="px-4 pb-4 pt-0">
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className="btn-secondary w-full"
        >
          {isAdding ? (
            <>
              <svg className="h-4 w-4 animate-spin mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Adding...
            </>
          ) : (
            "Add to Cart"
          )}
        </button>
      </div>
    </article>
  )
}
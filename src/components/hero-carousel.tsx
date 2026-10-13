"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { useSiteSettings } from "@/components/site-chrome"

export function HeroCarousel() {
  const settings = useSiteSettings()
  const [activeSlide, setActiveSlide] = React.useState(0)
  const slides = [
    {
      headline: settings.heroTitle,
      description: settings.heroDescription,
      image: settings.heroImage,
      alt: settings.heroTitle,
    },
    {
      headline: "New Season Arrivals",
      description: "Fresh styles for the season. Explore our latest collection of dresses, accessories, and footwear.",
      image: "/images/hero-2.jpg",
      alt: "New season fashion collection",
    },
    {
      headline: "Elegance Redefined",
      description: "Timeless pieces that elevate your wardrobe. Quality craftsmanship meets contemporary design.",
      image: "/images/hero-3.jpg",
      alt: "Elegant fashion display",
    },
  ]

  const showSlide = (index: number) => setActiveSlide((index + slides.length) % slides.length)

  return (
    <div className="relative h-[70vh] sm:h-[80vh] lg:h-[90vh] min-h-[500px] overflow-hidden">
      {slides.map((slide, index) => (
        <div key={slide.headline} className={`absolute inset-0 transition-opacity duration-700 ${index === activeSlide ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          <Image src={slide.image} alt={slide.alt} fill priority={index === 0} unoptimized={slide.image.startsWith("data:")} className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
          <div className="container-custom h-full flex items-center">
            <div className="max-w-2xl animate-slide-up stagger-1">
              <p className="text-white/80 text-sm uppercase tracking-widest mb-4">{settings.tagline}</p>
              <h1 className="font-display font-medium text-4xl sm:text-5xl lg:text-6xl text-white mb-6 leading-tight">{slide.headline}</h1>
              <p className="text-white/90 text-base sm:text-lg mb-8 max-w-xl leading-relaxed">{slide.description}</p>
              <Link href="/shop" className="btn-primary inline-flex">Shop Now <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
        <button onClick={() => showSlide(activeSlide - 1)} className="pointer-events-auto h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors" aria-label="Previous slide">
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button onClick={() => showSlide(activeSlide + 1)} className="pointer-events-auto h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors" aria-label="Next slide">
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((slide, index) => (
          <button key={slide.headline} onClick={() => showSlide(index)} className={`h-2 w-2 rounded-full transition-colors ${index === activeSlide ? "bg-white" : "bg-white/50"}`} aria-label={`Go to slide ${index + 1}`} />
        ))}
      </div>
    </div>
  )
}

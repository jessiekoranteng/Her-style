import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Truck, Shield, RotateCcw, Headphones, Users, Heart, Sparkles } from "lucide-react"

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about HerStyle - your destination for trendy, elegant women's fashion. Discover our story, mission, and commitment to quality.",
}

const features = [
  { icon: Sparkles, title: "Curated Collections", description: "Hand-picked pieces that reflect the latest trends while maintaining timeless elegance." },
  { icon: Heart, title: "Quality First", description: "Every product undergoes rigorous quality checks to ensure you receive only the best." },
  { icon: Users, title: "Customer Centric", description: "Your satisfaction is our priority. We're here to make your shopping experience delightful." },
  { icon: Truck, title: "Fast Shipping", description: "Quick and reliable delivery to your doorstep, wherever you are in Ghana." },
]

const team = [
  { name: "Ama Serwaa", role: "Founder & CEO", image: "/images/team/ama.jpg" },
  { name: "Kwame Asante", role: "Creative Director", image: "/images/team/kwame.jpg" },
  { name: "Efua Mensah", role: "Head of Operations", image: "/images/team/efua.jpg" },
  { name: "Kofi Boateng", role: "Customer Experience Lead", image: "/images/team/kofi.jpg" },
]

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <Image
          src="/images/about-hero.jpg"
          alt="HerStyle boutique interior"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
        <div className="container-custom h-full flex items-center">
          <div className="max-w-2xl animate-slide-up text-white">
            <p className="text-white/80 text-sm uppercase tracking-widest mb-4">OUR STORY</p>
            <h1 className="font-display font-medium text-4xl sm:text-5xl lg:text-6xl mb-6 leading-tight">
              Trendy • Elegant • You
            </h1>
            <p className="text-white/90 text-lg leading-relaxed">
              HerStyle was born from a passion for making elegant fashion accessible to every woman. We believe that style shouldn't come at the cost of quality or comfort.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <p className="text-black/50 text-sm uppercase tracking-widest mb-4">OUR MISSION</p>
              <h2 className="font-display font-medium text-3xl sm:text-4xl mb-6">
                Empowering Women Through Style
              </h2>
              <div className="space-y-4 text-neutral-600 leading-relaxed">
                <p>
                  At HerStyle, we believe every woman deserves to feel confident and beautiful in what she wears. Our mission is to bring you carefully curated fashion that combines contemporary trends with timeless elegance.
                </p>
                <p>
                  From the fabrics we select to the designs we showcase, every piece in our collection tells a story of craftsmanship and care. We work directly with artisans and trusted suppliers to ensure quality that lasts.
                </p>
                <p>
                  More than just a store, HerStyle is a community of women who appreciate the art of dressing well. Whether you're looking for the perfect dress for a special occasion, premium lace for your next sewing project, or everyday essentials that elevate your wardrobe, we're here to help you express your unique style.
                </p>
              </div>
            </div>
            <div className="relative aspect-square overflow-hidden rounded-lg">
              <Image
                src="/images/about-mission.jpg"
                alt="HerStyle team working"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-neutral-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <p className="text-black/50 text-sm uppercase tracking-widest mb-4">WHAT WE STAND FOR</p>
            <h2 className="font-display font-medium text-3xl sm:text-4xl">Our Values</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={feature.title} className="text-center p-6 animate-slide-up" style={{ animationDelay: `${(index + 1) * 100}ms` }}>
                <div className="h-14 w-14 rounded-full bg-black flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="font-medium text-neutral-900 mb-2">{feature.title}</h3>
                <p className="text-neutral-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-12 border-y border-neutral-200 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="trust-item">
              <div className="trust-icon">
                <Truck className="h-5 w-5" />
              </div>
              <h4 className="font-medium text-sm text-neutral-900">Fast & Reliable Delivery</h4>
              <p className="text-xs text-neutral-500">Get your orders on time</p>
            </div>
            <div className="trust-item">
              <div className="trust-icon">
                <Shield className="h-5 w-5" />
              </div>
              <h4 className="font-medium text-sm text-neutral-900">Secure Payments</h4>
              <p className="text-xs text-neutral-500">Shop with confidence</p>
            </div>
            <div className="trust-item">
              <div className="trust-icon">
                <RotateCcw className="h-5 w-5" />
              </div>
              <h4 className="font-medium text-sm text-neutral-900">Easy Returns</h4>
              <p className="text-xs text-neutral-500">Hassle-free returns</p>
            </div>
            <div className="trust-item">
              <div className="trust-icon">
                <Headphones className="h-5 w-5" />
              </div>
              <h4 className="font-medium text-sm text-neutral-900">Customer Support</h4>
              <p className="text-xs text-neutral-500">We're here to help</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <p className="text-black/50 text-sm uppercase tracking-widest mb-4">MEET THE TEAM</p>
            <h2 className="font-display font-medium text-3xl sm:text-4xl">The People Behind HerStyle</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={member.name} className="text-center animate-slide-up" style={{ animationDelay: `${(index + 1) * 100}ms` }}>
                <div className="relative aspect-square overflow-hidden rounded-lg mb-4">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                </div>
                <h3 className="font-medium text-neutral-900">{member.name}</h3>
                <p className="text-sm text-neutral-500">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-black text-white">
        <div className="container-custom text-center">
          <h2 className="font-display font-medium text-3xl sm:text-4xl mb-6">
            Ready to Discover Your Style?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Explore our collections and find pieces that speak to your unique sense of style.
          </p>
          <Link
            href="/shop"
            className="btn-secondary inline-flex text-lg px-8 py-4"
          >
            Shop Now
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}

import { ArrowRight } from "lucide-react"
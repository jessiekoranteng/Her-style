export interface PublicSiteSettings {
  storeName: string
  tagline: string
  description: string
  storeEmail: string
  storePhone: string
  storeAddress: string
  currency: string
  heroTitle: string
  heroDescription: string
  heroImage: string
}

export const defaultSiteSettings: PublicSiteSettings = {
  storeName: "HerStyle",
  tagline: "TRENDY • ELEGANT • YOU",
  description: "Discover fashionable women's clothing, beautiful laces, unique accessories, stylish shoes and bags – all in one place.",
  storeEmail: "hello@herstyle.com",
  storePhone: "+233 20 123 4567",
  storeAddress: "Accra, Ghana",
  currency: "GHS",
  heroTitle: "Style for Every Occasion",
  heroDescription: "Discover fashionable women's clothing, beautiful laces, unique accessories, stylish shoes and bags – all in one place.",
  heroImage: "/images/hero-1.jpg",
}

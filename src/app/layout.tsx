import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { SiteChrome } from "@/components/site-chrome"
import { Providers } from "./providers"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://herstyle.com"),
  title: {
    default: "HerStyle - Trendy • Elegant • You",
    template: "%s | HerStyle",
  },
  description: "Discover fashionable women's clothing, beautiful laces, unique accessories, stylish shoes and bags – all in one place. Shop now for quality products you'll love.",
  keywords: ["women's fashion", "clothing", "laces", "accessories", "shoes", "bags", "online shopping", "Ghana"],
  authors: [{ name: "HerStyle" }],
  creator: "HerStyle",
  publisher: "HerStyle",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_GH",
    url: "https://herstyle.com",
    siteName: "HerStyle",
    title: "HerStyle - Trendy • Elegant • You",
    description: "Discover fashionable women's clothing, beautiful laces, unique accessories, stylish shoes and bags – all in one place.",
    images: [
      {
        url: "/images/hero-1.jpg",
        width: 1200,
        height: 630,
        alt: "HerStyle - Premium Women's Fashion",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HerStyle - Trendy • Elegant • You",
    description: "Discover fashionable women's clothing, beautiful laces, unique accessories, stylish shoes and bags – all in one place.",
    images: ["/images/hero-1.jpg"],
  },
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} antialiased`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-white text-neutral-900 font-body">
        <Providers>
          <SiteChrome>{children}</SiteChrome>
        </Providers>
      </body>
    </html>
  )
}

import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
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
        url: "/og-image.jpg",
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
    images: ["/og-image.jpg"],
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
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
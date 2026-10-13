import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { defaultSiteSettings } from "@/lib/site-settings"

export async function GET() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } })

  return NextResponse.json(settings ? {
    storeName: settings.storeName,
    tagline: settings.tagline,
    description: settings.description,
    storeEmail: settings.storeEmail,
    storePhone: settings.storePhone,
    storeAddress: settings.storeAddress,
    currency: settings.currency,
    heroTitle: settings.heroTitle,
    heroDescription: settings.heroDescription,
    heroImage: settings.heroImage,
  } : defaultSiteSettings)
}

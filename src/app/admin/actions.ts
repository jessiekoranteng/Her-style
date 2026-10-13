"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { signOut } from "@/lib/auth"
import { requireAdmin } from "@/lib/admin-auth"
import { prisma } from "@/lib/prisma"

const settingsSchema = z.object({
  storeName: z.string().trim().min(1).max(80),
  tagline: z.string().trim().min(1).max(120),
  description: z.string().trim().min(1).max(500),
  storeEmail: z.string().trim().email(),
  storePhone: z.string().trim().min(1).max(40),
  storeAddress: z.string().trim().min(1).max(200),
  currency: z.string().trim().min(3).max(3).transform((value) => value.toUpperCase()),
  heroTitle: z.string().trim().min(1).max(120),
  heroDescription: z.string().trim().min(1).max(500),
  heroImage: z.string().trim().min(1).max(1000),
})

export async function saveSiteSettings(formData: FormData) {
  await requireAdmin()
  const data = settingsSchema.parse(Object.fromEntries(formData))

  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: data,
    create: { id: "default", ...data },
  })

  revalidatePath("/", "layout")
  redirect("/admin/settings?saved=1")
}

export async function removeProduct(formData: FormData) {
  await requireAdmin()
  const productId = z.string().min(1).parse(formData.get("productId"))
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { _count: { select: { orderItems: true } } },
  })

  if (!product) return

  if (product._count.orderItems > 0) {
    await prisma.product.update({ where: { id: productId }, data: { isActive: false } })
  } else {
    await prisma.product.delete({ where: { id: productId } })
  }

  revalidatePath("/admin/products")
  revalidatePath("/shop")
  revalidatePath("/")
}

export async function logoutAdmin() {
  await signOut({ redirectTo: "/login" })
}

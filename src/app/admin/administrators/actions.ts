"use server"

import bcrypt from "bcryptjs"
import { Role } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { requireAdmin } from "@/lib/admin-auth"
import { prisma } from "@/lib/prisma"

const passwordSchema = z.string().min(8, "Password must be at least 8 characters").max(128)

function returnToPage(kind: "success" | "error", message: string): never {
  const params = new URLSearchParams({ [kind]: message })
  redirect(`/admin/administrators?${params.toString()}`)
}

export async function createAdministrator(formData: FormData) {
  await requireAdmin()
  const parsed = z.object({
    name: z.string().trim().min(1, "Name is required").max(100),
    email: z.string().trim().email("Enter a valid email").transform((value) => value.toLowerCase()),
    password: passwordSchema,
  }).safeParse(Object.fromEntries(formData))

  if (!parsed.success) returnToPage("error", parsed.error.issues[0]?.message || "Invalid details")

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } })
  if (existing?.role === Role.ADMIN) returnToPage("error", "That email already has administrator access")

  const passwordHash = await bcrypt.hash(parsed.data.password, 12)
  if (existing) {
    await prisma.user.update({
      where: { id: existing.id },
      data: {
        name: parsed.data.name,
        passwordHash,
        role: Role.ADMIN,
      },
    })
  } else {
    const { password: _password, ...administrator } = parsed.data
    await prisma.user.create({
      data: { ...administrator, passwordHash, role: Role.ADMIN },
    })
  }

  revalidatePath("/admin/administrators")
  returnToPage("success", "Administrator access created")
}

export async function resetAdministratorPassword(formData: FormData) {
  await requireAdmin()
  const parsed = z.object({
    userId: z.string().min(1),
    password: passwordSchema,
  }).safeParse(Object.fromEntries(formData))

  if (!parsed.success) returnToPage("error", parsed.error.issues[0]?.message || "Invalid password")

  const target = await prisma.user.findFirst({
    where: { id: parsed.data.userId, role: Role.ADMIN },
    select: { id: true },
  })
  if (!target) returnToPage("error", "Administrator not found")

  await prisma.user.update({
    where: { id: target.id },
    data: {
      passwordHash: await bcrypt.hash(parsed.data.password, 12),
    },
  })

  revalidatePath("/admin/administrators")
  returnToPage("success", "Password reset and existing sessions revoked")
}

export async function revokeAdministrator(formData: FormData) {
  const actor = await requireAdmin()
  const userId = z.string().min(1).parse(formData.get("userId"))
  if (userId === actor.id) returnToPage("error", "You cannot revoke your own administrator access")

  const target = await prisma.user.findFirst({
    where: { id: userId, role: Role.ADMIN },
    select: { id: true },
  })
  if (!target) returnToPage("error", "Administrator not found")

  const adminCount = await prisma.user.count({ where: { role: Role.ADMIN } })
  if (adminCount <= 1) returnToPage("error", "The final administrator cannot be revoked")

  await prisma.user.update({
    where: { id: target.id },
    data: { role: Role.CUSTOMER },
  })

  revalidatePath("/admin/administrators")
  returnToPage("success", "Administrator access revoked")
}

import { Role } from "@prisma/client"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function getCurrentAdmin() {
  const session = await auth()
  if (!session?.user?.id) return null

  return prisma.user.findFirst({
    where: { id: session.user.id, role: Role.ADMIN },
    select: { id: true, email: true, name: true, role: true },
  })
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin()
  if (!admin) throw new Error("Unauthorized")
  return admin
}

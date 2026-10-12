import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import bcrypt from "bcryptjs"
import { z } from "zod"

const updateProfileSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6).optional(),
})

const addressSchema = z.object({
  type: z.enum(["SHIPPING", "BILLING"]),
  isDefault: z.boolean().default(false),
  firstName: z.string(),
  lastName: z.string(),
  company: z.string().optional(),
  addressLine1: z.string(),
  addressLine2: z.string().optional(),
  city: z.string(),
  state: z.string(),
  postalCode: z.string(),
  country: z.string().default("Ghana"),
  phone: z.string().optional(),
})

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { addresses: true, orders: { include: { items: true }, orderBy: { createdAt: "desc" } } },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const { passwordHash, ...userWithoutPassword } = user
    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error("GET /api/user error:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const body = await request.json()
    const data = updateProfileSchema.parse(body)

    const updateData: any = {}
    if (data.name) updateData.name = data.name
    if (data.email) updateData.email = data.email

    if (data.currentPassword && data.newPassword) {
      const user = await prisma.user.findUnique({ where: { id: userId } })
      if (!user?.passwordHash) {
        return NextResponse.json({ error: "Cannot change password for OAuth accounts" }, { status: 400 })
      }
      const valid = await bcrypt.compare(data.currentPassword, user.passwordHash)
      if (!valid) {
        return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
      }
      updateData.passwordHash = await bcrypt.hash(data.newPassword, 12)
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: { id: true, name: true, email: true, role: true },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error("PATCH /api/user error:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const body = await request.json()
    const data = addressSchema.parse(body)

    // If this is set as default, unset other defaults of same type
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId, type: data.type, isDefault: true },
        data: { isDefault: false },
      })
    }

    const address = await prisma.address.create({
      data: { ...data, userId },
    })

    return NextResponse.json(address, { status: 201 })
  } catch (error) {
    console.error("POST /api/user error:", error)
    return NextResponse.json({ error: "Failed to add address" }, { status: 500 })
  }
}
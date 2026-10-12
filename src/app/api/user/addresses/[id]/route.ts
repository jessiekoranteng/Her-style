import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"

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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const data = addressSchema.parse(body)

    // Verify ownership
    const existing = await prisma.address.findFirst({
      where: { id, userId: session.user.id },
    })
    if (!existing) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 })
    }

    // If this is set as default, unset other defaults of same type
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.user.id, type: data.type, isDefault: true },
        data: { isDefault: false },
      })
    }

    const address = await prisma.address.update({
      where: { id },
      data,
    })

    return NextResponse.json(address)
  } catch (error) {
    console.error("PUT /api/user/addresses/[id] error:", error)
    return NextResponse.json({ error: "Failed to update address" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Verify ownership
    const existing = await prisma.address.findFirst({
      where: { id, userId: session.user.id },
    })
    if (!existing) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 })
    }

    await prisma.address.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/user/addresses/[id] error:", error)
    return NextResponse.json({ error: "Failed to delete address" }, { status: 500 })
  }
}
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { Role } from "@prisma/client"
import { z } from "zod"

const updateCustomerSchema = z.object({
  customerId: z.string(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  role: z.nativeEnum(Role).optional(),
  isActive: z.boolean().optional(),
  emailVerified: z.boolean().optional(),
  addresses: z.array(z.object({
    id: z.string().optional(),
    type: z.enum(["SHIPPING", "BILLING"]),
    isDefault: z.boolean().default(false),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    company: z.string().optional(),
    addressLine1: z.string().min(1),
    addressLine2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(1),
    postalCode: z.string().min(1),
    country: z.string().default("Ghana"),
    phone: z.string().optional(),
  })).optional(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const data = updateCustomerSchema.parse(body)

    const { customerId, addresses, ...updateData } = data

    // Verify customer exists
    const existingCustomer = await prisma.user.findUnique({
      where: { id },
    })
    if (!existingCustomer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    // Check email uniqueness if being updated
    if (updateData.email && updateData.email !== existingCustomer.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: updateData.email },
      })
      if (emailExists) {
        return NextResponse.json({ error: "Email already in use" }, { status: 400 })
      }
    }

    // Update customer
    const customer = await prisma.user.update({
      where: { id },
      data: {
        ...updateData,
        emailVerified: updateData.emailVerified ? new Date() : null,
      },
    })

    // Handle addresses if provided
    if (addresses) {
      // Get existing addresses
      const existingAddresses = await prisma.address.findMany({
        where: { userId: id },
      })

      const existingAddressIds = existingAddresses.map(a => a.id)
      const submittedAddressIds = addresses.filter(a => a.id).map(a => a.id)

      // Delete removed addresses
      const toDelete = existingAddressIds.filter(id => !submittedAddressIds.includes(id))
      if (toDelete.length > 0) {
        await prisma.address.deleteMany({ where: { id: { in: toDelete } } })
      }

      // Update or create addresses
      for (const address of addresses) {
        const addressData = {
          userId: id,
          type: address.type,
          isDefault: address.isDefault,
          firstName: address.firstName,
          lastName: address.lastName,
          company: address.company,
          addressLine1: address.addressLine1,
          addressLine2: address.addressLine2,
          city: address.city,
          state: address.state,
          postalCode: address.postalCode,
          country: address.country,
          phone: address.phone,
        }

        if (address.id) {
          await prisma.address.update({
            where: { id: address.id },
            data: addressData,
          })
        } else {
          await prisma.address.create({ data: addressData })
        }
      }

      // Handle default address logic
      const defaultAddresses = addresses.filter(a => a.isDefault)
      if (defaultAddresses.length > 0) {
        // Ensure only one default per type
        for (const type of ["SHIPPING", "BILLING"] as const) {
          const typeDefaults = defaultAddresses.filter(a => a.type === type)
          if (typeDefaults.length > 1) {
            // Keep only the first as default
                  const toUpdate = typeDefaults.slice(1).map(a => a.id).filter((id): id is string => id !== undefined)
                  if (toUpdate.length > 0) {
                    await prisma.address.updateMany({
                      where: { id: { in: toUpdate } },
                      data: { isDefault: false },
                    })
                  }
                }
              }
            }
    }

    return NextResponse.json(customer)
  } catch (error) {
    console.error("PUT /api/admin/customers/[id] error:", error)
    return NextResponse.json({ error: "Failed to update customer" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Prevent deleting yourself
    if (id === session.user.id) {
      return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 })
    }

    await prisma.user.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/admin/customers/[id] error:", error)
    return NextResponse.json({ error: "Failed to delete customer" }, { status: 500 })
  }
}
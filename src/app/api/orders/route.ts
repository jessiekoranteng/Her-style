import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"

const createOrderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      variantId: z.string().optional(),
      quantity: z.number().int().positive(),
    })
  ),
  shippingAddress: z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    phone: z.string(),
    addressLine1: z.string(),
    addressLine2: z.string().optional(),
    city: z.string(),
    state: z.string(),
    postalCode: z.string(),
    country: z.string().default("Ghana"),
  }),
  billingAddress: z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    phone: z.string(),
    addressLine1: z.string(),
    addressLine2: z.string().optional(),
    city: z.string(),
    state: z.string(),
    postalCode: z.string(),
    country: z.string().default("Ghana"),
  }),
  paymentMethod: z.enum(["paystack", "card", "mobile_money"]),
  notes: z.string().optional(),
})

function generateOrderNumber(): string {
  const date = new Date()
  const year = date.getFullYear().toString().slice(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const day = date.getDate().toString().padStart(2, "0")
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `HS${year}${month}${day}-${random}`
}

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: {
          include: { product: true, variant: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error("GET /api/orders error:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { items, shippingAddress, billingAddress, paymentMethod, notes } = createOrderSchema.parse(body)

    // Fetch products and calculate totals
    const productIds = items.map((i) => i.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { variants: true },
    })

    let subtotal = 0
    const orderItems = []

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId)
      if (!product) {
        return NextResponse.json({ error: `Product ${item.productId} not found` }, { status: 404 })
      }

      const variant = item.variantId
        ? product.variants.find((v) => v.id === item.variantId)
        : product.variants[0]

      if (!variant) {
        return NextResponse.json({ error: `Variant not found for product ${product.name}` }, { status: 404 })
      }

      if (variant.inventory < item.quantity) {
        return NextResponse.json({ error: `Insufficient inventory for ${product.name}` }, { status: 400 })
      }

      const price = variant.price
      const total = Number(price) * item.quantity
      subtotal += total

      orderItems.push({
        productId: product.id,
        variantId: variant.id,
        productName: product.name,
        variantName: variant.name,
        sku: variant.sku,
        price,
        quantity: item.quantity,
        total,
      })
    }

    const shipping = subtotal > 100000 ? 0 : 15000
    const tax = 0
    const discount = 0
    const total = subtotal + shipping + tax - discount

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: session.user.id,
        status: "PENDING",
        subtotal,
        shipping,
        tax,
        discount,
        total,
        currency: "GHS",
        shippingAddress,
        billingAddress,
        paymentMethod,
        paymentStatus: "PENDING",
        notes,
        items: { create: orderItems },
      },
      include: { items: true },
    })

    // Decrease inventory
    for (const item of items) {
          const product = products.find((p) => p.id === item.productId)
          if (!product) continue

          const variant = item.variantId
            ? product.variants.find((v) => v.id === item.variantId)
            : product.variants[0]

          if (!variant) continue

          await prisma.productVariant.update({
            where: { id: variant.id },
            data: { inventory: { decrement: item.quantity } },
          })
        }

        // Clear cart
        await prisma.cartItem.deleteMany({ where: { userId: session.user.id } })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error("POST /api/orders error:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
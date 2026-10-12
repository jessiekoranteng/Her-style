import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"

const addToCartSchema = z.object({
  productId: z.string(),
  variantId: z.string().optional(),
  quantity: z.number().int().positive().default(1),
})

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ items: [], itemCount: 0, subtotal: 0 })
    }

    const userId = session.user.id

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: { include: { variants: true } },
        variant: true,
      },
    })

    const items = cartItems.map((item) => ({
      id: item.id,
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.quantity,
      product: item.product,
      variant: item.variant,
    }))

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
    const subtotal = items.reduce((sum, item) => {
      const price = item.variant?.price ?? item.product.price
      return sum + Number(price) * item.quantity
    }, 0)

    return NextResponse.json({ items, itemCount, subtotal })
  } catch (error) {
    console.error("GET /api/cart error:", error)
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 })
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
    const { productId, variantId, quantity } = addToCartSchema.parse(body)

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { variants: true },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const variant = variantId
      ? product.variants.find((v) => v.id === variantId)
      : product.variants[0]

    if (!variant) {
      return NextResponse.json({ error: "Variant not found" }, { status: 404 })
    }

    if (variant.inventory < quantity) {
      return NextResponse.json({ error: "Insufficient inventory" }, { status: 400 })
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: { userId_productId_variantId: { userId, productId, variantId: variantId ?? "" } },
    })

    let cartItem
    if (existingItem) {
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: { product: true, variant: true },
      })
    } else {
      cartItem = await prisma.cartItem.create({
        data: { userId, productId, variantId, quantity },
        include: { product: true, variant: true },
      })
    }

    return NextResponse.json(cartItem, { status: 201 })
  } catch (error) {
    console.error("POST /api/cart error:", error)
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const { searchParams } = new URL(request.url)
    const itemId = searchParams.get("itemId")

    if (!itemId) {
      return NextResponse.json({ error: "Item ID required" }, { status: 400 })
    }

    await prisma.cartItem.deleteMany({
      where: { id: itemId, userId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/cart error:", error)
    return NextResponse.json({ error: "Failed to remove from cart" }, { status: 500 })
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
    const { itemId, quantity } = z.object({ itemId: z.string(), quantity: z.number().int().min(0) }).parse(body)

    if (quantity === 0) {
      await prisma.cartItem.deleteMany({ where: { id: itemId, userId } })
      return NextResponse.json({ success: true })
    }

    const cartItem = await prisma.cartItem.update({
      where: { id: itemId, userId },
      data: { quantity },
      include: { product: true, variant: true },
    })

    return NextResponse.json(cartItem)
  } catch (error) {
    console.error("PATCH /api/cart error:", error)
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 })
  }
}
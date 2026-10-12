import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { orderId } = body

    const order = await prisma.order.findUnique({
      where: { id: orderId, userId: session.user.id },
      include: { items: { include: { product: true, variant: true } } },
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    if (order.paymentStatus !== "PENDING") {
      return NextResponse.json({ error: "Order already processed" }, { status: 400 })
    }

    // TODO: Integrate Paystack here
    // For now, return a mock response
    // const paystackResponse = await initializePaystackTransaction({
    //   email: order.shippingAddress.email,
    //   amount: Math.round(Number(order.total) * 100), // Paystack expects amount in kobo
    //   reference: order.orderNumber,
    //   callback_url: `${process.env.NEXTAUTH_URL}/checkout/verify?orderId=${order.id}`,
    // })

    return NextResponse.json({
      // authorization_url: paystackResponse.data.authorization_url,
      // reference: paystackResponse.data.reference,
      message: "Paystack integration pending - order created successfully",
      orderId: order.id,
      orderNumber: order.orderNumber,
    })
  } catch (error) {
    console.error("POST /api/checkout error:", error)
    return NextResponse.json({ error: "Failed to initialize checkout" }, { status: 500 })
  }
}
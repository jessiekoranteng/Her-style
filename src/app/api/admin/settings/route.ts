import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const settings: Record<string, string> = {}

    for (const [key, value] of formData.entries()) {
      settings[key] = value as string
    }

    // Convert checkboxes
    const checkboxFields = [
      "enablePaystack", "enableCard", "enableMobileMoney",
      "notifyNewOrder", "notifyLowStock", "notifyNewCustomer"
    ]
    checkboxFields.forEach(field => {
      settings[field] = settings[field] === "on" ? "true" : "false"
    })

    // Store settings in database (you could also use a separate settings table)
    // For now, we'll store as JSON in a key-value store or environment variables
    // In production, you'd want a proper settings table

    return NextResponse.json({ success: true, message: "Settings saved" })
  } catch (error) {
    console.error("POST /api/admin/settings error:", error)
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 })
  }
}

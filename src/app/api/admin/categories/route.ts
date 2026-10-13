import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"

const createCategorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  image: z.string().url().optional().or(z.literal("")),
  parentId: z.string().optional(),
  sortOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const data = createCategorySchema.parse(body)

    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        image: data.image || null,
        parentId: data.parentId || null,
        sortOrder: data.sortOrder,
        isActive: data.isActive,
      },
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error("POST /api/admin/categories error:", error)
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}
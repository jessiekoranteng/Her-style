import type { Metadata } from "next"
import { Role } from "@prisma/client"
import { AdministratorManager } from "@/components/admin/administrator-manager"
import { getCurrentAdmin } from "@/lib/admin-auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Administrators",
  description: "Manage administrator credentials and access",
}

export default async function AdministratorsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>
}) {
  const currentAdmin = await getCurrentAdmin()
  if (!currentAdmin) redirect("/login")

  const [administrators, params] = await Promise.all([
    prisma.user.findMany({
      where: { role: Role.ADMIN },
      select: { id: true, name: true, email: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    }),
    searchParams,
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-medium text-black">Administrators</h1>
        <p className="mt-1 text-neutral-600">Manage who can access the portal and reset administrator credentials.</p>
      </div>

      {params.success && (
        <div role="status" className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">{params.success}</div>
      )}
      {params.error && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{params.error}</div>
      )}

      <AdministratorManager
        administrators={administrators.map((administrator) => ({
          ...administrator,
          createdAt: administrator.createdAt.toISOString(),
          isCurrent: administrator.id === currentAdmin.id,
        }))}
      />
    </div>
  )
}

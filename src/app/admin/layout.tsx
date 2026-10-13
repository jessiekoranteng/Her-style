import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { getCurrentAdmin } from "@/lib/admin-auth"
import { redirect } from "next/navigation"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin()
  if (!admin) redirect("/login")

  return (
    <div className="min-h-screen bg-neutral-50">
      <AdminSidebar />
      <main className="ml-64">
        <header className="sticky top-0 z-40 bg-white border-b border-neutral-200">
          <div className="h-16 px-6 flex items-center justify-between">
            <h1 className="font-display font-medium text-2xl text-black">Admin</h1>
          </div>
        </header>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}

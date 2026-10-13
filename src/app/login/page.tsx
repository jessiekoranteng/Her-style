import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { LoginForm } from "@/components/admin/login-form"

export const metadata: Metadata = {
  title: "Admin Sign In",
  description: "Sign in to manage HerStyle",
}

export default async function LoginPage() {
  const session = await auth()
  if (session?.user?.role === "ADMIN") redirect("/admin")

  return (
    <main className="min-h-screen bg-neutral-100 px-4 py-12 flex items-center justify-center">
      <div className="w-full max-w-md rounded-2xl bg-white border border-neutral-200 p-8 shadow-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-xl bg-black text-white flex items-center justify-center font-display text-2xl">H</div>
          <h1 className="font-display text-3xl font-medium text-neutral-950">HerStyle Admin</h1>
          <p className="mt-2 text-neutral-600">Sign in to manage products, pricing, images, orders, and site content.</p>
        </div>
        <LoginForm />
      </div>
    </main>
  )
}

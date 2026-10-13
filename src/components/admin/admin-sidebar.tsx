"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Package,
  Tag,
  ShoppingCart,
  Users,
  ShieldCheck,
  Settings,
  LogOut,
  Store,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { logoutAdmin } from "@/app/admin/actions"

const defaultNavigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Categories", href: "/admin/categories", icon: Tag },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Administrators", href: "/admin/administrators", icon: ShieldCheck },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

interface AdminSidebarProps {
  navigation?: Array<{ name: string; href: string; icon: React.ComponentType<{ className?: string }> }>
}

export function AdminSidebar({ navigation = defaultNavigation }: AdminSidebarProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = React.useState(true)

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 bg-white border-r border-neutral-200 transition-all duration-300",
        sidebarOpen ? "w-64" : "w-20"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 border-b border-neutral-200">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-black flex items-center justify-center">
            <span className="text-white font-display font-medium text-lg">H</span>
          </div>
          {sidebarOpen && (
            <span className="font-display font-medium text-xl text-black">HerStyle Admin</span>
          )}
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="h-10 w-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-neutral-200 transition-colors"
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {sidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                isActive
                  ? "bg-black text-white"
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-black",
                !sidebarOpen && "justify-center"
              )}
              title={sidebarOpen ? undefined : item.name}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
              {sidebarOpen && <span className="font-medium">{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-neutral-200">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-neutral-600 hover:bg-neutral-100 hover:text-black transition-colors",
            !sidebarOpen && "justify-center"
          )}
          title={sidebarOpen ? undefined : "View Store"}
        >
          <Store className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
          {sidebarOpen && <span className="font-medium">View Store</span>}
        </Link>
        <form action={logoutAdmin} className="mt-1">
          <button
            type="submit"
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-neutral-600 hover:bg-neutral-100 hover:text-black transition-colors",
              !sidebarOpen && "justify-center"
            )}
            title={sidebarOpen ? undefined : "Sign out"}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
            {sidebarOpen && <span className="font-medium">Sign out</span>}
          </button>
        </form>
      </div>
    </aside>
  )
}

"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { defaultSiteSettings, type PublicSiteSettings } from "@/lib/site-settings"

const SiteSettingsContext = React.createContext<PublicSiteSettings>(defaultSiteSettings)

export function useSiteSettings() {
  return React.useContext(SiteSettingsContext)
}

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [settings, setSettings] = React.useState(defaultSiteSettings)
  const hideStoreChrome = pathname.startsWith("/admin") || pathname === "/login"

  React.useEffect(() => {
    let active = true
    fetch("/api/settings", { cache: "no-store" })
      .then((response) => response.ok ? response.json() as Promise<PublicSiteSettings> : null)
      .then((data) => {
        if (active && data) setSettings(data)
      })
      .catch(() => undefined)
    return () => { active = false }
  }, [pathname])

  return (
    <SiteSettingsContext.Provider value={settings}>
      <div className="flex flex-col min-h-screen">
        {!hideStoreChrome ? <Header settings={settings} /> : null}
        <main className="flex-1">{children}</main>
        {!hideStoreChrome ? <Footer settings={settings} /> : null}
      </div>
    </SiteSettingsContext.Provider>
  )
}

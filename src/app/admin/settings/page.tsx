import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { defaultSiteSettings } from "@/lib/site-settings"
import { saveSiteSettings } from "@/app/admin/actions"

export const metadata: Metadata = {
  title: "Site Settings",
  description: "Manage storefront information",
}

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>
}) {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") redirect("/login")

  const saved = (await searchParams).saved === "1"
  const record = await prisma.siteSettings.findUnique({ where: { id: "default" } })
  const settings = record || defaultSiteSettings

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-display font-medium text-2xl text-black">Site Settings</h1>
        <p className="text-neutral-600 mt-1">Update the brand, contact details, and homepage hero.</p>
      </div>

      {saved ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800">
          Site settings saved. The storefront will refresh with the new information.
        </div>
      ) : null}

      <form action={saveSiteSettings} className="space-y-6">
        <section className="bg-white rounded-xl border border-neutral-200 p-6">
          <h2 className="font-medium text-lg text-neutral-900 mb-6">Brand and contact</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <SettingInput label="Store name" name="storeName" defaultValue={settings.storeName} />
            <SettingInput label="Tagline" name="tagline" defaultValue={settings.tagline} />
            <SettingInput label="Store email" name="storeEmail" type="email" defaultValue={settings.storeEmail} />
            <SettingInput label="Store phone" name="storePhone" defaultValue={settings.storePhone} />
            <SettingInput label="Store address" name="storeAddress" defaultValue={settings.storeAddress} />
            <SettingInput label="Currency code" name="currency" defaultValue={settings.currency} maxLength={3} />
            <div className="sm:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-2">Store description</label>
              <textarea id="description" name="description" required rows={4} defaultValue={settings.description} className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black" />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-neutral-200 p-6">
          <h2 className="font-medium text-lg text-neutral-900 mb-6">Homepage hero</h2>
          <div className="grid gap-5">
            <SettingInput label="Hero title" name="heroTitle" defaultValue={settings.heroTitle} />
            <div>
              <label htmlFor="heroDescription" className="block text-sm font-medium text-neutral-700 mb-2">Hero description</label>
              <textarea id="heroDescription" name="heroDescription" required rows={3} defaultValue={settings.heroDescription} className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black" />
            </div>
            <SettingInput label="Hero image URL or local path" name="heroImage" defaultValue={settings.heroImage} placeholder="/images/hero-1.jpg" />
          </div>
        </section>

        <div className="flex justify-end border-t border-neutral-200 pt-6">
          <button type="submit" className="btn-primary">Save Site Settings</button>
        </div>
      </form>
    </div>
  )
}

function SettingInput({
  label,
  name,
  defaultValue,
  type = "text",
  placeholder,
  maxLength,
}: {
  label: string
  name: string
  defaultValue: string
  type?: string
  placeholder?: string
  maxLength?: number
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-neutral-700 mb-2">{label}</label>
      <input id={name} name={name} type={type} required defaultValue={defaultValue} placeholder={placeholder} maxLength={maxLength} className="w-full h-11 rounded-lg border border-neutral-300 px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black" />
    </div>
  )
}

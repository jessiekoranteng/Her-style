import { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Role } from "@prisma/client"
import { cn } from "@/lib/utils"
import { Shield, Mail, MapPin, Shield as ShieldIcon, UserCheck, UserX } from "lucide-react"

interface CustomerEditPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: CustomerEditPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const customer = await prisma.user.findUnique({
    where: { id: resolvedParams.id },
    select: { name: true, email: true },
  })
  return { title: customer ? `Edit ${customer.name || customer.email}` : "Customer Not Found" }
}

async function getCustomer(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: { addresses: true },
  })
}

export default async function EditCustomerPage({ params }: CustomerEditPageProps) {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  const resolvedParams = await params
  const customer = await getCustomer(resolvedParams.id)

  if (!customer) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href={`/admin/customers/${customer.id}`} className="h-10 w-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-neutral-200 transition-colors">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </Link>
          <div>
            <h1 className="font-display font-medium text-2xl text-black">Edit Customer</h1>
            <p className="text-neutral-600 mt-1">{customer.email}</p>
          </div>
        </div>
      </div>

      <form action="/api/admin/customers/[id]" method="POST" className="space-y-8">
        <input type="hidden" name="customerId" value={customer.id} />

        {/* Basic Info */}
        <section className="bg-white rounded-xl border border-neutral-200 p-6">
          <h2 className="font-medium text-neutral-900 mb-6 flex items-center gap-2">
            <Mail className="h-5 w-5 text-neutral-500" />
            Basic Information
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                defaultValue={customer.name || ""}
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                defaultValue={customer.email}
                required
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
              />
            </div>
            <div>
                          <label htmlFor="role" className="block text-sm font-medium text-neutral-700 mb-2">Role</label>
                          <select
                            id="role"
                            name="role"
                            defaultValue={customer.role}
                            className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                          >
                            <option value={Role.CUSTOMER}>Customer</option>
                            <option value={Role.ADMIN}>Administrator</option>
                          </select>
                        </div>
          </div>
        </section>

        {/* Account Status */}
        <section className="bg-white rounded-xl border border-neutral-200 p-6">
          <h2 className="font-medium text-neutral-900 mb-6 flex items-center gap-2">
            <Shield className="h-5 w-5 text-neutral-500" />
            Account Status
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Account Status</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="isActive"
                    value="true"
                    defaultChecked={true}
                    className="h-4 w-4 rounded border-neutral-300 text-black focus-visible:ring-2 focus-visible:ring-black"
                  />
                  <span className="text-sm text-neutral-700">Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="isActive"
                    value="false"
                    className="h-4 w-4 rounded border-neutral-300 text-black focus-visible:ring-2 focus-visible:ring-black"
                  />
                  <span className="text-sm text-neutral-700">Deactivated</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Email Verified</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="emailVerified"
                    value="true"
                    defaultChecked={true}
                    className="h-4 w-4 rounded border-neutral-300 text-black focus-visible:ring-2 focus-visible:ring-black"
                  />
                  <span className="text-sm text-neutral-700">Verified</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="emailVerified"
                    value="false"
                    className="h-4 w-4 rounded border-neutral-300 text-black focus-visible:ring-2 focus-visible:ring-black"
                  />
                  <span className="text-sm text-neutral-700">Not Verified</span>
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Addresses */}
        <section className="bg-white rounded-xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-medium text-neutral-900 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-neutral-500" />
              Addresses
            </h2>
          </div>
          <div className="space-y-4">
            {customer.addresses.map((address, index) => (
              <div key={address.id} className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-neutral-900">Address {index + 1}</h3>
                  <span className={cn(
                    "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                    address.isDefault ? "bg-emerald-100 text-emerald-800" : "bg-neutral-100 text-neutral-800"
                  )}>
                    {address.isDefault ? "Default" : address.type}
                  </span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Type</label>
                    <select
                      name={`addresses[${index}].type`}
                      defaultValue={address.type}
                      className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                    >
                      <option value="SHIPPING">Shipping</option>
                      <option value="BILLING">Billing</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Default</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name={`addresses[${index}].isDefault`}
                        defaultChecked={address.isDefault}
                        className="h-4 w-4 rounded border-neutral-300 text-black focus-visible:ring-2 focus-visible:ring-black"
                      />
                      <label className="text-sm text-neutral-700">Set as default</label>
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 mb-1">First Name</label>
                    <input
                      type="text"
                      name={`addresses[${index}].firstName`}
                      defaultValue={address.firstName}
                      className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      name={`addresses[${index}].lastName`}
                      defaultValue={address.lastName}
                      className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Company</label>
                    <input
                      type="text"
                      name={`addresses[${index}].company`}
                      defaultValue={address.company || ""}
                      className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Address Line 1</label>
                    <input
                      type="text"
                      name={`addresses[${index}].addressLine1`}
                      defaultValue={address.addressLine1}
                      required
                      className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Address Line 2</label>
                    <input
                      type="text"
                      name={`addresses[${index}].addressLine2`}
                      defaultValue={address.addressLine2 || ""}
                      className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">City</label>
                    <input
                      type="text"
                      name={`addresses[${index}].city`}
                      defaultValue={address.city}
                      required
                      className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">State</label>
                    <input
                      type="text"
                      name={`addresses[${index}].state`}
                      defaultValue={address.state}
                      required
                      className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Postal Code</label>
                    <input
                      type="text"
                      name={`addresses[${index}].postalCode`}
                      defaultValue={address.postalCode}
                      required
                      className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Country</label>
                    <input
                      type="text"
                      name={`addresses[${index}].country`}
                      defaultValue={address.country}
                      required
                      className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      name={`addresses[${index}].phone`}
                      defaultValue={address.phone || ""}
                      className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-neutral-200">
          <Link href={`/admin/customers/${customer.id}`} className="btn-outline">
            Cancel
          </Link>
          <button type="submit" className="btn-primary">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}
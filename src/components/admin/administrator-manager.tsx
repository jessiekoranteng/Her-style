"use client"

import { KeyRound, ShieldCheck, ShieldOff, UserPlus } from "lucide-react"
import {
  createAdministrator,
  resetAdministratorPassword,
  revokeAdministrator,
} from "@/app/admin/administrators/actions"

interface Administrator {
  id: string
  name: string | null
  email: string
  createdAt: string
  isCurrent: boolean
}

const inputClass =
  "w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"

export function AdministratorManager({ administrators }: { administrators: Administrator[] }) {
  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-neutral-200 bg-white p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-lg bg-neutral-100 p-2"><UserPlus className="h-5 w-5" /></div>
          <div>
            <h2 className="font-display text-xl font-medium text-black">Add administrator</h2>
            <p className="text-sm text-neutral-600">Create a login with full portal access.</p>
          </div>
        </div>

        <form action={createAdministrator} className="grid gap-4 md:grid-cols-4">
          <div>
            <label htmlFor="admin-name" className="mb-1.5 block text-sm font-medium">Name</label>
            <input id="admin-name" name="name" required maxLength={100} className={inputClass} />
          </div>
          <div>
            <label htmlFor="admin-email" className="mb-1.5 block text-sm font-medium">Email</label>
            <input id="admin-email" name="email" type="email" required className={inputClass} />
          </div>
          <div>
            <label htmlFor="admin-password" className="mb-1.5 block text-sm font-medium">Temporary password</label>
            <input id="admin-password" name="password" type="password" required minLength={8} maxLength={128} autoComplete="new-password" className={inputClass} />
          </div>
          <div className="flex items-end">
            <button type="submit" className="w-full rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800">
              Create administrator
            </button>
          </div>
        </form>
      </section>

      <section className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <div className="border-b border-neutral-200 px-6 py-5">
          <h2 className="font-display text-xl font-medium text-black">Administrator accounts</h2>
          <p className="mt-1 text-sm text-neutral-600">Passwords are stored only as bcrypt hashes and cannot be viewed.</p>
        </div>

        <div className="divide-y divide-neutral-200">
          {administrators.map((administrator) => (
            <div key={administrator.id} className="grid gap-5 p-6 lg:grid-cols-[1fr_1.35fr_auto] lg:items-end">
              <div className="flex items-center gap-3 self-center">
                <div className="rounded-full bg-neutral-100 p-2.5"><ShieldCheck className="h-5 w-5" /></div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-neutral-900">{administrator.name || "Unnamed administrator"}</p>
                    {administrator.isCurrent && <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">You</span>}
                  </div>
                  <p className="text-sm text-neutral-600">{administrator.email}</p>
                  <p className="mt-1 text-xs text-neutral-500">Added {new Date(administrator.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <form action={resetAdministratorPassword} className="flex gap-2">
                <input type="hidden" name="userId" value={administrator.id} />
                <div className="min-w-0 flex-1">
                  <label htmlFor={`password-${administrator.id}`} className="mb-1.5 block text-sm font-medium">New password</label>
                  <input id={`password-${administrator.id}`} name="password" type="password" required minLength={8} maxLength={128} autoComplete="new-password" className={inputClass} />
                </div>
                <button type="submit" className="mt-6 inline-flex items-center gap-2 rounded-lg border border-neutral-300 px-3 py-2.5 text-sm font-medium hover:bg-neutral-50">
                  <KeyRound className="h-4 w-4" /> Reset
                </button>
              </form>

              <form
                action={revokeAdministrator}
                onSubmit={(event) => {
                  if (!window.confirm(`Revoke administrator access for ${administrator.email}?`)) event.preventDefault()
                }}
              >
                <input type="hidden" name="userId" value={administrator.id} />
                <button
                  type="submit"
                  disabled={administrator.isCurrent}
                  title={administrator.isCurrent ? "You cannot revoke your own access" : "Revoke administrator access"}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ShieldOff className="h-4 w-4" /> Revoke
                </button>
              </form>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

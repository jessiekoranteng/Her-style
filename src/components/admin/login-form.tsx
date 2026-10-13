"use client"

import { useActionState } from "react"
import { loginAdmin, type LoginState } from "@/app/login/actions"

const initialState: LoginState = {}

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAdmin, initialState)

  return (
    <form action={action} className="space-y-5">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full h-12 rounded-lg border border-neutral-300 px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
          placeholder="admin@herstyle.com"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full h-12 rounded-lg border border-neutral-300 px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
          placeholder="Enter your password"
        />
      </div>
      {state.error ? (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>
      ) : null}
      <button type="submit" disabled={pending} className="btn-primary w-full h-12 disabled:opacity-60">
        {pending ? "Signing in…" : "Sign in to Admin"}
      </button>
    </form>
  )
}

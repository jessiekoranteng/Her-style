"use server"

import { AuthError } from "next-auth"
import { signIn } from "@/lib/auth"

export interface LoginState {
  error?: string
}

export async function loginAdmin(_state: LoginState, formData: FormData): Promise<LoginState> {
  try {
    await signIn("credentials", {
      email: String(formData.get("email") || "").trim(),
      password: String(formData.get("password") || ""),
      redirectTo: "/admin",
    })
    return {}
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password." }
    }
    throw error
  }
}

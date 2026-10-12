import { Metadata } from "next"
import { AccountPage } from "@/components/account-page"

export const metadata: Metadata = {
  title: "My Account",
  description: "Manage your HerStyle account, view orders, and update your profile.",
}

export default function AccountPageRoute() {
  return <AccountPage />
}
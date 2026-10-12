import { Metadata } from "next"
import { CheckoutPage } from "@/components/checkout-page"

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your purchase securely with HerStyle.",
}

export default function CheckoutPageRoute() {
  return <CheckoutPage />
}
import { Metadata } from "next"
import { CartPage } from "@/components/cart-page"

export const metadata: Metadata = {
  title: "Shopping Cart",
  description: "Review your shopping cart and proceed to checkout.",
}

export default function CartPageRoute() {
  return <CartPage />
}
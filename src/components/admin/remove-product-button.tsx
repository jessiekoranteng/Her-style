"use client"

import { Trash2 } from "lucide-react"
import { removeProduct } from "@/app/admin/actions"

export function RemoveProductButton({ productId, productName }: { productId: string; productName: string }) {
  return (
    <form
      action={removeProduct}
      onSubmit={(event) => {
        if (!window.confirm(`Remove ${productName} from the store?`)) event.preventDefault()
      }}
    >
      <input type="hidden" name="productId" value={productId} />
      <button
        type="submit"
        className="h-10 w-10 rounded-lg bg-neutral-100 flex items-center justify-center text-red-600 hover:bg-red-50 transition-colors"
        aria-label={`Remove ${productName}`}
        title="Remove from store"
      >
        <Trash2 className="h-5 w-5" aria-hidden="true" />
      </button>
    </form>
  )
}

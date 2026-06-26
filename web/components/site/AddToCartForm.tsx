"use client"

import { useState } from "react"
import { useCart } from "@/context/cart-context"
import type { StoreProduct } from "@/lib/store"

export default function AddToCartForm({ product }: { product: StoreProduct }) {
  const { addItem } = useCart()
  const [variantId, setVariantId] = useState(product.variants?.[0]?.id ?? "")
  const [status, setStatus] = useState<"idle" | "adding" | "added">("idle")

  const handleAdd = async () => {
    if (!variantId) return
    setStatus("adding")
    await addItem(variantId, 1)
    setStatus("added")
    setTimeout(() => setStatus("idle"), 1800)
  }

  return (
    <div className="mt-8">
      {product.variants && product.variants.length > 1 && (
        <div className="mb-5">
          <label className="text-xs font-body uppercase tracking-widest text-ink/50">
            Size / Variant
          </label>
          <div className="flex flex-wrap gap-2 mt-2">
            {product.variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setVariantId(v.id)}
                className={`px-4 py-2 text-sm font-body border rounded-tag transition-colors ${
                  variantId === v.id
                    ? "border-ink bg-ink text-paper"
                    : "border-ink/20 text-ink/70 hover:border-ink"
                }`}
              >
                {v.title}
              </button>
            ))}
          </div>
        </div>
      )}

      <button onClick={handleAdd} disabled={status === "adding"} className="btn-primary w-full sm:w-auto">
        {status === "added" ? "Added to cart" : status === "adding" ? "Adding..." : "Add to cart"}
      </button>
    </div>
  )
}

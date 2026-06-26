"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createVendorProduct } from "@/lib/vendor"

type VariantRow = { title: string; sku: string; price: string; inventory_quantity: string }
const emptyVariant: VariantRow = { title: "", sku: "", price: "", inventory_quantity: "" }

export default function NewProductPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [variants, setVariants] = useState<VariantRow[]>([{ ...emptyVariant }])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateVariant = (i: number, key: keyof VariantRow, value: string) => {
    const next = [...variants]
    next[i] = { ...next[i], [key]: value }
    setVariants(next)
  }

  const addVariant = () => setVariants([...variants, { ...emptyVariant }])
  const removeVariant = (i: number) => setVariants(variants.filter((_, idx) => idx !== i))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await createVendorProduct({
        title,
        description,
        images: imageUrl ? [imageUrl] : [],
        variants: variants.map((v) => ({
          title: v.title || "Default",
          sku: v.sku,
          prices: [{ amount: Math.round(Number(v.price) * 100), currency_code: "usd" }],
          inventory_quantity: Number(v.inventory_quantity) || 0,
        })),
      })
      router.push("/sell/products")
    } catch {
      setError("We couldn't submit this product. Double check the required fields.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl text-ink mb-1">Add a product</h1>
      <p className="text-sm text-ink/50 mb-8">Submitted as a draft — it goes live once an admin approves it.</p>

      <form onSubmit={handleSubmit} className="card space-y-5">
        <div>
          <label className="text-xs uppercase tracking-widest text-ink/50">Product title</label>
          <input required value={title} onChange={(e) => setTitle(e.target.value)} className="input mt-1" />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-ink/50">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="input mt-1" rows={3} />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-ink/50">Image URL</label>
          <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="input mt-1" placeholder="https://..." />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs uppercase tracking-widest text-ink/50">Variants</label>
            <button type="button" onClick={addVariant} className="text-xs text-sky-600 hover:underline">+ Add variant</button>
          </div>
          <div className="space-y-3">
            {variants.map((v, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-start">
                <input placeholder="Size / variant" value={v.title} onChange={(e) => updateVariant(i, "title", e.target.value)} className="input col-span-4" />
                <input placeholder="SKU" value={v.sku} onChange={(e) => updateVariant(i, "sku", e.target.value)} className="input col-span-3" />
                <input placeholder="Price (USD)" type="number" step="0.01" value={v.price} onChange={(e) => updateVariant(i, "price", e.target.value)} className="input col-span-2" />
                <input placeholder="Stock" type="number" value={v.inventory_quantity} onChange={(e) => updateVariant(i, "inventory_quantity", e.target.value)} className="input col-span-2" />
                {variants.length > 1 && (
                  <button type="button" onClick={() => removeVariant(i)} className="col-span-1 text-ink/30 hover:text-red-600 text-sm pt-2.5">✕</button>
                )}
              </div>
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? "Submitting..." : "Submit for review"}
        </button>
      </form>
    </div>
  )
}

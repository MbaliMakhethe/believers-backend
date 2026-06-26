"use client"

import { useEffect, useState } from "react"
import { listVendorProducts } from "@/lib/vendor"

export default function InventoryPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listVendorProducts()
      .then((res) => setProducts(res.products.filter((p) => p.approval_status === "approved")))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-1">Inventory</h1>
      <p className="text-sm text-ink/50 mb-8">Stock levels for your approved, live products.</p>

      {loading ? (
        <p className="text-sm text-ink/40">Loading...</p>
      ) : products.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-ink/50">No live products yet — once approved, their stock will show here.</p>
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-paper-muted text-left text-ink/50 text-xs uppercase tracking-widest">
              <tr>
                <th className="px-6 py-3 font-medium">Product</th>
                <th className="px-6 py-3 font-medium">Variant</th>
                <th className="px-6 py-3 font-medium">In stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {products.flatMap((vp) =>
                (vp.product?.variants ?? []).map((variant: any) => (
                  <tr key={variant.id}>
                    <td className="px-6 py-4">{vp.product.title}</td>
                    <td className="px-6 py-4 text-ink/60">{variant.title}</td>
                    <td className="px-6 py-4">
                      <span className={variant.inventory_quantity < 5 ? "text-red-600 font-medium" : ""}>
                        {variant.inventory_quantity}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-ink/30 mt-4">
        To restock a variant, edit it from the Products page (editing flow not yet built — see project README).
      </p>
    </div>
  )
}

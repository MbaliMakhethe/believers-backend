"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { listVendorProducts } from "@/lib/vendor"

function StatusBadge({ status }: { status: string }) {
  const cls = status === "approved" ? "badge-approved" : status === "rejected" ? "badge-rejected" : "badge-pending"
  return <span className={cls}>{status.replace("_", " ")}</span>
}

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listVendorProducts().then((res) => setProducts(res.products)).finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl text-ink">Products</h1>
          <p className="text-sm text-ink/50 mt-1">New products are reviewed before they go live on the storefront.</p>
        </div>
        <Link href="/sell/products/new" className="btn-primary">Add product</Link>
      </div>

      {loading ? (
        <p className="text-sm text-ink/40">Loading...</p>
      ) : products.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-ink/50">You haven't added any products yet.</p>
          <Link href="/sell/products/new" className="btn-primary inline-flex mt-6">Add your first product</Link>
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-paper-muted text-left text-ink/50 text-xs uppercase tracking-widest">
              <tr>
                <th className="px-6 py-3 font-medium">Product</th>
                <th className="px-6 py-3 font-medium">Submitted</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {products.map((vp) => (
                <tr key={vp.id}>
                  <td className="px-6 py-4">{vp.product?.title ?? "Untitled"}</td>
                  <td className="px-6 py-4 text-ink/50">{new Date(vp.submitted_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={vp.approval_status} />
                    {vp.approval_status === "rejected" && vp.rejection_reason && (
                      <p className="text-xs text-ink/40 mt-1">{vp.rejection_reason}</p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

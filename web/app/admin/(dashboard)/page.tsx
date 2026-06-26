"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { listVendors, listVendorProductSubmissions, listPayouts } from "@/lib/admin"

export default function AdminOverviewPage() {
  const [pendingVendors, setPendingVendors] = useState(0)
  const [pendingProducts, setPendingProducts] = useState(0)
  const [failedPayouts, setFailedPayouts] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      listVendors("pending"),
      listVendorProductSubmissions("pending_review"),
      listPayouts("failed"),
    ])
      .then(([vendors, products, payouts]) => {
        setPendingVendors(vendors.count)
        setPendingProducts(products.count)
        setFailedPayouts(payouts.count)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-1">Platform overview</h1>
      <p className="text-sm text-ink/50 mb-8">What needs your attention today.</p>

      {loading ? (
        <p className="text-sm text-ink/40">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/admin/vendors" className="card hover:border-sky-400 transition-colors">
            <p className="text-xs text-ink/50 uppercase tracking-widest">Pending vendors</p>
            <p className="font-display text-3xl text-ink mt-2">{pendingVendors}</p>
            <p className="text-xs text-sky-600 mt-3">Review applications →</p>
          </Link>
          <Link href="/admin/products" className="card hover:border-sky-400 transition-colors">
            <p className="text-xs text-ink/50 uppercase tracking-widest">Products awaiting review</p>
            <p className="font-display text-3xl text-ink mt-2">{pendingProducts}</p>
            <p className="text-xs text-sky-600 mt-3">Review submissions →</p>
          </Link>
          <Link href="/admin/payouts" className="card hover:border-sky-400 transition-colors">
            <p className="text-xs text-ink/50 uppercase tracking-widest">Failed payouts</p>
            <p className="font-display text-3xl text-ink mt-2">{failedPayouts}</p>
            <p className="text-xs text-sky-600 mt-3">View payouts →</p>
          </Link>
        </div>
      )}
    </div>
  )
}

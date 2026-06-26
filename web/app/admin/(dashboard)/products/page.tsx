"use client"

import { useEffect, useState } from "react"
import {
  listVendorProductSubmissions,
  approveVendorProduct,
  rejectVendorProduct,
} from "@/lib/admin"

const TABS = ["pending_review", "approved", "rejected"] as const
const TAB_LABELS: Record<(typeof TABS)[number], string> = {
  pending_review: "Pending",
  approved: "Approved",
  rejected: "Rejected",
}

export default function AdminProductsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("pending_review")
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const load = (status: string) => {
    setLoading(true)
    listVendorProductSubmissions(status)
      .then((res) => setItems(res.vendor_products))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load(tab)
  }, [tab])

  const handleApprove = async (id: string) => {
    await approveVendorProduct(id)
    load(tab)
  }

  const handleReject = async (id: string) => {
    const reason = window.prompt("Reason for rejecting this product?")
    if (reason === null) return
    await rejectVendorProduct(id, reason)
    load(tab)
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-1">Product review</h1>
      <p className="text-sm text-ink/50 mb-6">Approving a product publishes it to the storefront immediately.</p>

      <div className="flex gap-1 mb-6 border-b border-ink/10">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-body border-b-2 -mb-px ${
              tab === t ? "border-sky-500 text-sky-700 font-medium" : "border-transparent text-ink/50"
            }`}
          >
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-ink/40">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-ink/40">Nothing here.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {items.map((vp) => (
            <div key={vp.id} className="card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-display text-base text-ink">{vp.product?.title ?? "Untitled"}</p>
                  <p className="text-xs text-ink/50 mt-1">
                    by {vp.vendor?.store_name ?? "Unknown vendor"} · submitted{" "}
                    {new Date(vp.submitted_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {vp.approval_status === "rejected" && vp.rejection_reason && (
                <p className="text-xs text-red-600 mt-3">Rejected: {vp.rejection_reason}</p>
              )}
              {tab === "pending_review" && (
                <div className="flex gap-2 mt-4">
                  <button onClick={() => handleApprove(vp.id)} className="btn-primary !px-3 !py-1.5 text-xs">
                    Approve & publish
                  </button>
                  <button
                    onClick={() => handleReject(vp.id)}
                    className="border border-red-300 text-red-600 px-3 py-1.5 rounded-tag text-xs hover:bg-red-50"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

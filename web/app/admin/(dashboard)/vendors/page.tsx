"use client"

import { useEffect, useState } from "react"
import { listVendors, approveVendor, rejectVendor, type AdminVendor } from "@/lib/admin"

const TABS = ["pending", "approved", "rejected"] as const

export default function AdminVendorsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("pending")
  const [vendors, setVendors] = useState<AdminVendor[]>([])
  const [loading, setLoading] = useState(true)

  const load = (status: string) => {
    setLoading(true)
    listVendors(status)
      .then((res) => setVendors(res.vendors))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load(tab)
  }, [tab])

  const handleApprove = async (id: string) => {
    await approveVendor(id)
    load(tab)
  }

  const handleReject = async (id: string) => {
    const reason = window.prompt("Reason for rejecting this vendor?")
    if (reason === null) return
    await rejectVendor(id, reason)
    load(tab)
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-1">Vendor applications</h1>
      <p className="text-sm text-ink/50 mb-6">Approve or reject who can sell on Believers Wardrobe.</p>

      <div className="flex gap-1 mb-6 border-b border-ink/10">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-body capitalize border-b-2 -mb-px ${
              tab === t ? "border-sky-500 text-sky-700 font-medium" : "border-transparent text-ink/50"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-ink/40">Loading...</p>
      ) : vendors.length === 0 ? (
        <p className="text-sm text-ink/40">No {tab} vendors.</p>
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-paper-muted text-left text-ink/50 text-xs uppercase tracking-widest">
              <tr>
                <th className="px-6 py-3 font-medium">Store name</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Country</th>
                {tab === "pending" && <th className="px-6 py-3 font-medium">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {vendors.map((v) => (
                <tr key={v.id}>
                  <td className="px-6 py-4">{v.store_name}</td>
                  <td className="px-6 py-4 text-ink/60">{v.email}</td>
                  <td className="px-6 py-4 text-ink/60">{v.country}</td>
                  {tab === "pending" && (
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleApprove(v.id)} className="btn-primary !px-3 !py-1.5 text-xs">
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(v.id)}
                          className="border border-red-300 text-red-600 px-3 py-1.5 rounded-tag text-xs hover:bg-red-50"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { listVendorPayouts } from "@/lib/vendor"

function formatMoney(cents: number, currency = "usd") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100)
}

export default function PayoutsPage() {
  const [payouts, setPayouts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listVendorPayouts().then((res) => setPayouts(res.payouts)).finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-1">Payouts</h1>
      <p className="text-sm text-ink/50 mb-8">Transfers to your connected Stripe account, net of commission.</p>

      {loading ? (
        <p className="text-sm text-ink/40">Loading...</p>
      ) : payouts.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-ink/50">No payouts yet — they're batched and sent on a regular schedule.</p>
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-paper-muted text-left text-ink/50 text-xs uppercase tracking-widest">
              <tr>
                <th className="px-6 py-3 font-medium">Period</th>
                <th className="px-6 py-3 font-medium">Gross</th>
                <th className="px-6 py-3 font-medium">Commission</th>
                <th className="px-6 py-3 font-medium">Net paid</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {payouts.map((p) => (
                <tr key={p.id}>
                  <td className="px-6 py-4 text-ink/60">
                    {new Date(p.period_start).toLocaleDateString()} – {new Date(p.period_end).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">{formatMoney(p.gross_amount, p.currency_code)}</td>
                  <td className="px-6 py-4 text-ink/50">{formatMoney(p.commission_amount, p.currency_code)}</td>
                  <td className="px-6 py-4 font-medium">{formatMoney(p.net_amount, p.currency_code)}</td>
                  <td className="px-6 py-4">
                    <span className={p.status === "paid" ? "badge-approved" : p.status === "failed" ? "badge-rejected" : "badge-pending"}>
                      {p.status}
                    </span>
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

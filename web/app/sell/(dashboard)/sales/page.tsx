"use client"

import { useEffect, useState } from "react"
import { listVendorSales } from "@/lib/vendor"

function formatMoney(cents: number, currency = "usd") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100)
}

export default function SalesPage() {
  const [sales, setSales] = useState<any[]>([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listVendorSales()
      .then((res) => {
        setSales(res.sales)
        setCount(res.count)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-1">Sales</h1>
      <p className="text-sm text-ink/50 mb-8">{count} line items sold to date.</p>

      {loading ? (
        <p className="text-sm text-ink/40">Loading...</p>
      ) : sales.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-ink/50">No sales yet — they'll show up here as orders come in.</p>
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-paper-muted text-left text-ink/50 text-xs uppercase tracking-widest">
              <tr>
                <th className="px-6 py-3 font-medium">Order</th>
                <th className="px-6 py-3 font-medium">Qty</th>
                <th className="px-6 py-3 font-medium">Gross</th>
                <th className="px-6 py-3 font-medium">Commission</th>
                <th className="px-6 py-3 font-medium">You earned</th>
                <th className="px-6 py-3 font-medium">Payout status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {sales.map((s) => (
                <tr key={s.id}>
                  <td className="px-6 py-4 font-mono text-xs text-ink/60">{s.order_id.slice(-8)}</td>
                  <td className="px-6 py-4">{s.quantity}</td>
                  <td className="px-6 py-4">{formatMoney(s.line_total, s.currency_code)}</td>
                  <td className="px-6 py-4 text-ink/50">{formatMoney(s.commission_amount, s.currency_code)} ({s.commission_rate_applied}%)</td>
                  <td className="px-6 py-4 font-medium">{formatMoney(s.vendor_net_amount, s.currency_code)}</td>
                  <td className="px-6 py-4">
                    {s.payout_id ? <span className="badge-approved">paid out</span> : <span className="badge-pending">pending</span>}
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

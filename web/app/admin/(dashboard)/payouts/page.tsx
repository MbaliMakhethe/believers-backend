"use client"

import { useEffect, useState } from "react"
import { listPayouts, runAllPayouts, markPayoutPaid, type AdminPayout } from "@/lib/admin"

function formatMoney(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100)
}

export default function AdminPayoutsPage() {
  const [payouts, setPayouts] = useState<AdminPayout[]>([])
  const [loading, setLoading] = useState(true)
  const [running, setRunning] = useState(false)

  const load = () => {
    setLoading(true)
    listPayouts()
      .then((res) => setPayouts(res.payouts))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const handleRunAll = async () => {
    setRunning(true)
    try {
      const periodEnd = new Date()
      const periodStart = new Date(periodEnd.getTime() - 7 * 24 * 60 * 60 * 1000)
      await runAllPayouts(periodStart, periodEnd)
      load()
    } finally {
      setRunning(false)
    }
  }

  const handleMarkPaid = async (id: string) => {
    await markPayoutPaid(id)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl text-ink">Payouts</h1>
          <p className="text-sm text-ink/50 mt-1">Vendor earnings, net of commission, transferred via Stripe Connect.</p>
        </div>
        <button onClick={handleRunAll} disabled={running} className="btn-primary">
          {running ? "Running..." : "Run payouts for all vendors"}
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-ink/40">Loading...</p>
      ) : payouts.length === 0 ? (
        <p className="text-sm text-ink/40">No payouts yet.</p>
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-paper-muted text-left text-ink/50 text-xs uppercase tracking-widest">
              <tr>
                <th className="px-6 py-3 font-medium">Vendor</th>
                <th className="px-6 py-3 font-medium">Gross</th>
                <th className="px-6 py-3 font-medium">Commission</th>
                <th className="px-6 py-3 font-medium">Net paid</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {payouts.map((p) => (
                <tr key={p.id}>
                  <td className="px-6 py-4">{p.vendor?.store_name ?? p.vendor?.id ?? "—"}</td>
                  <td className="px-6 py-4">{formatMoney(p.gross_amount, p.currency_code)}</td>
                  <td className="px-6 py-4 text-ink/50">{formatMoney(p.commission_amount, p.currency_code)}</td>
                  <td className="px-6 py-4 font-medium">{formatMoney(p.net_amount, p.currency_code)}</td>
                  <td className="px-6 py-4">
                    <span
                      className={
                        p.status === "paid" ? "badge-approved" : p.status === "failed" ? "badge-rejected" : "badge-pending"
                      }
                    >
                      {p.status}
                    </span>
                    {p.status === "failed" && p.failure_reason && (
                      <p className="text-xs text-ink/40 mt-1">{p.failure_reason}</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {p.status === "failed" && (
                      <button onClick={() => handleMarkPaid(p.id)} className="text-xs text-sky-600 hover:underline">
                        Mark paid manually
                      </button>
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

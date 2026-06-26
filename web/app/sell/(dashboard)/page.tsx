"use client"

import Link from "next/link"
import { useVendor } from "@/context/vendor-context"

function formatMoney(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "usd" }).format(cents / 100)
}

export default function OverviewPage() {
  const { dashboard, vendor } = useVendor()
  if (!dashboard) return null
  const { summary, low_stock_alerts, recent_payouts } = dashboard

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-1">
        Welcome back{vendor ? `, ${vendor.store_name}` : ""}
      </h1>
      <p className="text-sm text-ink/50 mb-8">Here's how your store is doing.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="card">
          <p className="text-xs text-ink/50 uppercase tracking-widest">Orders</p>
          <p className="font-display text-2xl text-ink mt-2">{summary.total_orders}</p>
        </div>
        <div className="card">
          <p className="text-xs text-ink/50 uppercase tracking-widest">Gross sales</p>
          <p className="font-display text-2xl text-ink mt-2">{formatMoney(summary.total_gross_sales)}</p>
        </div>
        <div className="card">
          <p className="text-xs text-ink/50 uppercase tracking-widest">Net earnings</p>
          <p className="font-display text-2xl text-ink mt-2">{formatMoney(summary.total_net_earnings)}</p>
        </div>
        <div className="card">
          <p className="text-xs text-ink/50 uppercase tracking-widest">Pending payout</p>
          <p className="font-display text-2xl text-sky-700 mt-2">{formatMoney(summary.pending_payout_amount)}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg text-ink">Low stock</h2>
            <Link href="/sell/inventory" className="text-xs text-sky-600 hover:underline">View inventory</Link>
          </div>
          {low_stock_alerts.length === 0 ? (
            <p className="text-sm text-ink/40">All your variants are well stocked.</p>
          ) : (
            <ul className="space-y-2">
              {low_stock_alerts.map((item, i) => (
                <li key={i} className="flex justify-between text-sm">
                  <span className="text-ink/70">{item.product_title} — {item.variant_title}</span>
                  <span className="text-red-600 font-medium">{item.inventory_quantity} left</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg text-ink">Recent payouts</h2>
            <Link href="/sell/payouts" className="text-xs text-sky-600 hover:underline">View all</Link>
          </div>
          {recent_payouts.length === 0 ? (
            <p className="text-sm text-ink/40">No payouts yet.</p>
          ) : (
            <ul className="space-y-2">
              {recent_payouts.slice(0, 5).map((p: any) => (
                <li key={p.id} className="flex justify-between text-sm">
                  <span className="text-ink/70">{p.status}</span>
                  <span className="font-medium">{formatMoney(p.net_amount)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

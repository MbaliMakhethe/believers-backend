"use client"

import { useState } from "react"
import { useVendor } from "@/context/vendor-context"
import { startOnboarding } from "@/lib/vendor"

export default function SettingsPage() {
  const { vendor } = useVendor()
  const [loading, setLoading] = useState(false)

  const handleConnectStripe = async () => {
    setLoading(true)
    try {
      const { url } = await startOnboarding()
      window.location.href = url
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-2xl text-ink mb-1">Settings</h1>
      <p className="text-sm text-ink/50 mb-8">Manage your store and payout details.</p>

      <div className="card">
        <h2 className="font-display text-lg text-ink mb-2">Store</h2>
        <dl className="text-sm space-y-2">
          <div className="flex justify-between">
            <dt className="text-ink/50">Store name</dt>
            <dd>{vendor?.store_name}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink/50">Email</dt>
            <dd>{vendor?.email}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink/50">Application status</dt>
            <dd className="capitalize">{vendor?.status}</dd>
          </div>
        </dl>
      </div>

      <div className="card mt-6">
        <h2 className="font-display text-lg text-ink mb-2">Payouts</h2>
        <p className="text-sm text-ink/60 mb-4">
          {vendor?.stripe_payouts_enabled
            ? "Stripe is connected — payouts are sent automatically on your platform's schedule."
            : "Connect a Stripe account to receive payouts for your sales."}
        </p>
        {!vendor?.stripe_payouts_enabled && (
          <button onClick={handleConnectStripe} disabled={loading} className="btn-primary">
            {loading ? "Redirecting..." : "Connect Stripe"}
          </button>
        )}
      </div>
    </div>
  )
}

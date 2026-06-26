"use client"

import Link from "next/link"
import { useVendor } from "@/context/vendor-context"

export default function StatusBanner() {
  const { vendor } = useVendor()
  if (!vendor) return null

  if (vendor.status === "pending") {
    return (
      <div className="bg-amber-50 border-b border-amber-200 px-8 py-3 text-sm text-amber-800">
        Your application is under review. You'll be notified by email once
        it's approved — product uploads open up after that.
      </div>
    )
  }

  if (vendor.status === "rejected") {
    return (
      <div className="bg-red-50 border-b border-red-200 px-8 py-3 text-sm text-red-800">
        Your application wasn't approved.
        {vendor.rejection_reason ? ` Reason: ${vendor.rejection_reason}` : ""}
      </div>
    )
  }

  if (vendor.status === "approved" && !vendor.stripe_payouts_enabled) {
    return (
      <div className="bg-sky-50 border-b border-sky-200 px-8 py-3 text-sm text-sky-800 flex items-center justify-between">
        <span>Connect Stripe to start receiving payouts for your sales.</span>
        <Link href="/sell/settings" className="font-medium underline shrink-0 ml-4">
          Set up payouts
        </Link>
      </div>
    )
  }

  return null
}

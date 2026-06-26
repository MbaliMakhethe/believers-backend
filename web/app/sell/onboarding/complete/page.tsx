"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getOnboardingStatus } from "@/lib/vendor"

export default function OnboardingCompletePage() {
  const [status, setStatus] = useState<string | null>(null)

  useEffect(() => {
    getOnboardingStatus().then((res) => setStatus(res.status))
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center px-6 text-center">
      <div className="max-w-sm">
        <h1 className="font-display text-2xl text-ink">
          {status === "complete" ? "You're all set" : "Almost there"}
        </h1>
        <p className="text-sm text-ink/60 mt-3">
          {status === "complete"
            ? "Stripe is connected — payouts will go straight to your account."
            : "Stripe is still processing your details. This can take a moment."}
        </p>
        <Link href="/sell/settings" className="btn-primary inline-flex mt-8">Back to settings</Link>
      </div>
    </div>
  )
}

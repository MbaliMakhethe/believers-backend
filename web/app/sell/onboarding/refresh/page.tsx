"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { startOnboarding } from "@/lib/vendor"

export default function OnboardingRefreshPage() {
  const router = useRouter()

  useEffect(() => {
    startOnboarding()
      .then(({ url }) => window.location.replace(url))
      .catch(() => router.push("/sell/settings"))
  }, [router])

  return <div className="min-h-screen flex items-center justify-center text-sm text-ink/50">Restarting Stripe onboarding...</div>
}

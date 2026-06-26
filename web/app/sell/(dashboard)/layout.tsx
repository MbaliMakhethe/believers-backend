"use client"

import VendorSidebar from "@/components/vendor/Sidebar"
import StatusBanner from "@/components/vendor/StatusBanner"
import { useVendor } from "@/context/vendor-context"

export default function VendorDashboardLayout({ children }: { children: React.ReactNode }) {
  const { loading, authenticated } = useVendor()

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-ink/40 text-sm">Loading...</div>
  }

  if (!authenticated) {
    return null
  }

  return (
    <div className="flex">
      <VendorSidebar />
      <div className="flex-1 min-w-0">
        <StatusBanner />
        <main className="px-8 py-8">{children}</main>
      </div>
    </div>
  )
}

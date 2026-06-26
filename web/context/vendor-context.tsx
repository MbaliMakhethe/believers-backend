"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { vendorToken } from "@/lib/api"
import { getDashboard, getMe, type DashboardSummary, type Vendor } from "@/lib/vendor"

type VendorContextValue = {
  authenticated: boolean
  loading: boolean
  vendor: Vendor | null
  dashboard: DashboardSummary | null
  refreshDashboard: () => Promise<void>
  logout: () => void
}

const VendorContext = createContext<VendorContextValue | undefined>(undefined)

const PUBLIC_PATHS = ["/sell/login", "/sell/register", "/sell/application-received"]

export function VendorProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [dashboard, setDashboard] = useState<DashboardSummary | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  const refreshDashboard = async () => {
    try {
      const [me, data] = await Promise.all([getMe(), getDashboard()])
      setVendor(me.vendor)
      setDashboard(data)
      setAuthenticated(true)
    } catch {
      setAuthenticated(false)
      vendorToken.clear()
      if (!PUBLIC_PATHS.includes(pathname)) {
        router.push("/sell/login")
      }
    }
  }

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      const token = vendorToken.get()
      if (!token) {
        setAuthenticated(false)
        setLoading(false)
        if (!PUBLIC_PATHS.includes(pathname) && !pathname.startsWith("/sell/onboarding")) {
          router.push("/sell/login")
        }
        return
      }
      await refreshDashboard()
      setLoading(false)
    }
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  const logout = () => {
    vendorToken.clear()
    setAuthenticated(false)
    setVendor(null)
    setDashboard(null)
    router.push("/sell/login")
  }

  return (
    <VendorContext.Provider value={{ authenticated, loading, vendor, dashboard, refreshDashboard, logout }}>
      {children}
    </VendorContext.Provider>
  )
}

export function useVendor() {
  const ctx = useContext(VendorContext)
  if (!ctx) throw new Error("useVendor must be used within a VendorProvider")
  return ctx
}

"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { adminToken } from "@/lib/api"
import { getCurrentAdmin } from "@/lib/admin"

type AdminUser = { id: string; email: string; first_name: string | null }

type AdminContextValue = {
  authenticated: boolean
  loading: boolean
  admin: AdminUser | null
  logout: () => void
}

const AdminContext = createContext<AdminContextValue | undefined>(undefined)
const PUBLIC_PATHS = ["/admin/login"]

export function AdminProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      const token = adminToken.get()
      if (!token) {
        setAuthenticated(false)
        setLoading(false)
        if (!PUBLIC_PATHS.includes(pathname)) router.push("/admin/login")
        return
      }
      try {
        const { user } = await getCurrentAdmin()
        setAdmin(user)
        setAuthenticated(true)
      } catch {
        adminToken.clear()
        setAuthenticated(false)
        if (!PUBLIC_PATHS.includes(pathname)) router.push("/admin/login")
      } finally {
        setLoading(false)
      }
    }
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  const logout = () => {
    adminToken.clear()
    setAuthenticated(false)
    setAdmin(null)
    router.push("/admin/login")
  }

  return (
    <AdminContext.Provider value={{ authenticated, loading, admin, logout }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error("useAdmin must be used within an AdminProvider")
  return ctx
}

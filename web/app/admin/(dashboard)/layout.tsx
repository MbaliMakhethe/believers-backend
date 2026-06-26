"use client"

import AdminSidebar from "@/components/admin/Sidebar"
import { useAdmin } from "@/context/admin-context"

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const { loading, authenticated } = useAdmin()

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-ink/40 text-sm">Loading...</div>
  }

  if (!authenticated) {
    return null
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 min-w-0 px-8 py-8">{children}</main>
    </div>
  )
}

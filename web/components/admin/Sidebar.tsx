"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAdmin } from "@/context/admin-context"

const NAV_ITEMS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/vendors", label: "Vendors" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/commission", label: "Commission" },
  { href: "/admin/payouts", label: "Payouts" },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const { admin, logout } = useAdmin()

  return (
    <aside className="w-60 shrink-0 border-r border-ink/10 bg-ink min-h-screen flex flex-col text-paper">
      <div className="px-6 py-6 border-b border-paper/10">
        <Link href="/" className="font-display text-lg">
          Believers <span className="text-sky-400">Wardrobe</span>
        </Link>
        <p className="text-xs text-paper/40 mt-1">Platform Admin</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-3 py-2 rounded-tag text-sm font-body transition-colors ${
                active ? "bg-paper/10 text-sky-300 font-medium" : "text-paper/70 hover:bg-paper/5"
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t border-paper/10">
        <p className="px-3 text-xs text-paper/40 mb-2 truncate">{admin?.email}</p>
        <button onClick={logout} className="w-full text-left px-3 py-2 rounded-tag text-sm text-paper/50 hover:bg-paper/5">
          Sign out
        </button>
      </div>
    </aside>
  )
}

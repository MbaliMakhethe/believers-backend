"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useVendor } from "@/context/vendor-context"

const NAV_ITEMS = [
  { href: "/sell", label: "Overview" },
  { href: "/sell/products", label: "Products" },
  { href: "/sell/inventory", label: "Inventory" },
  { href: "/sell/sales", label: "Sales" },
  { href: "/sell/payouts", label: "Payouts" },
  { href: "/sell/settings", label: "Settings" },
]

export default function VendorSidebar() {
  const pathname = usePathname()
  const { vendor, logout } = useVendor()

  return (
    <aside className="w-60 shrink-0 border-r border-ink/10 bg-paper min-h-screen flex flex-col">
      <div className="px-6 py-6 border-b border-ink/10">
        <Link href="/" className="font-display text-lg text-ink">
          Believers <span className="text-sky-600">Wardrobe</span>
        </Link>
        <p className="text-xs text-ink/40 mt-1">{vendor?.store_name}</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-3 py-2 rounded-tag text-sm font-body transition-colors ${
                active ? "bg-sky-50 text-sky-700 font-medium" : "text-ink/70 hover:bg-paper-muted"
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t border-ink/10">
        <button onClick={logout} className="w-full text-left px-3 py-2 rounded-tag text-sm text-ink/50 hover:bg-paper-muted">
          Sign out
        </button>
      </div>
    </aside>
  )
}

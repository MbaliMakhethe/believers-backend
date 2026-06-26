"use client"

import Link from "next/link"
import { useCart } from "@/context/cart-context"

export default function Header() {
  const { cart } = useCart()
  const itemCount = cart?.items?.reduce((sum, i) => sum + i.quantity, 0) ?? 0

  return (
    <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur border-b border-ink/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="stitch-tag px-3 py-1.5">
            <span className="font-display text-lg tracking-tight text-ink">
              Believers <span className="text-sky-600">Wardrobe</span>
            </span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 font-body text-sm text-ink/80">
          <Link href="/products" className="hover:text-sky-600 transition-colors">
            Shop All
          </Link>
          <Link href="/vendors" className="hover:text-sky-600 transition-colors">
            Our Vendors
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/sell/register" className="hidden sm:inline text-sm text-ink/70 hover:text-sky-600 transition-colors">
            Sell with us
          </Link>
          <Link href="/cart" className="relative">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-ink">
              <path d="M6 8h12l-1 12H7L6 8Z" />
              <path d="M9 8a3 3 0 0 1 6 0" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-sky-500 text-white text-[10px] font-mono w-4 h-4 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}

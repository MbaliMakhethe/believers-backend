import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-ink text-paper/80 mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2">
          <span className="font-display text-xl text-paper">Believers Wardrobe</span>
          <p className="mt-3 text-sm max-w-xs text-paper/60">
            A marketplace of independent Christian clothing makers from
            around the world, brought together under one roof.
          </p>
        </div>
        <div>
          <h3 className="font-body text-xs uppercase tracking-widest text-paper/50 mb-4">Shop</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/products" className="hover:text-sky-300">All products</Link></li>
            <li><Link href="/vendors" className="hover:text-sky-300">Our vendors</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-body text-xs uppercase tracking-widest text-paper/50 mb-4">Sell</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/sell/register" className="hover:text-sky-300">Become a vendor</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-paper/10 py-6 text-center text-xs text-paper/40">
        © {new Date().getFullYear()} Believers Wardrobe. All rights reserved.
      </div>
    </footer>
  )
}

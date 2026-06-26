import Link from "next/link"
import { listVendors } from "@/lib/store"

export default async function VendorsPage() {
  let vendors: Awaited<ReturnType<typeof listVendors>>["vendors"] = []
  try {
    const res = await listVendors()
    vendors = res.vendors
  } catch {
    vendors = []
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="mb-12 max-w-xl">
        <h1 className="font-display text-3xl text-ink">Our vendors</h1>
        <p className="text-ink/60 mt-3 font-body">
          Every brand on Believers Wardrobe is run by an independent maker.
          Here's who's behind the rack.
        </p>
      </div>

      {vendors.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors.map((v) => (
            <Link
              key={v.id}
              href={`/vendors/${v.id}`}
              className="stitch-tag p-6 block hover:border-sky-500 transition-colors"
            >
              <h2 className="font-display text-lg text-ink">{v.store_name}</h2>
              <p className="text-xs text-sky-700 mt-1 font-body">{v.country}</p>
              {v.description && (
                <p className="text-sm text-ink/60 mt-3 font-body line-clamp-3">{v.description}</p>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-ink/50 font-body text-sm">No vendors approved yet — check back soon.</p>
      )}
    </div>
  )
}

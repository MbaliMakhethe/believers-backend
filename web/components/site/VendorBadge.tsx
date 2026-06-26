import Link from "next/link"

export default function VendorBadge({
  vendorId,
  storeName,
  country,
}: {
  vendorId: string
  storeName: string
  country?: string
}) {
  return (
    <Link
      href={`/vendors/${vendorId}`}
      className="stitch-tag inline-flex items-center gap-2 px-3 py-2 hover:border-sky-500 transition-colors"
    >
      <span className="w-2 h-2 rounded-full bg-sky-500" />
      <span className="text-xs font-body text-ink/80">
        Crafted by <span className="text-ink font-medium">{storeName}</span>
        {country ? ` · ${country}` : ""}
      </span>
    </Link>
  )
}

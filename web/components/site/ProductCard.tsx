import Link from "next/link"
import Image from "next/image"
import type { StoreProduct } from "@/lib/store"

function formatPrice(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount)
}

export default function ProductCard({ product }: { product: StoreProduct }) {
  const price = product.variants?.[0]?.calculated_price
  const vendor = product.vendor_product?.vendor

  return (
    <Link href={`/products/${product.handle}`} className="group block">
      <div className="aspect-[4/5] bg-sky-50 overflow-hidden relative">
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sky-300 font-display text-sm">
            Believers Wardrobe
          </div>
        )}
      </div>
      <div className="mt-3">
        <h3 className="font-display text-base text-ink leading-snug">{product.title}</h3>
        {vendor && (
          <p className="text-xs text-ink/50 mt-0.5 font-body">Crafted by {vendor.store_name}</p>
        )}
        {price && (
          <p className="text-sm text-ink/80 mt-1 font-body">
            {formatPrice(price.calculated_amount, price.currency_code)}
          </p>
        )}
      </div>
    </Link>
  )
}

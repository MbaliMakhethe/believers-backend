import Image from "next/image"
import { notFound } from "next/navigation"
import { getProductByHandle } from "@/lib/store"
import VendorBadge from "@/components/site/VendorBadge"
import AddToCartForm from "@/components/site/AddToCartForm"

function formatPrice(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount)
}

export default async function ProductDetailPage({ params }: { params: { handle: string } }) {
  const product = await getProductByHandle(params.handle).catch(() => null)
  if (!product) notFound()

  const price = product.variants?.[0]?.calculated_price
  const vendor = product.vendor_product?.vendor

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">
      <div className="aspect-[4/5] bg-sky-50 relative overflow-hidden">
        {product.thumbnail ? (
          <Image src={product.thumbnail} alt={product.title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sky-300 font-display">
            Believers Wardrobe
          </div>
        )}
      </div>

      <div>
        {vendor && (
          <VendorBadge vendorId={product.vendor_product!.vendor_id} storeName={vendor.store_name} />
        )}
        <h1 className="font-display text-3xl text-ink mt-5">{product.title}</h1>
        {price && (
          <p className="text-xl text-ink/80 mt-2 font-body">
            {formatPrice(price.calculated_amount, price.currency_code)}
          </p>
        )}
        {product.description && (
          <p className="text-ink/60 mt-6 font-body leading-relaxed max-w-md">{product.description}</p>
        )}
        <AddToCartForm product={product} />
      </div>
    </div>
  )
}

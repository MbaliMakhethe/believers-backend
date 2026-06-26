import { notFound } from "next/navigation"
import { getVendor, getVendorProducts } from "@/lib/store"
import ProductCard from "@/components/site/ProductCard"

export default async function VendorDetailPage({ params }: { params: { id: string } }) {
  const [vendorRes, productsRes] = await Promise.all([
    getVendor(params.id).catch(() => null),
    getVendorProducts(params.id).catch(() => ({ products: [], count: 0 })),
  ])

  if (!vendorRes) notFound()
  const { vendor } = vendorRes
  const { products } = productsRes

  return (
    <div>
      <section className="bg-sky-50 border-b border-ink/10">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <span className="text-xs font-body uppercase tracking-widest text-sky-700">{vendor.country}</span>
          <h1 className="font-display text-4xl text-ink mt-2">{vendor.store_name}</h1>
          {vendor.description && (
            <p className="text-ink/60 mt-4 max-w-xl font-body leading-relaxed">{vendor.description}</p>
          )}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="font-display text-xl text-ink mb-8">
          {products.length} {products.length === 1 ? "piece" : "pieces"} from {vendor.store_name}
        </h2>
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <p className="text-ink/50 font-body text-sm">This maker hasn't published any products yet.</p>
        )}
      </section>
    </div>
  )
}

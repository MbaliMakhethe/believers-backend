import { listProducts } from "@/lib/store"
import ProductCard from "@/components/site/ProductCard"

export default async function ProductsPage({ searchParams }: { searchParams: { q?: string } }) {
  let products: Awaited<ReturnType<typeof listProducts>>["products"] = []
  let count = 0
  try {
    const res = await listProducts({ q: searchParams.q, limit: 48 })
    products = res.products
    count = res.count
  } catch {
    products = []
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="mb-10">
        <h1 className="font-display text-3xl text-ink">Shop all makers</h1>
        <p className="text-ink/50 text-sm mt-2 font-body">
          {count > 0 ? `${count} pieces from independent Christian brands` : "Browse the full catalog"}
        </p>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      ) : (
        <p className="text-ink/50 font-body text-sm">
          No products found. Once vendor submissions are approved, they'll show up here.
        </p>
      )}
    </div>
  )
}

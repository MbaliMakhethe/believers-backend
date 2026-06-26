import Link from "next/link"
import { listProducts } from "@/lib/store"
import ProductCard from "@/components/site/ProductCard"

export default async function HomePage() {
  let products: Awaited<ReturnType<typeof listProducts>>["products"] = []
  try {
    const res = await listProducts({ limit: 8 })
    products = res.products
  } catch {
    products = []
  }

  return (
    <div>
      <section className="relative border-b border-ink/10">
        <div className="max-w-7xl mx-auto px-6 py-24 md:py-32 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="stitch-tag inline-block px-3 py-1 text-xs font-body tracking-widest uppercase text-sky-700 mb-6">
              A global house of Christian makers
            </span>
            <h1 className="font-display text-5xl md:text-6xl leading-[1.05] text-ink">
              Clothing, worn as <em className="text-sky-600 not-italic">witness</em>.
            </h1>
            <p className="mt-6 text-ink/70 text-lg max-w-md font-body">
              Believers Wardrobe gathers independent Christian clothing brands
              from around the world onto one rack — every piece made by a
              maker you can know by name.
            </p>
            <div className="mt-8 flex gap-4">
              <Link href="/products" className="btn-primary">Shop all makers</Link>
              <Link href="/vendors" className="btn-secondary">Meet our vendors</Link>
            </div>
          </div>
          <div className="aspect-[4/5] bg-sky-50 relative overflow-hidden">
            <div className="absolute inset-0 bg-sky-100/40" />
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-paper/90 backdrop-blur stitch-tag m-4">
              <p className="text-xs font-body text-ink/60">Featured this week</p>
              <p className="font-display text-lg text-ink">New arrivals from 6 countries</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-display text-2xl text-ink">New on the rack</h2>
          <Link href="/products" className="text-sm text-sky-600 hover:underline font-body">View all</Link>
        </div>
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <p className="text-ink/50 font-body text-sm">
            No products yet — once vendors are approved and their products
            published, they'll appear here.
          </p>
        )}
      </section>

      <section className="bg-sky-50 border-y border-ink/10">
        <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-10">
          <div>
            <span className="block w-8 h-px bg-sky-600" />
            <h3 className="font-display text-lg text-ink mt-3">Every maker, vetted</h3>
            <p className="text-sm text-ink/60 mt-2 font-body">
              Vendors apply and every product is reviewed before it reaches the rack.
            </p>
          </div>
          <div>
            <span className="block w-8 h-px bg-sky-600" />
            <h3 className="font-display text-lg text-ink mt-3">Fair to the maker</h3>
            <p className="text-sm text-ink/60 mt-2 font-body">
              A transparent commission keeps the platform running — the rest goes home with them.
            </p>
          </div>
          <div>
            <span className="block w-8 h-px bg-sky-600" />
            <h3 className="font-display text-lg text-ink mt-3">Worn with meaning</h3>
            <p className="text-sm text-ink/60 mt-2 font-body">
              Each piece carries the story and the country of the hands that made it.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

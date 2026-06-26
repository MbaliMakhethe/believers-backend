import Link from "next/link"
import { getOrder } from "@/lib/store"

export default async function OrderConfirmedPage({ params }: { params: { id: string } }) {
  let displayId: number | null = null
  try {
    const { order } = await getOrder(params.id)
    displayId = order.display_id
  } catch {
    displayId = null
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-32 text-center">
      <span className="stitch-tag inline-block px-4 py-2 text-xs font-body uppercase tracking-widest text-sky-700 mb-6">
        Order confirmed
      </span>
      <h1 className="font-display text-3xl text-ink">Thank you for your order</h1>
      <p className="text-ink/60 mt-3 font-body">
        {displayId
          ? `Order #${displayId} is on its way to being prepared by the makers who crafted it.`
          : "Your order is on its way to being prepared by the makers who crafted it."}
      </p>
      <Link href="/products" className="btn-primary inline-flex mt-10">Continue shopping</Link>
    </div>
  )
}

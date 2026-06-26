"use client"

import { useCart } from "@/context/cart-context"
import CheckoutForm from "@/components/site/CheckoutForm"

function formatPrice(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount / 100)
}

export default function CheckoutPage() {
  const { cart, loading } = useCart()

  if (loading) {
    return <div className="max-w-3xl mx-auto px-6 py-24 text-center text-ink/50 font-body">Loading checkout...</div>
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-2xl text-ink">Your cart is empty</h1>
        <p className="text-ink/50 mt-2 font-body">Add something before checking out.</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-12">
      <div className="md:col-span-2">
        <h1 className="font-display text-3xl text-ink mb-10">Checkout</h1>
        <CheckoutForm />
      </div>

      <div className="stitch-tag p-6 h-fit">
        <h2 className="font-display text-lg text-ink mb-4">Order summary</h2>
        <div className="space-y-3">
          {cart.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm font-body">
              <span className="text-ink/70">{item.title} × {item.quantity}</span>
              <span className="text-ink/70">{formatPrice(item.unit_price * item.quantity, cart.currency_code)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-ink/10 mt-4 pt-4 flex justify-between font-display text-base">
          <span>Total</span>
          <span>{formatPrice(cart.total, cart.currency_code)}</span>
        </div>
      </div>
    </div>
  )
}

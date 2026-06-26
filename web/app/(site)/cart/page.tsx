"use client"

import Link from "next/link"
import { useCart } from "@/context/cart-context"

function formatPrice(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount / 100)
}

export default function CartPage() {
  const { cart, loading, updateItem, removeItem } = useCart()

  if (loading) {
    return <div className="max-w-3xl mx-auto px-6 py-24 text-center text-ink/50 font-body">Loading your cart...</div>
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-2xl text-ink">Your cart is empty</h1>
        <p className="text-ink/50 mt-2 font-body">Find something made with care.</p>
        <Link href="/products" className="btn-primary inline-flex mt-8">Shop all makers</Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="font-display text-3xl text-ink mb-10">Your cart</h1>

      <div className="divide-y divide-ink/10 border-y border-ink/10">
        {cart.items.map((item) => (
          <div key={item.id} className="flex items-center gap-5 py-6">
            <div className="w-20 h-24 bg-sky-50 flex-shrink-0 overflow-hidden">
              {item.thumbnail && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
              )}
            </div>
            <div className="flex-1">
              <p className="font-display text-base text-ink">{item.title}</p>
              <p className="text-sm text-ink/50 mt-1 font-body">{formatPrice(item.unit_price, cart.currency_code)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))}
                className="w-8 h-8 border border-ink/20 rounded-tag text-ink/70 hover:border-ink"
              >
                −
              </button>
              <span className="w-6 text-center font-body text-sm">{item.quantity}</span>
              <button
                onClick={() => updateItem(item.id, item.quantity + 1)}
                className="w-8 h-8 border border-ink/20 rounded-tag text-ink/70 hover:border-ink"
              >
                +
              </button>
            </div>
            <button onClick={() => removeItem(item.id)} className="text-xs text-ink/40 hover:text-ink font-body ml-2">
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-8">
        <span className="font-display text-lg text-ink">Total</span>
        <span className="font-display text-lg text-ink">{formatPrice(cart.total, cart.currency_code)}</span>
      </div>

      <Link href="/checkout" className="btn-primary w-full mt-8 sm:w-auto sm:float-right">
        Proceed to checkout
      </Link>
    </div>
  )
}

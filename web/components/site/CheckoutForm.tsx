"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { getStripe } from "@/lib/stripe-client"
import { useCart } from "@/context/cart-context"
import {
  updateCartDetails,
  listShippingOptions,
  addShippingMethod,
  createPaymentCollection,
  initiatePaymentSession,
  completeCart,
} from "@/lib/store"

type Address = {
  first_name: string
  last_name: string
  address_1: string
  city: string
  postal_code: string
  country_code: string
}

const emptyAddress: Address = {
  first_name: "",
  last_name: "",
  address_1: "",
  city: "",
  postal_code: "",
  country_code: "",
}

function PaymentStep({ cartId }: { cartId: string }) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePay = async () => {
    if (!stripe || !elements) return
    setSubmitting(true)
    setError(null)

    const { error: submitError } = await elements.submit()
    if (submitError) {
      setError(submitError.message ?? "Please check your payment details")
      setSubmitting(false)
      return
    }

    const { error: confirmError } = await stripe.confirmPayment({ elements, redirect: "if_required" })
    if (confirmError) {
      setError(confirmError.message ?? "Payment failed — please try again")
      setSubmitting(false)
      return
    }

    try {
      const result = await completeCart(cartId)
      if (result.type === "order" && result.order) {
        localStorage.removeItem("bw_cart_id")
        router.push(`/order/confirmed/${result.order.id}`)
      } else {
        setError("We couldn't finalize your order. Please contact support.")
      }
    } catch {
      setError("We couldn't finalize your order. Please contact support.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <PaymentElement />
      {error && <p className="text-sm text-red-600 mt-4 font-body">{error}</p>}
      <button onClick={handlePay} disabled={submitting} className="btn-primary w-full mt-6">
        {submitting ? "Placing order..." : "Place order"}
      </button>
    </div>
  )
}

export default function CheckoutForm() {
  const { cart } = useCart()
  const [address, setAddress] = useState<Address>(emptyAddress)
  const [email, setEmail] = useState("")
  const [shippingOptions, setShippingOptions] = useState<{ id: string; name: string; amount: number }[]>([])
  const [selectedShipping, setSelectedShipping] = useState("")
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [step, setStep] = useState<"address" | "payment">("address")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!cart) return
    listShippingOptions(cart.id)
      .then((res) => setShippingOptions(res.shipping_options))
      .catch(() => setShippingOptions([]))
  }, [cart])

  if (!cart) return null

  const handleContinueToPayment = async () => {
    setLoading(true)
    try {
      await updateCartDetails(cart.id, { email, shipping_address: address })
      if (selectedShipping) {
        await addShippingMethod(cart.id, selectedShipping)
      }
      const { payment_collection } = await createPaymentCollection(cart.id)
      const { payment_collection: withSession } = await initiatePaymentSession(payment_collection.id)
      const session = withSession.payment_sessions.find((s) => s.provider_id === "stripe")
      if (session) {
        setClientSecret(session.data.client_secret)
        setStep("payment")
      }
    } finally {
      setLoading(false)
    }
  }

  if (step === "payment" && clientSecret) {
    return (
      <Elements stripe={getStripe()} options={{ clientSecret }}>
        <PaymentStep cartId={cart.id} />
      </Elements>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <label className="text-xs font-body uppercase tracking-widest text-ink/50">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input mt-1"
          placeholder="you@example.com"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <input
          placeholder="First name"
          value={address.first_name}
          onChange={(e) => setAddress({ ...address, first_name: e.target.value })}
          className="input"
        />
        <input
          placeholder="Last name"
          value={address.last_name}
          onChange={(e) => setAddress({ ...address, last_name: e.target.value })}
          className="input"
        />
      </div>
      <input
        placeholder="Address"
        value={address.address_1}
        onChange={(e) => setAddress({ ...address, address_1: e.target.value })}
        className="input mb-4"
      />
      <div className="grid grid-cols-3 gap-4 mb-4">
        <input
          placeholder="City"
          value={address.city}
          onChange={(e) => setAddress({ ...address, city: e.target.value })}
          className="input"
        />
        <input
          placeholder="Postal code"
          value={address.postal_code}
          onChange={(e) => setAddress({ ...address, postal_code: e.target.value })}
          className="input"
        />
        <input
          placeholder="Country code (e.g. US)"
          value={address.country_code}
          onChange={(e) => setAddress({ ...address, country_code: e.target.value.toLowerCase() })}
          className="input"
        />
      </div>

      {shippingOptions.length > 0 && (
        <div className="mb-6">
          <label className="text-xs font-body uppercase tracking-widest text-ink/50">Shipping method</label>
          <div className="space-y-2 mt-2">
            {shippingOptions.map((opt) => (
              <label
                key={opt.id}
                className="flex items-center justify-between border border-ink/20 rounded-tag px-4 py-3 cursor-pointer has-[:checked]:border-ink"
              >
                <span className="flex items-center gap-3 font-body text-sm">
                  <input
                    type="radio"
                    name="shipping"
                    checked={selectedShipping === opt.id}
                    onChange={() => setSelectedShipping(opt.id)}
                  />
                  {opt.name}
                </span>
                <span className="font-body text-sm text-ink/60">{(opt.amount / 100).toFixed(2)}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleContinueToPayment}
        disabled={loading || !email || !address.first_name}
        className="btn-primary w-full"
      >
        {loading ? "Continuing..." : "Continue to payment"}
      </button>
    </div>
  )
}

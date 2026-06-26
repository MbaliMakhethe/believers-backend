"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { registerCustomer, registerVendor } from "@/lib/vendor"

export default function VendorRegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    contact_name: "",
    email: "",
    password: "",
    store_name: "",
    country: "",
    description: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [key]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const [first_name, ...rest] = form.contact_name.trim().split(" ")
      await registerCustomer({
        email: form.email,
        password: form.password,
        first_name: first_name || form.contact_name,
        last_name: rest.join(" ") || "—",
      })
      await registerVendor({
        store_name: form.store_name,
        contact_name: form.contact_name,
        email: form.email,
        country: form.country,
        description: form.description,
      })
      router.push("/sell/application-received")
    } catch {
      setError("We couldn't submit your application. Please check your details and try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl text-ink">Apply to sell</h1>
          <p className="text-sm text-ink/50 mt-1">
            Tell us about your brand — we review every application by hand.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4">
          <div>
            <label className="text-xs uppercase tracking-widest text-ink/50">Your name</label>
            <input required value={form.contact_name} onChange={update("contact_name")} className="input mt-1" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-ink/50">Email</label>
            <input type="email" required value={form.email} onChange={update("email")} className="input mt-1" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-ink/50">Password</label>
            <input type="password" required minLength={8} value={form.password} onChange={update("password")} className="input mt-1" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-ink/50">Store / brand name</label>
            <input required value={form.store_name} onChange={update("store_name")} className="input mt-1" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-ink/50">Country</label>
            <input required value={form.country} onChange={update("country")} className="input mt-1" placeholder="e.g. Kenya" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-ink/50">About your brand</label>
            <textarea value={form.description} onChange={update("description")} className="input mt-1" rows={3} placeholder="What you make, and the story behind it" />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Submitting..." : "Submit application"}
          </button>
        </form>

        <p className="text-center text-sm text-ink/50 mt-6">
          Already a vendor?{" "}
          <Link href="/sell/login" className="text-sky-600 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

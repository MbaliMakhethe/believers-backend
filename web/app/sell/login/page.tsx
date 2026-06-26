"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { loginCustomer } from "@/lib/vendor"

export default function VendorLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await loginCustomer(email, password)
      router.push("/sell")
    } catch {
      setError("That email and password combination doesn't match an account.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="font-display text-2xl text-ink">
            Believers <span className="text-sky-600">Wardrobe</span>
          </Link>
          <p className="text-sm text-ink/50 mt-1">Vendor Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4">
          <div>
            <label className="text-xs uppercase tracking-widest text-ink/50">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input mt-1" placeholder="you@yourbrand.com" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-ink/50">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input mt-1" />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-center text-sm text-ink/50 mt-6">
          New maker?{" "}
          <Link href="/sell/register" className="text-sky-600 hover:underline">Apply to sell</Link>
        </p>
      </div>
    </div>
  )
}

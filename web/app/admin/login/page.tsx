"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { loginAdmin } from "@/lib/admin"

export default function AdminLoginPage() {
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
      await loginAdmin(email, password)
      router.push("/admin")
    } catch {
      setError("That email and password combination doesn't match an admin account.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-paper-muted">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="font-display text-2xl text-ink">
            Believers <span className="text-sky-600">Wardrobe</span>
          </Link>
          <p className="text-sm text-ink/50 mt-1">Platform Admin</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4">
          <div>
            <label className="text-xs uppercase tracking-widest text-ink/50">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input mt-1" />
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
        <p className="text-center text-xs text-ink/40 mt-6">
          Admin accounts are created directly in the backend — see the project README.
        </p>
      </div>
    </div>
  )
}

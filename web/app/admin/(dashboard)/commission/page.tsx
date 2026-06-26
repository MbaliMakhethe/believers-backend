"use client"

import { useEffect, useState } from "react"
import { listCommissionRules, setDefaultCommission, type CommissionRule } from "@/lib/admin"

export default function AdminCommissionPage() {
  const [rules, setRules] = useState<CommissionRule[]>([])
  const [newRate, setNewRate] = useState("")
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    listCommissionRules()
      .then((res) => setRules(res.commission_rules))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const globalRule = rules.find((r) => !r.vendor_id && !r.category_id && r.is_active)
  const vendorRules = rules.filter((r) => r.vendor_id && r.is_active)

  const handleSetDefault = async () => {
    if (!newRate) return
    setSaving(true)
    try {
      await setDefaultCommission(Number(newRate))
      setNewRate("")
      load()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-1">Commission</h1>
      <p className="text-sm text-ink/50 mb-8">
        Set what Believers Wardrobe keeps from every sale. Vendor-specific
        rates override the platform default for that vendor only.
      </p>

      <div className="card max-w-md mb-10">
        <p className="text-xs uppercase tracking-widest text-ink/50">Platform default commission</p>
        <p className="font-display text-3xl text-ink mt-2">
          {loading ? "—" : globalRule ? `${globalRule.percentage}%` : "Not set"}
        </p>
        <div className="flex items-end gap-2 mt-5">
          <div className="flex-1">
            <label className="text-xs uppercase tracking-widest text-ink/50">New default rate (%)</label>
            <input type="number" value={newRate} onChange={(e) => setNewRate(e.target.value)} className="input mt-1" placeholder="e.g. 15" />
          </div>
          <button onClick={handleSetDefault} disabled={saving || !newRate} className="btn-primary">
            Save
          </button>
        </div>
      </div>

      <h2 className="font-display text-lg text-ink mb-3">Vendor-specific overrides</h2>
      {vendorRules.length === 0 ? (
        <p className="text-sm text-ink/40">
          No vendor has a custom commission rate yet. Set one on a vendor's record via the backend admin API.
        </p>
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-paper-muted text-left text-ink/50 text-xs uppercase tracking-widest">
              <tr>
                <th className="px-6 py-3 font-medium">Vendor ID</th>
                <th className="px-6 py-3 font-medium">Rate</th>
                <th className="px-6 py-3 font-medium">Label</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {vendorRules.map((r) => (
                <tr key={r.id}>
                  <td className="px-6 py-4 font-mono text-xs">{r.vendor_id}</td>
                  <td className="px-6 py-4">{r.percentage}%</td>
                  <td className="px-6 py-4 text-ink/60">{r.label ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

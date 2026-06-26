import { apiFetch, adminToken } from "./api"

// --- Auth ---
// Medusa's built-in admin "user" actor type — same auth Medusa Admin itself uses.

export async function loginAdmin(email: string, password: string) {
  const { token } = await apiFetch<{ token: string }>("/auth/user/emailpass", {
    method: "POST",
    body: { email, password },
  })
  adminToken.set(token)
  return token
}

export async function getCurrentAdmin() {
  return apiFetch<{ user: { id: string; email: string; first_name: string | null } }>(
    "/admin/users/me",
    { tokenStore: adminToken }
  )
}

// --- Vendors ---

export type AdminVendor = {
  id: string
  store_name: string
  email: string
  country: string
  status: "pending" | "approved" | "rejected" | "suspended"
}

export async function listVendors(status?: string) {
  const qs = status ? `?status=${status}` : ""
  return apiFetch<{ vendors: AdminVendor[]; count: number }>(`/admin/vendors${qs}`, {
    tokenStore: adminToken,
  })
}

export async function approveVendor(id: string) {
  return apiFetch(`/admin/vendors/${id}/approve`, { method: "POST", tokenStore: adminToken })
}

export async function rejectVendor(id: string, reason: string) {
  return apiFetch(`/admin/vendors/${id}/reject`, {
    method: "POST",
    body: { reason },
    tokenStore: adminToken,
  })
}

// --- Product review ---

export async function listVendorProductSubmissions(status?: string) {
  const qs = status ? `?status=${status}` : ""
  return apiFetch<{ vendor_products: any[]; count: number }>(`/admin/vendor-products${qs}`, {
    tokenStore: adminToken,
  })
}

export async function approveVendorProduct(id: string) {
  return apiFetch(`/admin/vendor-products/${id}/approve`, {
    method: "POST",
    tokenStore: adminToken,
  })
}

export async function rejectVendorProduct(id: string, reason: string) {
  return apiFetch(`/admin/vendor-products/${id}/reject`, {
    method: "POST",
    body: { reason },
    tokenStore: adminToken,
  })
}

// --- Commission ---

export type CommissionRule = {
  id: string
  vendor_id: string | null
  category_id: string | null
  percentage: number
  flat_fee: number
  label: string | null
  is_active: boolean
}

export async function listCommissionRules() {
  return apiFetch<{ commission_rules: CommissionRule[]; count: number }>(
    "/admin/commission-rules",
    { tokenStore: adminToken }
  )
}

export async function setDefaultCommission(percentage: number) {
  return apiFetch("/admin/commission-rules", {
    method: "POST",
    body: { percentage, label: "Platform default" },
    tokenStore: adminToken,
  })
}

// --- Payouts ---

export type AdminPayout = {
  id: string
  vendor: { id: string; store_name: string } | null
  gross_amount: number
  commission_amount: number
  net_amount: number
  currency_code: string
  status: "pending" | "processing" | "paid" | "failed"
  failure_reason: string | null
}

export async function listPayouts(status?: string) {
  const qs = status ? `?status=${status}` : ""
  return apiFetch<{ payouts: AdminPayout[]; count: number }>(`/admin/payouts${qs}`, {
    tokenStore: adminToken,
  })
}

export async function runAllPayouts(periodStart: Date, periodEnd: Date) {
  return apiFetch("/admin/payouts/run", {
    method: "POST",
    body: { period_start: periodStart.toISOString(), period_end: periodEnd.toISOString() },
    tokenStore: adminToken,
  })
}

export async function markPayoutPaid(id: string) {
  return apiFetch(`/admin/payouts/${id}/mark-paid`, { method: "POST", tokenStore: adminToken })
}

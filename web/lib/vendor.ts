import { apiFetch, vendorToken } from "./api"

// --- Auth ---
// NOTE: Medusa v2's auth route names have shifted across minor versions —
// double check these two endpoint paths against the Medusa version you've
// pinned in package.json before going live.

export async function registerCustomer(data: {
  email: string
  password: string
  first_name: string
  last_name: string
}) {
  const { token: registrationToken } = await apiFetch<{ token: string }>(
    "/auth/customer/emailpass/register",
    { method: "POST", body: { email: data.email, password: data.password } }
  )

  vendorToken.set(registrationToken)
  await apiFetch("/store/customers", {
    method: "POST",
    body: { email: data.email, first_name: data.first_name, last_name: data.last_name },
    tokenStore: vendorToken,
  })

  const { token } = await apiFetch<{ token: string }>("/auth/customer/emailpass", {
    method: "POST",
    body: { email: data.email, password: data.password },
  })
  vendorToken.set(token)
  return token
}

export async function loginCustomer(email: string, password: string) {
  const { token } = await apiFetch<{ token: string }>("/auth/customer/emailpass", {
    method: "POST",
    body: { email, password },
  })
  vendorToken.set(token)
  return token
}

// --- Vendor application ---

export type Vendor = {
  id: string
  store_name: string
  email: string
  status: "pending" | "approved" | "rejected" | "suspended"
  rejection_reason: string | null
  stripe_account_id: string | null
  stripe_payouts_enabled: boolean
}

export async function registerVendor(data: {
  store_name: string
  contact_name: string
  email: string
  phone?: string
  description?: string
  country: string
}) {
  return apiFetch<{ vendor: Vendor }>("/vendor/register", {
    method: "POST",
    body: data,
    tokenStore: vendorToken,
  })
}

export async function getMe() {
  return apiFetch<{ vendor: Vendor }>("/vendor/me", { tokenStore: vendorToken })
}

// --- Dashboard ---

export type DashboardSummary = {
  summary: {
    total_orders: number
    total_gross_sales: number
    total_net_earnings: number
    pending_payout_amount: number
  }
  recent_payouts: any[]
  low_stock_alerts: { product_title: string; variant_title: string; inventory_quantity: number }[]
}

export async function getDashboard() {
  return apiFetch<DashboardSummary>("/vendor/dashboard", { tokenStore: vendorToken })
}

// --- Products ---

export async function listVendorProducts() {
  return apiFetch<{ products: any[] }>("/vendor/products", { tokenStore: vendorToken })
}

export async function createVendorProduct(data: {
  title: string
  description?: string
  images?: string[]
  category_ids?: string[]
  variants: {
    title: string
    sku: string
    prices: { amount: number; currency_code: string }[]
    inventory_quantity: number
  }[]
}) {
  return apiFetch("/vendor/products", { method: "POST", body: data, tokenStore: vendorToken })
}

// --- Sales & payouts ---

export async function listVendorSales(limit = 20, offset = 0) {
  return apiFetch<{ sales: any[]; count: number }>(
    `/vendor/sales?limit=${limit}&offset=${offset}`,
    { tokenStore: vendorToken }
  )
}

export async function listVendorPayouts(limit = 20, offset = 0) {
  return apiFetch<{ payouts: any[]; count: number }>(
    `/vendor/payouts?limit=${limit}&offset=${offset}`,
    { tokenStore: vendorToken }
  )
}

// --- Stripe Connect onboarding ---

export async function startOnboarding() {
  return apiFetch<{ url: string }>("/vendor/onboarding", {
    method: "POST",
    tokenStore: vendorToken,
  })
}

export async function getOnboardingStatus() {
  return apiFetch<{ status: string; payouts_enabled?: boolean }>("/vendor/onboarding", {
    tokenStore: vendorToken,
  })
}

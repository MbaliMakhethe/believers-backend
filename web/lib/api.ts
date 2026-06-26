const MEDUSA_BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
export const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

const VENDOR_TOKEN_KEY = "bw_vendor_token"
const ADMIN_TOKEN_KEY = "bw_admin_token"

function tokenStore(key: string) {
  return {
    get: () => (typeof window === "undefined" ? null : localStorage.getItem(key)),
    set: (token: string) => localStorage.setItem(key, token),
    clear: () => localStorage.removeItem(key),
  }
}

export const vendorToken = tokenStore(VENDOR_TOKEN_KEY)
export const adminToken = tokenStore(ADMIN_TOKEN_KEY)

type FetchOptions = {
  method?: "GET" | "POST" | "DELETE"
  body?: Record<string, unknown>
  /** Attach a bearer token from one of the stores above, if any */
  tokenStore?: ReturnType<typeof tokenStore>
}

export async function apiFetch<T = any>(
  path: string,
  { method = "GET", body, tokenStore: store }: FetchOptions = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-publishable-api-key": PUBLISHABLE_KEY,
  }
  const token = store?.get()
  if (token) headers["Authorization"] = `Bearer ${token}`

  const res = await fetch(`${MEDUSA_BACKEND_URL}${path}`, {
    method,
    headers,
    cache: "no-store",
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Request failed (${res.status}): ${text}`)
  }

  return res.json()
}

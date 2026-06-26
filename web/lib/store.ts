import { apiFetch } from "./api"

export type StoreProduct = {
  id: string
  title: string
  handle: string
  thumbnail: string | null
  description: string | null
  variants: {
    id: string
    title: string
    calculated_price?: { calculated_amount: number; currency_code: string }
  }[]
  vendor_product?: {
    vendor_id: string
    vendor?: { store_name: string; logo_url: string | null }
  }
}

export async function listProducts(params: {
  q?: string
  category_id?: string[]
  limit?: number
  offset?: number
} = {}) {
  const search = new URLSearchParams()
  if (params.q) search.set("q", params.q)
  if (params.limit) search.set("limit", String(params.limit))
  if (params.offset) search.set("offset", String(params.offset))
  params.category_id?.forEach((id) => search.append("category_id[]", id))

  return apiFetch<{ products: StoreProduct[]; count: number }>(
    `/store/products?${search.toString()}&fields=*variants.calculated_price,*vendor_product.vendor`
  )
}

export async function getProductByHandle(handle: string) {
  const { products } = await apiFetch<{ products: StoreProduct[] }>(
    `/store/products?handle=${handle}&fields=*variants.calculated_price,*vendor_product.vendor,*images`
  )
  return products[0]
}

// --- Vendor directory ---

export type StoreVendor = {
  id: string
  store_name: string
  description: string | null
  logo_url: string | null
  country: string
}

export async function listVendors() {
  return apiFetch<{ vendors: StoreVendor[]; count: number }>("/store/vendors")
}

export async function getVendor(id: string) {
  return apiFetch<{ vendor: StoreVendor }>(`/store/vendors/${id}`)
}

export async function getVendorProducts(id: string) {
  return apiFetch<{ products: StoreProduct[]; count: number }>(`/store/vendors/${id}/products`)
}

// --- Cart ---

export type CartLineItem = {
  id: string
  title: string
  thumbnail: string | null
  quantity: number
  unit_price: number
  variant_id: string
  product_id: string
}

export type Cart = {
  id: string
  items: CartLineItem[]
  total: number
  currency_code: string
  email?: string
}

export async function createCart() {
  return apiFetch<{ cart: Cart }>("/store/carts", {
    method: "POST",
    body: { region_id: process.env.NEXT_PUBLIC_MEDUSA_REGION_ID },
  })
}

export async function getCart(cartId: string) {
  return apiFetch<{ cart: Cart }>(`/store/carts/${cartId}`)
}

export async function addLineItem(cartId: string, variantId: string, quantity = 1) {
  return apiFetch<{ cart: Cart }>(`/store/carts/${cartId}/line-items`, {
    method: "POST",
    body: { variant_id: variantId, quantity },
  })
}

export async function updateLineItem(cartId: string, lineItemId: string, quantity: number) {
  return apiFetch<{ cart: Cart }>(`/store/carts/${cartId}/line-items/${lineItemId}`, {
    method: "POST",
    body: { quantity },
  })
}

export async function removeLineItem(cartId: string, lineItemId: string) {
  return apiFetch<{ cart: Cart }>(`/store/carts/${cartId}/line-items/${lineItemId}`, {
    method: "DELETE",
  })
}

// --- Checkout ---

export async function updateCartDetails(
  cartId: string,
  data: { email?: string; shipping_address?: Record<string, any> }
) {
  return apiFetch(`/store/carts/${cartId}`, { method: "POST", body: data })
}

export async function listShippingOptions(cartId: string) {
  return apiFetch<{ shipping_options: { id: string; name: string; amount: number }[] }>(
    `/store/shipping-options?cart_id=${cartId}`
  )
}

export async function addShippingMethod(cartId: string, optionId: string) {
  return apiFetch(`/store/carts/${cartId}/shipping-methods`, {
    method: "POST",
    body: { option_id: optionId },
  })
}

export async function createPaymentCollection(cartId: string) {
  return apiFetch<{ payment_collection: { id: string } }>(`/store/payment-collections`, {
    method: "POST",
    body: { cart_id: cartId },
  })
}

export async function initiatePaymentSession(paymentCollectionId: string) {
  return apiFetch<{
    payment_collection: { payment_sessions: { provider_id: string; data: { client_secret: string } }[] }
  }>(`/store/payment-collections/${paymentCollectionId}/payment-sessions`, {
    method: "POST",
    body: { provider_id: "stripe" },
  })
}

export async function completeCart(cartId: string) {
  return apiFetch<{ type: "order" | "cart"; order?: { id: string; display_id: number } }>(
    `/store/carts/${cartId}/complete`,
    { method: "POST" }
  )
}

export async function getOrder(orderId: string) {
  return apiFetch<{ order: { display_id: number } }>(`/store/orders/${orderId}?fields=display_id`)
}

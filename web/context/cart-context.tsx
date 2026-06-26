"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { createCart, getCart, addLineItem, updateLineItem, removeLineItem, type Cart } from "@/lib/store"

type CartContextValue = {
  cart: Cart | null
  loading: boolean
  addItem: (variantId: string, quantity?: number) => Promise<void>
  updateItem: (lineItemId: string, quantity: number) => Promise<void>
  removeItem: (lineItemId: string) => Promise<void>
}

const CartContext = createContext<CartContextValue | undefined>(undefined)
const CART_STORAGE_KEY = "bw_cart_id"

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)

  const ensureCart = async (): Promise<string> => {
    const existingId = localStorage.getItem(CART_STORAGE_KEY)
    if (existingId) return existingId

    const { cart: created } = await createCart()
    localStorage.setItem(CART_STORAGE_KEY, created.id)
    return created.id
  }

  const refresh = async () => {
    setLoading(true)
    try {
      const cartId = await ensureCart()
      const { cart: fetched } = await getCart(cartId)
      setCart(fetched)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const addItem = async (variantId: string, quantity = 1) => {
    if (!cart) return
    const { cart: updated } = await addLineItem(cart.id, variantId, quantity)
    setCart(updated)
  }

  const updateItem = async (lineItemId: string, quantity: number) => {
    if (!cart) return
    const { cart: updated } = await updateLineItem(cart.id, lineItemId, quantity)
    setCart(updated)
  }

  const removeItem = async (lineItemId: string) => {
    if (!cart) return
    const { cart: updated } = await removeLineItem(cart.id, lineItemId)
    setCart(updated)
  }

  return (
    <CartContext.Provider value={{ cart, loading, addItem, updateItem, removeItem }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within a CartProvider")
  return ctx
}

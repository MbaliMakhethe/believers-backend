import { CartProvider } from "@/context/cart-context"
import Header from "@/components/site/Header"
import Footer from "@/components/site/Footer"

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </CartProvider>
  )
}

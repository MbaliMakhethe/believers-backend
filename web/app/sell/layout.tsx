import { VendorProvider } from "@/context/vendor-context"

export default function SellLayout({ children }: { children: React.ReactNode }) {
  return <VendorProvider>{children}</VendorProvider>
}

import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { useEffect, useState } from "react"
import { Container, Heading, Badge, Button, Text } from "@medusajs/ui"
import type { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types"

const ProductVendorApprovalWidget = ({
  data: product,
}: DetailWidgetProps<AdminProduct>) => {
  const [vendorProduct, setVendorProduct] = useState<any>(null)

  useEffect(() => {
    // Look up the VendorProduct record for this product via the
    // module link, exposed through the product's computed fields.
    fetch(`/admin/products/${product.id}?fields=*vendor_product`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((d) => setVendorProduct(d.product?.vendor_product))
  }, [product.id])

  if (!vendorProduct) return null

  const handleApprove = async () => {
    await fetch(`/admin/vendor-products/${vendorProduct.id}/approve`, {
      method: "POST",
      credentials: "include",
    })
    window.location.reload()
  }

  const handleReject = async () => {
    const reason = window.prompt("Reason for rejecting this product?")
    if (reason === null) return
    await fetch(`/admin/vendor-products/${vendorProduct.id}/reject`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    })
    window.location.reload()
  }

  return (
    <Container className="divide-y p-0">
      <div className="px-6 py-4 flex items-center justify-between">
        <Heading level="h2">Vendor Review</Heading>
        <Badge
          color={
            vendorProduct.approval_status === "approved"
              ? "green"
              : vendorProduct.approval_status === "rejected"
              ? "red"
              : "orange"
          }
        >
          {vendorProduct.approval_status.replace("_", " ")}
        </Badge>
      </div>
      {vendorProduct.approval_status === "pending_review" && (
        <div className="px-6 py-4 flex gap-2">
          <Button size="small" variant="primary" onClick={handleApprove}>
            Approve & Publish
          </Button>
          <Button size="small" variant="danger" onClick={handleReject}>
            Reject
          </Button>
        </div>
      )}
      {vendorProduct.approval_status === "rejected" && vendorProduct.rejection_reason && (
        <div className="px-6 py-4">
          <Text size="small" className="text-ui-fg-subtle">
            Rejection reason: {vendorProduct.rejection_reason}
          </Text>
        </div>
      )}
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default ProductVendorApprovalWidget

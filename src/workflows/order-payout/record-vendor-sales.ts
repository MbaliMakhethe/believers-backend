import {
  createWorkflow,
  WorkflowResponse,
  transform,
  parallelize,
} from "@medusajs/framework/workflows-sdk"
import { getOrderLineItemsWithVendorStep } from "./steps/get-order-line-items"
import { getCommissionRateStep } from "./steps/get-commission-rate"
import { createVendorSalesStep } from "./steps/create-vendor-sales"

type WorkflowInput = {
  order_id: string
}

export const recordVendorSalesWorkflow = createWorkflow(
  "record-vendor-sales",
  ({ order_id }: WorkflowInput) => {
    const orderData = getOrderLineItemsWithVendorStep({ order_id })

    // Get distinct vendor ids present in this order, then fetch each
    // vendor's commission rate (handles multi-vendor carts/orders)
    const vendorIds = transform({ orderData }, ({ orderData }) => {
      const ids = new Set(orderData.line_items.map((i: any) => i.vendor_id))
      return Array.from(ids) as string[]
    })

    const rates = parallelize(
      ...vendorIds.map((vendor_id: string) =>
        getCommissionRateStep({ vendor_id })
      )
    )

    const lineItemsWithRates = transform(
      { orderData, vendorIds, rates },
      ({ orderData, vendorIds, rates }) => {
        const rateByVendor: Record<string, number> = {}
        vendorIds.forEach((id: string, idx: number) => {
          rateByVendor[id] = rates[idx]
        })
        return orderData.line_items.map((item: any) => ({
          ...item,
          commission_rate: rateByVendor[item.vendor_id],
        }))
      }
    )

    const sales = createVendorSalesStep({
      order_id,
      currency_code: orderData.currency_code,
      line_items: lineItemsWithRates,
    })

    return new WorkflowResponse(sales)
  }
)

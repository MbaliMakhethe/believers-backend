import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { VENDOR_MODULE } from "../../modules/vendor"

type LineItemInput = {
  id: string
  product_id: string
  vendor_id: string
  quantity: number
  unit_price: number
  total: number
  commission_rate: number
}

type StepInput = {
  order_id: string
  currency_code: string
  line_items: LineItemInput[]
}

export const createVendorSalesStep = createStep(
  "create-vendor-sales-step",
  async ({ order_id, currency_code, line_items }: StepInput, { container }) => {
    const vendorModuleService = container.resolve(VENDOR_MODULE)

    const salesData = line_items.map((item) => {
      const commissionAmount = Math.round(
        item.total * (item.commission_rate / 100)
      )
      return {
        vendor_id: item.vendor_id,
        order_id,
        order_line_item_id: item.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        line_total: item.total,
        commission_rate_applied: item.commission_rate,
        commission_amount: commissionAmount,
        vendor_net_amount: item.total - commissionAmount,
        currency_code,
      }
    })

    const created = await vendorModuleService.createVendorSales(salesData)

    return new StepResponse(created, created)
  },
  async (created, { container }) => {
    if (!created) return
    const vendorModuleService = container.resolve(VENDOR_MODULE)
    await vendorModuleService.deleteVendorSales(created.map((s: any) => s.id))
  }
)

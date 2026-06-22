import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { VENDOR_MODULE } from "../../modules/vendor"

type StepInput = {
  vendor_id: string
  period_start: Date
  period_end: Date
}

export const batchVendorSalesStep = createStep(
  "batch-vendor-sales-step",
  async ({ vendor_id, period_start, period_end }: StepInput, { container }) => {
    const vendorModuleService = container.resolve(VENDOR_MODULE)

    const [sales] = await vendorModuleService.listAndCountVendorSales({
      vendor_id,
      payout_id: null, // only sales not yet included in a payout
    })

    if (!sales.length) {
      return new StepResponse({ payout: null, sale_ids: [] })
    }

    const gross = sales.reduce((sum: number, s: any) => sum + s.line_total, 0)
    const commission = sales.reduce(
      (sum: number, s: any) => sum + s.commission_amount,
      0
    )
    const net = sales.reduce(
      (sum: number, s: any) => sum + s.vendor_net_amount,
      0
    )

    const payout = await vendorModuleService.createPayouts({
      vendor_id,
      gross_amount: gross,
      commission_amount: commission,
      net_amount: net,
      currency_code: sales[0].currency_code,
      status: "pending",
      period_start,
      period_end,
    })

    await vendorModuleService.updateVendorSales(
      sales.map((s: any) => ({ id: s.id, payout_id: payout.id }))
    )

    return new StepResponse(
      { payout, sale_ids: sales.map((s: any) => s.id) },
      { payout_id: payout.id, sale_ids: sales.map((s: any) => s.id) }
    )
  },
  async (compensationData, { container }) => {
    if (!compensationData?.payout_id) return
    const vendorModuleService = container.resolve(VENDOR_MODULE)
    await vendorModuleService.updateVendorSales(
      compensationData.sale_ids.map((id: string) => ({ id, payout_id: null }))
    )
    await vendorModuleService.deletePayouts(compensationData.payout_id)
  }
)

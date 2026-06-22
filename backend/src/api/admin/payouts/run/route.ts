import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { VENDOR_MODULE } from "../../../../modules/vendor"
import { runVendorPayoutWorkflow } from "../../../../workflows/order-payout/run-vendor-payout"

type ReqBody = {
  vendor_id?: string // omit to run payouts for every vendor with pending sales
  period_start: string
  period_end: string
}

export async function POST(req: MedusaRequest<ReqBody>, res: MedusaResponse) {
  const { vendor_id, period_start, period_end } = req.body as ReqBody
  const vendorModuleService = req.scope.resolve(VENDOR_MODULE)

  let vendorIds: string[]
  if (vendor_id) {
    vendorIds = [vendor_id]
  } else {
    const [pendingSales] = await vendorModuleService.listAndCountVendorSales({
      payout_id: null,
    })
    vendorIds = Array.from(new Set(pendingSales.map((s: any) => s.vendor_id)))
  }

  const results = []
  for (const id of vendorIds) {
    try {
      const { result } = await runVendorPayoutWorkflow(req.scope).run({
        input: {
          vendor_id: id,
          period_start: new Date(period_start),
          period_end: new Date(period_end),
        },
      })
      results.push({ vendor_id: id, payout: result })
    } catch (err: any) {
      results.push({ vendor_id: id, error: err.message })
    }
  }

  res.json({ results })
}

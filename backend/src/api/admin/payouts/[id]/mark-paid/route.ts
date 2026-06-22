import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { VENDOR_MODULE } from "../../../../../modules/vendor"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params
  const vendorModuleService = req.scope.resolve(VENDOR_MODULE)

  const payout = await vendorModuleService.updatePayouts({
    id,
    status: "paid",
    paid_at: new Date(),
  })

  res.json({ payout })
}

import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { VENDOR_MODULE } from "../../../modules/vendor"

// GET /vendor/payouts?limit=20&offset=0 -> this vendor's payout history
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  // @ts-ignore
  const vendor = req.vendor
  const { limit = 20, offset = 0 } = req.query as any
  const vendorModuleService = req.scope.resolve(VENDOR_MODULE)

  const [payouts, count] = await vendorModuleService.listAndCountPayouts(
    { vendor_id: vendor.id },
    {
      take: Number(limit),
      skip: Number(offset),
      order: { id: "DESC" },
    }
  )

  res.json({ payouts, count, limit: Number(limit), offset: Number(offset) })
}

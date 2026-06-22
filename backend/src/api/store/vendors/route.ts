import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { VENDOR_MODULE } from "../../../modules/vendor"

// GET /store/vendors -> public directory of approved vendors only
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { limit = 50, offset = 0 } = req.query as any
  const vendorModuleService = req.scope.resolve(VENDOR_MODULE)

  const [vendors, count] = await vendorModuleService.listAndCountVendors(
    { status: "approved" },
    {
      take: Number(limit),
      skip: Number(offset),
      select: ["id", "store_name", "description", "logo_url", "country"],
    }
  )

  res.json({ vendors, count, limit: Number(limit), offset: Number(offset) })
}

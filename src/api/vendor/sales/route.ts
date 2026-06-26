import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { VENDOR_MODULE } from "../../../modules/vendor"

// GET /vendor/sales?limit=20&offset=0 -> paginated sale line items for this vendor
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  // @ts-ignore
  const vendor = req.vendor
  const { limit = 20, offset = 0 } = req.query as any
  const vendorModuleService = req.scope.resolve(VENDOR_MODULE)

  const [sales, count] = await vendorModuleService.listAndCountVendorSales(
    { vendor_id: vendor.id },
    {
      take: Number(limit),
      skip: Number(offset),
      order: { id: "DESC" },
    }
  )

  res.json({ sales, count, limit: Number(limit), offset: Number(offset) })
}

import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { VENDOR_MODULE } from "../../../modules/vendor"

// GET /admin/vendors?status=pending  -> list vendors, optionally filtered
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { status, limit = 20, offset = 0 } = req.query as any
  const vendorModuleService = req.scope.resolve(VENDOR_MODULE)

  const filters: Record<string, any> = {}
  if (status) filters.status = status

  const [vendors, count] = await vendorModuleService.listAndCountVendors(
    filters,
    { take: Number(limit), skip: Number(offset) }
  )

  res.json({ vendors, count, limit: Number(limit), offset: Number(offset) })
}

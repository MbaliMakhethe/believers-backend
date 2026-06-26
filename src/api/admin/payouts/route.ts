import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { VENDOR_MODULE } from "../../../modules/vendor"

// GET /admin/payouts?status=pending&limit=20&offset=0
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { status, limit = 20, offset = 0 } = req.query as any
  const vendorModuleService = req.scope.resolve(VENDOR_MODULE)

  const filters: Record<string, any> = {}
  if (status) filters.status = status

  const [payouts, count] = await vendorModuleService.listAndCountPayouts(
    filters,
    { take: Number(limit), skip: Number(offset), order: { id: "DESC" } }
  )

  const vendorIds = Array.from(new Set(payouts.map((p: any) => p.vendor_id)))
  const [vendors] = vendorIds.length
    ? await vendorModuleService.listAndCountVendors({ id: vendorIds })
    : [[]]
  const vendorById: Record<string, any> = {}
  vendors.forEach((v: any) => (vendorById[v.id] = v))

  const enriched = payouts.map((p: any) => ({
    ...p,
    vendor: vendorById[p.vendor_id]
      ? { id: vendorById[p.vendor_id].id, store_name: vendorById[p.vendor_id].store_name }
      : null,
  }))

  res.json({ payouts: enriched, count, limit: Number(limit), offset: Number(offset) })
}

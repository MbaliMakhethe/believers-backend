import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { VENDOR_MODULE } from "../../../../../modules/vendor"
import { notifyVendor } from "../../../../../modules/vendor/notify"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params
  const vendorModuleService = req.scope.resolve(VENDOR_MODULE)

  const vendor = await vendorModuleService.updateVendors({
    id,
    status: "approved",
    approved_at: new Date(),
    rejection_reason: null,
  })

  await notifyVendor(req.scope, {
    to: vendor.email,
    template: "vendor-approved",
    data: { store_name: vendor.store_name },
  })

  res.json({ vendor })
}

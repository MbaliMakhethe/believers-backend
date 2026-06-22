import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { VENDOR_MODULE } from "../../../../../modules/vendor"
import { notifyVendor } from "../../../../../modules/vendor/notify"

type ReqBody = {
  reason: string
}

export async function POST(
  req: MedusaRequest<ReqBody>,
  res: MedusaResponse
) {
  const { id } = req.params
  const { reason } = req.body as ReqBody
  const vendorModuleService = req.scope.resolve(VENDOR_MODULE)

  const vendor = await vendorModuleService.updateVendors({
    id,
    status: "rejected",
    rejection_reason: reason,
  })

  await notifyVendor(req.scope, {
    to: vendor.email,
    template: "vendor-rejected",
    data: { store_name: vendor.store_name, reason },
  })

  res.json({ vendor })
}

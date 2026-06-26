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

  const vendorProduct = await vendorModuleService.updateVendorProducts({
    id,
    approval_status: "rejected",
    reviewed_at: new Date(),
    reviewed_by: req.auth_context?.actor_id ?? null,
    rejection_reason: reason,
  })

  const vendor = await vendorModuleService.retrieveVendor(vendorProduct.vendor_id)
  await notifyVendor(req.scope, {
    to: vendor.email,
    template: "product-rejected",
    data: { store_name: vendor.store_name, reason },
  })

  // Product stays in draft status — vendor can edit and resubmit
  res.json({ vendor_product: vendorProduct })
}

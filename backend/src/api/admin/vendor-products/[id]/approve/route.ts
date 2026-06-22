import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import { VENDOR_MODULE } from "../../../../../modules/vendor"
import { notifyVendor } from "../../../../../modules/vendor/notify"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params // vendor_product id
  const vendorModuleService = req.scope.resolve(VENDOR_MODULE)
  const productModuleService = req.scope.resolve(Modules.PRODUCT)

  const vendorProduct = await vendorModuleService.updateVendorProducts({
    id,
    approval_status: "approved",
    reviewed_at: new Date(),
    reviewed_by: req.auth_context?.actor_id ?? null,
    rejection_reason: null,
  })

  // Flip the underlying product to published status so it appears
  // on the storefront now that it's approved
  const product = await productModuleService.updateProducts(vendorProduct.product_id, {
    status: "published",
  })

  const vendor = await vendorModuleService.retrieveVendor(vendorProduct.vendor_id)
  await notifyVendor(req.scope, {
    to: vendor.email,
    template: "product-approved",
    data: { store_name: vendor.store_name, product_title: product.title },
  })

  res.json({ vendor_product: vendorProduct })
}

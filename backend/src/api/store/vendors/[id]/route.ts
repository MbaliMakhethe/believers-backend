import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { VENDOR_MODULE } from "../../../../modules/vendor"

// GET /store/vendors/:id -> public profile for one vendor
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params
  const vendorModuleService = req.scope.resolve(VENDOR_MODULE)

  const vendor = await vendorModuleService.retrieveVendor(id, {
    select: ["id", "store_name", "description", "logo_url", "country", "status"],
  })

  if (vendor.status !== "approved") {
    return res.status(404).json({ message: "Vendor not found" })
  }

  res.json({ vendor })
}

import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { VENDOR_MODULE } from "../../../modules/vendor"

type RegisterBody = {
  store_name: string
  contact_name: string
  email: string
  phone?: string
  description?: string
  country: string
}

// POST /vendor/register -> apply to sell on Believers Wardrobe.
// Vendor starts in "pending" status until an admin approves them.
export async function POST(
  req: MedusaRequest<RegisterBody>,
  res: MedusaResponse
) {
  const body = req.body as RegisterBody
  const customerId = req.auth_context?.actor_id
  const vendorModuleService = req.scope.resolve(VENDOR_MODULE)

  const [existing] = await vendorModuleService.listAndCountVendors({
    customer_id: customerId,
  })
  if (existing.length) {
    return res.status(409).json({ message: "A vendor account already exists for this user" })
  }

  const vendor = await vendorModuleService.createVendors({
    customer_id: customerId,
    store_name: body.store_name,
    contact_name: body.contact_name,
    email: body.email,
    phone: body.phone ?? null,
    description: body.description ?? null,
    country: body.country,
    status: "pending",
  })

  // TODO: notify admins of a new vendor application (notification module)

  res.status(201).json({ vendor })
}

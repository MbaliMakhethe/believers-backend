import {
  defineMiddlewares,
  authenticate,
  validateAndTransformBody,
} from "@medusajs/framework/http"
import type { MedusaRequest, MedusaResponse, MedusaNextFunction } from "@medusajs/framework/http"
import { VENDOR_MODULE } from "../modules/vendor"

/**
 * Loads the Vendor record tied to the authenticated customer, and 403s
 * if no such vendor exists (e.g. a regular shopper hitting /vendor/* routes)
 * or if the vendor account itself isn't approved yet.
 */
async function attachVendor(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  const vendorModuleService = req.scope.resolve(VENDOR_MODULE)
  const customerId = req.auth_context?.actor_id

  const [vendors] = await vendorModuleService.listAndCountVendors({
    customer_id: customerId,
  })

  if (!vendors.length) {
    return res.status(403).json({ message: "No vendor account found for this user" })
  }

  // @ts-ignore - attach for downstream route handlers
  req.vendor = vendors[0]
  next()
}

export default defineMiddlewares({
  routes: [
    {
      // Stripe webhook needs the unparsed body to verify the signature
      matcher: "/webhooks/stripe",
      method: "POST",
      bodyParser: { preserveRawBody: true },
      middlewares: [],
    },
    {
      // A logged-in customer hits this once to apply as a vendor —
      // no Vendor record exists yet, so it only needs customer auth.
      matcher: "/vendor/register",
      middlewares: [authenticate("customer", ["session", "bearer"])],
    },
    {
      // Every other /vendor/* route requires an existing Vendor record.
      // Medusa matches the most specific route first, so this won't
      // shadow /vendor/register above.
      matcher: "/vendor/*",
      middlewares: [authenticate("customer", ["session", "bearer"]), attachVendor],
    },
  ],
})

import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { VENDOR_MODULE } from "../../../../../modules/vendor"

// GET /store/vendors/:id/products -> this vendor's live storefront catalog
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params
  const vendorModuleService = req.scope.resolve(VENDOR_MODULE)
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const [vendorProducts] = await vendorModuleService.listAndCountVendorProducts({
    vendor_id: id,
    approval_status: "approved",
  })
  const productIds = vendorProducts.map((vp: any) => vp.product_id)

  if (!productIds.length) {
    return res.json({ products: [], count: 0 })
  }

  const { data: products } = await query.graph({
    entity: "product",
    filters: { id: productIds, status: "published" },
    fields: [
      "id",
      "title",
      "handle",
      "thumbnail",
      "variants.id",
      "variants.title",
      "variants.calculated_price.*",
    ],
  })

  res.json({ products, count: products.length })
}

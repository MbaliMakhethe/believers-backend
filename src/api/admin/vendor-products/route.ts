import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { VENDOR_MODULE } from "../../../modules/vendor"

// GET /admin/vendor-products?status=pending_review
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { status = "pending_review", limit = 50, offset = 0 } = req.query as any
  const vendorModuleService = req.scope.resolve(VENDOR_MODULE)
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const [vendorProducts, count] = await vendorModuleService.listAndCountVendorProducts(
    { approval_status: status },
    { take: Number(limit), skip: Number(offset), order: { submitted_at: "ASC" } }
  )

  const productIds = vendorProducts.map((vp: any) => vp.product_id)
  const vendorIds = Array.from(new Set(vendorProducts.map((vp: any) => vp.vendor_id)))

  const [{ data: products }, [vendors]] = await Promise.all([
    productIds.length
      ? query.graph({
          entity: "product",
          filters: { id: productIds },
          fields: ["id", "title", "thumbnail"],
        })
      : Promise.resolve({ data: [] }),
    vendorIds.length
      ? vendorModuleService.listAndCountVendors({ id: vendorIds })
      : Promise.resolve([[]]),
  ])

  const productById: Record<string, any> = {}
  products.forEach((p: any) => (productById[p.id] = p))
  const vendorById: Record<string, any> = {}
  vendors.forEach((v: any) => (vendorById[v.id] = v))

  const enriched = vendorProducts.map((vp: any) => ({
    ...vp,
    product: productById[vp.product_id] ?? null,
    vendor: vendorById[vp.vendor_id]
      ? { id: vendorById[vp.vendor_id].id, store_name: vendorById[vp.vendor_id].store_name }
      : null,
  }))

  res.json({ vendor_products: enriched, count, limit: Number(limit), offset: Number(offset) })
}

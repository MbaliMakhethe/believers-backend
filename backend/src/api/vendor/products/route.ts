import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { VENDOR_MODULE } from "../../../modules/vendor"

type CreateProductBody = {
  title: string
  description?: string
  images?: string[]
  variants: {
    title: string
    sku: string
    prices: { amount: number; currency_code: string }[]
    inventory_quantity: number
  }[]
  category_ids?: string[]
}

// GET /vendor/products -> this vendor's products, joined with approval status
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  // @ts-ignore
  const vendor = req.vendor
  const vendorModuleService = req.scope.resolve(VENDOR_MODULE)
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const [vendorProducts] = await vendorModuleService.listAndCountVendorProducts({
    vendor_id: vendor.id,
  })

  const productIds = vendorProducts.map((vp: any) => vp.product_id)
  const { data: products } = productIds.length
    ? await query.graph({
        entity: "product",
        filters: { id: productIds },
        fields: ["id", "title", "thumbnail", "status", "variants.inventory_quantity"],
      })
    : { data: [] }

  const merged = vendorProducts.map((vp: any) => ({
    ...vp,
    product: products.find((p: any) => p.id === vp.product_id),
  }))

  res.json({ products: merged })
}

// POST /vendor/products -> create a new product as a draft, pending admin review
export async function POST(
  req: MedusaRequest<CreateProductBody>,
  res: MedusaResponse
) {
  // @ts-ignore
  const vendor = req.vendor
  const body = req.body as CreateProductBody
  const productModuleService = req.scope.resolve(Modules.PRODUCT)
  const vendorModuleService = req.scope.resolve(VENDOR_MODULE)

  // Product is created as a draft — it only becomes "published" once an
  // admin approves the linked VendorProduct (see admin/vendor-products/[id]/approve)
  const product = await productModuleService.createProducts({
    title: body.title,
    description: body.description,
    status: "draft",
    images: body.images?.map((url) => ({ url })),
    category_ids: body.category_ids,
    variants: body.variants.map((v) => ({
      title: v.title,
      sku: v.sku,
      prices: v.prices,
      manage_inventory: true,
    })),
  })

  const vendorProduct = await vendorModuleService.createVendorProducts({
    product_id: product.id,
    vendor_id: vendor.id,
    approval_status: "pending_review",
    submitted_at: new Date(),
  })

  // NOTE: setting initial inventory_quantity per variant is a separate
  // call against the Inventory module (create inventory items + levels) —
  // omitted here for brevity, see Medusa's inventory module docs.

  res.status(201).json({ product, vendor_product: vendorProduct })
}

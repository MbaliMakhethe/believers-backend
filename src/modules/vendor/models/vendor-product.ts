import { model } from "@medusajs/framework/utils"

/**
 * VendorProduct links a Medusa core Product to the Vendor who owns it,
 * and tracks the admin approval workflow for that specific product.
 *
 * We store product_id as a plain reference (not a DB foreign key) because
 * the core Product model lives in a different module. A Module Link
 * (see src/links/vendor-product.ts) is used to make this queryable
 * through Medusa's Query / remoteQuery layer.
 */
const VendorProduct = model.define("vendor_product", {
  id: model.id().primaryKey(),
  product_id: model.text(),
  vendor_id: model.text(),

  approval_status: model
    .enum(["pending_review", "approved", "rejected"])
    .default("pending_review"),
  rejection_reason: model.text().nullable(),
  submitted_at: model.dateTime(),
  reviewed_at: model.dateTime().nullable(),
  reviewed_by: model.text().nullable(),
})

export default VendorProduct

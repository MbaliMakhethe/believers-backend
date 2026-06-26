import { defineLink } from "@medusajs/framework/utils"
import ProductModule from "@medusajs/medusa/product"
import VendorModule from "../modules/vendor"

/**
 * Links Product -> VendorProduct (1:1). This lets Medusa's Query layer
 * fetch a product together with its vendor approval status in one call,
 * e.g. query.graph({ entity: "product", fields: ["*", "vendor_product.*"] })
 */
export default defineLink(
  ProductModule.linkable.product,
  VendorModule.linkable.vendorProduct
)

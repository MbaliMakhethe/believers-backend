import { model } from "@medusajs/framework/utils"

/**
 * CommissionRule lets the platform owner set a global default commission
 * percentage, and optionally override it per vendor or per product category.
 * Only one "global" rule (vendor_id = null, category_id = null) should be
 * active at a time — the dashboard enforces this.
 */
const CommissionRule = model.define("commission_rule", {
  id: model.id().primaryKey(),
  vendor_id: model.text().nullable(), // null = applies platform-wide
  category_id: model.text().nullable(), // null = applies to all categories
  percentage: model.number(), // e.g. 15 = 15%
  flat_fee: model.number().default(0), // optional fixed fee per order line, in cents
  is_active: model.boolean().default(true),
  label: model.text().nullable(), // e.g. "Default rate", "Apparel category rate"
})

export default CommissionRule

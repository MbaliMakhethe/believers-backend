import { model } from "@medusajs/framework/utils"

/**
 * VendorSale records one order line item sold by a vendor. Created by the
 * order-placed subscriber/workflow. This is what powers the vendor's
 * "My Sales" dashboard view, and gets batched into a Payout once
 * a payout run executes for a vendor.
 */
const VendorSale = model.define("vendor_sale", {
  id: model.id().primaryKey(),
  vendor_id: model.text(),
  order_id: model.text(),
  order_line_item_id: model.text(),
  product_id: model.text(),

  quantity: model.number(),
  unit_price: model.number(), // in cents
  line_total: model.number(), // in cents, before commission
  commission_rate_applied: model.number(), // percentage used at time of sale
  commission_amount: model.number(), // in cents
  vendor_net_amount: model.number(), // in cents, line_total - commission_amount

  payout_id: model.text().nullable(), // set once included in a Payout batch
  currency_code: model.text().default("usd"),
})

export default VendorSale

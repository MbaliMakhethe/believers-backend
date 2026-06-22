import { model } from "@medusajs/framework/utils"

/**
 * A Payout represents one disbursement of funds from the platform's
 * Stripe account to a vendor's connected Stripe account, covering a
 * batch of order line items within a period.
 */
const Payout = model.define("payout", {
  id: model.id().primaryKey(),
  vendor_id: model.text(),

  gross_amount: model.number(), // total sales amount, in cents
  commission_amount: model.number(), // platform's cut, in cents
  net_amount: model.number(), // amount actually transferred to vendor, in cents
  currency_code: model.text().default("usd"),

  status: model
    .enum(["pending", "processing", "paid", "failed"])
    .default("pending"),

  stripe_transfer_id: model.text().nullable(),
  failure_reason: model.text().nullable(),

  period_start: model.dateTime(),
  period_end: model.dateTime(),
  paid_at: model.dateTime().nullable(),
})

export default Payout

import { model } from "@medusajs/framework/utils"

/**
 * A Vendor represents an individual seller on Believers Wardrobe.
 * Vendor account approval is separate from per-product approval —
 * a vendor must be approved before they can submit products at all.
 */
const Vendor = model.define("vendor", {
  id: model.id().primaryKey(),
  // Links this vendor record to the Medusa Customer that logs into the
  // vendor dashboard. We reuse Medusa's existing customer auth (emailpass)
  // rather than building a brand-new actor type, which keeps vendor login
  // working out of the box.
  customer_id: model.text().unique(),
  store_name: model.text(),
  contact_name: model.text(),
  email: model.text().unique(),
  phone: model.text().nullable(),
  description: model.text().nullable(),
  logo_url: model.text().nullable(),
  country: model.text(),

  // Platform approval workflow for the vendor account itself
  status: model
    .enum(["pending", "approved", "rejected", "suspended"])
    .default("pending"),
  rejection_reason: model.text().nullable(),
  approved_at: model.dateTime().nullable(),

  // Stripe Connect
  stripe_account_id: model.text().nullable(),
  stripe_onboarding_complete: model.boolean().default(false),
  stripe_payouts_enabled: model.boolean().default(false),

  // Commission override — if null, the platform default rate applies
  commission_rate: model.number().nullable(),
})

export default Vendor

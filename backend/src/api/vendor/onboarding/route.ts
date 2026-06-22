import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import Stripe from "stripe"
import { VENDOR_MODULE } from "../../../modules/vendor"

const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
  apiVersion: "2024-06-20",
})

// POST /vendor/onboarding -> returns a Stripe-hosted onboarding link
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  // @ts-ignore - attached by attachVendor middleware
  const vendor = req.vendor
  const vendorModuleService = req.scope.resolve(VENDOR_MODULE)

  let stripeAccountId = vendor.stripe_account_id

  if (!stripeAccountId) {
    const account = await stripe.accounts.create({
      type: "express",
      email: vendor.email,
      business_type: "individual",
      capabilities: {
        transfers: { requested: true },
        card_payments: { requested: true },
      },
    })
    stripeAccountId = account.id
    await vendorModuleService.updateVendors({
      id: vendor.id,
      stripe_account_id: stripeAccountId,
    })
  }

  const accountLink = await stripe.accountLinks.create({
    account: stripeAccountId,
    refresh_url: `${process.env.APP_URL}/sell/onboarding/refresh`,
    return_url: `${process.env.APP_URL}/sell/onboarding/complete`,
    type: "account_onboarding",
  })

  res.json({ url: accountLink.url })
}

// GET /vendor/onboarding -> current onboarding/payout status
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  // @ts-ignore
  const vendor = req.vendor

  if (!vendor.stripe_account_id) {
    return res.json({ status: "not_started" })
  }

  const account = await stripe.accounts.retrieve(vendor.stripe_account_id)
  const vendorModuleService = req.scope.resolve(VENDOR_MODULE)

  const payoutsEnabled = !!account.payouts_enabled
  if (payoutsEnabled !== vendor.stripe_payouts_enabled) {
    await vendorModuleService.updateVendors({
      id: vendor.id,
      stripe_payouts_enabled: payoutsEnabled,
      stripe_onboarding_complete: !!account.details_submitted,
    })
  }

  res.json({
    status: account.details_submitted ? "complete" : "in_progress",
    payouts_enabled: payoutsEnabled,
  })
}

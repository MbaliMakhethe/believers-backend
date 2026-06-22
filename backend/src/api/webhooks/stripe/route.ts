import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import Stripe from "stripe"
import { VENDOR_MODULE } from "../../../modules/vendor"

const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
  apiVersion: "2024-06-20",
})

// POST /webhooks/stripe — registered as the endpoint URL in your Stripe
// dashboard. Needs raw body parsing; see note in medusa-config below.
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const signature = req.headers["stripe-signature"] as string
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody as Buffer,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    return res.status(400).send(`Webhook signature verification failed: ${err.message}`)
  }

  const vendorModuleService = req.scope.resolve(VENDOR_MODULE)

  switch (event.type) {
    case "account.updated": {
      const account = event.data.object as Stripe.Account
      const [vendors] = await vendorModuleService.listAndCountVendors({
        stripe_account_id: account.id,
      })
      if (vendors.length) {
        await vendorModuleService.updateVendors({
          id: vendors[0].id,
          stripe_payouts_enabled: !!account.payouts_enabled,
          stripe_onboarding_complete: !!account.details_submitted,
        })
      }
      break
    }

    case "transfer.failed": {
      const transfer = event.data.object as Stripe.Transfer
      const [payouts] = await vendorModuleService.listAndCountPayouts({
        stripe_transfer_id: transfer.id,
      })
      if (payouts.length) {
        await vendorModuleService.updatePayouts({
          id: payouts[0].id,
          status: "failed",
          failure_reason: "Stripe reported the transfer failed after creation",
        })
      }
      break
    }

    default:
      break
  }

  res.json({ received: true })
}

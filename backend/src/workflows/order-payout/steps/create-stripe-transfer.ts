import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import Stripe from "stripe"
import { VENDOR_MODULE } from "../../modules/vendor"
import { notifyVendor } from "../../modules/vendor/notify"

type StepInput = {
  payout_id: string
  vendor_id: string
  net_amount: number
  currency_code: string
}

const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
  apiVersion: "2024-06-20",
})

export const createStripeTransferStep = createStep(
  "create-stripe-transfer-step",
  async (
    { payout_id, vendor_id, net_amount, currency_code }: StepInput,
    { container }
  ) => {
    const vendorModuleService = container.resolve(VENDOR_MODULE)
    const vendor = await vendorModuleService.retrieveVendor(vendor_id)

    if (!vendor.stripe_account_id || !vendor.stripe_payouts_enabled) {
      await vendorModuleService.updatePayouts({
        id: payout_id,
        status: "failed",
        failure_reason: "Vendor has not completed Stripe Connect onboarding",
      })
      throw new Error(
        `Vendor ${vendor_id} cannot receive payouts: Stripe onboarding incomplete`
      )
    }

    try {
      const transfer = await stripe.transfers.create({
        amount: net_amount,
        currency: currency_code,
        destination: vendor.stripe_account_id,
        transfer_group: payout_id,
      })

      const payout = await vendorModuleService.updatePayouts({
        id: payout_id,
        status: "paid",
        stripe_transfer_id: transfer.id,
        paid_at: new Date(),
      })

      await notifyVendor(container, {
        to: vendor.email,
        template: "payout-sent",
        data: {
          store_name: vendor.store_name,
          net_amount: net_amount,
          currency_code: currency_code,
        },
      })

      return new StepResponse(payout)
    } catch (err: any) {
      await vendorModuleService.updatePayouts({
        id: payout_id,
        status: "failed",
        failure_reason: err.message,
      })
      throw err
    }
  }
)

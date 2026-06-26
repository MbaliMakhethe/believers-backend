import {
  createWorkflow,
  WorkflowResponse,
  when,
} from "@medusajs/framework/workflows-sdk"
import { batchVendorSalesStep } from "./steps/batch-vendor-sales"
import { createStripeTransferStep } from "./steps/create-stripe-transfer"

type WorkflowInput = {
  vendor_id: string
  period_start: Date
  period_end: Date
}

export const runVendorPayoutWorkflow = createWorkflow(
  "run-vendor-payout",
  ({ vendor_id, period_start, period_end }: WorkflowInput) => {
    const batch = batchVendorSalesStep({ vendor_id, period_start, period_end })

    const transferred = when({ batch }, ({ batch }) => !!batch.payout).then(
      () =>
        createStripeTransferStep({
          payout_id: batch.payout.id,
          vendor_id,
          net_amount: batch.payout.net_amount,
          currency_code: batch.payout.currency_code,
        })
    )

    return new WorkflowResponse(transferred)
  }
)

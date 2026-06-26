import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { recordVendorSalesWorkflow } from "../workflows/order-payout/record-vendor-sales"

export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  await recordVendorSalesWorkflow(container).run({
    input: { order_id: data.id },
  })
}

export const config: SubscriberConfig = {
  event: "order.placed",
}

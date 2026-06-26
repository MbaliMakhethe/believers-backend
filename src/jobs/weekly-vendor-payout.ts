import type { MedusaContainer } from "@medusajs/framework/types"
import { VENDOR_MODULE } from "../modules/vendor"
import { runVendorPayoutWorkflow } from "../workflows/order-payout/run-vendor-payout"

/**
 * Runs every Monday at 06:00 UTC. Batches and pays out every vendor that
 * has unpaid VendorSale records accumulated over the prior week.
 * The platform owner can still trigger ad-hoc runs via
 * POST /admin/payouts/run for a single vendor at any time.
 */
export default async function weeklyVendorPayoutJob(container: MedusaContainer) {
  const vendorModuleService = container.resolve(VENDOR_MODULE)
  const logger = container.resolve("logger")

  const [pendingSales] = await vendorModuleService.listAndCountVendorSales({
    payout_id: null,
  })
  const vendorIds = Array.from(new Set(pendingSales.map((s: any) => s.vendor_id)))

  const periodEnd = new Date()
  const periodStart = new Date(periodEnd.getTime() - 7 * 24 * 60 * 60 * 1000)

  logger.info(`[weekly-payout-job] Running payouts for ${vendorIds.length} vendor(s)`)

  for (const vendorId of vendorIds) {
    try {
      await runVendorPayoutWorkflow(container).run({
        input: { vendor_id: vendorId as string, period_start: periodStart, period_end: periodEnd },
      })
    } catch (err: any) {
      logger.error(`[weekly-payout-job] Failed for vendor ${vendorId}: ${err.message}`)
    }
  }
}

export const config = {
  name: "weekly-vendor-payout",
  schedule: "0 6 * * 1", // Monday 06:00 UTC
}

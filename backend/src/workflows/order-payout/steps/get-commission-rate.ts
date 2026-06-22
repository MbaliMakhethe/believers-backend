import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"
import { VENDOR_MODULE } from "../../modules/vendor"

type StepInput = {
  vendor_id: string
}

export const getCommissionRateStep = createStep(
  "get-commission-rate-step",
  async ({ vendor_id }: StepInput, { container }) => {
    const vendorModuleService = container.resolve(VENDOR_MODULE)

    // 1. Check for a vendor-specific override on the vendor record
    const vendor = await vendorModuleService.retrieveVendor(vendor_id)
    if (vendor.commission_rate != null) {
      return new StepResponse(vendor.commission_rate)
    }

    // 2. Check for a vendor-specific CommissionRule
    const [vendorRules] = await vendorModuleService.listAndCountCommissionRules({
      vendor_id,
      is_active: true,
    })
    if (vendorRules.length > 0) {
      return new StepResponse(vendorRules[0].percentage)
    }

    // 3. Fall back to the platform-wide default rule
    const [globalRules] = await vendorModuleService.listAndCountCommissionRules({
      vendor_id: null,
      category_id: null,
      is_active: true,
    })
    if (globalRules.length > 0) {
      return new StepResponse(globalRules[0].percentage)
    }

    // 4. Absolute fallback if no rule has ever been configured
    return new StepResponse(15)
  }
)

import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { VENDOR_MODULE } from "../../../modules/vendor"

type CreateRuleBody = {
  vendor_id?: string | null
  category_id?: string | null
  percentage: number
  flat_fee?: number
  label?: string
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const vendorModuleService = req.scope.resolve(VENDOR_MODULE)
  const [rules, count] = await vendorModuleService.listAndCountCommissionRules(
    {},
    { take: 100 }
  )
  res.json({ commission_rules: rules, count })
}

export async function POST(
  req: MedusaRequest<CreateRuleBody>,
  res: MedusaResponse
) {
  const body = req.body as CreateRuleBody
  const vendorModuleService = req.scope.resolve(VENDOR_MODULE)

  // If this is meant to be the new global default, deactivate the old one
  if (!body.vendor_id && !body.category_id) {
    const [existingGlobal] = await vendorModuleService.listAndCountCommissionRules({
      vendor_id: null,
      category_id: null,
      is_active: true,
    })
    if (existingGlobal.length) {
      await vendorModuleService.updateCommissionRules(
        existingGlobal.map((r: any) => ({ id: r.id, is_active: false }))
      )
    }
  }

  const rule = await vendorModuleService.createCommissionRules({
    vendor_id: body.vendor_id ?? null,
    category_id: body.category_id ?? null,
    percentage: body.percentage,
    flat_fee: body.flat_fee ?? 0,
    label: body.label ?? null,
    is_active: true,
  })

  res.status(201).json({ commission_rule: rule })
}

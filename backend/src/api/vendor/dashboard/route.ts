import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { VENDOR_MODULE } from "../../../modules/vendor"

// GET /vendor/dashboard -> sales summary, payout history, low-stock alerts
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  // @ts-ignore
  const vendor = req.vendor
  const vendorModuleService = req.scope.resolve(VENDOR_MODULE)
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const [allSales] = await vendorModuleService.listAndCountVendorSales({
    vendor_id: vendor.id,
  })
  const [payouts] = await vendorModuleService.listAndCountPayouts(
    { vendor_id: vendor.id },
    { order: { paid_at: "DESC" }, take: 10 }
  )

  const totalGross = allSales.reduce((sum: number, s: any) => sum + s.line_total, 0)
  const totalNet = allSales.reduce((sum: number, s: any) => sum + s.vendor_net_amount, 0)
  const pendingNet = allSales
    .filter((s: any) => !s.payout_id)
    .reduce((sum: number, s: any) => sum + s.vendor_net_amount, 0)

  // Low stock alert: this vendor's product variants under 5 units
  const [vendorProducts] = await vendorModuleService.listAndCountVendorProducts({
    vendor_id: vendor.id,
    approval_status: "approved",
  })
  const productIds = vendorProducts.map((vp: any) => vp.product_id)
  const { data: products } = productIds.length
    ? await query.graph({
        entity: "product",
        filters: { id: productIds },
        fields: ["id", "title", "variants.title", "variants.inventory_quantity"],
      })
    : { data: [] }

  const lowStock = products.flatMap((p: any) =>
    (p.variants || [])
      .filter((v: any) => v.inventory_quantity < 5)
      .map((v: any) => ({
        product_title: p.title,
        variant_title: v.title,
        inventory_quantity: v.inventory_quantity,
      }))
  )

  res.json({
    summary: {
      total_orders: new Set(allSales.map((s: any) => s.order_id)).size,
      total_gross_sales: totalGross,
      total_net_earnings: totalNet,
      pending_payout_amount: pendingNet,
    },
    recent_payouts: payouts,
    low_stock_alerts: lowStock,
  })
}

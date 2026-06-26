import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { VENDOR_MODULE } from "../../modules/vendor"

type StepInput = {
  order_id: string
}

export const getOrderLineItemsWithVendorStep = createStep(
  "get-order-line-items-with-vendor-step",
  async ({ order_id }: StepInput, { container }) => {
    const query = container.resolve(ContainerRegistrationKeys.QUERY)
    const vendorModuleService = container.resolve(VENDOR_MODULE)

    const { data: orders } = await query.graph({
      entity: "order",
      filters: { id: order_id },
      fields: [
        "id",
        "currency_code",
        "items.id",
        "items.product_id",
        "items.quantity",
        "items.unit_price",
        "items.total",
      ],
    })

    const order = orders[0]
    if (!order) {
      throw new Error(`Order ${order_id} not found`)
    }

    // Resolve vendor_id for each line item's product via VendorProduct
    const productIds = order.items.map((i: any) => i.product_id)
    const [vendorProducts] = await vendorModuleService.listAndCountVendorProducts({
      product_id: productIds,
    })
    const vendorByProduct: Record<string, string> = {}
    vendorProducts.forEach((vp: any) => {
      vendorByProduct[vp.product_id] = vp.vendor_id
    })

    const lineItems = order.items
      .filter((item: any) => vendorByProduct[item.product_id])
      .map((item: any) => ({
        ...item,
        vendor_id: vendorByProduct[item.product_id],
      }))

    return new StepResponse({
      order_id: order.id,
      currency_code: order.currency_code,
      line_items: lineItems,
    })
  }
)

import { Modules } from "@medusajs/framework/utils"
import type { MedusaContainer } from "@medusajs/framework/types"

type NotifyArgs = {
  to: string
  template:
    | "vendor-approved"
    | "vendor-rejected"
    | "product-approved"
    | "product-rejected"
    | "payout-sent"
  data: Record<string, any>
}

/**
 * Thin wrapper around the Notification module. Template strings here map
 * to whatever templates you configure in your real notification provider
 * (e.g. SendGrid dynamic template IDs) — the "local" dev provider just
 * logs these to the console.
 */
export async function notifyVendor(container: MedusaContainer, args: NotifyArgs) {
  const notificationModuleService = container.resolve(Modules.NOTIFICATION)
  try {
    await notificationModuleService.createNotifications({
      to: args.to,
      channel: "email",
      template: args.template,
      data: args.data,
    })
  } catch (err) {
    // Don't let a notification failure break the underlying admin action
    const logger = container.resolve("logger")
    logger.warn(`Failed to send notification "${args.template}" to ${args.to}`)
  }
}

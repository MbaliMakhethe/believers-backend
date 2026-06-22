import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// GET /vendor/me -> the logged-in vendor's own profile
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  // @ts-ignore - attached by attachVendor middleware
  res.json({ vendor: req.vendor })
}

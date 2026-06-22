import { MedusaService } from "@medusajs/framework/utils"
import Vendor from "./models/vendor"
import VendorProduct from "./models/vendor-product"
import CommissionRule from "./models/commission-rule"
import Payout from "./models/payout"
import VendorSale from "./models/vendor-sale"

/**
 * MedusaService auto-generates create/read/update/delete + list/count
 * methods for every model passed in, named after the model
 * (e.g. createVendors, listVendors, updateVendorProducts, etc.)
 */
class VendorModuleService extends MedusaService({
  Vendor,
  VendorProduct,
  CommissionRule,
  Payout,
  VendorSale,
}) {}

export default VendorModuleService

import express from "express"
import {
  upsertGoogleCustomer,
  getCustomerByEmail,
  updateCustomerProfile,
  adjustCustomerMetrics,
  getAllCustomers,
} from "../controllers/customerController.js"
import { requireAdminApiKey } from "../middlewares/adminKeyMiddleware.js"

const router = express.Router()

router.get("/", requireAdminApiKey, getAllCustomers)
router.post("/google-login", upsertGoogleCustomer)
router.get("/:email", getCustomerByEmail)
router.patch("/:email/profile", updateCustomerProfile)
router.patch("/:email/metrics", adjustCustomerMetrics)

export default router

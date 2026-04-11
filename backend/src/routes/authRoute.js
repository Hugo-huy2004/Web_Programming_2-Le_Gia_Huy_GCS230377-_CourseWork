import express from "express";
import { adminLogin, fetchMe, logout } from "../controllers/authController.js"
import { protectedRoutes } from "../middlewares/authMiddlewares.js";

const router = express.Router();

router.post("/admin/login",adminLogin)
router.post("/logout",logout)
router.get("/profile/admin",protectedRoutes, fetchMe)

export default router;
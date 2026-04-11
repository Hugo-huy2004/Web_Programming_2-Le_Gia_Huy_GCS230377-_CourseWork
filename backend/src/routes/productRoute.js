import express from "express";
import { editProduct, getAllProducts, getProductById, addProduct, deleteProduct, syncProducts } from "../controllers/productController.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import { requireAdminApiKey } from "../middlewares/adminKeyMiddleware.js";

const router = express.Router();  


router.get("/", getAllProducts);
router.get("/:id", getProductById);

router.patch("/:id", requireAdminApiKey, upload.single("image"), editProduct);
router.put("/:id", requireAdminApiKey, upload.single("image"), editProduct);
router.post("/sync", requireAdminApiKey, syncProducts);
router.post("/", requireAdminApiKey, upload.single("image"), addProduct);
router.delete("/:id", requireAdminApiKey, deleteProduct);


export default router;
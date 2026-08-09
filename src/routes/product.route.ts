import express from "express";
import * as productController from "../controllers/product.controller";
import { createUploader } from "../middlewares/upload.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = express.Router();
const uploadtemp = createUploader("temp");

router.post(
  "/create",
  authMiddleware,
  authorize("Admin", "Manager"),
  uploadtemp.single("image"),
  productController.createProduct,
);

router.get(
  "/",
  authMiddleware,
  authorize("Admin", "Manager", "Cashier"),
  productController.getProducts,
);

router.get(
  "/stats",
  authMiddleware,
  authorize("Admin", "Manager", "Cashier"),
  productController.getProductStats,
);

router.get(
  "/low-stock",
  authMiddleware,
  authorize("Admin", "Manager", "Cashier"),
  productController.getLowStockProduct,
);

router.get(
  "/:id",
  authMiddleware,
  authorize("Admin", "Manager", "Cashier"),
  productController.getProductById,
);

router.put(
  "/update/:id",
  authMiddleware,
  authorize("Admin", "Manager"),
  uploadtemp.single("image"),
  productController.updateProduct,
);

router.delete(
  "/:id",
  authMiddleware,
  authorize("Admin", "Manager"),
  productController.deleteProduct,
);

export default router;

import express from "express";
import * as productController from "../controllers/product.controller";
import { createUploader } from "../middlewares/upload.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/permission.middleware";

const router = express.Router();
const uploadtemp = createUploader("temp", "image");

router.post(
  "/create",
  authMiddleware,
  authorize("product.create"),
  uploadtemp.single("image"),
  productController.createProduct,
);

router.get(
  "/",
  authMiddleware,
  authorize("product.view"),
  productController.getProducts,
);

router.get(
  "/stats",
  authMiddleware,
  authorize("product.view"),
  productController.getProductStats,
);

router.get(
  "/low-stock",
  authMiddleware,
  authorize("product.view"),
  productController.getLowStockProduct,
);

router.get(
  "/:id",
  authMiddleware,
  authorize("product.view"),
  productController.getProductById,
);

router.put(
  "/update/:id",
  authMiddleware,
  authorize("product.update"),
  uploadtemp.single("image"),
  productController.updateProduct,
);

router.delete(
  "/:id",
  authMiddleware,
  authorize("product.delete"),
  productController.deleteProduct,
);

export default router;

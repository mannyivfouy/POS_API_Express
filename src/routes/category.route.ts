import express from "express";
import * as categoryController from "../controllers/category.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/permission.middleware";

const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  authorize("category.create"),
  categoryController.createCategory,
);

router.get(
  "/",
  authMiddleware,
  authorize("category.view"),
  categoryController.getCategories,
);


router.get(
  "/stats",
  authMiddleware,
  authorize("category.view"),
  categoryController.getCategoryStats,
);

router.get(
  "/:id",
  authMiddleware,
  authorize("category.view"),
  categoryController.getCategoryById,
);

router.put(
  "/update/:id",
  authMiddleware,
  authorize("category.update"),
  categoryController.updateCategory,
);

router.delete(
  "/:id",
  authMiddleware,
  authorize("category.delete"),
  categoryController.deleteCategory,
);

export default router;

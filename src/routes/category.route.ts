import express from "express";
import * as categoryController from "../controllers/category.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "./../middlewares/role.middleware";

const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  authorize("Admin", "Manager"),
  categoryController.createCategory,
);

router.get(
  "/",
  authMiddleware,
  authorize("Admin", "Manager", "Cashier"),
  categoryController.getCategories,
);

router.get(
  "/:id",
  authMiddleware,
  authorize("Admin", "Manager", "Cashier"),
  categoryController.getCategoryById,
);

router.put(
  "/update/:id",
  authMiddleware,
  authorize("Admin", "Manager"),
  categoryController.updateCategory,
);

router.delete(
  "/:id",
  authMiddleware,
  authorize("Admin", "Manager"),
  categoryController.deleteCategory,
);

export default router;

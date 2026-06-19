import express from "express";
import * as supplierController from "../controllers/supplier.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  authorize("Admin"),
  supplierController.createSupplier,
);

router.get(
  "/",
  authMiddleware,
  authorize("Admin", "Manager"),
  supplierController.getSuppliers,
);

router.get(
  "/:id",
  authMiddleware,
  authorize("Admin", "Manager"),
  supplierController.getSupplierById,
);

router.put(
  "/update/:id",
  authMiddleware,
  authorize("Admin"),
  supplierController.updateSupplier,
);

router.delete(
  "/:id",
  authMiddleware,
  authorize("Admin"),
  supplierController.deleteSupplier,
);

export default router;

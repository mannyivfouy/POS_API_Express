import express from "express";
import * as saleController from "../controllers/sale.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = express.Router();

router.post(
  "/prepare-payment",
  authMiddleware,
  saleController.preparedSalePayment,
);

router.post(
  "/complete",
  authMiddleware,
  saleController.completeSale,
);

router.post(
  "/create",
  authMiddleware,
  authorize("Admin", "Cashier"),
  saleController.createSale,
);

router.get(
  "/",
  authMiddleware,
  authorize("Admin", "Manager"),
  saleController.getSales,
);

router.get(
  "/stats",
  authMiddleware,
  authorize("Admin", "Manager"),
  saleController.getSaleStats,
);

router.get(
  "/:id",
  authMiddleware,
  authorize("Admin", "Manager"),
  saleController.getSaleById,
);

export default router;

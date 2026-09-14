import express from "express";
import * as saleController from "../controllers/sale.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/permission.middleware";

const router = express.Router();

router.post(
  "/prepare-payment",
  authMiddleware,
  authorize("sale.create"),
  saleController.preparedSalePayment,
);

router.post(
  "/complete",
  authMiddleware,
  authorize("sale.create"),
  saleController.completeSale,
);

router.post(
  "/cancel",
  authMiddleware,
  authorize("sale.create"),
  saleController.cancelSale,
);

router.get(
  "/",
  authMiddleware,
  authorize("sale.view"),
  saleController.getSales,
);

router.get(
  "/stats",
  authMiddleware,
  authorize("sale.view"),
  saleController.getSaleStats,
);

router.get(
  "/:id",
  authMiddleware,
  authorize("sale.view"),
  saleController.getSaleById,
);

export default router;

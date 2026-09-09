import express from "express";
import * as saleController from "../controllers/sale.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/permission.middleware";

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
  authorize("sale.create"),
  saleController.createSale,
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

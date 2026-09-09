import express from "express";
import * as purchaseController from "../controllers/purchase.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  authorize("purchase.create"),
  purchaseController.createPurchase,
);

router.get(
  "/",
  authMiddleware,
  authorize("purchase.view"),
  purchaseController.getPurchases,
);

router.get(
  "/stats",
  authMiddleware,
  authorize("purchase.view"),
  purchaseController.getPurchaseStats,
);

router.get(
  "/:id",
  authMiddleware,
  authorize("purchase.view"),
  purchaseController.getPurchaseById,
);

export default router;

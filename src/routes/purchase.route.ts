import express from "express";
import * as purchaseController from "../controllers/purchase.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  authorize("Admin", "Manager"),
  purchaseController.createPurchase,
);

router.get(
  "/",
  authMiddleware,
  authorize("Admin", "Manager"),
  purchaseController.getPurchases,
);

router.get(
  "/stats",
  authMiddleware,
  authorize("Admin", "Manager"),
  purchaseController.getPurchaseStats,
);

router.get(
  "/:id",
  authMiddleware,
  authorize("Admin", "Manager"),
  purchaseController.getPurchaseById,
);

export default router;

import express from "express";
import * as customerController from "../controllers/customer.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/permission.middleware";

const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  authorize("customer.create"),
  customerController.createCustomer,
);

router.get(
  "/",
  authMiddleware,
  authorize("customer.view"),
  customerController.getCustomers,
);

router.get(
  "/stats",
  authMiddleware,
  authorize("customer.view"),
  customerController.getCustomerStats,
);

router.get(
  "/:id",
  authMiddleware,
  authorize("customer.view"),
  customerController.getCustomerById,
);

router.put(
  "/update/:id",
  authMiddleware,
  authorize("customer.update"),
  customerController.updateCustomer,
);

router.delete(
  "/:id",
  authMiddleware,
  authorize("customer.delete"),
  customerController.deleteCustomer,
);

export default router;

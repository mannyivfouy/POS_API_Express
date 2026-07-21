import express from "express";
import * as customerController from "../controllers/customer.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  authorize("Admin", "Manager", "Cashier"),
  customerController.createCustomer,
);

router.get(
  "/",
  authMiddleware,
  authorize("Admin", "Manager", "Cashier"),
  customerController.getCustomers,
);

router.get(
  "/stats",
  authMiddleware,
  authorize("Admin", "Manager", "Cashier"),
  customerController.getCustomerStats,
);

router.get(
  "/:id",
  authMiddleware,
  authorize("Admin", "Manager", "Cashier"),
  customerController.getCustomerById,
);

router.put(
  "/update/:id",
  authMiddleware,
  authorize("Admin", "Manager", "Cashier"),
  customerController.updateCustomer,
);

router.delete(
  "/:id",
  authMiddleware,
  authorize("Admin", "Manager", "Cashier"),
  customerController.deleteCustomer,
);

export default router;

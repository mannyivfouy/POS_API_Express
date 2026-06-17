import express from "express";
import * as roleController from "../controllers/role.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = express.Router();

router.post(
  "/create", 
  authMiddleware,
  authorize("Admin"),
  roleController.createRole
);

router.get(
  "/", 
  authMiddleware,
  authorize("Admin"),
  roleController.getRoles
);

router.get(
  "/:id", 
  authMiddleware,
  authorize("Admin"),
  roleController.getRoleById
);

router.delete(
  "/:id", 
  authMiddleware,
  authorize("Admin"),
  roleController.deleteRole
);

export default router;
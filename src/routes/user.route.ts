import express from "express";
import * as userController from "../controllers/user.controller";
import { createUploader } from "../middlewares/upload.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = express.Router();

const uploadtemp = createUploader("temp");

router.post(
  "/create",
  authMiddleware,
  authorize("admin"),
  uploadtemp.single("avatar"),
  userController.createUser,
);

router.get(
  "/",
  authMiddleware,
  authorize("admin", "manager"),
  userController.getUsers,
);

router.get(
  "/:id",
  authMiddleware,
  authorize("admin", "manager"),
  userController.getUserById,
);

router.put(
  "/update/:id",
  authMiddleware,
  authorize("admin"),
  uploadtemp.single("avatar"),
  userController.updateUser,
);

router.delete(
  "/:id",
  authMiddleware,
  authorize("admin"),
  userController.deleteUser,
);

export default router;

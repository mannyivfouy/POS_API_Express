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
  authorize("Admin"),
  uploadtemp.single("avatar"),
  userController.createUser,
);

router.get(
  "/",
  authMiddleware,
  authorize("Admin", "Manager"),
  userController.getUsers,
);

router.get(
  "/:id",
  authMiddleware,
  authorize("Admin", "Manager"),
  userController.getUserById,
);

router.put(
  "/update/:id",
  authMiddleware,
  authorize("Admin"),
  uploadtemp.single("avatar"),
  userController.updateUser,
);

router.delete(
  "/:id",
  authMiddleware,
  authorize("Admin"),
  userController.deleteUser,
);

export default router;

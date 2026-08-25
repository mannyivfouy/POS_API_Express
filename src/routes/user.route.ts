import express from "express";
import * as userController from "../controllers/user.controller";
import { createUploader } from "../middlewares/upload.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { updateProfile } from "./../services/user.service";

const router = express.Router();

const uploadtemp = createUploader("temp", "avatar");

router.post(
  "/create",
  authMiddleware,
  authorize("Admin"),
  uploadtemp.single("avatar"),
  userController.createUser,
);

router.get("/profile", authMiddleware, userController.getUserProfile);

router.put(
  "/profile",
  authMiddleware,
  uploadtemp.single("avatar"),
  userController.updateUserProfile,
);

router.get(
  "/",
  authMiddleware,
  authorize("Admin", "Manager"),
  userController.getUsers,
);

router.get(
  "/stats",
  authMiddleware,
  authorize("Admin"),
  userController.getUserStats,
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

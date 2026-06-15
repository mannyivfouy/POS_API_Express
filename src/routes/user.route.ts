import express from "express";
import * as userController from "../controllers/user.controller";
import { createUploader } from "../middlewares/upload.middlewares";

const router = express.Router();

const uploadtemp = createUploader("temp");

router.post("/create", uploadtemp.single("avatar"), userController.createUser);
router.get("/", userController.getUsers);
router.get("/:id", userController.getUserById);
router.put("/update/:id", uploadtemp.single("avatar"),  userController.updateUser);
router.delete("/:id", userController.deleteUser)

export default router;

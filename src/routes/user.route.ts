import express from "express";
import * as userController from "../controllers/user.controller";
import { createUploader } from "../middlewares/upload.middlewares";

const router = express.Router();

const uploadtemp = createUploader("temp")

router.post("/create", uploadtemp.single("avatar"), userController.createUser);

export default router;
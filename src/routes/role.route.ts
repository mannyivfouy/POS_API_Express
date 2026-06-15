import express from "express";
import * as roleController from "../controllers/role.controller";

const router = express.Router();

router.post("/create", roleController.createRole);

export default router;
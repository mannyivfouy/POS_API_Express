import { Router } from "express";
import * as paymentController from "../controllers/payment.controller";

const router = Router();

router.post("/bakong/create", paymentController.createBakongPayment);

router.post("/bakong/check", paymentController.checkBakongPayment);

export default router;

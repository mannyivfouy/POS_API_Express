import { Request, Response } from "express";
import * as paymentService from "../services/payment.service";

export const createBakongPayment = async (req: Request, res: Response) => {
  try {
    const { amount, billNumber } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        message: "Valid Amount Is Required",
      });
    }

    if (!billNumber) {
      return res.status(400).json({
        message: "Bill Number Is Required",
      });
    }

    const result = await paymentService.createBakongPayment(
      Number(amount),
      String(billNumber),
    );

    return res.status(200).json({
      message: "Bakong Payment Created Successfully",
      data: result,
    });
  } catch (err: any) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

export const checkBakongPayment = async (req: Request, res: Response) => {
  try {
    const { md5, amount } = req.body;

    if (!md5) {
      return res.status(400).json({
        message: "Payment Reference Is Required",
      });
    }

    if (
      amount === undefined ||
      amount === null ||
      Number.isNaN(Number(amount))
    ) {
      return res.status(400).json({
        message: "Valid Payment Amount Is Required",
      });
    }

    const result = await paymentService.checkBakongPayment(
      String(md5),
      Number(amount),
    );

    return res.status(200).json({
      message: "Bakong Payment Status Fetched Successfully",
      data: result,
    });
  } catch (err: any) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

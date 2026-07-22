import { Request, Response } from "express";
import * as purchaseService from "../services/purchase.service";

export const createPurchase = async (req: Request, res: Response) => {
  try {
    const result = await purchaseService.createPurchase(req.body);

    return res.status(201).json({
      message: "Purchase Created Successfully",
      data: result,
    });
  } catch (err: any) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

export const getPurchases = async (req: Request, res: Response) => {
  try {
    const purchases = await purchaseService.getPurchases(req.query);

    return res.status(200).json({
      message: "Purchases Fetch Successfully",
      ...purchases,
    });
  } catch (err: any) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

export const getPurchaseById = async (req: Request, res: Response) => {
  try {
    const purchase = await purchaseService.getPurchaseById(
      String(req.params.id),
    );

    return res.status(200).json({
      message: "Purchase Fetch Successfully",
      data: purchase,
    });
  } catch (err: any) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

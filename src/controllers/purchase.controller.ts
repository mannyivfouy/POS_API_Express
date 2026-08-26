import { Request, Response } from "express";
import * as purchaseService from "../services/purchase.service";

export const createPurchase = async (req: any, res: any) => {
  try {
    const purchaseData = {
      ...req.body,
      createdBy: req.user._id,
    };

    const purchase = await purchaseService.createPurchase(purchaseData);

    return res.status(201).json({
      message: "Purchase created successfully",
      data: purchase,
    });
  } catch (error: any) {
    console.error("Create purchase error:", error);

    return res.status(400).json({
      message: error.message || "Failed to create purchase",
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

export const getPurchaseStats = async (req: Request, res: Response) => {
  try {
    const stats = await purchaseService.getPurchaseStats();

    return res.status(200).json({
      message: "Purchase Stats Fetch Successfully",
      data: stats,
    });
  } catch (err: any) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

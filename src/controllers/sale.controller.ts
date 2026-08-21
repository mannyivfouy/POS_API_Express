import { Request, Response } from "express";
import * as saleService from "../services/sale.service";

export const preparedSalePayment = async (req: any, res: any) => {
  try {
    const result = await saleService.preparedSalePayment({
      ...req.body,
      createdBy: req.user._id,
    });

    res.status(200).json({
      message: "Sale Payment Prepared Successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const completeSale = async (req: any, res: any) => {
  try {
    const { md5 } = req.body;

    if (!md5) {
      return res.status(400).json({
        message: "Payment MD5 Is Required",
      });
    }

    const sale = await saleService.completeSale(
      {
        ...req.body,
        createdBy: req.user._id,
      },
      md5,
    );

    res.status(201).json({
      message: "Sale Created Successfully",
      data: sale,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const createSale = async (req: Request, res: Response) => {
  try {
    const result = await saleService.createSale(req.body);

    return res.status(201).json({
      message: "Sale Created Successfully",
      data: result,
    });
  } catch (err: any) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

export const getSales = async (req: Request, res: Response) => {
  try {
    const sales = await saleService.getSales(req.query);

    return res.status(200).json({
      message: "Sales Fetch Successfully",
      ...sales,
    });
  } catch (err: any) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

export const getSaleById = async (req: Request, res: Response) => {
  try {
    const sale = await saleService.getSaleById(String(req.params.id));

    return res.status(200).json({
      message: "Sale Fetch Successfully",
      data: sale,
    });
  } catch (err: any) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

export const getSaleStats = async (req: Request, res: Response) => {
  try {
    const stats = await saleService.getSaleStats();

    return res.status(200).json({
      message: "Sale Stats Fetch Successfully",
      data: stats,
    });
  } catch (err: any) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

import { Request, Response } from "express";
import * as saleService from "../services/sale.service";

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

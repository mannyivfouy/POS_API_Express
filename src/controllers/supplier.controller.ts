import { Request, Response } from "express";
import * as supplierService from "../services/supplier.service";

export const createSupplier = async (req: Request, res: Response) => {
  try {
    const supplier = await supplierService.createSupplier(req.body);

    return res.status(201).json({
      message: "Supplier Created Successfully",
      data: supplier,
    });
  } catch (err: any) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

export const getSuppliers = async (req: Request, res: Response) => {
  try {
    const suppliers = await supplierService.getSuppliers(req.query);

    return res.status(200).json({
      message: "Suppliers Fetch Successfully",
      data: suppliers,
    });
  } catch (err: any) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

export const getSupplierById = async (req: Request, res: Response) => {
  try {
    const supplier = await supplierService.getSupplierById(
      String(req.params.id),
    );

    return res.status(200).json({
      message: "Supplier Fetch Successfully",
      data: supplier,
    });
  } catch (err: any) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

export const updateSupplier = async (req: Request, res: Response) => {
  try {
    const data: any = { ...req.body };
    const supplier = await supplierService.updateSupplier(
      String(req.params.id),
      data,
    );

    return res.status(200).json({
      message: "Supplier Updated Successfully",
      data: supplier,
    });
  } catch (err: any) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

export const deleteSupplier = async (req: Request, res: Response) => {
  try {
    await supplierService.deleteSupplier(String(req.params.id));

    return res.status(200).json({
      message: "Supplier Deleted Successfully",
    });
  } catch (err: any) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

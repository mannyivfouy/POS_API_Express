import { Request, Response } from "express";
import * as customerService from "../services/customer.service";

export const createCustomer = async (req: Request, res: Response) => {
  try {
    const customer = await customerService.createCustomer(req.body);

    return res.status(201).json({
      message: "Customer Created Successfully",
      data: customer,
    });
  } catch (err: any) {
    return res.status(409).json({
      field: err.field,
      message: err.message,
    });
  }
};

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await customerService.getCustomers(req.query);

    return res.status(200).json({
      message: "Customers Fetch Successfully",
      ...customers,
    });
  } catch (err: any) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

export const getCustomerById = async (req: Request, res: Response) => {
  try {
    const customer = await customerService.getCustomerById(
      String(req.params.id),
    );

    return res.status(200).json({
      message: "Customer Fetch Successfully",
      data: customer,
    });
  } catch (err: any) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const data: any = { ...req.body };
    const customer = await customerService.updateCustomer(
      String(req.params.id),
      data,
    );

    return res.status(200).json({
      message: "Customer Updated Successfully",
      data: customer,
    });
  } catch (err: any) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    await customerService.deleteCustomer(String(req.params.id));

    return res.status(200).json({
      message: "Customer Deleted Successfully",
    });
  } catch (err: any) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

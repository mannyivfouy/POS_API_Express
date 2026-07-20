import { Request, Response } from "express";
import * as productService from "../services/product.service";
import { moveFile } from "../utils/file";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await productService.createProduct(req.body);

    if (req.file) {
      const productPath = moveFile(req.file, "products");

      product.image = productPath;
      await product.save();
    }

    return res.status(201).json({
      message: "Product Created Successfully",
      data: product,
    });
  } catch (err: any) {
    return res.status(409).json({
      field: err.field,
      message: err.message,
    });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await productService.getProducts(req.query);

    return res.status(200).json({
      message: "Products Fetch Successfully",
      ...products
    });
  } catch (err: any) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await productService.getProductById(String(req.params.id));

    return res.status(200).json({
      message: "Product Fetch Successfully",
      data: product,
    });
  } catch (err: any) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await productService.updateProduct(
      String(req.params.id),
      req.body,
      req.file,
    );

    return res.status(200).json({
      message: "Product Updated Successfully",
      data: product,
    });
  } catch (err: any) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    await productService.deleteProduct(String(req.params.id));

    return res.status(200).json({
      message: "Product Deleted Successfully",
    });
  } catch (err: any) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

export const getProductStats = async (req: Request, res: Response) => {
  try {
    const stats = await productService.getProductStats();

    return res.status(200).json({
      message: "Product Stats Fetch Successfully",
      data: stats,
    });
  } catch (err: any) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

import { Request, Response } from "express";
import * as categoryService from "../services/category.service";

export const createCategory = async (req: Request, res: Response) => {
  try {
    const category = await categoryService.createCategory(req.body);

    return res.status(201).json({
      message: "Category Created Successfully",
      data: category,
    });
  } catch (err: any) {
    return res.status(409).json({
      field: err.field,
      message: err.message,
    });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await categoryService.getCategories(req.query);

    return res.status(200).json({
      message: "Categories Fetch Successfully",
      ...categories,
    });
  } catch (err: any) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await categoryService.getCategoryById(
      String(req.params.id),
    );

    return res.status(200).json({
      message: "Category Fetch Successfully",
      data: category,
    });
  } catch (err: any) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const data: any = { ...req.body };
    const category = await categoryService.updateCategory(
      String(req.params.id),
      data,
    );

    return res.status(200).json({
      message: "Category Updated Successfully",
      data: category,
    });
  } catch (err: any) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    await categoryService.deleteCategory(String(req.params.id));

    return res.status(200).json({
      message: "Category Deleted Successfully",
    });
  } catch (err: any) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

export const getCategoryStats = async (req: Request, res: Response) => {
  try {
    const stats = await categoryService.getCategoryStats();

    return res.status(200).json({
      message: "Category Stats Fetch Successfully",
      data: stats,
    });
  } catch (err: any) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

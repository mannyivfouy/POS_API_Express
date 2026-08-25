import { Request, Response, NextFunction } from "express";
import multer from "multer";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Multer errors
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      field: err.field || null,
      message: err.message,
    });
  }

  // Custom upload validation errors
  if (err.status === 400 && err.field) {
    return res.status(400).json({
      field: err.field,
      message: err.message,
    });
  }

  // Other known errors
  if (err.status) {
    return res.status(err.status).json({
      message: err.message,
    });
  }

  // Unexpected server errors
  console.error(err);

  return res.status(500).json({
    message: "Internal server error",
  });
};

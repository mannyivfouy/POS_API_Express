import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod/v3";

export const validate =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      (schema.parse(req.body), next());
    } catch (err: any) {
      return res.status(400).json({
        message: "Validation Falied",
        errors: err.errors,
      });
    }
  };

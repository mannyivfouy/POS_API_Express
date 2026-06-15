import { Request, Response } from "express";
import * as roleService from "../services/role.service";

export const createRole = async (req: Request, res: Response) => {
  try {
    const role = await roleService.createRole(req.body);

    res.status(201).json({
      message: "Role Create Successfully",
      data: role,
    });
  } catch (err: any) {
    res.status(400).json({
      message: err.message,
    });
  }
};

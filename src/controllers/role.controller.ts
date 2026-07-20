import { Request, Response } from "express";
import * as roleService from "../services/role.service";

export const createRole = async (req: Request, res: Response) => {
  try {
    const role = await roleService.createRole(req.body);

    res.status(201).json({
      message: "Role Created Successfully",
      data: role,
    });
  } catch (err: any) {
    res.status(400).json({
      field: err.field,
      message: err.message,
    });
  }
};

export const getRoles = async (req: Request, res: Response) => {
  try {
    const roles = await roleService.getRoles();

    return res.status(200).json({
      message: "Roles Fetch Successfully",
      data: roles,
    });
  } catch (err: any) {
    res.status(400).json({
      message: err.message,
    });
  }
};

export const getRoleById = async (req: Request, res: Response) => {
  try {
    const role = await roleService.getRoleById(String(req.params.id));

    return res.status(200).json({
      message: "Role Fetch Successfully",
      data: role,
    });
  } catch (err: any) {
    res.status(400).json({
      message: err.message,
    });
  }
};

export const deleteRole = async (req: Request, res: Response) => {
  try {
    await roleService.deleteRole(String(req.params.id));

    return res.status(200).json({
      message: "Role Delete Successfully",
    });
  } catch (err: any) {
    res.status(400).json({
      message: err.message,
    });
  }
};

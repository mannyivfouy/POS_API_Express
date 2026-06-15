import { Request, Response } from "express";
import * as userService from "../services/user.service";

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.createUser(req.body);

    user.password = undefined as any;

    res.status(201).json({
      message: "User Create Successfully",
      data: user,
    });
  } catch (err: any) {
    res.status(400).json({
      message: err.message,
    });
  }
};

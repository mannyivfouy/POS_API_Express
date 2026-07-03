import { Request, Response } from "express";
import * as authService from "../services/auth.service";

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const result = await authService.login(username, password);

    return res.status(200).json({ message: "Login Successfully", result });
  } catch (err: any) {
    if(err.message === "ACCOUNT_INACTIVE"){
      return res.status(403).json({
        message: "Your Account Has Been Deactivated, Please Contact Admin"
      })
    }

    return res.status(401).json({ message: err.message });
  }
};

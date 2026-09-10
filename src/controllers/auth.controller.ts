import { Request, Response } from "express";
import * as authService from "../services/auth.service";

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const ip = req.ip;
    if (!ip) {
      return res.status(400).json({
        message: "Unable to determine client IP address",
      });
    }

    const result = await authService.login(username, password, ip);

    return res.status(200).json({ message: "Login Successfully", result });
  } catch (err: any) {
    if (err.message === "TOO_MANY_LOGIN_ATTEMPTS") {
      return res.status(429).json({
        message: "Too many login attempts. Please try again later.",
      });
    }

    if (err.message === "ACCOUNT_INACTIVE") {
      return res.status(403).json({
        message: "Your Account Has Been Deactivated, Please Contact Admin",
      });
    }

    return res.status(401).json({ message: err.message });
  }
};

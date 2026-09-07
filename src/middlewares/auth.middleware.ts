import jwt from "jsonwebtoken";
import User from "../models/User";
import { getRolePermissions } from "../services/permission.service";

export const authMiddleware = async (req: any, res: any, next: any) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "No Token Provided",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    const user = await User.findById(decoded.id).populate("roleId");

    if (!user) {
      return res.status(401).json({
        message: "User Not Found",
      });
    }

    const roleId = user.roleId?._id;

    if (!roleId) {
      return res.status(403).json({
        message: "Role Not Found",
      });
    }

    const permissions = await getRolePermissions(roleId);

    (user as any).permissions = permissions;

    req.user = user;

    next();
  } catch (err: any) {
    console.error("Auth Error:", err);

    return res.status(401).json({
      message: "Invalid Token",
    });
  }
};

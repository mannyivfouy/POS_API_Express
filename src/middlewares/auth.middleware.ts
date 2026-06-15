import jwt from "jsonwebtoken";
import User from "../models/User";

export const authMiddleware = async (req: any, res: any, next: any) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No Token Provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await User.findById(decoded.id).populate("roleId");

    if (!user) {
      return res.status(401).json({ message: "User Not Found" });
    }

    req.user = user;
    next();
  } catch (err: any) {
    return res.status(401).json({
      message: "Invalid Token",
    });
  }
};

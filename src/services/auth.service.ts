import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { getRolePermissions } from "../services/permission.service";

export const login = async (username: string, password: string) => {
  const user = await User.findOne({ username }).populate("roleId");

  if (!user) {
    throw new Error("Invalid Credentials");
  }

  if (user.status === "inactive") {
    throw new Error("ACCOUNT_INACTIVE");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid Credentials");
  }

  const roleId = user.roleId?._id;

  if (!roleId) {
    throw new Error("ROLE_NOT_FOUND");
  }

  const permissions = await getRolePermissions(roleId);

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });

  const { password: _, ...userResponse } = user.toObject();

  return {
    token,
    user: {
      ...userResponse,
      permissions,
    },
  };
};

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";

export const login = async (username: string, password: string) => {
  const user = await User.findOne({ username }).populate("roleId");

  if (!user) {
    throw new Error("Invalid Credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid Credentials");
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  return { token, user };
};

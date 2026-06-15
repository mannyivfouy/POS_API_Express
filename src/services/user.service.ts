import User from "../models/User";
import { hashPassword } from "../utils/bcrypt";

export const createUser = async (data: any) => {
  const existingUser = await User.findOne({ username: data.username });
  if (existingUser) {
    throw new Error("Username Already Exists");
  }

  const hashed = await hashPassword(data.password);

  const user = await User.create({
    ...data,
    password: hashed,
  });

  return user;
};

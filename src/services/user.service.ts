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

export const getUsers = async () => {
  const users = await User.find().select("-password");
  return users;
};

export const getUserById = async (id: string) => {
  const user = await User.findById(id).select("-password");

  if (!user) {
    throw new Error("User Not Found");
  }

  return user;
};

export const updateUser = async (id: string, data: any) => {
  if (data.password) {
    data.password = await hashPassword(data.password);
  }

  const user = await User.findByIdAndUpdate(id, data, {
    new: true,
  }).select("-password");

  if (!user) {
    throw new Error("User Not Found");
  }

  return user;
};

export const deleteUser = async (id: string) => {
  const user = await User.findByIdAndDelete(id);

  if (!user) {
    throw new Error("User Not Found");
  }

  return { message: "User Deleted Successfully" };
};

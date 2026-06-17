import { Request, Response } from "express";
import * as userService from "../services/user.service";
import { moveFile, deleteFile } from "../utils/file";

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.createUser(req.body);

    if (req.file) {
      const avatarPath = moveFile(req.file, "avatars");

      user.avatar = avatarPath;
      await user.save();
    }

    return res.status(201).json({
      message: "User Create Successfully",
      data: user,
    });
  } catch (err: any) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getUsers();

    return res.status(200).json({
      message: "Users Fetch Successfully",
      data: users,
    });
  } catch (err: any) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await userService.getUserById(String(req.params.id));

    return res.status(200).json({
      message: "User Fetch Successfully",
      data: user,
    });
  } catch (err: any) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.updateUser(
      String(req.params.id),
      req.body,
      req.file,
    );

    return res.status(200).json({
      message: "User Updated Successfully",
      data: user,
    });
  } catch (err: any) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    await userService.deleteUser(String(req.params.id));

    return res.status(200).json({
      message: "User Deleted Successfully",
    });
  } catch (err: any) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

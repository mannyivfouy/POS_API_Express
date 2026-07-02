import { Request, Response } from "express";
import * as userService from "../services/user.service";
import { moveFile, deleteFile } from "../utils/file";
import { AuthRequest } from "../types/express";

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.createUser(req.body);

    if (req.file) {
      const avatarPath = moveFile(req.file, "avatars");

      user.avatar = avatarPath;
      await user.save();
    }

    return res.status(201).json({
      message: "User Created Successfully",
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
    const users = await userService.getUsers(req.query);

    return res.status(200).json({
      message: "Users Fetch Successfully",
      ...users,
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

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userProfile = await userService.getProfile((req as any).user.id);

    return res.status(200).json({
      message: "User Fetch Successfully",
      data: userProfile,
    });
  } catch (err: any) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const userProfile = await userService.updateProfile(
      (req as any).user.id,
      req.body,
      req.file,
    );

    return res.status(200).json({
      message: "User Updated Successfully",
      data: userProfile,
    });
  } catch (err: any) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

export const getUserStats = async (req: Request, res: Response) => {
  try {
    const stats = await userService.getUserStats();

    return res.status(200).json({
      message: "User Stats Fetch Successfully",
      data: stats,
    });
  } catch (err: any) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

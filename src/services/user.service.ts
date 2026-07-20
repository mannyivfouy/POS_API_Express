import User from "../models/User";
import { hashPassword } from "../utils/bcrypt";
import { deleteFile, moveFile } from "../utils/file";
import { paginate } from "../utils/query";

export const createUser = async (data: any, file?: Express.Multer.File) => {
  const existingUsername = await User.findOne({ username: data.username });
  if (existingUsername) {
    throw {
      field : "username",
      message: "Username already exists"
    }
  }

  const existingEmail = await User.findOne({ email: data.email });
  if (existingEmail) {
    throw {
      field : "email",
      message: "Email already exists"
    }
  }

  const existingPhone = await User.findOne({ phone: data.phone });
  if (existingPhone) {
    throw {
      field : "phone",
      message : "Phone already exists"
    }
  }

  const hashed = await hashPassword(data.password);

  const user = await User.create({
    ...data,
    password: hashed,
  });

  return user;
};

export const getUsers = async (query: any) => {
  return paginate({
    model: User,
    query,
    searchFields: ["username", "fullname", "email", "phone"],
    allowedFilters: ["status", "roleId"],
    select: "-password",
    populate: "roleId",
  });
};

export const getUserById = async (id: string) => {
  const user = await User.findById(id).select("-password").populate("roleId");

  if (!user) {
    throw new Error("User Not Found");
  }

  return user;
};

export const updateUser = async (
  id: string,
  data: any,
  file?: Express.Multer.File,
) => {
  const user = await User.findById(id);

  if (!user) {
    throw new Error("User Not Found");
  }

  if (file) {
    if (user.avatar) {
      deleteFile(user.avatar);
    }
    data.avatar = moveFile(file, "avatars");
  }

  if (!data.password) {
    delete data.password;
  } else {
    data.password = await hashPassword(data.password);
  }

  const updateUser = await User.findByIdAndUpdate(id, data, {
    new: true,
  })
    .select("-password")
    .populate("roleId");

  return updateUser;
};

export const deleteUser = async (id: string) => {
  const user = await User.findById(id);

  if (!user) {
    throw new Error("User Not Found");
  }

  if (user.avatar) {
    deleteFile(user.avatar);
  }

  await User.findByIdAndDelete(id);

  return { message: "User Deleted Successfully" };
};

export const getProfile = async (id: string) => {
  const userProfile = await User.findById(id)
    .select("-password")
    .populate("roleId");

  if (!userProfile) {
    throw new Error("User Not Found");
  }

  return userProfile;
};

export const updateProfile = async (
  id: string,
  data: any,
  file?: Express.Multer.File,
) => {
  const userProfile = await User.findById(id);

  if (!userProfile) {
    throw new Error("User Not Found");
  }

  if (file) {
    if (userProfile.avatar) {
      deleteFile(userProfile.avatar);
    }
    data.avatar = moveFile(file, "avatars");
  }

  if (!data.password) {
    delete data.password;
  } else {
    data.password = await hashPassword(data.password);
  }

  const updateUserProfile = await User.findByIdAndUpdate(id, data, {
    new: true,
  })
    .select("-password")
    .populate("roleId");

  return updateUserProfile;
};

export const getUserStats = async () => {
  const totalUser = await User.countDocuments();
  const activeUser = await User.countDocuments({
    status: "active",
  });
  const inactiveUser = await User.countDocuments({
    status: "inactive",
  });

  return {
    totalUser,
    activeUser,
    inactiveUser, 
  };
};

import User from "../models/User";
import { hashPassword } from "../utils/bcrypt";
import { deleteFile, moveFile } from "../utils/file";

export const createUser = async (data: any, file?: Express.Multer.File) => {
  const existingUsername = await User.findOne({ username: data.username });
  if (existingUsername) {
    throw new Error("Username Already Exists");
  }

  const existingEmail = await User.findOne({ email: data.email });
  if (existingEmail) {
    throw new Error("Email Already Exists");
  }

  const existingPhone = await User.findOne({ phone: data.phone });
  if (existingPhone) {
    throw new Error("Phone Number Already Exists");
  }

  const hashed = await hashPassword(data.password);

  const user = await User.create({
    ...data,
    password: hashed,
  });

  return user;
};

export const getUsers = async (query: any) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const search = query.search || "";

  const skip = (page - 1) * limit;

  const filter: any = {};

  if (search) {
    filter.$or = [
      {
        username: {
          $regex: search,
          $options: "i",
        },
      },
      {
        fullname: {
          $regex: search,
          $options: "i",
        },
      },
      {
        email: {
          $regex: search,
          $options: "i",
        },
      },
      {
        phone: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  const users = await User.find(filter)
    .select("-password")
    .populate("roleId")
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments(filter);

  return {
    data: users,
    pagination: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
  };
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
    status: "inactive"
  })

  return{
    totalUser,
    activeUser,
    inactiveUser
  }
};

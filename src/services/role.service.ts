import Role from "../models/Role";
import User from "../models/User";

export const createRole = async (data: any) => {
  const existingRole = await Role.findOne({ name: data.name });
  if (existingRole) {
    throw {
      field : 'role',
      message: 'Role already exists'
    }
  }

  return await Role.create(data);
};

export const getRoles = async () => {
  const role = await Role.find();
  return role;
};

export const getRoleById = async (id: string) => {
  const role = await Role.findById(id);

  if (!role) {
    throw new Error("Role Not Found");
  }

  return role;
};

export const deleteRole = async (id: string) => {
  const role = await Role.findByIdAndDelete(id);

  if (!role) {
    throw new Error("Role Not Found");
  }

  const userCount = await User.countDocuments({ roleId: id });

  if (userCount > 0) {
    throw new Error("Cannot Delete Role Because It Is Used By User")
  }

  return { message: "Role Deleted Successfully" };
};

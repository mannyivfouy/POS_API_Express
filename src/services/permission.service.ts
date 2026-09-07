import RolePermission from "../models/Role-Permission";
import Permission from "../models/Permission";

export const getRolePermissions = async (roleId: any) => {
  const rolePermissions = await RolePermission.find({
    roleId,
  }).populate({
    path: "permissionId",
    model: Permission,
  });

  return rolePermissions
    .map((rolePermission: any) => rolePermission.permissionId?.name)
    .filter(Boolean);
};
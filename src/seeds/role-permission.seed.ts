import Role from "../models/Role";
import Permission from "../models/Permission";
import RolePermission from "../models/Role-Permission";

const rolePermissions = {
  Admin: [
    "dashboard.view",

    "user.view",
    "user.create",
    "user.update",
    "user.delete",

    "product.view",
    "product.create",
    "product.update",
    "product.delete",

    "category.view",
    "category.create",
    "category.update",
    "category.delete",

    "stock.view",
    "stock.adjust",

    "purchase.view",
    "purchase.create",
    "purchase.update",
    "purchase.delete",

    "sale.view",
    "sale.create",
    "sale.cancel",
    "sale.refund",

    "customer.view",
    "customer.create",
    "customer.update",
    "customer.delete",
  ],

  Manager: [
    "dashboard.view",

    "user.view",

    "product.view",
    "product.create",
    "product.update",
    "product.delete",

    "category.view",
    "category.create",
    "category.update",
    "category.delete",

    "stock.view",
    "stock.adjust",

    "purchase.view",
    "purchase.create",
    "purchase.update",
    "purchase.delete",

    "sale.view",
    "sale.cancel",
    "sale.refund",
  ],

  Cashier: [
    "dashboard.view",

    "product.view",

    "category.view",

    "stock.view",

    "sale.view",
    "sale.create",
  ],
};

export const seedRolePermissions = async () => {
  for (const [roleName, permissionNames] of Object.entries(rolePermissions)) {
    const role = await Role.findOne({ name: roleName });

    if (!role) {
      console.warn(`Role not found: ${roleName}`);
      continue;
    }

    for (const permissionName of permissionNames) {
      const permission = await Permission.findOne({
        name: permissionName,
      });

      if (!permission) {
        console.warn(`Permission not found: ${permissionName}`);
        continue;
      }

      await RolePermission.updateOne(
        {
          roleId: role._id,
          permissionId: permission._id,
        },
        {
          $set: {
            roleId: role._id,
            permissionId: permission._id,
          },
        },
        {
          upsert: true,
        },
      );
    }
  }

  console.log("Role permissions seeded successfully");
};

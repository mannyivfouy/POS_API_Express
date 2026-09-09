import Permission from "../models/Permission";

const permissions = [
  // Dashboard
  {
    name: "dashboard.view",
    module: "dashboard",
    action: "view",
    description: "View dashboard",
  },

  // Users
  {
    name: "user.view",
    module: "user",
    action: "view",
    description: "View users",
  },
  {
    name: "user.create",
    module: "user",
    action: "create",
    description: "Create users",
  },
  {
    name: "user.update",
    module: "user",
    action: "update",
    description: "Update users",
  },
  {
    name: "user.delete",
    module: "user",
    action: "delete",
    description: "Delete users",
  },

  // Products
  {
    name: "product.view",
    module: "product",
    action: "view",
    description: "View products",
  },
  {
    name: "product.create",
    module: "product",
    action: "create",
    description: "Create products",
  },
  {
    name: "product.update",
    module: "product",
    action: "update",
    description: "Update products",
  },
  {
    name: "product.delete",
    module: "product",
    action: "delete",
    description: "Delete products",
  },

  // Categories
  {
    name: "category.view",
    module: "category",
    action: "view",
    description: "View categories",
  },
  {
    name: "category.create",
    module: "category",
    action: "create",
    description: "Create categories",
  },
  {
    name: "category.update",
    module: "category",
    action: "update",
    description: "Update categories",
  },
  {
    name: "category.delete",
    module: "category",
    action: "delete",
    description: "Delete categories",
  },

  // Stock
  {
    name: "stock.view",
    module: "stock",
    action: "view",
    description: "View stock",
  },
  {
    name: "stock.adjust",
    module: "stock",
    action: "adjust",
    description: "Adjust stock",
  },

  // Purchases
  {
    name: "purchase.view",
    module: "purchase",
    action: "view",
    description: "View purchases",
  },
  {
    name: "purchase.create",
    module: "purchase",
    action: "create",
    description: "Create purchases",
  },
  {
    name: "purchase.update",
    module: "purchase",
    action: "update",
    description: "Update purchases",
  },
  {
    name: "purchase.delete",
    module: "purchase",
    action: "delete",
    description: "Delete purchases",
  },

  // Sales
  {
    name: "sale.view",
    module: "sale",
    action: "view",
    description: "View sales",
  },
  {
    name: "sale.create",
    module: "sale",
    action: "create",
    description: "Create sales",
  },
  {
    name: "sale.cancel",
    module: "sale",
    action: "cancel",
    description: "Cancel sales",
  },
  {
    name: "sale.refund",
    module: "sale",
    action: "refund",
    description: "Refund sales",
  },

  // Customer
  {
    name: "customer.create",
    module: "customer",
    action: "create",
    description: "Create customer",
  },
  {
    name: "customer.view",
    module: "customer",
    action: "view",
    description: "View customers",
  },
  {
    name: "customer.update",
    module: "customer",
    action: "update",
    description: "Update customer",
  },
  {
    name: "customer.delete",
    module: "customer",
    action: "delete",
    description: "Delete customer",
  },
];

export const seedPermissions = async () => {
  try {
    for (const permission of permissions) {
      await Permission.updateOne(
        { name: permission.name },
        { $set: permission },
        { upsert: true },
      );
    }
  } catch (error) {
    console.error("Failed to seed permissions : ", error);
    throw error;
  }
};

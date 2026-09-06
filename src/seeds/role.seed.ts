import Role from "../models/Role";

const roles = [
  {
    name: "Admin",
    description: "Full system access",
    isSystem: true,
  },
  {
    name: "Manager",
    description: "Manage products, purchases and sales",
    isSystem: true,
  },
  {
    name: "Cashier",
    description: "Handle sales and customer transactions",
    isSystem: true,
  },
];

export const seedRoles = async () => {
  for (const role of roles) {
    await Role.updateOne({ name: role.name }, { $set: role }, { upsert: true });
  }

  console.log("Roles seeded successfully");
};

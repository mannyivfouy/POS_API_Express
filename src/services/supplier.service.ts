import Supplier from "../models/Supplier";
import { paginate } from "../utils/query";
import { calculateTrend } from "../utils/trend";

export const createSupplier = async (data: any) => {
  const existingPhone = await Supplier.findOne({ phone: data.phone });
  const existingEmail = await Supplier.findOne({ email: data.email });

  if (existingPhone) {
    throw {
      field: "phone",
      message: "Phone already exists",
    };
  }

  if (existingEmail) {
    throw {
      field: "email",
      message: "Email already exists",
    };
  }

  const supplier = await Supplier.create(data);
  return supplier;
};

export const getSuppliers = async (query: any) => {
  return paginate({
    model: Supplier,
    query,
    searchFields: ["name", "contactPerson", "phone", "email"],
    allowedFilters: ["status"],
  });
};

export const getSupplierById = async (id: string) => {
  const supplier = await Supplier.findById(id);

  if (!supplier) {
    throw new Error("Supplier Not Found");
  }

  return supplier;
};

export const updateSupplier = async (id: string, data: any) => {
  const supplier = await Supplier.findByIdAndUpdate(id, data, { new: true });

  if (!supplier) {
    throw new Error("Supplier Not Found");
  }

  return supplier;
};

export const deleteSupplier = async (id: string) => {
  const supplier = await Supplier.findByIdAndDelete(id);

  if (!supplier) {
    throw new Error("Supplier Not Found");
  }

  return { message: "Supplier Deleted Successfully" };
};

export const getSupplierStats = async () => {
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const totalSupplier = await Supplier.countDocuments();
  const activeSupplier = await Supplier.countDocuments({
    status: "active",
  });
  const inactiveSupplier = await Supplier.countDocuments({
    status: "inactive",
  });

  // Total suppliers created this month
  const currentMonthSuppliers = await Supplier.countDocuments({
    createdAt: {
      $gte: currentMonthStart,
    },
  });

  const previousMonthSuppliers = await Supplier.countDocuments({
    createdAt: {
      $gte: previousMonthStart,
      $lt: currentMonthStart,
    },
  });

  // Active Suppliers created this month
  const currentMonthActiveSuppliers = await Supplier.countDocuments({
    status: "active",
    createdAt: {
      $gte: currentMonthStart,
    },
  });

  const previousMonthActiveSuppliers = await Supplier.countDocuments({
    status: "active",
    createdAt: {
      $gte: previousMonthStart,
      $lt: currentMonthStart,
    },
  });

  // Inactive Suppliers created this month
  const currentMonthInactiveSuppliers = await Supplier.countDocuments({
    status: "inactive",
    createdAt: {
      $gte: currentMonthStart,
    },
  });

  const previousMonthInactiveSuppliers = await Supplier.countDocuments({
    status: "inactive",
    createdAt: {
      $gte: previousMonthStart,
      $lt: currentMonthStart,
    },
  });

  return {
    totalSupplier,
    activeSupplier,
    inactiveSupplier,
    totalSupplierTrend: calculateTrend(
      currentMonthSuppliers,
      previousMonthSuppliers,
    ),
    activeSupplierTrend: calculateTrend(
      currentMonthActiveSuppliers,
      previousMonthActiveSuppliers
    ),
    inactiveSupplierTrend: calculateTrend(
      currentMonthInactiveSuppliers,
      previousMonthInactiveSuppliers
    )
  };
};

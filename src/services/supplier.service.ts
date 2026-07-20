import Supplier from "../models/Supplier";
import { paginate } from "../utils/query";

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
  const totalSupplier = await Supplier.countDocuments();
  const activeSupplier = await Supplier.countDocuments({
    status: "active",
  });
  const inactiveSupplier = await Supplier.countDocuments({
    status: "inactive",
  });

  return {
    totalSupplier,
    activeSupplier,
    inactiveSupplier,
  };
};

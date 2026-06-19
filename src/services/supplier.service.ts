import Supplier from "../models/Supplier";

export const createSupplier = async (data: any) => {
  const existingPhone = await Supplier.findOne({ phone: data.phone });
  const existingEmail = await Supplier.findOne({ email: data.email });
  
  if (existingPhone) {
    throw new Error("Phone Already Exists");
  }

  if (existingEmail) {
    throw new Error("Email Already Exists");
  }

  const supplier = await Supplier.create(data);
  return supplier;
};

export const getSuppliers = async () => {
  const supplier = await Supplier.find();
  return supplier;
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

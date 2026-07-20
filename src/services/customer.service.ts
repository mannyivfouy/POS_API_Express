import Customer from "../models/Customer";
import { paginate } from "../utils/query";

export const createCustomer = async (data: any) => {
  const existingCustomer = await Customer.findOne({ phone: data.phone });
  if (existingCustomer) {
    throw {
      field : 'phone',
      message : 'This phone number already used by another customer'
    }
  }

  const customer = await Customer.create(data);
  return customer;
};

export const getCustomers = async (query: any) => {
  return paginate({
    model: Customer,
    query,
    searchFields: ["name", "phone"],    
  })
};

export const getCustomerById = async (id: string) => {
  const customer = await Customer.findById(id);

  if (!customer) {
    throw new Error("Customer Not Found");
  }

  return customer;
};

export const updateCustomer = async (id: string, data: any) => {
  const customer = await Customer.findByIdAndUpdate(id, data, { new: true });

  if (!customer) {
    throw new Error("Customer Not Found");
  }

  return customer;
};

export const deleteCustomer = async (id: string) => {
  const customer = await Customer.findByIdAndDelete(id);

  if (!customer) {
    throw new Error("Customer Not Found");
  }

  return { message: "Customer Deleted Successfully" };
};

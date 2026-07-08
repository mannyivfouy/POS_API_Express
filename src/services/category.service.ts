import Category from "../models/Category";
import Product from "../models/Product";
import { paginate } from "../utils/query";

export const createCategory = async (data: any) => {
  const existingCategory = await Category.findOne({ name: data.name });
  if (existingCategory) {
    throw new Error("Category Already Exists");
  }

  const category = await Category.create(data);

  return category;
};

export const getCategories = async (query: any) => {
  return paginate({
    model: Category,
    query,
    searchFields: ["name", "description"],
    allowedFilters: ['status'],    
  })
};

export const getCategoryById = async (id: string) => {
  const category = await Category.findById(id);

  if (!category) {
    throw new Error("Category Not Found");
  }

  return category;
};

export const updateCategory = async (id: string, data: any) => {
  const category = await Category.findByIdAndUpdate(id, data, { new: true });

  if (!category) {
    throw new Error("Catgory Not Found");
  }

  if (data.status) {
    await Product.updateMany(
      { categoryId: id },
      { $set: { status: data.status } },
    );
  }

  return category;
};

export const deleteCategory = async (id: string) => {
  const category = await Category.findById(id);

  if (!category) {
    throw new Error("Category Not Found");
  }

  const hasProduct = await Product.exists({ categoryId: id });

  if (hasProduct) {
    throw new Error(
      "Cannot Delete Category Because It Is Assing To One or More Products",
    );
  }

  await Category.findByIdAndDelete(id);

  return { message: "Category Deleted Successfully" };
};

import Category from "../models/Category";

export const createCategory = async (data: any) => {
  const existingCategory = await Category.findOne({ name: data.name });
  if (existingCategory) {
    throw new Error("Category Already Exists");
  }

  const category = await Category.create(data);

  return category;
};

export const getCategories = async () => {
  const category = await Category.find();
  return category;
};

export const getCategoryById = async (id: String) => {
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

  return category;
};

export const deleteCategory = async (id: string) => {
  const category = await Category.findByIdAndDelete(id);

  if (!category) {
    throw new Error("Category Not Found");
  }

  return { message: "Category Deleted Successfully" };
};

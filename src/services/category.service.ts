import Category from "../models/Category";
import Product from "../models/Product";
import { paginate } from "../utils/query";
import { calculateTrend } from "../utils/trend";

export const createCategory = async (data: any) => {
  const existingCategory = await Category.findOne({ name: data.name });
  if (existingCategory) {
    throw {
      field: "name",
      message: "Category already exists",
    };
  }

  const category = await Category.create(data);

  return category;
};

export const getCategories = async (query: any) => {
  const result = await paginate({
    model: Category,
    query,
    searchFields: ["name", "description"],
    allowedFilters: ["status"],
  });

  const categoryIds = result.data.map((category: any) => category._id);

  const productCounts = await Product.aggregate([
    {
      $match: {
        categoryId: { $in: categoryIds },
        status: "active",
      },
    },
    {
      $group: {
        _id: "$categoryId",
        count: { $sum: 1 },
      },
    },
  ]);

  const countMap = new Map(
    productCounts.map((item: any) => [
      item._id.toString(),
      item.count,
    ])
  );

  result.data = result.data.map((category: any) => ({
    ...category.toObject(),
    activeProductCount: countMap.get(category._id.toString()) || 0,
  }));

  return result;
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
    throw new Error("Category Not Found");
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
    throw {
      status: 404,
      message: "Category Not Found",
    };
  }

  const hasProduct = await Product.exists({ categoryId: id });

  if (hasProduct) {
    throw {
      status: 409,
      field: "category",
      message:
        "Cannot Delete Category Because It Is Assign To One or More Products",
    };
  }

  await Category.findByIdAndDelete(id);

  return { message: "Category Deleted Successfully" };
};

export const getCategoryStats = async () => {
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const totalCategory = await Category.countDocuments();
  const activeCategory = await Category.countDocuments({
    status: "active",
  });
  const inactiveCategory = await Category.countDocuments({
    status: "inactive",
  });

  // Total Categorys created this month
  const currentMonthCategories = await Category.countDocuments({
    createdAt: {
      $gte: currentMonthStart,
      $lt: nextMonthStart,
    },
  });

  const previousMonthCategories = await Category.countDocuments({
    createdAt: {
      $gte: previousMonthStart,
      $lt: nextMonthStart,
    },
  });

  // Active Categorys created this month
  const currentMonthActiveCategories = await Category.countDocuments({
    status: "active",
    createdAt: {
      $gte: currentMonthStart,
      $lt: nextMonthStart,
    },
  });

  const previousMonthActiveCategories = await Category.countDocuments({
    status: "active",
    createdAt: {
      $gte: previousMonthStart,
      $lt: currentMonthStart,
    },
  });

  // Inactive Categorys created this month
  const currentMonthInactiveCategories = await Category.countDocuments({
    status: "inactive",
    createdAt: {
      $gte: currentMonthStart,
      $lt: nextMonthStart,
    },
  });

  const previousMonthInactiveCategories = await Category.countDocuments({
    status: "inactive",
    createdAt: {
      $gte: previousMonthStart,
      $lt: currentMonthStart,
    },
  });

  return {
    totalCategory,
    activeCategory,
    inactiveCategory,
    totalCategoryTrend: calculateTrend(
      currentMonthCategories,
      previousMonthCategories,
    ),

    activeCategoryTrend: calculateTrend(
      currentMonthActiveCategories,
      previousMonthActiveCategories,
    ),

    inactiveCategoryTrend: calculateTrend(
      currentMonthInactiveCategories,
      previousMonthInactiveCategories,
    ),
  };
};


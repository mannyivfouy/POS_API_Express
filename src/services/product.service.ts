import Product from "../models/Product";
import Category from "../models/Category";
import { deleteFile, moveFile } from "../utils/file";
import { paginate } from "../utils/query";
import Supplier from "../models/Supplier";
import { calculateTrend } from "../utils/trend";

export const createProduct = async (data: any) => {
  const category = await Category.findById(data.categoryId);
  const supplier = await Supplier.findById(data.supplierId);

  if (data.barcode) {
    const existingBarcode = await Product.findOne({
      barcode: data.barcode,
    });

    if (existingBarcode) {
      throw {
        field: "barcode",
        message: "Barcode already exists",
      };
    }
  }

  if (data.sku) {
    const existingSku = await Product.findOne({
      sku: data.sku,
    });

    if (existingSku) {
      throw {
        field: "sku",
        message: "SKU already exists",
      };
    }
  }

  if (!category) {
    throw new Error("Category Not Found");
  }

  if (category.status === "inactive") {
    throw new Error("Cannot Create Product In An Inactive Category");
  }

  if (!supplier) {
    throw new Error("Suppler Not Found");
  }

  if (supplier.status === "inactive") {
    throw new Error("Cannot Create Product In An Inactive Supplier");
  }

  const product = await Product.create(data);

  return product;
};

export const getProducts = async (query: any) => {
  return paginate({
    model: Product,
    query,
    searchFields: ["name", "description"],
    allowedFilters: ["status", "categoryId", "supplierId"],
    populate: ["categoryId", "supplierId"],
  });
};

export const getProductById = async (id: string) => {
  const product = await Product.findById(id)
    .populate("categoryId", "name status")
    .populate("supplierId", "name contactPerson phone");

  if (!product) {
    throw new Error("Product Not Found");
  }

  return product;
};

export const updateProduct = async (
  id: string,
  data: any,
  file?: Express.Multer.File,
) => {
  const product = await Product.findById(id);

  if (!product) {
    throw new Error("Product Not Found");
  }

  if (data.categoryId) {
    const category = await Category.findById(data.categoryId);

    if (!category) {
      throw new Error("Category Not Found");
    }

    if (category.status === "inactive") {
      throw new Error("Cannot Assign Product To An inactive Category");
    }
  }

  if (data.barcode && data.barcode !== product.barcode) {
    const existingProduct = await Product.findOne({
      barcode: data.barcode,
      _id: { $ne: id },
    });

    if (existingProduct) {
      throw new Error("Barcode Already Exists");
    }
  }

  if (file) {
    if (product.image) {
      deleteFile(product.image);
    }

    data.image = moveFile(file, "products");
  }

  const updatedProduct = await Product.findByIdAndUpdate(id, data, {
    new: true,
  });

  return updatedProduct;
};

export const deleteProduct = async (id: string) => {
  const product = await Product.findById(id);

  if (!product) {
    throw new Error("Product Not Found");
  }

  if (product.image) {
    deleteFile(product.image);
  }

  await Product.findByIdAndDelete(id);

  return { message: "Product Deleted Successfully" };
};

export const getProductStats = async () => {
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  // Count
  const totalProduct = await Product.countDocuments();
  const activeProduct = await Product.countDocuments({
    status: "active",
  });
  const inactiveProduct = await Product.countDocuments({
    status: "inactive",
  });

  // Total products created this month
  const currentMonthProducts = await Product.countDocuments({
    createdAt: {
      $gte: currentMonthStart,
      $lt: nextMonthStart,
    },
  });

  const previousMonthProducts = await Product.countDocuments({
    createdAt: {
      $gte: previousMonthStart,
      $lt: nextMonthStart,
    },
  });

  // Active products this month
  const currentMonthActiveProducts = await Product.countDocuments({
    status: "active",
    createdAt: {
      $gte: currentMonthStart,
      $lt: nextMonthStart,
    },
  });

  const previousMonthActiveProducts = await Product.countDocuments({
    status: "active",
    createdAt: {
      $gte: previousMonthStart,
      $lt: currentMonthStart,
    },
  });

  // Inactive products this month
  const currentMonthInactiveProducts = await Product.countDocuments({
    status: "active",
    createdAt: {
      $gte: currentMonthStart,
      $lt: nextMonthStart,
    },
  });

  const previousMonthInactiveProducts = await Product.countDocuments({
    status: "active",
    createdAt: {
      $gte: previousMonthStart,
      $lt: currentMonthStart,
    },
  });

  return {
    totalProduct,
    activeProduct,
    inactiveProduct,
    totalProductTrend: calculateTrend(
      currentMonthProducts,
      previousMonthProducts,
    ),
    activeProductTrend: calculateTrend(
      currentMonthActiveProducts,
      previousMonthActiveProducts,
    ),
    inactiveProductTrend: calculateTrend(
      currentMonthInactiveProducts,
      previousMonthInactiveProducts,
    ),
  };
};

export const getLowStockProduct = async () => {
  return Product.find({
    $expr: {
      $lte: ["$stockQty", "$lowStockAlert"],
    },
  });
};

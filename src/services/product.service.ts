import Product from "../models/Product";
import Category from "../models/Category";
import { deleteFile, moveFile } from "../utils/file";
import { paginate } from "../utils/query";

export const createProduct = async (data: any) => {
  const category = await Category.findById(data.categoryId);

  if (!category) {
    throw new Error("Category Not Found");
  }

  if (category.status === "inactive") {
    throw new Error("Cannot Create Product In An Inactive Category");
  }

  if (data.barcode) {
    const existingProduct = await Product.findOne({
      barcode: data.barcode,
    });

    if (existingProduct) {
      throw new Error("Barcode Already Exists");
    }
  }

  const product = await Product.create(data);

  return product;
};

export const getProducts = async (query: any) => {
  return paginate({
    model: Product,
    query,
    searchFields: ["name", "description"],
    allowedFilters: ["status, categoryId"],
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
  const totalProduct = await Product.countDocuments();
  const activeProduct = await Product.countDocuments({
    status: "active",
  });
  const inactiveProduct = await Product.countDocuments({
    status: "inactive",
  });

  return {
    totalProduct,
    activeProduct,
    inactiveProduct,
  };
};

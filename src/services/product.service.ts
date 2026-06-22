import Product from "../models/Product";
import { deleteFile, moveFile } from "../utils/file";

export const createProduct = async (data: any) => {
  if (data.barcode) {
    const existingProduct = await Product.findOne({ barcode: data.barcode });

    if (existingProduct) {
      throw new Error("Barcode Already Exists");
    }
  }

  const product = await Product.create({ ...data });

  return product;
};

export const getProducts = async () => {
  const products = await Product.find()
    .populate("categoryId", "name")
    .populate("supplierId", "name contactPerson phone");
  return products;
};

export const getProductById = async (id: string) => {
  const product = await Product.findById(id)
    .populate("categoryId", "name")
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

  if (file) {
    if (product.image) {
      deleteFile(product.image);
    }
    data.image = moveFile(file, "products");
  }

  const updateProduct = await Product.findByIdAndUpdate(id, data, {
    new: true,
  });

  return updateProduct;
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

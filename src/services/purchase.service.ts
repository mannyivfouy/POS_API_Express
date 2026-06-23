import mongoose from "mongoose";
import Product from "../models/Product";
import Purchase from "../models/Purchase";
import PurchaseItem from "../models/PurchaseItem";
import Supplier from "../models/Supplier";
import { generateInvoice } from "../utils/generateInvoiceNo";

export const createPurchase = async (data: any) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const supplier = await Supplier.findById(data.supplierId).session(session);
    if (!supplier) {
      throw new Error("Supplier Not Found");
    }

    if (!data.items || data.items.length === 0) {
      throw new Error("Purchase Items Are Required");
    }

    const invoiceNo = await generateInvoice("purchase");
    let subtotal = 0;

    const pruchaseArr = await Purchase.create(
      [
        {
          invoiceNo,
          supplierId: data.supplierId,
          purchaseDate: data.purchaseDate || new Date(),
          subtotal: 0,
          discount: data.discount || 0,
          tax: data.tax || 0,
          shipping: data.shipping || 0,
          total: 0,
          paymentStatus: data.paymentStatus || "pending",
          note: data.note,
          createdBy: data.createdBy,
        },
      ],
      { session },
    );

    const purchase = pruchaseArr[0];

    for (const item of data.items) {
      const product = await Product.findById(item.productId).session(session);

      if (!product) {
        throw new Error(`Product Not Found: ${item.productId}`);
      }

      if (item.quantity <= 0) {
        throw new Error("Quantity Must Be Greater Then 0");
      }

      const lineTotal = item.quantity * item.costPrice;
      subtotal += lineTotal;

      await PurchaseItem.create(
        [
          {
            purchaseId: purchase._id,
            productId: product._id,
            quantity: item.quantity,
            costPrice: item.costPrice,
            total: lineTotal,
          },
        ],
        {
          session,
        },
      );

      product.stockQty += item.quantity;
      product.costPrice = item.costPrice;

      await product.save({ session });
    }

    const discount = data.discount || 0;
    const tax = data.tax || 0;
    const shipping = data.shipping || 0;

    const total = subtotal - discount + tax + shipping;

    purchase.subtotal = subtotal;
    purchase.total = total;

    await purchase.save({ session });

    await session.commitTransaction();
    session.endSession();

    return purchase;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const getPurchases = async () => {
  const purchases = await Purchase.find()
    .populate("supplierId", "name contactPerson")
    .populate("createdBy", "username fullname")
    .sort({ createdAt: -1 });

  return purchases;
};

export const getPurchaseById = async (id: string) => {
  const purchase = await Purchase.findById(id)
    .populate("supplierId", "name contactPerson")
    .populate("createdBy", "username fullname");

  if (!purchase) {
    throw new Error("Purchase Not Found");
  }

  const items = await PurchaseItem.find({ purchaseId: id }).populate(
    "productId",
  );

  return { purchase, items };
};

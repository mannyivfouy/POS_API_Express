import Product from "../models/Product";
import Purchase from "../models/Purchase";
import PurchaseItem from "../models/PurchaseItem";
import Supplier from "../models/Supplier";
import { generateInvoice } from "../utils/generateInvoiceNo";
import { paginate } from "../utils/query";

export const createPurchase = async (data: any) => {
  try {
    // 1. Check supplier
    const supplier = await Supplier.findById(data.supplierId);
    if (!supplier) {
      throw new Error("Supplier not found");
    }

    if (supplier.status === 'inactive'){
      throw new Error("Supplier inactive cannot make purchase");
    }

    // 2. Check items
    if (!data.items || data.items.length === 0) {
      throw new Error("Purchase items are required");
    }

    // 3. Generate invoice
    const invoiceNo = await generateInvoice("purchase");

    let subtotal = 0;

    // 4. Create purchase header
    const purchase = await Purchase.create({
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
    });

    // 5. Loop items
    for (const item of data.items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      if (item.quantity <= 0) {
        throw new Error("Quantity must be greater than 0");
      }

      const lineTotal = item.quantity * item.costPrice;
      subtotal += lineTotal;

      // 6. Create purchase item
      await PurchaseItem.create({
        purchaseId: purchase._id,
        productId: product._id,
        quantity: item.quantity,
        costPrice: item.costPrice,
        total: lineTotal,
      });

      // 7. Update product stock
      product.stockQty += Number(item.quantity);

      // 8. Update cost price
      product.costPrice = item.costPrice;

      await product.save();
    }

    // 9. Calculate totals
    const discount = data.discount || 0;
    const tax = data.tax || 0;
    const shipping = data.shipping || 0;

    const total = subtotal - discount + tax + shipping;

    purchase.subtotal = subtotal;
    purchase.total = total;

    await purchase.save();

    return purchase;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getPurchases = async (query: any) => {
  return paginate({
    model: Purchase,
    query,
    searchFields: ["invoiceNo", "paymentStatus", "note"],
    allowedFilters: ["paymentStatus"],
    populate: [
      {
        path: "supplierId",
        select: "name contactPerson",
      },
      {
        path: "createdBy",
        select: "username fullname",
      },
    ],
  });
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

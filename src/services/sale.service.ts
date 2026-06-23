import Product from "../models/Product";
import Sale from "../models/Sale";
import SaleItem from "../models/SaleItem";
import Customer from "../models/Customer";
import { generateInvoice } from "../utils/generateInvoiceNo";

export const createSale = async (data: any) => {
  try {
    let customerId = data.customerId || null;

    if (!customerId && data.customer) {
      const newCustomer = await Customer.create({
        name: data.customer.name || "Walk-in Customer",
        phone: data.customer.phone || "",
      });
      customerId = newCustomer._id;
    }

    // Validate Items
    if (!data.items || data.items.length === 0) {
      throw new Error("Sale Items Are Required");
    }

    // Generate Invoice
    const invoiceNo = await generateInvoice("sale");

    let subtotal = 0;

    // Create Sale Header
    const sale = await Sale.create({
      invoiceNo,
      customerId,
      saleDate: new Date(),

      subtotal: 0,
      discount: data.discount || 0,
      tax: data.tax || 0,
      total: 0,

      paymentStatus: data.paymentStatus || "PENDING",
      note: data.note || "",
      createdBy: data.createdBy,
    });

    // Process Item
    for (const item of data.items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        throw new Error(`Product Not Found: ${item.productId}`);
      }

      const quantity = Number(item.quantity);
      const sellingPrice = Number(item.sellingPrice);

      if (quantity <= 0) {
        throw new Error("Quantity Must Be Greater Then 0");
      }

      // Check Stock
      if (product.stockQty < quantity) {
        throw new Error(
          `Not Enought Stock For ${product.name}. Available Only ${product.stockQty}`,
        );
      }

      const lineTotal = quantity * sellingPrice;
      subtotal += lineTotal;

      // Craete Sale Item
      await SaleItem.create({
        saleId: sale._id,
        productId: product._id,
        quantity,
        sellingPrice,
        total: lineTotal,
      });

      product.stockQty -= quantity;
      await product.save();
    }

    // Calculate Total
    const discount = Number(data.discount || 0);
    const tax = Number(data.tax || 0);

    const total = subtotal - discount + tax;

    sale.subtotal = subtotal;
    sale.total = total;

    await sale.save();

    return sale;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getSales = async () => {
  const sales = await Sale.find()
    .populate("customerId", "name phone")
    .populate("createdBy", "username fullname")
    .sort({ createdAt: -1 });

  return sales;
};

export const getSaleById = async (id: string) => {
  const sale = await Sale.findById(id);

  if (!sale) {
    throw new Error("Sale Not Found");
  }

  const items = await SaleItem.find({
    saleId: id,
  }).populate("productId");

  return { sale, items };
};

import Product from "../models/Product";
import Sale from "../models/Sale";
import SaleItem from "../models/SaleItem";
import Customer from "../models/Customer";
import { generateInvoice } from "../utils/generateInvoiceNo";
import { sendTelegramMessage } from "./telegram.service";
import { paginate } from "../utils/query";
import { calculateTrend } from "../utils/trend";
import { createBakongPayment, checkBakongPayment } from "./payment.service";

export const preparedSalePayment = async (data: any) => {
  try {
    if (!data.items || data.items.length === 0) {
      throw new Error("Sale Items Are Required");
    }

    let customerId = data.customerId || null;

    if (!customerId && data.customer) {
      const newCustomer = await Customer.create({
        name: data.customer.name || "Walk-in Customer",
        phone: data.customer.phone || "",
      });

      customerId = newCustomer._id;
    }

    let subtotal = 0;

    for (const item of data.items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        throw new Error(`Product Not Found : ${item.productId}`);
      }

      const quantity = Number(item.quantity);
      const sellingPrice = Number(item.sellingPrice);

      if (quantity <= 0) {
        throw new Error("Quantity Must Be Greater Than 0");
      }

      if (product.stockQty < quantity) {
        throw new Error(
          `Not Enough Stock For ${product.name}. Available Only ${product.stockQty}`,
        );
      }

      subtotal += quantity * sellingPrice;
    }

    const discount = Number(data.discount || 0);
    const tax = Number(data.tax || 0);

    const total = subtotal - discount + tax;

    if (total <= 0) {
      throw new Error("Sale Total Must Be Greater Than 0");
    }

    // Generate Invoice
    const invoiceNo = await generateInvoice("sale");

    // Generate Bakong KHQR
    const payment = await createBakongPayment(total, invoiceNo);

    return {
      invoiceNo,
      customerId,
      items: data.items,
      subtotal,
      discount,
      tax,
      total,
      qr: payment.qr,
      md5: payment.md5,
    };
  } catch (err: any) {
    throw new Error(err.message);
  }
};

export const completeSale = async (data: any, md5: string) => {
  try {
    if (!data.invoiceNo) {
      throw new Error("Invoice Number Is Required");
    }

    // Validate Items
    if (!data.items || data.items.length === 0) {
      throw new Error("Sale Items Are Required");
    }

    // Verify Bakong Payment
    await checkBakongPayment(md5, Number(data.total));

    // Create Sale Header
    const sale = await Sale.create({
      invoiceNo: data.invoiceNo,
      customerId: data.customerId || null,
      saleDate: new Date(),

      subtotal: Number(data.subtotal),
      discount: Number(data.discount || 0),
      tax: Number(data.tax || 0),
      total: Number(data.total),

      paymentMethod: "bakongKHQR",
      paymentStatus: "paid",

      note: data.note || "",
      createdBy: data.createdBy,
    });

    const itemLines: {
      name: string;
      quantity: number;
      total: number;
    }[] = [];

    // Create Sale Items & Reduce Stock
    for (const item of data.items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        throw new Error(`Product Not Found: ${item.productId}`);
      }

      const quantity = Number(item.quantity);
      const sellingPrice = Number(item.sellingPrice);

      // Check stock again
      if (product.stockQty < quantity) {
        throw new Error(
          `Not Enough Stock For ${product.name}. Available Only ${product.stockQty}`,
        );
      }

      const lineTotal = quantity * sellingPrice;

      itemLines.push({
        name: product.name,
        quantity,
        total: lineTotal,
      });

      // Create Sale Item
      await SaleItem.create({
        saleId: sale._id,
        productId: product._id,
        quantity,
        sellingPrice,
        total: lineTotal,
      });

      // Reduce Stock
      product.stockQty -= quantity;
      await product.save();
    }

    // Send Telegram Notification
    await sendTelegramMessage(
      `🟢 <b>NEW SALE CREATED</b>
        ━━━━━━━━━━━━━━━━━━━━━━━

        🧾 <b>Invoice:</b> ${sale.invoiceNo}
        📅 <b>Date:</b> ${new Date().toLocaleString()}

        📦 <b>Items:</b>
        ${itemLines
          .map(
            (item) =>
              `  • ${item.name} x${item.quantity} — $${item.total.toFixed(2)}`,
          )
          .join("\n")}

        ━━━━━━━━━━━━━━━━━━━━━━━
        💵 Subtotal:   $${sale.subtotal.toFixed(2)}
        📉 Discount:   $${sale.discount.toFixed(2)}
        🧾 Tax:        $${sale.tax.toFixed(2)}
        💰 <b>Total:     $${sale.total.toFixed(2)}</b>

        💳 <b>Payment:</b> ✅ Paid

        ━━━━━━━━━━━━━━━━━━━━━━━
      `,
    );

    return sale;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

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

      paymentStatus: data.paymentStatus || "pending",
      note: data.note || "",
      createdBy: data.createdBy,
    });

    const itemLines: { name: string; quantity: number; total: number }[] = [];

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

      itemLines.push({
        name: product.name,
        quantity,
        total: lineTotal,
      });

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

    await sendTelegramMessage(
      `🟢 <b>NEW SALE CREATED</b>
    ━━━━━━━━━━━━━━━━━━━━━━━━

    🧾 <b>Invoice:</b> ${sale.invoiceNo}
    📅 <b>Date:</b> ${new Date().toLocaleString()}

    📦 <b>Items:</b>
    ${itemLines.map((item) => `  • ${item.name} x${item.quantity} — $${item.total.toFixed(2)}`).join("\n")}

    ━━━━━━━━━━━━━━━━━━━━━━━━
    💵 Subtotal:   $${subtotal.toFixed(2)}
    📉 Discount:   $${discount.toFixed(2)}
    🧾 Tax:        $${tax.toFixed(2)}
    💰 <b>Total:     $${sale.total.toFixed(2)}</b>

    💳 <b>Payment:</b> ${sale.paymentStatus === "paid" ? "✅ Paid" : sale.paymentStatus === "pending" ? "⏳ Pending" : "❌ Unpaid"}
    ━━━━━━━━━━━━━━━━━━━━━━━━`,
    );

    return sale;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getSales = async (query: any) => {
  return paginate({
    model: Sale,
    query,
    searchFields: ["invoiceNo", "paymentStatus", "note"],
    allowedFilters: ["paymentStatus"],
    populate: [
      {
        path: "createdBy",
        select: "fullname",
      },
      {
        path: "customerId",
        select: "name phone",
      },
    ],
  });
};

export const getSaleById = async (id: string) => {
  const sale = await Sale.findById(id)
    .populate("createdBy", "fullname")
    .populate("customerId", "name phone");

  if (!sale) {
    throw new Error("Sale Not Found");
  }

  const items = await SaleItem.find({
    saleId: id,
  }).populate("productId", "name barcode sellingPrice image unit");

  return { sale, items };
};

export const getSaleStats = async () => {
  const now = new Date();

  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  // ===== ALL TIME STATS =====

  const totalSales = await Sale.countDocuments();

  const salesRevenueResult = await Sale.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: {
          $sum: "$total",
        },
      },
    },
  ]);

  const totalSalesRevenue = salesRevenueResult[0]?.totalRevenue || 0;

  const productsSoldResult = await SaleItem.aggregate([
    {
      $group: {
        _id: null,
        totalProducts: {
          $sum: "$quantity",
        },
      },
    },
  ]);

  const totalProductsSold = productsSoldResult[0]?.totalProducts || 0;

  const totalAverageSale =
    totalSales > 0 ? Math.round(totalSalesRevenue / totalSales) : 0;

  // ===== CURRENT MONTH =====

  const currentSalesResult = await Sale.aggregate([
    {
      $match: {
        saleDate: {
          $gte: currentMonthStart,
          $lt: nextMonthStart,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalSales: {
          $sum: 1,
        },
        totalRevenue: {
          $sum: "$total",
        },
        averageSale: {
          $avg: "$total",
        },
      },
    },
  ]);

  const currentProductsResult = await SaleItem.aggregate([
    {
      $lookup: {
        from: "sales",
        localField: "saleId",
        foreignField: "_id",
        as: "sale",
      },
    },
    {
      $unwind: "$sale",
    },
    {
      $match: {
        "sale.saleDate": {
          $gte: currentMonthStart,
          $lt: nextMonthStart,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalProducts: {
          $sum: "$quantity",
        },
      },
    },
  ]);

  // ===== PREVIOUS MONTH =====

  const previousSalesResult = await Sale.aggregate([
    {
      $match: {
        saleDate: {
          $gte: previousMonthStart,
          $lt: currentMonthStart,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalSales: {
          $sum: 1,
        },
        totalRevenue: {
          $sum: "$total",
        },
        averageSale: {
          $avg: "$total",
        },
      },
    },
  ]);

  const previousProductsResult = await SaleItem.aggregate([
    {
      $lookup: {
        from: "sales",
        localField: "saleId",
        foreignField: "_id",
        as: "sale",
      },
    },
    {
      $unwind: "$sale",
    },
    {
      $match: {
        "sale.saleDate": {
          $gte: previousMonthStart,
          $lt: currentMonthStart,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalProducts: {
          $sum: "$quantity",
        },
      },
    },
  ]);

  const currentSales = currentSalesResult[0] || {};

  const previousSales = previousSalesResult[0] || {};

  const currentProducts = currentProductsResult[0]?.totalProducts || 0;

  const previousProducts = previousProductsResult[0]?.totalProducts || 0;

  return {
    totalSales,
    totalSalesRevenue,
    totalProductsSold,
    totalAverageSale,

    totalSalesTrend: calculateTrend(
      currentSales.totalSales || 0,
      previousSales.totalSales || 0,
    ),

    totalSalesRevenueTrend: calculateTrend(
      currentSales.totalRevenue || 0,
      previousSales.totalRevenue || 0,
    ),

    totalProductsSoldTrend: calculateTrend(currentProducts, previousProducts),

    totalAverageSaleTrend: calculateTrend(
      Math.round(currentSales.averageSale || 0),
      Math.round(previousSales.averageSale || 0),
    ),
  };
};

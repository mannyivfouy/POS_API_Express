import express from "express";
import path from "path";
import { coreMiddleware } from "./middlewares/cors.middleware";

import authRoute from "./routes/auth.route";
import userRoute from "./routes/user.route";
import roleRoute from "./routes/role.route";
import categoryRoute from "./routes/category.route";
import supplierRoute from "./routes/supplier.route";
import productRoute from "./routes/product.route";
import customerRoute from "./routes/customer.route";
import purchaseRouter from "./routes/purchase.route";
import saleRoute from "./routes/sale.route";

const app = express();

// Middleware
app.use(coreMiddleware);
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Auth Route
app.use("/api/auth", authRoute);

// User Routes
app.use("/api/users", userRoute);

// Role Route
app.use("/api/roles", roleRoute);

// Category Route
app.use("/api/categories", categoryRoute);

// Supplier Route
app.use("/api/suppliers", supplierRoute);

// Product Route
app.use("/api/products", productRoute);

// Cusomer Route
app.use("/api/customers", customerRoute);

// Purchase Route
app.use("/api/purchases", purchaseRouter);

// Sale Route
app.use("/api/sales", saleRoute);

export default app;

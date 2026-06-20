import express from "express";
import path from "path";
import { coreMiddleware } from "./middlewares/cors.middleware";

import authRoute from "./routes/auth.route";
import userRoute from "./routes/user.route";
import roleRoute from "./routes/role.route";
import categoryRoute from "./routes/category.route";
import supplierRoute from "./routes/supplier.route";

const app = express();

// Middleware
app.use(coreMiddleware)
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

export default app;

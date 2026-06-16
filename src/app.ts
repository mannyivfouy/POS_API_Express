import express from "express";
import cors from "cors";
import path from "path";

import authRoute from "./routes/auth.route";
import userRoute from "./routes/user.route";
import roleRoute from "./routes/role.route";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Auth Route
app.use("/api/auth", authRoute);

// User Routes
app.use("/api/users", userRoute);

// Role Route
app.use("/api/roles", roleRoute);

export default app;

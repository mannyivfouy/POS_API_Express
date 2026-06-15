import express from "express";
import cors from "cors";

import userRoute from "./routes/user.route";
import roleRoute from "./routes/role.route";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoute);
app.use("/api/roles", roleRoute);

export default app;

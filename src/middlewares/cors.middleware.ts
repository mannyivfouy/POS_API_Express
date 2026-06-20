import cors from "cors";

const allowedOrigins = ["http://localhost:4200"];

export const coreMiddleware = cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not Allowed By CORS"));
    }
  },
  credentials: true,
});

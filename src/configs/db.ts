import mongoose from "mongoose";
import dns from "dns"
import { env } from "./env";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

export const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);

    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Error : ", error);
    process.exit(1);
  }
};

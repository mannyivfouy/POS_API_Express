import mongoose from "mongoose";
import { connectDB } from "../configs/db";
import { seedPermissions } from "./permission.seed";

const runSeed = async () => {
  try {
    await connectDB();
    await seedPermissions();

    console.log("Seed complete successfully");
  } catch (error) {
    console.error("Seed failed : ", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

runSeed();

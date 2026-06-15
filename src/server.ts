import app from "./app";
import { env } from "./configs/env";
import { connectDB } from "./configs/db";

const startServer = async() => {
  await connectDB();

  app.listen(env.PORT, () => {
    console.log(`Server Running On http://localhost:${env.PORT}`)
  })
};

startServer();
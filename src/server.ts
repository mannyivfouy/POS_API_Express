import { env } from "./configs/env";
import app from "./app";
import { connectDB } from "./configs/db";

const startServer = async() => {
  await connectDB();

  app.listen(env.PORT, () => {
    console.log(`Server Running On http://localhost:${env.PORT}`)
  })
};

startServer();
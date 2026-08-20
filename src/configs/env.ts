import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN as string,
  TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID as string,

  BAKONG_ACCESS_TOKEN: process.env.BAKONG_ACCESS_TOKEN as string,
  BAKONG_ACCOUNT_ID: process.env.BAKONG_ACCOUNT_ID as string,
  BAKONG_MERCHANT_ID: process.env.BAKONG_MERCHANT_ID as string,
  BAKONG_ACQUIRING_BANK: process.env.BAKONG_ACQUIRING_BANK as string,
  BAKONG_MERCHANT_NAME: process.env.BAKONG_MERCHANT_NAME as string,

  KHQR_EXPIRY_MINUTES: Number(process.env.KHQR_EXPIRY_MINUTES),
};

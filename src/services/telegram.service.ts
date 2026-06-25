import axios from "axios";

export const sendTelegramMessage = async (message: string) => {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  try {
    const res = await axios.post(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        chat_id: CHAT_ID,
        text: message,
        parse_mode: "HTML",
      },
    );
  } catch (err: any) {
    console.log("❌ Telegram Error:", err.response?.data);
  }
};

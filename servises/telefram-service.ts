import TelegramApi from "node-telegram-bot-api";
import { config } from "dotenv";

config();

const botOptions = { polling: true };

const bot = new TelegramApi(
  process.env.TELEGRAM_BOT_TOKEN as string,
  process.env.NODE_ENV === "development" ? botOptions : undefined,
);

export default bot;

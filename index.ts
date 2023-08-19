import bot from "./servises/telefram-service";
import TelegramController from "./controllers/telegram-controller";

bot.on("message", TelegramController.onAction.bind(TelegramController));
// bot.on("inline_query", TelegramController.onAction.bind(TelegramController));

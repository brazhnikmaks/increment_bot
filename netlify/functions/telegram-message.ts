import { Handler, HandlerEvent } from "@netlify/functions";
import { Message } from "node-telegram-bot-api";
import telegramController from "../../controllers/telegram-controller";

const handler: Handler = async (event: HandlerEvent) => {
  const message = JSON.parse(event.body!).message as Message;

  await telegramController.onAction.bind(telegramController)(message);

  return { statusCode: 200 };
};

export { handler };

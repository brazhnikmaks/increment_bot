import telegramBot from "./servises/telefram-service";
import TelegramController from "./controllers/telegram-controller";
import slackBot from "./servises/slack-service";
import SlackController from "./controllers/slack-controller";
import { FIRED_TEXT_MATCH_REGEX } from "./consts";

telegramBot.on("message", TelegramController.onAction.bind(TelegramController));

slackBot.start(3000);
slackBot.message(
  FIRED_TEXT_MATCH_REGEX,
  SlackController.onMessage.bind(SlackController),
);

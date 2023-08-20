import { Handler, HandlerEvent } from "@netlify/functions";
// import { Message } from "node-telegram-bot-api";
// import telegramController from "../../controllers/telegram-controller";

const handler: Handler = async (event: HandlerEvent) => {
  console.log(event.body);
  const message = JSON.parse(event.body!);
  console.log(message?.challenge);

  // await telegramController.onAction.bind(telegramController)(message);

  // @ts-ignore
  return {
    statusCode: 200,
    body: JSON.stringify({
      challenge: message?.challenge,
    }),
  };
};

export { handler };

import { Handler, HandlerEvent } from "@netlify/functions";
import { ReceiverEvent } from "@slack/bolt";
import slackBot from "../../servises/slack-service";
import SlackController from "../../controllers/slack-controller";
import { FIRED_TEXT_MATCH_REGEX } from "../../consts";

slackBot.message(
  FIRED_TEXT_MATCH_REGEX,
  SlackController.onMessage.bind(SlackController),
);

const handler: Handler = async (event: HandlerEvent) => {
  const payload = JSON.parse(event.body!) as ReceiverEvent;

  await slackBot.processEvent(payload);

  return { statusCode: 200 };
};

export { handler };

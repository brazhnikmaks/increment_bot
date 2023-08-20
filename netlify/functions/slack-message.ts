import { Handler, HandlerEvent } from "@netlify/functions";
import { ReceiverEvent } from "@slack/bolt";
import slackBot from "../../servises/slack-service";
import SlackController from "../../controllers/slack-controller";
import { FIRED_TEXT_REGEX } from "../../consts";

slackBot.message(
  FIRED_TEXT_REGEX,
  SlackController.onMessage.bind(SlackController),
);

const handler: Handler = async (event: HandlerEvent) => {
  const payload = JSON.parse(event.body!) as any;

  // if slack tests url
  if (payload.challenge) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        challenge: payload.challenge,
      }),
    };
  }

  const slackEvent: ReceiverEvent = {
    body: payload,
    ack: async (response) => {
      return new Promise<void>((resolve, reject) => {
        resolve();
        return {
          statusCode: 200,
          body: response ?? "",
        };
      });
    },
  };

  await slackBot.processEvent(slackEvent);

  return {
    statusCode: 200,
    body: "",
  };
};

export { handler };

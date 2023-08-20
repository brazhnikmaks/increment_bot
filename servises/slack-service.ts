import { App, ExpressReceiver } from "@slack/bolt";
import { config } from "dotenv";

config();

const expressReceiver = new ExpressReceiver({
  signingSecret: `${process.env.SLACK_SIGNING_SECRET}`,
  processBeforeResponse: true,
});

const bot = new App({
  token: process.env.SLACK_BOT_TOKEN as string,
  signingSecret: process.env.SLACK_SIGNING_SECRET as string,
  receiver: expressReceiver,
});

export default bot;

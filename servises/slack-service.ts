import { App } from "@slack/bolt";
import { config } from "dotenv";

config();

const bot = new App({
  token: process.env.SLACK_BOT_TOKEN as string,
  signingSecret: process.env.SLACK_SIGNING_SECRET as string,
});

export default bot;

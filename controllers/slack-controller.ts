import { config } from "dotenv";
import { SayFn, GenericMessageEvent } from "@slack/bolt";
import db from "../servises/mongo-service";
import { FIRED_TEXT_REGEX } from "../consts";
import type { IUserDto } from "../types/user";

config();

const SLACK_USER_REGEXP = /<@([^>]+)>/gim;

class SlackController {
  async sendError(say: SayFn) {
    return await say(`Error  ¯\\_(ツ)_/¯`);
  }

  isMaster(userId: string) {
    return userId === (process.env.SLACK_MASTER_ID as string);
  }

  async sendNotMaster(say: SayFn) {
    return await say(`Nice try! You don't have enough power =(`);
  }

  async sendUsersBoard(say: SayFn, users: IUserDto[]) {
    let message = "FireBoard\n";
    users
      .sort((a, b) => b.fired - a.fired)
      .forEach(({ firstName, lastName, slack, fired }) => {
        if (firstName) {
          message += `\n${firstName}${
            lastName ? ` ${lastName}` : ""
          }: ${fired}`;
        } else if (slack) {
          message += `\n<@${slack}>: ${fired}`;
        }
      });
    return await say(message);
  }

  getUsersFromText(text?: string) {
    if (!text) return [];

    const uniqUsers = new Set(
      [...text.matchAll(SLACK_USER_REGEXP)].map((match) => match[1]),
    );

    return [...uniqUsers];
  }

  async onMessage({
    say,
    message,
  }: {
    message: GenericMessageEvent;
    say: SayFn;
  }) {
    const { user, text } = message;

    try {
      const firedMatchText = text
        ?.replace(SLACK_USER_REGEXP, "")
        .match(FIRED_TEXT_REGEX);
      //no matched fired text - skip all
      if (!firedMatchText) return;
      //check if user is master
      if (!this.isMaster(user)) {
        await this.sendNotMaster(say);
        return;
      }

      const [_, action, count] = firedMatchText;
      const firedCount = (+count || 1) * (action === "decrement" ? -1 : 1);

      const users = this.getUsersFromText(text);

      await db.connect();
      const updatedUsers = await db.updateFired(
        firedCount,
        users.length
          ? {
              slack: users,
            }
          : undefined,
      );

      await this.sendUsersBoard(say, updatedUsers);
      return;
    } catch (e) {
      console.log(e);
      await this.sendError(say);
    }
  }
}

export default new SlackController();

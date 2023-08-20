import { config } from "dotenv";
import { MessageEvent } from "@slack/bolt";
import bot from "../servises/slack-service";
import db from "../servises/mongo-service";
import { FIRED_TEXT_MATCH_REGEX } from "../consts";
import type { IUserDto } from "../types/user";

config();

class SlackController {
  // async sendError(chatId: number) {
  //   await bot.sendMessage(chatId, `Error  ¯\\_(ツ)_/¯`);
  // }
  // isMaster(userId: number) {
  //   return userId == +(process.env.TELEGRAM_MASTER_ID as string);
  // }
  // async sendNotMaster(chatId: number) {
  //   await bot.sendMessage(chatId, `Nice try! You don't have enough power =(`);
  // }
  // async sendUsersBoard(chatId: number, users: IUserDto[]) {
  //   let message = "FireBoard\n";
  //   users
  //     .sort((a, b) => b.fired - a.fired)
  //     .forEach(({ firstName, lastName, telegram, fired }) => {
  //       if (firstName) {
  //         message += `\n${firstName}${
  //           lastName ? ` ${lastName}` : ""
  //         }: ${fired}`;
  //       } else if (telegram) {
  //         message += `\n@${telegram}: ${fired}`;
  //       }
  //     });
  //   await bot.sendMessage(chatId, message);
  // }
  // getUsersFromEntities(text?: string, entities?: MessageEntity[]) {
  //   if (!text) return [];
  //   return (
  //     entities?.reduce<string[]>((users, entry) => {
  //       if (entry.type !== "mention") return users;
  //       const start = entry.offset + 1;
  //       const end = start + entry.length - 1;
  //       users.push(text.substring(start, end));
  //       return users;
  //     }, []) ?? []
  //   );
  // }
  async onMessage({ say, message }: any) {
    console.log({ say, message });
    try {
      await say(message.text);
    } catch (error) {
      console.log("err");
      console.error(error);
    }
  }
}

export default new SlackController();

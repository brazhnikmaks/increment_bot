import { Message, MessageEntity } from "node-telegram-bot-api";
import { config } from "dotenv";
import bot from "../servises/telefram-service";
import db from "../servises/mongo-service";
import { FIRED_TEXT_REGEX } from "../consts";
import type { IUserDto } from "../types/user";

config();

const TELEGRAM_USER_REGEXP = /@[\w]+/gim;

class TelegramController {
  async sendError(chatId: number) {
    await bot.sendMessage(chatId, `Error  ¯\\_(ツ)_/¯`);
  }

  isMaster(userId: number) {
    return userId == +(process.env.TELEGRAM_MASTER_ID as string);
  }

  async sendNotMaster(chatId: number) {
    await bot.sendMessage(chatId, `Nice try! You don't have enough power =(`);
  }

  async sendUsersBoard(chatId: number, users: IUserDto[]) {
    let message = "FireBoard\n";
    users
      .sort((a, b) => b.fired - a.fired)
      .forEach(({ firstName, lastName, telegram, fired }) => {
        if (firstName) {
          message += `\n${firstName}${
            lastName ? ` ${lastName}` : ""
          }: ${fired}`;
        } else if (telegram) {
          message += `\n@${telegram}: ${fired}`;
        }
      });
    await bot.sendMessage(chatId, message);
  }

  getUsersFromEntities(text?: string, entities?: MessageEntity[]) {
    if (!text) return [];

    return (
      entities?.reduce<string[]>((users, entry) => {
        if (entry.type !== "mention") return users;
        const start = entry.offset + 1;
        const end = start + entry.length - 1;
        const user = text.substring(start, end);
        if (users.includes(user)) return users;
        users.push(user);
        return users;
      }, []) ?? []
    );
  }

  async onMessage(msg: Message) {
    const {
      chat: { id: chatId },
      from,
      entities,
      text,
    } = msg;

    if (!from || !text) return;

    const { id: userId } = from;

    try {
      const firedMatchText = text
        .replace(TELEGRAM_USER_REGEXP, "")
        .match(FIRED_TEXT_REGEX);
      //no matched fired text - skip all
      if (!firedMatchText) return;
      //check if user is master
      if (!this.isMaster(userId)) {
        return await this.sendNotMaster(chatId);
      }

      const [_, action, count] = firedMatchText;
      const firedCount = (+count || 1) * (action === "decrement" ? -1 : 1);

      const updatedUsers = await db.updateFired(
        firedCount,
        entities
          ? {
              telegram: this.getUsersFromEntities(text, entities),
            }
          : undefined,
      );

      return await this.sendUsersBoard(chatId, updatedUsers);
    } catch (e) {
      console.log(e);
      await this.sendError(chatId);
    }
  }

  async onAction(msg: Message) {
    if (!msg) return;

    let {
      text,
      chat: { id: chatId },
    } = msg;

    try {
      await db.connect();
      switch (text) {
        default:
          await this.onMessage(msg);
          return;
      }
    } catch (e) {
      this.sendError(chatId);
    }
  }
}

export default new TelegramController();

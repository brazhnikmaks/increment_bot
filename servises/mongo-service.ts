import { config } from "dotenv";
import mongoose, { FilterQuery } from "mongoose";
import _isEmpty from "lodash/isEmpty";
import { UserModel } from "../models";
import { UserDto } from "../dtos";
import { IUser, RequestUsers, Messenger } from "../types/user";
import { isMessenger } from "../utils";

config();
mongoose.set("strictQuery", false);

class MongoService {
  async connect() {
    try {
      const connect = await mongoose.connect(
        process.env.MONGO_DB_URL as string,
      );
      return connect;
    } catch (err) {
      console.log("Failed to connect to DB", err);
    }
  }

  async getUsers(filter: FilterQuery<IUser>) {
    const users = await UserModel.find(filter);
    if (!users.length) {
      throw new Error("No users founded");
    }
    return users.map((user) => new UserDto(user));
  }

  async getUser(filter: FilterQuery<IUser>) {
    const user = await UserModel.findOne(filter);
    if (!user) {
      throw new Error("No user founded");
    }
    return new UserDto(user);
  }

  async addUser(userData: Partial<IUser>) {
    const user = await UserModel.create(userData);
    return new UserDto(user);
  }

  async updateFired(fired: number, request?: RequestUsers) {
    if (_isEmpty(request)) {
      const updatedResult = await UserModel.updateMany(
        {},
        {
          $inc: { fired },
        },
        {
          new: true,
        },
      );
      if (!updatedResult.acknowledged) {
        throw new Error("No user founded");
      }

      return await this.getUsers({});
    }

    const [messenger, users] = Object.entries(request)[0];

    if (!isMessenger(messenger)) return [];

    const bulkUpdateOps = users.map(function (user) {
      return {
        updateOne: {
          filter: { [messenger]: user },
          update: { $inc: { fired } },
          upsert: true,
          new: true,
        },
      };
    });

    await UserModel.bulkWrite(bulkUpdateOps);

    return await this.getUsers({});
  }

  async assignSlack(telegram: string, slack: string) {
    const user = await UserModel.findOneAndUpdate(
      {
        telegram,
      },
      {
        telegram,
        slack,
      },
      {
        new: true,
        upsert: true,
      },
    );
    if (!user) {
      throw new Error("No user founded");
    }

    return new UserDto(user);
  }

  async assignTelegram(slack: string, telegram: string) {
    const user = await UserModel.findOneAndUpdate(
      {
        slack,
      },
      {
        telegram,
        slack,
      },
      {
        new: true,
        upsert: true,
      },
    );
    if (!user) {
      throw new Error("No user founded");
    }

    return new UserDto(user);
  }
}

export default new MongoService();

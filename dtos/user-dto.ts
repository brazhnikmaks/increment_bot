import { HydratedDocument } from "mongoose";
import { IUser, IUserDto } from "../types/user";

class UserDto implements IUserDto {
  id: string;
  firstName?: string;
  lastName?: string;
  telegram?: string;
  slack?: string;
  fired: number;

  constructor(model: HydratedDocument<IUser>) {
    this.id = model._id.toString();
    this.firstName = model.firstName;
    this.lastName = model.lastName;
    this.telegram = model.telegram;
    this.slack = model.slack;
    this.fired = model.fired;
  }
}

export default UserDto;

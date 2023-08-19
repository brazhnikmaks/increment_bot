import { Schema, model } from "mongoose";
import { IUser } from "../types/user";

const ChatSchema = new Schema<IUser>({
  firstName: { type: String },
  lastName: { type: String },
  telegram: { type: String },
  slack: { type: String },
  fired: { type: Number, default: 0 },
});

export default model<IUser>("User", ChatSchema);

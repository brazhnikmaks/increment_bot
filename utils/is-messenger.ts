import type { Messenger } from "../types/user";

export const isMessenger = (messeger: unknown): messeger is Messenger =>
  typeof messeger === "string" &&
  (messeger === "telegram" || messeger === "slack");

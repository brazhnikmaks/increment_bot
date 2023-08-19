export interface IUser {
  firstName?: string;
  lastName?: string;
  telegram?: string;
  slack?: string;
  fired: number;
}

export interface IUserDto extends IUser {
  id: string;
}

export type RequestUsers =
  | { telegram: IUser["telegram"][] }
  | { slack: IUser["slack"][] };

export type Messenger = "telegram" | "slack";

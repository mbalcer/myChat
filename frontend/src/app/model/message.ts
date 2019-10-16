import {User} from "./user";

export interface Message {
  user: User;
  dateTime: string;
  message: string;
}

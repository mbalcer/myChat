import {User} from "./user";

export interface Message {
  user: User,
  room: string,
  dateTime: string,
  message: string
}

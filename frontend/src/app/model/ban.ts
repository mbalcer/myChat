import {User} from "./user";

export interface Ban {
  start: string,
  end: string,
  type: string,
  user: User
}

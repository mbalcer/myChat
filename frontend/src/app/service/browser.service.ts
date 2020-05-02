import {Injectable} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {User} from "../model/user";
import {UserService} from "./user.service";
import {TokenService} from "./token.service";

@Injectable({
  providedIn: 'root'
})
export class BrowserService{

  private hasFocus: boolean = false;
  private newMessage: boolean = false;
  private user: User;

  constructor(private titleService: Title, private userService: UserService, private tokenService: TokenService) {
    this.userService.getUserByLogin(this.tokenService.getLogin()).subscribe(n => {
      this.user = n;
    });
    window.addEventListener("blur", n => {
      this.hasFocus = false;
    });
    window.addEventListener("focus", n => {
      this.hasFocus = true;
      if(this.newMessage) {
        this.titleService.setTitle("myChat");
        this.newMessage = false;
      }
    });
    window.addEventListener("beforeunload", n => {
      this.user.active = false;
      this.userService.setActive(this.user).subscribe(end => {});
      this.tokenService.removeToken();
    });
  }

  public setNewMessage(isNewMessage: boolean) {
    if(!this.hasFocus && isNewMessage) {
        this.titleService.setTitle("(1) myChat");
        this.newMessage = true;
    }
  }
}

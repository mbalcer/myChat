import {Injectable} from '@angular/core';
import {TokenService} from "./token.service";
import {Router} from "@angular/router";
import {UserService} from "./user.service";

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {

  constructor(private tokenService: TokenService, private router: Router, private userService: UserService) {
  }

  getUser() {
    return this.userService.getUserByLogin(this.tokenService.getLogin());
  }

  signOut() {
    this.tokenService.removeToken();
    this.router.navigateByUrl("");
  }
}

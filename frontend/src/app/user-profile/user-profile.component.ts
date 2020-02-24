import {Component, OnInit} from '@angular/core';
import {User} from "../model/user";
import {UserService} from "../service/user.service";
import {TokenService} from "../service/token.service";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  user: User;

  changePassword: ChangePasswordModel = {
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  }

  constructor(private userService: UserService, private tokenService: TokenService) {
    this.userService.getUserByLogin(this.tokenService.getLogin()).subscribe(n => {
      this.user = n;
    });
  }

  ngOnInit() {
  }

  signOut() {
  }

  changeColor() {
    this.userService.changeColor(this.user).subscribe(n => {
      this.user = n;
    });
  }

  savePassword() {
    this.user.password = this.changePassword.oldPassword;
    this.userService.changePassword(this.user, this.changePassword.newPassword).subscribe(n => {
      this.user = n;
    }, error => {
      console.log("Bad old password");
    });
  }
}

export interface ChangePasswordModel {
  oldPassword: string,
  newPassword: string,
  confirmNewPassword: string
}

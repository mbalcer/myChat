import {Component, OnInit} from '@angular/core';
import {User} from "../model/user";
import {UserService} from "../service/user.service";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  user: User = {
    login: "Admin",
    email: "",
    password: "",
    color: "#FF0000"
  };

  changePassword: ChangePasswordModel = {
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  }

  constructor(private userService: UserService) {
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
  }
}

export interface ChangePasswordModel {
  oldPassword: string,
  newPassword: string,
  confirmNewPassword: string
}

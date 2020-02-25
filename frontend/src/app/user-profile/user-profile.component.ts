import {Component, OnInit} from '@angular/core';
import {User} from "../model/user";
import {UserService} from "../service/user.service";
import * as $ from 'jquery';
import {AuthenticateService} from "../service/authenticate.service";

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
  };

  constructor(private authenticateService: AuthenticateService, private userService: UserService) {
    this.authenticateService.getUser().subscribe(n => {
      this.user = n;
    });
  }

  ngOnInit() {
  }

  signOut() {
    this.authenticateService.signOut();
  }

  changeColor() {
    this.userService.changeColor(this.user).subscribe(n => {
      this.user = n;
      $('#changeColorMessage').html('The color has been changed correctly');
      $('#changeColorMessage').removeClass('error').addClass('success');
    });
  }

  savePassword() {
    this.user.password = this.changePassword.oldPassword;
    this.userService.changePassword(this.user, this.changePassword.newPassword).subscribe(n => {
      this.user = n;
      $('#changePasswordMessage').html('The password has been changed correctly');
      $('#changePasswordMessage').removeClass('error').addClass('success');
    }, error => {
      $('#changePasswordMessage').html('The old password is incorrect');
      $('#changePasswordMessage').removeClass('success').addClass('error');
    });
  }
}

export interface ChangePasswordModel {
  oldPassword: string,
  newPassword: string,
  confirmNewPassword: string
}

import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import * as $ from 'jquery';
import {User} from "../model/user";
import {UserService} from "../service/user.service";

@Component({
  selector: 'app-login-panel',
  templateUrl: './login-panel.component.html',
  styleUrls: ['./login-panel.component.css']
})
export class LoginPanelComponent implements OnInit {

  @Output() userLogged: EventEmitter<User> = new EventEmitter();

  userToLogin: UserLoginViewModel = {
    username: '',
    password: ''
  };

  constructor(private userService: UserService) {
  }

  ngOnInit() {
  }

  loginUser(user : User) {
      this.userLogged.emit(user);
  }

  randomGuestUser() {
    let login = "guest";
    for (let i=0; i<5; i++)
      login += Math.floor(Math.random() * 10);

    let guestUser : User = {
      id: null,
      login: login,
      password: null
    };
    this.loginUser(guestUser);
  }


  togglePanel() {
    $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
  }

  signIn() {
    this.userService.getUserByLogin(this.userToLogin.username).subscribe(
      n => {
        let getUser = n;
        if (getUser.login === this.userToLogin.username && getUser.password === this.userToLogin.password) {
          this.loginUser(getUser);
        }
      },
      error => {
        alert("An error has occurred");
      }
    );


  }
}

export interface UserLoginViewModel {
  username: string;
  password: string;
}

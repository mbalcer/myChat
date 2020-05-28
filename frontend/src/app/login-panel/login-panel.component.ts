import {Component, OnInit} from '@angular/core';
import * as $ from 'jquery';
import {User} from "../model/user";
import {UserService} from "../service/user.service";
import {Router} from "@angular/router";
import {TokenService} from "../service/token.service";
import {BanService} from "../service/ban.service";

@Component({
  selector: 'app-login-panel',
  templateUrl: './login-panel.component.html',
  styleUrls: ['./login-panel.component.css']
})
export class LoginPanelComponent implements OnInit {

  userToLogin: UserLoginViewModel = {
    login: '',
    password: ''
  };
  userToRegister: UserRegisterViewModel = {
    login: '',
    password: '',
    confirmPassword: '',
    email: '',
    color: ''
  };

  constructor(private userService: UserService, private tokenService: TokenService, private router: Router, private banService: BanService) {
    if (this.tokenService.isLogged())
      this.router.navigateByUrl("/chat");
  }

  ngOnInit() {
  }

  navigate(user: User, url: string) {
    this.tokenService.setToken(user.login);
    this.router.navigateByUrl(url);
  }

  checkBan(user: User) {
    this.banService.getBanByUser(user.login).subscribe(n => {
      if (n != null && n.type == 'BAN')
        this.navigate(user, "/ban");
      else
        this.navigate(user, "/chat");
    });
  }

  randomGuestUser() {
    let login = "guest";
    for (let i=0; i<5; i++)
      login += Math.floor(Math.random() * 10);

    let guestUser : User = {
      login: login,
      password: null,
      email: null,
      color: null,
      role: 'GUEST',
      active: false
    };
    this.navigate(guestUser, "/chat");
  }

  getRandomColor() {
    let letters = "0123456789abcdef";
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }


  togglePanel() {
    $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
  }

  signIn() {
    if (this.userToLogin.login == "") {
      $('#errorLogin').html("Login is required");
      $('.login-form input').css("border", "1px solid #e74c3c");
    } else {
      this.userService.signIn(this.userToLogin).subscribe(n => {
        this.checkBan(n);
      }, error => {
        if (error.status == 404) {
          $('#errorLogin').html("The user with the given username does not exist");
          $('.login-form input').css("border", "1px solid #e74c3c");
        } else if (error.status == 401) {
          $('#errorLogin').html("Wrong password");
          $('.login-form input').css("border", "1px solid #e74c3c");
        } else {
          console.log(error);
        }
      });
    }
  }

  signUp() {
    this.userToRegister.color = this.getRandomColor();
    this.userService.signUp(this.userToRegister).subscribe(n => {
      $('#errorRegister').removeClass("error").addClass("success").html("You have been successfully registered");
      $('.register-form input').val('');
    }, error => {
      $('#errorRegister').removeClass("success").addClass("error").html("The user with this login or email already exists");
    });
  }
}

export interface UserLoginViewModel {
  login: string;
  password: string;
}

export interface UserRegisterViewModel {
  login: string;
  password: string;
  confirmPassword: string;
  email: string;
  color: string;
}

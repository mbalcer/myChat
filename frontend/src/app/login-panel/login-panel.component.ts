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
    username: '',
    password: ''
  };
  userToRegister: UserRegisterViewModel = {
    login: '',
    password: '',
    confirmPassword: '',
    email: ''
  };

  constructor(private userService: UserService, private tokenService: TokenService, private router: Router, private banService: BanService) {
    if (this.tokenService.isLogged())
      this.router.navigateByUrl("/chat");
  }

  ngOnInit() {
  }

  navigateToChat(user: User) {
    this.tokenService.setToken(user.login);
    this.router.navigateByUrl("/chat");
  }

  checkBan(user: User) {
    this.banService.getBanByUser(user).subscribe(n => {
      if (n != null && n.type == 'BAN')
        this.router.navigateByUrl("/ban");
      else
        this.navigateToChat(user);
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
      role: 'GUEST'
    };
    this.navigateToChat(guestUser);
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
    if (this.userToLogin.username == "") {
      $('#errorLogin').html("Login is required");
      $('.login-form input').css("border", "1px solid #e74c3c");
    } else {
      this.userService.getUserByLogin(this.userToLogin.username).subscribe(
        n => {
          let getUser = n;
          if (getUser == null) {
            $('#errorLogin').html("The user with the given username does not exist");
            $('.login-form input').css("border", "1px solid #e74c3c");
          } else if (getUser.login === this.userToLogin.username && getUser.password === this.userToLogin.password)
            this.checkBan(getUser);
          else {
            $('#errorLogin').html("Wrong password");
            $('.login-form input').css("border", "1px solid #e74c3c");
          }
        },
        error => {
          alert("An error has occurred");
        }
      );
    }

  }

  signUp() {
    this.userService.getUserByLogin(this.userToRegister.login).subscribe(
      l => {
        this.userService.getUserByEmail(this.userToRegister.email).subscribe(
          e => {
            if (l == null && e == null) {
              let saveUser: User = {
                login: this.userToRegister.login,
                password: this.userToRegister.password,
                email: this.userToRegister.email,
                color: this.getRandomColor(),
                role: null
              };

              this.saveUser(saveUser);
            } else
              $('#errorRegister').removeClass("success").addClass("error").html("The user with this login or email already exists");
          }, error => {
            alert("An error has occurred");
          }
        )
      },
      error => {
        alert("An error has occurred");
      }
    );
  }

  saveUser(user) {
    this.userService.postUser(user).subscribe(
      n => {
        $('#errorRegister').removeClass("error").addClass("success").html("You have been successfully registered");
        $('.register-form input').val('');
      },
      error => {
        alert("An error has occurred");
      }
    )
  }
}

export interface UserLoginViewModel {
  username: string;
  password: string;
}

export interface UserRegisterViewModel {
  login: string;
  password: string;
  confirmPassword: string;
  email: string;
}

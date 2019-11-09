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
  userToRegister: UserRegisterViewModel = {
    login: '',
    password: '',
    confirmPassword: '',
    email: ''
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
      password: null,
      email: null,
      color: "#000000"
    };
    this.loginUser(guestUser);
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
            this.loginUser(getUser);
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
                id: null,
                login: this.userToRegister.login,
                password: this.userToRegister.password,
                email: this.userToRegister.email,
                color: this.getRandomColor()
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

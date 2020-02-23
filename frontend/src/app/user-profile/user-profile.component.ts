import {Component, OnInit} from '@angular/core';
import {User} from "../model/user";

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

  constructor() {
  }

  ngOnInit() {
  }

  signOut() {

  }

  changeColor() {
  }
}

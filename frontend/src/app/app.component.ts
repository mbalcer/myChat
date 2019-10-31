import { Component, OnInit } from '@angular/core';
import {User} from "./model/user";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  user : User;

  constructor () {}

  ngOnInit() {}

  loginUser(user : User) {
    this.user = user;
  }
}

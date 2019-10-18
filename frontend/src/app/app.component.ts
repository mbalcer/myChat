import { Component, OnInit } from '@angular/core';
import {Message} from "./model/message";
import {User} from "./model/user";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  messages: Message[] = [];
  user: string;
  yourMessage: string;

  constructor () {}

  ngOnInit() {}

  sendMessage() {

  }
}

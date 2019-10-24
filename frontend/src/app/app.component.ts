import { Component, OnInit } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {Message} from "./model/message";
import {User} from "./model/user";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  private serverUrl = "http://localhost:8080/chat";
  private stompClient;

  messages: Message[] = [];
  user: string;
  yourMessage: string;

  constructor () {
    this.webSocketConnect();
  }

  ngOnInit() {}

  webSocketConnect(){
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let client = this.stompClient;
    let that = this;
    client.connect({}, function(frame) {
      client.subscribe("/topic/messages", function(message) {
        that.showMessage(JSON.parse(message.body).user, JSON.parse(message.body).message, JSON.parse(message.body).dateTime)
      });
    });
  }

  showMessage(user, message, dateTime) {
    let newMessage : Message = {
      user: user,
      message: message,
      dateTime: dateTime
    };
    this.messages.push(newMessage);
  }

  sendMessage() {
    let newUser : User = {
      id: null,
      login: this.user,
      password: null
    };
    let messageToSend : Message = {
      user: newUser,
      message: this.yourMessage,
      dateTime: null
    };
    this.stompClient.send("/app/chat" , {}, JSON.stringify(messageToSend));
    this.yourMessage = "";
  }
}

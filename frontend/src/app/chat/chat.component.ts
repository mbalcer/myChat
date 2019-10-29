import { Component, OnInit } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {Message} from "../model/message";
import {User} from "../model/user";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  private serverUrl = "http://localhost:8080/chat";
  private stompClient;

  messages: Message[] = [];
  user: User;
  yourMessage: string;

  constructor() {
    this.webSocketConnect();
    this.randomGuestUser();
  }

  ngOnInit() {
  }

  randomGuestUser() {
    let login = "guest";
    for (let i=0; i<5; i++)
      login += Math.floor(Math.random() * 10);

    this.user = {
      id: null,
      login: login,
      password: null
    };
  }

  webSocketConnect(){
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let client = this.stompClient;
    let that = this;
    client.connect({}, function(frame) {
      client.subscribe("/topic/messages", function(message) {
        that.showMessage(JSON.parse(message.body).user, JSON.parse(message.body).message, JSON.parse(message.body).dateTime);
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
    let messageToSend : Message = {
      user: this.user,
      message: this.yourMessage,
      dateTime: null
    };
    this.stompClient.send("/app/chat" , {}, JSON.stringify(messageToSend));
    this.yourMessage = "";
  }
}

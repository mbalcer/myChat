import {Component, Input, OnInit} from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {Message} from "../model/message";
import {User} from "../model/user";
import {formatDate} from "@angular/common";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  private serverUrl = "http://localhost:8080/chat";
  private stompClient;

  messages: Message[] = [];
  @Input() user: User;
  yourMessage: string;

  constructor() {
    this.webSocketConnect();
  }

  ngOnInit() {
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
      dateTime: formatDate(dateTime, 'dd.MM HH:mm', 'en')
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

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
  room: string;

  constructor() {
    this.room = "All";
    this.webSocketConnect(this.room);
  }

  ngOnInit() {
  }

  webSocketConnect(room) {
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let client = this.stompClient;
    let that = this;
    client.connect({}, function(frame) {
      client.subscribe("/topic/" + room, function (message) {
        that.showMessage(JSON.parse(message.body).user, JSON.parse(message.body).message, JSON.parse(message.body).dateTime);
      });
    });
  }

  webSocketDisconnect(room) {
    this.stompClient.disconnect("/topic/" + room);
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
    this.stompClient.send("/app/chat/" + this.room, {}, JSON.stringify(messageToSend));
    this.yourMessage = "";
  }

  updateRoom(room: string) {
    this.room = room;
    this.messages.splice(0, this.messages.length);
    this.webSocketDisconnect(this.room);
    this.webSocketConnect(this.room);
  }
}

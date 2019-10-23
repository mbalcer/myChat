import { Component, OnInit } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  private serverUrl = "http://localhost:8080/chat";
  private stompClient;

  messages: string[] = [];
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
        that.messages.push(message.body);
      });
    });
  }


  sendMessage() {
    this.stompClient.send("/app/chat" , {}, this.yourMessage);
    this.yourMessage = "";
  }
}

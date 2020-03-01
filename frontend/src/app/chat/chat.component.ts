import {AfterViewChecked, Component, OnDestroy, OnInit} from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {Message} from "../model/message";
import {User} from "../model/user";
import {formatDate} from "@angular/common";
import {MatDialog} from "@angular/material";
import {DialogAddUserToRoom} from "./rooms/dialogs/dialog-add-user-to-room/dialog-add-user-to-room";
import {RoomsService} from "../service/rooms.service";
import {UserService} from "../service/user.service";
import {TokenService} from "../service/token.service";
import * as $ from 'jquery';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked, OnDestroy {
  private serverUrl = environment.mainURL + "/chat";
  private stompClient;

  messages: Message[] = [];
  user: User;
  yourMessage: string;
  rooms: string[] = ['All'];
  room: string;
  openAllRooms: boolean = false;

  constructor(public dialog: MatDialog, private roomService: RoomsService, private userService: UserService, private tokenService: TokenService, private http: HttpClient) {
    if(this.tokenService.getLogin().includes("guest")) {
      this.user = {
        login: this.tokenService.getLogin(),
        password: null,
        email: null,
        color: "#000000"
      };
    } else {
      this.userService.getUserByLogin(this.tokenService.getLogin()).subscribe(n => {
        this.user = n;
      });
    }
    this.room = "All";
    this.getAllMessages();
  }

  ngOnInit() {
  }

  ngAfterViewChecked() {
    if (this.openAllRooms == false) {
      this.roomService.getRoomsByUser(this.user.login).subscribe(
        n => {
          this.rooms = this.rooms.concat(n);
          for (let room  of this.rooms) {
            this.webSocketConnect(room);
          }
        }, error => {
          alert("An error has occurred");
        }
      );
      this.openAllRooms = true;
    }
  }

  ngOnDestroy() {
    for (let room of this.rooms) {
      this.webSocketDisconnect(room);
    }
  }

  webSocketConnect(room) {
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let client = this.stompClient;
    let that = this;
    client.connect({}, function(frame) {
      client.subscribe("/topic/" + room, function (message) {
        if (JSON.parse(message.body).room == that.room) {
          that.showMessage(JSON.parse(message.body).user, JSON.parse(message.body).message, JSON.parse(message.body).dateTime);
        }
      });
    });
  }

  webSocketDisconnect(room) {
    this.stompClient.disconnect("/topic/" + room);
  }

  openRoom(room) {
    this.rooms.push(room);
    this.webSocketConnect(room);
  }

  closeRoom(room) {
    this.rooms.splice(this.rooms.indexOf(room), 1);
    this.webSocketDisconnect(room);
  }

  showMessage(user, message, dateTime) {
    let newMessage : Message = {
      user: user,
      room: this.room,
      message: message,
      dateTime: formatDate(dateTime, 'dd.MM HH:mm', 'en')
    };
    this.messages.push(newMessage);
  }

  sendMessage() {
    let messageToSend : Message = {
      user: this.user,
      room: this.room,
      message: this.yourMessage,
      dateTime: null
    };
    this.stompClient.send("/app/chat/" + this.room, {}, JSON.stringify(messageToSend));
    this.yourMessage = "";
  }

  updateRoom(room: string) {
    this.room = room;
    this.messages.splice(0, this.messages.length);
    this.getAllMessages();
  }

  getAllMessages() {
    this.http.get<Message[]>(environment.mainURL + "/api/chat/" + this.room).subscribe(n => {
      this.messages = n;
    });
  }

  openDialogToAddUserToRoom(room: string) {
    const dialogRef = this.dialog.open(DialogAddUserToRoom, {
      width: '400px',
      data: {room: room}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        for (let u of result) {
          this.roomService.addUserToRoom(room, u).subscribe(n => {
          });
        }
      }
    });
  }

  enterSend($event: KeyboardEvent) {
    if ($event.code == 'Enter')
      $("#sendButton").click();
  }
}

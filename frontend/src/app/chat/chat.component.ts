import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {Message} from "../model/message";
import {User} from "../model/user";
import {formatDate} from "@angular/common";
import {MatDialog, MatIconRegistry} from "@angular/material";
import {DialogAddUserToRoom} from "./rooms/dialogs/dialog-add-user-to-room/dialog-add-user-to-room";
import {RoomsService} from "../service/rooms.service";
import {UserService} from "../service/user.service";
import {TokenService} from "../service/token.service";
import * as $ from 'jquery';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {BanService} from "../service/ban.service";
import {Ban} from "../model/ban";
import {DomSanitizer} from "@angular/platform-browser";
import {BrowserService} from "../service/browser.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewInit, OnDestroy {
  private serverUrl = environment.mainURL + "/chat";
  private stompClient;

  messages: Message[] = [];
  user: User = {
    login: "NONE",
    email: "",
    color: "",
    active: false,
    role: ""
  };
  yourMessage: string = "";
  rooms: string[] = ['All'];
  room: string;
  openAllRooms: boolean = false;
  muted: Ban = null;
  toggleEmojiPicker: boolean = false;
  notificationRoom = new Map();

  constructor(public dialog: MatDialog, private roomService: RoomsService, private userService: UserService, private tokenService: TokenService,
              private http: HttpClient, private router: Router, private banService: BanService, private iconRegistry: MatIconRegistry,
              private sanitizer: DomSanitizer, private browserService: BrowserService) {
    if(this.tokenService.getLogin().includes("guest")) {
      this.user = {
        login: this.tokenService.getLogin(),
        email: null,
        color: "#000000",
        role: null,
        active: false
      };
    } else {
      this.getUser();
    }
    this.room = "All";
    iconRegistry.addSvgIcon('smile', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/smile.svg'));
  }

  ngOnInit() {
  }

  initRooms() {
    if (this.openAllRooms == false && !this.tokenService.getLogin().includes("guest")) {
      this.roomService.getRoomsByUser(this.user.login).subscribe(
        n => {
          this.rooms = this.rooms.concat(n);
          for (let room  of this.rooms) {
            this.webSocketConnect(room);
            this.notificationRoom.set(room, false);
          }
          this.banObserver();
          this.openAllRooms = true;
        }, error => {
          alert("An error has occurred");
        }
      );
    } else if(this.tokenService.getLogin().includes("guest")) {
      this.webSocketConnect(this.room);
    }
  }

  ngAfterViewInit() {
    this.initRooms();
  }

  ngOnDestroy() {
    if(!this.tokenService.getLogin().includes("guest")) {
      if (this.openAllRooms) {
        for (let room of this.rooms) {
          this.webSocketDisconnect(room);
        }
        this.banDisconnect();
      }
      this.user.active = false;
      this.userService.setActive(this.user).subscribe(n => {
        this.user = n;
      });
    } else {
      this.webSocketDisconnect(this.room);
    }
  }

  banObserver() {
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let client = this.stompClient;
    let that = this;
    client.connect({}, function (frame) {
      client.subscribe("/ban/" + that.user.login, function (message) {
        if (JSON.parse(message.body).type == 'BAN')
          that.router.navigateByUrl("/ban");
        else
          that.muted = {
            start: JSON.parse(message.body).start,
            end: formatDate(JSON.parse(message.body).end, 'dd.MM.yyyy HH:mm', 'en'),
            type: JSON.parse(message.body).type,
            user: JSON.parse(message.body).user
          };
      });
    });
  }

  banDisconnect() {
    this.stompClient.disconnect("/ban/" + this.user.login);
  }

  webSocketConnect(room) {
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let client = this.stompClient;
    let that = this;
    client.connect({}, function(frame) {
      client.subscribe("/topic/" + room, function (message) {
        if (JSON.parse(message.body).room == that.room) {
          if (JSON.parse(message.body).type == 'MESSAGE' || JSON.parse(message.body).type == 'ALERT' || JSON.parse(message.body).type == 'ERROR') {
            that.showMessage(JSON.parse(message.body).user, JSON.parse(message.body).message, JSON.parse(message.body).dateTime, JSON.parse(message.body).type);
            that.browserService.setNewMessage(true);
          } else if ((JSON.parse(message.body).type == 'HELP' || JSON.parse(message.body).type == 'SYSTEM') && JSON.parse(message.body).user.login == that.user.login) {
            that.getUser();
            that.showMessage(JSON.parse(message.body).user, JSON.parse(message.body).message, JSON.parse(message.body).dateTime, JSON.parse(message.body).type);
          } else if (JSON.parse(message.body).type == 'CLEAR' && JSON.parse(message.body).user.login == that.user.login) {
            that.messages.splice(0, that.messages.length);
            that.showMessage(JSON.parse(message.body).user, JSON.parse(message.body).message, JSON.parse(message.body).dateTime, JSON.parse(message.body).type);
          }
        } else {
          if(JSON.parse(message.body).type == 'MESSAGE') {
            that.notificationRoom.set(JSON.parse(message.body).room, true);
            that.browserService.setNewMessage(true);
          }
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

  showMessage(user, message, dateTime, type) {
    let newMessage : Message = {
      user: user,
      room: this.room,
      message: message,
      type: type,
      dateTime: formatDate(dateTime, 'dd.MM HH:mm', 'en')
    };
    this.messages.push(newMessage);
  }

  sendMessage() {
    let messageToSend : Message = {
      user: this.user,
      room: this.room,
      message: this.yourMessage,
      type: null,
      dateTime: null
    };
    this.stompClient.send("/app/chat/" + this.room, {}, JSON.stringify(messageToSend));
    this.yourMessage = "";
  }

  updateRoom(room: string) {
    this.room = room;
    this.messages.splice(0, this.messages.length);
    this.getAllMessages();
    if(this.notificationRoom.get(room))
      this.notificationRoom.set(room, false);
  }

  getUser() {
    this.userService.getUserByLogin(this.tokenService.getLogin()).subscribe(n => {
      this.checkBan(n);
      this.user = n;
      this.user.active = true;
      this.userService.setActive(this.user).subscribe(n => {
        this.user = n;
      });
      this.getAllMessages();
    });
  }

  checkBan(user: User) {
    this.banService.getBanByUser(user.login).subscribe(n => {
      if (n != null) {
        if (n.type == 'BAN')
          this.router.navigateByUrl('/ban');
        else if (n.type == 'MUTE') {
          this.muted = n;
          this.muted.end = formatDate(n.end, 'dd.MM.yyyy HH:mm', 'en');
        }
      }
    });
  }

  checkMutedIsEnd() {
    if (new Date(this.muted.end) <= new Date()) {
      this.muted = null;
    }
  }

  getAllMessages() {
    this.http.get<Message[]>(environment.mainURL + "/api/chat/" + this.room + "/" + this.user.login).subscribe(n => {
      this.messages = n;
      for (let message of this.messages) {
        message.dateTime = formatDate(message.dateTime, 'dd.MM HH:mm', 'en');
      }
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
    if (this.muted != null)
      this.checkMutedIsEnd();
  }

  addEmoji(emoji) {
    this.yourMessage += emoji.emoji.native;
  }
}

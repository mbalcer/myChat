import {AfterViewInit, Component, Input, OnChanges, OnDestroy, SimpleChanges} from '@angular/core';
import {User} from "../../model/user";
import {RoomsService} from "../../service/rooms.service";
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements AfterViewInit, OnChanges, OnDestroy {
  private serverUrl = environment.mainURL + "/chat";
  private stompClient;
  isListObserver: boolean = false;

  users: User[] = [];

  @Input() room: string;

  constructor(private roomService: RoomsService) { }

  ngAfterViewInit(): void {
    this.getUsersList();
    this.listObserver();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getUsersList();
    this.listDisconnect();
    this.listObserver();
  }

  ngOnDestroy(): void {
    this.listDisconnect();
  }

  getUsersList() {
    this.roomService.getUsersList(this.room).subscribe(n => {
      this.users = n;
    });
  }

  listObserver() {
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let client = this.stompClient;
    let that = this;
    client.connect({}, function (frame) {
      that.isListObserver = true;
      client.subscribe("/users-list/" + that.room, function (message) {
        that.getUsersList();
      });
    });
  }

  listDisconnect() {
    if (this.isListObserver) {
      this.stompClient.disconnect("/users-list/" + this.room);
      this.isListObserver = false;
    }
  }
}

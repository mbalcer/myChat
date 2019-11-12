import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from "../../model/user";
import {RoomsService} from "../../service/rooms.service";

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {
  rooms: string[] = [];
  login: string;

  @Input() user: User;
  @Output() room: EventEmitter<string> = new EventEmitter();

  constructor(private roomService: RoomsService) {
    this.rooms.push("All");
  }

  ngOnInit() {
    if (this.user != null)
      this.getAllRoomsUser();
  }

  getAllRoomsUser() {
    this.roomService.getRoomsByUser(this.user.login).subscribe(
      n => {
        this.rooms = this.rooms.concat(n);
      }, error => {
        alert("An error has occurred");
      }
    )
  }

  changeRoom(room: string) {
    this.room.emit(room);
  }
}

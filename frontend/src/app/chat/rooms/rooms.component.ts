import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from "../../model/user";
import {RoomsService} from "../../service/rooms.service";
import {Room} from "../../model/room";
import {MatDialog, MatIconRegistry} from "@angular/material";
import {DomSanitizer} from "@angular/platform-browser";
import {DialogAddRoom} from "./dialogs/dialog-add-room/dialog-add-room";

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {
  rooms: string[] = [];
  login: string;
  createRoomName: string;

  @Input() user: User;
  @Output() room: EventEmitter<string> = new EventEmitter();

  constructor(private roomService: RoomsService, public dialog: MatDialog, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    this.rooms.push("All");
    iconRegistry.addSvgIcon(
      'remove',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/remove.svg'));
    iconRegistry.addSvgIcon(
      'add',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/add.svg'));
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

  addRoom() {
    this.roomService.getRoomByName(this.createRoomName).subscribe(
      n => {
        if (n == null) {
          this.saveRoom();
        } else {
          alert("Room about this name already exists");
        }
      }, error => {
        alert("An error has occurred");
      });
  }

  saveRoom() {
    let newRoom: Room = {
      name: this.createRoomName,
      users: [this.user]
    };

    this.roomService.saveRoom(newRoom).subscribe(
      n => {
        this.rooms.push(n.name);
      }, error => {
        alert("An error has occurred");
      });
  }

  openDialogToAddRoom(): void {
    const dialogRef = this.dialog.open(DialogAddRoom, {
      width: '250px',
      data: {name: this.createRoomName}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.createRoomName = result;
      this.addRoom();
    });
  }

  leaveFromRoom(room: string) {
    if (confirm("Are you sure that you want leave from this room?")) {
      this.roomService.removeUserFromRoom(room, this.user).subscribe(
        n => {
          let indexOfRoom = this.rooms.indexOf(room);
          this.rooms.splice(indexOfRoom, 1);
        }, error => {
          alert("An error has occurred");
        }
      );
    }
  }
}

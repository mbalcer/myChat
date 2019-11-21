import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {User} from "../../model/user";
import {RoomsService} from "../../service/rooms.service";
import {Room} from "../../model/room";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";

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

  constructor(private roomService: RoomsService, public dialog: MatDialog) {
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

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddRoom, {
      width: '250px',
      data: {name: this.createRoomName}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.createRoomName = result;
      this.addRoom();
    });
  }
}

@Component({
  selector: 'dialog-add-room',
  templateUrl: 'dialog-add-room.html',
})
export class DialogAddRoom {

  constructor(
    public dialogRef: MatDialogRef<DialogAddRoom>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

export interface DialogData {
  name: string;
}

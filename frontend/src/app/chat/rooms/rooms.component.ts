import {AfterViewChecked, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {User} from "../../model/user";
import {RoomsService} from "../../service/rooms.service";
import {Room} from "../../model/room";
import {MatDialog, MatIconRegistry} from "@angular/material";
import {DomSanitizer} from "@angular/platform-browser";
import {DialogAddRoom} from "./dialogs/dialog-add-room/dialog-add-room";
import {Subscription, timer} from "rxjs";

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements AfterViewChecked, OnDestroy, OnInit {
  rooms: string[] = [];
  login: string;
  createRoomName: string;
  searchText: string;
  initAllRooms: boolean = false;
  subCheckRooms: Subscription;
  currentRoom: string = "All";

  @Input() user: User;
  @Input() notificationRoom;
  @Output() room: EventEmitter<string> = new EventEmitter();
  @Output() openRoom: EventEmitter<string> = new EventEmitter();
  @Output() closeRoom: EventEmitter<string> = new EventEmitter();

  constructor(private roomService: RoomsService, public dialog: MatDialog, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    this.rooms.push("All");
    iconRegistry.addSvgIcon('remove', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/remove.svg'));
    iconRegistry.addSvgIcon('add', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/add.svg'));
    iconRegistry.addSvgIcon('notification', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/notification.svg'));
  }

  ngAfterViewChecked(): void {
    if (!this.initAllRooms) {
      this.getAllRoomsUser();
      this.initAllRooms = true;
    }
  }

  ngOnInit(): void {
    const ti = timer(2000, 20000);
    this.subCheckRooms = ti.subscribe(t => {
      this.roomService.getRoomsByUser(this.user.login).subscribe(n => {
        let newRooms = n.filter(r => !(this.rooms.includes(r)));
        let removeRoom = this.rooms.filter(r => !(n.includes(r)) && r != 'All');
        if(newRooms.length > 0) {
          this.rooms = this.rooms.concat(newRooms);
          for (let room of newRooms) {
            this.openRoom.emit(room);
          }
        }
        if(removeRoom.length > 0) {
          for(let room of removeRoom) {
            this.rooms.splice(this.rooms.indexOf(room), 1);
            this.closeRoom.emit(room);
            if (this.currentRoom == room)
              this.changeRoom("All");
          }
        }
      });
    });
  }

  ngOnDestroy() {
    this.subCheckRooms.unsubscribe();
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
    this.currentRoom = room;
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

    this.openRoom.emit(newRoom.name);
  }

  openDialogToAddRoom(): void {
    const dialogRef = this.dialog.open(DialogAddRoom, {
      width: '250px',
      data: {name: ''}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.createRoomName = result;
        this.addRoom();
      }
    });
  }

  leaveFromRoom(room: string) {
    if (confirm("Are you sure that you want leave from this room?")) {
      this.roomService.removeUserFromRoom(room, this.user).subscribe(
        n => {
          let indexOfRoom = this.rooms.indexOf(room);
          this.rooms.splice(indexOfRoom, 1);
          if (this.currentRoom == room)
            this.changeRoom("All");
        }, error => {
          alert("An error has occurred");
        }
      );
      this.closeRoom.emit(room);
    }
  }
}

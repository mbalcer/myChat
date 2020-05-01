import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {User} from "../../model/user";
import {RoomsService} from "../../service/rooms.service";

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnChanges {

  users: User[] = [];

  @Input() room: string;
  offline: any;

  constructor(private roomService: RoomsService) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.getUsersList();
  }

  getUsersList() {
    this.roomService.getUsersList(this.room).subscribe(n => {
      this.users = n;
    });
  }
}

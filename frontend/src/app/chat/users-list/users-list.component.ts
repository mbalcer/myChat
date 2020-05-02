import {AfterViewInit, Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {User} from "../../model/user";
import {RoomsService} from "../../service/rooms.service";

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements AfterViewInit, OnChanges {

  users: User[] = [];

  @Input() room: string;

  constructor(private roomService: RoomsService) { }

  ngAfterViewInit(): void {
    this.getUsersList();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getUsersList();
  }

  getUsersList() {
    this.roomService.getUsersList(this.room).subscribe(n => {
      this.users = n;
    });
  }
}

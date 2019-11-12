import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {
  rooms: string[] = [];

  constructor() {
    this.rooms.push("All");
  }

  ngOnInit() {
  }

  changeRoom(room: string) {

  }
}

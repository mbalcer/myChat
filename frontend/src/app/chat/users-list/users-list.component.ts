import {Component, OnInit} from '@angular/core';
import {User} from "../../model/user";

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  users: User[] = [
    {login: "jan123", password: "", email: "", color: "#123456", role: "user"},
    {login: "nowcio23", password: "", email: "", color: "#abcdef", role: "user"},
    {login: "jgaregaw23", password: "", email: "", color: "#432689", role: "user"},
    {login: "sucahrex", password: "", email: "", color: "#312853", role: "user"},
  ];

  constructor() { }

  ngOnInit() {
  }

}

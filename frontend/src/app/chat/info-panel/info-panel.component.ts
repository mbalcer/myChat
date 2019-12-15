import {Component, OnInit} from '@angular/core';
import {User} from "../../model/user";

@Component({
  selector: 'app-info-panel',
  templateUrl: './info-panel.component.html',
  styleUrls: ['./info-panel.component.css']
})
export class InfoPanelComponent implements OnInit {
  user: User;

  constructor() {
    this.user = {
      login: "Mateusz",
      password: null,
      email: null,
      color: null
    }
  }

  ngOnInit() {
  }

}

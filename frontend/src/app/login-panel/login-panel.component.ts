import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-login-panel',
  templateUrl: './login-panel.component.html',
  styleUrls: ['./login-panel.component.css']
})
export class LoginPanelComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  togglePanel() {
    $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
  }
}

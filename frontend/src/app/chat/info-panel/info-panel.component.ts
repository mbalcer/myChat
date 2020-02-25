import {Component, Input, OnInit} from '@angular/core';
import {User} from "../../model/user";
import {AuthenticateService} from "../../service/authenticate.service";

@Component({
  selector: 'app-info-panel',
  templateUrl: './info-panel.component.html',
  styleUrls: ['./info-panel.component.css']
})
export class InfoPanelComponent implements OnInit {
  @Input() user: User;

  constructor(private authenticateService: AuthenticateService) {
  }

  ngOnInit() {
  }

  signOut() {
    this.authenticateService.signOut();
  }
}

import {Component, Input, OnInit} from '@angular/core';
import {User} from "../../model/user";
import {TokenService} from "../../service/token.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-info-panel',
  templateUrl: './info-panel.component.html',
  styleUrls: ['./info-panel.component.css']
})
export class InfoPanelComponent implements OnInit {
  @Input() user: User;

  constructor(private tokenService: TokenService, private router: Router) {
  }

  ngOnInit() {
  }

  signOut() {
    this.tokenService.removeToken();
    this.router.navigateByUrl("");
  }
}

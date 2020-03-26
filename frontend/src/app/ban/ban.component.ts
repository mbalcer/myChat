import {Component, OnInit} from '@angular/core';
import {TokenService} from "../service/token.service";
import {BanService} from "../service/ban.service";
import {Ban} from "../model/ban";
import {Router} from "@angular/router";
import {formatDate} from "@angular/common";

@Component({
  selector: 'app-ban',
  templateUrl: './ban.component.html',
  styleUrls: ['./ban.component.css']
})
export class BanComponent implements OnInit {
  userLogin: string;
  ban: Ban = null;

  constructor(private tokenService: TokenService, private banService: BanService, private router: Router) {
    this.userLogin = this.tokenService.getLogin();
    this.banService.getBanByUser(this.userLogin).subscribe(n => {
      if (n == null)
        this.router.navigateByUrl("/chat");
      else {
        this.ban = n;
        this.ban.end = formatDate(n.end, 'dd.MM.yyyy HH:mm', 'en');
      }
    });
  }

  ngOnInit() {
  }

  backToLogin() {
    this.tokenService.removeToken();
    this.router.navigateByUrl('');
  }

}

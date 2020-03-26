import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Ban} from "../model/ban";

@Injectable({
  providedIn: 'root'
})
export class BanService {
  private BAN_URL = environment.mainURL + "/ban";
  private GET_BAN_BY_USER_URL = `${this.BAN_URL}/now/byUser/`;

  constructor(private http: HttpClient) {
  }

  getBanByUser(userLogin: string): Observable<Ban> {
    return this.http.get<Ban>(this.GET_BAN_BY_USER_URL + userLogin);
  }
}

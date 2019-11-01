import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../model/user";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private MAIN_URL = "http://localhost:8080/users";
  private POST_USER_URL = `${this.MAIN_URL}`;

  constructor(private http: HttpClient) {
  }

  postUser(user: User): Observable<any> {
    return this.http.post(this.POST_USER_URL, user);
  }
}

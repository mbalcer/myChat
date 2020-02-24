import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../model/user";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private USER_URL = environment.mainURL + "/users";
  private POST_USER_URL = `${this.USER_URL}`;
  private GET_USER_BY_LOGIN_URL = `${this.USER_URL}/byLogin/`;
  private GET_USER_BY_EMAIL_URL = `${this.USER_URL}/byEmail/`;
  private CHANGE_COLOR_URL = `${this.USER_URL}/color`;

  constructor(private http: HttpClient) {
  }

  postUser(user: User): Observable<User> {
    return this.http.post<User>(this.POST_USER_URL, user);
  }

  getUserByLogin(login: string): Observable<User> {
    return this.http.get<User>(this.GET_USER_BY_LOGIN_URL + login);
  }

  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(this.GET_USER_BY_EMAIL_URL + email);
  }

  changeColor(user: User): Observable<User> {
    return this.http.put<User>(this.CHANGE_COLOR_URL, user);
  }
}

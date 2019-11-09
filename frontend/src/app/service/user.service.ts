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
  private GET_USER_BY_LOGIN_URL = `${this.MAIN_URL}/byLogin/`;
  private GET_USER_BY_EMAIL_URL = `${this.MAIN_URL}/byEmail/`;

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
}

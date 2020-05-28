import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../model/user";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {UserLoginViewModel, UserRegisterViewModel} from "../login-panel/login-panel.component";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private USER_URL = environment.mainURL + "/users";
  private GET_USER_BY_LOGIN_URL = `${this.USER_URL}/byLogin/`;
  private CHANGE_COLOR_URL = `${this.USER_URL}/color`;
  private CHANGE_PASSWORD_URL = `${this.USER_URL}/password/`;
  private SET_ACTIVE_USER_URL = `${this.USER_URL}/active`;
  private SIGN_UP_URL = `${this.USER_URL}/signUp`;
  private SIGN_IN_URL = `${this.USER_URL}/signIn`;

  constructor(private http: HttpClient) {
  }

  getUserByLogin(login: string): Observable<User> {
    return this.http.get<User>(this.GET_USER_BY_LOGIN_URL + login);
  }

  changeColor(user: User): Observable<User> {
    return this.http.put<User>(this.CHANGE_COLOR_URL, user);
  }

  changePassword(user: User, password: string) {
    return this.http.put<User>(this.CHANGE_PASSWORD_URL + password, user);
  }

  setActive(user: User): Observable<User> {
    return this.http.put<User>(this.SET_ACTIVE_USER_URL, user);
  }

  signUp(user: UserRegisterViewModel): Observable<User> {
    return this.http.post<User>(this.SIGN_UP_URL, user);
  }

  signIn(user: UserLoginViewModel): Observable<User> {
    return this.http.post<User>(this.SIGN_IN_URL, user);
  }
}

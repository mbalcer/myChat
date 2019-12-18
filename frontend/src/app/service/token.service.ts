import {Injectable} from '@angular/core';

const TOKEN = 'USER';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() {
  }

  setToken(token: string): void {
    localStorage.setItem(TOKEN, token);
  }

  isLogged() {
    return localStorage.getItem(TOKEN) != null;
  }
}

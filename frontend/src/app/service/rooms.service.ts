import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RoomsService {
  private MAIN_URL = "http://localhost:8080/rooms";
  private GET_ROOMS_BY_USER = `${this.MAIN_URL}/byUser/`;

  constructor(private http: HttpClient) {
  }

  getRoomsByUser(user: string): Observable<String[]> {
    return this.http.get<String[]>(this.GET_ROOMS_BY_USER + user);
  }
}

import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Room} from "../model/room";

@Injectable({
  providedIn: 'root'
})
export class RoomsService {
  private MAIN_URL = "http://localhost:8080/rooms";
  private POST_ROOM_URL = `${this.MAIN_URL}`;
  private GET_ROOMS_BY_USER = `${this.MAIN_URL}/byUser/`;

  constructor(private http: HttpClient) {
  }

  getRoomsByUser(user: string): Observable<string[]> {
    return this.http.get<string[]>(this.GET_ROOMS_BY_USER + user);
  }

  saveRoom(room: Room): Observable<Room> {
    return this.http.post<Room>(this.POST_ROOM_URL, room);
  }
}

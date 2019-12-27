import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Room} from "../model/room";
import {User} from "../model/user";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class RoomsService {
  private ROOM_URL = environment.mainURL + "/rooms";
  private POST_ROOM_URL = `${this.ROOM_URL}`;
  private GET_ROOMS_BY_USER_URL = `${this.ROOM_URL}/byUser/`;
  private GET_ROOM_BY_NAME_URL = `${this.ROOM_URL}/byName/`;
  private ADD_USER_TO_ROOM_URL = `${this.ROOM_URL}/add/`;
  private REMOVE_USER_FROM_ROOM_URL = `${this.ROOM_URL}/remove/`;

  constructor(private http: HttpClient) {
  }

  getRoomsByUser(user: string): Observable<string[]> {
    return this.http.get<string[]>(this.GET_ROOMS_BY_USER_URL + user);
  }

  saveRoom(room: Room): Observable<Room> {
    return this.http.post<Room>(this.POST_ROOM_URL, room);
  }

  getRoomByName(name: string): Observable<string> {
    return this.http.get<string>(this.GET_ROOM_BY_NAME_URL + name);
  }

  addUserToRoom(room: string, user: User): Observable<any> {
    return this.http.put<any>(this.ADD_USER_TO_ROOM_URL + room, user);
  }

  removeUserFromRoom(room: string, user: User): Observable<any> {
    return this.http.put<any>(this.REMOVE_USER_FROM_ROOM_URL + room, user);
  }
}

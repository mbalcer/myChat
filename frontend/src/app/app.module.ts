import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {PickerModule} from "@ctrl/ngx-emoji-mart";
import {ColorPickerModule} from "ngx-color-picker";
import {HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HeaderWebComponent} from './login-panel/header-web/header-web.component';
import {ChatComponent} from './chat/chat.component';
import {LoginPanelComponent} from './login-panel/login-panel.component';
import {RoomsComponent} from './chat/rooms/rooms.component';
import {DialogAddRoom} from "./chat/rooms/dialogs/dialog-add-room/dialog-add-room";
import {DemoMaterialModule} from "./material-module";
import {DialogAddUserToRoom} from './chat/rooms/dialogs/dialog-add-user-to-room/dialog-add-user-to-room';
import {SearchRoomPipe} from './pipes/search-room.pipe';
import {InfoPanelComponent} from './chat/info-panel/info-panel.component';
import {NeedAuthGuard} from "./service/need-auth-guard";
import {UserProfileComponent} from './user-profile/user-profile.component';
import {BanComponent} from './ban/ban.component';
import {UsersListComponent} from './chat/users-list/users-list.component';
import {ActiveUsersPipe} from './pipes/active-users.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HeaderWebComponent,
    ChatComponent,
    LoginPanelComponent,
    RoomsComponent,
    DialogAddRoom,
    DialogAddUserToRoom,
    SearchRoomPipe,
    InfoPanelComponent,
    UserProfileComponent,
    BanComponent,
    UsersListComponent,
    ActiveUsersPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    DemoMaterialModule,
    ColorPickerModule,
    PickerModule
  ],
  providers: [NeedAuthGuard],
  bootstrap: [AppComponent],
  entryComponents: [RoomsComponent, DialogAddRoom, DialogAddUserToRoom],
})
export class AppModule { }

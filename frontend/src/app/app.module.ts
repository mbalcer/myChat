import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from "@angular/forms";

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HeaderWebComponent} from './login-panel/header-web/header-web.component';
import {ChatComponent} from './chat/chat.component';
import {LoginPanelComponent} from './login-panel/login-panel.component';
import {HttpClientModule} from "@angular/common/http";
import {RoomsComponent} from './chat/rooms/rooms.component';
import {DialogAddRoom} from "./chat/rooms/dialogs/dialog-add-room/dialog-add-room";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DemoMaterialModule} from "./material-module";
import {DialogAddUserToRoom} from './chat/rooms/dialogs/dialog-add-user-to-room/dialog-add-user-to-room';
import {SearchRoomPipe} from './pipes/search-room.pipe';
import {InfoPanelComponent} from './chat/info-panel/info-panel.component';
import {NeedAuthGuard} from "./service/need-auth-guard";
import {UserProfileComponent} from './user-profile/user-profile.component';
import {ColorPickerModule} from "ngx-color-picker";

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
    UserProfileComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    DemoMaterialModule,
    ColorPickerModule
  ],
  providers: [NeedAuthGuard],
  bootstrap: [AppComponent],
  entryComponents: [RoomsComponent, DialogAddRoom, DialogAddUserToRoom],
})
export class AppModule { }

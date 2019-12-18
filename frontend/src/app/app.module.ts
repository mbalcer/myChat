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
import {RouterModule, Routes} from "@angular/router";

const appRoutes: Routes = [
  {
    path: 'chat',
    component: ChatComponent,
    // canActivate: [NeedAuthGuard] // <---- connected Route with guard
  },
  {
    path: '',
    component: LoginPanelComponent
  },
];

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
    InfoPanelComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    DemoMaterialModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [RoomsComponent, DialogAddRoom, DialogAddUserToRoom],
})
export class AppModule { }

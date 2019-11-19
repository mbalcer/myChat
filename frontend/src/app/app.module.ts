import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from "@angular/forms";

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HeaderWebComponent} from './header-web/header-web.component';
import {ChatComponent} from './chat/chat.component';
import {LoginPanelComponent} from './login-panel/login-panel.component';
import {HttpClientModule} from "@angular/common/http";
import {DialogAddRoom, RoomsComponent} from './chat/rooms/rooms.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DemoMaterialModule} from "./material-module";


@NgModule({
  declarations: [
    AppComponent,
    HeaderWebComponent,
    ChatComponent,
    LoginPanelComponent,
    RoomsComponent,
    DialogAddRoom
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    DemoMaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [RoomsComponent, DialogAddRoom],
})
export class AppModule { }

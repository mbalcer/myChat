import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from "@angular/forms";

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HeaderWebComponent} from './header-web/header-web.component';
import {ChatComponent} from './chat/chat.component';
import {LoginPanelComponent} from './login-panel/login-panel.component';
import {HttpClientModule} from "@angular/common/http";
import {RoomsComponent} from './chat/rooms/rooms.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderWebComponent,
    ChatComponent,
    LoginPanelComponent,
    RoomsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

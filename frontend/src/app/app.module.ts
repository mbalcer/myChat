import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderWebComponent } from './header-web/header-web.component';
import { ChatComponent } from './chat/chat.component';
import { LoginPanelComponent } from './login-panel/login-panel.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderWebComponent,
    ChatComponent,
    LoginPanelComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

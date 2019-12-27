import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ChatComponent} from "./chat/chat.component";
import {NeedAuthGuard} from "./service/need-auth-guard";
import {LoginPanelComponent} from "./login-panel/login-panel.component";


const routes: Routes = [
  {
    path: 'chat',
    component: ChatComponent,
    canActivate: [NeedAuthGuard]
  },
  {
    path: '',
    component: LoginPanelComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

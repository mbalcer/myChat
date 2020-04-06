import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ChatComponent} from "./chat/chat.component";
import {NeedAuthGuard} from "./service/need-auth-guard";
import {LoginPanelComponent} from "./login-panel/login-panel.component";
import {UserProfileComponent} from "./user-profile/user-profile.component";
import {BanComponent} from "./ban/ban.component";


const routes: Routes = [
  {
    path: 'profile',
    component: UserProfileComponent,
    canActivate: [NeedAuthGuard]
  },
  {
    path: 'chat',
    component: ChatComponent,
    canActivate: [NeedAuthGuard]
  },
  {
    path: '',
    component: LoginPanelComponent
  },
  {
    path: 'ban',
    component: BanComponent,
    canActivate: [NeedAuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

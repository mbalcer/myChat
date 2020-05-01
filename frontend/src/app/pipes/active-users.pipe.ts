import {Pipe, PipeTransform} from '@angular/core';
import {User} from "../model/user";

@Pipe({
  name: 'activeUsers'
})
export class ActiveUsersPipe implements PipeTransform {

  transform(users: User[], active:boolean): any {
    return users.filter(u => u.active == active);
  }

}

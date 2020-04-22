import {Injectable} from '@angular/core';
import {Title} from "@angular/platform-browser";

@Injectable({
  providedIn: 'root'
})
export class BrowserService{

  private hasFocus: boolean = false;
  private newMessage: boolean = false;

  constructor(private titleService: Title) {
    window.addEventListener("blur", n => {
      this.hasFocus = false;
    });
    window.addEventListener("focus", n => {
      this.hasFocus = true;
      if(this.newMessage) {
        this.titleService.setTitle("myChat");
        this.newMessage = false;
      }
    });
  }

  public setNewMessage(isNewMessage: boolean) {
    if(!this.hasFocus && isNewMessage) {
        this.titleService.setTitle("(1) myChat");
        this.newMessage = true;
    }
  }
}

import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {User} from "../../../../model/user";
import {UserService} from "../../../../service/user.service";

@Component({
  selector: 'app-dialog-add-user-to-room',
  templateUrl: './dialog-add-user-to-room.html'
})
export class DialogAddUserToRoom {
  userLogin: string;
  invalidUser: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DialogAddUserToRoom>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private userService: UserService
  ) {
    data.addedUsers = [];
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addUserToRoom() {
    this.userService.getUserByLogin(this.userLogin).subscribe(n => {
      if (n != null) {
        let user: User = n;
        this.data.addedUsers.push(user);
      } else {
        this.invalidUser = true;
      }
    });
  }
}


export interface DialogData {
  room: string;
  addedUsers: User[];
}

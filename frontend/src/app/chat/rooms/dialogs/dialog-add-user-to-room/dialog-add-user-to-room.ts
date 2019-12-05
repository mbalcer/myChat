import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {DialogData} from "../dialog-add-room/dialog-add-room";
import {User} from "../../../../model/user";

@Component({
  selector: 'app-dialog-add-user-to-room',
  templateUrl: './dialog-add-user-to-room.html'
})
export class DialogAddUserToRoom {
  user: User;

  constructor(
    public dialogRef: MatDialogRef<DialogAddUserToRoom>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addUserToRoom() {

  }
}


export interface DialogData {
  room: string;
  addedUsers: User[];
}

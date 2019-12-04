import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

@Component({
  selector: 'dialog-add-room',
  templateUrl: 'dialog-add-room.html',
})
export class DialogAddRoom {

  constructor(
    public dialogRef: MatDialogRef<DialogAddRoom>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

export interface DialogData {
  name: string;
}

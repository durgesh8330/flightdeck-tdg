import {Component, OnInit, Inject, EventEmitter} from '@angular/core';
import {MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'dialog-add-attribute',
  templateUrl: 'add-attribute-modal.html'
})
export class AddAttributeDialog {
  selectedAttribute: any;
  onAttributeAdded = new EventEmitter();
  constructor(
    public dialogRef: MatDialogRef<AddAttributeDialog>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) {}

  closeModal(): boolean {
    this.dialogRef.close();
    return false;
  }

  onAttrSubmit() {
    if (this.selectedAttribute) {
      this.dialogRef.close();
      this.onAttributeAdded.emit({result:this.selectedAttribute,dialogData:this.dialogData});
    }
  }
}

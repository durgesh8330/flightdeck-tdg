import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';

@Component({
  selector: 'sa-conf-dialog',
  templateUrl: './conf-dialog.component.html',
  styleUrls: ['./conf-dialog.component.css']
})
export class ConfDialogComponent implements OnInit {
  displayDetails: any = {};

  constructor(
    public dialogRef: MatDialogRef<ConfDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public snackBar: MatSnackBar,
  ) {
    this.displayDetails = this.data;
  }

  ngOnInit() {
  }

  onSave() {
    this.dialogRef.close();
  }
}

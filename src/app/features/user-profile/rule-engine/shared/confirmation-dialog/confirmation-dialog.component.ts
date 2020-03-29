import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'sa-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {

  public confirmMessage:string;
  public alert:boolean;
  public errorMessage:string;
  
  constructor(public matDialogRef : MatDialogRef<ConfirmationDialogComponent>) {
    
  }

  ngOnInit() {
  }


}

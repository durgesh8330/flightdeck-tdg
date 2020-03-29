import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';

import { TaskService } from '../../task.service';
import { SPRTaskComponent } from '../sprtask.component';

@Component({
  selector: 'sa-sprtaskcanceldialog',
  templateUrl: './sprtaskcanceldialog.component.html',
  styleUrls: ['./sprtaskcanceldialog.component.css']
})
export class SprtaskcanceldialogComponent implements OnInit {

  reason = '';
  constructor(
    public dialogRef: MatDialogRef<SPRTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private taskService: TaskService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close({'reason': this.reason});
    /* this.taskService.updateSprDueTask(localStorage.getItem('AutopilotTaskinstid'), 1, '', this.reason).toPromise().then((res) => {
      console.log(res);
      this.data = res;
      // this.snackBar.open(res['message'], 'Okay', {
      //   duration: 15000
      // });
      console.log("data.taskInstParams ==> ",this.data.taskInstParams);
      this.dialogRef.close(res);
      
      
    }); */
    // this.taskService.SaveCancelReasonSubmit(this.reason).toPromise().then((res) => {
    //   this.dialogRef.close(res);
    // });
    // console.log("Save called : ",this.selectedDate);
    // this.dialogRef.close(this.selectedDate.getFullYear() +"/"+ (this.selectedDate.getMonth() + 1)+"/"+ this.selectedDate.getDate());
  }

}

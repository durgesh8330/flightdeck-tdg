import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';

import { TaskService } from '../../task.service';
import { SPRTaskComponent } from '../sprtask.component';

@Component({
  selector: 'sa-sprtaskdialog',
  templateUrl: './sprtaskdialog.component.html',
  styleUrls: ['./sprtaskdialog.component.css'],
  providers: [DatePipe],
  encapsulation: ViewEncapsulation.None,
})
export class SprtaskdialogComponent implements OnInit {

  public todayDate = new Date();
  public afterDate = new Date();
  public selectedDate: Date;
  Reason: any;
  public taskInstanceId: String = localStorage.getItem('AutopilotAppTaskInstanceId');
  public taskName: String = localStorage.getItem('taskName');
  dueDate:Date;
  // dateClass: any;

  constructor(
    public dialogRef: MatDialogRef<SPRTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private taskService: TaskService,
    public datepipe: DatePipe,
    private snackBar: MatSnackBar
  ) { 
    console.log(this.data);
    this.dueDate = this.data.dueDate ? new Date(this.data.dueDate) : new Date(); //.replace(/-/g, '\/')
    this.afterDate = this.data.dueDate ? new Date(this.data.dueDate) : new Date();
    console.log(this.dueDate);
  }

  // dateClass = (d: Date) => {
  //   let dayToIncrease = 0;
  //   const date = d.getDate();
  //   if (this.taskName == 'UNI')
  //     dayToIncrease = 7;
  //   if (this.taskName == 'OVC')
  //     dayToIncrease = 5;

  //   if (this.dueDate.getHours() >= 12) {
  //     dayToIncrease += 1;
  //   }

  //   for (let i = 1; i <= dayToIncrease; i++) {
  //     console.log(this.dueDate.getDate() + i);
  //   }
  //   // Highlight the 1st and 20th day of each month.
  //   return (date === 1 || date === 20) ? 'example-custom-date-class' : undefined;
  // }

  dateClass = (d: Date) => {
    const date = d.getDate();

    // Highlight the 1st and 20th day of each month.
    return (date === 1 || date === 20) ? 'example-custom-date-class' : undefined;
  }

  ngOnInit() {
    let dayToIncrease = 0;
    // const isOvc = this.taskInstanceId.match(/OVC/i);
    // if (isOvc === null) {
    //   dayToIncrease = 7;
    // }
    console.log(this.taskName);
    if (this.taskName == 'UNI')
      dayToIncrease = 7;
    if (this.taskName == 'OVC')
      dayToIncrease = 5;

    if (this.dueDate.getHours() >= 12) {
      dayToIncrease += 1;
    }
    
    // this.dateClass = (d: Date) => {
    //   const date = d.getDate();
  
    //   // Highlight the 1st and 20th day of each month.
    //   return (date === 1 || date === 20) ? 'example-custom-date-class' : undefined;
    // }

    // console.log(this.dateClass);
    
    this.afterDate.setDate(this.dueDate.getDate() + dayToIncrease);
    console.log(this.afterDate);
    this.selectedDate = this.dueDate;
    console.log("Today Date : ", this.todayDate);
    console.log("After Date : ", this.afterDate);
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    console.log("Save called : ",this.datepipe.transform(this.selectedDate, 'yyy-MM-dd'), this.Reason);
    this.dialogRef.close({'date': this.datepipe.transform(this.selectedDate, 'yyy-MM-dd'), 'reason': this.Reason});
    /* this.taskService.updateSprDueTask(localStorage.getItem('AutopilotTaskinstid'), 2, this.datepipe.transform(this.selectedDate, 'yyy-MM-dd'), '').toPromise().then((res) => {
      console.log(res);
      this.data = res;
      
      this.dialogRef.close(this.data);
      // this.snackBar.open(res['message'], 'Okay', {
      //   duration: 15000,
      //   verticalPosition:'top',
      //   panelClass:'style-success'
      // });

      
      // this.snackBar.open(res['message'], 'Okay', {
      //   duration: 15000
      // });
      //console.log("data.taskInstParams ==> ",this.data.taskInstParams);
      this.dialogRef.close(res);
    }); */
    // this.dialogRef.close(this.selectedDate.getFullYear() +"/"+ (this.selectedDate.getMonth() + 1)+"/"+ this.selectedDate.getDate());
  }

}

import { Component, OnInit, Inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { TaskDetailsComponent } from '../task-details/task-details.component';
import { TaskService } from "@app/features/task/task.service";

@Component({
  selector: 'sa-sme-task-assign',
  templateUrl: './sme-task-assign.component.html',
  styleUrls: ['./sme-task-assign.component.css']
})
export class SmeTaskAssignComponent implements OnInit {

  taskDetails: any = {};
  ShowGroup = 'cuid';
  workgroupList: any = [];
  cuid: any;
  public options: any;
  requestData: any;

  constructor(
    public dialogRef: MatDialogRef<TaskDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private taskService: TaskService,
    public snackBar: MatSnackBar,
  ) {
    this.taskDetails = this.data;
  }

  ngOnInit() {
    this.options = {
      multiple: true,
      tags: true
    };
    this.taskService.getWorkgroups().toPromise().then((res) => {
      this.workgroupList = res;
    }).catch((err: any) => {

    });
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onAssign(): void {
    console.log(this.ShowGroup, this.cuid);
    if (this.ShowGroup == 'workgroup') {
      this.requestData = {
        "action": "Dispatch",
        "workgroupList": []
       };
       this.cuid.forEach(element => {
         this.requestData.workgroupList.push({"workgroupName": element});
       });
    } else {
      this.requestData = {
        "action": "Assign",
        "assignCuid": this.cuid
       };
    }
    console.log(this.requestData);
    this.dialogRef.close(this.requestData);
  }

}

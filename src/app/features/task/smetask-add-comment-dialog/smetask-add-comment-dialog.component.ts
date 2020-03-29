import { Component, OnInit, Inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { TaskDetailsComponent } from '../task-details/task-details.component';
import { TaskService } from "@app/features/task/task.service";

@Component({
  selector: 'sa-smetask-add-comment-dialog',
  templateUrl: './smetask-add-comment-dialog.component.html',
  styleUrls: ['./smetask-add-comment-dialog.component.css']
})
export class SmetaskAddCommentDialogComponent implements OnInit {
  comment_text: any = "";
  taskDetails: any = {};

  constructor(
    public dialogRef: MatDialogRef<TaskDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private taskService: TaskService, public snackBar: MatSnackBar,
  ) {
    this.taskDetails = this.data;
  }

  ngOnInit() {
  }

  onSave(comment_text) {
    if (!comment_text || comment_text == "") {
      this.snackBar.open("Please enter comment text...", "Okay", {
        duration: 15000,
      });
      return false;
    }
    console.clear();
    console.log(this.taskDetails);
    let request_data: any = {
      comment_text: comment_text,
      id: this.taskDetails.id,
      createdById: this.taskDetails.createdById
    }
    this.dialogRef.close(request_data);
    /* this.taskService.TaskNotes(request_data).toPromise().then((response: any) => {
      this.snackBar.open(response.message, "Okay", {
        duration: 15000,
      });
      this.dialogRef.close(true);
    }).catch((error: any) => {
      console.error(error);
      this.snackBar.open("Error adding Task Comment..", "Okay", {
        duration: 15000,
      });
    }); */
    // /RestService/Enterprise/v2/Work/task/{id}/notes
  }

  onClose(): void {
    this.dialogRef.close();
  }

}

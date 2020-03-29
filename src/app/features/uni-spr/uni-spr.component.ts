import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatDialog } from '@angular/material';
import { UniSprService } from '@app/features/uni-spr/UniSprService.service';

@Component({
  selector: 'sa-uni-spr',
  templateUrl: './uni-spr.component.html',
  styleUrls: ['./uni-spr.component.css']
})
export class UniSprComponent implements OnInit {

  public loader = false;
  public taskDetails: any = {};
  public taskDetailsBackup: any = {};
  header: string;
  label: string;
  fieldName: string;
  fieldValue: string;
  editable: false;
  mandatory: false;
  type: string;

  constructor(private uniSprService: UniSprService,
              private snackBar: MatSnackBar,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.getUniSprForm();
  }


  getUniSprForm() {
    this.loader = true;
    this.uniSprService.getUniSprForm().toPromise().then((response: any) => {
      this.loader = false;
      this.taskDetails = response;
      this.populateValuesForLookup();
      this.taskDetails.taskSpecificFieldsList = [];
      this.taskDetailsBackup = JSON.parse(JSON.stringify(this.taskDetails));
    }).catch((error: any) => {
      this.loader = false;
      console.error(error);
      this.snackBar.open("Error loading Task Details..", "Okay", {
        duration: 15000,
      });
    });
  }

  populateValuesForLookup() {
    this.taskDetails.taskCommonFields.fieldList.forEach(field => {
      if(field.type === 'lookup'){
        this.uniSprService.getDropDownValues(field.service).toPromise().then((response: any)=>{
          field.dropdownList = response;
        });

      }
    })
  }

  createUniSprTask() {
    this.loader = true;
    this.uniSprService.createUniSprTask(this.taskDetails).toPromise().then((data: any)=>{
      this.loader = false;
      this.snackBar.open("UNI SPR Task Saved Suceessfuly", "Okay", {
        duration: 15000,
      });
    }).catch((error: any) =>{
      this.loader = false;
      this.snackBar.open("Error saving UNI SPR Task..", "Okay", {
        duration: 15000,
      });
    });
  }

  reset() {
    this.taskDetails = JSON.parse(JSON.stringify(this.taskDetailsBackup));
    this.populateValuesForLookup();
  }

}

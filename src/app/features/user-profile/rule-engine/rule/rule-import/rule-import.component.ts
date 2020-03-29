import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { RuleService } from '../../shared/services/rule/rule.service';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { ToasterModule, ToasterService, ToasterConfig} from 'angular2-toaster';
@Component({
  selector: 'sa-rule-import',
  templateUrl: './rule-import.component.html',
  styleUrls: ['./rule-import.component.css']
})
export class RuleImportComponent implements OnInit {

  selectedFiles: FileList;
  currentFileUpload: File;
  dialogRef: MatDialogRef<ConfirmationDialogComponent>;
  loader:boolean = false;
  public config1 : ToasterConfig = new ToasterConfig({
    positionClass: 'toast-top-full-width',
    animation: 'fade',
    timeout: 10000
  });
  
  constructor(private ruleService: RuleService, public dialog: MatDialog, private toasterService: ToasterService) { }

  ngOnInit() {

  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
  }

  upload() {
    this.loader = true;
    this.currentFileUpload = this.selectedFiles.item(0);
    this.ruleService.importRule(this.currentFileUpload).subscribe(result => {
      this.loader = false;
      this.toasterService.pop('success', result['code'], result['message']);
    }, error => {
      this.loader = false;
      this.openAlertDialog(error.error.message);
    });
    this.selectedFiles = undefined;
  }

  openConfirmationDialog() {
    
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '33.333%',
      disableClose: false
    });
    this.dialogRef.componentInstance.confirmMessage = "Are you sure you want to import as it may override existing rule and rule inputs ?"
    this.dialogRef.componentInstance.alert = false;
    this.dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.upload()
      }
      this.dialogRef = null;
    });
  }

  openAlertDialog(message:string) {
    
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '33.333%',
      disableClose: false
    });
    this.dialogRef.componentInstance.errorMessage = message;
    this.dialogRef.componentInstance.alert = true;
  }

  onClear ()
  {
    this.selectedFiles = undefined;
  }


}

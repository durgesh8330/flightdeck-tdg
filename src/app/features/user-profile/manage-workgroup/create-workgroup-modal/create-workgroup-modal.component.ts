import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { UserProfileService } from '../../user-profile.service';

@Component({
  selector: 'sa-create-workgroup-modal',
  templateUrl: './create-workgroup-modal.component.html',
  styleUrls: ['./create-workgroup-modal.component.scss']
})
export class CreateWorkgroupModalComponent implements OnInit {

  onCreateWorkgroup = new EventEmitter();
  public uiObject:any = {};
  constructor(@Inject(MAT_DIALOG_DATA) public workgroup: Workgroup_Dialog_Data,private userProfileService: UserProfileService) { 
    this.getTemplateData();
  }

  ngOnInit() { }

  closeModal(){
    this.onCreateWorkgroup.emit(this.workgroup);
  }
  getTemplateData(){
    this.userProfileService.getWorkgroupTemplateData("Add-Workgroup-Modal").toPromise().then((response:any)=>{
      Object.assign(this.uiObject,response.pageLayoutTemplate);
      this.uiObject = {
        'pageTitle': response.pageLayoutTemplate.find((data: any) => data.sectionHeader === "Title Header").fieldsList[0].label,
        'fields': [...response.pageLayoutTemplate.find((data: any) => data.sectionHeader === "TextFieldName").fieldsList],
        'buttons': [...response.pageLayoutTemplate.find((data: any) => data.sectionHeader === "Buttons").fieldsList],
      }
    }).then(()=>{
      this.bindData();
    });
   }
   bindData(){
    this.uiObject.fields.map(item=>{
      if(item.fieldName=="CreatedBy"){
        item.fieldValue = this.workgroup.createdById;
      }     
    })
   }
   onButtonClick(actionName){
    switch(actionName){
      case "cancel":
      this.closeModal();
      break;
      case "createWorkgroup":
      this.createWorkgroup();
      break;
    }
  }
  createWorkgroup(){
    let validField = this.uiObject.fields.map(item=>{
      if(item.fieldName=="WorkgroupName"){
        this.workgroup.workgroupName = item.fieldValue;
      }
      if(item.fieldName=="WorkgroupDesc"){
        this.workgroup.workgroupDesc = item.fieldValue;
      }
      if(item.mandatory && !item.fieldValue)
        return false;
    })
    if(!this.workgroup.workgroupName || !this.workgroup.workgroupDesc){
      return;
    }
    this.workgroup.buttonClicked = 'createWorkgroup';
    this.onCreateWorkgroup.emit(this.workgroup);
  }

}

interface Workgroup_Dialog_Data{
  workgroupName: string;
  workgroupDesc: string;
  createdById: string;
  buttonClicked: string;
}

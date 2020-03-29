import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { UserProfileService } from '../../user-profile.service';
import { DataStorageService } from '@app/features/task/data-storage.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'sa-create-role-modal',
  templateUrl: './create-role-modal.component.html',
  styleUrls: ['./create-role-modal.component.css']
})
export class CreateRoleModalComponent implements OnInit {

  onCreateWorkgroupRole = new EventEmitter();
  createRoleFormGroup: FormGroup;
  public createdByText = 'CreatedBy';
   public uiObject:any = {};
  
   public editObject:any = {};
 
  constructor(@Inject(MAT_DIALOG_DATA) public workgroupRole: WorkgroupRole_Dialog_Data,
  private userProfileService: UserProfileService, private dataStorage: DataStorageService,private formBuilder: FormBuilder) {
    this.getTemplateData();
   }
   getTemplateData(){
     this.uiObject = this.dataStorage.getCreateRoleFields();
     this.editObject = this.dataStorage.getEditRoleFields();
     this.bindData();
    
   }
  ngOnInit() { 
  
  }
  bindData(){
    const validations = {};
    if(this.workgroupRole && this.workgroupRole.workgroupRoleName){
      this.uiObject = this.editObject;
    }
    this.uiObject.fields.map(item=>{      
      if(item.fieldName=="RoleName"){
        item.fieldValue = this.workgroupRole.workgroupRoleName;
      }
      if(item.fieldName=="RoleDesc"){
        item.fieldValue = this.workgroupRole.workgroupRoleDesc;
      }
      if(item.fieldName=="CreatedBy" || item.fieldName=="ModifiedBy"){
        item.fieldValue = this.workgroupRole.createdById;
      } 
      validations[item.fieldName] = item.mandatory == true ? [item.fieldValue, Validators.required] : [item.fieldValue, Validators.nullValidator];
       
    })
    this.createRoleFormGroup = this.formBuilder.group(validations);
  }

  
  closeModal(){
    this.onCreateWorkgroupRole.emit(this.workgroupRole);
  }
  onButtonClick(actionName){
    switch(actionName){
      case "Cancel":
      this.closeModal();
      break;
      case "CreateRole":
      this.createWorkgroupRole();
      break;
    }
  }
  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  createWorkgroupRole(){
    let validField = this.uiObject.fields.map(item=>{
      if(item.fieldName=="RoleName"){
        this.workgroupRole.workgroupRoleName = item.fieldValue;
      }
      if(item.fieldName=="RoleDesc"){
        this.workgroupRole.workgroupRoleDesc = item.fieldValue;
      }
      if(item.mandatory && !item.fieldValue)
        return false;
    })
    if(validField  && !this.workgroupRole.workgroupRoleName || !this.workgroupRole.workgroupRoleDesc){
     this.markFormGroupTouched(this.createRoleFormGroup)
      return;
    }
    this.workgroupRole.buttonClicked = 'createWorkgroupRole';
    this.onCreateWorkgroupRole.emit(this.workgroupRole);
  }
}
interface WorkgroupRole_Dialog_Data{
  workgroupRoleName: string;
  workgroupRoleDesc: string;
  createdById: string;
  buttonClicked: string;
}

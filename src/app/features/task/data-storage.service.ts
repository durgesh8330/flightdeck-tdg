import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DataStorageService {
  private data: any = {};
  private pagination : any = {};
  private searchCriteria : any = {};
  private headersData: any = {};
  private fieldsCreateRole: any = {};
  private fieldsEditRole: any = {};
  private fieldsAddSkills: any = {};
  private warningMessage: string = "";

  public taskPageLayoutTemplates : BehaviorSubject<any> = new BehaviorSubject(null);

  
  constructor() {}
  
  setData(data: any){
    this.data = data;
  }

  getData(){
    return this.data;
  }

  setHeadersData(data: any) {
    this.headersData = data;
  }
 
  getHeadersData() {
    return this.headersData;
  }
  
  setPagination(pagination : any){
	  this.pagination = pagination;
  }
  
  getPagination(){
	  return this.pagination;
  }
  
  setSearchCriteria( searchCriteria : any){
	  this.searchCriteria = searchCriteria;
  }
  
  getSearchCriteria(){
    return this.searchCriteria;
  }

  setCreateRoleFields(data: any) {
    this.fieldsCreateRole = data;
  }

  getCreateRoleFields() {
    return this.fieldsCreateRole;
  }


  setEditRoleFields(data: any) {
    this.fieldsEditRole = data;
  }

  getEditRoleFields() {
    return this.fieldsEditRole;
  }

  setAddSkillsFields(data: any) {
    this.fieldsAddSkills = data;
  }

  getAddSkillsFields() {
    return this.fieldsAddSkills;
  }

  setWarningMessage(message: string) {
    this.warningMessage = message;
  }

  getWarningMessage() {
    return this.warningMessage;
  }
  
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { HttpHeaders } from '@angular/common/http';

import {
  WorkmateTask, Application, TaskType, WorkgroupList,
  SkillList
} from '@app/features/profile-list/profile-list.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileListService {

  public test = new BehaviorSubject(null);
  constructor(private httpClient: HttpClient) { }
  searchConnectedUsers(criteriaKey:string,criteriaValue:string) {
    let header = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.get(environment.apiUrl +
       "/Enterprise/v2/Work/resource/SearchResource/"+criteriaKey+"/"+criteriaValue, {headers: header});
  }
  getEmployeeHierarchy(cuid: string) {
    let header = new HttpHeaders({ 'Content-Type': 'application/json' });
    var UserDetails = JSON.parse(localStorage.getItem('defaultValue'));
    header = header.set('X-Username', UserDetails.personalInfo.cuid);
    return this.httpClient.get(
      environment.apiUrl + '/Enterprise/v2/Work/resource/getEmployeeHierarchy?userCuid=' + cuid,
      { headers: header }
    );
  }

  getUsers(cuid:string) {
    let header = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.get(environment.apiUrl + "/Enterprise/v2/Work/resource?cuid="+cuid + "&include=a,r,p,wg,jd", {'headers': header});
  }

  viewAllUsers() {
    let header = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.get(environment.apiUrl +
       "/Enterprise/v2/Work/resource/GetAllResources", {headers: header});
  }

  addNewUser(profileData: any){
    let header = new HttpHeaders({'Content-Type': 'application/json'});
    var UserDetails = JSON.parse(localStorage.getItem('defaultValue'));
    header = header.set('X-Username', UserDetails.personalInfo.cuid);
    return this.httpClient.post(environment.apiUrl + "/Enterprise/v2/Work/resource",JSON.stringify(profileData), {headers: header});
  }
  
  updateUser(profileData: any){
    let header = new HttpHeaders({'Content-Type': 'application/json'});
    var UserDetails = JSON.parse(localStorage.getItem('defaultValue'));
    header = header.set('X-Username', UserDetails.personalInfo.cuid);
    return this.httpClient.put(environment.apiUrl + "/Enterprise/v2/Work/resource/"+profileData.cuid,JSON.stringify(profileData), {headers: header});
  }
  getFilterByNames() {
    let header = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.get(environment.apiUrl +
       "/Enterprise/v2/Work/resource/GetColumns", {headers: header});
  }
  getMnetUserInfo(userId) {
    let header = new HttpHeaders({'Content-Type': 'application/json'});
    var UserDetails = JSON.parse(localStorage.getItem('defaultValue'));
    header = header.set('X-Username', UserDetails.personalInfo.cuid);
    return this.httpClient.get(environment.apiUrl +
       "/Enterprise/v2/Work/resource/getMnetUserInfo?cuid="+userId, {headers: header});
  }

  deleteProfileUser(cuid) {
    let header = new HttpHeaders({'Content-Type': 'application/json'});
    var UserDetails = JSON.parse(localStorage.getItem('defaultValue'));
    header = header.set('X-Username', UserDetails.personalInfo.cuid);
    return this.httpClient.delete(environment.apiUrl +
       "/Enterprise/v2/Work/resource/"+cuid, {headers: header});    
  }
  
  getWorkMateForm(){
    const url = environment.apiUrl+ "/UITemplate/CreateUITemplate";
      return this.httpClient.get(url);
  }
  

  public getDropDownValues(url) {
     url = environment.apiUrl + url;
    return this.httpClient.get(url);
  }
  createWorkMateTask(data: any){
    let header = new HttpHeaders({'Content-Type': 'application/json'});
    const details = this.prepareRequestForPost(data);
    return this.httpClient.post(environment.apiUrl + "/Task/Submit", JSON.stringify(details), {headers: header});
  }

  prepareRequestForPost(taskDetails){
    // WorkmateTask = new WorkmateTask();
    let workmateTask = new WorkmateTask();
    taskDetails.taskCommonFields.fieldList.forEach(field => {
     // console.log(field.fieldName + "==" + field.fieldValue + "---"+ field.type);
      if(field.type === 'lookup'){
        if(field.fieldName == 'taskType'){
          let taskType = new TaskType();
          taskType.taskName = field.fieldValue;
          workmateTask[field.fieldName] = taskType;
        }
        if(field.fieldName == 'application'){
          let application = new Application();
          application.applicationName = field.fieldValue;
          workmateTask[field.fieldName] = application;
        }
        if(field.fieldName == 'workgroupList'){
          let workgroupList = new WorkgroupList();
          workgroupList.workgroupName = field.fieldValue;
          workmateTask[field.fieldName] = [];
          workmateTask[field.fieldName].push(workgroupList);
        }
        if(field.fieldName == 'skillList'){
          let skillList = new SkillList();
          skillList .skillName= field.fieldValue;
          workmateTask[field.fieldName] = [];
          workmateTask[field.fieldName].push(skillList);
        }
      } else {
        workmateTask[field.fieldName] = field.fieldValue;
      }
    })
    if(taskDetails.taskSpecificFieldsList){
      workmateTask.taskFieldList = taskDetails.taskSpecificFieldsList;
    }
    return workmateTask;
  }

  public GetUserResource(cuid:string) {
    let header = new HttpHeaders({'Content-Type': 'application/json'});
    var UserDetails = JSON.parse(localStorage.getItem('defaultValue'));
    header = header.set('X-Username', UserDetails.personalInfo.cuid);
    return this.httpClient.get(environment.apiUrl + "/Enterprise/v2/Work/resource?cuid=" + cuid + "&include=a,r,p,wg,jd", {headers: header});
  }

  public GetMoreUserResource(cuid:string) {
    let header = new HttpHeaders({'Content-Type': 'application/json'});
    var UserDetails = JSON.parse(localStorage.getItem('defaultValue'));
    header = header.set('X-Username', UserDetails.personalInfo.cuid);
    return this.httpClient.get(environment.apiUrl + "/Enterprise/v2/Work/resource/" + cuid + "?include=wg,p,a,r,ap", {headers: header});
  }
}

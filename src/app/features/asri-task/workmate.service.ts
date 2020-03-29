import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { HttpHeaders } from '@angular/common/http';
import {
  WorkmateTask, Application, TaskType, WorkgroupList,
  SkillList
} from '@app/features/asri-task/workmate-task.model';

@Injectable({
  providedIn: 'root'
})
export class WorkmateService {

  constructor(private httpClient: HttpClient) { }

  getWorkMateForm(){
    const url = environment.apiUrl+ "/UITemplate/CreateUITemplate";
    // const url = 'https://api.myjson.com/bins/14caau';
   //  const url = "https://sso-authgateway-dev2.kubeodc.corp.intranet/flightdeck/dev1/RestService/UITemplate/CreateUITemplate";
   
    // return this.httpClient.get(url);

    // const url = "https://api.myjson.com/bins/os866";
    // const url = "https://api.myjson.com/bins/1gigz6";
  //  const url = "https://api.myjson.com/bins/v2kea";
 
      return this.httpClient.get(url);
  }
  

  public getDropDownValues(url) {
     url = environment.apiUrl + url;
   // url = environment.apiUrl + url;
   // url = "https://api.myjson.com/bins/bk5cy";
    return this.httpClient.get(url);
  }

  createWorkMateTask(data: any){
    let header = new HttpHeaders({'Content-Type': 'application/json'});
    // const details = this.prepareRequestForPost(data);
    return this.httpClient.post(environment.apiUrl + "/Task/Submit", JSON.stringify(data), {headers: header});
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
   // console.log(workmateTask);
    return workmateTask;
  }

  getAllTaskNames(sourceSystem) {
    let url = environment.apiUrl + "/SolrSearch/"+ sourceSystem + "/GetAllTaskNames"; 
    return this.httpClient.get(url);
  }
}

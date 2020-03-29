import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '@env/environment';
import { UniSpr, Application, TaskType, WorkgroupList,
  SkillList } from '@app/features/uni-spr/uni-spr.model';

@Injectable({
  providedIn: 'root'
})

export class UniSprService {

  constructor(private httpClient: HttpClient) { }

  getUniSprForm(){
    // const url = environment.apiUrl+ "/UITemplate/CreateUITemplate";
    //  const url = "https://sso-authgateway-dev2.kubeodc.corp.intranet/flightdeck/dev1/RestService/UITemplate/CreateUITemplate";

    // return this.httpClient.get(url);

    // const url = "https://api.myjson.com/bins/os866";
    // const url = "https://api.myjson.com/bins/1gigz6";
    const url = "https://api.myjson.com/bins/12bcoc";

    return this.httpClient.get(url);
  }


  public getDropDownValues(url) {
    // url = environment.apiUrl + url;
    // url = environment.apiUrl + url;
    url = "https://api.myjson.com/bins/bk5cy";
    return this.httpClient.get(url);
  }

  createUniSprTask(data: any){
    let header = new HttpHeaders({'Content-Type': 'application/json'});
    const details = this.prepareRequestForPost(data);
    return this.httpClient.post(environment.apiUrl + "/Task/Submit", JSON.stringify(details), {headers: header});
  }

  prepareRequestForPost(taskDetails){
    // WorkmateTask = new WorkmateTask();
    let uniSpr = new UniSpr();
    taskDetails.taskCommonFields.fieldList.forEach(field => {
      // console.log(field.fieldName + "==" + field.fieldValue + "---"+ field.type);
      if(field.type === 'lookup'){
        if(field.fieldName == 'taskType'){
          let taskType = new TaskType();
          taskType.taskName = field.fieldValue;
          uniSpr[field.fieldName] = taskType;
        }
        if(field.fieldName == 'application'){
          let application = new Application();
          application.applicationName = field.fieldValue;
          uniSpr[field.fieldName] = application;
        }
        if(field.fieldName == 'workgroupList'){
          let workgroupList = new WorkgroupList();
          workgroupList.workgroupName = field.fieldValue;
          uniSpr[field.fieldName] = [];
          uniSpr[field.fieldName].push(workgroupList);
        }
        if(field.fieldName == 'skillList'){
          let skillList = new SkillList();
          skillList .skillName= field.fieldValue;
          uniSpr[field.fieldName] = [];
          uniSpr[field.fieldName].push(skillList);
        }
      } else {
        uniSpr[field.fieldName] = field.fieldValue;
      }
    })
    if(taskDetails.taskSpecificFieldsList){
      uniSpr.taskFieldList = taskDetails.taskSpecificFieldsList;
    }
    // console.log(workmateTask);
    return uniSpr;
  }
}
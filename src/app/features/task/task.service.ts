import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { of, BehaviorSubject, Subject } from "rxjs/index";
import { timeout, catchError } from 'rxjs/operators';

@Injectable()
export class TaskService {
  public test: Subject<any> = new BehaviorSubject(null);
  //subject for non change list
  public workGroups: Subject<any> = new BehaviorSubject(null);
  public sourceSystems: Subject<any> = new BehaviorSubject(null);
  public taskTypes: Subject<any> = new BehaviorSubject(null);
  public taskStatusCodes: Subject<any> = new BehaviorSubject(null);
  public resources: Subject<any> = new BehaviorSubject(null);
  public pageLayoutTemplates: Subject<any> = new BehaviorSubject(null);

  constructor(private httpClient: HttpClient) { }

  public solrSearch(text: string, accessPoint: string) {

    //return this.httpClient.get('http://vlodwkmt001.dev.intranet:8001/solr/dev2/select?df=id&fl=id&q='+text+'*&wt=json')
    let userData: any = JSON.parse(localStorage.getItem("fd_user"));
    var header = new HttpHeaders({ 'Content-Type': 'application/json', "X-Username": userData.cuid });
    let url = environment.apiUrl + "/Enterprise/v1/Work/Solr?value=" + text + "&accessPoint=" + accessPoint;
    return this.httpClient.get(url, { headers: header });
  }

  public callGetUrl(url: string) {
    let userData: any = JSON.parse(localStorage.getItem("fd_user"));
    var header = new HttpHeaders({ 'Content-Type': 'application/json', "X-Username": userData.cuid });

    url = environment.apiUrl + url;
    return this.httpClient.get(url, { headers: header });
  }

  /*  public getExtrnalData(url: string) {
     return this.httpClient.get(url);
   } */

  public getActivityLogForTask(url: any) {
    url = environment.apiUrl + url;
    let userData: any = JSON.parse(localStorage.getItem("fd_user"));
    var header = new HttpHeaders({ 'Content-Type': 'application/json', "X-Username": userData.cuid });
    return this.httpClient.get(url, { headers: header });
  }

  public getTaskType(id) {
    let url = environment.apiUrl + "/Enterprise/v2/Work/taskType/" + id + "?include=p";
    return this.httpClient.get(url);
  }

  /* public getApplications() {
    let url = environment.apiUrl + "/SourceSystem/GetAll";
    return this.httpClient.get(url);
  } */

// Sample file is getting check IN

  /*  public getSkills() {
     let url = environment.apiUrl + "/CommonProfile/Skill/GetAll ";
     return this.httpClient.get(url);
   } */

  public getWorkgroups() {
    let url = environment.apiUrl + "/Enterprise/v2/Work/workgroup/workgroupNames";
    return this.httpClient.get(url);
  }

  public getSourceSystems() {
    let url = environment.apiUrl + "/QuickSearch/getSourceSystems";
    return this.httpClient.get(url);
  }

  public getAllTaskNames(value, dependentUrl) {
    let url = environment.apiUrl + dependentUrl + value;
    return this.httpClient.get(url);
  }

  getTaskTypes() {
    let userData: any = JSON.parse(localStorage.getItem("fd_user"));
    var header = new HttpHeaders({ 'Content-Type': 'application/json', "X-Username": userData.cuid });
    const url = environment.apiUrl + "/Enterprise/v2/Work/taskType/taskTypeNames";
    return this.httpClient.get(url, { headers: header });
  }

  updateTaskTypeDependency(requestid,requestObj) {
    let header= new HttpHeaders({'Content-Type': 'application/json'});
    var UserDetails = JSON.parse(localStorage.getItem('defaultValue'));
    header = header.set('X-Username', UserDetails.personalInfo.cuid);
    return this.httpClient.put(environment.apiUrl+"/Enterprise/v2/Work/taskType/" + requestid + "?include=p", JSON.stringify(requestObj), {headers: header});
  }
  public searchTask(request: any) {

    let header = new HttpHeaders({ 'Content-Type': 'application/json' });

    console.log("Environment : ", environment);
    return this.httpClient.post(environment.apiUrl + "/Enterprise/v2/Work/task/search?include=aa", JSON.stringify(request), { headers: header });
    // return this.httpClient.post(environment.apiUrl + "/Task/Search", JSON.stringify(request), {headers: header});

  }

  public searchTaskParentChild(request: any) {
    let header = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post(environment.apiUrl + "/Enterprise/v2/Work/task/search?include=c,ttp,aa", JSON.stringify(request), { headers: header });
  }
  public getTaskTypeForParam(paramName: string,paramValue:string) {
    let header = new HttpHeaders({ 'Content-Type': 'application/json' });
      
    return this.httpClient.get(environment.apiUrl + "/Enterprise/v2/Work/taskType?paramName=" + paramName + "&paramValue="+paramValue);
   
  }
  public getStatusHistory(id) {
    const url = environment.apiUrl + "/Enterprise/v2/Work/task/" + id + "/statusHistory";
    return this.httpClient.get(url);
  }

  public getUserorWorkgroupactivity(id, activityType) {
    let userData: any = JSON.parse(localStorage.getItem("fd_user"));
    var header = new HttpHeaders({ 'Content-Type': 'application/json', "X-Username": userData.cuid });
    const url = environment.apiUrl + "/Enterprise/v2/Work/task/" + id + "/UserorWorkgroupactivityLog?activityType=" + activityType;
    return this.httpClient.get(url, { headers: header });
  }

  public TaskAction(request: any, action) {

    let header = new HttpHeaders({ 'Content-Type': 'application/json' });
    header.append('Access-Control-Allow-Origin', 'http://localhost:4200');
    if (action == 'Block' || action == 'Accept' || action == 'Cancel' || action == 'Complete' || action == 'UnBlock' || action == 'Copy Task') {
      var UserDetails = JSON.parse(localStorage.getItem('defaultValue'));
      header = header.set('X-Username', UserDetails.personalInfo.cuid);
    }

    return this.httpClient.patch(environment.apiUrl + "/Enterprise/v2/Work/task/" + request.id + "/action", JSON.stringify(request.taskStatusActionRequest), { headers: header });
  }

  public TaskNotes(request: any) {
    let header = new HttpHeaders({ 'Content-Type': 'application/json' });
    var UserDetails = JSON.parse(localStorage.getItem('defaultValue'));
    header = header.set('X-Username', UserDetails.personalInfo.cuid);

    return this.httpClient.patch(environment.apiUrl + "/Enterprise/v2/Work/task/" + request.id + "/notes", JSON.stringify({
      "notes": request.comment_text, "createdById": request.createdById
    }), { headers: header });
  }

  public AdvancedSearchTask(request: any) {

    let header = new HttpHeaders({ 'Content-Type': 'application/json' });

    console.log("Environment : ", environment);
    return this.httpClient.post(environment.apiUrl + "/Enterprise/v2/Work/task/advancedSearch?include=p,aa", JSON.stringify(request), { headers: header });
    // return this.httpClient.post(environment.apiUrl + "/Task/Search", JSON.stringify(request), {headers: header});

  }

  public advancedSearchV3Task(request: any) {
    // let userData: any = JSON.parse(localStorage.getItem("fd_user"));
    // var header = new HttpHeaders({ 'Content-Type': 'application/json', "X-Username": userData.cuid });
    return this.httpClient.post(environment.apiUrl + "/Enterprise/v3/Work/task/advancedSearch?include=p,aa", JSON.stringify(request));
  }

  public getGlobalNotes(id: any,metaData: any) {
    let header = new HttpHeaders({ 'Content-Type': 'application/json' });
    var UserDetails = JSON.parse(localStorage.getItem('defaultValue'));
    header = header.set('X-Username', UserDetails.personalInfo.cuid);
    if(metaData!= null)
    return this.httpClient.get(environment.apiUrl + "/Enterprise/v2/Work/task/" + id + "/globalNote?include="+metaData, { headers: header });
    else
    return this.httpClient.get(environment.apiUrl + "/Enterprise/v2/Work/task/" + id + "/globalNote", { headers: header });
  }

  public createGlobalNote(id: string, request: any) {
    let header = new HttpHeaders({ 'Content-Type': 'application/json' });
      
    return this.httpClient.post(environment.apiUrl + "/Enterprise/v2/Work/task/" + id + "/globalNote", JSON.stringify(request));
   
  }

  public searchTaskInHeader(request: any) {
    let header = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post(environment.apiUrl + "/Enterprise/v2/Work/task/search", JSON.stringify(request), { headers: header });
  }

  public getTask(appTaskInstanceId: string, applicationName: string) {
    const url = environment.apiUrl + "/Enterprise/v2/Work/task/" + appTaskInstanceId + '?include=aa,tsm,c,p,wg';
    return this.httpClient.get(url);
  }

  public saveTaskDetails(taskDetails: any) {
    //const url = environment.apiUrl + "/Task/Submit";
    const url = environment.apiUrl + "/Enterprise/v2/Work/task";
    const header = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post(url, JSON.stringify(taskDetails), { headers: header });
  }

  public ForceCloseTaskDetails(taskDetails: any, Id) {
    //const url = environment.apiUrl + "/Task/Submit";
    const url = environment.apiUrl + "/Enterprise/v2/Work/task/"+ Id +"/action";
    let header = new HttpHeaders({ 'Content-Type': 'application/json' });
    // var UserDetails = JSON.parse(localStorage.getItem('defaultValue'));
    // header = header.set('X-Username', UserDetails.personalInfo.cuid);
    return this.httpClient.patch(url, JSON.stringify(taskDetails), { headers: header });
  }

  public AllowAction(request: any, id: any) {
    let header = new HttpHeaders({ 'Content-Type': 'application/json' });
    var UserDetails = JSON.parse(localStorage.getItem('defaultValue'));
    header = header.set('X-Username', UserDetails.personalInfo.cuid);
    return this.httpClient.patch(environment.apiUrl + "/Enterprise/v2/Work/task/" + id + "/action", JSON.stringify(request), { headers: header });
  }

  /* public getSearchFields() {
    const url = environment.apiUrl + "/UITemplate/SearchUITemplate";
    return this.httpClient.get(url);
  } */

  /* public getSearchTemplate() {
    const url = environment.apiUrl + "/UITemplate/SearchUITemplate";
    return this.httpClient.get(url);
  } */

  public getResource(cuid: string) {
    // const header = new HttpHeaders({'Content-Type': 'application/json'});
    let url = environment.apiUrl + "/Resource/GetResource/" + cuid;
    return this.httpClient.get(url);
  }


  /* public getFieldValues(url: string) {
    url = environment.apiUrl + url;
    return this.httpClient.get(url);
  }
 */
  public getAuditResults(appTaskInstanceId: string, appName: string) {
    const url = environment.apiUrl + "/ActivityLog/GetAll/" + appName + "/Task/" + appTaskInstanceId;
    return this.httpClient.get(url);
  }

  /*  public getActivityLog(activityValue: string) {
     const url = environment.apiUrl + "/WmActivityLog/Search";
     const header = new HttpHeaders({ 'Content-Type': 'application/json' });
     return this.httpClient.post(url, JSON.stringify({ activityValue }), { headers: header });
   } */

  /* public saveActivityLog(activityLog: any) {
    //const url = environment.apiUrl + "/ActivityLog/Create";
    const url = environment.apiUrl + "/WmActivityLog/Create";
    const header = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post(url, JSON.stringify(activityLog), { headers: header });
  } */

  /* public performAction(supType: number, appTaskInstId: string, modifiedById: string, extra: any) {
    const url = environment.apiUrl + "/Task/UpdateSPR";
    
    let queryString = '';
    let data = {};
    if (supType === 2) {
      queryString = 'supType=' + supType + '&appTaskInstId=' + appTaskInstId + '&modifiedById=' + modifiedById + '&dueDate=' + extra
    } else {
      queryString = 'supType=' + supType + '&appTaskInstId=' + appTaskInstId + '&modifiedById=' + modifiedById;
      data = extra;
    }

    const params = new HttpParams({
      fromString: queryString
    });

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post(url, JSON.stringify(data), { headers, params });
  } */

  /* public getTaskVersionDetails(appName: string, appTaskInstanceId: string) {
    const url = environment.apiUrl + "/Task/getTaskVersionDetails/" + appName + "/" + appTaskInstanceId;
    return this.httpClient.get(url);
  } */
  getPageLayout(templateName) {
    const header = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.get(environment.apiUrl + "/PageLayoutTemplate/Get/" + templateName, { headers: header })
  }
  public userPreference(url) {
    let userData: any = JSON.parse(localStorage.getItem("fd_user"));
    var header = new HttpHeaders({ 'Content-Type': 'application/json', "X-Username": userData.cuid });
    return this.httpClient.get(environment.apiUrl + '/Enterprise/v2/Work/resource/' + url + '/userPreferences?appName=FlightDeck', { headers: header });
  }
  public updatePreference(url, body) {
    let userData: any = JSON.parse(localStorage.getItem("fd_user"));
    var headers = new HttpHeaders({ 'Content-Type': 'application/json', "X-Username": userData.cuid });
    return this.httpClient.post(environment.apiUrl + url, JSON.stringify(body), { headers });
  }

  public invokeLMOSAPI(request: any) {
    const header = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.httpClient.post(environment.apiUrl + '/Enterprise/v2/InvokeAPI', JSON.stringify(request), { headers: header });
  }

  public getautopailotdata(uri) {
    console.log(environment.apiUrl);
    let url = environment.apiUrl + uri;
    return this.httpClient.get(url);
  }

  public updateSprTask(taskId, supType, body) {
    var headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.put(environment.apiUrl + '/Spr/Sup/' + taskId + '/' + supType, JSON.stringify(body), { headers });
  }

  public updateSprDueTask(taskId, supType, date, reason: string) {
    let userData: any = JSON.parse(localStorage.getItem("fd_user"));
    var header = new HttpHeaders({ 'Content-Type': 'application/json', "X-Username": userData.cuid });
    if (supType === 2) {
      const msg = {
        "taskInstanceMessage": { "message": reason }
      };
      return this.httpClient.put(environment.apiUrl + '/Spr/Sup/' + taskId + '/' + supType + '/?dueDate=' + date, msg.taskInstanceMessage, { headers: header });
    } else {
      const msg = {
        "taskInstanceMessage": { "message": reason }
      };
      return this.httpClient.put(environment.apiUrl + '/Spr/Sup/' + taskId + '/' + supType + '/', msg.taskInstanceMessage, { headers: header });
    }

  }

  /*   public SaveCancelReasonSubmit(reason) {
      //const url = environment.apiUrl + "/ActivityLog/Create";
      const url = environment.apiUrl + "/Task/Submit";
      const header = new HttpHeaders({ 'Content-Type': 'application/json' });
      const formdata = {
        'taskInstanceRequest': reason
      };
      return this.httpClient.post(url, JSON.stringify(formdata), { headers: header });
    } */

  public getAllResources() {
    const url = environment.apiUrl + '/Resource/GetAllResources';
    const header = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.get(url, { headers: header });
  }

  //AP_SEP_09_10_2019_P2
  //AP_SEP_09_10_2019_P1

  public getAllWorkgroups() {
    const url = environment.apiUrl + '/Enterprise/v2/Work/workgroup/workgroupNames';
    const header = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.get(url, { headers: header });
  }
  /* public taskAdvancedSearch(request: any) {
    let header = new HttpHeaders({ 'Content-Type': 'application/json' });
    var UserDetails = JSON.parse(localStorage.getItem('defaultValue'));
    header = header.set('X-Username', UserDetails.personalInfo.cuid);
    console.log("Environment : ", environment);
    return this.httpClient.post(environment.apiUrl + "/Enterprise/v2/Work/task/advancedSearch?include=tsm", JSON.stringify(request), { headers: header });
  } */

  public SMETaskAction(request: any, id) {

    let header = new HttpHeaders({ 'Content-Type': 'application/json' });
    var UserDetails = JSON.parse(localStorage.getItem('defaultValue'));
    header = header.set('X-Username', UserDetails.personalInfo.cuid);

    console.log("Environment : ", environment);
    return this.httpClient.patch(environment.apiUrl + "/Enterprise/v2/Work/task/" + id + "/action", JSON.stringify(request), { headers: header });
  }
  public GetAllReRouteWorkGroups() {
    let header = new HttpHeaders({ 'Content-Type': 'application/json' });
    var UserDetails = JSON.parse(localStorage.getItem('defaultValue'));
    header = header.set('X-Username', UserDetails.personalInfo.cuid);
    return this.httpClient.get(environment.apiUrl + "/Enterprise/v2/Work/systemParameter?name=LMOS RE-ROUTE DESTINATIONS&include=spi", { headers: header });
  }
  public RCMACReRouteWorkGroups() {
    let header = new HttpHeaders({ 'Content-Type': 'application/json' });
    var UserDetails = JSON.parse(localStorage.getItem('defaultValue'));
    header = header.set('X-Username', UserDetails.personalInfo.cuid);
    return this.httpClient.get(environment.apiUrl + "/Enterprise/v2/Work/systemParameter?name=RCMAC RE-ROUTE DESTINATIONS&include=spi", { headers: header });
  }

  public GetSelectedReRouteWorkGroups(workgroupName) {
    let header = new HttpHeaders({ 'Content-Type': 'application/json' });
    var UserDetails = JSON.parse(localStorage.getItem('defaultValue'));
    header = header.set('X-Username', UserDetails.personalInfo.cuid);
    return this.httpClient.get(environment.apiUrl + "/Enterprise/V2/Work/workgroup?workgroupName=" + workgroupName + "&include=p", { headers: header });
  }

  /* public getWorkGroupMember(WorkGroupName) {
    const url = environment.apiUrl + '/WorkgroupRouting/GetWorkgroupMembers/' + WorkGroupName;
    const header = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.get(url, { headers: header });
  } */

  public GetTransferWorkGroupId(WorkGroupId) {
    let header = new HttpHeaders({ 'Content-Type': 'application/json' });
    var UserDetails = JSON.parse(localStorage.getItem('defaultValue'));
    header = header.set('X-Username', UserDetails.personalInfo.cuid);
    return this.httpClient.get(environment.apiUrl + "/Enterprise/v2/Work/workgroup/" + WorkGroupId + "/resource", { headers: header });
  }

  public GetTransferWorkGroupDataUsingWorkGroupId(WorkGroupId) {
    let header = new HttpHeaders({ 'Content-Type': 'application/json' });
    var UserDetails = JSON.parse(localStorage.getItem('defaultValue'));
    header = header.set('X-Username', UserDetails.personalInfo.cuid);
    return this.httpClient.get(environment.apiUrl + "/Enterprise/v2/Work/workgroup/" + WorkGroupId + "/resource?include=' '", { headers: header });
  }

  public LoadlmostabData(Id: any, param: any) {
    let header = new HttpHeaders({ 'Content-Type': 'application/json' });
    var UserDetails = JSON.parse(localStorage.getItem('defaultValue'));
    header = header.set('X-Username', UserDetails.personalInfo.cuid);
    return this.httpClient.post(environment.apiUrl + "/Enterprise/v1/Work/task/" + Id + "/enrich" + "?params=" + param, {}, { headers: header });
  }
  public LoadlmostabDataWIthDetail(Id: any, param: any) {
    let header = new HttpHeaders({ 'Content-Type': 'application/json' });
    var UserDetails = JSON.parse(localStorage.getItem('defaultValue'));
    header = header.set('X-Username', UserDetails.personalInfo.cuid);
    return this.httpClient.get(environment.apiUrl + "/Enterprise/v1/Work/task/" + Id + "/enrich" + "?params=" + param, { headers: header });
  }

  public Savetasknotes(request: any, id) {

    let header = new HttpHeaders({ 'Content-Type': 'application/json' });
    var UserDetails = JSON.parse(localStorage.getItem('defaultValue'));
    header = header.set('X-Username', UserDetails.personalInfo.cuid);

    console.log("Environment : ", environment);
    return this.httpClient.patch(environment.apiUrl + "/Enterprise/v2/Work/task/" + id + "/notes", JSON.stringify(request), { headers: header });
  }

  public getAddionalDetails(url: string) {
    url = environment.apiUrl + url;
    return this.httpClient.get(url, { responseType: 'text' });
  }

  public TroubleFound() {
    let header = new HttpHeaders({ 'Content-Type': 'application/json' });
    var UserDetails = JSON.parse(localStorage.getItem('defaultValue'));
    header = header.set('X-Username', UserDetails.personalInfo.cuid);
    return this.httpClient.get(environment.apiUrl + "/Enterprise/v2/Work/systemParameter?name=Screening%20RCMAC%20Disposition%20Codes&include=spi", { headers: header });
  }

  public GetTroubleFoundInCD(ID) {
    let header = new HttpHeaders({ 'Content-Type': 'application/json' });
    var UserDetails = JSON.parse(localStorage.getItem('defaultValue'));
    header = header.set('X-Username', UserDetails.personalInfo.cuid);
    return this.httpClient.get(environment.apiUrl + "/Enterprise/v2/Work/systemParameterItem?include=c&id=" + ID, { headers: header });
  }

  public GetUserProfileSystemParameterItem(sysParamName, sysParamType) {
    let header = new HttpHeaders({ 'Content-Type': 'application/json' });
    var UserDetails = JSON.parse(localStorage.getItem('defaultValue'));
    header = header.set('X-Username', UserDetails.personalInfo.cuid);
    return this.httpClient.get(environment.apiUrl + "/Enterprise/v2/Work/systemParameterItem?sysParamName=" + sysParamName + "&sysParamType=" + sysParamType, { headers: header });
  }

  public updateUserPreference(Id: any, param: any) {
    let header = new HttpHeaders({ 'Content-Type': 'application/json' });
    var UserDetails = JSON.parse(localStorage.getItem('defaultValue'));
    header = header.set('X-Username', UserDetails.personalInfo.cuid);
    return this.httpClient.put(environment.apiUrl + "/Enterprise/v2/Work/resource/" + Id, JSON.stringify(param), { headers: header });
  }

  public RetryServiceData(request: any) {
    let header = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.patch(environment.apiUrl + "/Enterprise/v2/Work/task/" + request.taskId + "/action", JSON.stringify(request), { headers: header });
  }

  public getParentDetails(url: string) {
    url = environment.apiUrl + url;
    return this.httpClient.get(url);
  }

  public getTaskIncludeAA(appTaskInstanceId: string) {
    const url = environment.apiUrl + "/Enterprise/v2/Work/task/" + appTaskInstanceId + '?include=aa';
    return this.httpClient.get(url);
  }

  public WorkgroupAdvancedSearchTask(request: any) {

    let header = new HttpHeaders({ 'Content-Type': 'application/json' });

    console.log("Environment : ", environment);
    return this.httpClient.post(environment.apiUrl + "/Enterprise/v2/Work/task/advancedSearch?include=p", JSON.stringify(request), { headers: header });
  }

  // public GetNextFromRuleEngine(cuid, ruleName) {
  //   const url = environment.ruleApiUrl + '/RestService/WeightRule/getNext' + '?cuid=' + cuid + '&ruleName=' + ruleName;
  //   const header = new HttpHeaders({ 'Content-Type': 'application/json' });
  //   return this.httpClient.get(url, { headers: header });
  // }
  public GetNext(cuid) {
    const url = environment.apiUrl + '/RoutingRulesEngine/GetNext/' + cuid;
    const header = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.get(url, { headers: header });
  }


  public getMailTask(dbTaskInstanceId: string) {
    const url = environment.apiUrl + "/Enterprise/v2/Work/task/" + dbTaskInstanceId + '?include=tsm,aa';
    return this.httpClient.get(url);
  }

  getAvailableTaskStatus() {
    let header = new HttpHeaders({ 'Content-Type': 'application/json' });
    var UserDetails = JSON.parse(localStorage.getItem('defaultValue'));
    header = header.set('X-Username', UserDetails.personalInfo.cuid);
    return this.httpClient.get(environment.apiUrl + "/Enterprise/v2/Work/systemParameter?name=Task%20Status%20Codes&include=spi", { headers: header });

  }
  getNotificationTypes() {
    let header = new HttpHeaders({ 'Content-Type': 'application/json' });
    var UserDetails = JSON.parse(localStorage.getItem('defaultValue'));
    header = header.set('X-Username', UserDetails.personalInfo.cuid);
    return this.httpClient.get(environment.apiUrl + "/Enterprise/v2/Work/systemParameter?name=Notify_Type&include=spi", { headers: header });

  }
  getListofValueChildData(name){
    let header = new HttpHeaders({ 'Content-Type': 'application/json' });
    var UserDetails = JSON.parse(localStorage.getItem('defaultValue'));
    header = header.set('X-Username', UserDetails.personalInfo.cuid);
    return this.httpClient.get(environment.apiUrl + "/Enterprise/v2/Work/listOfValues?name="+name+"&include=allvalues", { headers: header });
 
  }

  public createOrUpdateTaskInstanceParam(taskInstanceId,taskInstanceParam) {
    let header = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post(environment.apiUrl + "/Enterprise/v2/Work/task/"+taskInstanceId+"/taskInstanceParam", JSON.stringify(taskInstanceParam), { headers: header });
  }

  getListofValueData(name){
    let header = new HttpHeaders({ 'Content-Type': 'application/json' });
    var UserDetails = JSON.parse(localStorage.getItem('defaultValue'));
    header = header.set('X-Username', UserDetails.personalInfo.cuid);
    return this.httpClient.get(environment.apiUrl + "/Enterprise/v2/Work/listOfValues?name="+name, { headers: header });

  }
  public deleteTaskInstanceParam(taskInstanceId,taskInstanceParam) {
    let header = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post(environment.apiUrl + "/Enterprise/v2/Work/task/"+taskInstanceId+"/delete/taskInstanceParam", JSON.stringify(taskInstanceParam), { headers: header });
  }

  public WorkgroupAdvancedSearchV3Task(request: any) {
   return this.httpClient.post(environment.apiUrl + "/Enterprise/v3/Work/task/advancedSearch?include=p", JSON.stringify(request));
  }
}

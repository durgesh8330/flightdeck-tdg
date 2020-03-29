import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@env/environment';
import {Observable, BehaviorSubject} from 'rxjs';
import { EncodingUrlService } from '@app/shared/encoding-url.service';

@Injectable()
export class UserProfileService {
  public queryhistorySubject = new BehaviorSubject(null);
  constructor(private httpClient: HttpClient,private encodeingUrlService:EncodingUrlService) { }

  getWorkgroupTemplateData(type:string)
  {
    return this.httpClient.get(environment.apiUrl+"/PageLayoutTemplate/Get/"+type);
  }
  getConnectedMember(workgroupId:string){
    
    return this.httpClient.get(environment.apiUrl+"/Enterprise/v2/Work/workgroup/" + workgroupId + "/resource?include=r,roles");
  }
  createWorkgroup(requestObj: any){
    const header = new HttpHeaders({'content-type': 'application/json'});
    return this.httpClient.post(environment.apiUrl+'/Workgroup/Create', requestObj, {headers: header});
  } 
  saveConnectedMember(requestObj: any){
    const header = new HttpHeaders({'content-type': 'application/json'});
    return this.httpClient.post(environment.apiUrl+'/WorkgroupRole/AssociateResourceWorkgroupRole', requestObj, {headers: header});
  }
  getUserDetails(cuid: string){
    return this.httpClient.get(environment.apiUrl+"/NewUserProfile/"+cuid);
  }
  getManageApplicationDetails()
  {
    return this.httpClient.get(environment.apiUrl+"/Apps/GetAllDetails");
  }
  getAllSkillList(){
    return this.httpClient.get(environment.apiUrl+"/CommonProfile/Skill/GetAll");
  }
  getAllApplications(){
    return this.httpClient.get(environment.apiUrl+'/Apps/GetAll');
  }
  getWorkgroupDetails(workgroupName: string){
    // workgroupName = this.encodeingUrlService.getEncodedUri(workgroupName);
    return this.httpClient.get(environment.apiUrl+"/Workgroup/Get/"+workgroupName);
  }

  getWorkgroupDetailsParams(workgroupId: string){
    return this.httpClient.get(environment.apiUrl+"/Enterprise/v2/Work/workgroup/" + workgroupId + "?include=p");
  }

  getAllWorkgroups(){
    return this.httpClient.get(environment.apiUrl+"/Workgroup/GetAll");
  }
  getWorkgroupRoleAccessLevel(workgroup: string,role:string){
    const header = new HttpHeaders({'Content-Type': 'application/json'});
    //return this.httpClient.get(environment.apiUrl+'/CommonProfile/AccessLevel/Get/'+workgroup+"/"+role);
    return this.httpClient.get(environment.apiUrl+'/Accesslevel/Get/'+workgroup+"/"+role);
  }
  getWorkgroupRoleSkillSet(workgroup: string,role:string){
    const header = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.get(environment.apiUrl+'/CommonProfile/Skill/Get/'+workgroup+"/"+role);
  }
  deleteWorkgroup(workgroups: Array<string>){
    const request = { "workGroupNames": [] };
    workgroups.forEach(workgroupName => request.workGroupNames.push({  "workgroupName": workgroupName}));


    const header: HttpHeaders = new HttpHeaders().append('Content-Type', 'application/json');
    
    const httpOptions = {
        headers: header,
        body: request
    };

    return this.httpClient.delete(environment.apiUrl+'/Workgroup/DeleteAll', httpOptions);
  }
  deleteWorkgroupRoleSkill(skillId:string){
    return this.httpClient.delete(environment.apiUrl+'/CommonProfile/Skill/delete/'+skillId);
  }
  updateWorkgroup(requestObj: any){
    const header = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.post(environment.apiUrl+"/Workgroup/Update", requestObj, {headers: header});
  }

  createWorkgroupRole(requestOb: any){
    const header = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.post(environment.apiUrl+'/WorkgroupRole/Create', requestOb, {headers: header});
  }
  createorUpdateWorkgroupAccessLevel(requestOb: any){
    const header = new HttpHeaders({'Content-Type': 'application/json'});
    //return this.httpClient.post(environment.apiUrl+'/CommonProfile/AccessLevel/CreateOrUpdate', requestOb, {headers: header});
    return this.httpClient.post(environment.apiUrl+'/Accesslevel/CreateOrUpdate', requestOb, {headers: header});
  }
  createWorkgroupRoleSkill(requestOb: any){
    const header = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.post(environment.apiUrl+'/CommonProfile/Skill/CreateSkillWorkgroupRoleMap', requestOb, {headers: header});
  }

  updateWorkgroupRole(requestOb: any){
    const header = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.post(environment.apiUrl+'/WorkgroupRole/Update', requestOb, {headers: header});
  }

  deleteWorkgroupRole(workgroupName: string, roleName: string){
    return this.httpClient.delete(environment.apiUrl+'/WorkgroupRole/Delete?WorkgroupName='+workgroupName+'&RoleName='+roleName);
  }

  createApplication(requestObj: any){
    const header = new HttpHeaders({'content-type': 'application/json'});
    return this.httpClient.post(environment.apiUrl+'/Apps/Create', requestObj, {headers: header});
  }


  getApplicationDetails(applicationName: string){
    return this.httpClient.get(environment.apiUrl+"/CommonProfile/Application/GetApplication/"+applicationName);
  }

  // getAllApplications(){
  //   return this.httpClient.get(environment.apiUrl+'/CommonProfile/Application/GetAll');
  // }

  deleteApplication(appId: number){
    return this.httpClient.delete(environment.apiUrl+'/Apps/delete/'+appId);
  }


  updateApplication(requestObj: any){
    const header = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.post(environment.apiUrl+"/Apps/UpdateApp", requestObj, {headers: header});
  }
  createSkill(requestObj: any){
    const header = new HttpHeaders({'content-type': 'application/json'});
    return this.httpClient.post(environment.apiUrl+'/CommonProfile/Skill/Create', requestObj, {headers: header});
  }
  getAllSkills(){
    return this.httpClient.get(environment.apiUrl+'/CommonProfile/skill/GetAll');
  }
  getSkillDetails()
  {
    return this.httpClient.get(environment.apiUrl+"/CommonProfile/Skill/GetAllDetails");
  }
  deleteSkill(skillId: number){
    return this.httpClient.delete(environment.apiUrl+'/CommonProfile/Skill/delete/'+skillId);
  }
  
  deleteNotifyKeySet(url, id)
  {
    let header = new HttpHeaders({'Content-Type': 'application/json'});
    var UserDetails = JSON.parse(localStorage.getItem('defaultValue'));
    header = header.set('X-Username', UserDetails.personalInfo.cuid);
    return this.httpClient.delete(environment.apiUrl+ url +id,{headers: header});
  }
  deleteWorkGroupNotification(url, id)
  {
    
    let header = new HttpHeaders({'Content-Type': 'application/json'});
    var UserDetails = JSON.parse(localStorage.getItem('defaultValue'));
    header = header.set('X-Username', UserDetails.personalInfo.cuid);
    return this.httpClient.delete(environment.apiUrl+ url +id,{headers: header});
  }
  deleteConnectedMember(workgroupId:string,workgroupRoleId:number,resourceId:number){
   // return this.httpClient.delete(environment.apiUrl+'/WorkgroupRouting/Delete/'+cuid+'/'+workgroupName+'/'+roleName);
   return this.httpClient.delete(environment.apiUrl+'/Enterprise/v2/Work/workgroup/'+workgroupId+'/role/'+workgroupRoleId+'/resource/'+resourceId);
  }
  updateSkill(requestObj: any){
    const header = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.post(environment.apiUrl+"/CommonProfile/Skill/UpdateSkill", requestObj, {headers: header});
  }

  getPageLayout(templateName) {
    const header = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.get(environment.apiUrl+"/PageLayoutTemplate/Get/"+templateName, {headers: header})
  }

  getAllPageLayout() {
    const header = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.get(environment.apiUrl+"/PageLayoutTemplate/GetAll", {headers: header})
  }

  getSystemData(params) {
    const header = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.get(environment.apiUrl+"/Enterprise/v2/Work/systemParameter" + params, {headers: header})
  }

  getTaskTypeData(params) {
    const header = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.get(environment.apiUrl+"/Enterprise/v2/Work/taskType" + params, {headers: header})
  }

  getNotifyKeySet() {
    let header = new HttpHeaders({'Content-Type': 'application/json'});
    var UserDetails = JSON.parse(localStorage.getItem('defaultValue'));
    header = header.set('X-Username', UserDetails.personalInfo.cuid);
    return this.httpClient.get(environment.apiUrl+"/Enterprise/v2/Work/notification/GetAllNotifyKeySet",  {headers: header})
  }
  getWorkgroupNotifications() {
    let header = new HttpHeaders({'Content-Type': 'application/json'});
    var UserDetails = JSON.parse(localStorage.getItem('defaultValue'));
    header = header.set('X-Username', UserDetails.personalInfo.cuid);
    return this.httpClient.get(environment.apiUrl+"/Enterprise/v2/Work/notification/GetAllWorkGroupNotifyKeySet",  {headers: header})
  }

  getV2SystemData(Name) {
    var header = new HttpHeaders({'Content-Type': 'application/json'});
    var UserDetails = JSON.parse(localStorage.getItem('defaultValue'));
    header = header.set('X-Username', UserDetails.personalInfo.cuid);
    return this.httpClient.get(environment.apiUrl+"/Enterprise/v2/Work/systemParameter?type=List of Values&name="+Name+"&include=spi", {headers: header})
  }

  getV2SystemParameterItemData(ID) {
    var header = new HttpHeaders({'Content-Type': 'application/json'});
    var UserDetails = JSON.parse(localStorage.getItem('defaultValue'));
    header = header.set('X-Username', UserDetails.personalInfo.cuid);
    return this.httpClient.get(environment.apiUrl+"/Enterprise/v2/Work/systemParameterItem/"+ID+"?include=c", {headers: header})
  }

  getSystemDetailData(url) {
    console.log(environment.apiUrl+ url);
    const header = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.get(environment.apiUrl+ url, {headers: header})
  }
  getTaskTypeDetails(taskName){
    var header = new HttpHeaders({'Content-Type': 'application/json'});
    var UserDetails = JSON.parse(localStorage.getItem('defaultValue'));
    header = header.set('X-Username', UserDetails.personalInfo.cuid);
    return this.httpClient.get(environment.apiUrl+"/Enterprise/v2/Work/taskType?include=p&taskName="+taskName, {headers: header})
  }
  getTaskTypeDetailsById(systemId){
    var header = new HttpHeaders({'Content-Type': 'application/json'});
    var UserDetails = JSON.parse(localStorage.getItem('defaultValue'));
    header = header.set('X-Username', UserDetails.personalInfo.cuid);
    return this.httpClient.get(environment.apiUrl+"/Enterprise/v2/Work/taskType/"+systemId+"?include=p", {headers: header})
  }
  putSystemDetailData(url, requestObj, Username) {
    const header = new HttpHeaders({'Content-Type': 'application/json', "X-Username": Username});
      return this.httpClient.put(environment.apiUrl+ url, requestObj, {headers: header})
  }
  createSystemParameterItem(requestObj) {
    const header= new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.post(environment.apiUrl+"/Enterprise/v2/Work/systemParameterItem/", requestObj, {headers: header});
  }
  updateSystemParameterItem(requestObj) {
    const header= new HttpHeaders({'Content-Type': 'application/json'});
  return this.httpClient.put(environment.apiUrl+"/Enterprise/v2/Work/systemParameterItem/" + requestObj.id, requestObj, {headers: header});
  }
  // this will return TEMPLATE
  getWorkGroupRoutingParametersLayout(workgroupName = 'WorkGroup_Routing_Parameters') {
    return this.httpClient.get(
      environment.apiUrl + '/PageLayoutTemplate/Get/' + workgroupName
    );
    // return from(
    //   new Promise((res, rej) => {
    //     setTimeout(() => res(this.data), 1000);
    //   })
    // );
  }

  // This will get the DATA
  getWorkGroupRoutingParameters(workgroupName = '') {
    return this.httpClient.get(
      environment.apiUrl + '/WorkgroupRouting/Get?workgroupName=' + workgroupName 
    );
    
    // return from(
    //   new Promise((res, rej) => {
    //     setTimeout(() => res(this.data), 1000);
    //   })
    // );
  }
  // This will get the list of attributes
  getAllWorkgroupRoutingAttrs(workgroupName = '') {
    return this.httpClient.get(
      environment.apiUrl + '/WorkgroupRouting/GetAllWorkGrouprouting?workgroupName=' + workgroupName
    );
    
  }

  // This will get the data corresponding to single attribute
  getWorkgroupAttributeData(systemParameterName = '') {
    // HAck Alert! - This will just encode the '#' from the URL string
    // Angular seems to replace it by a space which we dont want
    // Find a better alternative to this or ask backend to remove the special chars from the sys params
    const aName = systemParameterName.replace('#', '%23');
    return this.httpClient.get(
      environment.apiUrl + '/WorkgroupRouting/Get/' + systemParameterName
    );
   
  }
  // THIS IS TO DELETE THE ATTRIBUTE FROM WORKGROUP ATTR PARAMS TAB
  deleteWorkgroupAttribute(workgroupName = '', attributeName = '') {
    // HAck Alert! - This will just encode the '#' from the URL string
    // Angular seems to replace it by a space which we dont want
    // Find a better alternative to this or ask backend to remove the special chars from the sys params
    const aName = attributeName.replace('#', '%23');
    return this.httpClient.delete(
      environment.apiUrl + '/WorkgroupRouting/DeleteWorkGroupParams/' + workgroupName + '/' + aName
    );
    ;
  }
  // TO Save the routing attrs
  saveWorkgroupRoutingAttributes( data: any = {}) {
    return this.httpClient.post(
      environment.apiUrl + '/WorkgroupRouting/Create', data
    );
   
  }

  getAllAccessLevel(): Observable<any>  {
    const header= new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.get(environment.apiUrl+"/Accesslevel/GetAll", {headers: header});
  }

  createNotifyKeySet(requestObj) {
    const header= new HttpHeaders({'Content-Type': 'application/json'});
    http://localhost:8080/RestService/Enterprise/v2/Work/notification/notifyKeySet
    return this.httpClient.post(environment.apiUrl+"/Enterprise/v2/Work/notification/notifyKeySet", requestObj, {headers: header});
  }

  createWorkGroupNotification(requestObj) {
    const header= new HttpHeaders({'Content-Type': 'application/json'});
    http://localhost:8080/RestService/Enterprise/v2/Work/notification/notifyKeySet
    return this.httpClient.post(environment.apiUrl+"/Enterprise/v2/Work/notification/workgroupnotifyKeySet", requestObj, {headers: header});
  }

  getListofValueDataParams(name, level1, level2){
    let header = new HttpHeaders({ 'Content-Type': 'application/json' });
    var UserDetails = JSON.parse(localStorage.getItem('defaultValue'));
    header = header.set('X-Username', UserDetails.personalInfo.cuid);
    let levelURL;
    if(level2 ==""){
      levelURL = environment.apiUrl + "/Enterprise/v2/Work/listOfValues?name="+name+"&level1Value="+level1;
    }
    else{
      levelURL = environment.apiUrl + "/Enterprise/v2/Work/listOfValues?name="+name+"&level1Value="+level1+"&level2Value="+level2;
    }
    
    https://workmate-svc-dev2.kubeodc.corp.intranet:443/RestService/Enterprise/v2/Work/listOfValues?name=Blocking%20Reasons
    return this.httpClient.get(levelURL, { headers: header });

  }

  updateSTaskTypeParamsItem(requestObj) {
    let header= new HttpHeaders({'Content-Type': 'application/json'});
    var UserDetails = JSON.parse(localStorage.getItem('defaultValue'));
    header = header.set('X-Username', UserDetails.personalInfo.cuid);
    return this.httpClient.put(environment.apiUrl+"/Enterprise/v2/Work/taskType/" + requestObj.id + "?include=p", JSON.stringify(requestObj), {headers: header});
  }

  getWorkGroupDetailsById(id){
    return this.httpClient.get(environment.apiUrl+"/Enterprise/v2/Work/workgroup/" + id);
  }
  
  updateWorkgroupParamsItem(requestObj) {
    let header= new HttpHeaders({'Content-Type': 'application/json'});
    var UserDetails = JSON.parse(localStorage.getItem('defaultValue'));
    header = header.set('X-Username', UserDetails.personalInfo.cuid);
    return this.httpClient.put(environment.apiUrl+"/Enterprise/v2/Work/workgroup", JSON.stringify(requestObj), {headers: header});
  }

  getWorkGroupRoleDetailsById(id, RoleId){
    return this.httpClient.get(environment.apiUrl+"/Enterprise/v2/Work/workgroup/" + id + "/role/" + RoleId + "?include=p");
  }

  updateWorkgroupRoleParamsItem(requestObj) {
    let header= new HttpHeaders({'Content-Type': 'application/json'});
    var UserDetails = JSON.parse(localStorage.getItem('defaultValue'));
    header = header.set('X-Username', UserDetails.personalInfo.cuid);
    return this.httpClient.put(environment.apiUrl+"/Enterprise/v2/Work/workgroup/" + requestObj.workGroupId + "/role/" + requestObj.id, JSON.stringify(requestObj), {headers: header});
  }

  saveResourceAuditLog(requestObj: any[]){
    const header = new HttpHeaders({'content-type': 'application/json'});
    return this.httpClient.post(environment.apiUrl+'/Enterprise/v2/Work/resource/'+ requestObj[0].resourceId +'/auditLog', requestObj, {headers: header});
  } 

  deleteV2WorkgroupRole(workgroupName: string, roleName: string){
    let header= new HttpHeaders({'Content-Type': 'application/json'});
    var UserDetails = JSON.parse(localStorage.getItem('defaultValue'));
    header = header.set('X-Username', UserDetails.personalInfo.cuid);
    return this.httpClient.delete(environment.apiUrl+'/Enterprise/v2/Work/workgroup/'+workgroupName+'/role/'+roleName, {headers: header});
  }
}

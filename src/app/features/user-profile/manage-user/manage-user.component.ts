import { Component, OnInit, Input } from '@angular/core';
import { ViewEncapsulation } from '@angular/compiler/src/core';
import { ProfileListService } from '../../profile-list/profile-list.service';
import { TaskService } from '../../task/task.service';
import { MatSnackBar } from '@angular/material';
import { DataStorageService } from '../../task/data-storage.service';
import { debug } from 'util';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { UserProfileService } from '../user-profile.service';
import { AuditLog } from '@app/core/store/auditlog/AuditLog';
import { TabService } from '@app/core/tab/tab-service';

@Component({
  selector: 'sa-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.css'],
})
export class ManageUserComponent implements OnInit {
userData: any ;  
public loader = false;
criteriaValue:string="";
criteriaKey:string = "CUID";
@Input() tabHeaderText:string;
filterByNameList=[];
pageTitle: string = '';
userProfileData:any;
IsSuccess = false;
IsError = false;
queryTabData;
getqueryCuid;
editTabName;
message = '';
  isEditing: boolean;
  public templateObject:any = {
    criteriaKey:"CUID",
    criteriaValue:"",
    tabList:[],
    filterInput:[],
    actions:[],
    showWidgetDetails: false
  };
  count =0;
  constructor(private snackBar: MatSnackBar, 
      private dataStorage:DataStorageService, 
      private profileListService: ProfileListService,
      private userProfileService: UserProfileService,
      private tabService:TabService) { 
    this.templateObject.tabList = new Array<ManageUserTabInfo>();
    this.userProfileService.getPageLayout("ManageUser-SearchPanel").subscribe((response: any) => {
      const filterInput = response.pageLayoutTemplate.find((data: any) => data.sectionHeader === "filterInput");
      const actions = response.pageLayoutTemplate.find((data: any) => data.sectionHeader === "Buttons");
      const tabsDefault = response.pageLayoutTemplate.find((data: any) => data.sectionHeader === "Tabs-Default Value");
      this.templateObject.filterInput = filterInput ? filterInput.fieldsList : [];
      this.templateObject.actions = actions ? actions.fieldsList : [];
      this.templateObject.criteriaKey = (tabsDefault && tabsDefault.fieldsList[0]) ? tabsDefault.fieldsList[0].criteriaKey : '';
      this.templateObject.criteriaValue = "";
    });
    this.count ==1;
       //added to get the CUID from the Query history component
      //  this.queryTabData = this.tabService.tabs;
      //  this.queryTabData.forEach((elem) => {
      //    if (elem.tabData.requiredData) {
      //      this.getqueryCuid = elem.tabData["requiredData"];
      //    }
      //  })
      //  if (this.getqueryCuid) {
      //    this.userData = this.getqueryCuid;
         
      //    this.onProfileDetailClick(this.userData);     
      //  }
       //this.subscribeTab();
  }
  
  ngOnInit() {
    
    this.subscribeTab();
    this.userData = JSON.parse(localStorage.getItem("fd_user"));
    this.profileListService.getFilterByNames().toPromise().then((response: any) => {
      this.filterByNameList = response;
    });
    this.userProfileService.getPageLayout("SearchResults-ManageUser").subscribe((response: any) => {
      const res: any = response;

      this.dataStorage.setHeadersData(res.pageLayoutTemplate);
      const widgetDetails = res.pageLayoutTemplate.find((data: any) => data.sectionHeader === "Widget Title");
      // debugger;
      if (widgetDetails) {
        const widgetDetailsData = widgetDetails.fieldsList[0];
        this.pageTitle = widgetDetails.fieldsList[0].label;
        this.templateObject.showWidgetDetails = res.pageLayoutTemplate[1].fieldsList[0].visible;
      }
    });
  }
  //added for the query history inner tabs
  subscribeTab(){
    console.log('subscibe value ');    
    this.profileListService.test.subscribe((data)=>{
      if(data){
        this.onProfileDetailClick(data);
      }
    });
    
  }
  onAddUser(){
    this.userProfileData = null;
    this.isEditing = false;
    let tab = {tabId:'tab101'+this.templateObject.tabList.length,tabName:'Create User',tabContent:'Test'+this.templateObject.tabList.length,isTableView:false,isAddUser:true}; 
    this.templateObject.tabList.push(tab);
    this.makeTabActive(tab);
  }
  onActionButtonClick(fieldName){
    switch(fieldName){
      case "searchUser":
      this.onSearchUser();
      break;
      case "addUser":
      this.onAddUser();
      break;
      case "viewAllUsers":
      this.onViewAllUser();
      break;
    }
  }

  onViewAllUser(){
    this.loader = true;
    this.profileListService.viewAllUsers().toPromise().then((response: any) => {
      this.loader = false;
      if(response && response.length>0){
        response.map((item:any)=>{
          item.userCuid = item.cuid;
          
        });       
      }
      this.dataStorage.setData(response);
      let tab = {
        tabId:'tabsearch101'+this.templateObject.tabList.length,
        tabName:'Search Results',
        tabContent:'Test'+this.templateObject.tabList.length,
        isTableView:true,
        isAddUser:false};
      this.templateObject.tabList.push(tab);
      this.makeTabActive(tab);
    }).catch((error: any) => {
      console.error(error);
      this.loader = false;
      this.dataStorage.setData(null);
      this.IsError = true;
      this.message = error.error.message;
      setTimeout(() => {
        this.IsError = false;
      }, 15000);
      // this.snackBar.open(error.error.message, "Okay", {
      //   duration: 15000,
      // });
    });
    let auditLogRequest: AuditLog[]=[];
    auditLogRequest.push({ createdById:this.userData.cuid,resourceId: this.userData.id, 
      module: "View All User", type: "viewAll", value:"GetAllResources",display:"GetAllResources",
      status:"Success",detail:"Viewed all users"});
    this.userProfileService.saveResourceAuditLog(auditLogRequest).toPromise().then((response: any) => {
      console.log(JSON.stringify(response));
    }).catch(error => {
      this.loader = false;   
      console.error(error);
      this.IsError = true;
      this.message = error.error.message;
      setTimeout(() => {
        this.IsError = false;
      }, 7000);
    });
  }
  
  onCriteriaChange(event){
    this.templateObject.criteriaKey = event.target.value;
  }
  onSearchUser(){
    this.loader = true;    
    // selected value in the dropdown and value in the textfield
    this.profileListService.searchConnectedUsers(this.templateObject.criteriaKey,this.templateObject.criteriaValue).toPromise().then((response: any) => {
      this.loader = false;
      if(response && response.length>0){
        response.map((item:any)=>{
          item.userCuid = item.cuid;
          
        })
      }
      this.dataStorage.setData(response);
      let tab = {tabId:'tabsearch101'+this.templateObject.tabList.length,tabName:'Search Results',tabContent:'Test'+this.templateObject.tabList.length,isTableView:true,isAddUser:false};
      this.templateObject.tabList.push(tab);
      console.log(this.templateObject.tabList);
      this.makeTabActive(tab);
    }).catch((error: any) => {      
      this.loader = false;
      console.error(error);
      this.dataStorage.setData(null);
      this.IsError = true;
      this.message = error.error.message;
      setTimeout(() => {
        this.IsError = false;
      }, 15000);
      // this.snackBar.open(error.error.message, "Okay", {
      //   duration: 15000,
      // });
    });
  }
  onTabNameChange(event,tab){
    tab.tabName = event;
  }
  async onShowUserEditPage(event,tabInfo){
    this.templateObject.tabList.pop();
    await this.profileListService.GetUserResource(event).toPromise().then(async (data: any) => {
      await this.profileListService.GetMoreUserResource(data.id).toPromise().then((response: any) => {
        this.userProfileData = response;
        this.isEditing = true;
        let tab = {tabId:event,tabName:'Edit User',userProfileData:response, tabContent:'Test'+this.templateObject.tabList.length,isTableView:false,isAddUser:false};
        this.templateObject.tabList.push(tab);
        this.makeTabActive(tab);
      }).catch((error: any) => {      
        console.error(error);
        this.IsError = true;
        this.message = error.error.message;
        setTimeout(() => {
          this.IsError = false;
        }, 7000);
      }); 
    }).catch((error: any) => {      
      console.error(error);
      this.IsError = true;
      this.message = error.error.message;
      setTimeout(() => {
        this.IsError = false;
      }, 7000);
    }); 
    /* this.profileListService.getUsers(event).toPromise().then((response: any) => {
      this.userProfileData = response;
      debugger;
      this.isEditing = true;
      let tab = {tabId:event,tabName:'Edit User',userProfileData:response, tabContent:'Test'+this.templateObject.tabList.length,isTableView:false,isAddUser:false};
      this.templateObject.tabList.push(tab);
      this.makeTabActive(tab);
    }).catch((error: any) => {      
      console.error(error);
      this.IsError = true;
      this.message = error.error.message;
      setTimeout(() => {
        this.IsError = false;
      }, 15000);
      // this.snackBar.open(error.error.message, "Okay", {
      //   duration: 15000,
      // });
    });  */ 
  }
  async onProfileDetailClick(event){
    console.log("event ::::::::==>> ",event);
    let existing = this.templateObject.tabList.filter(item=> {
      return item.tabId==event
    });
    if(existing.length==0){
      this.loader = true;
      await this.profileListService.GetUserResource(event).toPromise().then(async (data: any) => {
        await this.profileListService.GetMoreUserResource(data.id).toPromise().then((response: any) => {
          this.userProfileData = response;
          console.log("Userdata ==>> ",response);
          this.isEditing = true;
          // changed to get the inner tab Title from the query history            
              this.editTabName = event
                
          let tab = {tabId:event,tabName:this.editTabName,
            userProfileData:response, 
            tabContent:'Test'+this.templateObject.tabList.length,isTableView:false,isAddUser:false};
          this.templateObject.tabList.push(tab);
          this.makeTabActive(tab);
          this.loader = false;
        }).catch((error: any) => {   
          this.loader = false;   
          console.error(error);
          this.IsError = true;
          this.message = error.error.message;
          setTimeout(() => {
            this.IsError = false;
          }, 7000);
        });
        let auditLogRequest: AuditLog[]=[];
          auditLogRequest.push({ createdById:this.userData.cuid,resourceId: this.userData.id, 
          module: "Manage User", type: "view", value:data.id, display:data.cuid,
          status:"Success",detail:"Viewed profile : "+data.cuid+", "+data.id});
        this.userProfileService.saveResourceAuditLog(auditLogRequest).toPromise().then((response: any) => {
          console.log(JSON.stringify(response));
        }).catch(error => {
          this.loader = false;   
          console.error(error);
          this.IsError = true;
          this.message = error.error.message;
          setTimeout(() => {
            this.IsError = false;
          }, 7000);
        });
      }).catch((error: any) => {   
        this.loader = false;   
        console.error(error);
        this.IsError = true;
        this.message = error.error.message;
        setTimeout(() => {
          this.IsError = false;
        }, 7000);
      });
    /* this.profileListService.getUsers(event).toPromise().then((response: any) => {
      this.userProfileData = response;
      console.log("Userdata ==>> ",response);
      this.isEditing = true;
      let tab = {tabId:event,tabName:'Edit User',
        userProfileData:response, 
        tabContent:'Test'+this.templateObject.tabList.length,isTableView:false,isAddUser:false};
      this.templateObject.tabList.push(tab);
      this.makeTabActive(tab);
      this.loader = false;
    }).catch((error: any) => {   
      this.loader = false;   
      console.error(error);
      this.IsError = true;
      this.message = error.error.message;
      setTimeout(() => {
        this.IsError = false;
      }, 15000);
      // this.snackBar.open(error.error.message, "Okay", {
      //   duration: 15000,
      // });
    }); */
  }else{
    let tab = existing[0];    
    this.makeTabActive(tab);
  }
  }

  removeTab(index: any): void {
    this.templateObject.tabList.map((item, i) => {
      if(item.tabId === index){
        this.templateObject.tabList.splice(i,1);
        if(item['isWorkflowActive'] && this.templateObject.tabList.length > 0) {
          this.templateObject.tabList[0]['isWorkflowActive'] = true;
        }        
      }
    });
  }
  
  makeTabActive(tab) {
    this.templateObject.tabList = this.templateObject.tabList.map(t => {
      t['isWorkflowActive'] = false;
      return t;
    });
    tab.isWorkflowActive = true;
  }
}

export class ManageUserTabInfo{
  tabId:string;
  tabName:string;
  tabContent:string;
  isTableView:boolean;
  isAddUser:boolean;
}
import { Component, OnInit,Output,EventEmitter,AfterViewInit, ElementRef } from '@angular/core';
import { LayoutService } from '@app/core/services/layout.service';
import { TabService } from '@app/core/tab/tab-service';
import { Tab } from '@app/core/tab/tab.model';
import { ProfileListService } from '@app/features/profile-list/profile-list.service';
import { TaskService } from '@app/features/task/task.service';
import {QueryHistoryDetailsComponent} from '@app/features/query-history-details/query-history-details.component';

import { TableComponent } from "@app/shared/table/table.component";

import { DataStorageService } from '@app/features/task/data-storage.service';

import { from } from 'rxjs';
import { TaskDetailsComponent } from '@app/features/task/task-details/task-details.component';
import { ManageWorkgroupComponent } from '@app/features/user-profile/manage-workgroup/manage-workgroup.component';
import { ManageUserComponent } from  '@app/features/user-profile/manage-user/manage-user.component';
import {ActivatedRoute, Router} from "@angular/router";
import { UserProfileService } from '@app/features/user-profile/user-profile.service';


@Component({
  selector: 'sa-query-history',
  templateUrl: './query-history.component.html',
  styleUrls: ['./query-history.component.scss']
})
export class QueryHistoryComponent implements OnInit {
  public id;
  public tableData1;
  public resourceData:{};
  public totalRecords:[]; 
  public totalData;
  public loader;
  public test: boolean = false;
  public totalRecordData:[];   
  @Output() userDetails = new EventEmitter<string>();
  public templateObject:any = {
    criteriaKey:"CUID",
    criteriaValue:"",
    tabList:[],
    filterInput:[],
    actions:[],
    showWidgetDetails: false
  };
  queryParameter: any = {
    from: 'queryHistory',
    title: 'Query History',
    isSortAsc: false,
    globalSearch: '',
    tableData: [],

  };
  pageTitle: string = '';
  IsSuccess = false;
  IsError = false;
  actionButton: any = [];
  actionColumn: any = [];
  tablePaginationData = [];
  loaderSystemParameters = true;
  pagination: any = {};
  public userProfileData;
  public sectionheader;
  isEditing = false;
  public tableValue;
  public viewStatus:boolean =false;
  public viewMoreData;
  
  
 
  constructor(public layoutService:LayoutService,
    private tabService: TabService,
    private profileListService: ProfileListService,
    private dataStorage:DataStorageService,
    private taskService:TaskService,
    private router: Router,
    private userProfileService:UserProfileService,    
    ) {
      
     
   }
  
  ngOnInit() {    
    let userInfo = JSON.parse(localStorage.getItem('fd_user'));
    this.id = userInfo["id"];
    this.latestRecords();
  }
 
  latestRecords(){    
    let currentPage =0;   
    this.resourceData = {
      "resourceId" :this.id,
      "viewStatus" :this.viewStatus,
      "pagination": {
        "pageNumber": 0,
        "pageSize": 0
        
      }      
    };
    this.getAllLinks(this.resourceData);
}  
toggleOnHover(state) {
  this.layoutService.onMouseToggleMenu(state);
}

getModule(moduleValue,moduledisplay, resourceId, value){ 
  if (moduledisplay == "Manage User") {
    let tab;   
    if(this.tabService.tabs.length >0){
        tab=this.tabService.tabs.filter((elem) => elem.title == moduledisplay)
        if (tab.length > 0 && moduleValue) {
          this.profileListService.test.next(moduleValue);
        } else {
          tab = new Tab(ManageUserComponent, 'Manage User',"ManageUser", { 'requiredData': moduleValue });
          this.tabService.openTab(tab);
          this.profileListService.test.next(moduleValue);
        }
   }else{
        tab = new Tab(ManageUserComponent, 'Manage User',"ManageUser", { 'requiredData': moduleValue });
        this.tabService.openTab(tab);
        this.profileListService.test.next(moduleValue);
   }
  }

  
  else if (moduledisplay == "Manage task"){ 
    this.loader = true;
    this.taskService.getTask(value , "").toPromise().then((response: any) => {	      	
			let tab = new Tab(TaskDetailsComponent, 'Task : '+ moduleValue, 'TaskDetailsComponent', response);
    this.tabService.openTab(tab);
    this.loader = false;
		}), (error: any) => {
				this.loader = false;   
	    };  
  }
  else if(moduledisplay == "Manage Workgroup"){

    let tab;
    if(this.tabService.tabs.length >0) {
      tab=this.tabService.tabs.filter((elem) => elem.title == "Manage Workgroups");
      if(tab.length > 0 && moduleValue){
        this.userProfileService.queryhistorySubject.next(moduleValue);
       }
       else{
       tab = new Tab(ManageWorkgroupComponent, 'Manage Workgroups', 'manageWorkgroups', { 'queryHistrory': moduleValue });
        this.tabService.openTab(tab);

        //first time
        this.userProfileService.queryhistorySubject.next(moduleValue);
       }
    }else{
      tab = new Tab(ManageWorkgroupComponent, 'Manage Workgroups', 'manageWorkgroups', { 'queryHistrory': moduleValue });
        this.tabService.openTab(tab);
        //open tab first time 
        this.userProfileService.queryhistorySubject.next(moduleValue);
    }

  }
  
}

viewMore(){
  this.templateObject.showWidgetDetails =true;
  this.viewStatus = true;  
  this.resourceData = {
    "resourceId" :this.id,
    "viewStatus" :this.viewStatus,
    "pagination": {
      "pageNumber": 0,
      "pageSize": 0
    } 
  }
 
 this.getViewMore(this.resourceData);
   
}

getViewMore(resourceData){
  this.layoutService.getQueryRecord(this.id,resourceData).toPromise().then((response: any) => { 
    this.viewMoreData=response.auditLogResults;
   });
   setTimeout(()=> {
   let tab = new Tab(QueryHistoryDetailsComponent, 'My History', 'More',{'requiredData':this.viewMoreData});
   this.tabService.openTab(tab);
   this.viewStatus = false;
   },1000);
}
 
getAllLinks(resourceData){ 
  this.layoutService.getQueryRecord(this.id,resourceData).toPromise().then((response: any) => {        
    this.totalData = response;
   this.totalRecords = response.auditLogResults;      
 });
}

}

import { Component, OnInit, Input, Output, EventEmitter,Type } from '@angular/core';
import { ProfileListService } from '@app/features/profile-list/profile-list.service';
import { UserProfileService } from '@app/features/user-profile/user-profile.service'
import { DataStorageService } from '@app/features/task/data-storage.service';
import { TabService } from '@app/core/tab/tab-service';
import { R2DGService } from '@app/features/r2dg-automation/r2dg.service';
import { TableComponent } from '@app/shared/table/table.component';
import { TaskService } from "@app/features/task/task.service";
import { object } from '@amcharts/amcharts4/core';
import { QueryHistoryComponent } from '@app/shared/layout/navigation/query-history/query-history.component';
import { Tab } from '@app/core/tab/tab.model';
import { ManageUserComponent } from '../user-profile/manage-user/manage-user.component';
import { TaskDetailsComponent } from '../task/task-details/task-details.component';
import { ManageWorkgroupComponent } from '../user-profile/manage-workgroup/manage-workgroup.component';
import { LocalDateTimeService } from '@app/core/services/local-date-time.service.ts';
import {MatTabChangeEvent} from "@angular/material";


@Component({
  selector: 'sa-query-history-details',
  templateUrl: './query-history-details.component.html',
  styleUrls: ['./query-history-details.component.scss']
})
export class QueryHistoryDetailsComponent implements OnInit {

  public loader = false;
  public filterByNameList;
  userProfileData: any;
  public templateObject: any = {
    criteriaKey: "CUID",
    criteriaValue: "",
    tabList: [],
    filterInput: [],
    actions: [],
    showWidgetDetails: false
  };
  tabs;
  message = '';
  public userData:boolean = false; 
  tablePaginationData = [];
  loaderSystemParameters = true;
  pagination: any = {};
  
  public tableData1;
  public tableValue;
  public reqData = [];
  public reqTableData = [];
  public sectionheader;
  public test: boolean = false;
  pageTitle: string = '';
  IsSuccess = false;
  IsError = false;
  actionButton: any = [];
  actionColumn: any = [];
  queryParameter: any = {
    from: 'queryHistory',
    title: 'Query History',
    isSortAsc: false,
    globalSearch: '',
    tableData: [],

  };
  @Input() editingProfileDetail: any = null;
  @Input() isEditing:boolean;
  public tabChangeEvent:MatTabChangeEvent;
  public getCuid: any;
  constructor(private tabService: TabService, private profileListService: ProfileListService,
    private userProfileService: UserProfileService,
    private workMateService: R2DGService,
    private dataStorage: DataStorageService,
    private taskSerivce: TaskService,
    private dateConvertor: LocalDateTimeService) {      
    this.templateObject.tabList = new Array();    
    //Manage User Search Button Display
    this.ManageUser(); 
    //View more Table view formatt for the complete Data
    for(var i=0; i<this.tabService.tabs.length; i++){
    if (this.tabService.tabs[i].active == true && this.tabService.tabs[i].title =='My History') {
      this.taskSerivce.callGetUrl('/PageLayoutTemplate/Get/Query_History_Table').toPromise().then((res) => {
        var response: any = res;
        this.pagination = response.pageLayoutTemplate[0].fieldsList[0];
        this.pagination.selectedLimit = 10;
        this.actionButton = response.pageLayoutTemplate[1].fieldsList;
        this.sectionheader = response.pageLayoutTemplate[0].sectionHeader;
        this.pagination.currentPageNumber = 1;
        this.pagination.allItems = [];
        this.pagination.pager = { startIndex: 0, endIndex: this.pagination.selectedLimit - 1 };
        this.getSystemParamters(response.pageLayoutTemplate[0].sectionHeader, response.pageLayoutTemplate[2].fieldsList, this.actionColumn)
      }).catch(error => { });
    }
  }
  }
  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem("fd_user"));
    this.profileListService.getFilterByNames().toPromise().then((response:any)=>{
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
  onCriteriaChange(event){
    this.templateObject.criteriaKey = event.target.value;
  }
  ManageUser(){
    if (this.tabService.tabs[0].active == true &&  this.tabService.tabs[0].title =='Manage User') {    
      this.userProfileService.getPageLayout("ManageUser-SearchPanel").subscribe((response: any) => {
        const filterInput = response.pageLayoutTemplate.find((data: any) => data.sectionHeader === "filterInput");
        const actions = response.pageLayoutTemplate.find((data: any) => data.sectionHeader === "Buttons");
        const tabsDefault = response.pageLayoutTemplate.find((data: any) => data.sectionHeader === "Tabs-Default Value");
        this.templateObject.filterInput = filterInput ? filterInput.fieldsList : [];
        this.templateObject.actions = actions ? actions.fieldsList : [];
        this.templateObject.criteriaKey = (tabsDefault && tabsDefault.fieldsList[0]) ? tabsDefault.fieldsList[0].criteriaKey : '';
        this.templateObject.criteriaValue = "";

      });
      this.userData= true
    }
  }

  getSystemParamters(header, field, actions) {
    var add = false,
      editable = false,
      deleteable = false;
    this.queryParameter = {
      ...this.queryParameter,
      sectionheader: header,
      header: field,
      tableData: []
    }
    this.getViewDataTable();
  }
  getViewDataTable() {
    this.loader = true;
    for(var i=0; i<this.tabService.tabs.length; i++){
      if (this.tabService.tabs[i].title == 'My History') {
        this.tableData1 = this.tabService.tabs;
        this.tableValue = this.tableData1[i].tabData["requiredData"];
        this.tableValue["createdDate"] = this.dateConvertor.LocalDate(this.tableValue[i]["creadtedDate"])
        
      }
    }
    this.loader = false;
    this.queryParameter.tableData = [];
    this.queryParameter.tableData = this.tableValue;
    this.pagination.totalRecords = this.tableValue.length;
    this.pagination.totalPage = Math.ceil(this.pagination.totalRecords / this.pagination.selectedLimit);
    var limit = 0
    if (this.pagination.totalRecords > 0 && this.loaderSystemParameters) {
      // this.pagination.pageNumber = 1;
    } else {
      if (this.pagination.pageNumber == 0 && this.pagination.totalRecords > 0) {
        // this.pagination.pageNumber = 1;
      } else if (this.pagination.totalRecords > 0) {
        limit = Number(this.pagination.pageNumber - 1) * Number(this.pagination.selectedLimit)
      }
    }
    this.pagination.allItems = this.pagination.allItems.concat(this.queryParameter.tableData);
    this.loaderSystemParameters = false;
    this.pagination.currentPageNumber = 1;
    this.convertNumberToArray(this.pagination.totalPage);
    this.test = true;
  }
  convertNumberToArray(count: number) {
    this.tablePaginationData = [];
    for (let i = 1; i <= count; i++) {
      this.tablePaginationData.push(i);
    }
  }
  openDetailView(event){
    
    if(event.task["module"] == "Manage User"){
      let tab;   
    if(this.tabService.tabs.length >0){
       tab = this.tabService.tabs.filter((elem) => elem.title == event.task["module"])
       if (tab.length > 0 && event.task["module"] ) {                  
        this.profileListService.test.next(event.task["display"]);
       }
       else{
        let tab = new Tab(ManageUserComponent, 'Manage User',"manage-user", { 'requiredData': event.task["display"] });
        this.tabService.openTab(tab);
        //first time call
        this.profileListService.test.next(event.task["display"]);
       }
       
    }    
  
    // if (event.task["module"]) {
    //  let tab = new Tab(ManageUserComponent, 'Manage User',"manage-user", { 'requiredData': event.task["display"] });
    //  this.tabService.openTab(tab);
    // }
    else{
      let tab = new Tab(ManageUserComponent, 'Manage User',"manage-user", { 'requiredData': event.task["display"] });
      this.tabService.openTab(tab);
      //first time call
      this.profileListService.test.next(event.task["display"]);
     }
    
    }
    else if(event.task["module"]=="Manage task"){
      this.taskSerivce.getTask(event.task["value"] , "").toPromise().then((response: any) => {	      	
        let tab = new Tab(TaskDetailsComponent, 'Task : '+ event.task["display"], 'TaskDetailsComponent', response);
      this.tabService.openTab(tab);
      this.loader = false;
      }), (error: any) => {
          this.loader = false;   
        }; 
      
    }
  
    else if(event.task["module"] == "Manage Workgroup"){      
      let tab;
    if(this.tabService.tabs.length >0) {
      let test =[]
      tab = this.tabService.tabs.filter(elem => elem.title == 'Manage Workgroups');
      console.log(tab);
    
          if(tab.length>0 && event.task["display"]){
            this.userProfileService.queryhistorySubject.next(event.task["display"]);

          }
          else {
              let tab = new Tab(ManageWorkgroupComponent, 'Manage Workgroups', 'manageWorkgroups', { 'queryHistrory': event.task["display"] });
              this.tabService.openTab(tab);
              //first time
              this.userProfileService.queryhistorySubject.next(event.task["display"]);
            }
            // else {
            //   this.userProfileService.queryhistorySubject.next(event.task["display"]);
            // }
      
    }else { 
        let tab = new Tab(ManageWorkgroupComponent, 'Manage Workgroups', 'manageWorkgroups', { 'queryHistrory': event.task["display"] });
        this.tabService.openTab(tab);
    }
  }
  }
 
  
  onRefresh(){
    this.loader = true;
    this.getViewDataTable();
    this.loader = false;
  }

}
export class ManageUserTabInfo {
  tabId: string;
  tabName: string;
  tabContent: string;
  isTableView: boolean;
  isAddUser: boolean;
}

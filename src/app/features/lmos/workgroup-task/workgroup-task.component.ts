import {AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation, ChangeDetectorRef, Type, Input} from '@angular/core';
import { TabService } from '@app/core/tab/tab-service';
import { Tab } from '@app/core/tab/tab.model';
import { TaskDetailsComponent } from '../../task/task-details/task-details.component';
import { MatTableDataSource, MatSort, MatPaginator, MatSnackBar } from '@angular/material';
import { DataStorageService } from '../../task/data-storage.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import printJS from 'print-js';
import { createInjectable } from '@angular/compiler/src/core';
import { forEach } from '@angular/router/src/utils/collection';
import { isObject, isArray, isBoolean } from 'util';
import { TaskService } from '@app/features/task/task.service';
import {LocalDateTimeService} from '@app/core/services/local-date-time.service.ts';

declare var jsPDF: any;
declare const $:any;

@Component({
  selector: 'sa-workgroup-task',
  templateUrl: './workgroup-task.component.html',
  styleUrls: ['./workgroup-task.component.scss']
})
export class WorkgroupTaskComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(DatatableComponent) public table: DatatableComponent;

  @Input() processData: any;
  displayedColumns: string[] = ['view', 'appTaskInstanceId', 'taskStatus', 'application', 'claimId', 'sourceSystem', 'createdById', 'createdDateTime'];
  dataSource: MatTableDataSource<TaskElement>;
  taskResults: Array<TaskElement> = [];
  pagination : any = {};
  searchCriteria : any = {};
  loader: boolean = false;
  loaderTaskDetail = true;
  showResultsTemp: boolean = false;
  nextDisable : boolean = false;
  previousDisable : boolean = true;
  totalPageData:number;
  taskresultwodgetwa = 'taskresultwidget';
  header:any = {
    
  }

  public currentPageLimit: number = 10;
  public maxPageLimit: number = 100;
  public readonly pageLimitOptions = [
    {value: 10},
    {value: 20},
    {value: 50},
    {value: 100}
  ];
  
  searchText:string;
  tempTaskResult:any = [];
  selected = [];
  taskInstance:string='';
  taskStatus:string='';
  applicationName:string='';
  assignedCuid:string='';
  claimId:string='';
  sourceSystem:string='';
  createdById:string='';
  hideTaskInstanceSearch:boolean=true;
  createdDateTime:string='';
	isSortAsc:boolean=false;
  isAllTaskSelected:boolean = false;
  selectedTaskResultCount:number=0;

  //in grid pagination
  gridTotalRecord:number;
  isInnerPageNextEnabled:boolean;
  isInnerPagePreviousEnabled:boolean;
  tablePaginationData:any = [];
  currentPageNumber:number;
  displayTaskResult:Array<TaskElement>=[];
  displayTaskHeaders = [];
  activeSort = '';
  actionButton:any = [];
  sectionheader = '';
  actionColumn:any = [];
  defaultActionColumns: any = [];
  paginationLimitOption = 10;
  Newpagination: any = {};
  totalPage = 0;
  PageLength = 0;
  systemParameter:any = {
    from: 'myworkgrouptasks',
    title: 'My Workgroup tasks',
    isSortAsc: false,
    globalSearch: ''
  };

  myworkgrouptasktabledataBackup: any = [];
  filter = {};

  public stubbedJson = [{
    "fieldLabel": "Search Result",
    "fieldName": "searchResult",
    "type": "SectionalHeader",
    "metadata": {
      "editbutton": false,
      "fullscreenbutton": true,
      "name":"taskresultwodgetwa",
      "togglebutton": true,
      "deletebutton": false,
      "custombutton": false,
      "sortable": false,
      "service": null,
      "size": null,
      "visible": "true",
      "cssRef": "search-task-widget-wrapper"
    },
    "json_descriptor":[{
      "fieldLabel":"Search Table",
      "fieldName":"tablepdf",
      "type":"table",
      "metadata":{
        "pagination":{
          "pageNumber": 0,
          "pageSize": 10,
          "totalRecords": 15
        },
        "pageLimitOptions":[
          10,
          20,
          50,
          100
        ],
        "header":[
          {
            "key":"appTaskInstanceId",
            "label":"App Task Instance Id",
            "visible":true
          },
          {
            "key":"taskStatus",
            "label":"Task Status",
            "visible":true
          },
          {
            "key":"sourceSystem",
            "label":"Application",
            "visible":true
          },
          {
            "key":"taskType",
            "label":"Task type",
            "visible":true
          },
          {
            "key":"sourceSystem",
            "label":"Source System",
            "visible":true
          },
          {
            "key":"createdById",
            "label":"Created By Id",
            "visible":true
          },
          {
            "key":"createdDateTime",
            "label":"Created Date Time",
            "visible":true
          }
        ]
      },
      "json_descriptor":[
        {
          "appTaskInstanceId": "UNI_178448533_NEW_CONNECT_2",
          "taskInstDesc": "",
          "sourceSystem": "SPR",
          "escalated": false,
          "taskStatus": "COMPLETED",
          "taskInstNotes": "",
          "assignedCuid": null,
          "taskType": "SWITCHED_ETHERNET_SVC",
          "workgroupList": null,
          "createdById": "OC",
          "createdDateTime": "2019-03-29 00:00:00.0",
          "modifiedById": null,
          "modifiedDateTime": null
        },
        {
          "appTaskInstanceId": "UNI_178448533_NEW_CONNECT_3",
          "taskInstDesc": "",
          "sourceSystem": "SPR",
          "escalated": false,
          "taskStatus": "CLOSED",
          "taskInstNotes": "",
          "assignedCuid": null,
          "taskType": "SWITCHED_ETHERNET_SVC",
          "workgroupList": null,
          "createdById": "OC",
          "createdDateTime": "2019-03-29 00:00:00.0",
          "modifiedById": "AB42590",
          "modifiedDateTime": "2019-04-15 10:21:43.0"
        }
      ]
    }]
  }];
//Json for search result//
  public pageLayout = {};
  userId: any;
  workgroupList:any;
  constructor(private tabService: TabService, private dataStorageService: DataStorageService,
		  private taskService: TaskService, private snackBar: MatSnackBar, public _ref: ChangeDetectorRef,private date :LocalDateTimeService) {
    // var tableMinResult = this.dataStorageService.getData().slice(0, 5000);
    // console.log(tableMinResult);

    this.taskService.callGetUrl('/PageLayoutTemplate/Get/LMOS WorkGroup Table').toPromise().then((res) => {
      this.pageLayout = res;
      var response: any = res;
      
      // this.searchTask();
			this.pagination = response.pageLayoutTemplate[1].fieldsList[0];
			this.actionButton = response.pageLayoutTemplate[2].fieldsList;
			this.sectionheader = response.pageLayoutTemplate[0].sectionHeader;
      this.actionColumn =  response.pageLayoutTemplate[0].fieldsList;
      this.defaultActionColumns = JSON.parse(JSON.stringify(response.pageLayoutTemplate[0].fieldsList));
      this.filter=[];

      this.pagination.selectedLimit = this.pagination.pageLimitOptions[0];
      this.pagination.pageNumber = 0;
      this.pagination.pageSize = this.maxPageLimit;
      this.pagination.maxPageLimit = this.maxPageLimit;
      this.pagination.currentPageNumber = 0;
      this.pagination.totalRecords = 0;
      this.pagination.allItems = [];
      // console.log(this.pagination);
      // console.log(this.dataStorageService.getSearchCriteria());
      this.systemParameter = {
        ...this.systemParameter,
        sectionheader: this.sectionheader,
        header: this.actionColumn,
        tableData: [] 
      }
    this.tempTaskResult =  this.dataStorageService.getData();
    this.searchCriteria = this.dataStorageService.getSearchCriteria();

    this.pageLayout['pageLayoutTemplate'].forEach(element => {
      this.displayTaskHeaders = [];
      element.fieldsList.forEach(h => {
        if(h.visible){
          this.displayTaskHeaders.push(h);
          this.header[h.key] = '';
        }
      });
    });

    let data = [];
    console.log(this.tempTaskResult);
    if (this.tempTaskResult.length > 0) {
      this.tempTaskResult && this.tempTaskResult.forEach(elem => {
        let newObj = {};
        this.displayTaskHeaders.forEach(h => {
          if(elem && h.key && elem[h.key]) {
            newObj[h.key] = elem[h.key];
          } else {
            newObj[h.key] = null;
          }
        });
        data.push(newObj);
      });
    }
    

    this.tempTaskResult = data;
    console.log(this.tempTaskResult);
    // Set header here
    //if(this.tempTaskResult.length && this.tempTaskResult[0]) {
      //this.displayTaskHeaders = Object.keys(this.tempTaskResult[0]);
    //}

    // this.pagination = this.dataStorageService.getPagination();
    // if(this.pagination.pageNumber <= 0) {
    //   this.previousDisable = true;
    // }
    console.log("paginaton => ",this.pagination);
    this.searchCriteria = this.dataStorageService.getSearchCriteria();
    this.tempTaskResult.map((item,index)=>{
      item.isSelected = false;
      item.taskId = 'T'+index;
    });
    this.filter = {};
    this.taskResults = this.tempTaskResult;
    console.log("Task result => ",this.taskResults);
    this.dataSource = new MatTableDataSource<TaskElement>(this.taskResults);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    let pageCount = this.taskResults.length%10 == 0 ? this.taskResults.length/10:
    this.taskResults.length/10+1;
    this.convertNumberToArray(pageCount);
    this.currentPageNumber = 1;
   // this.displayTaskResult = this.taskResults.splice(0,10);
    this.onPaginateInnerGrid(this.currentPageNumber);
    this.totalPageData = this.taskResults.length;
    this.searchTask();
    
    });
  }
  ngAfterViewChecked() {
		$('table').removeClass('smart-form');
  }
  
  ngOnInit() {

    // this.searchTask();
    
    
   }

   ngAfterViewInit() {
	   $('table').removeClass('smart-form');
	   // var $x = $(".smart-form");
	   // $x.removeProp("padding");
   }

   convertNumberToArray(count:number){
    this.tablePaginationData = [];
    for(let i =1;i<=count;i++){
      this.tablePaginationData.push(i);
    }
   }

   public onLimitChange(limit: any): void {
    this.changePageLimit(limit);
    //this.table.limit = this.currentPageLimit;
    //this.table.recalculate();
    this.onPaginateInnerGrid(1);
  }

  private changePageLimit(limit: any): void {
    this.currentPageLimit = parseInt(limit, 10);
    this.pagination.pageSize = this.currentPageLimit;
    // this.pagination.pageNumber = Math.ceil(this.taskResults.length / this.currentPageLimit);
    this.totalPage = Math.ceil(this.taskResults.length / this.currentPageLimit); 
    this.pagination.totalPage = this.totalPage;
  }
  
    onPaginateInnerGrid(pageNumber:number){
      if(this.taskResults && this.taskResults.length > 0){
        let tempArray = [];
        this.taskResults.map((item)=>{
            tempArray.push(item);
        ;})
        this.displayTaskResult = tempArray.splice((pageNumber-1)*this.currentPageLimit,this.currentPageLimit);
        
        this.currentPageNumber = pageNumber;this.displayTaskResult
        let pageCount = this.taskResults.length%this.currentPageLimit == 0 ? this.taskResults.length/this.currentPageLimit:
        this.taskResults.length/this.currentPageLimit+1;
        this.pagination.currentPageNumber = this.currentPageNumber;
        this.convertNumberToArray(pageCount);
      }else{
        this.displayTaskResult= [];
      }
    }
    onGridNext(){
      if(this.currentPageNumber < this.tablePaginationData.length){
        this.currentPageNumber += 1;
        this.onPaginateInnerGrid(this.currentPageNumber);
      }
    }
    onGridPrevious(){
      if(this.currentPageNumber!=1){
        this.currentPageNumber -= 1;
        this.onPaginateInnerGrid(this.currentPageNumber);
      }
    }
    
    onSingleTaskSelected(task){
        this.taskResults.map(item=>{
          if(task.taskId === item.taskId){
            if(item.isSelected){
              this.selectedTaskResultCount -= 1;
              item.isSelected = false;
            } else{
              this.selectedTaskResultCount += 1;
              item.isSelected = true;
            }
          }
        })
    }
  onSelectAllCheckBox(event){
    this.selectedTaskResultCount  = 0;
    if (event.target.checked ) {
      this.isAllTaskSelected = true;
      this.tempTaskResult.map((item,index)=>{
        if(!item.isRowDetailOpen){
          item.isSelected = true;
          this.selectedTaskResultCount += 1;
        }
      });
      }else{
        this.isAllTaskSelected = false;
        this.tempTaskResult.map((item,index)=>{
          item.isSelected = false;
        });
      }
  }
  printData(){
    // printJS({printable:this.taskResults,properties:['appTaskInstanceId','taskStatus','application','claimId','sourceSystem','createdById','createdDateTime'],type:'json'});
    var columns = [
      // {title: "AppTaskInstanceId", dataKey: "appTaskInstanceId"},
      // {title: "TaskStatus", dataKey: "taskStatus"}, 
      // {title: "Application", dataKey: "application"},
      // {title: "ClaimId", dataKey: "claimId"},
      // {title: "SourceSystem", dataKey: "sourceSystem"}, 
      // {title: "CreatedById", dataKey: "createdById"},
      // {title: "CreatedDateTime", dataKey: "createdDateTime"},
  ];
    console.log(this.displayTaskHeaders);
    this.actionColumn.forEach(element => {
      if (element.visible === true) {
        const obj = {};
        obj['title'] = element.label;
        obj['dataKey'] = element.key;
        columns.push(element.key);
      }
    });
    console.log(columns);
    console.log(this.taskResults);

    printJS({printable:this.taskResults,properties:columns,type:'json'});
 }
  printPDF(){
    var columns = [
      // {title: "AppTaskInstanceId", dataKey: "appTaskInstanceId"},
      // {title: "TaskStatus", dataKey: "taskStatus"}, 
      // {title: "Application", dataKey: "application"},
      // {title: "ClaimId", dataKey: "claimId"},
      // {title: "SourceSystem", dataKey: "sourceSystem"}, 
      // {title: "CreatedById", dataKey: "createdById"},
      // {title: "CreatedDateTime", dataKey: "createdDateTime"},
  ];
  this.actionColumn.forEach(element => {
    if (element.visible === true) {
      const obj = {};
      obj['title'] = element.label;
      obj['dataKey'] = element.key;
      columns.push(obj);
    }
  });
  
  var rows = this.taskResults;
  var doc = new jsPDF('p', 'pt');
  doc.autoTable(columns, rows, {
    theme:'grid',
    styles:{fontStyle:'normal',fontSize:8,overflow:'linebreak'},
    addPageContent: function(data) {
    	doc.text("Task Result", 30, 20);
    }
  });
  doc.save('TaskResult.pdf');
    
  }
  async searchTask(){
    this.isAllTaskSelected = false;
    this.selectedTaskResultCount  = 0;
    
    console.log(this.searchCriteria);
    let userInfo = JSON.parse(localStorage.getItem('fd_user'));
    this.userId = userInfo['cuid'];
    // {"workgroupList":["ASRIRECON", "CDP", "FD_HOOVER"]}

    await this.taskService.getResource(this.userId).toPromise().then((result:any)=>{
        console.log('result============>',result);
        // {"workgroupList":["ASRIRECON", "CDP", "FD_HOOVER"]}
        //         workgroupList: Array(1)
        // 0: {workgroupName: "OWS-ASP"}
        let worklistArr = result.workgroupList;
        let resultArr = [""];
        worklistArr.forEach(element => {
          resultArr.push(element['workgroupName']);
        });
        this.workgroupList  = {"workgroupList":resultArr};
        this.createTable();
    }).catch((error: any) => {
      this.loader = false;
      if(error.status==404){
        console.log(error);
        this.loader = false;
        this.snackBar.open("Error Searching for Task", "Okay", {
          duration: 15000,
        });        
      } 
    });
  }
  async createTable(){
    console.log('workgroupData',this.workgroupList)
    this.searchCriteria.workgroupList = this.workgroupList.workgroupList;
    this.searchCriteria.taskInstanceId = '';
    this.searchCriteria.sourceSystemList = [];
    const searchFields = [];
    const obj = {};
    obj['fieldName'] = 'workgroup';
    if (this.processData.type == 'lmos') {
      obj['value'] = ['LMOS_SCREENERS'];
    }

    if (this.processData.type == 'rcmac') {
      obj['value'] = ['RCMAC BOISE'];
    }
    
    obj['operator'] = 'equals';
    searchFields.push(obj);
    const obj1 = {};
    obj1['fieldName'] = 'status';
    obj1['value'] = ['assigned','Ready']; // this.workgroupList.workgroupList;
    obj1['operator'] = 'equals';
    searchFields.push(obj1);
    this.searchCriteria = {
      "pagination": {
        "pageNumber": this.pagination.pageNumber,
        "pageSize": this.pagination.pageSize,
        "totalRecords": this.pagination.totalRecords
      },
      "searchFields": searchFields
    };
    //this.searchCriteria.pagination = this.pagination;
    //this.searchCriteria.pagination.pageSize = this.pagination.pageSize;
    //console.log(this.searchCriteria);

    //await this.taskService.WorkgroupAdvancedSearchTask(this.searchCriteria).toPromise().then((result:any)=>{
    await this.taskService.WorkgroupAdvancedSearchV3Task(this.searchCriteria).toPromise().then((result:any)=>{
      console.clear();
      console.log('post Data',result);
      this.loader = false;
      this.loaderTaskDetail = false;

      // this.pagination = result.pagination;
      if(result&&result.taskResults){
       this.showResultsTemp = true;
       result.taskResults.map((item,index)=>{
        item.isSelected = false;
        item.taskId = 'T'+index;
      });
      // this.pagination.totalRecords =  result.taskResults.length;
      // this.pagination.pageNumber = (result.taskResults.length > 0) ? 1: 0;
      this.tempTaskResult = [];
      // result.taskResults.forEach(main => {
      //   //console.log(main);
      //   var obj = {};
      //   obj['taskStatus'] = main.taskStatus;
      //   obj['sourceTaskId'] = main.sourceTaskId;
      //   obj['taskInstDesc'] = main.taskInstDesc;
      //   obj['sourceSystemName'] = main.sourceSystemName;
      //   obj['escalatedId'] = main.escalatedId;
      //   obj['taskType'] = main.taskType;
      //   obj['dependencyFlag'] = main.dependencyFlag.toString();
      //   obj['hideTask'] = main.hideTask.toString();
      //   obj['statusCode'] = main.statusCode;
      //   obj['statusMessage'] = main.statusMessage;
      //   obj['version'] = main.version.toString();
      //   obj['workgroupList'] = main.workgroupList;
      //   obj['createdById'] = main.createdById;
      //   obj['createdByName'] = main.createdByName;
      //   obj['createdDtTm'] = this.date.LocalDate(main.createdDtTm);       
      //   obj['modifiedById'] = main.modifiedById;
      //   obj['modifiedByName'] = main.modifiedByName;
      //   obj['modifiedDtTm'] = this.date.LocalDate(main.modifiedDtTm);
      //   obj['allowedactions'] = main.allowedactions;
      //   obj['taskInstParamRequests'] = main.taskInstParamRequests;
      //   obj['taskSectionModels'] = main.taskSectionModels;
      //   obj['id'] = main.id;
      //   obj['taskName'] = main.taskName;
      //   obj['sourceSystemId'] = main.sourceSystemId;
      //   obj['parentTaskId'] = main.parentTaskId;
      //   obj['isParent'] = main.isParent.toString();
      //   obj['notes'] = main.notes;
      //   obj['childStatusCounts'] = main.childStatusCounts;
      //   // obj['assignedName'] = (main.assignedName == '') ? main.assignedCuid : main.assignedCuid + ' (' + main.assignedName + ')'; 
      //   if (main.assignedName != null && main.assignedCuid != null) {
      //     obj['assignedName'] = main.assignedCuid + ' (' + main.assignedName + ')';
      //   } else if (main.assignedName == null && main.assignedCuid != null) {
      //     obj['assignedName'] = main.assignedCuid;
      //   } else if (main.assignedName != null && main.assignedCuid == null) {
      //     obj['assignedName'] = main.assignedName;
      //   }
      //   obj['COMMITDATE'] = "";
      //   obj['TN'] = "0";
      //   obj['TTN'] = "";
      //   obj['RECEIPT'] = "";
      //   obj['OUTOFSERVICE'] = "";
      //   obj['workType'] = "";
      //   let date;
      //   let time;
      //   main.taskInstParamRequests.forEach(mainSub => {
      //     if (mainSub.name == 'COMMITDATE') {
      //       date=mainSub.value;
      //     } else if (mainSub.name == 'TN') {
      //       obj['TN'] = mainSub.value;
      //     } else if (mainSub.name == 'TTN') {
      //       obj['TTN'] = mainSub.value;
      //     } else if (mainSub.name == 'RECEIPT') {
      //       obj['RECEIPT'] = mainSub.value;
      //     } else if (mainSub.name == 'OUTOFSERVICE') {
      //       obj['OUTOFSERVICE'] = mainSub.value;
      //     } else if (mainSub.name == 'workType') {
      //       obj['workType'] = mainSub.value;
      //     } else if (mainSub.name == 'COMMITTIME') {
      //       time=mainSub.value;
      //      }
      //   }); 
      //   //console.log("Commit date"+date);
      //   //console.log("Commit time"+time);   
      //   obj['COMMITDATE']=this.date.convertUTCtoLocalTime(date,time);
      //   this.tempTaskResult.push(obj); 
        
      // });
     this.tempTaskResult= result.taskResults;
     
     for(var i=0; i<this.tempTaskResult.length; i++){
       if(this.tempTaskResult[i].createdDtTm!=null){
        this.tempTaskResult[i].createdDtTm = this.date.LocalDate(this.tempTaskResult[i].createdDtTm);
        
       }
       if(this.tempTaskResult[i].modifiedDtTm!=null){        
        this.tempTaskResult[i].modifiedDtTm = this.date.LocalDate(this.tempTaskResult[i].modifiedDtTm);
       }
     }
     
      console.log(this.tempTaskResult);
      this.systemParameter.tableData = [];
      this.systemParameter.tableData = this.tempTaskResult;      
      this.pagination.totalRecords = result.pagination.totalRecords;
      this.pagination.pageSize = result.pagination.pageSize;
      this.pagination.pageNumber = result.pagination.pageNumber;
      this.pagination.allItems = this.pagination.allItems.concat(this.tempTaskResult);
      // this.tempTaskResult =  result.taskResults;
      // for (let index = 0; index < this.tempTaskResult.length; index++) {
      //   this.tempTaskResult[index]['escalated'] = this.tempTaskResult[index]['escalated'].toString();
      // }
       this.taskResults = this.tempTaskResult;
       this.dataSource = new MatTableDataSource<TaskElement>(this.taskResults);
       this.dataSource.paginator = this.paginator;
       this.dataSource.sort = this.sort;
      // this.pagination = result.pagination;
      //  if(this.pagination.pageNumber <= 0) {
      //    this.previousDisable = true;
      //  }
       let pageCount = this.taskResults.length%this.currentPageLimit == 0 ? this.taskResults.length/this.currentPageLimit:
        this.taskResults.length/this.currentPageLimit+1;
        this.totalPageData = this.taskResults.length;
        this.totalPage = Math.ceil(this.taskResults.length / this.currentPageLimit); 
        this.pagination.totalPage = this.totalPage;

      }else{
        this.loaderTaskDetail = false;
        this.snackBar.open("No Workgroup Assigned To You", 
        "Okay", {
          duration: 15000,
        });
      }
    }).catch((error: any) => {
      this.loaderTaskDetail = false;
      if(error.status==404){
        console.log(error);
        this.loaderTaskDetail = false;
        this.snackBar.open(error.error.message, "Okay", {
          duration: 15000,
        });        
      } 
    });
  }

  refreshTasks(){
    this.loader = true;
    this.searchTask();
  }

  onRefresh() {
    this.nextTasks();
  }
  
  nextTasks(){
    this.currentPageNumber = this.pagination.currentPageNumber;

    setTimeout(() => {
      this.loader = true;
      this.loaderTaskDetail = true;
    }, 10);

    this.searchCriteria.pagination = this.pagination;
    this.searchTask();
  }

  onTaskStatusEding(taskId:string,isEditing:boolean){
    this.taskResults.map(item=>{
      if(taskId === item.taskId && isEditing){        
          item.isStatusEditing = true;        
      } else{
        item.isStatusEditing = false;   
      }
    });    
    this.onPaginateInnerGrid(1);
  }

  applyFilter(filterValue: string) {
    const searchValue = filterValue.trim().toLowerCase();
    this.dataSource.filter = searchValue;
  
    const temp = this.tempTaskResult.filter(function(item) {
      if((item.appTaskInstanceId.toLowerCase().indexOf(searchValue) !== -1 || (item.application && item.application.toLowerCase().indexOf(searchValue)!=-1) ||
      (item.claimId && item.claimId.toLowerCase().indexOf(searchValue)!=-1) ||
      (item.createdById && item.createdById.toLowerCase().indexOf(searchValue)!=-1) ||
      (item.taskStatus.toString() && item.taskStatus.toString().toLowerCase().indexOf(searchValue)!=-1)))
      {
        return true;
      }else{
        return false;
      }
    });
    this.taskResults =  temp;
    this.onPaginateInnerGrid(1);
  }

  dynamicSort(property) {
		var sortOrder = 1;
		if(property[0] === "-") {
			sortOrder = -1;
			property = property.substr(1);
		}
		return function (a,b) {
			var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
			return result * sortOrder;
		}
  }
  onRowDetailClick(task:TaskElement,index:number){
//     let taskelement :TaskElement = {appTaskInstanceId:task.appTaskInstanceId,application:task.application,claimId:task.claimId,createdById:task.createdById,
//   createdDateTime:task.createdDateTime,isRowDetailOpen:true,isSelected:false,isStatusEditing:false,sourceSystem:task.sourceSystem,
// taskId:'',taskInstDesc:0,taskStatus:0,isIconMinus:false};
// let openedTask = this.displayTaskResult[index+1];
// if(openedTask && openedTask.isRowDetailOpen){
//       task.isIconMinus = false;
//       this.displayTaskResult.splice(index+1,1);
// }else{
//   task.isIconMinus = true;
  
//   if(index==9){
//     this.displayTaskResult.push(taskelement);
//   }else{
//     this.displayTaskResult.splice(index+1,0,taskelement);
//   }
// }
    //this.onPaginateInnerGrid(1);

    let taskelement = { ...task,
      isRowDetailOpen:true,
      isSelected:false,
      isStatusEditing:false,
      isIconMinus:false
    };

    let openedTask = this.displayTaskResult[index+1];
    if(openedTask && openedTask.isRowDetailOpen){
      task.isIconMinus = false;
      this.displayTaskResult.splice(index+1,1);
    } else {
      task.isIconMinus = true;
  
      if(index==9) {
        this.displayTaskResult.push(taskelement);
      } else {
        this.displayTaskResult.splice(index+1,0,taskelement);
      }
    }

  }
  onSortSelection(columnName:string){
    this.activeSort = columnName;
    console.log(columnName, this.isSortAsc);
		if(this.isSortAsc){
      this.isSortAsc = false;
      this.systemParameter.isSortAsc = false;
			this.taskResults.sort(this.dynamicSort(columnName));
		}else{
      this.isSortAsc = true;
      this.systemParameter.isSortAsc = true;
			this.taskResults.sort(this.dynamicSort('-'+columnName));
    }
    this.onPaginateInnerGrid(1);
  }


  openTab(event) {
		if (event.link) {
			localStorage.systemId = this.systemParameter.tableData[event.rowIndex].id;
     // let tab = new Tab(TaskDetailsComponent,  event.name + ' TaskDetailsComponent', '/TaskDetailsComponent/', {});
      const tab: Tab = new Tab(TaskDetailsComponent, 'Task : '+event.name, 'TaskDetailsComponent', {});
			this.tabService.openTab(tab);
		}
  }
  
  
	pageChanged(e) {
		this.filterRows(e.page);
	}

  openDetailView(element: any){
    console.log(element);
    const tab: Tab = new Tab(TaskDetailsComponent, 'Task : '+ element.task['sourceTaskId'], 'TaskDetailsComponent', element.task);
    this.tabService.openTab(tab);
  }
  editing = {};
  updateValue(event, cell, taskId:string) {
    // this.editing[rowIndex + '-' + cell] = false;
    // this.taskResults[rowIndex][cell] = event.target.value;
    this.taskResults.map(item=>{
      if(taskId === item.taskId){        
          item.taskStatus = event.target.value;
      }
    });    
    this.onPaginateInnerGrid(1);
  }

  toggleExpandGroup(group) {
    console.log('Toggled Expand Group!', group);
  }  

  onDetailToggle(event) {
    console.log('Detail Toggled', event);
  }
  filterTaskResult(columnName){
    // // console.log(columnName,searchvalue);
    // let taskInstanceId = this.taskInstance.toLowerCase();
    // let taskStatus =this.taskStatus.toLowerCase();
    // let applicationValue =  this.applicationName.toLowerCase();
    // let claimId =this.claimId.toLowerCase();
    // let sourceSystemValue = this.sourceSystem.toLowerCase();
    // let createdByIdValue = this.createdById.toLowerCase();
    // let cretaedByDateTimeValue = this.createdDateTime.toLowerCase();

   

    // if (columnName['key'] === 'taskStatus'){
    //   cretaedByDateTimeValue = searchvalue.toLowerCase();
    // }
    // console.log(taskInstanceId);
    // console.log(taskStatus);
    // console.log(applicationValue);
    // console.log(claimId);
    // console.log(sourceSystemValue);
    // switch(columnName){
    //     case 'taskinstance':
    //     taskInstanceId = this.taskInstance.toLowerCase();
    //     break;
    //     case 'taskstatus':
    //     taskStatus = this.taskStatus.toLowerCase();
    //     break;
    //     case 'application':
    //     applicationValue = this.applicationName.toLowerCase();
    //     break;
    //     case 'claimid':
    //     claimId =  this.applicationName.toLowerCase();
    //     break;
    //     case 'sourcesystem':
    //     sourceSystemValue = this.sourceSystem.toLowerCase();
    //     break;
    //     case 'createdby':
    //     createdByIdValue = this.createdById.toLowerCase();
    //     break;
    //     case 'createddate':
    //     cretaedByDateTimeValue = this.createdDateTime.toLowerCase();
    //     break;
    // }
   // const searchValue = filterValue.trim().toLowerCase();
    // const temp = this.tempTaskResult.filter(function(item) {
    //   if((!taskInstanceId || item.appTaskInstanceId.toLowerCase().indexOf(taskInstanceId) !== -1) 
    //   && (!applicationValue || item.application && item.application.toLowerCase().indexOf(applicationValue)!=-1) &&
    //   (!claimId || item.claimId && item.claimId.toLowerCase().indexOf(claimId)!=-1) &&
    //   (!sourceSystemValue || item.sourceSystem && item.sourceSystem.toLowerCase().indexOf(sourceSystemValue)!=-1) &&
    //   (!createdByIdValue || item.createdById && item.createdById.toLowerCase().indexOf(createdByIdValue)!=-1) &&
    //   (!taskStatus || item.taskStatus.toString() && item.taskStatus.toString().toLowerCase().indexOf(taskStatus)!=-1) &&
    //   (!cretaedByDateTimeValue || item.createdDateTime.toString() && item.createdDateTime.toString().toLowerCase().indexOf(cretaedByDateTimeValue)!=-1))
    //   {
    //     return true;
    //   }else{
    //     return false;
    //   }
    // });
    let thi = this;
    // console.log(thi);
    // console.log(this.systemParameter.globalSearch);
    const globalSearch = this.systemParameter.globalSearch;
    let temp: any;
    if (globalSearch !== '') {
      temp = this.tempTaskResult.filter(row => {
				var result = {};
				for (var key in row) {
          let value = row[key];
          if (isBoolean(row[key])) {
            value  = (row[key])? 'true' : 'false';
          }
          if (isObject(value) === false && isArray(value) === false) {
            if (row.hasOwnProperty(key) && value && value.toUpperCase().indexOf(globalSearch.toUpperCase()) !== -1) {
							result[key] = value;
					  }
          }
				}
				if (Object.keys(result).length == 0) {
						return false;
					} else {
						return true;
					}
			});
    } else {
      temp = this.tempTaskResult.filter(function(item) {
        let flag = true;
        Object.keys(item).forEach((element) => {
          // console.log(thi.actionColumn[element], item[element], element);
          
          if(flag && thi.actionColumn[element] && item[element] && thi.actionColumn[element] != "") {
            
            if(flag && item[element].toLowerCase().indexOf(thi.actionColumn[element].toLowerCase()) === -1) {
              flag = false;
            }
          }
        });
        return flag;
      });
    }
    

    this.taskResults =  temp;
    this.onPaginateInnerGrid(1);
  }
  getRowClass = (row) => {
    return {
      'row-color': true
    };
 }

  viewerFn(fieldname) {
    if (fieldname == 'Pdf') {
      this.printPDF();
    } else if(fieldname == "Print") {
      this.printData();
    }
  }

  expandRow(event: any){
    this.onRowDetailClick(event.data,event.index);
  }

  filterRows(isPagination = 0) {
		this.systemParameter.tableData = JSON.parse(JSON.stringify(this.myworkgrouptasktabledataBackup));
		var tempFullData = this.systemParameter.tableData;
		var temp = [];

		for (var value in this.filter) {
			if(this.filter[value]=="") {
				delete  this.filter[value];
				continue;
			}
			temp = tempFullData.filter(row => {
				if (row[value] && row[value].toUpperCase().indexOf(this.filter[value].toUpperCase()) !== -1)
					return true;
				else
					return false;
			});
			tempFullData = temp;
		}
		 if (Object.keys(this.filter).length == 0) {
		 	temp = JSON.parse(JSON.stringify(this.myworkgrouptasktabledataBackup))
	 	}
		var headerVisible = this.systemParameter.header.map((value)=> {
			if(value.visible) {
				return value.fieldName
			} 
		})
		if(this.systemParameter.globalSearch) {
			temp = temp.filter(row => {
				var result = {};
				for (var key in row) {
					if (headerVisible.indexOf(key) > -1 && row.hasOwnProperty(key) && row[key] && row[key].toUpperCase().indexOf(this.systemParameter.globalSearch.toUpperCase()) !== -1) {
							result[key] = row[key];
					}
				}
				if (Object.keys(result).length == 0) {
						return false;
					} else {
						return true;
					}
			});
		}
		console.log(temp);
		if (isPagination == 0) {
			isPagination = 1;
			setTimeout(() => {
				this.pagination.pageNumber = 1;
			}, 100)
		} else {
			this.pagination.pageNumber = isPagination;
		}

		//this.systemParameter.tableData = temp;
		this.pagination.totalRecords = temp.length;
		this.systemParameter.tableData = temp.slice((isPagination - 1) * this.pagination.selectedLimit, isPagination * this.pagination.selectedLimit);
		this.pagination.totalPage = Math.ceil(this.pagination.totalRecords / this.pagination.selectedLimit);
	}

}

export interface TaskElement {
  isIconMinus:boolean;
  taskId:string;
  appTaskInstanceId: string;
  application: string;
  taskInstDesc: number;
  taskStatus: number;
  claimId: string;
  sourceSystem: string;
  createdById: string;
  createdDateTime: string;
  isSelected:boolean;
  isRowDetailOpen:boolean;
  isStatusEditing:boolean;
}
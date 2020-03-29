import {AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation, Input} from '@angular/core';
import { TabService } from '@app/core/tab/tab-service';
import { Tab } from '@app/core/tab/tab.model';
import { TaskDetailsComponent } from '../../task/task-details/task-details.component';
import { MatTableDataSource, MatSort, MatPaginator, MatSnackBar } from '@angular/material';
import { DataStorageService } from '../data-storage.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import printJS from 'print-js';
import { isObject, isArray, isBoolean } from 'util';
import { TaskService } from '@app/features/task/task.service';
declare var jsPDF: any;
declare const $:any;
@Component({
  selector: 'sa-my-task',
  templateUrl: './my-task.component.html',
  styleUrls: ['./my-task.component.scss']
})
export class MyTaskComponent implements OnInit, AfterViewInit {

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
  systemParameter:any = {
    from: 'mytasks',
    title: 'My Tasks',
    isSortAsc: false,
    globalSearch: ''
  };
  IsSuccess = false;
  message = '';
  IsError = false;
  filter = {};
 
//Json for search result//
  public pageLayout = {};
  userId: any;
  
  constructor(private tabService: TabService, private dataStorageService: DataStorageService
		  , private taskService: TaskService, private snackBar: MatSnackBar) {
    // var tableMinResult = this.dataStorageService.getData().slice(0, 5000);
    // console.log(tableMinResult);

    this.taskService.callGetUrl('/PageLayoutTemplate/Get/Search Table').toPromise().then((res) => {
      this.pageLayout = res;
      var response: any = res;
			this.pagination = response.pageLayoutTemplate[1].fieldsList[0];
			this.actionButton = response.pageLayoutTemplate[2].fieldsList;
			this.sectionheader = response.pageLayoutTemplate[0].sectionHeader;
      this.actionColumn =  response.pageLayoutTemplate[0].fieldsList;
      this.defaultActionColumns = JSON.parse(JSON.stringify(response.pageLayoutTemplate[0].fieldsList));
      this.filter = [];

      this.pagination.selectedLimit = this.pagination.pageLimitOptions[0];
      this.pagination.pageNumber = 0;
      this.pagination.pageSize = this.maxPageLimit;
      this.pagination.maxPageLimit = this.maxPageLimit;
      this.pagination.currentPageNumber = 0;
      this.pagination.totalRecords = 0;
      this.pagination.allItems = [];

      this.systemParameter = {
        ...this.systemParameter,
        sectionheader: this.sectionheader,
        header: this.actionColumn,
        tableData: [] 
      }


    this.tempTaskResult =  this.dataStorageService.getData();
    console.log(this.tempTaskResult,"++++++++++++++++")
    // for (let index = 0; index < this.tempTaskResult.length; index++) {
    //   this.tempTaskResult[index]['escalated'] = this.tempTaskResult[index]['escalated'].toString();
    // }
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
    if(this.tempTaskResult.length > 0 ) {
      this.tempTaskResult.forEach(elem => {
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

    // this.tempTaskResult = data;
    // Set header here
    //if(this.tempTaskResult.length && this.tempTaskResult[0]) {
      //this.displayTaskHeaders = Object.keys(this.tempTaskResult[0]);
    //}

    const paginationData = this.dataStorageService.getPagination();
    // if(this.pagination.pageNumber <= 0) {
    //   this.previousDisable = true;
    // }
    
    this.searchCriteria = this.dataStorageService.getSearchCriteria();
    if(this.tempTaskResult.length > 0 ) {
      this.tempTaskResult.map((item,index)=>{
        item.isSelected = false;
        item.taskId = 'T'+index;
      });
    }
    

    // this.taskResults = this.tempTaskResult;
    console.log(this.processData);
    this.searchTask();
    console.log("Task result => ",this.taskResults);
    // this.pagination.totalRecords = paginationData.totalRecords;
    // this.pagination.pageSize = paginationData.pageSize;
    // this.pagination.pageNumber = paginationData.pageNumber;
    // console.log("paginaton => ",this.pagination);
    // this.dataSource = new MatTableDataSource<TaskElement>(this.taskResults);
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
    // let pageCount = this.taskResults.length%10 == 0 ? this.taskResults.length/10:
    // this.taskResults.length/10+1;
    // this.convertNumberToArray(pageCount);
    // this.currentPageNumber = 1;
  //  this.displayTaskResult = this.taskResults.splice(0,10);
    // this.onPaginateInnerGrid(this.currentPageNumber);
    // this.totalPageData = this.taskResults.length;
    // this.totalPage = Math.ceil(this.taskResults.length / this.currentPageLimit);
    // this.pagination.totalPage = this.totalPage;
    // this.loaderTaskDetail = false;
    });
  }
  ngAfterViewChecked() {
		$('table').removeClass('smart-form');
  }
  
  ngOnInit() {

    
    
    
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
    this.totalPage = Math.ceil(this.taskResults.length / this.currentPageLimit);
    this.pagination.totalPage = this.totalPage;
  }

  

  private changePageLimit(limit: any): void {
    this.currentPageLimit = parseInt(limit, 10);
    this.pagination.pageSize = this.currentPageLimit;
    // this.pagination.totalPage = this.totalPage;
  }
  setPage(pageInfo){
      this.pagination.pageNumber = pageInfo.offset;
      this.searchTask();
    }

    onPaginateInnerGrid(pageNumber:number){
      if(this.taskResults && this.taskResults.length > 0){
        let tempArray = [];
        this.taskResults.map((item)=>{
            tempArray.push(item);
        });
        this.displayTaskResult = tempArray.splice((pageNumber-1)*this.currentPageLimit,this.currentPageLimit);
        
        this.currentPageNumber = pageNumber;
       
        let pageCount = this.taskResults.length%this.currentPageLimit == 0 ? this.taskResults.length/this.currentPageLimit:
        this.taskResults.length/this.currentPageLimit+1;
        this.pagination.currentPageNumber = this.currentPageNumber;
        console.log(this.displayTaskResult);
        console.log(this.pagination);
        console.log(pageCount, pageNumber);
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
  // printData(){
  //   printJS({printable:this.taskResults,properties:['appTaskInstanceId','taskStatus','application','claimId','sourceSystem','createdById','createdDateTime'],type:'json'});
  // }
  // printPDF(){
  //   var columns = [
  //     {title: "AppTaskInstanceId", dataKey: "appTaskInstanceId"},
  //     {title: "TaskStatus", dataKey: "taskStatus"}, 
  //     {title: "Application", dataKey: "application"},
  //     {title: "ClaimId", dataKey: "claimId"},
  //     {title: "SourceSystem", dataKey: "sourceSystem"}, 
  //     {title: "CreatedById", dataKey: "createdById"},
  //     {title: "CreatedDateTime", dataKey: "createdDateTime"},
  // ];
  // var rows = this.taskResults;
  // var doc = new jsPDF('p', 'pt');
  // doc.autoTable(columns, rows, {
  //   theme:'grid',
  //   styles:{fontStyle:'normal',fontSize:8,overflow:'linebreak'},
  //   addPageContent: function(data) {
  //   	doc.text("Task Result", 30, 20);
  //   }
  // });
  // doc.save('TaskResult.pdf');
    
  // }
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
  searchTask(){
    this.isAllTaskSelected = false;
    this.selectedTaskResultCount  = 0;
    this.searchCriteria.pagination= this.pagination;
    this.searchCriteria.pagination.pageSize = 100;
    let userInfo = JSON.parse(localStorage.getItem('fd_user'));
    this.userId = userInfo['cuid'];
    // this.searchCriteria.workgroupList = ["","CDP"];
    this.searchCriteria.assignedCuid = this.userId;
    console.log(this.searchCriteria);
    
    // this.promisFilterData = {"assignedCuid":""+this.userId};
    // this.taskService.searchTask(promisFilterData).toPromise().then((result:any)=>{
    //   console.log('new promiss data',result);
    // });
    const searchFields = [];
    const obj = {};
    obj['fieldName'] = 'assignedCuid';
    obj['value'] = [userInfo['cuid']], // this.workgroupList.workgroupList,
    obj['operator'] = 'equals';
    searchFields.push(obj);
    const obj1 = {};
    obj1['fieldName'] = 'taskType';

    if (this.processData.type == 'lmos') {
      obj1['value'] = ['Screening Trouble-Ticket'];
    }

    if (this.processData.type == 'rcmac') {
      obj1['value'] = ['RCMAC Trouble-Ticket'];
    }
    
    obj1['operator'] = 'equals';
    searchFields.push(obj1);

    const obj2 = {};
    obj2['fieldName'] = 'status';
    obj2['value'] = ["Assigned"], // this.workgroupList.workgroupList,
    obj2['operator'] = 'equals';
    searchFields.push(obj2);

    this.searchCriteria = {
      "pagination": {
        "pageNumber": this.pagination.pageNumber,
        "pageSize": this.pagination.pageSize,
        "totalRecords": this.pagination.totalRecords
      },
      "searchFields": searchFields
    };
    
    this.taskService.advancedSearchV3Task(this.searchCriteria).toPromise().then((result:any)=>{
    //this.taskService.AdvancedSearchTask(this.searchCriteria).toPromise().then((result: any) => {
      this.loader = false;
      this.loaderTaskDetail = false;
      console.log('new promiss data',result);
      // this.pagination = result.pagination;
      if(result && result.taskResults){
       this.showResultsTemp = true;
       result.taskResults.map((item,index)=>{
        item.isSelected = false;
        item.taskId = 'T'+index;
      });
      this.tempTaskResult =  result.taskResults;
      // for (let index = 0; index < this.tempTaskResult.length; index++) {
      //   this.tempTaskResult[index]['escalated'] = this.tempTaskResult[index]['escalated'].toString();
      // }
      this.taskResults = this.tempTaskResult;
      // console.log("Data => ", this.taskResults);
      this.pagination.totalRecords = result.pagination.totalRecords;
      this.pagination.pageSize = result.pagination.pageSize;
      this.pagination.pageNumber = result.pagination.pageNumber;
      this.pagination.allItems = this.pagination.allItems.concat(this.tempTaskResult);
      console.log("paginaton => ",this.pagination);
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
        //this.convertNumberToArray(pageCount);
        //this.onPaginateInnerGrid(1);
        this.totalPage = Math.ceil(this.taskResults.length / this.currentPageLimit);
        this.pagination.totalPage = this.totalPage;
        this.loaderTaskDetail = false;
      }
       else{
        this.IsError = true;
				this.message = "No Task Assigned to your CUID";
				setTimeout(() => {
					this.IsError = false;
				}, 7000);
        // this.snackBar.open("No Task Assigned to your CUID", 
        // "Okay", {
        //   duration: 15000,
        // });
      }
    }, (error:any)=>{
        console.log(error);
        this.loader = false;
        this.loaderTaskDetail = false;
        this.IsError = true;
				this.message = error.error.message;
				setTimeout(() => {
					this.IsError = false;
				}, 7000);
        // this.snackBar.open("Error Searching for Task", "Okay", {
        //   duration: 15000,
        // });
    });
  }
  promisFilterDataa(promisFilterDataa: any) {
    throw new Error("Method not implemented.");
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
		if(this.isSortAsc){
			this.isSortAsc = false;
			this.taskResults.sort(this.dynamicSort(columnName));
		}else{
			this.isSortAsc = true;
			this.taskResults.sort(this.dynamicSort('-'+columnName));
    }
    this.onPaginateInnerGrid(1);
  }

  openDetailView(element: any){
    
    const tab: Tab = new Tab(TaskDetailsComponent, 'Task : '+element.task['sourceTaskId'], 'TaskDetailsComponent', element.task);
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
  filterTaskResult(columnName:string){
    // let taskInstanceId = this.taskInstance.toLowerCase();
    // let taskStatus =this.taskStatus.toLowerCase();
    // let applicationValue =  this.applicationName.toLowerCase();
    // let claimId =this.claimId.toLowerCase();
    // let sourceSystemValue = this.sourceSystem.toLowerCase();
    // let createdByIdValue = this.createdById.toLowerCase();
    // let cretaedByDateTimeValue = this.createdDateTime.toLowerCase();
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
    // let thi = this;
    // const temp = this.tempTaskResult.filter(function(item) {
    //   let flag = true;
    //   Object.keys(item).forEach((element) => {
    //     if(flag && thi.header[element] && item[element] && thi.header[element] != "") {
    //       if(flag && item[element].toLowerCase().indexOf(thi.header[element].toLowerCase()) === -1) {
    //         flag = false;
    //       }
    //     }
    //   });
    //   return flag;
    // });

    // this.taskResults =  temp;
    // this.onPaginateInnerGrid(1);



    let thi = this;
    
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
          // console.log(thi.actionColumn[element], item[element]);
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
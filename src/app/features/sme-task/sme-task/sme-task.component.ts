import { Component, OnInit, Input } from '@angular/core';
import { MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ChartType } from 'chart.js';
import { MultiDataSet, Label } from 'ng2-charts';

import { TaskService } from '@app/features/task/task.service';
import * as examples from "@app/features/graphs/flot-charts/flot-examples";
import { SmetaskAddCommentDialogComponent } from '../smetask-add-comment-dialog/smetask-add-comment-dialog.component';
import { SmeTaskAssignComponent } from '../sme-task-assign/sme-task-assign.component'
import { isObject, isArray } from 'util';
import { ConfDialogComponent } from '@app/features/task/conf-dialog/conf-dialog.component';

@Component({
  selector: 'sa-sme-task',
  templateUrl: './sme-task.component.html',
  styleUrls: ['./sme-task.component.css']
})
export class SmeTaskComponent implements OnInit {
  @Input() processData: any;
  HeaderButton: any;
  Summary: any;
  Details: any;
  public leftSideTabs: any = {
    tab: 'request-details'
  }
  public loader: boolean = true;
  subLoader: boolean = false;
  public flotExamples: any;
  TableFiedls: any;
  taskDetails: any = {};
  taskParentChildList: any = {};
  parentTaskHistory: any = [];
  parentTaskAssignLog: any = [];
  childHistoryList: any = [];
  grandChildList: any = [];
  logPageLayout: any = [];
  logData: any = [];
  logDetails: any = [];
  statusTag: any = [];
  public activityLog = {};
  public customerDetails: any = {};
  public doughnutChartLabels: Label[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
  public doughnutChartData: MultiDataSet = [
    [350, 450, 100]
  ];
  public doughnutChartType: ChartType = 'doughnut';
  private donutColors = [
    {
      backgroundColor: [
        'rgba(77, 169, 68, 1)',
        'rgba(56, 128, 170, 1)',
        'rgba(235, 163, 44, 1)',
        'rgba(228, 59, 52, 1)'
      ]
    }
  ];
  public chartOptions: any = {
    legend: { position: 'left' }
  }
  public chartjsData: any = {
    "sourceData": []
  };
  Pagelayout: any = {};
  tablePaginationData: any = [];
  currentPageNumber: number;
  displayTaskResult: Array<any> = [];
  displayTaskHeaders = [];
  activeSort = '';
  actionButton: any = [];
  sectionheader = '';
  actionColumn: any = [];
  paginationLimitOption = 10;
  Newpagination: any = {};
  totalPage = 0;
  PageLength = 0;
  pagination: any = {};
  public currentPageLimit: number = 10;
  isSortAsc: boolean = false;
  totalPageData: number;
  systemParameter: any = {
    from: 'logDetails',
    title: 'Log Details',
    isSortAsc: false,
    globalSearch: ''
  };
  tableData: any = [
    {
      'isIconMinus': true,
      'isRowDetailOpen': false,
      'seq': '1',
      'subTask': 'OVC Order Complete',
      'statusClass': 'loop',
      'statusName': 'PENDING',
      'statusDetails': 'PENDING - Pending',
      'statusCD': '202',
      'rcvDate': '06/26\n11:53',
      'cmpDate': '',
      'duration': '6 Days\n10:29:31',
      'children': '12'
    },
    {
      'isIconMinus': true,
      'isRowDetailOpen': false,
      'seq': '2',
      'subTask': 'UNI Order Complete',
      'statusClass': 'loop',
      'statusName': 'PENDING',
      'statusDetails': 'PENDING - Pending',
      'statusCD': '202',
      'rcvDate': '06/26\n11:53',
      'cmpDate': '',
      'duration': '6 Days\n10:29:50',
      'children': '0'
    },
    {
      'isIconMinus': true,
      'isRowDetailOpen': false,
      'seq': '3',
      'subTask': 'OVC FOC Received',
      'statusClass': 'loop',
      'statusName': 'CANCELLED',
      'statusDetails': 'CANCELLED - Cancelled',
      'statusCD': 'Cancelled',
      'rcvDate': '06/26\n12:00',
      'cmpDate': '',
      'duration': '6 Days\n10:23:01',
      'children': '12'
    }
  ];
  constructor(
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private taskService: TaskService,
  ) { }

  ngOnInit() {
    console.log("this.processData=====>", this.processData);
    this.taskService.callGetUrl('/PageLayoutTemplate/Get/SME TaskDetails').toPromise().then((resp) => {
      this.Pagelayout = resp;
      console.log(this.Pagelayout);
      this.HeaderButton = this.Pagelayout['pageLayoutTemplate'][2];
      this.Summary = this.Pagelayout['pageLayoutTemplate'][3];
      console.log("this.Summary====>", this.Summary);
      this.Details = this.Pagelayout['pageLayoutTemplate'][4];
      this.TableFiedls = this.Pagelayout['pageLayoutTemplate'][0];
      this.flotExamples = examples;
      console.log(this.HeaderButton);
    });

    this.taskService.callGetUrl('/PageLayoutTemplate/Get/Log%20Details%20Table').toPromise().then((resp) => {
      this.logPageLayout = {
        "pageLayoutTemplate": [
          {
            "sectionHeader": "Log Details",
            "fieldsList": [
              {
                "filter": true,
                "fieldName": "activityType",
                "visible": true,
                "editable": false,
                "link": false,
                "label": "Activity Type",
                "sort": true,
                "type": "TableHeader",
                "fieldValue": "",
                "class": "systemtype"
              },
              {
                "filter": true,
                "fieldName": "activityStatus",
                "visible": true,
                "editable": false,
                "link": false,
                "label": "Activity Status",
                "sort": true,
                "type": "TableHeader",
                "fieldValue": "",
                "class": "systemname"
              },
              {
                "filter": true,
                "fieldName": "activityDetails",
                "visible": true,
                "editable": false,
                "link": false,
                "label": "Activity Details",
                "sort": true,
                "type": "TableHeader",
                "fieldValue": "",
                "class": "systemvalue"
              },
              {
                "filter": true,
                "fieldName": "logdetailscreatedById",
                "visible": true,
                "editable": false,
                "link": false,
                "label": "Activity User",
                "sort": true,
                "type": "TableHeader",
                "fieldValue": "",
                "class": "systemcreatedby"
              },
              {
                "filter": true,
                "fieldName": "logdeatilscreatedDateTime",
                "visible": true,
                "editable": false,
                "link": false,
                "label": "Activity Date Time",
                "sort": true,
                "type": "TableHeader",
                "fieldValue": "",
                "class": "systemcreatedtime"
              }
            ]
          },
          {
            "sectionHeader": "pagination",
            "fieldsList": [
              {
                "totalRecords": 1,
                "fieldName": "pagination",
                "pageNumber": 1,
                "pageNumberText": "Page Number -",
                "totalRecordsText": "Total number of records: ",
                "pageLimitOptions": [
                  10,
                  20,
                  50,
                  100
                ],
                "pageSize": 10,
                "label": "pagination",
                "perPageText": "Per Page",
                "type": "pagination",
                "fieldValue": ""
              }
            ]
          },
          {
            "sectionHeader": "Search Table Buttons",
            "fieldsList": [
              {
                "fieldName": "Filter",
                "visible": true,
                "actionbutton": true,
                "apiUrl": "",
                "label": "Filter",
                "fieldValue": "",
                "class": "search-btn"
              },
              {
                "fieldName": "Pdf",
                "visible": true,
                "actionbutton": true,
                "apiUrl": "",
                "label": "PDF",
                "fieldValue": "",
                "class": "search-btn"
              },
              {
                "fieldName": "Print",
                "visible": true,
                "actionbutton": true,
                "apiUrl": "",
                "label": "Print",
                "fieldValue": "",
                "class": "search-btn"
              },
              {
                "fieldName": "showHideColumns",
                "visible": true,
                "actionbutton": true,
                "apiUrl": "",
                "label": "Show / Hide columns",
                "fieldValue": "",
                "class": "search-btn"
              }
            ]
          }
        ],
        "templateName": "Log Details Table",
        "createdById": "AC30161"
      };
      this.pagination = this.logPageLayout.pageLayoutTemplate[1].fieldsList[0];
      this.actionButton = this.logPageLayout.pageLayoutTemplate[2].fieldsList;
      this.sectionheader = this.logPageLayout.pageLayoutTemplate[0].sectionHeader;
      this.actionColumn = this.logPageLayout.pageLayoutTemplate[0].fieldsList;

      this.pagination.selectedLimit = this.pagination.pageLimitOptions[0];
      this.pagination.pageNumber = 0;
      this.pagination.pageSize = 100;
      this.pagination.currentPageNumber = 0;
      // console.log(this.pagination);
      // console.log(this.dataStorageService.getSearchCriteria());
      this.systemParameter = {
        ...this.systemParameter,
        sectionheader: this.sectionheader,
        header: this.actionColumn,
        tableData: []
      }
    });
    this.getTaskDetails();
  }

  expandAddRow(data, index) {
    console.log(index);
    let taskelement = {
      ...data,
      isRowDetailOpen: true,
      isSelected: false,
      isStatusEditing: false,
      isIconMinus: false
    };

    let openedTask = this.tableData[index + 1];
    if (data.isIconMinus) {

      data.isIconMinus = false;

      if (index == 9) {
        this.tableData.push(taskelement);
      } else {
        this.tableData.splice(index + 1, 0, taskelement);
      }
    } else {
      data.isIconMinus = true;
      this.tableData.splice(index + 1, 1);
    }
    console.log(this.tableData);
  }

  getTaskDetails() {
    let that = this;
    this.loader = true;
    this.taskService.getTask(this.processData.id, this.processData.sourceSystemName).
      toPromise().then((response: any) => {
        this.doughnutChartLabels = [];
        this.doughnutChartData = [];
        this.taskDetails = response;
        console.log(this.taskDetails.childStatusCounts);
        Object.keys(this.taskDetails.childStatusCounts).forEach(function (key) {
          if (key != 'totalCounts') {
            console.log(response.childStatusCounts[key]);
            that.doughnutChartLabels.push(key);
            that.doughnutChartData.push(response.childStatusCounts[key]);
            that.statusTag.push({ 'label': key, 'value': response.childStatusCounts[key] });
          }
        });
        if (this.taskDetails.taskSectionModels) {
          this.taskDetails.taskSectionModels.forEach((taskSectionModel: any) => {
            if (taskSectionModel.header == "CustomerDetails") {
              this.customerDetails = taskSectionModel;
            }
          });
        }

        this.taskService.callGetUrl('/Enterprise/v2/Work/task/' + response['id'] + '/activityLog').toPromise().then((Logresp: any) => {
          console.log("Log Details < == >", Logresp);
          this.logData = Logresp;
          this.logDetails = Logresp;
          for (let index = 0; index < this.logData.length; index++) {
            this.logData[index]['activityDetails'] = this.logData[index]['activityDetails'].replace('/n', '\n');
          }
          this.systemParameter.tableData = [];
          this.systemParameter.tableData = Logresp;
          this.pagination.totalRecords = Logresp.length;
          this.pagination.pageSize = 10;
          this.pagination.pageNumber = 0;
          let pageCount = this.logData.length % this.currentPageLimit == 0 ? this.logData.length / this.currentPageLimit :
            this.logData.length / this.currentPageLimit + 1;
          this.totalPageData = this.logData.length;
          this.totalPage = Math.ceil(this.logData.length / this.currentPageLimit);
          this.pagination.totalPage = this.totalPage;
          this.convertNumberToArray(pageCount);
          this.onPaginateInnerGrid(1);
        });
        this.getTaskParentChildDetails();
      }).catch((error: any) => {
        this.loader = false;
        console.error(error);
        this.snackBar.open("Error loading Task Details..", "Okay", {
          duration: 15000,
        });
      });
  }

  getTaskParentChildDetails() {
    // console.clear();
    let that = this;
    // this.doughnutChartLabels = [];
    // this.doughnutChartData = [];
    let requestData: any = {
      "parentTaskId": this.processData.id,
    }
    this.taskService.searchTaskParentChild(requestData).toPromise().then((response: any) => {
      this.taskParentChildList = response.taskResults || [];
      this.tableData = response.taskResults || [];
      var counts = {};
      this.tableData.forEach(function (x) { counts[x.statusMessage] = (counts[x.statusMessage] || 0) + 1; });
      Object.keys(counts).forEach(function (key) {
        that.chartjsData.sourceData.push({ "label": key, "data": counts[key] });
        // that.doughnutChartLabels.push(key);
        // that.doughnutChartData.push(counts[key]);
      });
      console.log(this.chartjsData);
      this.tableData.forEach((tableRow: any, i) => {
        tableRow.seq = i + 1;
        tableRow.isRowDetailOpen = false;
        tableRow.isIconMinus = true;
        tableRow.totalCounts = tableRow.childStatusCounts.totalCounts;
        tableRow.doughnutChartData = [];
        tableRow.doughnutChartLabels = [];
        Object.keys(tableRow.childStatusCounts).forEach(function (key) {
          if (key != 'totalCounts') {
            tableRow.doughnutChartLabels.push(key);
            tableRow.doughnutChartData.push(tableRow.childStatusCounts[key]);
          }
        });

      });
      this.getWorkGroupActivity(this.taskDetails);
      console.log(counts);
      console.log(this.taskParentChildList);
      console.log(this.tableData);
      this.loader = false;
    }).catch((error: any) => {
      this.loader = false;
      console.error(error);
      this.snackBar.open("Error loading Task Details..", "Okay", {
        duration: 15000,
      });
    });
  }

  getWorkGroupActivity(taskDetails) {
    this.taskService.getUserorWorkgroupactivity(taskDetails.id, 'ASSIGN WORKGROUP').toPromise().then((response: any) => {
      this.taskDetails.assignedWorkGroupData = response;
      this.taskDetails.assignedWorkGroups = response[0] ? response[0].activityValue : '';
      console.log(response);
    }).catch((error: any) => {
      console.error(error);
      this.snackBar.open("Error loading data..", "Okay", {
        duration: 15000,
      });
    });
  }

  getParentTaskStatusHistory(taskDetails, history, box) {
    console.clear();
    console.log(taskDetails);
    console.log(history);
    console.log(box);
    if (!history && box.header.label == 'Status') {
      this.taskService.getStatusHistory(taskDetails.id).toPromise().then((response: any) => {
        this.parentTaskHistory = response || [];
        console.log(response);
      }).catch((error: any) => {
        console.error(error);
        this.snackBar.open("Error loading Task Status History..", "Okay", {
          duration: 15000,
        });
      });
    }
    else if (!history && box.header.label == 'Assigned To') {
      this.taskService.getUserorWorkgroupactivity(taskDetails.id, 'ASSIGN USER').toPromise().then((response: any) => {
        this.parentTaskAssignLog = response || [];
        console.log(response);
      }).catch((error: any) => {
        console.error(error);
        this.snackBar.open("Error loading data..", "Okay", {
          duration: 15000,
        });
      });
    }
  }

  getStatusColor(taskStatus) {
    switch (taskStatus.toLowerCase()) {
      case 'in progress':
        return 'rgb(56, 128, 170)'
        break;
      case 'complete':
        return 'rgb(77, 169, 68)'
        break;
      case 'cancelled':
        return 'rgb(235, 163, 44)'
        break;
      case 'failed':
        return 'rgb(228, 59, 52)'
        break;
      default:
        return 'rgb(0, 0, 0)'
        break;
    }
  }

  getStatusHistory(rowData) {
    //SME_1800477888
    //SME_Test_7112019
    // SDW392844SHW_C05
    //SDW392844SHW_C18
    //SDW392844SHW_C15
    //SDW392TR53-P10_23
    //1560811517731
    console.log("rowData", rowData);
    this.subLoader = true;
    this.taskService.getStatusHistory(rowData.id).toPromise().then((response: any) => {
      this.childHistoryList = response || [];
      this.subLoader = false;
      console.log(response);
    }).catch((error: any) => {
      console.error(error);
      this.subLoader = false;
      this.snackBar.open("Error loading Task Details..", "Okay", {
        duration: 15000,
      });
    });
  }

  getGrandChildList(childDetails) {
    let requestData: any = {
      "parentTaskId": childDetails.id,
    }
    // this.chartjsData.sourceData = [];
    this.taskService.searchTaskParentChild(requestData).toPromise().then((response: any) => {
      this.grandChildList = response.taskResults || [];
      this.grandChildList.forEach((tableRow: any, i) => {
        tableRow.seq = i + 1;
        tableRow.isRowDetailOpen = false;
        tableRow.isIconMinus = true;
        tableRow.totalCounts = tableRow.childStatusCounts.totalCounts;
      });
      console.clear();
      console.log(this.grandChildList);
      this.loader = false;
    }).catch((error: any) => {
      this.loader = false;
      console.error(error);
      this.snackBar.open("Error loading Task Details..", "Okay", {
        duration: 15000,
      });
    });
  }

  ButtonClick(fieldName) {
    switch (fieldName) {
      case 'add_comment':
        this.UserAddComment();
        break;
      case 'assign_user':
        this.AssignUserDialog();
        break;
      default:
        break;
    }
  }

  UserAddComment() {
    const dialogRef = this.dialog.open(SmetaskAddCommentDialogComponent, {
      data: {
        id: this.processData.id
      }
    });
  }

  AssignUserDialog() {
    const dialogRef = this.dialog.open(SmeTaskAssignComponent, {
      data: {
        id: this.processData.id
      }
    });
  }

  filterTaskResult(columnName: string) {
    let thi = this;
    console.log(thi);
    /* const temp = this.logDetails.filter(function (item) {
      let flag = true;
      Object.keys(item).forEach((element) => {
        let searchelem = element;
        if (element === 'createdById') {
          searchelem = 'logdetailscreatedById';
        } else if (element === 'createdDateTime') {
          searchelem = 'logdeatilscreatedDateTime';
        }
        if (flag && thi.activityLog[searchelem] && item[element] && thi.activityLog[searchelem] != "") {
          if (flag && item[element].toLowerCase().indexOf(thi.activityLog[searchelem].toLowerCase()) === -1) {
            flag = false;
          }
        }
      });
      return flag;
    });
    this.logData = temp; */

    const globalSearch = this.systemParameter.globalSearch;
    let temp: any;
    if (globalSearch !== '') {
      temp = this.logDetails.filter(row => {
        var result = {};
        for (var key in row) {
          let searchelem = key;
          if (row === 'createdById') {
            searchelem = 'logdetailscreatedById';
          } else if (row === 'createdDateTime') {
            searchelem = 'logdeatilscreatedDateTime';
          }
          if (isObject(row[searchelem]) === false || isArray(row[searchelem]) === false) {
            if (row.hasOwnProperty(searchelem) && row[searchelem] && row[searchelem].toUpperCase().indexOf(globalSearch.toUpperCase()) !== -1) {
              result[searchelem] = row[searchelem];
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
      temp = this.logDetails.filter(function (item) {
        let flag = true;
        Object.keys(item).forEach((element) => {
          let searchelem = element;
          if (element === 'createdById') {
            searchelem = 'logdetailscreatedById';
          } else if (element === 'createdDateTime') {
            searchelem = 'logdeatilscreatedDateTime';
          }
          if (flag && thi.actionColumn[searchelem] && item[element] && thi.actionColumn[searchelem] != "") {
            if (flag && item[element].toLowerCase().indexOf(thi.actionColumn[searchelem].toLowerCase()) === -1) {
              flag = false;
            }
          }
        });
        return flag;
      });
    }

    this.logData = temp;
    this.onPaginateInnerGrid(1);
  }

  convertNumberToArray(count: number) {
    this.tablePaginationData = [];
    for (let i = 1; i <= count; i++) {
      this.tablePaginationData.push(i);
    }
    this.pagination.totalPage = this.tablePaginationData.length;
  }

  onPaginateInnerGrid(pageNumber: number) {
    if (this.logData && this.logData.length > 0) {
      let tempArray = [];
      this.logData.map((item) => {
        tempArray.push(item);
        ;
      })
      this.displayTaskResult = tempArray.splice((pageNumber - 1) * this.currentPageLimit, this.currentPageLimit);

      this.currentPageNumber = pageNumber; this.displayTaskResult
      let pageCount = this.logData.length % this.currentPageLimit == 0 ? this.logData.length / this.currentPageLimit :
        this.logData.length / this.currentPageLimit + 1;
      this.pagination.currentPageNumber = this.currentPageNumber;
      // this.pagination.totalPage = Math.ceil(pageCount); // pageCount;
      this.pagination.totalRecords = this.logData.length;
      this.convertNumberToArray(pageCount);
    } else {
      this.displayTaskResult = [];
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
    this.totalPage = Math.ceil(this.logData.length / this.currentPageLimit);
    this.pagination.totalPage = this.totalPage;
  }

  onGridNext() {
    if (this.currentPageNumber < this.tablePaginationData.length) {
      this.currentPageNumber += 1;
      this.onPaginateInnerGrid(this.currentPageNumber);
    }
  }
  onGridPrevious() {
    if (this.currentPageNumber != 1) {
      this.currentPageNumber -= 1;
      this.onPaginateInnerGrid(this.currentPageNumber);
    }
  }

  dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (a, b) {
      var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
    }
  }

  onSortSelection(columnName: string) {
    this.activeSort = columnName;
    console.log(columnName, this.isSortAsc);
    if (this.isSortAsc) {
      this.isSortAsc = false;
      this.systemParameter.isSortAsc = false;
      this.logData.sort(this.dynamicSort(columnName));
    } else {
      this.isSortAsc = true;
      this.systemParameter.isSortAsc = true;
      this.logData.sort(this.dynamicSort('-' + columnName));
    }
    this.onPaginateInnerGrid(1);
  }

  showAdditionalDetails(event, taskDetails){
    let task: any = taskDetails.id;
		let log: any = event.data.id;
		let url: any = '/Enterprise/v2/Work/task/'+task+'/activityLog/'+log+'/additionalDetails'
		// console.log("Log additional Details url< == >", url);
		this.taskService.getAddionalDetails(url).toPromise().then((Logresp: any) => {
			// console.log("Log Details < == >", Logresp);
			// console.log("taskDetails < == >", taskDetails);
			// console.log("eventdata < == >", event);

			let details : any = "";
			// var parser, xmlDoc;
			if(Logresp){
				details = Logresp;
				// parser = new DOMParser();
				// xmlDoc = parser.parseFromString(details,"text/xml");
				// console.log("xmlDoc < == >", xmlDoc);
			}else{
				details = "No Additional Details.";
			}
			
			let dialogRef = this.dialog.open(ConfDialogComponent, {
				disableClose: false, data: {
					message: details,
					okText: "Close"
				}
			});
			
		}).catch((errorObj: any) => {
			console.error(errorObj);
    });
  }

}

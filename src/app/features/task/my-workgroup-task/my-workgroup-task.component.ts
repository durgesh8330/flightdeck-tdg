import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { TabService } from '@app/core/tab/tab-service';
import { Tab } from '@app/core/tab/tab.model';
import printJS from 'print-js';
import { isArray, isBoolean, isObject } from 'util';
import { DataStorageService } from '../data-storage.service';
import { MyAbstractTask } from '../my-abstract-task';
import { TaskDetailsComponent } from '../task-details/task-details.component';
import { TaskService } from '../task.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UserProfileService } from '@app/features/user-profile/user-profile.service';
declare var jsPDF: any;
declare const $: any;

@Component({
  selector: 'sa-my-workgroup-task',
  templateUrl: './my-workgroup-task.component.html',
  styleUrls: ['./my-workgroup-task.component.scss']
})
export class MyWorkgroupTaskComponent extends MyAbstractTask {

  displayedColumns: string[] = ['view', 'appTaskInstanceId', 'taskStatus', 'application', 'claimId', 'sourceSystem', 'createdById', 'createdDateTime'];
  taskresultwodgetwa = 'taskresultwidget';

  searchText: string;
  tempTaskResult: any = [];
  selected = [];
  taskInstance: string = '';
  taskStatus: string = '';
  applicationName: string = '';
  assignedCuid: string = '';
  claimId: string = '';
  sourceSystem: string = '';
  createdById: string = '';
  hideTaskInstanceSearch: boolean = true;
  createdDateTime: string = '';
  isSortAsc: boolean = false;
  
  myworkgrouptasktabledataBackup: any = [];

  public stubbedJson = [{
    "fieldLabel": "Search Result",
    "fieldName": "searchResult",
    "type": "SectionalHeader",
    "metadata": {
      "editbutton": false,
      "fullscreenbutton": true,
      "name": "taskresultwodgetwa",
      "togglebutton": true,
      "deletebutton": false,
      "custombutton": false,
      "sortable": false,
      "service": null,
      "size": null,
      "visible": "true",
      "cssRef": "search-task-widget-wrapper"
    },
    "json_descriptor": [{
      "fieldLabel": "Search Table",
      "fieldName": "tablepdf",
      "type": "table",
      "metadata": {
        "pagination": {
          "pageNumber": 0,
          "pageSize": 10,
          "totalRecords": 15
        },
        "pageLimitOptions": [
          10,
          20,
          50,
          100
        ],
        "header": [
          {
            "key": "appTaskInstanceId",
            "label": "App Task Instance Id",
            "visible": true
          },
          {
            "key": "taskStatus",
            "label": "Task Status",
            "visible": true
          },
          {
            "key": "sourceSystem",
            "label": "Application",
            "visible": true
          },
          {
            "key": "taskType",
            "label": "Task type",
            "visible": true
          },
          {
            "key": "sourceSystem",
            "label": "Source System",
            "visible": true
          },
          {
            "key": "createdById",
            "label": "Created By Id",
            "visible": true
          },
          {
            "key": "createdDateTime",
            "label": "Created Date Time",
            "visible": true
          }
        ]
      },
      "json_descriptor": [
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

  userId: any;
  workgroupList: any;
  constructor(public tabService: TabService, public dataStorageService: DataStorageService
    , public taskService: TaskService, public snackBar: MatSnackBar, public _ref: ChangeDetectorRef, protected modalService: BsModalService, protected userProfileService: UserProfileService) {

    super(tabService, taskService, snackBar, dataStorageService, 'My Workgroup tasks', modalService, userProfileService, _ref);

    const searchFields = [];
    this.searchCriteria = {
      "pagination": this.pagination,
      "searchFields": searchFields,
      "name": "MY WORKGROUP TASKS"
    };

    dataStorageService.setSearchCriteria(this.searchCriteria);
    //this.getPageLayoutData('No Workgroup Assigned To You');

  }
  ngAfterViewChecked() {
    $('table').removeClass('smart-form');
  }

  printData() {
    // printJS({printable:this.taskResults,properties:['appTaskInstanceId','taskStatus','application','claimId','sourceSystem','createdById','createdDateTime'],type:'json'});
    var columns = [];
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

    printJS({ printable: this.taskResults, properties: columns, type: 'json' });
  }
  printPDF() {
    var columns = [];
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
      theme: 'grid',
      styles: { fontStyle: 'normal', fontSize: 8, overflow: 'linebreak' },
      addPageContent: function (data) {
        doc.text("Task Result", 30, 20);
      }
    });
    doc.save('TaskResult.pdf');

  }

  
  onTaskStatusEding(taskId: string, isEditing: boolean) {
    this.taskResults.map(item => {
      if (taskId === item.taskId && isEditing) {
        item.isStatusEditing = true;
      } else {
        item.isStatusEditing = false;
      }
    });
  }

  openTab(event) {
    if (event.link) {
      localStorage.systemId = this.systemParameter.tableData[event.rowIndex].id;
      // let tab = new Tab(TaskDetailsComponent,  event.name + ' TaskDetailsComponent', '/TaskDetailsComponent/', {});
      const tab: Tab = new Tab(TaskDetailsComponent, 'Task : ' + event.name, 'TaskDetailsComponent', {});
      this.tabService.openTab(tab);
    }
  }
  
  editing = {};
  
  toggleExpandGroup(group) {
    console.log('Toggled Expand Group!', group);
  }

  onDetailToggle(event) {
    console.log('Detail Toggled', event);
  }
 
  getRowClass = (row) => {
    return {
      'row-color': true
    };
  }

  viewerFn(fieldname) {
    if (fieldname == 'Pdf') {
      this.printPDF();
    } else if (fieldname == "Print") {
      this.printData();
    }
  }

  expandRow(event: any) {
    this.onRowDetailClick(event.data, event.index);
  }

}
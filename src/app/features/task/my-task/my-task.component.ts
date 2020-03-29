import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { TabService } from '@app/core/tab/tab-service';
import printJS from 'print-js';
import { isArray, isBoolean, isObject } from 'util';
import { DataStorageService } from '../data-storage.service';
import { MyAbstractTask } from '../my-abstract-task';
import { TaskService } from '../task.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UserProfileService } from '@app/features/user-profile/user-profile.service';
declare var jsPDF: any;
declare const $: any;
@Component({
  selector: 'sa-my-task',
  templateUrl: './my-task.component.html',
  styleUrls: ['./my-task.component.scss']
})
export class MyTaskComponent extends MyAbstractTask {

  displayedColumns: string[] = ['view', 'appTaskInstanceId', 'taskStatus', 'application', 'claimId', 'sourceSystem', 'createdById', 'createdDateTime'];
  taskresultwodgetwa = 'taskresultwidget';
  
  searchText: string;
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
  
  //Json for search result//
  userId: any;

  constructor(protected tabService: TabService, protected dataStorageService: DataStorageService
    , protected taskService: TaskService, protected snackBar: MatSnackBar, protected modalService: BsModalService, protected userProfileService: UserProfileService, public _ref: ChangeDetectorRef) {
    super(tabService, taskService, snackBar, dataStorageService, 'My Tasks', modalService, userProfileService, _ref);
    
    const searchFields = [];

    this.searchCriteria = {
      "pagination": this.pagination,
      "searchFields": searchFields,
      "name":"My Tasks"
    };

    dataStorageService.setSearchCriteria(this.searchCriteria);
    //this.getPageLayoutData('No Task Assigned to your CUID');
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
 
  promisFilterDataa(promisFilterDataa: any) {
    throw new Error("Method not implemented.");
  }

  editing = {};
  
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

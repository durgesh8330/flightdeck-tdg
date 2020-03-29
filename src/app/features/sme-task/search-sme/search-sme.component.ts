import { Component, OnInit, Input } from '@angular/core';
import { ProcessComponent } from '@app/core/page-content/process';
import { MatSnackBar } from '@angular/material';
import { Tab } from '@app/core/tab/tab.model';
import { TabService } from '@app/core/tab/tab-service';
import { TaskService } from '@app/features/task/task.service';
import { DataStorageService } from '@app/features/task/data-storage.service';
import { SearchResultComponent } from '@app/features/task/search-result/search-result.component';
import { isArray } from 'util';

@Component({
  selector: 'sa-search-sme',
  templateUrl: './search-sme.component.html',
  styleUrls: ['./search-sme.component.css']
})
export class SearchSmeComponent implements OnInit {

  @Input() processData: any;
  public request: any = {};
  public skillList: Array<string>;
  public workgroupList: Array<string>;
  public applicationList: Array<string>;
  public taskTypeList: Array<string>;
  public loader: boolean = true;
  public showResults: boolean = false;
  public showResultsTemp: boolean = false;
  public sprAvailable: boolean = true;
  public header: string = 'Global Search Parameter123';

  public fileds: Array<Object>;
  public options: any;
  public layOutCounter: any = 1;
  public errorMessage: any;
  IsSuccess = false;
  IsError = false;
  message = '';
  public pageLayout: any = {
    /* "pageLayoutTemplate": [
      {
        "sectionHeader": "Search by Request Level",
        "sectionVisibility": true,
        "fieldsList": [
          {
            "fieldName": "correlationId",
            "visible": true,
            "editable": true,
            "service": "/TaskType/GetAll",
            "label": "Correlation Id",
            "type": "TextBox",
            "fieldValue": "",
            "order": 1
          },
          {
            "fieldName": "workgroup",
            "visible": true,
            "editable": true,
            "service": "/Workgroup/GetAll",
            "label": "Workgroup",
            "type": "MultiSelect",
            "fieldValue": "",
            "order": 2
          },
          {
            "fieldName": "createdBy",
            "size": 100,
            "editable": true,
            "label": "Created By",
            "type": "TextBox",
            "fieldValue": "",
            "order": 3
          },
          {
            "fieldName": "fromDate",
            "visible": "true",
            "editable": true,
            "label": "From Date",
            "type": "Date",
            "fieldValue": "",
            "order": 4
          },
          {
            "fieldName": "toDate",
            "visible": "true",
            "editable": true,
            "label": "To Date",
            "type": "Date",
            "fieldValue": "",
            "order": 5
          },
          {
            "fieldName": "offering",
            "visible": true,
            "editable": true,
            "service": "/Workgroup/GetAll",
            "label": "Task Name",
            "type": "MultiSelect",
            "fieldValue": "",
            "order": 6
          },
          {
            "fieldName": "AssignedTo",
            "size": 100,
            "editable": true,
            "label": "Assigned To",
            "type": "TextBox",
            "fieldValue": "",
            "order": 7
          },
          {
            "fieldName": "Action",
            "visible": true,
            "editable": true,
            "service": "/Workgroup/GetAll",
            "label": "Action",
            "type": "MultiSelect",
            "fieldValue": "",
            "order": 8
          },
          {
            "fieldName": "publicUserId",
            "visible": true,
            "editable": true,
            "label": "public User Id",
            "type": "TextBox",
            "fieldValue": "",
            "order": 9
          }
        ]
      },
      {
        "sectionHeader": "Search by Micro Service",
        "sectionVisibility": true,
        "fieldsList": [
          {
            "fieldName": "trasactionId",
            "size": 100,
            "editable": true,
            "label": "Task Instance Id",
            "type": "TextBox",
            "fieldValue": "",
            "order": 1
          },
          {
            "fieldName": "microserviceName",
            "size": 100,
            "editable": true,
            "label": "Micro Service Name",
            "type": "MultiSelect",
            "fieldValue": "",
            "order": 2
          },
          {
            "fieldName": "status",
            "size": 100,
            "editable": true,
            "label": "Status",
            "type": "MultiSelect",
            "fieldValue": "",
            "order": 3
          },
          {
            "fieldName": "statusCode",
            "size": 100,
            "editable": true,
            "label": "Status Code",
            "type": "MultiSelect",
            "fieldValue": "",
            "order": 4
          },
          {
            "fieldName": "statusMessage",
            "size": 100,
            "editable": true,
            "label": "Status Message",
            "type": "MultiSelect",
            "fieldValue": "",
            "order": 5
          },
          {
            "fieldName": "action",
            "size": 100,
            "editable": true,
            "label": "Action",
            "type": "MultiSelect",
            "fieldValue": "",
            "order": 6
          },
          {
            "fieldName": "correlationId",
            "size": 100,
            "editable": true,
            "label": "Parent task instance Id",
            "type": "TextBox",
            "fieldValue": "",
            "order": 6
          }
        ]
      },
      {
        "sectionHeader": "Buttons",
        "fieldsList": [
          {
            "fieldName": "Reset",
            "btnVisibility": true,
            "toolTip": " clears data",
            "label": "Reset",
            "type": "Button",
            "fieldValue": "",
            "class": "search-btn  reset-bgclr",
            "click": "clear",
            "order": 1
          },
          {
            "fieldName": "Search",
            "btnVisibility": true,
            "toolTip": "Used to search non hidden tasks",
            "label": "Search",
            "type": "Button",
            "fieldValue": "",
            "class": "search-btn",
            "click": "searchTask",
            "order": 2
          }
        ]
      }
    ],
    "templateName": "SME Search",
    "createdById": "AC30161" */
  };
  public modelValue: any = {};
  constructor(private taskService: TaskService, private dataStorageService: DataStorageService, private tabService: TabService, private snackBar: MatSnackBar) {
    this.getTemplateLayouts();
  }

  ngOnInit() {
    // this.loader = false;
  }

  getTemplateLayouts() {
    this.loader = true;
    this.taskService.callGetUrl('/PageLayoutTemplate/Get/SME Search').toPromise().then((res) => {
      this.pageLayout = res;
      if (this.pageLayout.pageLayoutTemplate) {
        this.pageLayout.pageLayoutTemplate.forEach((layoutElem: any) => {
          layoutElem.sectionVisibility = true;
          console.log(layoutElem);
        });
      }
      this.loader = false;
      console.log(this.pageLayout);
    });
  }

  prepareRequest() {
    this.request = [];
    if (this.pageLayout['pageLayoutTemplate']) {
      // console.clear();
      this.pageLayout['pageLayoutTemplate'].forEach(data => {
        if (data.sectionHeader != "Buttons") {
          console.log(data.sectionHeader);
          console.log(data.fieldsList);
          data.fieldsList.forEach(element => {
            console.log("ALL", element.fieldName);
            if (this.modelValue[element.label]) {
              console.log("fieldValue", element);
              var value: any = [];
              if (isArray(this.modelValue[element.label])) {
                value = this.modelValue[element.label];
              } else {
                value.push(this.modelValue[element.label]);
              }
              this.request.push({
                "fieldName": element.fieldName,
                "value": value,
                "operator": "equals"
              });
            }
          });
        }
      });
    }
  }

  searchTask(layoutElem) {
    this.loader = true;
    console.log(JSON.parse(JSON.stringify(this.modelValue)));

    /* let searchFields = [];
    layoutElem.forEach(element => {
      if (element.fieldValue) {
        searchFields.push({
          "fieldName": element.fieldName,
          "value": [element.fieldValue],
          "operator": "contains"
        });
      }
    }); */
    this.prepareRequest();
    console.log(JSON.parse(JSON.stringify(this.modelValue)));
    console.log(this.request);

    this.taskService.advancedSearchV3Task({ "searchFields": this.request }).toPromise().then((result: any) => {
      this.loader = false;
      this.modelValue = {};
      if (result && result.taskResults && result.taskResults.length > 0) {
        this.dataStorageService.setData(result.taskResults);
        this.dataStorageService.setPagination(result.pagination);
        let tab = new Tab(SearchResultComponent, 'Search Result', 'searchTask', {});
        this.tabService.openTab(tab);
      } else {
        this.IsError = true;
        this.message = "No Data Found for the provided criteria, Please try searching with valid data.";
        setTimeout(() => {
          this.IsError = false;
        }, 15000);
        // this.snackBar.open("No Data Found for the provided criteria, Please try searching with valid data.", "Okay", {
        //   duration: 15000,
        // });
      }
    }, (error: any) => {
      this.loader = false;
      this.IsError = true;
      this.message = "Error Searching for Task";
      setTimeout(() => {
        this.IsError = false;
      }, 15000);
      //this.disableSearch = false;
      // this.snackBar.open("Error Searching for Task", "Okay", {
      //   duration: 15000,
      // });
    });
  }

  clear(data) {
    let keys = Object.keys(this.modelValue);
    // console.log("Layout Elem : ", keys);
    keys.forEach((element: any) => {
      if (element) {
        // console.log("Type ==> ", typeof this.modelValue[element]);
        if (typeof this.modelValue[element] === 'string') {
          this.modelValue[element] = '';
        } else {
          this.modelValue[element] = [];
        }
      }

    });
  }

}

import { Component, Input, OnDestroy, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ProcessComponent } from '@app/core/page-content/process';
import { TabService } from '@app/core/tab/tab-service';
import { Tab } from '@app/core/tab/tab.model';
import { SearchLayoutComponent } from '@app/shared/search-layout/search-layout.component';
import { Subscription } from 'rxjs';
import { isArray } from 'util';
import { DataStorageService } from '../../task/data-storage.service';
import { SearchResultComponent } from '../../task/search-result/search-result.component';
import { TaskService } from '../../task/task.service';

@Component({
  selector: 'sa-r2dg-search',
  templateUrl: './r2dg-search.component.html',
  styleUrls: ['./r2dg-search.component.css']
})
export class R2dgSearchComponent implements OnInit, AfterViewInit, AfterViewChecked, ProcessComponent, OnDestroy {

  @Input() processData: any;
  public request: any = {};
  public skillList: Array<string>;
  public workgroupList: Array<string>;
  public workgroupListSubscription: Subscription;
  public applicationList: Array<string>;
  public taskTypeList: Array<string>;
  public taskTypeListSubscription: Subscription;
  public sourceSystems: Array<string>;
  public sourceSystemsSubscription: Subscription;
  public taskStatus: Array<string>;
  public taskStatusSubscription: Subscription;
  public loader: boolean = true;
  public showResults: boolean = false;
  public showResultsTemp: boolean = false;
  public sprAvailable: boolean = true;
  public header: string = 'Global Search Parameter123';


  public fileds: Array<Object>;
  public options: any;
  public layOutCounter: any = 0;
  public errorMessage: any;
  IsSuccess = false;
  IsError = false;
  IsWarning = false;
  message = '';
  searchCriteria: any = {};

  //General Search JSon//

  public pageLayout: any;
  public pageLayoutSubscription: Subscription;
  public modelValue: any = {

  };


  compare(a, b) {
    if (a.order > b.order) return 1;
    if (b.order > a.order) return -1;

    return 0;
  }

  constructor(private taskService: TaskService, private dataStorageService: DataStorageService, private tabService: TabService, 
    private snackBar: MatSnackBar, private ref: ChangeDetectorRef) { 
      let userObj: any = JSON.parse(localStorage.getItem('fd_user'));
    console.log(userObj);

    this.subscribeSourceSystems();
    this.subscribeWorkGroupList();
    this.subscribeTaskTypesList();
    this.subscribeTaskStatus();
  }

  ngAfterViewChecked(): void {
    this.ref.detectChanges();
  }
  
  ngAfterViewInit(): void {
    this.subscribePageLayoutAndInit();
  }

  subscribeWorkGroupList() {
    this.workgroupListSubscription = this.taskService.workGroups.subscribe(workGroups => {
      this.workgroupList = workGroups;
    });
  }
  subscribeTaskTypesList() {
    this.taskTypeListSubscription = this.taskService.taskTypes.subscribe(taskTypes => {
      this.taskTypeList = taskTypes;
    });
  }
  subscribeTaskStatus() {
    this.taskStatusSubscription = this.taskService.taskStatusCodes.subscribe(status => {
      this.taskStatus = status;
    });
  }
  subscribeSourceSystems() {
    this.sourceSystemsSubscription = this.taskService.sourceSystems.subscribe(sourceSystems => {
      this.sourceSystems = sourceSystems;
    });
  }

  async subscribePageLayoutAndInit() {
    this.pageLayoutSubscription = this.taskService.callGetUrl('/PageLayoutTemplate/Get/R2DG Search Template').subscribe((template) => {
        this.pageLayout = template;
        let userObj: any = JSON.parse(localStorage.getItem('fd_user'));

        if (this.pageLayout) {
          if (this.pageLayout['pageLayoutTemplate']) {
            this.layOutCounter = 0;
            this.pageLayout['pageLayoutTemplate'].map( async (template) => {
              if (userObj && userObj.authorizations && userObj.authorizations.length > 0 && userObj.authorizations.indexOf(template.sectionHeader.replace(/\s/g, '')) > -1) {
                template.sectionVisibility = true;
                this.layOutCounter++;
              } else {
                template.sectionVisibility = false;
              }
              if (this.layOutCounter == 0) {
                this.errorMessage = "You do not have access to Search Task,"
              }
              if (template.sectionHeader == "Buttons") {
                template.fieldsList.forEach((button: any) => { 
                    button.btnVisibility = true;                  
                });
              }
              // console.log(template);
              if (template.fieldsList) {
                for (let i = 0; i <= template.fieldsList.length; ++i) {

                  // Set operators to default value
                  // this.searchLayoutComponent.initOperatorToDefaultValue(template.fieldsList[i]);
                  
                  if (template.fieldsList[i] && template.fieldsList[i]['service']) {

                    await this.taskService.callGetUrl(template.fieldsList[i]['service']).toPromise().then((res: any) => {
                      template.fieldsList[i]['dataSource'] = [];
                      template.fieldsList[i]['dropDownList'] = [];

                      if (template.fieldsList[i]['fieldName'] == 'orderSource') {
                        for (let orderSource of res['systemParameterItem']) {
                          template.fieldsList[i]['dataSource'].push(
                            orderSource['value']
                          );
                        }
                      } else if (template.fieldsList[i]['fieldName'] == 'taskStatus') {
                        template.fieldsList[i]['dataSource'] = [];
                        for (let status of res['systemParameterModels'][0]['systemParameterItem']) {
                          template.fieldsList[i]['dataSource'].push(
                            status['value']
                          );
                        }
                      } else if (template.fieldsList[i]['fieldName'] == 'assignedCuid') {
                        let assignedUserObj = {};

                        if (res && res.length > 0) {
                          res.forEach((resource: any) => {
                              assignedUserObj = {
                                "data": resource.cuid + " - " + resource.fullName,
                                "value": resource.cuid
                              };
                              template.fieldsList[i]['dataSource'].push(
                                assignedUserObj
                              );
                              template.fieldsList[i]['dropDownList'] = template.fieldsList[i]['dataSource'];
                            });
                          }
                      } else if (template.fieldsList[i]['fieldName'] == 'productType') {
                        template.fieldsList[i]['dataSource'] = [];
                        for (let status of res['systemParameterItem']) {
                          template.fieldsList[i]['dataSource'].push(
                            status['value']
                          );
                        }
                      } else {
                        template.fieldsList[i]['dataSource'] = res;
                      }

                      // temp-fix
                      for (let k = 0; k < this.pageLayout["pageLayoutTemplate"].length; ++k) {
                        if (this.pageLayout["pageLayoutTemplate"][k] && this.pageLayout["pageLayoutTemplate"][k]['fieldsList']) {
                          let fields = [];
                          fields = this.pageLayout["pageLayoutTemplate"][k]['fieldsList'];
                          fields.sort(this.compare);
                          this.pageLayout["pageLayoutTemplate"][k]['fieldsList'] = fields;
                        }
                      }
                    });
                    // }
                  }
                }
              }
            });
          }
          this.loader = false;
        }
    });
  }

  ngOnInit() {
    this.options = {
      multiple: true,
      tags: true
    };
  }

  ngOnDestroy() {
    this.workgroupListSubscription.unsubscribe();
    this.taskTypeListSubscription.unsubscribe();
    this.sourceSystemsSubscription.unsubscribe();
    this.taskStatusSubscription.unsubscribe();
    this.pageLayoutSubscription.unsubscribe();
  }

  prepareRequest(layoutElem) {
    let keys = Object.keys(this.modelValue);
    let fieldName = '';
    let operator = '';
    let fieldType = '';

    keys.forEach((element: any) => {
      const obj = {};
      this.pageLayout['pageLayoutTemplate'].forEach(data => {
        for (let i = 0; i < data.fieldsList.length; i++) {
          if (data.fieldsList[i].label == element) {
            fieldName = data.fieldsList[i].fieldlabel;
            operator = (data.fieldsList[i].operator) ? '':'equals';

            // Set default opertors
            // if (!this.fieldHasValue(operator)) {
            //   this.searchLayoutComponent.initOperatorToDefaultValue(data.fieldsList[i]);
            // }
          }

          if (data.sectionVisibility === true && data.sectionHeader === 'SPR Search Parameters' && data.fieldsList[i].label == element && this.modelValue[element]) {
            // this.request['taskTypeList'] = ["OVC", "UNI"];
          }

          if (data.sectionVisibility === true && data.sectionHeader === 'LMOS Task Search' && data.fieldsList[i].label == element && this.modelValue[element]) {
            // this.request['taskType'] = ["Screening Trouble-Ticket"];
            const lmos = {};
            lmos['fieldName'] = 'taskType';
            lmos['value'] = ["Screening Trouble-Ticket"];
            lmos['operator'] = 'equals';
            this.request.push(lmos);
          }

          if (data.sectionVisibility === true && data.sectionHeader === 'RCMAC Task Search' && data.fieldsList[i].label == element && this.modelValue[element]) {
            // obj['taskType'] = ["RCMAC Trouble-Ticket"];
            const rcmac = {};
            rcmac['fieldName'] = 'taskType';
            rcmac['value'] = ["RCMAC Trouble-Ticket"];
            rcmac['operator'] = 'equals';
            this.request.push(rcmac);
          }
        }
      });

      if (element) {
        if (this.modelValue[element] != '' && this.modelValue[element] != null) {
          // obj[fieldName] = this.modelValue[element];
          obj['fieldName'] = fieldName;
          obj['value'] = (isArray(this.modelValue[element])) ? this.modelValue[element] : [this.modelValue[element]];
          obj['operator'] = operator
          this.request.push(obj);
        }
      }
    });

  }

  searchTask(layoutElem) {
    this.loader = true;
    this.request = [];
    this.prepareRequest(layoutElem);
    this.showResultsTemp = false;
    const GetLmosSection = this.pageLayout['pageLayoutTemplate'].filter((x) => x.sectionVisibility == true);
    if (GetLmosSection.length == 1) {
      if (GetLmosSection[0]['sectionHeader'] == 'LMOS Task Search' && this.request != '') {
        // this.request['taskType'] = ["Screening Trouble-Ticket"];
        const obj = {};
        obj['fieldName'] = 'taskType';
        obj['value'] = ["Screening Trouble-Ticket"];
        obj['operator'] = 'equals';
        this.request.push(obj);
      }
      if (GetLmosSection[0]['sectionHeader'] == 'RCMAC Task Search' && this.request != '') {
        // this.request['taskType'] = ["RCMAC Trouble-Ticket"];
        const obj = {};
        obj['fieldName'] = 'taskType';
        obj['value'] = ["RCMAC Trouble-Ticket"];
        obj['operator'] = 'equals';
        this.request.push(obj);
      }
    }
    // return false;

    // Fetch value from preference
    const preferenceData = JSON.parse(localStorage.getItem('themeLink'));

    if (preferenceData) {
      this.request['searchTable'] = preferenceData.SearchTable;
    }

    this.searchCriteria = {
      "searchFields": this.request
    };

    this.taskService.advancedSearchV3Task(this.searchCriteria).toPromise().then((result: any) => {
      this.loader = false;
      if (result && result.taskResults && result.taskResults.length > 0) {
        this.dataStorageService.setData(result.taskResults);
        //remove below line when backend is ready
        //result.pagination = {pageNumber: 1, pageSize: 100, totalRecords: result.taskResults.length};
        this.dataStorageService.setPagination(result.pagination);
        this.dataStorageService.setSearchCriteria(this.searchCriteria);
        /* if (result.taskResults.length == 1) {
          let taskDtls: any = result.taskResults[0];
          console.log("TASKDETAILS:", taskDtls);
          const tab: Tab = new Tab(TaskDetailsComponent, 'Task : ' + taskDtls.task['sourceTaskId'], 'viewTask', taskDtls.task);
          this.tabService.openTab(tab);
        }
        else  */{
          let tab = new Tab(SearchResultComponent, 'Search Result', 'searchTask', {});
          this.tabService.openTab(tab);
        }
        // this.showResultsTemp = true;

      } else {
        this.IsWarning = true;
        this.message = "No Data Found for the provided criteria, Please try searching with valid data.";
        setTimeout(() => {
          this.IsWarning = false;
        }, 15000);
        // this.snackBar.open("No Data Found for the provided criteria, Please try searching with valid data.", "Okay", {
        //   duration: 15000,
        // });
      }
    }, (error: any) => {
      console.log(error);
      this.loader = false;
      this.IsWarning = true;
      this.message = "Error Searching for Task";
      setTimeout(() => {
        this.IsWarning = false;
      }, 15000);
      // this.snackBar.open("Error Searching for Task", "Okay", {
      //   duration: 15000,
      // });
    });
  }

  clear(layoutElem) {
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

  onChange() {
    this.options.mode = this.options.inline ? 'inline' : 'popup'
  }

  fieldHasValue(field) {
    if (field == undefined || field == null || ("" + field).length < 1) {
      return false;
    }
    return true;
  }

}

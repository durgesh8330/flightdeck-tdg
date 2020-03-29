import { MyWorkgroupTaskComponent } from '../../../../features/task/my-workgroup-task/my-workgroup-task.component';
import { MyTaskComponent } from '../../../../features/lmos/my-task/my-task.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, Type, EventEmitter, Output } from '@angular/core';
import { SearchTaskComponent } from '@app/features/task/search-task/search-task.component';
import { SearchResultComponent } from '@app/features/task/search-result/search-result.component';
import { AnalyticsComponent } from '@app/features/dashboard/analytics/analytics.component';
import { ProfileInfoComponent } from '@app/features/profile/profile-info/profile-info.component';
import { MatSnackBar } from '@angular/material';
import { DataStorageService } from '@app/features/task/data-storage.service';
import { WorkgroupTaskComponent } from '@app/features/lmos/workgroup-task/workgroup-task.component';
import { TaskDetailsComponent } from '@app/features/task/task-details/task-details.component';

import { TabService } from '@app/core/tab/tab-service';
import { LayoutService } from '@app/core/services';
import { Tab } from '@app/core/tab/tab.model';
import { environment } from '@env/environment';
import { TaskService } from '@app/features/task/task.service';

@Component({
  selector: 'rcmac-menu',
  templateUrl: './rcmac-menu.component.html',
  styleUrls: ['./rcmac-menu.component.scss']
})
export class RcmacMenuComponent implements OnInit {

  public permissionList = [];
  public leftMenuData = { leftMenu: [] };
  public pageLayout: any;
  public smeSearch: any = {};
  public searchReq: any = {};
  public showSearchMenu: boolean = false;
  public disableSearch: boolean = false;
  @Output() showMainMenu = new EventEmitter();
  @Output() AutoSelectCall = new EventEmitter();
  @Output() MainLoader = new EventEmitter();
  @Output() message = new EventEmitter();
  swithcToMainMenu() {
    this.showMainMenu.emit();
  }

  constructor(
    private taskService: TaskService,
    private tabService: TabService, private dataStorageService: DataStorageService,
    private layoutService: LayoutService, private httpClient: HttpClient, private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    let themeLink = JSON.parse(localStorage.getItem('themeLink'));
    if (themeLink && themeLink.leftMenu) {
      this.permissionList = themeLink.leftMenu.split(';');
      if (!this.permissionList) {
        this.permissionList = [];
      }
    }
    this.getTemplateData();
  }
  templateObj: any = {};
  searchTypes: any = [];
  searchType: string = 'Request';

  getTemplateData() {
    this.httpClient.get(environment.apiUrl + '/PageLayoutTemplate/Get/RCMAC-LeftPanel').toPromise().then((response: any) => {
      // this.pageLayout = response.pageLayoutTemplate ? response.pageLayoutTemplate.leftMenu : [];

     
      this.leftMenuData = response.pageLayoutTemplate;
      // this.leftMenuData = res.pageLayoutTemplate;
      console.log(this.leftMenuData);
      const userObj = JSON.parse(localStorage.getItem('fd_user'));
      if (userObj && userObj.authorizations && userObj.authorizations.length > 0) {
        this.checkAccessLevels(userObj.authorizations);
      } else {
        this.leftMenuData.leftMenu = [];
      }
    }).catch(errorObj => console.error(errorObj));
  }

  checkAccessLevels(authorizations: any) {    
    const usersLeftPermissions = authorizations.filter((authElement: any) => authElement.startsWith('Button'));

    for (let i = 0; i < this.leftMenuData.leftMenu.length; i++) {
      const menuItem: any = this.leftMenuData.leftMenu[i];
      if (menuItem && (menuItem['sectionHeader'] == 'Auto Select' && usersLeftPermissions.indexOf('Button_RCMAC_AutoSelect') == -1)) {
        this.leftMenuData.leftMenu.splice(i, 1);
        i--;
      }
    }

    // for (let i = 0; i < this.leftMenuData.leftMenu.length; i++) {
    //   for (let j = 0; j < this.leftMenuData.leftMenu[i].fieldsList.length; j++) {
    //     const submanuitem: any = this.leftMenuData.leftMenu[i].fieldsList[j];
    //     if (usersLeftPermissions.indexOf(submanuitem.permissions) == -1) {
    //       this.leftMenuData.leftMenu[i].fieldsList.splice(j, 1);
    //       j--;
    //     }
    //   }
    // }

    // for (let i = 0; i < this.leftMenuData.leftMenu.length; i++) {
    //   for (let j = 0; j < this.leftMenuData.leftMenu[i].fieldsList.length; j++) {
    //     const submanuitem: any = this.leftMenuData.leftMenu[i].fieldsList[j];
    //     if (submanuitem.type == 'Form') {
    //       for (let k = 0; k < this.leftMenuData.leftMenu[i].fieldsList[j].fieldsList.length; k++) {
    //         const formField: any = this.leftMenuData.leftMenu[i].fieldsList[j].fieldsList[k];
    //         if (usersLeftPermissions.indexOf(formField.permissions) == -1) {
    //           this.leftMenuData.leftMenu[i].fieldsList[j].fieldsList.splice(k, 1);
    //           k--;
    //         }
    //       }
    //     }
    //   }
    // }
  }

  openTab(componentStr, title, url) {
    console.log(componentStr, title, url);
    if (componentStr) {
      if (title == "Dashboard" && url == "getSystemTaskCount") {
        let tab = new Tab(this.getComponentType('AnalyticsComponent'), 'RCMAC Dashboard', 'getSystemTaskCount/RCMAC', {});
        this.tabService.openTab(tab);
      }
      else {
        let tab = new Tab(this.getComponentType(componentStr), title, url,  {type: 'rcmac'});
        this.tabService.openTab(tab);
      }
    }
    // if(this.openedTab.findIndex(x => x === componentStr) > -1){
    //   let tab = new Tab(this.getComponentType(componentStr), title, url, {});
    //   this.tabService.openTab(tab);
    //   this.openedTab.push(componentStr);
    // }
  }

  getComponentType(componentStr: string): Type<any> {
    let componentType: Type<any>;
    switch (componentStr) {
      case 'SearchTaskComponent':
        componentType = SearchTaskComponent;
        break;
      case 'ProfileInfoComponent':
        componentType = ProfileInfoComponent;
        break;
      case 'AnalyticsComponent':
        componentType = AnalyticsComponent;
        break;
      case 'MyTaskComponent':
        componentType = MyTaskComponent;
        break;
      case 'MyWorkgroupTaskComponent':
        componentType = WorkgroupTaskComponent;
        break;
    }
    return componentType;
  }

  toggleOnHover(state) {
    this.layoutService.onMouseToggleMenu(state);
  }

  onClickLink(state, e) { }

  searchTask(fieldsList) {
    this.MainLoader.emit({ status: true });
    let searchFields = [];
    const lmos = {};
    lmos['fieldName'] = "taskType";
    lmos['value'] = ["RCMAC Trouble-Ticket"];
    lmos['operator'] = 'equals';
    searchFields.push(lmos);
    fieldsList.forEach(element => {
      let obj = {};
      if (element.fieldValue != '') {
        obj['fieldName'] = element.fieldName;
        obj['value'] = [element.fieldValue];
        obj['operator'] = 'equals';
        searchFields.push(obj);
      }
    });
    

    let searchCriteria = {
      "searchFields": searchFields
    };
    this.taskService.AdvancedSearchTask(searchCriteria).toPromise().then((result: any) => {
      this.disableSearch = false;
      this.MainLoader.emit({ status: false });
      if (result && result.taskResults && result.taskResults.length > 0) {
        if (result.taskResults.length > 1) {
          this.dataStorageService.setData(result.taskResults);
          this.dataStorageService.setPagination(result.pagination);
          this.dataStorageService.setSearchCriteria(searchCriteria);
          let tab = new Tab(SearchResultComponent, 'Search Result', 'searchTask', {});
          this.tabService.openTab(tab);
        } else {
          let tab = new Tab(TaskDetailsComponent, 'Task : ' + result.taskResults[0]['sourceTaskId'], 'TaskDetailsComponent', result.taskResults[0]);
          this.tabService.openTab(tab);
        }

      } else {
        this.message.emit({ status: false, message: "No Data Found for the provided criteria, Please try searching with valid data." });
        // this.snackBar.open("No Data Found for the provided criteria, Please try searching with valid data.", "Okay", {
        //   duration: 15000,
        // });
      }
    }, (error: any) => {
      //this.loader = false;
      console.log(error);
      this.MainLoader.emit({ status: false });
      this.message.emit({ status: false, message: error.error.message });
      this.disableSearch = false;
      // this.snackBar.open("Error Searching for Task", "Okay", {
      //   duration: 15000,
      // });
    });
  }

  AutoSelect() {
    this.AutoSelectCall.emit();
  }

}

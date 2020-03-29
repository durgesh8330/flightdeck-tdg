import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, Type, EventEmitter, Output } from '@angular/core';
import { SearchTaskComponent } from '@app/features/task/search-task/search-task.component';
import { TabService } from '@app/core/tab/tab-service';
import { LayoutService } from '@app/core/services';
import { Tab } from '@app/core/tab/tab.model';
import { environment } from '@env/environment';
import { AnalyticsComponent } from '@app/features/dashboard/analytics/analytics.component';
import { WorkmateTaskComponent } from '@app/features/asri-task/workmate-task.component';
import { UniSprComponent } from '@app/features/uni-spr/uni-spr.component';
import { EvcComponent } from '@app/features/evc/evc.component';
import { ThemeBuilderComponent } from '@app/features/user-profile/theme-builder/theme-builder.component';
import { MyTaskComponent } from '@app/features/task/my-task/my-task.component';
import { MyWorkgroupTaskComponent } from '@app/features/task/my-workgroup-task/my-workgroup-task.component';
import { NotFoundComponent } from '@app/shared/not-found/not-found.component';
import { SearchSmeComponent } from '@app/features/sme-task/search-sme/search-sme.component';
import { SmeTaskComponent } from '@app/features/sme-task/sme-task/sme-task.component';
@Component({
  selector: 'sme-menu',
  templateUrl: './sme-menu.component.html',
  styleUrls: ['./sme-menu.component.scss']
})
export class SmeMenuComponent implements OnInit {
  public permissionList = [];
  public leftMenuData: any = { leftMenu: [] };
  public pageLayout: any;
  public smeSearch: any = {};
  public showSearchMenu: boolean = false;
  @Output() showMainMenu = new EventEmitter();
  swithcToMainMenu() {
    this.showMainMenu.emit();
  }
  withChildrenStartIndex: any = 0;

  smeSearchPageLayout: any = {
    "pageLayoutTemplate": [
      {
        "sectionHeader": "Search by Request Level",
        "fieldsList": [
          {
            "fieldName": "correlationId",
            "visible": true,
            "editable": true,
            "service": "/TaskType/GetAll",
            "label": "Task Instance Id",
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
            "label": "Task Name",
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
            "fieldName": "Search",
            "visible": true,
            "toolTip": "Used to search non hidden tasks",
            "label": "Search",
            "type": "Button",
            "fieldValue": "",
            "class": "search-btn",
            "click": "searchTask",
            "order": 2
          },
          {
            "fieldName": "Reset",
            "visible": true,
            "toolTip": " clears data",
            "label": "Reset",
            "type": "Button",
            "fieldValue": "",
            "class": "search-btn  reset-bgclr",
            "click": "clear",
            "order": 1
          }
        ]
      }
    ],
    "templateName": "SME Search",
    "createdById": "AC30161"
  };

  constructor(
    private tabService: TabService,
    private layoutService: LayoutService, private httpClient: HttpClient
  ) {

  }

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
  searchTypeLabel = [];
  showChildMenu: any = -1;

  getTemplateData() {
    let parsedJSON = JSON.parse(localStorage.getItem('statusManagerLeftNavigation'));
    console.log(parsedJSON);
    if (parsedJSON) {
      let leftmenuParse = parsedJSON.pageLayoutTemplate;
      let withChildren = [];
      let withOutChildren = [];
      leftmenuParse.leftMenu.map((value) => {
        if (value.isChildren) {
          withChildren.push(value);
        } else {
          withOutChildren.push(value);
        }
      })
      this.withChildrenStartIndex = 'childIndex_' + (withOutChildren.length);
      let leftMenu = [...withOutChildren, ...withChildren];
      this.leftMenuData = { leftMenu: leftMenu };
    }
    this.httpClient.get(environment.apiUrl + '/PageLayoutTemplate/Get/SME Search').toPromise().then((response: any) => {
      this.pageLayout = response.pageLayoutTemplate;
      if (this.pageLayout && this.pageLayout.length > 0) {
        this.pageLayout.forEach((section: any) => {
          const searchType = section.sectionHeader.split(' ')[0];
          this.templateObj[searchType] = section.fieldsList;
          if (searchType != 'Buttons' && searchType != 'Search') {
            this.searchTypes.push(searchType);
          } else if (searchType == 'Search') {
            this.searchTypeLabel = section.fieldsList;
          }
        });
      }
    }).catch(errorObj => console.error(errorObj));
    // const userObj = JSON.parse(localStorage.getItem('fd_user'));
    // if (userObj && userObj.authorizations && userObj.authorizations.length > 0) {
    //   this.checkAccessLevels(userObj.authorizations);
    // } else {
    //   this.leftMenuData.leftMenu = [];
    // }
  }

  checkAccessLevels(authorizations: any) {
    const usersLeftPermissions = authorizations.filter((authElement: any) => authElement.startsWith('LeftMenu'));

    for(let i=0; i<this.leftMenuData.leftMenu.length; i++){
        const menuItem: any = this.leftMenuData.leftMenu[i];  
        if(menuItem && ((menuItem['headerLabel'] == 'Status Queue' && usersLeftPermissions.indexOf('LeftMenu_sme_status_queue') == -1) || 
           (menuItem['headerLabel'] == 'Reports' && usersLeftPermissions.indexOf('LeftMenu_sme_reports') == -1) || 
           (menuItem['headerLabel'] == "Search" && usersLeftPermissions.indexOf('LeftMenu_sme_search') == -1) || 
           (menuItem['headerLabel'] == "Dashboard" && usersLeftPermissions.indexOf('LeftMenu_sme_dashboard') == -1) || (menuItem['headerLabel'] == "Test REST" && usersLeftPermissions.indexOf('LeftMenu_sme_test_rest') == -1) ||
           (menuItem['headerLabel'] == 'Query History' && usersLeftPermissions.indexOf('LeftMenu_sme_query_history') == -1))){
          this.leftMenuData.leftMenu.splice(i, 1);
          i--;
        }
    }
  }
  openTab(componentStr, title, url) {
    console.log(componentStr, title, url);
    if (componentStr) {
      if (title == "SME Dashboard" && url == "getSystemTaskCount") {
        let tab = new Tab(this.getComponentType('AnalyticsComponent'), 'AUTOPILOT Dashboard', 'getSystemTaskCount/AUTOPILOT', {});
        this.tabService.openTab(tab);
      }
      else {
        let tab = new Tab(this.getComponentType(componentStr), title, url, {});
        this.tabService.openTab(tab);
      }
    }
  }

  getComponentType(componentStr: string): Type<any> {
    let componentType: Type<any>;
    switch (componentStr) {
      case 'SearchTaskComponent':
        componentType = SearchTaskComponent;
        break;
      case 'WorkmateTaskComponent':
        componentType = WorkmateTaskComponent;
        break;
      case 'AnalyticsComponent':
        componentType = AnalyticsComponent;
        break;
      case 'UniSprComponent':
        componentType = UniSprComponent;
        break;
      case 'EvcComponent':
        componentType = EvcComponent;
        break;
      case 'ThemeBuilderComponent':
        componentType = ThemeBuilderComponent;
        break;
      case 'MyTaskComponent':
        componentType = MyTaskComponent;
        break;
      case 'MyWorkgroupTaskComponent':
        componentType = MyWorkgroupTaskComponent;
        break;
      case 'NotFoundComponent':
        componentType = NotFoundComponent;
        break;
      case 'SearchSmeComponent':
      componentType = SearchSmeComponent;
        break;
      // case 'ManageUserComponent': componentType = ManageUserComponent;
      // break;
    }
    return componentType;
  }

  toggleOnHover(state) {
    this.layoutService.onMouseToggleMenu(state);
  }

  onClickLink(state, e) { }
  showChildMenuFn(i: any) {
    if (this.showChildMenu == 'child' + i) {
      this.showChildMenu = -1;
    } else {
      this.showChildMenu = 'child' + i;
    }
  }
  showHorizontalChildMenuFn(i: any) {
    this.withChildrenStartIndex = 'childIndex_' + i;
  }
}

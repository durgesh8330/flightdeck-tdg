import { Component, OnInit, Type, Output, EventEmitter } from '@angular/core';
import { SearchDataService } from "@app/features/dashboard/search-data/search-data.service";
import { EmitterService } from "@app/features/home/emitter.service";
import { TaskService } from '@app/features/task/task.service';
import { TabService } from '@app/core/tab/tab-service';
import { Tab } from '@app/core/tab/tab.model';
import { SearchResultComponent } from '@app/features/task/search-result/search-result.component';
import { DataStorageService } from '@app/features/task/data-storage.service';
import { SearchTaskComponent } from '@app/features/task/search-task/search-task.component';
import { FormGroup, NgForm } from '../../../../../node_modules/@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ManageWorkgroupComponent } from '@app/features/user-profile/manage-workgroup/manage-workgroup.component';
import { AdministrationComponent } from '@app/features/user-profile/administration/administration.component';
import { ManageApplicationComponent } from '@app/features/user-profile/manage-application/manage-application.component';
import { ManageSkillComponent } from '@app/features/user-profile/manage-skill/manage-skill.component';
import { ManageUserComponent } from '@app/features/user-profile/manage-user/manage-user.component';
import { ThemeBuilderComponent } from '@app/features/user-profile/theme-builder/theme-builder.component';
import { ProfileInfoComponent } from '@app/features/profile/profile-info/profile-info.component';
import { SystemParametersComponent } from '@app/features/user-profile/system-parameters/system-parameters.component';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SPRTaskComponent } from '@app/features/task/sprtask/sprtask.component';
import { TaskDetailsComponent } from '@app/features/task/task-details/task-details.component';
import * as $ from 'jquery';
import { RuleEngineComponent } from '@app/features/user-profile/rule-engine/rule-engine.component';
import { RuleInputCreateComponent } from '@app/features/user-profile/rule-engine/rule/rule-input/rule-input-create/rule-input-create.component';
import { RuleInputEditComponent } from '@app/features/user-profile/rule-engine/rule/rule-input/rule-input-edit/rule-input-edit.component';
import { RuleCreateComponent } from '@app/features/user-profile/rule-engine/rule/rule-create/rule-create.component';
import { RuleEditComponent } from '@app/features/user-profile/rule-engine/rule/rule-edit/rule-edit.component';
import { RuleImportComponent } from '@app/features/user-profile/rule-engine/rule/rule-import/rule-import.component';
import { RuleInputSearchComponent } from '@app/features/user-profile/rule-engine/rule/rule-input/rule-input-edit/rule-input-search.component';
import { DistributedRuleComponent } from '@app/features/user-profile/rule-engine/rule/distributed-rule/distributed-rule-component';
import { ManageNotificationComponent } from '@app/features/user-profile/manage-notification/manage-notification.component';
import { ManageWorkgroupNotificationComponent } from '@app/features/user-profile/manage-workgroup-notification/manage-workgroup-notification.component';
import { TaskTypeManagementComponent } from '@app/features/user-profile/task-type-management/task-type-management.component';

declare var $: any;

@Component({
  selector: 'sa-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  openModal = '';
  searchFields = { searchFieldList: [] };
  searchDynamic: any = {};
  workgroupList = [];
  taskTypeList = [];

  errorMsg = '';
  searchFieldForm: NgForm;
  searchLoader = false;
  options: any;
  solrSearchStr = '';

  sourceSystem = [];
  allTaskNames = [];
  public permissionList = [];
  public topNavigationData: any = {};
  pageLayoutTemplate = [];
  pageLayoutButton = [];
  hideSearch = false;
  hideSolrSearchElement = false;
  logoType: any = "#ffffff";
  searchResults: any[] = [];
  tskDtlsloader: any = false;
  globalSearches: any = [];
  solrAccessPoint: any = "";
  ruleEngine : any = false;

  @Output() HeaderMenuStatus = new EventEmitter();

  constructor(private dataStorageService: DataStorageService, private tabService: TabService, private taskService: TaskService,
    private emitterService: EmitterService, private searchDataService: SearchDataService,
    private snackBar: MatSnackBar) {
    this.taskService.getPageLayout('quicksearch').toPromise().then((response: any) => {
      this.pageLayoutButton = response['pageLayoutTemplate'][0]['fieldsList'];
      this.pageLayoutTemplate = response['pageLayoutTemplate'][1]['fieldsList'];
      this.taskService.getSourceSystems().toPromise().then((res: any) => {
        response['pageLayoutTemplate'][1]['fieldsList'].map((value, index) => {
          if (value.fieldName == "sourceSystem") {
            this.pageLayoutTemplate[index].ListOfValues = res;
          }
        })
      });
    }, (error: any) => {
      console.log(error);
    });
    let defaultValue = JSON.parse(localStorage.getItem('defaultValue'));
    let userPreference = defaultValue && defaultValue.userPreference ? JSON.parse(defaultValue.userPreference) : {};
    this.logoType = userPreference.selectedTheme == "ultra-light" ? "#000000" : "#ffffff";
    // this.taskService.getWorkgroups().toPromise().then((response: any)=>{
    //   console.log(response)
    //   this.workgroupList =  response;
    // });
    // this.taskService.getTaskTypes().toPromise().then((response: any)=>{
    //   this.taskTypeList =  response;
    // });
    this.getTemplateData();
    this.getListofValueData();
  }

  ngOnInit() {
    this.options = {
      width: '100%',
      multiple: true,
      tags: true
    };
    // let themeLink = JSON.parse(localStorage.getItem("themeLink"));
    // if(themeLink && themeLink.AdminMenu){
    // this.permissionList = themeLink.AdminMenu.split(';');
    // if(!this.permissionList){
    //   this.permissionList = [];
    // }
    const userObj = JSON.parse(localStorage.getItem('fd_user'));
    if (userObj && userObj.authorizations && userObj.authorizations.length > 0 && userObj.authorizations.indexOf('TopMenu_SolrSearch') > -1) {
      this.hideSolrSearchElement = false
    } else {
      this.hideSolrSearchElement = true;
    }
    this.globalSearches = userObj.globalSearches || [];
    if (this.globalSearches.length == 1) {
      this.solrAccessPoint = this.globalSearches[0].accessPoint;
    }
    /* else if (this.globalSearches.length > 1) {
      this.globalSearches=[];
      this.globalSearches.push(userObj.globalSearches[1]);
      this.solrAccessPoint = this.globalSearches[0].accessPoint;
      console.log(this.globalSearches);
    } */
  }

  solrSearch() {
    // Calling API
    this.taskService.solrSearch(this.solrSearchStr, this.solrAccessPoint).toPromise().then((resp: any) => {
      this.searchResults = resp;
    }, (error: any) => {
      console.log(error);
    });
  }

  solrChanged() {
    this.searchResults = [];
  }

  goToResuts(option: any) {
    option.sourceTaskId = option.source_task_id;
    option.sourceSystemName = option.source_system_name;
    option.taskName = option.task_name;
    this.tskDtlsloader = true;
    this.taskService.getTask(option.id, option.sourceSystemName).toPromise().then((response: any) => {
      let taskResult: any = response;
      this.tskDtlsloader = false;
      if (taskResult["taskType"]) {
        const tab: Tab = new Tab(TaskDetailsComponent, 'Task : ' + option['sourceTaskId'], 'TaskDetailsComponent', taskResult);
        this.tabService.openTab(tab);      
      } else {
        localStorage.setItem('AutopilotAppTaskInstanceId', option['sourceTaskId']);
        const tab: Tab = new Tab(SPRTaskComponent, 'Task : ' + option['sourceTaskId'], 'viewTask', taskResult);
        this.tabService.openTab(tab)
      }
    }).catch((error: any) => {
      console.error(error);
      this.tskDtlsloader = false;
      this.snackBar.open("Error loading Task Details..", "Okay", {
        duration: 15000,
      });
    });
  }

  getTemplateData() {
    let parsedJSON = JSON.parse(localStorage.getItem("topNavigation"));
    console.log('parsedJSON' + parsedJSON);
    if (parsedJSON) {
      this.topNavigationData = parsedJSON.pageLayoutTemplate;
      // this.topNavigationData['topNavigation']['myProfileSubMenu'].push(
      //   {
      //     label: "Manage Notification",
      //     routerLink: "/manage-notification",
      //     subMenuIcon: "fa fa-user",
      //     systemPermission: "Admin",
      //     title: "Manage Notification",
      //     url: "manageNotification",
      //     childElement : [
      //       {
      //         componentString: "ManageNotificationComponent",
      //         label: "Manage Notification Key Set",
      //         routerLink: "/manage-notification-keyset",
      //         subMenuIcon: "fa fa-user",
      //         systemPermission: "Admin",
      //         title: "Manage Notification Key Set",
      //         url: "manageNotificationkeyset",
      //       },
      //       {
      //         componentString: "ManageWorkgroupNotificationComponent",
      //         label: "Manage Workgroup Notification",
      //         routerLink: "/manage-wg-notification",
      //         subMenuIcon: "fa fa-user",
      //         systemPermission: "Admin",
      //         title: "Manage Workgroup Notification",
      //         url: "manageNotificationkeyset",
      //       }
      //     ]
      //   }
      // );
    }
    let userDetails = JSON.parse(localStorage.getItem("fd_user"));
    if (userDetails && userDetails.authorizations) {
      this.checkAccessLevels(userDetails.authorizations);
    } else {
      //In this case everything should be removed except My Profile
      userDetails.authorizations = ['AdminMenu_MyProfile_View'];
      this.checkAccessLevels(userDetails.authorizations);
    }

  }
  // myProfileSubMenu 
  checkAccessLevels(authorizations: any) {
    const profilePermissions = authorizations.filter((authElement: any) => 

    authElement.startsWith('AdminMenu') 
    || authElement.startsWith('"UserMenu') 
    
    );
    const profileMenues: any = this.topNavigationData.topNavigation ? this.topNavigationData.topNavigation.myProfileSubMenu : [];
    for (let i = 0; i < profileMenues.length; i++) {
      const menuItem: any = profileMenues[i];
      if (menuItem && ((menuItem['label'] == 'Manage User' && profilePermissions.indexOf('AdminMenu_manageUser') == -1) ||
        (menuItem['label'] == 'Manage Workgroups' && profilePermissions.indexOf('AdminMenu_manageWorkgroup') == -1) ||
        (menuItem['label'] == 'Manage Applications' && profilePermissions.indexOf('AdminMenu_manageApplications') == -1) ||
        (menuItem['label'] == 'System Parameters' && profilePermissions.indexOf('AdminMenu_manageSystemParameters') == -1) ||
        (menuItem['label'] == 'Rule Engine' && profilePermissions.indexOf('AdminMenu_Rule') == -1) ||
        (menuItem['label'] == 'Manage Notification' && profilePermissions.indexOf('AdminMenu_manageNotification') == -1) ||
        (menuItem['label'] == 'Task Type Management' && profilePermissions.indexOf('AdminMenu_manageTaskType') == -1))) {
        profileMenues.splice(i, 1);
        i--;
        
      }
    }
  }

  onResentBtn() {
    this.searchDynamic = {};
    this.errorMsg = '';
  }

  onSearchBtn(formState: any): any {

    let request = { "taskInstanceId": "", "taskClaimId": "", "createdById": "", "modifiedById": "", "taskStatus": "", "taskTypeList": [], "sourceSystem": "", "sourceSystemList": [], "fromDate": "", "toDate": "", "pagination": { "pageNumber": 0, "pageSize": 0, "totalRecords": 0 } }

    this.errorMsg = '';
    // console.log(formState, this.searchDynamic)
    // if (this.searchDynamic['taskName'] && this.searchDynamic['taskName'] != 'select') {
    //   request.taskTypeList.push(this.searchDynamic['taskName']);
    // } else {
    //   //  this.errorMsg = 'Please choose task name';
    //   //return;
    // }
    // if (this.searchDynamic['sourceSystem']) {
    //   request.sourceSystem = this.searchDynamic['sourceSystem'];
    // } else {
    //   //  this.errorMsg = 'Please choose work group';
    //   // return;
    // }

    if (document.getElementById('from')['value']) {
      request.fromDate = document.getElementById('from')['value'];
    } else {
      //  this.errorMsg = 'Please choose from date';
      //  return;
    }
    if (document.getElementById('to')['value']) {
      request.toDate = document.getElementById('to')['value'];
    }

    // if (this.searchDynamic['appTransactionID']) {
    //   request.appTaskInstanceId = this.searchDynamic['appTransactionID'];
    // } else {
    //   //  this.errorMsg = 'Please choose to date';
    //   //  return;
    // }
    this.searchLoader = true;
    if (this.searchDynamic.TaskName) {
      request.taskTypeList = [this.searchDynamic.TaskName];
    }
    if (this.searchDynamic.sourceSystem) {
      request.sourceSystemList = [this.searchDynamic.sourceSystem];
    }
    request.taskInstanceId = this.searchDynamic.appTaskInstanceId ? this.searchDynamic.appTaskInstanceId : '';
    this.taskService.searchTaskInHeader(request).toPromise().then((result: any) => {
      this.searchLoader = false;

      if (result && result.taskResults && result.taskResults.length > 0) {
        this.openModal = '';
        this.dataStorageService.setData(result.taskResults);
        this.dataStorageService.setPagination(result.pagination);
        this.dataStorageService.setSearchCriteria(request);
        let tab = new Tab(SearchResultComponent, 'Search Result', 'searchTask', {});
        this.tabService.openTab(tab);
      } else {
        this.snackBar.open("No Data Found for the provided criteria, Please try searching with valid data.", "Okay", {
          duration: 15000,
        });
      }
    }, (error: any) => {
      this.searchLoader = false;
      console.log(error);
    });

  // }, (error: any) => {
  //   this.searchLoader = false;
  //   console.log(error);
  // });


  }
  openTab(componentStr, title, url) {
    console.log("component name " + title + " " + this.ruleEngine);
    this.ruleEngine = false;
    console.log("component name " + title + " " + this.ruleEngine);
    if(componentStr){
      let tab = new Tab(this.getComponentType(componentStr), title, url, {});
      this.tabService.openTab(tab);
    }
    
  }

  getComponentType(componentStr: string): Type<any> {
    let componentType: Type<any>;
    switch (componentStr) {
      case 'SearchTaskComponent': componentType = SearchTaskComponent;
        break;
      case 'ManageUserComponent': componentType = ManageUserComponent;
        break;
      case 'ThemeBuilderComponent': componentType = ThemeBuilderComponent;
        break;
      case 'ProfileInfoComponent': componentType = ProfileInfoComponent;
        break;
      case 'SystemParametersComponent': componentType = SystemParametersComponent;
        break;
      case 'ManageWorkgroupComponent': componentType = ManageWorkgroupComponent;
        break;
      case 'ManageApplicationComponent': componentType = ManageApplicationComponent;
        break;
      case 'ManageSkillComponent': componentType = ManageSkillComponent;
        break;
      case 'AdministrationComponent': componentType = AdministrationComponent;
        break;
      case 'RuleEngineComponent': componentType = RuleEngineComponent;
        break;
      case 'RuleInputCreateComponent': componentType = RuleInputCreateComponent;
        break;
      case 'RuleInputEditComponent': componentType = RuleInputEditComponent;
        break;
      case 'RuleInputSearchComponent': componentType = RuleInputSearchComponent;
        break;
      case 'DistributedRuleComponent': componentType = DistributedRuleComponent;
        break;
      case 'RuleCreateComponent': componentType = RuleCreateComponent;
        break;
      case 'RuleEditComponent': componentType = RuleEditComponent;
        break;
      case 'RuleImportComponent': componentType = RuleImportComponent;
        break;
      case 'ManageNotificationComponent': componentType = ManageNotificationComponent;
        break;
      case 'ManageWorkgroupNotificationComponent': componentType = ManageWorkgroupNotificationComponent;
        break;
      case 'TaskTypeManagementComponent': componentType = TaskTypeManagementComponent;
        break;
        
    }
    return componentType;
  }
  searchMobileActive = false;

  toggleSearchMobile() {
    //this.searchMobileActive = !this.searchMobileActive;
    this.searchMobileActive = true;
    $('body').toggleClass('search-mobile', this.searchMobileActive);
  }

  onSubmit(fromdata) {
    this.emitterService.goToPage('searchData');
  }
  resetfn(formState: NgForm, value) {
    if (value == 'button') {
      this.searchDynamic = {};
      document.getElementById('from')['value'] = '';
      document.getElementById('to')['value'] = '';
    }
    //formState.resetForm();
  }

  openSearchModal(e: any) {
    // document.getElementById('from')['value'] = '';
    // document.getElementById('to')['value'] = '';
    if (this.openModal == 'active') {
      this.openModal = '';
      return;
    }
    this.allTaskNames = [];
    this.sourceSystem = [];

    e.stopPropagation();
    this.openModal = '';
    this.errorMsg = '';
    setTimeout(() => { this.openModal = 'active' }, 50);
    this.searchDataService.getSearchTaskDetails().subscribe(
      (data) => { this.searchFields = data; },
      (err) => console.log(err)
    );

    this.taskService.getSourceSystems().toPromise().then((response: any) => {
      this.sourceSystem = response;
    }).catch((error) => {
      console.log(error);
    });
  }

  onCrossIcon() {
    this.hideSearch = true;
    // var searchMobile = document.querySelector('.search-mobile');
    // console.log(searchMobile)
    // if (searchMobile) {
    //   searchMobile.classList.remove('search-mobile');
    // }
  }

  launchMyProfileTab() {
    let tab = new Tab(ManageWorkgroupComponent, 'Manage Workgroups', 'manageWorkgroups', {});
    this.tabService.openTab(tab);
  }

  launchMyApplicationTab() {
    let tab = new Tab(ManageApplicationComponent, 'Manage Application', 'manageApplications', {});
    this.tabService.openTab(tab);
  }

  launchMySkillsTab() {
    let tab = new Tab(ManageSkillComponent, 'Manage Skills', 'manageSkills', {});
    this.tabService.openTab(tab);
  }


  launchAdministrationTab() {
    let tab = new Tab(AdministrationComponent, 'Administration', 'administration', {});
    this.tabService.openTab(tab);
  }

  getAllTaskName(event, i, value) {
    if (value.changeEvent) {
      var appendIndex = 0;
      this.pageLayoutTemplate.map((item, index) => {
        this.pageLayoutTemplate.map((child, childIndex) => {
          if (item.dependentFieldName == child.fieldName) {
            appendIndex = childIndex;
          }
        })
      })
      this.taskService.getAllTaskNames(event.target.value, value.dependentService).toPromise().then((response: any) => {
        this.pageLayoutTemplate[appendIndex].ListOfValues = response;
        this.allTaskNames = response;
      });
    }
  }
  showSearch() {
    if (this.hideSearch) {
      this.hideSearch = false;
    }
  }

  HideShowLogoIcon(Status) {
    this.HeaderMenuStatus.emit(Status);
    if (Status) {
      $('.a-brand.logo__svg.logo-img-div').show();
      $("body .MainPage .task-details-form .sticky-tab-header.spr-tabs").removeAttr('style');
      // $("body nav .sbmt-btn").removeClass('auto-select-button-width-fullscreen');
      // $("body nav .sbmt-btn").parent().removeAttr('style');
    } else {
      $('.a-brand.logo__svg.logo-img-div').hide();
      $("body .MainPage .task-details-form .sticky-tab-header.spr-tabs").css({"width": "calc(100% - 45px)"});
      // $("body nav .sbmt-btn").addClass('auto-select-button-width-fullscreen');
      // $("body nav .sbmt-btn").parent().css({"margin-left": "-120px"});
    }
  }
  // mouseOver(test, index) {
  //   console.log("sample data " + test  + "and " + index)
  //   if(test == 'Rule Engine') {
  //     this.ruleEngine = true; 
  //   }
  // }
  // mouseLeave(event, index) {
  //   console.log(event +" "+ index)
  //   if(index == 'Rule Engine'){
  //     this.ruleEngine = true;
  //   }
  //   else
  //   {
  //     this.ruleEngine = false;
  //   }
     
  // }

  getListofValueData(){
    let listData = ["Blocking Reasons","Screening Cause Codes", "Screening Disposition Codes"]

    for(let i=0; i<listData.length; i++){
      this.taskService.getListofValueData(listData[i]).toPromise().then((data) =>{
        console.log( "listof value data: " + data);
        let localData:any=[];
        localData = data;
        localStorage.setItem(listData[i].replace(/ /g,''), JSON.stringify(localData));
        console.log( "listof value data: " + localStorage.getItem(listData[i].replace(/ /g,'')));
      }).catch(err =>{
        console.log(err);
        let localData:any=[];
        localStorage.setItem(listData[i].replace(/ /g,''), JSON.stringify(localData));
      });
    }
  }

}

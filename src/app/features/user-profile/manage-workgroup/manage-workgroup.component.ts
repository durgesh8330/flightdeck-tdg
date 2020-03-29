import { ActivityLog } from './../../task/task-details/activity-log.model';
import { ActivityLogService} from './../../activity-log/activity-log.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Component, OnInit, ViewChild, OnChanges, ChangeDetectorRef, ViewChildren } from '@angular/core';
import { UserProfileService } from '../user-profile.service';
import { CreateWorkgroupModalComponent } from './create-workgroup-modal/create-workgroup-modal.component';
import { NotificationService, JsonApiService } from '@app/core/services';

import { CreateRoleModalComponent } from './create-role-modal/create-role-modal.component';
import { CreateSkillModalComponent } from '../manage-skill/create-skill-modal/create-skill-modal.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ManageWorkgroupParameters } from './manage-workgroup-params.component';
import { DataStorageService } from '@app/features/task/data-storage.service';
import { Tab } from '@app/core/tab/tab.model';
import { SharedService } from '../shared/shared.service';
import * as _ from 'lodash';
import printJS from 'print-js';
import { ModalComponent } from '@app/shared/modal/modal.component';
import { TaskService } from '../../task/task.service';
import { isObject, isArray } from 'util';
import { AuditLog } from '@app/core/store/auditlog/AuditLog';
import { routes } from '@app/features/task/task-routing.module';
import { AppService } from '../../../app.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TabService } from '@app/core/tab/tab-service';
import { layoutReducer } from '@app/core/store/layout';

@Component({
  selector: 'sa-manage-workgroup',
  templateUrl: './manage-workgroup.component.html',
  styleUrls: ['./manage-workgroup.component.scss']
})
export class ManageWorkgroupComponent implements OnInit {
  @ViewChild(ManageWorkgroupParameters)
  private workgroupParametersComponent: ManageWorkgroupParameters;
  @ViewChild(ModalComponent) modalChild: ModalComponent;
  public userdetailswodgetwa = 'workgroupWidget';
  public availableWorkgroups: any;
  public availableWorkgroupsBackup: any;
  public selectedWorkgroupRole: any;
  public selectedWorkgroupDesc: any = '';
  dynamicFormGroup: FormGroup;
  isSortAsc = false;
  public workgroupInputObj = { selectedWorkGroups: [], searchCriteria: '' };
  /** Workgroup Tabs details */
  public workgroupTabs = [];
  public accessLevelList = ["read", "write", "restricted"];
  public accessLevelDataList = [];
  public workgroupSkillDataList = [];
  public selectedskillId;
  public memberInputObj = { searchCriteria: '' };
  templateData: any = {};
  public uiObject: any = {};
  public memberTab: any = {
    memberDetails: {
      headers: [],
      memberList: [],
      backUpMemberList: [],
      filteredMemberList: []
    }
  };
  public filter = {};
  public pagination: any = {};
  public paginationLimitOption: number = 1;
  public totalPage: number = 1;
  public CurrentWorkgroupName = '';
  public CurrentWorkgroupId = '';
  public accessLevelsDetails = [];
  filterFields: any[] = [];
  addRoleGroup: any = {};
  modalDetails: any = {
    fields: [],
    buttons: [],
    title: '',
    isAlert: true,
    error: {},
    className: "addrolegroup",
    from: "addrolegroup",
    isDeleteConfirm: false

  };
  tablePaginationData: any = [];
  actionButton: any;
  sectionheader: any;
  actionColumn: any;
  systemParameter: any = {
    from: 'tableviewworkgroupmember',
    title: 'Table Viewworkgroup Member',
    isSortAsc: false,
    globalSearch: ''
  };
  IsSuccess = false;
  IsError = false;
  message = '';
  workGroupAccessLoader: Boolean = false;
  accessLevelAvailable: Boolean = false;
  resourceLayout: any = {};
  resourceLayoutResp: any = [];
  paramfieldstatus: any = false;

  WorkgroupresourceLayout: any = {};
  WorkgroupresourceLayoutResp: any = [];
  Workgroupparamfieldstatus: any = false;

  loading = false;
  workGrploading = false;
  resObject: any;
  resWGRObject: any;
  tabQuery;
  
  subscription: Subscription;
  subscriptionQuery:Subscription;
  displayOnRefresh: boolean =true;
  WGParamsOnRefresh: boolean =true;
  constructor(private tabService: TabService, private userProfileService: UserProfileService, private dialog: MatDialog, private snackBar: MatSnackBar,
    public notificationService: NotificationService, private activityLogService: ActivityLogService, private taskService: TaskService,
    private formBuilder: FormBuilder, private dataStorage: DataStorageService, private sharedService: SharedService, public ref: ChangeDetectorRef,
    public utility: AppService,
    private route: ActivatedRoute,
    private router: Router) {      
      this.getTemplateData();     
    // for the tab change with the subscribe method
    // this.subscription = this.tabService.getname().subscribe( res => 
    //   { this.tabQuery = res
        
    //     if(this.tabQuery){
    //       if(this.uiObject && this.uiObject.workgroupTabs )
    //       {
    //         let filterWorkGroup = this.uiObject.workgroupTabs.filter(elem => elem.title === this.tabQuery);
    //         console.log(filterWorkGroup);
    //       this.getWorkgroup(this.tabQuery);
    //       }else {
    //         this.getWorkgroup(this.tabQuery);
    //       }
          
    //     }
        
    //   })
      // to get inner tabs for the query history
      //this.queryHistoryMultiTab()
  }
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
    this.subscriptionQuery.unsubscribe();
}
  ngOnInit() {
    this.queryHistoryMultiTab()
  }

  //
  unsubscribe() {
    this.subscription.unsubscribe();
  }
  // to get inner tabs for the query history
  queryHistoryMultiTab(){
    // if(this.subscription){
    //   this.unsubscribe()
    // }
    this.subscriptionQuery =  this.userProfileService.queryhistorySubject.subscribe((data)=>{
      //this.getWorkgroupDetails();
      if(data){
        if(this.uiObject && this.uiObject.workgroupTabs )
          {
        let filterWorkGroup = this.uiObject.workgroupTabs.filter(elem => elem.title == data);
        console.log('manage workgroup inner tab' +filterWorkGroup);

        if(filterWorkGroup.length ==0){
          this.getWorkgroup(data);
        }
        
      }
      else{
        this.getWorkgroup(data);
      }
      }
    })
  }
  // get workgroup screen pagelayout
  getTemplateData() {
    this.loading = true;
    this.userProfileService.getWorkgroupTemplateData("Workgroup-Screen").toPromise().then((response: any) => {
      //Object.assign(this.uiObject,response.pageLayoutTemplate);
      if (response && response.pageLayoutTemplate) {
        this.createUiObject(response.pageLayoutTemplate);
        //this.setFieldValues();        
        this.getWorkgroupDetails();
      }

    }).then(() => {
      // Get All workgroup list, after getting workgroupscreen data
      this.getAllWorkgroups();
    });
    this.userProfileService.getWorkgroupTemplateData("Table-ViewWorkgroup-Members").toPromise().then((res: any) => {
      const response: any = res;
      const templateFields = response.pageLayoutTemplate.find((data: any) => data.sectionHeader === "ColumnName");
      this.memberTab.memberDetails.headers = templateFields.fieldsList.filter(f => f.fieldName !== "actions");
      console.log(this.memberTab.memberDetails.headers);
      // this.memberTab.memberDetails.showActions = templateFields.fieldsList.find(f => f.fieldName === "actions").display;
      const widgetDetails = response.pageLayoutTemplate.find((data: any) => data.sectionHeader === "Widget Title");
      if (widgetDetails) {
        this.memberTab.memberDetails.showWidgetHeader = widgetDetails.fieldsList[0].visible;
      }
      // this.pagination = response.pageLayoutTemplate.find((data: any) => data.sectionHeader === "Pagination").fieldsList[0];
      // this.pagination.totalRecords = 0;
      // this.paginationLimitOption = parseInt(this.pagination.pageLimitOptions[0]);
      this.pagination = response.pageLayoutTemplate[1].fieldsList[0];
      this.actionButton = response.pageLayoutTemplate[2].fieldsList;
      this.sectionheader = response.pageLayoutTemplate[0].sectionHeader;
      this.actionColumn = response.pageLayoutTemplate[0].fieldsList;

      this.pagination.selectedLimit = this.pagination.pageLimitOptions[0];
      this.pagination.pageNumber = 0;
      this.pagination.pageSize = 100;
      var add = true,
        editable = false,
        deleteable = true;

      this.systemParameter = {
        ...this.systemParameter,
        add: add,
        editable: editable,
        deleteable: deleteable,
        sectionheader: this.sectionheader,
        header: this.actionColumn,
        tableData: []
      }
    })

    // get pagelayout for params layout
    this.taskService.callGetUrl('/PageLayoutTemplate/Get/paramsLayout_Workgroup').toPromise().then((resp) => {
      this.loading = false;
      this.resourceLayout = resp;
    }).catch((err: any) => {
      this.loading = false;
      console.log(err);
    });
  }

  createUiObject(template: any) {
    const workgroupSkillAction = template.find((d: any) => d.sectionHeader === "workgroupSkillAction");
    const workgroupFIlter = template.find((d: any) => d.sectionHeader === "workgroupFIlter");
    const buttons = template.find((d: any) => d.sectionHeader === "buttons");
    const workgroupRoleFilter = template.find((d: any) => d.sectionHeader === "workgroupRoleFilter");
    const workgroupSkillFilter = template.find((d: any) => d.sectionHeader === "workgroupSkillFilter");
    const workgroupAction = template.find((d: any) => d.sectionHeader === "workgroupAction");
    const workgroupRoleAction = template.find((d: any) => d.sectionHeader === "workgroupRoleAction");
    const title = template.find((d: any) => d.sectionHeader === "Widget Title");
    const sections = template.find((d: any) => d.sectionHeader === "Workgroup Details");
    const walHeaders = template.find((d: any) => d.sectionHeader === "workgroupAccessLevelHeaders");
    const uiObject = {
      workgroupSkillAction: workgroupSkillAction ? workgroupSkillAction.fieldsList : [],
      workgroupFIlter: (workgroupFIlter && workgroupFIlter.fieldsList && workgroupFIlter.fieldsList[0]) ? workgroupFIlter.fieldsList[0] : {},
      buttons: buttons ? buttons.fieldsList : [],
      workgroupRoleFilter: (workgroupRoleFilter && workgroupRoleFilter.fieldsList && workgroupRoleFilter.fieldsList[0]) ? workgroupRoleFilter.fieldsList[0] : {},
      workgroupSkillFilter: (workgroupSkillFilter && workgroupSkillFilter.fieldsList && workgroupSkillFilter.fieldsList[0]) ? workgroupSkillFilter.fieldsList[0] : {},
      workgroupAction: workgroupAction ? workgroupAction.fieldsList : [],
      workgroupRoleAction: workgroupRoleAction ? workgroupRoleAction.fieldsList : [],
      title: title && title.fieldsList && title.fieldsList[0] ? title.fieldsList[0].label : '',
      sections: sections && sections.fieldsList ? sections.fieldsList : [],
      workgroupAccessLevelHeaders: walHeaders && walHeaders.fieldsList && walHeaders.fieldsList[0] ? walHeaders.fieldsList[0].workgroupAccessLevelHeaders : [],
      workgroupTabs: walHeaders && walHeaders.fieldsList && walHeaders.fieldsList[0] ? walHeaders.fieldsList[0].workgroupTabs : []
    }
    this.uiObject = { ...this.uiObject, ...uiObject };
  }
  onWorkgroupSkillChange(event) {
    this.selectedskillId = event.target.value;
  }
  onSelectedWorkgroupRole(event, tab) {
    let roleList = tab.workgroupDetails.cpWorkgroupRoles.filter(item => {
      return item.roleName == event.target.value;
    })
    this.selectedWorkgroupRole = roleList[0];
    this.selectedWorkgroupDesc = roleList[0].roleDesc;
    this.onWorkgroupRoleSelection(tab);
  }
  onAddWorkgroupRole(tab: any, workgroupIndex: number) {
    var response = this.dataStorage.getCreateRoleFields();
    var output: any = {}
    var field: any = response.fields.map((value) => {
      output[value.fieldName] = ''
      if (value.fieldName == 'CreatedBy') {
        output[value.fieldName] = this.getUserCuid()
      }
      return value;
    })
    var addRole: any = {
      buttons: response.buttons,
      fields: field,
      title: response.pageTitle,
      output: output,
      from: 'addworkgrouprole',
      tab: tab
    }
    this.modalDetails = { ...this.modalDetails, ...addRole, className: "addrolegroup", error: {}, isDeleteConfirm: false };
    this.modalChild.showModal();
    // const createWorkgroupDialog = this.dialog.open(CreateRoleModalComponent, {
    //   width: '650px',
    //   data: dialogData,
    //   hasBackdrop: true
    // });

    // createWorkgroupDialog.componentInstance.onCreateWorkgroupRole.subscribe(result => {
    //   if (result.buttonClicked === 'createWorkgroupRole') {
    //     const requestObj = { workgroupName: tab.workgroupDetails.workgroupName, roleName: result.workgroupRoleName, roleDesc: result.workgroupRoleDesc, createdById: result.createdById };
    //     this.userProfileService.createWorkgroupRole(requestObj).toPromise().then((response: any) => {
    //       console.log(response);
    //       this.showMessage(response.message);

    //       // roleObj.rowEditable = false;
    //       // this.refreshWorkgroupDetails(workgroupIndex);
    //       const log: ActivityLog = new ActivityLog();
    //       log.activityStatus = 'SUCCESS';
    //       log.activityType = 'CREATE';
    //       log.application = 'FLIGHTDECK';
    //       log.createdById = this.getUserCuid();
    //       log.processingTime = '0';
    //       log.activityModule = 'USERPROFILE-ROLE';
    //       log.activityValue = requestObj.roleName;
    //       log.activityDetails = 'Workgroup Role created successfully with name: ' + requestObj.roleName + ' and desc: ' + requestObj.roleDesc;
    //       this.activityLogService.logActivity(log);
    //       // this.uiObject.workgroupFIlter.selectedWorkGroups.forEach(workgroupName => {
    //         this.userProfileService.getWorkgroupDetails(this.CurrentWorkgroupName).toPromise().then((response: any) => {
    //           this.templateData = response;
    //           response.cpWorkgroupRoles = !response.cpWorkgroupRoles ? [] : response.cpWorkgroupRoles;
    //           let tabObj = { type: "workgroup", title: this.CurrentWorkgroupName, workgroupDetails: response, workgroupDetailsBackup: {} };
    //           Object.assign(tabObj.workgroupDetailsBackup, tabObj.workgroupDetails);
    //           for (let i = 0; i < this.uiObject.workgroupTabs.length; i++) {
    //             if (this.uiObject.workgroupTabs[i].isActive === true) {
    //               this.uiObject.workgroupTabs[i].workgroupDetails = response;
    //               this.uiObject.workgroupTabs[i].workgroupDetailsBackup = response;
    //               continue;
    //             }
    //           }
    //           this.setFieldValues(tabObj.title);
    //         }).catch(error => this.showMessage(error.error.message));
    //       // });
    //     }).catch(error => {
    //       this.showMessage(error.error.message);
    //     });
    //   }
    //   createWorkgroupDialog.close();
    // });
  }

  addWorkgroupRoleClicked(frommodal) {
    const requestObj = { workgroupName: frommodal.modal.tab.workgroupDetails.workgroupName, roleName: frommodal.modal.fields[0].fieldValue.trim(), roleDesc: frommodal.modal.fields[1].fieldValue.trim(), createdById: frommodal.modal.output.CreatedBy };
    this.userProfileService.createWorkgroupRole(requestObj).toPromise().then((response: any) => {
      console.log(response);
      // this.showMessage(response.message);
      this.showMessageModal(response.message, 1, 1)

      // roleObj.rowEditable = false;
      // this.refreshWorkgroupDetails(workgroupIndex);
      const log: ActivityLog = new ActivityLog();
      log.activityStatus = 'SUCCESS';
      log.activityType = 'CREATE';
      log.application = 'FLIGHTDECK';
      log.createdById = this.getUserCuid();
      log.processingTime = '0';
      log.activityModule = 'USERPROFILE-ROLE';
      log.activityValue = requestObj.roleName;
      log.activityDetails = 'Workgroup Role created successfully with name: ' + requestObj.roleName + ' and desc: ' + requestObj.roleDesc;
      this.activityLogService.logActivity(log);
      // this.uiObject.workgroupFIlter.selectedWorkGroups.forEach(workgroupName => {
      this.userProfileService.getWorkgroupDetails(this.CurrentWorkgroupName).toPromise().then((response: any) => {
        this.templateData = response;
        response.cpWorkgroupRoles = !response.cpWorkgroupRoles ? [] : response.cpWorkgroupRoles;
        let tabObj = { type: "workgroup", title: this.CurrentWorkgroupName, workgroupDetails: response, workgroupDetailsBackup: {} };
        Object.assign(tabObj.workgroupDetailsBackup, tabObj.workgroupDetails);
        for (let i = 0; i < this.uiObject.workgroupTabs.length; i++) {
          if (this.uiObject.workgroupTabs[i].isActive === true) {
            this.uiObject.workgroupTabs[i].workgroupDetails = response;
            this.uiObject.workgroupTabs[i].workgroupDetailsBackup = response;
            continue;
          }
        }
        this.setFieldValues(tabObj.title);
      }).catch(error => {
        this.IsError = true;
        this.message = error.error.message;
        setTimeout(() => {
          this.IsError = false;
        }, 15000);
      });
      // });
    }).catch(error => {
      this.responseHandler(error.error, 0)
      //this.showMessage(error);
    });
  }

  onWorkgroupAccessLevelSelected(tab, accessLevel, permission) {
    console.log('tab details ' + tab.accessLevelDataList);
    console.log('permission name ' + accessLevel.permissionName);
    console.log('access level ' + permission);
    //accessLevel.accessLevel = permission;

    tab.accessLevelDataList.find((obj, i) => {
      console.log(tab.accessLevelDataList[i].permissionLevel)
      if (obj.permissionName == accessLevel.permissionName) {
        tab.accessLevelDataList[i].permissionLevel = permission;
        console.log(tab.accessLevelDataList[i].permissionLevel)
        return true;
      }
    });

    console.log("tab value after access change " + JSON.stringify(tab.accessLevelDataList));
  }
  onSaveWorkgroupAccessLevel(tab) {
    let request = {
      workgroup: tab.workgroupDetails.workgroupName,
      workgroupRole: this.selectedWorkgroupRole.roleName,
      accessLevels: tab.accessLevelDataList
    }
    console.log("save request " + JSON.stringify(request));
    this.workGroupAccessLoader = true;
    this.userProfileService.createorUpdateWorkgroupAccessLevel(request).toPromise().then((response: any) => {
      this.IsSuccess = true;
      this.workGroupAccessLoader = false;
      this.message = response.message;
      setTimeout(() => {
        this.IsSuccess = false;
      }, 15000);

      // this.showMessage(response.message);
      // roleObj.rowEditable = false;
      // this.refreshWorkgroupDetails(workgroupIndex);
      const log: ActivityLog = new ActivityLog();
      log.activityStatus = 'SUCCESS';
      log.activityType = 'CREATE';
      log.application = 'FLIGHTDECK';
      log.createdById = this.getUserCuid();
      log.processingTime = '0';
      log.activityModule = 'USERPROFILE-ROLE';
      log.activityDetails = 'access level updated successfully';
      this.activityLogService.logActivity(log);
    }).catch(error => {
      this.IsError = true;
      this.workGroupAccessLoader = false;
      this.message = error.error.message;

      setTimeout(() => {
        this.IsError = false;
      }, 15000);

    });
  }
  onAddNewWorkgroupSkill(tab: any) {
    let dialogData = { skillName: '', desc: '', createdById: '', existingSkill: tab.workgroupSkillDataListBackup };
    dialogData.createdById = this.getUserCuid();
    const createWorkgroupDialog = this.dialog.open(CreateSkillModalComponent, {
      width: '650px',
      data: dialogData,
      hasBackdrop: true
    });

    createWorkgroupDialog.componentInstance.onCreateSkill.subscribe(result => {
      if (result.buttonClicked === 'createSkill') {
        let skillList = tab.workgroupSkillDataList.map(item => {
          return item.skillName;
        });
        const requestObj = { workgroup: tab.workgroupDetails.workgroupName, workgroupRole: this.selectedWorkgroupRole.roleName, skills: [...skillList, result.skillName], createdById: result.createdById };
        this.userProfileService.createWorkgroupRoleSkill(requestObj).toPromise().then((response: any) => {
          // this.showMessage(response.message);
          this.IsSuccess = true;
          this.message = response.message;
          setTimeout(() => {
            this.IsSuccess = false;
          }, 15000);
          const log: ActivityLog = new ActivityLog();
          log.activityStatus = 'SUCCESS';
          log.activityType = 'CREATE';
          log.application = 'FLIGHTDECK';
          log.createdById = this.getUserCuid();
          log.processingTime = '0';
          log.activityModule = 'USERPROFILE-ROLE';
          log.activityValue = result.skillName;
          log.activityDetails = 'Workgroup skill created successfully with name: ' + result.skillName + ' and desc: ' + result.desc;
          this.activityLogService.logActivity(log);
          this.userProfileService.getWorkgroupRoleSkillSet(tab.workgroupDetails.workgroupName, this.selectedWorkgroupRole.roleName).toPromise().then((response: any) => {
            tab.workgroupSkillDataListBackup = response;
            this.workgroupSkillDataList = response;
            tab.workgroupSkillDataList = response;
          }).catch(error => {
            tab.workgroupSkillDataList = [];
            this.IsError = true;
            this.message = error.error.message;
            setTimeout(() => {
              this.IsError = false;
            }, 15000);
          });
        }).catch(error => {
          this.IsError = true;
          this.message = error.error.message;
          setTimeout(() => {
            this.IsError = false;
          }, 15000);
        });

      }
      createWorkgroupDialog.close();
    });
  }
  onEditWorkgroupRole(tab: any, index: number) {
    var response = this.dataStorage.getEditRoleFields();
    var output: any = {}

    var field: any = response.fields.map((value) => {
      output[value.fieldName] = '';
      if (value.fieldName == 'ModifiedBy') {
        output[value.fieldName] = this.getUserCuid()
      }
      if (value.fieldName == 'RoleName') {
        output[value.fieldName] = this.selectedWorkgroupRole.roleName
      }
      if (value.fieldName == 'RoleDesc') {
        output[value.fieldName] = this.selectedWorkgroupRole.roleDesc
      }
      return value;
    })
    var editRole: any = {
      buttons: response.buttons,
      fields: field,
      title: response.pageTitle,
      output: output,
      from: 'editworkgrouprole',
      tab: tab
    }
    // this.modalDetails = { ...this.modalDetails, ...editRole, className: "addrolegroup", error: {} ,  isDeleteConfirm: false };
    // this.modalChild.showModal();
    let tabObj = { type: "editrole", title: response.pageTitle, memberDetails: editRole, workgroupDetails: tab.workgroupDetails, workgroupDetailsBackup: {}, accessLevelDataList: tab.accessLevelDataList };
    Object.assign(tabObj.workgroupDetailsBackup, tabObj.workgroupDetails);
    this.uiObject.workgroupTabs.push(tabObj);
    index = this.uiObject.workgroupTabs.indexOf(tabObj);
    this.markActive(index);
    // paramLayout_workgroupRole
    this.loading = true;
    console.log(tabObj, this.selectedWorkgroupRole.workgroupRoleId);
    this.userProfileService.getWorkGroupRoleDetailsById(tab.workgroupDetails.workgroupId, this.selectedWorkgroupRole.workgroupRoleId).toPromise().then((resParams: any) => {
      console.log(resParams);
      this.WorkgroupresourceLayoutResp = resParams['params'];
      console.log(this.WorkgroupresourceLayoutResp);
      this.resWGRObject = resParams;
    });

    this.taskService.callGetUrl('/PageLayoutTemplate/Get/paramsLayout_WorkgroupRole').toPromise().then((resp) => {
      // this.resourceLayout = resp;
      this.loading = false;
      this.WorkgroupresourceLayout = resp;
    }).catch((err: any) => {
      this.loading = false;
      console.log(err);
    });
    // let dialogData = { workgroupRoleName: this.selectedWorkgroupRole.roleName, workgroupRoleDesc: this.selectedWorkgroupDesc, createdById: '' };
    // dialogData.createdById = this.getUserCuid();
    // const createWorkgroupDialog = this.dialog.open(CreateRoleModalComponent, {
    //   width: '650px',
    //   data: dialogData,
    //   hasBackdrop: true
    // });

    // createWorkgroupDialog.componentInstance.onCreateWorkgroupRole.subscribe(result => {
    //   if (result.buttonClicked === 'createWorkgroupRole') {
    //     const requestObj = { workgroupName: tab.workgroupDetails.workgroupName, roleName: result.workgroupRoleName, id: this.selectedWorkgroupRole.workgroupRoleId, roleDesc: result.workgroupRoleDesc, modifiedById: result.createdById };
    //     this.userProfileService.updateWorkgroupRole(requestObj).toPromise().then((response: any) => {
    //       this.showMessage(response.message);
    //       tab.workgroupDetails.cpWorkgroupRoles.forEach((role, key) => {
    //         if (role.workgroupRoleId === this.selectedWorkgroupRole.workgroupRoleId) {
    //           let savedRole = { ...requestObj }
    //           savedRole["workgroupRoleId"] = this.selectedWorkgroupRole.workgroupRoleId;
    //           role = savedRole;
    //         }
    //       });
    //       const cpWorkgroupRoles = _.cloneDeep(tab.workgroupDetails.cpWorkgroupRoles);
    //       tab.workgroupDetails.cpWorkgroupRoles = cpWorkgroupRoles
    //       //   this.uiObject.workgroupTabs[index].workgroupDetails.cpWorkgroupRoles=cpWorkgroupRoles;
    //       // tab.workgroupDetails.cpWorkgroupRoles.map((role)=>{
    //       //     if(role.workgroupRoleId===this.selectedWorkgroupRole.workgroupRoleId){
    //       //       let savedRole={...requestObj}
    //       //       savedRole["workgroupRoleId"]=this.selectedWorkgroupRole.workgroupRoleId;
    //       //       return savedRole
    //       //     }else{
    //       //       role
    //       //     }
    //       // })
    //       // tab.workgroupDetails.cpWorkgroupRoles=updatedCpWorkgroupRoles;
    //       const log: ActivityLog = new ActivityLog();
    //       log.activityStatus = 'SUCCESS';
    //       log.activityType = 'CREATE';
    //       log.application = 'FLIGHTDECK';
    //       log.createdById = this.getUserCuid();
    //       log.processingTime = '0';
    //       log.activityModule = 'USERPROFILE-ROLE';
    //       log.activityValue = requestObj.roleName;
    //       log.activityDetails = 'Workgroup Role updated successfully with name: ' + requestObj.roleName + ' and desc: ' + requestObj.roleDesc;
    //       this.ref.detectChanges();
    //       // this.uiObject.workgroupFIlter.selectedWorkGroups.forEach(workgroupName => {
    //       this.userProfileService.getWorkgroupDetails(this.CurrentWorkgroupName).toPromise().then((response: any) => {
    //         this.templateData = response;
    //         response.cpWorkgroupRoles = !response.cpWorkgroupRoles ? [] : response.cpWorkgroupRoles;
    //         let tabObj = { type: "workgroup", title: this.CurrentWorkgroupName, workgroupDetails: response, workgroupDetailsBackup: {} };
    //         Object.assign(tabObj.workgroupDetailsBackup, tabObj.workgroupDetails);
    //         for (let i = 0; i < this.uiObject.workgroupTabs.length; i++) {
    //           if (this.uiObject.workgroupTabs[i].isActive === true) {
    //             this.uiObject.workgroupTabs[i].workgroupDetails = response;
    //             this.uiObject.workgroupTabs[i].workgroupDetailsBackup = response;
    //             continue;
    //           }
    //         }
    //         this.setFieldValues(tabObj.title);
    //       }).catch(error => this.showMessage(error.error.message));
    //       // });
    //       //  this.activityLogService.logActivity(log);
    //     }).catch(error => {
    //       this.showMessage(error.error.message);
    //     });
    //   }
    //   createWorkgroupDialog.close();
    // });
  }

  editWorkGroupRoleClicked(fromModal) {
    const requestObj = { workgroupName: fromModal.modal.tab.workgroupDetails.workgroupName, roleName: fromModal.modal.output.RoleName, id: this.selectedWorkgroupRole.workgroupRoleId, roleDesc: fromModal.modal.output.RoleDesc, modifiedById: fromModal.modal.output.ModifiedBy };
    this.userProfileService.updateWorkgroupRole(requestObj).toPromise().then((response: any) => {
      //this.modalChild.hideModal();
      this.showMessageModal(response.message, 1, 1);
      fromModal.modal.tab.workgroupDetails.cpWorkgroupRoles.forEach((role, key) => {
        if (role.workgroupRoleId === this.selectedWorkgroupRole.workgroupRoleId) {
          let savedRole = { ...requestObj }
          savedRole["workgroupRoleId"] = this.selectedWorkgroupRole.workgroupRoleId;
          role = savedRole;
        }
      });
      const cpWorkgroupRoles = _.cloneDeep(fromModal.modal.tab.workgroupDetails.cpWorkgroupRoles);
      fromModal.modal.tab.workgroupDetails.cpWorkgroupRoles = cpWorkgroupRoles
      //   this.uiObject.workgroupTabs[index].workgroupDetails.cpWorkgroupRoles=cpWorkgroupRoles;
      // tab.workgroupDetails.cpWorkgroupRoles.map((role)=>{
      //     if(role.workgroupRoleId===this.selectedWorkgroupRole.workgroupRoleId){
      //       let savedRole={...requestObj}
      //       savedRole["workgroupRoleId"]=this.selectedWorkgroupRole.workgroupRoleId;
      //       return savedRole
      //     }else{
      //       role
      //     }
      // })
      // tab.workgroupDetails.cpWorkgroupRoles=updatedCpWorkgroupRoles;
      const log: ActivityLog = new ActivityLog();
      log.activityStatus = 'SUCCESS';
      log.activityType = 'CREATE';
      log.application = 'FLIGHTDECK';
      log.createdById = this.getUserCuid();
      log.processingTime = '0';
      log.activityModule = 'USERPROFILE-ROLE';
      log.activityValue = requestObj.roleName;
      log.activityDetails = 'Workgroup Role updated successfully with name: ' + requestObj.roleName + ' and desc: ' + requestObj.roleDesc;
      this.ref.detectChanges();
      // this.uiObject.workgroupFIlter.selectedWorkGroups.forEach(workgroupName => {
      this.userProfileService.getWorkgroupDetails(this.CurrentWorkgroupName).toPromise().then((response: any) => {
        this.templateData = response;
        response.cpWorkgroupRoles = !response.cpWorkgroupRoles ? [] : response.cpWorkgroupRoles;
        let tabObj = { type: "workgroup", title: this.CurrentWorkgroupName, workgroupDetails: response, workgroupDetailsBackup: {} };
        Object.assign(tabObj.workgroupDetailsBackup, tabObj.workgroupDetails);
        for (let i = 0; i < this.uiObject.workgroupTabs.length; i++) {
          if (this.uiObject.workgroupTabs[i].isActive === true) {
            this.uiObject.workgroupTabs[i].workgroupDetails = response;
            this.uiObject.workgroupTabs[i].workgroupDetailsBackup = response;
            continue;
          }
        }
        this.setFieldValues(tabObj.title);
      }).catch(error => {
        if (error.error) {
          this.IsError = true;
          this.message = error.error.message;
          setTimeout(() => {
            this.IsError = false;
          }, 15000);
        }
      }
      );
      // });
      //  this.activityLogService.logActivity(log);
    }).catch(error => {
      if (error.error) {
        this.responseHandler(error.error, 0)
        // this.showMessage(error.error.message);
      }
    });
  }

  onDeleteWorkgroupRole(tab: any, workgroupIndex: number) {
    if (tab.selectedWorkgroupRole && tab.selectedWorkgroupRole.length > 1) {
      // this.showMessage('Please select one workgroup role.')
      this.IsError = true;
      this.message = 'Please select one workgroup role.';
      setTimeout(() => {
        this.IsError = false;
      }, 15000);
    } else {
      console.log(tab.workgroupDetails);
      console.log(this.selectedWorkgroupRole);
      this.deleteWorkgroupRole(workgroupIndex, tab.workgroupDetails.workgroupId, this.selectedWorkgroupRole.roleName, this.selectedWorkgroupRole.workgroupRoleId);
    }
  }
  onWorkgroupSubmitButtonClick(action, workgroupInx) {
    switch (action) {
      case "Save":
        this.updateWorkgroupDetails(workgroupInx);
        break;
      case "member":
        this.getConnectedMember();
        break;
      case "Cancel":
        this.restoreWorkgroupDetails(workgroupInx);
        break;
      case "parameters":
        this.getWorkgroupRoutingParameters();
        break;
    }
  }

  //get Workgroups 
  private getAllWorkgroups() {
    this.userProfileService.getAllWorkgroups().toPromise().then(response => {
      this.availableWorkgroups = response;
      this.uiObject.workgroupFIlter.filterData = response;
      this.uiObject.workgroupFIlter.filterTempData = response;
      this.availableWorkgroupsBackup = this.availableWorkgroups;
      const availableWorkgroupsObj = {};
      this.availableWorkgroups.forEach(workgroupName => availableWorkgroupsObj[workgroupName] = true);
      for (let i = 0; i < this.uiObject.workgroupTabs.length; i++) {
        if (!availableWorkgroupsObj[this.uiObject.workgroupTabs[i].title]) {
          this.uiObject.workgroupTabs.splice(i, 1);
          i--;
          continue;
        }
        this.uiObject.workgroupTabs[i].isActive = false;
      };
      if (this.uiObject.workgroupTabs.length > 0) {
        this.uiObject.workgroupTabs[this.uiObject.workgroupTabs.length - 1].isActive = true;
      }


    }).catch(error => {
      this.IsError = true;
      this.message = error.error.message;
      setTimeout(() => {
        this.IsError = false;
      }, 15000);
    });
  }

  // Actions for workgroup, calling specific functions based on action name
  onWorkgroupButtonClick(actionName) {
    this.accessLevelAvailable = false;
    switch (actionName) {
      case "EditWorkgroup":
        this.getWorkgroupDetails();
        break;
      case "AddWorkgroup":
        this.addWorkgroup();
        break;
      case "DeleteWorkgroup":
        this.deleteWorkgroup();
        break;
    }
  }
  // Actions for Roles, calling specific functions based on field name
  onRoleButtonClick(tab, workgroupInx, fieldName) {
    switch (fieldName) {
      case "EditRole":
        this.onEditWorkgroupRole(tab, workgroupInx);
        break;
      case "AddRole":
        this.onAddWorkgroupRole(tab, workgroupInx);
        break;
      case "DeleteRole":
        this.onDeleteWorkgroupRole(tab, workgroupInx);
        break;
    }
  }
  // Actions for skills, call specific functions based on field name
  onSkillButtonClick(tab, fieldName) {
    switch (fieldName) {
      case "AddSkill":
        this.onAddNewWorkgroupSkill(tab);
        break;
      case "DeleteSkill":
        this.onDeleteWorkgroupSkill(tab);
        break;
    }
  }



  setFieldValues(tabId: any = 'tabId') {
    const validations = {};
    this.uiObject.sections.forEach((field: any, index: any) => {
      validations[field.fieldName + tabId] = field.mandatory == true ? [this.templateData[field.fieldName], Validators.required] : [this.templateData[field.fieldName], Validators.nullValidator];
    });
    this.dynamicFormGroup = this.formBuilder.group(validations);
    this.createRelatedModalFields();
  }

  createDataObject(response: any) {
    const titleHeader = response.pageLayoutTemplate.find((data: any) => data.sectionHeader === "Title Header");
    const fields = response.pageLayoutTemplate.find((data: any) => data.sectionHeader === "TextFieldName");
    const buttons = response.pageLayoutTemplate.find((data: any) => data.sectionHeader === "Buttons");
    return {
      'pageTitle': titleHeader && titleHeader.fieldsList[0] ? titleHeader.fieldsList[0].label : '',
      'fields': fields ? [...fields.fieldsList] : [],
      'buttons': buttons ? [...buttons.fieldsList] : []
    }
  }

  createRelatedModalFields() {
    this.userProfileService.getWorkgroupTemplateData("Create-WorkgroupRole-Modal").toPromise().then((response: any) => {
      const createRoleObject = this.createDataObject(response);
      this.dataStorage.setCreateRoleFields(createRoleObject);
    });
    this.userProfileService.getWorkgroupTemplateData("Edit-WorkgroupRole-Modal").toPromise().then((response: any) => {
      const editRoleObject = this.createDataObject(response);
      this.dataStorage.setEditRoleFields(editRoleObject);
    });
    this.userProfileService.getWorkgroupTemplateData("Assign-Skills-Modal").toPromise().then((response: any) => {
      const addSkillsObject = this.createDataObject(response);
      this.dataStorage.setAddSkillsFields(addSkillsObject);
    });
  }
  onWorkgroupRoleSelection(tab: any) {
    this.workGroupAccessLoader = true;

    this.userProfileService.getWorkgroupRoleAccessLevel(tab.workgroupDetails.workgroupName, this.selectedWorkgroupRole.roleName).toPromise().then((response: any) => {
      //this.accessLevelDataList = response;
      tab.accessLevelDataList = response;
      //concating GetAll and Get access Level
      // tab.accessLevelDataList = tab.accessLevelDataList.concat(this.accessLevelsDetails)
      // tab.accessLevelDataList = Array.from(new Set(tab.accessLevelDataList.map(a => a.permissionName)))
      // .map(permissionName => {
      //   return tab.accessLevelDataList.find(a => a.permissionName === permissionName)
      // });
      for (let i = 0; i < this.accessLevelsDetails.length; i++) {
        this.accessLevelsDetails[i].createdById = tab.workgroupDetails.createdById;
        this.accessLevelsDetails[i].modifiedById = tab.workgroupDetails.modifiedById;

        for (let j = 0; j < tab.accessLevelDataList.length; j++) {
          if (this.accessLevelsDetails[i].permissionName == tab.accessLevelDataList[j].permissionName) {
            this.accessLevelsDetails[i].permissionLevel = tab.accessLevelDataList[j].permissionLevel;
          }
        }
      }
      tab.accessLevelDataList = this.accessLevelsDetails;
      console.log('After workgroup role selected AccessLevel ' + JSON.stringify(tab.accessLevelDataList));
      this.workGroupAccessLoader = false;
      this.accessLevelAvailable = true;
    }).catch(error => {

      for (let i = 0; i < this.accessLevelsDetails.length; i++) {
        this.accessLevelsDetails[i].createdById = tab.workgroupDetails.createdById;
        this.accessLevelsDetails[i].modifiedById = tab.workgroupDetails.modifiedById;
      }

      tab.accessLevelDataList = this.accessLevelsDetails;
      console.log('After workgroup role selected AccessLevel ' + JSON.stringify(tab.accessLevelDataList));
      //this.showMessage(error.error.message)
      this.workGroupAccessLoader = false;
      this.accessLevelAvailable = true;
    });
    // this.userProfileService.getWorkgroupRoleSkillSet(tab.workgroupDetails.workgroupName, this.selectedWorkgroupRole.roleName).toPromise().then((response: any) => {
    //   this.workgroupSkillDataList = response;
    //   tab.workgroupSkillDataList = response;
    //   tab.workgroupSkillDataListBackup = response;
    // }).catch(error => {
    //   tab.workgroupSkillDataList = [];
    //   // this.showMessage(error.error.message)
    // });

  }

  addWorkgroup() {
    let dialogData = { name: '', desc: '', createdById: '' };
    dialogData.createdById = this.getUserCuid();
    // const createWorkgroupDialog = this.dialog.open(CreateWorkgroupModalComponent, {
    //   width: '650px',
    //   data: dialogData,
    //   hasBackdrop: true
    // });
    this.userProfileService.getWorkgroupTemplateData("Add-Workgroup-Modal").toPromise().then((response: any) => {
      console.log(response)
      var response: any = response;
      var output: any = {}
      var field = response.pageLayoutTemplate[1].fieldsList.map((value) => {
        output[value.fieldName] = ''
        if (value.fieldName == 'CreatedBy') {
          output[value.fieldName] = this.getUserCuid()
        }
        return value;
      })
      this.addRoleGroup = {
        buttons: response.pageLayoutTemplate[0].fieldsList,
        fields: field,
        title: response.pageLayoutTemplate[2].fieldsList[0].label,
        output: output
      }
      this.modalDetails = {
        ...this.modalDetails, ...this.addRoleGroup, className: "addrolegroup",
        from: "addrolegroup", error: {}, isDeleteConfirm: false
      };
      this.modalChild.showModal();
      // this.uiObject = {
      //   'pageTitle': response.pageLayoutTemplate.find((data: any) => data.sectionHeader === "Title Header").fieldsList[0].label,
      //   'fields': [...response.pageLayoutTemplate.find((data: any) => data.sectionHeader === "TextFieldName").fieldsList],
      //   'buttons': [...response.pageLayoutTemplate.find((data: any) => data.sectionHeader === "Buttons").fieldsList],
      // }
    }).then(() => {
    });

    // createWorkgroupDialog.componentInstance.onCreateWorkgroup.subscribe(result => {
    //   if (result.buttonClicked === 'createWorkgroup') {

    //     const requestObj = { workgroupName: result.workgroupName, workgroupDesc: result.workgroupDesc, createdById: result.createdById };
    //     console.log(requestObj);
    //     this.userProfileService.createWorkgroup(requestObj).toPromise().then((response: any) => {
    //       this.showMessage(response.message);
    //       this.getAllWorkgroups();
    //       const log: ActivityLog = new ActivityLog();
    //       log.activityStatus = 'SUCCESS';
    //       log.activityType = 'CREATE';
    //       log.application = 'FLIGHTDECK';
    //       log.createdById = this.getUserCuid();
    //       log.processingTime = '0';
    //       log.activityModule = 'USERPROFILE-WORKGROUP';
    //       log.activityValue = requestObj.workgroupName;
    //       log.activityDetails = 'Workgroup created with name: ' + requestObj.workgroupName + ' and desc: ' + requestObj.workgroupDesc;
    //       this.activityLogService.logActivity(log);
    //     }).catch(error => this.showMessage(error.error.message));
    //   }
    //   createWorkgroupDialog.close();
    // });
  }

  buttonClicked(fromModal) {
    if (fromModal.modal.from == 'addrolegroup') {
      this.createWorkGroupClicked(fromModal);
    } else if (fromModal.modal.from == 'addworkgrouprole') {
      this.addWorkgroupRoleClicked(fromModal)
    } else if (fromModal.modal.from == 'editworkgrouprole') {
      this.editWorkGroupRoleClicked(fromModal);
    } else if (fromModal.modal.from == 'deleteworkgroup') {
      this.onDeleteWorkgroupConfirm(fromModal);
    } else if (fromModal.modal.from == 'deleteworkgrouprole') {
      this.deleteworkgrouproleModal(fromModal);
    }
  }

  createWorkGroupClicked(fromModal) {
    var requestObj = { workgroupName: fromModal.modal.fields[0].fieldValue, workgroupDesc: fromModal.modal.fields[1].fieldValue, createdById: fromModal.modal.output.CreatedBy };
    this.userProfileService.createWorkgroup(requestObj).toPromise().then((response: any) => {
      //this.modalChild.hideModal();
      this.showMessageModal(response.message, 1, 1);

      this.getAllWorkgroups();
      const log: ActivityLog = new ActivityLog();
      log.activityStatus = 'SUCCESS';
      log.activityType = 'CREATE';
      log.application = 'FLIGHTDECK';
      log.createdById = this.getUserCuid();
      log.processingTime = '0';
      log.activityModule = 'USERPROFILE-WORKGROUP';
      log.activityValue = requestObj.workgroupName;
      log.activityDetails = 'Workgroup created with name: ' + requestObj.workgroupName + ' and desc: ' + requestObj.workgroupDesc;
      this.activityLogService.logActivity(log);
    }).catch(error => {
      //this.showMessage(error.error.message);  
      this.responseHandler(error.error, 0)
    });
    let auditLogRequest: AuditLog[]=[];
    auditLogRequest.push({ createdById:this.getUserCuid(),resourceId: this.getResourceid(), 
      module: "Manage Workgroup", type: "save", value:fromModal.modal.output.WorkgroupName,display:fromModal.modal.output.WorkgroupName,status:"Success",
      detail:"Created new workgroup : "+fromModal.modal.output.WorkgroupName});
    this.userProfileService.saveResourceAuditLog(auditLogRequest).toPromise().then((response: any) => {
    console.log(JSON.stringify(response));
    }).catch(error => {
      this.IsError = true;
      this.message = error.error.message;
      setTimeout(() => {
        this.IsError = false;
      }, 15000);
    });
  }
// Get User CUID from localstorage
  private getUserCuid() {
    let cuid;
    if (localStorage.getItem('fd_user')) {
      cuid = JSON.parse(localStorage.getItem('fd_user')).cuid ? JSON.parse(localStorage.getItem('fd_user')).cuid.toUpperCase() : '';
    }
    return cuid;
  }
// Get User Resource ID from localstorage
  private getResourceid() {
    let resourceId;
    if (localStorage.getItem('fd_user')) {
      resourceId = JSON.parse(localStorage.getItem('fd_user')).id ? JSON.parse(localStorage.getItem('fd_user')).id.toUpperCase() : '';
    }
    return resourceId;
  }


  getWorkgroupDetails() {
    //debugger;
    if(this.uiObject.workgroupFIlter.selectedWorkGroups.length>0){ 
      this.uiObject.workgroupFIlter.selectedWorkGroups.forEach(workgroupName => {
        let filterWorkGroup = this.uiObject.workgroupTabs.filter(elem => elem.title === workgroupName);
        console.log(filterWorkGroup);
        if(filterWorkGroup ==0){
          this.getWorkgroup(workgroupName);
        }
        
      })
  //     let filterWorkGroup;              
  //   this.uiObject.workgroupFIlter.selectedWorkGroups.forEach(workgroupName => {
  //     filterWorkGroup = this.uiObject.workgroupTabs.filter((elem) =>{
  //       elem.title == workgroupName
  //     })
  //     if(filterWorkGroup.length>0){
  //       console.log("error Message");
  //     }
  //     else{
  //       this.getWorkgroup(workgroupName);
  //     }
  //  });
  }

  
  }
  getWorkgroup(workgroupName){
    if(workgroupName){
      if(this.uiObject.workgroupTabs){
        let filterWorkGroup = this.uiObject.workgroupTabs.filter(elem => elem.title === workgroupName);
        console.log(filterWorkGroup);
        if(filterWorkGroup.length>0){
          return;
        }    
      }
    }
    console.log(workgroupName);
    //debugger;
    this.userProfileService.getWorkgroupDetails(workgroupName).toPromise().then((response: any) => {        
      this.templateData = response;
      for (let i = 0; i < this.actionColumn.length; i++) {
        if (this.actionColumn[i].fieldName === 'roleName') {
          this.actionColumn[i].dropDown = [];
          if (isArray(this.templateData['cpWorkgroupRoles'])) {
            this.templateData['cpWorkgroupRoles'].forEach(element => {
              this.actionColumn[i].dropDown.push(element.roleName);
            });
          }
        }
      }
      response.cpWorkgroupRoles = !response.cpWorkgroupRoles ? [] : response.cpWorkgroupRoles;
      let tabObj = { type: "workgroup", title: workgroupName, workgroupDetails: response, workgroupDetailsBackup: {} };
      Object.assign(tabObj.workgroupDetailsBackup, tabObj.workgroupDetails);
      this.uiObject.workgroupTabs.push(tabObj);
      console.log(this.uiObject.workgroupTabs[0].workgroupDetails.workgroupId);

      for (let i = 0; i < this.uiObject.workgroupTabs.length; i++) {
        this.uiObject.workgroupTabs[i].isActive = false;
      }
      this.uiObject.workgroupTabs[this.uiObject.workgroupTabs.length - 1].isActive = true;
      this.setFieldValues(tabObj.title);
      console.log(tabObj.title);
      this.CurrentWorkgroupName = tabObj.title;
      this.CurrentWorkgroupId = tabObj.workgroupDetails.workgroupId;
      this.userProfileService.getAllAccessLevel().subscribe((res) => {

        this.accessLevelsDetails = res.sort((a, b) => a.permissionName.localeCompare(b.permissionName));
        // this.accessLevelsDetails = res;
        //make all object permission level restricted
        this.accessLevelsDetails = this.accessLevelsDetails.filter(item => item.permissionLevel == "Restricted");
        console.log('access level console ' + JSON.stringify(this.accessLevelsDetails));
      });
      this.userProfileService.getWorkgroupDetailsParams(this.CurrentWorkgroupId).toPromise().then((resParams: any) => {
        console.log(resParams);
        this.resourceLayoutResp = resParams['params'];

        this.resObject = resParams;

        for(let i = 0; i < this.uiObject.workgroupTabs.length; i++){
            if(this.uiObject.workgroupTabs[i].workgroupDetails.workgroupId == resParams['id']){
                this.uiObject.workgroupTabs[i].workgroupParams = resParams['params'];
                this.uiObject.workgroupTabs[i].resObject = resParams;
            }
        }
        this.WGParamsRefresh();
        //console.log("this.uiObject.workgroupTabs:", this.uiObject.workgroupTabs);
      });
      // console.log('res Object', JSON.stringify(this.resObject));
      let auditLogRequest: AuditLog[]=[];
      auditLogRequest.push({ createdById:this.getUserCuid(),resourceId: this.getResourceid(),
        module: "Manage Workgroup", type: "view", value:this.CurrentWorkgroupId,display:workgroupName,
        status:"Success",detail:"Viewed Workgroup : "+workgroupName+", "+this.CurrentWorkgroupId})
        this.userProfileService.saveResourceAuditLog(auditLogRequest).toPromise().then((response: any) => {
          console.log(JSON.stringify(response));
        }).catch(error => {
          this.IsError = true;
          this.accessLevelsDetails = [];
          this.message = error.error.message;
          setTimeout(() => {
          this.IsError = false;
          }, 15000);
        }); 
    }).catch((error: any) => {
      this.IsError = true;
      this.accessLevelsDetails = [];
      this.message = error.error.message;
      setTimeout(() => {
        this.IsError = false;
      }, 15000);
    });

  }
  getConnectedMember() {
    this.loading = true;
    console.log("CurrentWorkgroupId****"+this.CurrentWorkgroupId)
    this.userProfileService.getConnectedMember(this.CurrentWorkgroupId).toPromise().then((response: any) => {
      let index: number;

      // response.forEach(element => {
      //   if (element.workgroupRolesList.length > 0) {
      //     let data = [];
      //     data = element.workgroupRolesList.map(x =>
      //       x.workgroupRoleName);
      //     element.roleName = data.toString();
      //   } else {
      //     element.roleName = ""
      //   }
      // });

      let workGroupRole = [];
      response.map(list => {
        if(list.workgroupRolesList.length>0){
          list.workgroupRolesList.map(workGroupList => {
            let obj ={fullName : list.fullName, cuid : list.cuid, roleName : workGroupList.workgroupRoleName, resourceId: list.id, roleId : workGroupList.id }
            workGroupRole.push(obj);
        });
        }
        // else {
        //   let obj ={fullName : list.fullName, cuid : list.cuid, roleName : list.workgroupRolesList[0].workgroupRoleName}
        //     workGroupRole.push(obj);
        // }  
    });
      this.memberTab.memberDetails.backUpMemberList = workGroupRole;
      for (let i = 0; i < this.uiObject.workgroupTabs.length; i++) {
        if (this.uiObject.workgroupTabs[i].title === this.CurrentWorkgroupName + " member") {
          console.log(this.uiObject.workgroupTabs[i]);
          index = i;
        }
      }

      if (index === undefined) {
        let tabObj = { type: "member", title: this.CurrentWorkgroupName + " member", memberDetails: this.memberTab.memberDetails, workgroupDetails: null, workgroupDetailsBackup: {} };
        Object.assign(tabObj.workgroupDetailsBackup, tabObj.workgroupDetails);
        this.uiObject.workgroupTabs.push(tabObj);
        index = this.uiObject.workgroupTabs.indexOf(tabObj);
      } else {
        this.uiObject.workgroupTabs[index].memberDetails = this.memberTab.memberDetails;
      }
      this.displayOnRefresh = false;
      this.markActive(index);
      this.pagination.allItems = workGroupRole;
      this.pagination.totalRecords = workGroupRole.length;
      this.pagination.totalPage = Math.ceil(this.pagination.totalRecords / this.pagination.selectedLimit);
      this.memberTab.memberDetails.memberList = workGroupRole.slice(0, this.pagination.selectedLimit);
      this.systemParameter.tableData = workGroupRole.slice(0, this.pagination.selectedLimit);
      this.pagination.currentPageNumber = 1;
      this.convertNumberToArray(this.pagination.totalPage);
      setTimeout(() => {
        this.loading=false;
        this.displayOnRefresh = true;
      }, 50);
      
    }, (error: any) => {
      this.loading = false;
      let index: number;
      this.memberTab.memberDetails.backUpMemberList = [];
      for (let i = 0; i < this.uiObject.workgroupTabs.length; i++) {
        if (this.uiObject.workgroupTabs[i].title === this.CurrentWorkgroupName + " member") {
          console.log(this.uiObject.workgroupTabs[i]);
          index = i;
        }
      }

      if (index === undefined) {
        let tabObj = { type: "member", title: this.CurrentWorkgroupName + " member", memberDetails: this.memberTab.memberDetails, workgroupDetails: null, workgroupDetailsBackup: {} };
        Object.assign(tabObj.workgroupDetailsBackup, tabObj.workgroupDetails);
        this.uiObject.workgroupTabs.push(tabObj);
        index = this.uiObject.workgroupTabs.indexOf(tabObj);
      } else {
        this.uiObject.workgroupTabs[index].memberDetails = this.memberTab.memberDetails;
      }
      this.markActive(index);
      this.pagination.totalRecords = 0;
      this.pagination.totalPage = Math.ceil(this.pagination.totalRecords / this.pagination.selectedLimit);
      this.memberTab.memberDetails.memberList = [];
      this.pagination.currentPageNumber = 0;
      this.convertNumberToArray(this.pagination.totalPage);
      this.IsError = true;
      this.displayOnRefresh = false;
      this.message = error.error.message;
      setTimeout(() => {
        this.displayOnRefresh = true;
      }, 50);
      setTimeout(() => {
        this.IsError = false;
      }, 15000);
    });
  }
  printPDF() {
    this.sharedService.printPDF(this.memberTab.memberDetails.headers,
      this.memberTab.memberDetails.backUpMemberList, "Members", "Members");
  }

  printData() {
    printJS({
      printable: this.memberTab.memberDetails.backUpMemberList,
      properties: this.memberTab.memberDetails.headers.map(header => header.fieldName),
      type: 'json'
    });
  }



  onSaveConnectedMemberClick(data: any, role: any) {
    
    let requestObject = { workgroupName: "", workgroupRole: "", cuid: "" };
    let RowData: any = {};
    for (let i = 0; i < this.uiObject.workgroupTabs.length; i++) {
      if (this.uiObject.workgroupTabs[i].type === 'member') {
        RowData = role.pagedItems[role.rowIndex];
      }
    }

    data.map(item => {
      if (item.fieldName == "roleName") {
        requestObject.workgroupRole = RowData.roleName;
      }
      if (item.fieldName == "cuid") {
        requestObject.cuid = RowData.cuid;
      }
    });
    requestObject.workgroupName = this.uiObject.workgroupFIlter.selectedWorkGroups[0];

    this.userProfileService.saveConnectedMember(requestObject).toPromise().then((saveResponse: any) => {
      this.userProfileService.getConnectedMember(this.CurrentWorkgroupId).toPromise().then((response: any) => {        
        this.memberTab.memberDetails.memberList = response;
        this.memberTab.memberDetails.backUpMemberList = response;
        // this.adjustPaginationOnDataChange();
        // this.showMessage(saveResponse.message);
        this.IsSuccess = true;
        this.message = saveResponse.message;
        setTimeout(() => {
          this.IsSuccess = false;
        }, 15000);

        // this.uiObject.workgroupTabs[i].memberDetails.memberList[role].rowEdit = false;
        // role.edit = false;
        data.map(item => {
          item.fieldValue = "";
        })
      })


      //this.showMessage(error.error.message));
    })
      .catch(error => {
        this.IsError = true;
        this.message = error.error.message;
        setTimeout(() => {
          this.IsError = false;
        }, 15000);
      });
  }
  onMemberInput(header, event) {
    header.fieldValue = event.target.value;
  }

  filterConnectedMember(fieldName: string, criteriaValue: string) {
    if (this.filterFields.length === 0) {
      this.filterFields = this.memberTab.memberDetails.headers.map((h: any) => {
        return { key: h.fieldName, value: "" }
      });
    }
    let list: any[] = [...this.memberTab.memberDetails.backUpMemberList];
    const data = {
      list, fieldName, criteriaValue,
      filterFields: this.filterFields,
      filterCleared: false
    }
    this.sharedService.filterData(data);
    this.memberTab.memberDetails.filteredMemberList = (data.filterCleared) ? this.memberTab.memberDetails.backUpMemberList : data.list;
    this.handlePagination(data.list);
  }

  adjustPaginationOnDataChange() {
    const pageNumber = this.pagination.pageNumber;
    const data = { page: pageNumber }
    this.handlePagination(this.memberTab.memberDetails.backUpMemberList);

    this.pageChanged(data);
  }

  handlePagination(list: any[]) {
    const fullList = [...list];
    this.pagination.pageNumber = 1;
    this.pagination.totalRecords = fullList.length;
    this.pagination.totalPage = Math.ceil(this.pagination.totalRecords / this.pagination.selectedLimit);
    this.memberTab.memberDetails.memberList = fullList.slice(0, this.pagination.selectedLimit);
  }
  paginationChange(option: any) {
    this.pagination.pageNumber = 1;
    this.pagination.totalRecords = this.memberTab.memberDetails.backUpMemberList.length;
    this.paginationLimitOption = parseInt(option);
    this.pagination.selectedLimit = parseInt(option);
    this.memberTab.memberDetails.memberList = this.memberTab.memberDetails.backUpMemberList.slice(0, this.pagination.selectedLimit);
    this.pagination.totalPage = Math.ceil(this.pagination.totalRecords / this.pagination.selectedLimit);
  }
  pageChanged(data: any) {
    const list = (this.memberTab.memberDetails.filteredMemberList.length !== 0) ? this.memberTab.memberDetails.filteredMemberList :
      this.memberTab.memberDetails.backUpMemberList;
    const startIndex = (data.page - 1) * this.pagination.selectedLimit;
    const endIndex = startIndex + this.pagination.selectedLimit;
    this.pagination.pageNumber = data.page;
    this.memberTab.memberDetails.memberList = list.slice(startIndex, endIndex);
  }
  onDeleteConnectedMember(cuid, roleName: any, index: any) {

		let pagedItems = index.pagedItems;
		let rowIndex = index.rowIndex;
    console.log(pagedItems[rowIndex]);
    let resourceId =  pagedItems[rowIndex].resourceId;
    let workGroupRoleID = pagedItems[rowIndex].roleId;
    cuid = pagedItems[rowIndex].cuid;
    roleName = pagedItems[rowIndex].roleName;
    
    // for (let i = 0; i < this.uiObject.workgroupTabs.length; i++) {
    //   if (this.uiObject.workgroupTabs[i].type === 'member') {
    //     console.log(this.uiObject.workgroupTabs[i].memberDetails.memberList[index.rowIndex]);
    //      cuid = this.uiObject.workgroupTabs[i].memberDetails.memberList[index.rowIndex].cuid;
    //      roleName = this.uiObject.workgroupTabs[i].memberDetails.memberList[index.rowIndex].roleName;
    //     resourceId= this.uiObject.workgroupTabs[i].memberDetails.memberList[index.rowIndex].resourceId;
    //     workGroupRoleID = this.uiObject.workgroupTabs[i].memberDetails.memberList[index.rowIndex].roleId;
    //   }
    // }
    this.notificationService.smartMessageBox({
      title: "Smart Alert!",
      content: "Do you really want to delete this member?",
      buttons: '[No][Yes]'
    }, (ButtonPressed) => {
      if (ButtonPressed === "Yes") {

        console.log('Deleting  workgroupid of :::'+ this.CurrentWorkgroupId + 'of workgroupRoleId '+ workGroupRoleID+ 'of  resouceID '+ resourceId + ' cuid ' + cuid + ' roleName' + roleName)

        this.userProfileService.deleteConnectedMember(this.CurrentWorkgroupId, workGroupRoleID, resourceId).
          toPromise().then((saveResponse: any) => {

            pagedItems.splice(rowIndex,1);
            this.IsSuccess = true;
              this.message = saveResponse.message;
              setTimeout(() => {
                this.IsSuccess = false;
              }, 15000);

            // this.userProfileService.getConnectedMember(this.CurrentWorkgroupId).toPromise().then((response: any) => {
              
            //   let workGroupRole = [];
            //   response.map(list => {
            //     if(list.workgroupRolesList.length>0){
            //       list.workgroupRolesList.map(workGroupList => {
            //         let obj ={resourceId: list.id ,fullName : list.fullName, cuid : list.cuid, roleName : workGroupList.workgroupRoleName, roleId:workGroupList.id}
            //         workGroupRole.push(obj);
            //         })
            //       }
            //     });
              
            //   this.memberTab.memberDetails.memberList = workGroupRole;
            //   this.memberTab.memberDetails.backUpMemberList = workGroupRole;
            //   // this.adjustPaginationOnDataChange();
            //   // this.showMessage(saveResponse.message);
            //   this.IsSuccess = true;
            //   this.message = saveResponse.message;
            //   setTimeout(() => {
            //     this.IsSuccess = false;
            //   }, 15000);
            //})
            // const inx = this.memberTab.memberDetails.backUpMemberList.findIndex(member => member.cuid === cuid && member.roleName === roleName);
            // this.memberTab.memberDetails.backUpMemberList.splice(inx, 1);
            // this.adjustPaginationOnDataChange();
            // this.showMessage(response.message);
          })
          .catch(error => {
            this.IsError = true;
            this.message = error.error.message;
            setTimeout(() => {
              this.IsError = false;
            }, 15000);
          });
      }
      if (ButtonPressed === "No") {
      }

    });

  }
  addNewMemberRow(event) {
    //this.iconEdit = true;
    // this.memberTab.memberDetails.memberList.push(
    //   {
    //     cuid: '', fullName: '', roleName: "", rowEdit: true
    //   }
    // )
    event.pagedItems.unshift({
      cuid: '', fullName: '', roleName: "", rowEdit: true
    });
  }
  onCloseClick(skillInx, roleIndex) {
    let index = 0;
    const temp = this.memberTab.memberDetails.backUpMemberList;
    this.memberTab.memberDetails.memberList[roleIndex]['rowEdit'] = false;
    if (temp.length > roleIndex) {
      this.memberTab.memberDetails.memberList[roleIndex]['cuid'] = temp[roleIndex]['cuid'];
      this.memberTab.memberDetails.memberList[roleIndex]['fullName'] = temp[roleIndex]['fullName'];
    }
    const roles = this.memberTab.memberDetails.memberList;
    if (roles[roleIndex] && !roles[roleIndex].cuid) {
      roles.splice(roleIndex, 1);
    }
    // this.adjustPaginationOnDataChange();
  }
  onMemberSortSelection(columnName: string) {
    const list = (this.memberTab.memberDetails.filteredMemberList.length !== 0) ?
      this.memberTab.memberDetails.filteredMemberList :
      this.memberTab.memberDetails.backUpMemberList;
    this.sharedService.sortData(list, this.isSortAsc, columnName);
    this.isSortAsc = !this.isSortAsc;
    this.handlePagination(list);
  }

  onDeleteWorkgroupSkill(tab) {
    this.notificationService.smartMessageBox(
      {
        title:
          "<i class='fa fa-sign-out txt-color-orangeDark'></i> Confirm <span class='txt-color-orangeDark'></span> ?",
        content:
          "Are you sure that you want to delete the selected Skill?",
        buttons: "[No][Yes]"
      },
      ButtonPressed => {
        if (ButtonPressed == "Yes") {
          this.userProfileService.deleteWorkgroupRoleSkill(this.selectedskillId).toPromise().then((response: any) => {
            // this.showMessage(response.message);
            this.IsSuccess = true;
            this.message = response.message;
            setTimeout(() => {
              this.IsSuccess = false;
            }, 15000);
            this.getAllWorkgroups();
            const log: ActivityLog = new ActivityLog();
            log.activityStatus = 'SUCCESS';
            log.activityType = 'DELETE';
            log.application = 'FLIGHTDECK';
            log.createdById = this.getUserCuid();
            log.processingTime = '0';
            log.activityModule = 'USERPROFILE-WORKGROUP';
            log.activityValue = this.selectedskillId;
            log.activityDetails = 'Skill: ' + this.selectedskillId + ' deleted successfully';
            this.activityLogService.logActivity(log);
          }).catch(error => {
            this.IsError = true;
            this.message = error.error.message;
            setTimeout(() => {
              this.IsError = false;
            }, 15000);
          });
        }
      }
    );
  }

  onDeleteWorkgroupConfirm(modal) {
    this.userProfileService.deleteWorkgroup(this.uiObject.workgroupFIlter.selectedWorkGroups).toPromise().then((response: any) => {
      // this.showMessage(response.message);
      this.showMessageModal(response.message, 1, 1);
      //this.modalChild.hideModal();
      this.getAllWorkgroups();
      const log: ActivityLog = new ActivityLog();
      log.activityStatus = 'SUCCESS';
      log.activityType = 'DELETE';
      log.application = 'FLIGHTDECK';
      log.createdById = this.getUserCuid();
      log.processingTime = '0';
      log.activityModule = 'USERPROFILE-WORKGROUP';
      log.activityValue = this.uiObject.workgroupFIlter.selectedWorkGroups.toString();
      log.activityDetails = response.message;
      this.activityLogService.logActivity(log);
    }).catch(error => {
      this.responseHandler(error.error, 0)
    });
  }

  deleteWorkgroup() {
    this.modalDetails = { ...this.modalDetails, isDeleteConfirm: true, title: "Confirm", className: "deletemodal", subTitle: "Are you sure that you want to delete the selected Workgroup(s)?", from: "deleteworkgroup" };
    this.modalChild.showModal();
    // this.notificationService.smartMessageBox(
    //   {
    //     title:
    //       "<i class='fa fa-sign-out txt-color-orangeDark'></i> Confirm <span class='txt-color-orangeDark'></span> ?",
    //     content:
    //       "Are you sure that you want to delete the selected Workgroup(s)?",
    //     buttons: "[No][Yes]"
    //   },
    //   ButtonPressed => {
    //     if (ButtonPressed == "Yes") {

    //       this.userProfileService.deleteWorkgroup(this.uiObject.workgroupFIlter.selectedWorkGroups).toPromise().then((response: any) => {
    //         this.showMessage(response.message);
    //         this.getAllWorkgroups();
    //         const log: ActivityLog = new ActivityLog();
    //         log.activityStatus = 'SUCCESS';
    //         log.activityType = 'DELETE';
    //         log.application = 'FLIGHTDECK';
    //         log.createdById = this.getUserCuid();
    //         log.processingTime = '0';
    //         log.activityModule = 'USERPROFILE-WORKGROUP';
    //         log.activityValue = this.uiObject.workgroupFIlter.selectedWorkGroups.toString();
    //         log.activityDetails = response.message;
    //         this.activityLogService.logActivity(log);
    //       }).catch(error => this.showMessage(error.error.message));

    //     }
    //   }
    // );
  }



  filterWorkgroup() {
    let temp = [];
    let searchCriteria = this.uiObject.workgroupFIlter.searchCriteria;
    if (searchCriteria) {
      searchCriteria = searchCriteria.toUpperCase();
      temp = this.uiObject.workgroupFIlter.filterTempData.filter(workgroup => {
        return workgroup.toUpperCase().indexOf(searchCriteria) !== -1;
      });
    } else {
      temp = this.uiObject.workgroupFIlter.filterTempData;
    }
    this.uiObject.workgroupFIlter.filterData = temp;
  }

  removeTab(index: number) {
    this.uiObject.workgroupTabs.splice(index, 1);
    this.uiObject.workgroupTabs.forEach(tab => tab.isActive = false);

    if (this.uiObject.workgroupTabs.length > 0) {
      const activeIndex = index == 0 ? index : index - 1;
      if (this.uiObject.workgroupTabs[activeIndex].title.slice(-6) === 'member' && this.uiObject.workgroupTabs[activeIndex].isActive === false) {
        const charLength = this.uiObject.workgroupTabs[activeIndex].title.length;
        this.CurrentWorkgroupName = this.uiObject.workgroupTabs[activeIndex].title.substr(0, charLength - 7);
        this.getConnectedMember();
      } else {
        this.CurrentWorkgroupName = this.uiObject.workgroupTabs[activeIndex].title;
        this.resourceLayoutResp = this.uiObject.workgroupTabs[activeIndex].workgroupParams;
        this.resObject = this.uiObject.workgroupTabs[activeIndex].resObject;
      }
      this.uiObject.workgroupTabs[activeIndex].isActive = true;
      this.WGParamsRefresh();
    }
  }

  markActive(index: number) {
    for (let i = 0; i < this.uiObject.workgroupTabs.length; i++) {
      if (index == i) {
        // this.uiObject.workgroupTabs[i].isActive = true;
        // this.CurrentWorkgroupName = this.uiObject.workgroupTabs[i].title;
        if (this.uiObject.workgroupTabs[i].title.slice(-6) === 'member' && this.uiObject.workgroupTabs[i].isActive === false) {
          this.uiObject.workgroupTabs[i].isActive = true;
          const charLength = this.uiObject.workgroupTabs[i].title.length;
          this.CurrentWorkgroupName = this.uiObject.workgroupTabs[i].title.substr(0, charLength - 7);
          this.uiObject.workgroupTabs.filter(item=>{
          if(item.title===this.CurrentWorkgroupName){
          this.CurrentWorkgroupId = item.workgroupDetails.workgroupId;}
          })
          this.getConnectedMember();
        } else {
                if(this.uiObject.workgroupTabs[i].title.slice(-6) !== 'member'){
                this.CurrentWorkgroupName = this.uiObject.workgroupTabs[i].title;
                this.CurrentWorkgroupId = this.uiObject.workgroupTabs[i].workgroupDetails.workgroupId;
                
                this.resourceLayoutResp = this.uiObject.workgroupTabs[i].workgroupParams;
                this.resObject = this.uiObject.workgroupTabs[i].resObject;
                }
                else{
                const charLength = this.uiObject.workgroupTabs[i].title.length;
                this.CurrentWorkgroupName = this.uiObject.workgroupTabs[i].title.substr(0, charLength - 7);
              }
          this.uiObject.workgroupTabs[i].isActive = true;
        }
      } else {
        this.uiObject.workgroupTabs[i].isActive = false;
      }
    }
    console.log("Active tab workgroup id"+this.CurrentWorkgroupId);
    this.WGParamsRefresh();
  }

  WGParamsRefresh(){
    this.WGParamsOnRefresh=false;
        
    setTimeout(() => {
        this.WGParamsOnRefresh = true;
    }, 50);
}

  showMessage(message: string) {
    this.snackBar.open(message, "Okay", {
      duration: 15000,
    });
  }

  addRoleRow(workgroupIndex: number) {
    let roles = this.uiObject.workgroupTabs[workgroupIndex].workgroupDetails.cpWorkgroupRoles;
    roles.unshift({ rowEditable: true });
  }

  removeRoleFromWorkgroup(workgroupIndex, roleIndex) {
    const roles = this.uiObject.workgroupTabs[workgroupIndex].workgroupDetails.cpWorkgroupRoles;
    roles.splice(roleIndex, 1);
  }

  filterRoles(workgroupIndex: number, fieldKey: string, criteriaValue: string) {
    const criteriaValueConst = criteriaValue.toUpperCase();
    if (!this.uiObject.workgroupTabs[workgroupIndex].workgroupDetails.rolesBackup) {
      this.uiObject.workgroupTabs[workgroupIndex].workgroupDetails.rolesBackup = this.uiObject.workgroupTabs[workgroupIndex].workgroupDetails.cpWorkgroupRoles;
    }
    let roles = this.uiObject.workgroupTabs[workgroupIndex].workgroupDetails.rolesBackup;
    const temp = roles.filter(role => {
      if (role[fieldKey] && role[fieldKey].toUpperCase().indexOf(criteriaValueConst) !== -1)
        return true;
      else
        return false;
    });
    this.uiObject.workgroupTabs[workgroupIndex].workgroupDetails.cpWorkgroupRoles = temp;
  }
  filterSkills(workgroupIndex: number, fieldKey: string, criteriaValue: string) {
    const criteriaValueConst = criteriaValue.toUpperCase();
    if (!this.uiObject.workgroupTabs[workgroupIndex].workgroupSkillDataListBackup) {
      this.uiObject.workgroupTabs[workgroupIndex].workgroupSkillDataListBackup = this.uiObject.workgroupTabs[workgroupIndex].workgroupSkillDataListBackup;
    }
    let skills = this.uiObject.workgroupTabs[workgroupIndex].workgroupSkillDataListBackup;
    const temp = skills.filter(role => {
      if (role[fieldKey] && role[fieldKey].toUpperCase().indexOf(criteriaValueConst) !== -1)
        return true;
      else
        return false;
    });
    this.uiObject.workgroupTabs[workgroupIndex].workgroupSkillDataList = temp;
  }

  /* onSortSelection(workgroupIndex: number, columnName: string) {
    if (this.isSortAsc) {
      this.isSortAsc = false;
      this.uiObject.workgroupTabs[workgroupIndex].workgroupDetails.cpWorkgroupRoles.sort(this.dynamicSort(columnName));
    } else {
      this.isSortAsc = true;
      this.uiObject.workgroupTabs[workgroupIndex].workgroupDetails.cpWorkgroupRoles.sort(this.dynamicSort('-' + columnName));
    }
  } */

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

  restoreWorkgroupDetails(workgroupIndex: number) {
    Object.assign(this.uiObject.workgroupTabs[workgroupIndex].workgroupDetails, this.uiObject.workgroupTabs[workgroupIndex].workgroupDetailsBackup);
  }

  updateWorkgroupDetails(workgroupIndex: number) {
    const requestObj = this.uiObject.workgroupTabs[workgroupIndex].workgroupDetails;
    // Validation for workgroup name & desc
    if (!requestObj.workgroupName || !requestObj.workgroupDesc) {
      return;
    }
    requestObj.modifiedById = this.getUserCuid();
    this.userProfileService.updateWorkgroup(requestObj).toPromise().then((response: any) => {
      // this.showMessage(response.message);
      this.IsSuccess = true;
      this.message = response.message;
      setTimeout(() => {
        this.IsSuccess = false;
      }, 15000);
      this.uiObject.workgroupTabs[workgroupIndex].title = requestObj.workgroupName;
      this.refreshWorkgroupDetails(workgroupIndex);
      this.getAllWorkgroups();
      const log: ActivityLog = new ActivityLog();
      log.activityStatus = 'SUCCESS';
      log.activityType = 'UPDATE';
      log.application = 'FLIGHTDECK';
      log.createdById = this.getUserCuid();
      log.processingTime = '0';
      log.activityModule = 'USERPROFILE-WORKGROUP';
      log.activityValue = requestObj.workgroupName;

      const workgroupDetailsBackup = this.uiObject.workgroupTabs[workgroupIndex].workgroupDetailsBackup;
      log.activityDetails = 'Workgroup: ' + workgroupDetailsBackup.workgroupName + ' updated successfully';

      if (workgroupDetailsBackup.workgroupName !== requestObj.workgroupName) {
        log.activityDetails = log.activityDetails + ', Workgroup Name: ' + workgroupDetailsBackup.workgroupName + ' -> ' + requestObj.workgroupName;
      }
      if (workgroupDetailsBackup.workgroupDesc !== requestObj.workgroupDesc) {
        log.activityDetails = log.activityDetails + ', Workgroup Desc: ' + workgroupDetailsBackup.workgroupDesc + ' -> ' + requestObj.workgroupDesc;
      }
      this.activityLogService.logActivity(log);
    }).catch(error => {
      this.IsError = true;
      this.message = error.error.message;
      setTimeout(() => {
        this.IsError = false;
      }, 15000);
    });
    let test :AuditLog[]=[];
      test.push({ createdById:this.getUserCuid(),resourceId: this.getResourceid(), 
      module: "Manage Workgroup", type: "edit", value:requestObj.workgroupId,display:requestObj.workgroupName,
      status:"Success",detail:"Updated workgroup : "+requestObj.workgroupName+", "+requestObj.workgroupId});
      this.userProfileService.saveResourceAuditLog(test).toPromise().then((response: any) => {
        console.log(JSON.stringify(response));
      }).catch(error => {
      this.IsError = true;
      this.message = error.error.message;
      setTimeout(() => {
      this.IsError = false;
      }, 15000);
    });
  }

  deleteWorkgroupRole(workgroupIndex, workgroupName, roleName, roleId) {
    this.modalDetails = { ...this.modalDetails, isDeleteConfirm: true, title: "Confirm", className: "deletemodal", workgroupId: workgroupName, roleId: roleId, roleName: roleName, subTitle: "Are you sure that you want to delete the Role : " + roleName + "?", from: "deleteworkgrouprole" };
    this.modalChild.showModal();
    // this.notificationService.smartMessageBox(
    //   {
    //     title:
    //       "<i class='fa fa-sign-out txt-color-orangeDark'></i> Confirm <span class='txt-color-orangeDark'></span> ?",
    //     content:
    //       "Are you sure that you want to delete the Role : " + roleName + "?",
    //     buttons: "[No][Yes]"
    //   },
    // ButtonPressed => {
    //   if (ButtonPressed == "Yes") {
    // this.userProfileService.deleteWorkgroupRole(workgroupName, roleName).toPromise().then((response: any) => {
    //   this.showMessage(response.message);
    //   // this.getWorkgroupDetails();
    //   // this.refreshWorkgroupDetails(workgroupIndex);
    //   const log: ActivityLog = new ActivityLog();
    //   log.activityStatus = 'SUCCESS';
    //   log.activityType = 'DELETE';
    //   log.application = 'FLIGHTDECK';
    //   log.createdById = this.getUserCuid();
    //   log.processingTime = '0';
    //   log.activityModule = 'USERPROFILE-ROLE';
    //   log.activityValue = roleName;
    //   log.activityDetails = 'Workgroup Role: ' + roleName + ' deleted successfully';
    //   this.activityLogService.logActivity(log);
    //   this.uiObject.workgroupFIlter.selectedWorkGroups.forEach(workgroupName => {
    //     this.userProfileService.getWorkgroupDetails(workgroupName).toPromise().then((response: any) => {
    //       this.templateData = response;
    //       response.cpWorkgroupRoles = !response.cpWorkgroupRoles ? [] : response.cpWorkgroupRoles;
    //       let tabObj = { type: "workgroup", title: workgroupName, workgroupDetails: response, workgroupDetailsBackup: {} };
    //       Object.assign(tabObj.workgroupDetailsBackup, tabObj.workgroupDetails);
    //       for (let i = 0; i < this.uiObject.workgroupTabs.length; i++) {
    //         if (this.uiObject.workgroupTabs[i].isActive === true) {
    //           this.uiObject.workgroupTabs[i].workgroupDetails = response;
    //           this.uiObject.workgroupTabs[i].workgroupDetailsBackup = response;
    //           continue;
    //         }
    //       }
    //       this.setFieldValues(tabObj.title);
    //     }).catch(error => this.showMessage(error.error.message));
    //   });
    // }).catch(error => this.showMessage(error.error.message));
    //     }
    //   }
    // );
  }
  deleteworkgrouproleModal(frommodal) {
    this.userProfileService.deleteV2WorkgroupRole(frommodal.modal.workgroupId, frommodal.modal.roleId).toPromise().then((response: any) => {
      this.showMessageModal(response.message, 1, 1);
      // this.getWorkgroupDetails();
      // this.refreshWorkgroupDetails(workgroupIndex);
      const log: ActivityLog = new ActivityLog();
      log.activityStatus = 'SUCCESS';
      log.activityType = 'DELETE';
      log.application = 'FLIGHTDECK';
      log.createdById = this.getUserCuid();
      log.processingTime = '0';
      log.activityModule = 'USERPROFILE-ROLE';
      log.activityValue = frommodal.modal.roleName;
      log.activityDetails = 'Workgroup Role: ' + frommodal.modal.roleName + ' deleted successfully';
      this.activityLogService.logActivity(log);
      //  this.uiObject.workgroupFIlter.selectedWorkGroups.forEach(workgroupName => {
      this.userProfileService.getWorkgroupDetails(this.CurrentWorkgroupName).toPromise().then((response: any) => {
        this.templateData = response;
        response.cpWorkgroupRoles = !response.cpWorkgroupRoles ? [] : response.cpWorkgroupRoles;
        let tabObj = { type: "workgroup", title: this.CurrentWorkgroupName, workgroupDetails: response, workgroupDetailsBackup: {} };
        Object.assign(tabObj.workgroupDetailsBackup, tabObj.workgroupDetails);
        for (let i = 0; i < this.uiObject.workgroupTabs.length; i++) {
          if (this.uiObject.workgroupTabs[i].isActive === true) {
            this.uiObject.workgroupTabs[i].workgroupDetails = response;
            this.uiObject.workgroupTabs[i].workgroupDetailsBackup = response;
            continue;
          }
        }
        this.setFieldValues(tabObj.title);
      }).catch(error => {
        this.IsError = true;
        this.message = error.error.message;
        setTimeout(() => {
          this.IsError = false;
        }, 15000);
      });
      //  });
    }).catch(error => {
      this.responseHandler(error.error, 0);
    });
  }

  // Get fresh data to Re-Render data after modifying on UI
  refreshWorkgroupDetails(workgroupIndex: number) {
    const workgroupName = this.uiObject.workgroupTabs[workgroupIndex].workgroupDetails.workgroupName;
    this.userProfileService.getWorkgroupDetails(workgroupName).toPromise().then((response: any) => {
      response.cpWorkgroupRoles = !response.cpWorkgroupRoles ? [] : response.cpWorkgroupRoles;
      const oldWorkgroupRoles = this.uiObject.workgroupTabs[workgroupIndex].workgroupDetails.cpWorkgroupRoles;
      const newWorkgroupRoles = response.cpWorkgroupRoles;
      const newWorkgroupRoleObj = {};
      newWorkgroupRoles.forEach(workgroupRole => {
        newWorkgroupRoleObj[workgroupRole.roleName] = true;
      });
      for (let i = oldWorkgroupRoles.length - 1; i >= 0; i--) {
        if (!oldWorkgroupRoles[i].workgroupRoleId && !newWorkgroupRoleObj[oldWorkgroupRoles[i].roleName]) {
          response.cpWorkgroupRoles.unshift(oldWorkgroupRoles[i]);
        }
      }
      this.uiObject.workgroupTabs[workgroupIndex].workgroupDetails = response;
      Object.assign(this.uiObject.workgroupTabs[workgroupIndex].workgroupDetailsBackup, this.uiObject.workgroupTabs[workgroupIndex].workgroupDetails);
    }).catch(error => {
      this.IsError = true;
      this.message = error.error.message;
      setTimeout(() => {
        this.IsError = false;
      }, 15000);
    });
  }

  updateWorkgroupRole(workgroupIndex: number, roleIndex: number) {
    const roles = this.uiObject.workgroupTabs[workgroupIndex].workgroupDetails.cpWorkgroupRoles;
    let role = roles[roleIndex];
    role.workgroupName = this.uiObject.workgroupTabs[workgroupIndex].workgroupDetails.workgroupName;
    if (!role.workgroupRoleId) {
      this.createWorkgroupRole(workgroupIndex, role);
      return;
    }
    role.modifiedById = this.getUserCuid();
    let reqObj: any = {};
    Object.assign(reqObj, role);
    reqObj.roleBackup = '';
    this.userProfileService.updateWorkgroupRole(reqObj).toPromise().then((response: any) => {
      // this.showMessage(response.message);
      this.IsSuccess = true;
      this.message = response.message;
      setTimeout(() => {
        this.IsSuccess = false;
      }, 15000);

      role.rowEditable = false;
      this.refreshWorkgroupDetails(workgroupIndex);
      const log: ActivityLog = new ActivityLog();
      log.activityStatus = 'SUCCESS';
      log.activityType = 'UPDATE';
      log.application = 'FLIGHTDECK';
      log.createdById = this.getUserCuid();
      log.processingTime = '0';
      log.activityModule = 'USERPROFILE-ROLE';
      log.activityValue = reqObj.roleName;

      const roleBackup = role.roleBackup;
      log.activityDetails = 'Workgroup Role: ' + roleBackup.roleName + ' updated successfully';

      if (roleBackup.roleName !== reqObj.roleName) {
        log.activityDetails = log.activityDetails + ', Role Name: ' + roleBackup.roleName + ' -> ' + reqObj.roleName;
      }
      if (roleBackup.roleDesc !== reqObj.roleDesc) {
        log.activityDetails = log.activityDetails + ', Role Desc: ' + roleBackup.roleDesc + ' -> ' + reqObj.roleDesc;
      }
      this.activityLogService.logActivity(log);
    }).catch(error => {
      role.rowEditable = true;
      this.showMessage(error.error.message);
    });
  }

  // Create new workgroup role
  createWorkgroupRole(workgroupIndex: number, roleObj: any) {
    roleObj.createdById = this.getUserCuid();
    this.userProfileService.createWorkgroupRole(roleObj).toPromise().then((response: any) => {
      // this.showMessage(response.message);
      this.IsSuccess = true;
      this.message = response.message;
      setTimeout(() => {
        this.IsSuccess = false;
      }, 15000);
      roleObj.rowEditable = false;
      this.refreshWorkgroupDetails(workgroupIndex);
      const log: ActivityLog = new ActivityLog();
      log.activityStatus = 'SUCCESS';
      log.activityType = 'CREATE';
      log.application = 'FLIGHTDECK';
      log.createdById = this.getUserCuid();
      log.processingTime = '0';
      log.activityModule = 'USERPROFILE-ROLE';
      log.activityValue = roleObj.roleName;
      log.activityDetails = 'Workgroup Role created successfully with name: ' + roleObj.roleName + ' and desc: ' + roleObj.roleDesc;
      this.activityLogService.logActivity(log);
    }).catch(error => {
      this.IsError = true;
      this.message = error.error.message;
      setTimeout(() => {
        this.IsError = false;
      }, 15000);
      roleObj.rowEditable = true;
    });
  }

  // This method is for removing empty rows which doesn't have workgroupRoleId
  // And Reverting back the changes user did on Edit mode
  removeEmptyRow(workgroupIndex: number, roleIndex: number) {
    const roles = this.uiObject.workgroupTabs[workgroupIndex].workgroupDetails.cpWorkgroupRoles;
    if (roles[roleIndex] && !roles[roleIndex].workgroupRoleId) {
      roles.splice(roleIndex, 1);
    } else {
      roles[roleIndex] = this.uiObject.workgroupTabs[workgroupIndex].workgroupDetailsBackup.cpWorkgroupRoles[roleIndex].roleBackup;
      roles[roleIndex].rowEditable = false;
    }
  }

  setRoleBackUp(workgroupIndex: number, roleIndex: number) {
    //this.uiObject.workgroupTabs[workgroupIndex].workgroupDetails.cpWorkgroupRoles[roleIndex].roleBackup = this.uiObject.workgroupTabs[workgroupIndex].workgroupDetailsBackup.cpWorkgroupRoles[roleIndex];
    this.uiObject.workgroupTabs[workgroupIndex].workgroupDetails.cpWorkgroupRoles[roleIndex].roleBackup = {};
    Object.assign(this.uiObject.workgroupTabs[workgroupIndex].workgroupDetails.cpWorkgroupRoles[roleIndex].roleBackup, this.uiObject.workgroupTabs[workgroupIndex].workgroupDetailsBackup.cpWorkgroupRoles[roleIndex]);
  }
  getWorkgroupRoutingParameters() {
    this.uiObject.workgroupFIlter.selectedWorkGroups.forEach(workgroupName => {
      let tabObj = {
        workgroupName,
        title: `${workgroupName} Routing Parameters`,
        workgroupDetailsBackup: {},
        type: 'parameters'
      };
      this.uiObject.workgroupTabs.push(tabObj);
      for (let i = 0; i < this.uiObject.workgroupTabs.length; i++) {
        this.uiObject.workgroupTabs[i].isActive = false;
      }
      this.uiObject.workgroupTabs[this.uiObject.workgroupTabs.length - 1].isActive = true;
    });
  }

  removeParamsTab(index: number, type) {
    // if current tab is params tab, perform the "confirm check", and delete it
    // else just close the tab normally
    const currentTab = this.uiObject.workgroupTabs[index];
    console.log(this.uiObject.workgroupTabs[index])
    if (
      currentTab &&
      currentTab.type === 'parameters' &&
      this.workgroupParametersComponent
    ) {
      if (!this.workgroupParametersComponent.readyToClose()) {
        // show the confirm popup
        this.workgroupParametersComponent.showConfirmPopup((ready: boolean) => {
          if (ready) {
            // close the tab
            this.removeTab(index);
          }
        });
        return;
      } else {
        if (type != "cancel") {
          this.removeTab(index);
        }

      }
    } else {
      this.removeTab(index);
    }
    // this.removeTab(index);
  }

  handleWorkgroupRoutingParamError(errorMsg) {
    // this.showMessage(errorMsg);
    this.IsError = true;
    this.message = errorMsg;
    setTimeout(() => {
      this.IsError = false;
    }, 15000);
  }

  handleWorkgroupRoutingParamSuccess(successMsg) {
    // this.showMessage(successMsg);
    this.IsSuccess = true;
    this.message = successMsg;
    setTimeout(() => {
      this.IsSuccess = false;
    }, 15000);
  }
  responseHandler(error, isHideModal) {
    if (error.text && error.text == "Success") {
      this.showMessageModal(error.text, 0, 0)
    } else {
      if (error.message && typeof error.message == 'string') {
        this.showMessageModal(error.message, 0, 0);
      } else {
        this.showMessageModal('Invalid Data', 0, 0);
      }
    }
  }

  showMessageModal(message: string, isSuccess = 0, isHideModal) {

    this.modalDetails.error = {
      type: isSuccess == 1 ? 'success' : 'danger',
      msg: message
    }
    console.log(this.modalDetails)
    setTimeout(() => {
      this.modalDetails.error = {};
      if (isHideModal) {
        this.modalChild.hideModal();
      }
    }, 3000);
    // this.snackBar.open(message, "Okay", {
    // 	duration: 15000,
    // });
  }

  convertNumberToArray(count: number) {
    this.tablePaginationData = [];
    for (let i = 1; i <= count; i++) {
      this.tablePaginationData.push(i);
    }
  }

  onSortSelection(columnName: string) {
    let index = 0;
    for (let i = 0; i < this.uiObject.workgroupTabs.length; i++) {
      if (this.uiObject.workgroupTabs[i].type === 'member') {
        index = i;
      }
    }
    if (this.isSortAsc) {
      this.isSortAsc = false;
      this.systemParameter.isSortAsc = false;
      this.uiObject.workgroupTabs[index].memberDetails.memberList.sort(this.dynamicSort(columnName));
    } else {
      this.isSortAsc = true;
      this.systemParameter.isSortAsc = true;
      this.uiObject.workgroupTabs[index].memberDetails.memberList.sort(this.dynamicSort('-' + columnName));
    }
    // this.handlePagination(this.applicationTabs[0]['applicationDetails']['applications']);
  }

  filterTaskResult(columnName) {
    let thi = this;
    const globalSearch = this.systemParameter.globalSearch;
    let index = 0;
    for (let i = 0; i < this.uiObject.workgroupTabs.length; i++) {
      if (this.uiObject.workgroupTabs[i].type === 'member') {
        index = i;
      }
    }
    let temp: any;
    if (globalSearch !== '') {
      temp = this.uiObject.workgroupTabs[index].memberDetails.backUpMemberList.filter(row => {
        var result = {};
        for (var key in row) {
          if (isObject(row[key]) === false || isArray(row[key]) === false) {
            if (row.hasOwnProperty(key) && row[key] && row[key].toUpperCase().indexOf(globalSearch.toUpperCase()) !== -1) {
              result[key] = row[key];
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
      temp = this.uiObject.workgroupTabs[index].memberDetails.backUpMemberList.filter(function (item) {
        let flag = true;
        Object.keys(item).forEach((element) => {
          // console.log(thi.actionColumn[element], item[element]);
          if (flag && thi.actionColumn[element] && item[element] && thi.actionColumn[element] != "") {
            if (flag && item[element].toLowerCase().indexOf(thi.actionColumn[element].toLowerCase()) === -1) {
              flag = false;
            }
          }
        });
        return flag;
      });
    }


    // this.taskResults =  temp;
    this.handlePagination(temp);
  }

  workGrpSelectionUpdated(selectedWorkGroups) {
    console.log(selectedWorkGroups);
  }

  EditworkgroupRoleButtonClicked(FieldName, index, tab) {
    if (FieldName == 'Cancel') {
      this.removeTab(index);
    } else {
      this.editWorkGroupRole(tab);
    }
  }
  // save workgroup role modifications on db
  editWorkGroupRole(fromModal) {
    console.log(fromModal);
    const requestObj = { workgroupName: fromModal.workgroupDetails.workgroupName, roleName: fromModal.memberDetails.output.RoleName, id: this.selectedWorkgroupRole.workgroupRoleId, roleDesc: fromModal.memberDetails.output.RoleDesc, modifiedById: fromModal.memberDetails.output.ModifiedBy };
    this.userProfileService.updateWorkgroupRole(requestObj).toPromise().then((response: any) => {
      //this.modalChild.hideModal();
      this.IsSuccess = true;
      this.message = response.message;
      setTimeout(() => {
        this.IsSuccess = false;
      }, 7000);
      fromModal.workgroupDetails.cpWorkgroupRoles.forEach((role, key) => {
        if (role.workgroupRoleId === this.selectedWorkgroupRole.workgroupRoleId) {
          let savedRole = { ...requestObj }
          savedRole["workgroupRoleId"] = this.selectedWorkgroupRole.workgroupRoleId;
          role = savedRole;
        }
      });
      const cpWorkgroupRoles = _.cloneDeep(fromModal.workgroupDetails.cpWorkgroupRoles);
      fromModal.workgroupDetails.cpWorkgroupRoles = cpWorkgroupRoles
      //   this.uiObject.workgroupTabs[index].workgroupDetails.cpWorkgroupRoles=cpWorkgroupRoles;
      // tab.workgroupDetails.cpWorkgroupRoles.map((role)=>{
      //     if(role.workgroupRoleId===this.selectedWorkgroupRole.workgroupRoleId){
      //       let savedRole={...requestObj}
      //       savedRole["workgroupRoleId"]=this.selectedWorkgroupRole.workgroupRoleId;
      //       return savedRole
      //     }else{
      //       role
      //     }
      // })
      // tab.workgroupDetails.cpWorkgroupRoles=updatedCpWorkgroupRoles;
      const log: ActivityLog = new ActivityLog();
      log.activityStatus = 'SUCCESS';
      log.activityType = 'CREATE';
      log.application = 'FLIGHTDECK';
      log.createdById = this.getUserCuid();
      log.processingTime = '0';
      log.activityModule = 'USERPROFILE-ROLE';
      log.activityValue = requestObj.roleName;
      log.activityDetails = 'Workgroup Role updated successfully with name: ' + requestObj.roleName + ' and desc: ' + requestObj.roleDesc;
      this.ref.detectChanges();
      // this.uiObject.workgroupFIlter.selectedWorkGroups.forEach(workgroupName => {
      console.log("fromModal.workgroupDetails", fromModal.workgroupDetails);
      this.userProfileService.getWorkgroupDetails(fromModal.workgroupDetails.workgroupName).toPromise().then((response: any) => {
        this.templateData = response;
        response.cpWorkgroupRoles = !response.cpWorkgroupRoles ? [] : response.cpWorkgroupRoles;
        let tabObj = { type: "workgroup", title: fromModal.workgroupDetails.workgroupName, workgroupDetails: response, workgroupDetailsBackup: {} };
        Object.assign(tabObj.workgroupDetailsBackup, tabObj.workgroupDetails);
        for (let i = 0; i < this.uiObject.workgroupTabs.length; i++) {
          if (this.uiObject.workgroupTabs[i].isActive === true) {
            this.uiObject.workgroupTabs[i].workgroupDetails = response;
            this.uiObject.workgroupTabs[i].workgroupDetailsBackup = response;
            continue;
          }
        }
        this.setFieldValues(tabObj.title);
      }).catch(error => {
        if (error.error) {
          this.IsError = true;
          this.message = error.error.message;
          setTimeout(() => {
            this.IsError = false;
          }, 7000);
        }
      }
      );
      // });
      //  this.activityLogService.logActivity(log);
    }).catch(error => {
      if (error.error) {
        this.responseHandler(error.error, 0)
        // this.showMessage(error.error.message);
      }
    });
  }

  getWorkGrpParamDetails() {
    this.userProfileService.getWorkGroupDetailsById("").toPromise().then((response: any) => {

    }).catch(error => {
      if (error.error) {
        this.IsError = true;
        this.message = error.error.message;
        setTimeout(() => {
          this.IsError = false;
        }, 7000);
      }
    }
    );
  }

  // save params data for selected/specific workgroup. 
  // calling this function from the re-usable component 'params-layout'. 
  // 
  saveAndUpdateSpWgParams(event: any) {
    console.log(event);
    this.loading = true;
    let workgroupParams: any = [];
    // Prepare request data via re-usable function
    let WPdata = this.utility.GetResponcesInPramaeData(event); // this.GetWorkgroupParmasData(event);
    /* if (isArray(event)) {
      event.forEach((workgroup: any) => {
        workgroup.fieldsList.map((pltParam, index) => {
          var paramItem = {
            name: pltParam.fieldName,
            value: pltParam.fieldValue,
            systemParameterItems: []
          }
          if (pltParam.type == 'select') {
            pltParam.systemParameterItemModels.map((spim, spiIndex) => {
              if (spim.value == pltParam.fieldValue) {
                spim.name = pltParam.fieldName;
                paramItem.systemParameterItems[0] = spim;
                //paramItem.value = spim.value;
                workgroupParams.push(spim);
              }
            });
          } else if (pltParam.type == 'MultiSelect') {
            if (pltParam.selectedItems && pltParam.selectedItems.length > 0) {
              paramItem.systemParameterItems = [];
              pltParam.selectedItems.map((selected, selectedIndex) => {
                pltParam.systemParameterItemModels.map((spim, spiIndex) => {
                  if (spim.value == selected) {
                    paramItem.systemParameterItems.push(spim);
                  }
                });
              });
              workgroupParams.push(paramItem);
            }
          }
          else {
            paramItem.value = pltParam.fieldValue;
            workgroupParams.push(paramItem);
          }
        });
      });
    } else {
      event.fieldsList.map((pltParam, index) => {
        var paramItem = {
          name: pltParam.fieldName,
          value: pltParam.fieldValue,
          systemParameterItems: []
        }
        if (pltParam.type == 'select') {
          pltParam.systemParameterItemModels.map((spim, spiIndex) => {
            if (spim.value == pltParam.fieldValue) {
              spim.name = pltParam.fieldName;
              paramItem.systemParameterItems[0] = spim;
              //paramItem.value = spim.value;
              workgroupParams.push(spim);
            }
          });
        } else if (pltParam.type == 'MultiSelect') {
          if (pltParam.selectedItems && pltParam.selectedItems.length > 0) {
            paramItem.systemParameterItems = [];
            pltParam.selectedItems.map((selected, selectedIndex) => {
              pltParam.systemParameterItemModels.map((spim, spiIndex) => {
                if (spim.value == selected) {
                  paramItem.systemParameterItems.push(spim);
                }
              });
            });
            workgroupParams.push(paramItem);
          }
        }
        else {
          paramItem.value = pltParam.fieldValue;
          workgroupParams.push(paramItem);
        }
      });
    } */
    
    this.resWGRObject.params = WPdata.workgroupParams;
    this.resWGRObject.name = this.resWGRObject.workgroupRoleName;
    var UserDetails = JSON.parse(localStorage.getItem('defaultValue'));
    this.resWGRObject.modifiedById = UserDetails.personalInfo.cuid;
    // pass prepared request data to save on database
    this.userProfileService.updateWorkgroupRoleParamsItem(this.resWGRObject).subscribe((res: any) => {
      console.log(res);
      this.loading = false;
      this.IsSuccess = true;
      this.message = res.message;
      setTimeout(() => {
        this.IsSuccess = false;
      }, 7000);
    }, (err) => {
      console.log(err);
      this.IsError = true;
      this.message = err.error.message;
      setTimeout(() => {
        this.IsError = false;
      }, 7000);
      this.loading = false;
    });
  }

  // save params data for workgroup.
  // Calling this function from the re-usable component 'params-layout'. 
  // passing data from prarams-layout to save
  async saveAndUpdateWorkGrpParams(event: any) {
    this.workGrploading = true;
    let workgroupParams: any = [];
    // Prepare request data via re-usable function
    let WPdata = this.utility.GetResponcesInPramaeData(event); // this.GetWorkgroupParmasData(event);

    /* console.log(WPdata);
    return false;
    if (isArray(event)) {
      event.forEach((workgroup: any) => {
        workgroup.fieldsList.map((pltParam, index) => {
          console.log(pltParam);
          var paramItem = {
            name: pltParam.fieldName,
            value: pltParam.fieldValue,
            systemParameterItems: []
          }
          if (pltParam.type == 'select') {
            pltParam.systemParameterItemModels.map((spim, spiIndex) => {
              if (spim.value == pltParam.fieldValue) {
                console.log(pltParam);
                spim.name = pltParam.fieldName;
                paramItem.systemParameterItems[0] = spim;
                //paramItem.value = spim.value;
                workgroupParams.push(spim);
              }
            });
          } else if (pltParam.type == 'MultiSelect') {
            if (pltParam.selectedItems && pltParam.selectedItems.length > 0) {
              paramItem.systemParameterItems = [];
              pltParam.selectedItems.map((selected, selectedIndex) => {
                pltParam.systemParameterItemModels.map((spim, spiIndex) => {
                  if (spim.value == selected) {
                    paramItem.systemParameterItems.push(spim);
                  }
                });
              });
              workgroupParams.push(paramItem);
            }
          } else {
            paramItem.value = pltParam.fieldValue;
            workgroupParams.push(paramItem);
          }
        });
      });
    } else {
      event.fieldsList.map((pltParam, index) => {
        console.log(pltParam);
        var paramItem = {
          name: pltParam.fieldName,
          value: pltParam.fieldValue,
          systemParameterItems: []
        }
        if (pltParam.type == 'select') {
          pltParam.systemParameterItemModels.map((spim, spiIndex) => {
            if (spim.value == pltParam.fieldValue) {
              console.log(pltParam);
              spim.name = pltParam.fieldName;
              paramItem.systemParameterItems[0] = spim;
              //paramItem.value = spim.value;
              workgroupParams.push(spim);
            }
          });
        } else if (pltParam.type == 'MultiSelect') {
          if (pltParam.selectedItems && pltParam.selectedItems.length > 0) {
            paramItem.systemParameterItems = [];
            pltParam.selectedItems.map((selected, selectedIndex) => {
              pltParam.systemParameterItemModels.map((spim, spiIndex) => {
                if (spim.value == selected) {
                  paramItem.systemParameterItems.push(spim);
                }
              });
            });
            workgroupParams.push(paramItem);
          }
        }
        else {
          paramItem.value = pltParam.fieldValue;
          workgroupParams.push(paramItem);
        }
      });
    } */
    console.log(this.resObject);
    // return false;
    this.resObject.params = WPdata.workgroupParams;
    
    await this.userProfileService.updateWorkgroupParamsItem(this.resObject).subscribe((res: any) => {
      console.log(res);
      this.loading = false;
      this.workGrploading = false;
      this.IsSuccess = true;
      this.message = res.message;
      setTimeout(() => {
        this.IsSuccess = false;
      }, 7000);
    }, (err) => {
      console.log(err);
      this.IsError = true;
      this.message = err.error.message;
      setTimeout(() => {
        this.IsError = false;
      }, 7000);
      this.loading = false;
      this.workGrploading = false;
    });
  }

  onRefresh(){
    this.getConnectedMember();
}

  /* GetWorkgroupParmasData(event: any) {
    let workgroupParams: any = [];
    if (isArray(event)) {
      event.forEach((workgroup: any) => {
        workgroup.fieldsList.map((pltParam, index) => {
          console.log(pltParam);
          var paramItem = {
            name: pltParam.fieldName,
            value: pltParam.fieldValue,
            systemParameterItems: []
          }
          if (pltParam.type == 'select') {
            pltParam.systemParameterItemModels.map((spim, spiIndex) => {
              if (spim.value == pltParam.fieldValue) {
                console.log(pltParam);
                spim.name = pltParam.fieldName;
                paramItem.systemParameterItems[0] = spim;
                //paramItem.value = spim.value;
                workgroupParams.push(spim);
              }
            });
          } else if (pltParam.type == 'MultiSelect') {
            if (pltParam.selectedItems && pltParam.selectedItems.length > 0) {
              paramItem.systemParameterItems = [];
              pltParam.selectedItems.map((selected, selectedIndex) => {
                pltParam.systemParameterItemModels.map((spim, spiIndex) => {
                  if (spim.value == selected) {
                    paramItem.systemParameterItems.push(spim);
                  }
                });
              });
              workgroupParams.push(paramItem);
            }
          } else {
            paramItem.value = pltParam.fieldValue;
            workgroupParams.push(paramItem);
          }
        });
      });
    } else {
      event.fieldsList.map((pltParam, index) => {
        console.log(pltParam);
        var paramItem = {
          name: pltParam.fieldName,
          value: pltParam.fieldValue,
          systemParameterItems: []
        }
        if (pltParam.type == 'select') {
          pltParam.systemParameterItemModels.map((spim, spiIndex) => {
            if (spim.value == pltParam.fieldValue) {
              console.log(pltParam);
              spim.name = pltParam.fieldName;
              paramItem.systemParameterItems[0] = spim;
              //paramItem.value = spim.value;
              workgroupParams.push(spim);
            }
          });
        } else if (pltParam.type == 'MultiSelect') {
          if (pltParam.selectedItems && pltParam.selectedItems.length > 0) {
            paramItem.systemParameterItems = [];
            pltParam.selectedItems.map((selected, selectedIndex) => {
              pltParam.systemParameterItemModels.map((spim, spiIndex) => {
                if (spim.value == selected) {
                  paramItem.systemParameterItems.push(spim);
                }
              });
            });
            workgroupParams.push(paramItem);
          }
        }
        else {
          paramItem.value = pltParam.fieldValue;
          workgroupParams.push(paramItem);
        }
      });
    }

    return workgroupParams;
  } */
}
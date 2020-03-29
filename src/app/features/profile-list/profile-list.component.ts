import { Component, OnInit, Inject, EventEmitter, Input, Output } from '@angular/core';
import { MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ProfileListService } from '@app/features/profile-list/profile-list.service';
import { ProfileModel, RoleModel } from './profile-list.model';
import { Connection } from '@app/features/profile-list/connection.model';
import { UserProfile, WorkgroupList, ProfileAppsList } from '@app/features/profile-list/user-profile.model';
import { forkJoin } from 'rxjs';
import { NotificationService } from '@app/core/services';
import { Title } from '@angular/platform-browser';
import { ProfileUpdate } from '@app/core/store/profile';
import { DataStorageService } from '../task/data-storage.service';
import { SharedService } from '../user-profile/shared/shared.service';
import printJS from 'print-js';

@Component({
  selector: 'sa-profile-list',
  templateUrl: './profile-list.component.html',
  styleUrls: ['./profile-list.component.css']
})
export class ProfileListComponent implements OnInit {
  @Input() isOnlyManageMember: boolean = false;
  public loader = false;
  public taskDetails: any = {};
  public taskDetailsBackup: any = {};
  header: string;
  label: string;
  fieldName: string;
  fieldValue: string;
  editable: false;
  mandatory: false;
  type: string;
  profileList: Array<ProfileModel>;
  editingProfile: ProfileModel;
  tempProfileList: Array<ProfileModel>;
  taskResults: any = [];

  workGroupName: string = '';
  appName: string = '';
  workGroupDescription: string = '';
  createdBy: string = '';
  modifiedBy: string = '';
  createdDate: string = '';
  modifiedDate: string = '';

  gridTotalRecord: number;
  isOuterGridNextEnabled: boolean;
  isInnerPagePreviousEnabled: boolean;
  tablePaginationData: any = [];
  memberTablePaginationData: number[];
  currentPageNumber: number;
  memberCurrentPageNumber: number;
  displayProfileList: Array<ProfileModel> = [];
  public currentPageLimit: number = 10;
  userId: string;
  isSortAsc: boolean = false;
  public profile: string;
  public connections: Connection[] = [];
  public newTempConnectionList: Connection[] = [];
  public connectionsListPerPage: Connection[] = [];
  public filteredConnectionsList: Connection[] = [];
  public userProfile = new UserProfile();
  public applicationList: any[] = ["ASRI", "BPMS", "QMV"];
  public appRoleList: any[] = ["User", "Admin", "SuperAdmin", "OWS-User"];
  public workgroupList: any[] = ["", "BPMS-ASP", "BPMS-CDP", "FD_HOOVER", "CDP", "FDW"];
  public roleList: any[] = ["Task Manager", "BPMS Manager", "QMV Manager", "Admin", "Admin1"];
  public selectedApplication = "Edit Topology";
  public accessList = ["Edit Circuit", "Edit Topology", "Edit Task", "Edit Inventory", "read/write"];
  public selectedAccesses = ["Write"];
  public appName1 = "ASRI";
  public appName2 = "BPMS";
  public appNameList = [];
  public appNameRoleList = [];
  public userRole: string = '';
  public searchDetails: any = {
    headers: [],
    showActions: false
  };
  filterFields: any[] = [];
  filter = [];

  public taskTypeList = ["string1", "string2", "string3"];
  public taskType: string[] = new Array();
  public selectOptions: any;
  public userCuid: string = '';
  public fullName: string = '';
  public email: string = '';
  public phone: string = '';
  public title: string = '';
  public modifiedById: string = '';
  public memberRoles: string = '';
  public isMemberActive: boolean = true;
  public workgroupAccessList: any[];
  public isWorkflowActive: boolean = false
  public isThemeBuilderActive: boolean = false;
  @Output() onProfileDetails = new EventEmitter<string>();
  pagination: any = {};
  paginationLimitOption: number = 1;
  systemParameter:any = {
    from: 'manageUser',
    title: 'Manage User',
    isSortAsc: false,
    globalSearch: ''
  };
  actionButton: any;
  sectionheader: any;
  actionColumn: any;

  constructor(private profileListService: ProfileListService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    public notificationService: NotificationService,
    private dataStorage: DataStorageService,
    private sharedService: SharedService) {
    this.tablePaginationData = [];
    this.memberTablePaginationData = [];
    this.profileList = new Array<ProfileModel>();
    this.tempProfileList = new Array<ProfileModel>();
    this.workgroupAccessList = [];
    this.createHeaders();
    let manageMemberData = this.dataStorage.getData();
    
    this.pagination.currentPageNumber = 1;
    this.pagination.allItems = [];
    this.pagination.pager = {startIndex: 0, endIndex:  this.pagination.selectedLimit - 1};

    if (manageMemberData && manageMemberData.length > 0) {
      this.connections = manageMemberData;
      this.taskResults = this.connections;
      this.connectionsListPerPage = this.connections;
      this.newTempConnectionList = this.connections;
      console.log(this.connectionsListPerPage);

      this.pagination.totalRecords = this.taskResults.length;
      this.pagination.allItems  = this.pagination.allItems.concat(this.taskResults);
    }
  }

  private createHeaders() {
    const allFields = this.dataStorage.getHeadersData();
    console.log(allFields);
    this.pagination = allFields[2].fieldsList[0];
		this.actionButton = allFields[3].fieldsList;
		this.sectionheader = allFields[0].sectionHeader;
    this.actionColumn =  allFields[0].fieldsList;
  
   
    
      this.pagination.selectedLimit = this.pagination.pageLimitOptions[0];
      this.pagination.pageNumber = 0;
      // this.pagination.pageSize = 100;
    const headers = allFields.find((data: any) => data.sectionHeader === "Table Headers");
    if (Object.keys(headers).length !== 0) {
      this.searchDetails.headers = headers.fieldsList.filter(f => f.fieldName !== "actions" && f.display);
      this.searchDetails.showActions = headers.fieldsList.find(f => f.fieldName === "actions").display;
    }
    console.log(this.searchDetails);
    this.pagination = allFields.find((data: any) => data.sectionHeader === "Pagination").fieldsList[0];
    // this.pagination.totalRecords = 99;
    this.paginationLimitOption = parseInt(this.pagination.pageLimitOptions[0]);

    this.filter = [];

    this.systemParameter = {
      ...this.systemParameter,
      sectionheader: this.sectionheader,
      header:this.actionColumn,
      tableData: [] 
    }
  }

  onShowProfileDetails(cuid: string) {
    console.log("Profile view ::::::: ",cuid);
    this.onProfileDetails.emit(cuid);
    
  }
  ngOnInit() {
    //  this.getWorkMateForm();
    let userInfo = JSON.parse(localStorage.getItem('fd_user'));
    this.userId = userInfo['cuid'];
    //debugger;
    this.getConnectedWorkgroups();
    // this.pagination.pageNumber = 1;


    this.loader = true;
    this.selectOptions = {
      multiple: true,
      tags: true
    };

  }
  getConnectedUsers() {

  }

  createNewObj(app) {
    app.workgroupList = [{}];
    app.workgroupList[0].accessList = [];
  }


  // public getUserProfiles(connection, i){
  //   connection.collapsed = !connection.collapsed;
  //   let self = this;
  //   self.loader = true;
  // }

  getWorkgroupList(appName) {
    return this.workgroupList;
  }

  getWorkgroupRoles(appName, workGroupName) {
    return this.roleList;
  }

  addNewWorkGroup(profileApp) {
    // const workgroupList = new WorkgroupList();
    let workgroupList = {
      "name": "",
      "roles": "",
      "accessLevel": []
    }
    profileApp.workgroupList.push(workgroupList);
  }
  onDeleteProfileRow(profile: ProfileModel, index: number) {

  }

  onSaveWorkgroupList(profile, role, wg, index) {
    let workgroupList = [];
    this.loader = true;
    role.workgroupList.map(item => {
      if (item.workgroupName) {
        workgroupList.push({ workgroupName: item.workgroupName, workgroupRole: item.workgroupRole });
      }
    });

    let saveTask = this.connectionsListPerPage[index - 1];
    //debugger;
    let workgroup = {
      cuid: saveTask.userCuid,
      appName: role.profileAppName,
      workgroupList: workgroupList,
      createdById: this.userId
    }
  }

  onProfileSaveClick(profile: ProfileModel, index: number) {
    let newProfile = {
      workgroupName: profile.workgroupName,
      workgroupDesc: profile.workgroupDesc,
      applicationName: profile.appName,
      createdById: this.userId
    }
  }

  onSaveMemberApp(profile, role, index: number) {
    let newApp = {
      appName: role.profileAppName,
      role: role.profileAppRole,
      cuid: profile.userProfile.userCuid
    }
  }
  onProfileditClick(profile: ProfileModel, index: number) {
    profile.isEditing = true;
  }
  onProfileCancelClick(profile: ProfileModel, index: number) {
    if (profile.isNewAppNAmeWorkgroup) {
      if (profile.isIconMinus) {
        this.displayProfileList.splice(index, 2);
      } else {
        this.displayProfileList.splice(index, 2);
      }
    } else {
      profile.isEditing = false;
    }
  }
  onAddNewMemberClick(newprofile) {
    let profile = { profileAppsList: new Array<ProfileAppsList>() };
    let profileelement = {      
userCuid: "", firstName: '', address: '', createdById: '', department: '',
      createdDateTime: '', modifiedById: '', modifiedDateTime: '', fullName: '', profileAppsList: profile.profileAppsList, collapsed: false, isIconMinus: false, isEditing: false, lastName: '', email: '',
      managerId: '', phone: '', title: '', userProfile: new UserProfile(), userRole: 'USER', isNewConnection: true    
};
    this.connectionsListPerPage.splice(0, 0, profileelement);
  }

    printPDF(){
    this.sharedService.printPDF(this.searchDetails.headers,
      this.newTempConnectionList, "Users", "Users");
  }

  printData(){
    printJS({printable:this.newTempConnectionList,
      properties:this.searchDetails.headers.map(header => header.fieldName),
      type:'json'});
  }
  
  onDeleteMemberClick(profile: Connection, index: number) {
      this.notificationService.smartMessageBox(
        {
          title:
            "<i class='fa fa-sign-out txt-color-orangeDark'></i> Confirm <span class='txt-color-orangeDark'></span> ?",
          content:
            "Are  you sure you want to delete this user ::" + profile.userCuid,
          buttons: "[No][Yes]"
        },
        ButtonPressed => {
          if (ButtonPressed == "Yes") {
            let openedWorkgroup = this.connectionsListPerPage[index];
            console.log('profile');
            console.log(profile);
            this.profileListService.deleteProfileUser(profile.id).toPromise().then((response: any) => {
              this.snackBar.open(response.message, "Okay", {
                duration: 15000,
              });
              const deletedUserIndex = this.connections.findIndex((connection: Connection) => {
                return connection.userCuid === profile.userCuid;
              });
              this.connections.splice(deletedUserIndex, 1);
              const pageNumber = this.pagination.pageNumber;
              const data = {page: pageNumber}
              this.handlePagination(this.connections);
              this.pageChanged(data); 
            }).catch((error: any) => {
              this.loader = false;
              console.error(error);
              this.snackBar.open(error.error.message, "Okay", {
                duration: 15000,
              });
            });
          }
        }
      )
  }
  onEditMemberClick(profile: any, index: number) {
    profile.isEditing = true;
  }
  onCancelMemberClick(profile: any, index: number) {
    this.connectionsListPerPage.splice(index, 1);
  }

  onUpdateMemberClick(profile: Connection, index: number) {
    let newProfile = {
      cuid: profile.userCuid,
      role: profile.userRole
    }
  }
  onSaveMemberClick(profile: Connection, index: number) {
    let newProfile = {
      cuid: profile.userCuid,
      createdById: this.userId,
      role: profile.userRole
    }
  }
  updateManageWorkGroupAppNameValue($event, profile, i) {

  }
  onAddNewProfileClick() {
    let profileelement: ProfileModel = {
      id: "P" + this.profileList.length + 1, appName: '', workgroupName: '', workgroupDesc: '', createdById: '',
      createdDateTime: '', modifiedById: '', modifiedDateTime: '', workGroupList: [], isNewAppNAmeWorkgroup: true,
      roleList: [], isRowDetailOpen: false, isIconMinus: false, isEditing: true
    };
    this.displayProfileList.splice(0, 0, profileelement);
  }
  onSaveProfileData(profile: ProfileModel, index: number) {
    this.displayProfileList.map(item => {
      if (profile.id === item.id) {
        item.isEditing = false;
      }
    })
  }
  onSortSelection(columnName: any) {
    if (this.isSortAsc) {
      this.isSortAsc = false;
      this.systemParameter.isSortAsc = false;
      this.connectionsListPerPage.sort(this.sharedService.dynamicSort(columnName));
    } else {
      this.isSortAsc = true;
      this.systemParameter.isSortAsc = true;
      this.connectionsListPerPage.sort(this.sharedService.dynamicSort('-' + columnName));
    }
    this.onPaginateOuterGrid(1);
  }
  
  onInnerSortSelection(columnName: any, profile: any) {
    if (this.isSortAsc) {
      this.isSortAsc = false;
      profile.workGroupList.sort(this.sharedService.dynamicSort(columnName));
      profile.isRowDetailOpen = true;
    } else {
      this.isSortAsc = true;
      profile.workGroupList.sort(this.sharedService.dynamicSort('-' + columnName));
    }
  }
  onRowDetailClick(profile: ProfileModel, index: number) {
    let openedTask = this.displayProfileList[index + 1];
    let profileelement: ProfileModel = {
      id: profile.id + "P" + this.profileList.length + 1, appName: profile.appName, workgroupName: profile.workgroupName, workgroupDesc: profile.workgroupDesc, createdById: profile.createdById,
      createdDateTime: profile.createdDateTime, modifiedById: profile.modifiedById, modifiedDateTime: profile.modifiedDateTime, isNewAppNAmeWorkgroup: false,
      roleList: profile.roleList, isRowDetailOpen: true, isIconMinus: false, isEditing: false, workGroupList: profile.workGroupList
    };
    if (openedTask && openedTask.isRowDetailOpen) {
      profile.isIconMinus = false;
      this.displayProfileList.splice(index + 1, 1);
    } else {
      profile.isIconMinus = true;
      if (profile.appName) {

      } else {
        this.displayProfileList.splice(index + 1, 0, profileelement);
      }
      // }
    }
    //this.onPaginateInnerGrid(1);

  }

  onPaginateOuterGrid(pageNumber: number) {
    if (this.profileList && this.profileList.length > 0) {
      let tempArray = [];
      this.profileList.map((item) => {

        item.isIconMinus = false;
        item.isEditing = false;
        tempArray.push(item);
        ;      
})
      this.displayProfileList = tempArray.splice((pageNumber - 1) * this.currentPageLimit, this.currentPageLimit);
      this.currentPageNumber = pageNumber;
      let pageCount = this.profileList.length % this.currentPageLimit == 0 ? this.profileList.length / this.currentPageLimit :
        this.profileList.length / this.currentPageLimit + 1;
      this.convertNumberToArray(pageCount);
    } else {
      this.displayProfileList = [];
    }
  }

  onPaginateMemberGrid(pageNumber: number) {
    if (this.taskResults && this.taskResults.length > 0) {
      let tempArray = [];
      this.taskResults.map((item) => {
        item.isIconMinus = false;
        item.isEditing = false;
        tempArray.push(item);
        ;      
})
      this.connectionsListPerPage = tempArray.splice((pageNumber - 1) * this.currentPageLimit, this.currentPageLimit);
      this.memberCurrentPageNumber = pageNumber;
      let pageCount = this.taskResults.length % this.currentPageLimit == 0 ? this.taskResults.length / this.currentPageLimit :
        this.taskResults.length / this.currentPageLimit + 1;
      this.pagination.currentPageNumber = this.memberCurrentPageNumber;
      pageCount = Math.ceil(this.taskResults.length / this.currentPageLimit); 
      this.convertMemberPageNumberToArray(pageCount);
      this.convertNumberToArray(pageCount);
    } else {
      this.connectionsListPerPage = [];
    }
  }
  convertNumberToArray(count: number) {
    this.pagination.totalPage = count;
    this.tablePaginationData = [];
    for (let i = 1; i <= count; i++) {
      this.tablePaginationData.push(i);
    }
  }
  convertMemberPageNumberToArray(count: number) {
    this.memberTablePaginationData = [];
    for (let i = 1; i <= count; i++) {
      this.memberTablePaginationData.push(i);
    }
  }
  onGridNext() {
    if (this.memberCurrentPageNumber < this.tablePaginationData.length) {
      this.currentPageNumber += 1;
      this.memberCurrentPageNumber += 1;
      // this.onPaginateOuterGrid(this.currentPageNumber);
      this.onPaginateMemberGrid(this.memberCurrentPageNumber);
    }
  }
  onGridPrevious() {
    if (this.memberCurrentPageNumber != 0) {
      this.currentPageNumber -= 1;
      this.memberCurrentPageNumber -= 1;
      // this.onPaginateOuterGrid(this.currentPageNumber);
      this.onPaginateMemberGrid(this.memberCurrentPageNumber);
    }
  }
  onMemberGridNext() {
    if (this.memberCurrentPageNumber < this.memberTablePaginationData.length) {
      this.memberCurrentPageNumber += 1;
      this.onPaginateMemberGrid(this.memberCurrentPageNumber);
    }
  }
  onMemberGridPrevious() {
    if (this.memberCurrentPageNumber != 1) {
      this.memberCurrentPageNumber -= 1;
      this.onPaginateMemberGrid(this.memberCurrentPageNumber);
    }
  }
  deleteAssociatedUserApp(role: any, roleIndex: any, profile: any) {
    this.notificationService.smartMessageBox(
      {
        title:
          "<i class='fa fa-sign-out txt-color-orangeDark'></i> Confirm <span class='txt-color-orangeDark'></span> ?",
        content:
          "Are  you sure you want to delete this item.",
        buttons: "[No][Yes]"
      },
      ButtonPressed => {
        if (ButtonPressed == "Yes") {
        }
      }
    );

  }
  saveAssociatedUserApp(role: any, i: any, profile: any) {
    let tempProfile = this.connectionsListPerPage[i - 1];
    let workgroup = {
      cuid: tempProfile.userCuid,
      appList: [
        {
          applicationName: role.profileAppName,
          applicationRole: role.profileAppRole
        }
      ],
      createdById: this.userId
    }
  }
  editAssociatedUserApp(role: any, i: any, profile: any) {
    //debugger;
    role.isEditing = true;
  }
  cancelAssociatedUserApp(role: any, i: any, profile: any) {
    if (role.isNewProfileApp) {
      profile.userProfile.profileAppsList.splice(i, 1);
    } else {
      role.isEditing = false;
    }
  }
  onWorkgroupSaveClick(roleModel: RoleModel, index: number, profile: ProfileModel) {
    let workgroup = {
      workgroupName: profile.workgroupName,
      workgroupRole: roleModel.roleName,
      // accessList: [{
      //   accessModule: roleModel.accessModule,
      //   accessName: roleModel.accessName,
      //   accessValue: roleModel.accessValue,
      //   createdById: this.userId
      // }
      // ]

    }
    let awg = {
      appName: profile.appName,
      workgroupName: profile.workgroupName,
      roleName: roleModel.roleName,
      roleDesc: "test desc",
      createdById: this.userId
    }
    // this.profileListService.associateWorkgroupRoleAccess(workgroup).toPromise().then((data: any)=>{
    //   //profile.userCuid = 
    //   console.log(data);
    // });

    roleModel.isEditing = false;

  }
  onWorkgroupCancelClick(roleModel: RoleModel, index: number, profile: ProfileModel) {
    if (roleModel.isNewRole) {
      profile.roleList.splice(index, 1);
    } else {
      roleModel.isEditing = false;
    }
  }
  onWorkgroupEditClick(roleModel: RoleModel, index: number, profile: ProfileModel) {
    roleModel.isEditing = true;
  }



  deleteWorkgroupRole(profile, roleModel: RoleModel, index: number, id: string) {
    this.notificationService.smartMessageBox(
      {
        title:
          "<i class='fa fa-sign-out txt-color-orangeDark'></i> Confirm <span class='txt-color-orangeDark'></span> ?",
        content:
          "Are  you sure you want to delete this item.",
        buttons: "[No][Yes]"
      },
      ButtonPressed => {
        if (ButtonPressed == "Yes") {
          this.displayProfileList.map(item => {
            if (item.id && item.id === id) {
              let role = item.roleList[index];
            }
          });
        }
      }
    );

  }
  updateProfileAppNameRoleValue(event, role, profile, i) {
    //role.profileAppRole = event.target.value;                
  }
  updateWorkgroupAccessNameValue(event, access, role, i) {
    if (event) {
      this.workgroupAccessList.map(item => {
        if (item.accessLevelName == event.target.value) {
          access.accessValue = item.accessLevelValue;
          access.accessModule = item.accessLevelModule;
        }
      })
    }

  }
  updateValueAppRole(event, cell, role) {
    role.profileAppRole = event.target.value;
  }
  onMemberRoleUpdateValue(event, profile, i) {
    profile.userRole = event.target.value;
  }
  updateValue(event, cell, id: string, index: number) {
    this.displayProfileList.map(item => {
      //debugger;
      if (id === item.id) {
        let role = item.workGroupList[index];
        if (cell == 'notes') {
          role.accessName = event.target.value;
        } else if (cell == 'search') {
          role.accessValue = event.target.value;
        }
        item.workGroupList[index] = role;
      }
    });
  }
  updateRoleDropDownValue(event, role, wg, profile, i) {
    this.loader = true;
    //debugger;    
  }
  updateMemberWorkgroupRole(event, role, wg, profile, i) {
    let updateworkgroupAccessData = {
      cuid: profile.userProfile.userCuid,
      appName: role.profileAppName,
      workgroupName: wg.workgroupName,
      workgroupRole: wg.workgroupRole
    }
  }
  onDeleteWorkgroupRow(profile, role, wg, wgIndex) {
    //this.loader = true;
    this.notificationService.smartMessageBox(
      {
        title:
          "<i class='fa fa-sign-out txt-color-orangeDark'></i> Confirm <span class='txt-color-orangeDark'></span> ?",
        content:
          "Are  you sure you want to delete this item.",
        buttons: "[No][Yes]"
      },
      ButtonPressed => {
        if (ButtonPressed == "Yes") {

        }
      }
    );
  }
  onEditWorkgroupRow(profile, role, wg, wgIndex) {
    // this.loader = true;   
    wg.isEditing = true;
  }
  onSaveWorkgroupRow(profile, role, wg, wgIndex) {
    // this.loader = true;
    wg.isEditing = false;
  }
  onCancelWorkgroupRow(profile, role, wg, wgIndex) {
    // this.loader = true;
    if (!wg.isAddNewWorkgroup) {
      wg.isEditing = false;
    } else {
      role.workgroupList.splice(wgIndex, 1);
    }
  }
  onNavigateToManageWorkgroup(role, memberProfile, wg) {
    this.isMemberActive = false;
    this.isThemeBuilderActive = false;
    this.isWorkflowActive = true;
    let item = null;
    let itemIndex = 0;
    let index = this.profileList.findIndex(p => p.workgroupName == wg.workgroupName && p.appName == role.profileAppName);
    this.profileList.map((profileItem, currentIndex) => {
      if (profileItem.workgroupName == wg.workgroupName && profileItem.appName == role.profileAppName && !profileItem.isIconMinus) {
        item = profileItem;
        itemIndex = currentIndex;
      }
    });
    this.profileList.splice(itemIndex, 1);
    this.onPaginateOuterGrid(1);
    if (item != null && wg.workgroupName == item.workgroupName && role.profileAppName == item.appName && !item.isIconMinus) {
      let profile = item;
      let openedTask = this.displayProfileList[index + 1];
      let profileelement: ProfileModel = {        
id: profile.id + "P" + this.profileList.length + 1, appName: profile.appName, workgroupName: profile.workgroupName, workgroupDesc: profile.workgroupDesc, createdById: profile.createdById,
        createdDateTime: profile.createdDateTime, modifiedById: profile.modifiedById, modifiedDateTime: profile.modifiedDateTime, isNewAppNAmeWorkgroup: true,
        roleList: profile.roleList, isRowDetailOpen: true, isIconMinus: false, isEditing: false, workGroupList: profile.workGroupList      
};
      profile.isIconMinus = true;
      if (profile.appName) {
      } else {
        this.displayProfileList.splice(index + 1, 0, profileelement);
      }
    } else {

    }
  }
  onSelectMembersTab() {
    this.isMemberActive = true;
    this.isThemeBuilderActive = false;
    this.isWorkflowActive = false;
  }
  onSelectWorkgroupTab() {
    this.isMemberActive = false;
    this.isThemeBuilderActive = false;
    this.isWorkflowActive = true;
  }

  onSelectThemeBuilderTab() {
    this.isThemeBuilderActive = true;
    this.isMemberActive = false;
    this.isWorkflowActive = false;
  }
  handlePagination(list: Connection[]) {
    const fullList: Connection[] = [...list];
    const pagination = this.sharedService.handlePagination(fullList, this.paginationLimitOption);
    this.connectionsListPerPage = pagination.listPerPage;
    this.pagination = {...this.pagination, ...pagination};
  }


  pageChanged(data: any) {
    const list = (this.filteredConnectionsList.length !== 0) ? this.filteredConnectionsList :
      this.connections;
    if (this.pagination.totalPage < data) {
      data--;
    }
    const startIndex = (data - 1) * this.paginationLimitOption;
    const endIndex = startIndex + this.paginationLimitOption;
    // this.pagination.pageNumber = data;
    this.pagination.currentPageNumber = data;
    this.memberCurrentPageNumber = data;
    this.connectionsListPerPage = list.slice(startIndex, endIndex);
  }

  paginationChange(option: any) {
		// this.pagination.pageNumber = 1;
    // this.pagination.totalRecords = this.connections.length;
    this.paginationLimitOption = parseInt(option);
    this.connectionsListPerPage = this.taskResults.slice(0, this.paginationLimitOption);
    this.pagination.totalPage = Math.ceil(this.taskResults.length / this.paginationLimitOption);
    this.convertMemberPageNumberToArray(this.pagination.totalPage);
    this.convertNumberToArray(this.pagination.totalPage);
	}

  onSortSelectionConnection(columnName: any) {
    // check if connections are filtered, sort out filtered connections only
    const list = (this.filteredConnectionsList.length !== 0) ? this.filteredConnectionsList :
      this.connections;
    this.sharedService.sortData(list, this.isSortAsc, columnName);
    this.isSortAsc = !this.isSortAsc;
    this.handlePagination(list);
  }

  filterTaskResultConnection(fieldName: string, criteriaValue: string) {
    let list: Connection[] = [...this.connections];
    if (this.filterFields.length === 0) {
      this.filterFields = this.searchDetails.headers.map((h: any) => {
        return { key: h.fieldName, value: "" }
      });
    }
    const data = {
      list, fieldName, criteriaValue, 
      filterFields: this.filterFields, 
      filterCleared: false
    }
    this.sharedService.filterData(data);
    this.filteredConnectionsList = (data.filterCleared) ? this.connections : data.list;
    this.handlePagination(data.list);
  }
  filterTaskResult(columnName: string) {
    let workGroupName = this.workGroupName.toLowerCase();
    let appName = this.appName.toLowerCase();
    let workGroupDescription = this.workGroupDescription.toLowerCase();
    let createdBy = this.createdBy.toLowerCase();
    let modifiedBy = this.modifiedBy.toLowerCase();
    let createdDate = this.createdDate.toLowerCase();
    let modifiedDate = this.modifiedDate.toLowerCase();;
    //debugger;
    const temp = this.tempProfileList.filter(function(item) {
      if ((!workGroupName || item.workgroupName.toLowerCase().indexOf(workGroupName) !== -1)
        && (!workGroupDescription || item.workgroupDesc && item.workgroupDesc.toLowerCase().indexOf(workGroupDescription) != -1) &&
        (!createdBy || item.createdById && item.createdById.toLowerCase().indexOf(createdBy) != -1) &&
        (!appName || item.appName && item.appName.toLowerCase().indexOf(appName) != -1) &&
        (!modifiedBy || item.modifiedById && item.modifiedById.toLowerCase().indexOf(modifiedBy) != -1) &&
        (!createdDate || item.createdDateTime && item.createdDateTime.toLowerCase().indexOf(createdDate) != -1) &&
        (!modifiedDate || item.modifiedDateTime.toString() && item.modifiedDateTime.toString().toLowerCase().indexOf(modifiedDate) != -1)) {
        return true;
      } else {
        return false;
      }
    });
    this.profileList = temp;
    this.onPaginateOuterGrid(1);
  }
  filterUserTaskResult(columnName){
    let thi = this;
    // console.log(thi);
    // console.log(this.systemParameter.globalSearch);
    // console.log(this.searchDetails.headers);
    const globalSearch = this.systemParameter.globalSearch;
    const header = this.searchDetails.headers;
    let temp: any;
    if (globalSearch !== '') {
      temp = this.connections.filter(row => {
				var result = {};
				for (var key in row) {
          // console.log(row[key]);
					if (row.hasOwnProperty(key) && row[key] && row[key].toUpperCase().indexOf(globalSearch.toUpperCase()) !== -1) {
							result[key] = row[key];
					}
				}
				if (Object.keys(result).length == 0) {
						return false;
					} else {
						return true;
					}
			});
    } else {
      temp = this.connections.filter(function(item) {
        let flag = true;
        Object.keys(item).forEach((element) => {
          // console.log(thi.actionColumn[element], item[element]);
          if(flag && header[element] && item[element] && header[element] != "") {
            if(flag && item[element].toLowerCase().indexOf(header[element].toLowerCase()) === -1) {
              flag = false;
            }
          }
        });
        return flag;
      });
    }
    

    this.taskResults =  temp;
    // let pageCount = this.connectionsListPerPage.length % this.currentPageLimit == 0 ? this.connectionsListPerPage.length / this.currentPageLimit :
    // this.connectionsListPerPage.length / this.currentPageLimit + 1;
    // this.pagination.currentPageNumber = this.memberCurrentPageNumber;
    // this.convertMemberPageNumberToArray(pageCount);
    // this.convertNumberToArray(pageCount);
    this.onPaginateMemberGrid(1);
  }
  onAddNewWorkgroupAccessList(role, profile, i) {
    role.accessList.push({ accessName: '', accessValue: '' });
  }

  onSaveNewWorkgroupAccessList(role, profile, access, i) {
    let workgroupAccessList = [];
    //let accessItem = role.accessList[role.accessList.length - 1];
    //role.accessList.map((item)=>{
    workgroupAccessList.push({ accessModule: "", accessName: access.accessName, accessValue: "" });
    //});
    let accessList = {
      workgroupName: profile.workgroupName,
      appName: profile.appName,
      workgroupRole: role.roleName,
      accessList: workgroupAccessList,
      createdById: this.userId
    }
  }
  onDeleteNewWorkgroupAccessList(role, profile, access, accessIndex) {
    this.notificationService.smartMessageBox(
      {
        title:
          "<i class='fa fa-sign-out txt-color-orangeDark'></i> Confirm <span class='txt-color-orangeDark'></span> ?",
        content:
          "Are  you sure you want to delete this item.",
        buttons: "[No][Yes]"
      },
      ButtonPressed => {
        if (ButtonPressed == "Yes") {

        }
      }
    );
  }
  onAddNewProfileAppsClick(profile: any, index: number) {
    // let workgroup = {
    //   accessList:[],
    //   workgroupName:'',
    //   workgroupRole:''
    // }
    let profileApp = {
      profileAppName: '',
      profileAppRole: '',
      workgroupList: [],
      workgroupDropDownList: [],
      roleListDropDownList: [],
      accessListDropDownList: [],
      isEditing: false,
      isNewProfileApp: true
    }
    if (profile.userProfile && profile.userProfile.profileAppsList) {
      profile.userProfile.profileAppsList.push(profileApp);
    } else {
      profile.userProfile = new Connection();
      profile.userProfile.profileAppsList = [];
      profile.userProfile.profileAppsList.push(profileApp);
    }
  }

  onAddNewRoleClick(profile: ProfileModel, id: string) {
    this.displayProfileList.map(item => {
      if (item.id === id) {
        let roleModel: RoleModel = {
          id: item.id + "R" + item.roleList.length + 1,
          roleName: '',
          accessValue: '',
          accessModule: '',
          accessName: '',
          isEditing: true,
          isSameRoleData: false,
          accessList: [],
          isNewRole: true
        }
        item.roleList.push(roleModel);
      }
    });
  }

  onNewWorkgroupAdd(profile: any, role: any, wg: any, wgIndex: any) {
    if (profile.userProfile && profile.userProfile.profileAppsList) {
      if (role.workgroupList) {
        role.workgroupList.push({ workgroupName: '', workgroupRole: '', accessList: [], isEditing: true, isAddNewWorkgroup: true });
        // .map(item=>{
        //   if(item.accessList) {
        //     let tempAccessList = [];
        //     item.accessList.forEach(access => {
        //       tempAccessList.push(access);
        //     })
        //     tempAccessList.push('');
        //     item.accessList = tempAccessList;
        //   }
        // });
      }
      //wg.push('stringwa');
    }
  }

  onConnectionDetailOpen(profile: any, index) {
    let openedTask = this.connectionsListPerPage[index + 1];
    let profileelement = {
      userCuid: profile.userCuid + "P" + this.connections.length + 1, firstName: profile.firstName, address: profile.address, createdById: profile.createdById, department: profile.department,
      createdDateTime: profile.createdDateTime, modifiedById: profile.modifiedById, modifiedDateTime: profile.modifiedDateTime,
      fullName: profile.fullName, collapsed: true, isIconMinus: false, isEditing: false, lastName: profile.lastName, profileAppsList: profile.profileAppsList, email: profile.email,
      managerId: profile.managerId, phone: profile.phone, title: profile.title, userProfile: profile.userProfile, userRole: profile.userRole, isNewConnection: false
    };
    if (openedTask && openedTask.collapsed) {
      profile.isIconMinus = false;
      this.connectionsListPerPage.splice(index + 1, 1);
    } else {
      //this.getUserProfiles(profile,index);
      this.loader = true;
      profile.isIconMinus = true;
      if (profile.userCuid) {

        this.connectionsListPerPage.splice(index + 1, 0, profileelement);

      } else {
        this.connectionsListPerPage.splice(index + 1, 0, profileelement);
      }
      // }
    }
    //this.onPaginateInnerGrid(1);

  }
  public workgroups = {
    "ajax": 'assets/api/project-workgroup-list.json',
    //  "ajax": 'https://api.myjson.com/bins/hgy8w',
    "iDisplayLength": 15,
    "columns": [
      {
        "class": 'details-control',
        "orderable": false,
        "data": null,
        "defaultContent": ''
      },
      { "data": "name" },
      { "data": "description" },
      { "data": "createdBy" },
      { "data": "modifiedBy" },
      { "data": "createdDate" },
      { "data": "modifiedDate" }
    ],
    "order": [[1, 'asc']]
  }
  public options = {
    "ajax": 'assets/api/project-list.json',
    //  "ajax": 'https://api.myjson.com/bins/hgy8w',
    "iDisplayLength": 15,
    "columns": [
      {
        "class": 'details-control',
        "orderable": false,
        "data": null,
        "defaultContent": ''
      },
      { "data": "profilename" },
      { "data": "status" },
      { "data": "starts" },
      { "data": "ends" },
      { "data": "projects" }
    ],
    "order": [[1, 'asc']]
  }

  public detailsFormat(d) {

    return `<table cell-padding="5" cell-spacing="0" border="0" class="table table-hover table-condensed">
            <tbody><tr>
                <td style="width:100px">Application:</td>
                <td>${d.application}</td>
            </tr>
            <tr>
                <td>Work groups:</td>
                <td>${d.workgroups}</td>
            </tr>
            <tr>
                <td>Roles:</td>
                <td>${d.roles}</td>
            </tr>
            <tr>
                <td>Access Levels:</td>
                <td>${d.accesslevels}</td>
            </tr>
            <tr>
                <td>Action:</td>
                <td>${d.action}</td>
            </tr>
            </tbody>
        </table>`
  }
  getWorkMateForm() {
    this.loader = true;
    this.profileListService.getWorkMateForm().toPromise().then((response: any) => {
      this.loader = false;
      this.taskDetails = response;
      this.populateValuesForLookup();
      this.taskDetails.taskSpecificFieldsList = [];
      this.taskDetailsBackup = JSON.parse(JSON.stringify(this.taskDetails));
    }).catch((error: any) => {
      this.loader = false;
      console.error(error);
      this.snackBar.open("Error loading Task Details..", "Okay", {
        duration: 15000,
      });
    });
  }

  populateValuesForLookup() {
    this.taskDetails.taskCommonFields.fieldList.forEach(field => {
      if (field.type === 'lookup') {
        this.profileListService.getDropDownValues(field.service).toPromise().then((response: any) => {
          field.dropdownList = response;
        });

      }
    })
  }

  getConnectedWorkgroups() {
    this.loader = true;
    // this.pagination.totalRecords = this.connections.length;
    this.pagination.totalPage = Math.ceil(this.connections.length / this.paginationLimitOption);
    this.connectionsListPerPage = this.connections.slice(0, this.paginationLimitOption);
    // this.profileListService.createWorkMateTask(this.taskDetails);
  }

  reset() {
    this.taskDetails = JSON.parse(JSON.stringify(this.taskDetailsBackup));
    this.populateValuesForLookup();
  }

  addAttribute(index) {
    this.taskDetails.taskCommonFields.fieldList.splice(index + 1, 0, this.taskDetails.taskCommonFields.fieldList[index]);
  }



}
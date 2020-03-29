import { Component, OnInit, Input, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ProfileListService } from '@app/features/profile-list/profile-list.service';
import { MatSnackBar } from '@angular/material';
import { NotificationService } from '@app/core/services';
import { TaskService } from '../../task/task.service';
import { isObject, isArray } from 'util';
import { AuditLog } from '@app/core/store/auditlog/AuditLog';
import { UserProfileService } from '../../user-profile/user-profile.service';
import { AppService } from '../../../app.service';
import { TabService } from '@app/core/tab/tab-service';
import { async } from '@angular/core/testing';

@Component({
  selector: 'sa-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.css']
})
export class ProfileInfoComponent implements OnInit {
  tabList: Array<ProfileTabInfo>;
  public loader = false;
  default: any = {
    usercuid: '',
    defaultTab: 'dashboard',
    selectedTheme: 'theme4'
  };
  defaultValue: any = {
    defaultTab: [],
    selectedTheme: []
  };
  userInfo: any;
  preference: any;
  @Input() userId: string = null;
  // @Input()
  // set getCuid(name: string) {
  //   this.userId = (name);
  // }
  getCuid;
  currentAppUnSelectedVal: any;
  currentAppSelectedVal: any;
  currentSkillUnSelectedVal: any;
  currentSkillSelectedVal: any;
  currentWorkgroupUnSelectedVal: any;
  currentWorkgroupSelectedVal: any;
  currentWorkgroupRoleUnSelectedVal: any;
  currentWorkgroupRoleSelectedVal: any;
  profileData: any;

  selectedAppList: Array<string>;
  unSelectedAppList: Array<string>;

  selectedSkillList: Array<string>;
  unSelectedSkillList: Array<string>;
  selectedSkillText: string;

  selectedWorkgroupList: Array<string>;
  unSelectedWorkgroupList: Array<string>;
  selectedWorkgroupText: string;
  userProfileData: any;
  loggedInUserId: string;
  RemoveSelectedWorkGroup: any = [];
  RemoveSelectedWorkGroupRole: any = [];

  allWorkgroupRolesMapping: Array<any>;
  selectedWorkgroupRoleList: Array<string>;
  unSelectedWorkgroupRoleList: Array<string>;
  selectedWorkgroupRoleText: string;
  employeeHierarchy: any;
  personalInfoKey: any;
  paramModelKey: any = [];
  paramsModelKey: any = [];
  functionNames = {};
  userDetails;

  groupData = {};
  IsSuccess = false;
  IsError = false;
  message = '';
  ec: any;
  ParamTextboxValue: any;
  options: any;
  private fl3Values = ["Large Business", "Residence", "Small Business", "Wholesale"];

  @Input() editingProfileDetail: any = null;
  @Input() paramfieldstatus: any = true;
  permissionType: any;
  divlist: any;
  getUserData;
  // paramfieldstatus = true;

  public pageLayout = {};

  public profilePageLayout = {

  };  
  resourceLayout: any = {};
  resourceLayoutResp: any = [];
  roles: any=[];
  authorizations: any=[];
  appSecure : any=[]
  show: boolean = true;
  pagination: any = {};
	actionButton:any = [];
  actionColumn:any = [];
  sectionheader = '';
  profileInfo:any = {
    from: 'profileInfo',
    title: 'Profile Info',
    isSortAsc: false,
    globalSearch: ''
};
filter = {};
response: any =[];
//Profile
	tablePaginationData = [];
	actions = [];
	loaderSystemParameters = true;
  currentPageNumber:number;
  exportValues : any[];
//end
  constructor(private profileListService: ProfileListService,private userProfileService: UserProfileService,
    public notificationService: NotificationService, public _ref: ChangeDetectorRef,
    private snackBar: MatSnackBar,private taskService: TaskService, public utility: AppService, private tabService:TabService) {
    this.userInfo = {};
    this.tabList = new Array<ProfileTabInfo>();
     this.getUserData = this.tabService.tabs;
     this.getCuid = this.getUserData[0].tabData["requiredData"];
     if(this.getCuid){
      this.loggedInUserId = this.getCuid;      
      // this.profileListService.getMnetUserInfo(this.getCuid).toPromise().then((response:any)=>{     
      //   console.log(response)   
      // });
     }
  }

  val() {
    return 'defaultTab';
  }

  async fetchDetails(userData) {
    // await this.taskService.callGetUrl('/Resource/GetResource/' + userData['cuid']).toPromise().then(async (resp) => {
    // console.log("Profile Data : ", resp); 
   this.profileData = userData;
   this.profileData['userPreference'] = userData.appsList.find(app => app.appName === "FlightDeck").userPreference;
    if (this.profileData['userPreference']) {
      this.profileData['userPreference'] = JSON.parse(this.profileData['userPreference']);
    } else {
      this.profileData['userPreference'] = {
        "defaultTab": "FIRST LEVEL; FLIGHTDECK",
        "selectedTheme": "century-link",
        "layoutOptions": []
      }
    }

    try {
      if (this.pageLayout['pageLayoutTemplate'] != undefined) {
        const TabData = this.pageLayout['pageLayoutTemplate'].filter((x) => x.sectionHeader == 'Tabs');
        const ParamsData = TabData[0]['fieldsList'].filter((x) => x.fieldName == 'Params');
        // console.log(ParamsData[0].data);
        this.personalInfoKey = Object.keys(this.profileData);
        this.paramModelKey = this.profileData['params'];

        ParamsData[0].data.forEach(element => {
          console.log(this.paramModelKey.filter((x) => x.name == element.label));
          const Data = this.paramModelKey.filter((x) => x.name == element.label);
          let value: any;
          if (Data.length == 1) {
            value = Data[0].value;
          } else {
            value = Data.map((data) => {
              return data.value;
            });
          }
          this.paramsModelKey.push({ "name": element.label, "value": value });
          if (!isObject(this.paramModelKey.find((x) => x.name == element.label))) {
            this.paramModelKey.push({ "name": element.label, "value": "" });
          }
        });
        console.log("Data ", this.paramsModelKey);
      } else {
        this.loader = true;
        this.taskService.callGetUrl('/PageLayoutTemplate/Get/Profile').toPromise().then(async (resp) => {
          this.pageLayout = resp;

          const TabData = this.pageLayout['pageLayoutTemplate'].filter((x) => x.sectionHeader == 'Tabs');
          const ParamsData = TabData[0]['fieldsList'].filter((x) => x.fieldName == 'Params');

          this.personalInfoKey = Object.keys(this.profileData);
          this.paramModelKey = this.profileData['params'];
          ParamsData[0].data.forEach(element => {
            if (!isObject(this.paramModelKey.find((x) => x.name == element.label))) {
              this.paramModelKey.push({ "name": element.label, "value": "" });
            }
          });
        
          console.log("PageLayout", this.pageLayout);
          this.loader = false;
        });
      }
    } catch (error) {
      console.log(error);
    }
    
    console.log("paramModelKey", this.paramModelKey);
    
    if (this.profileData['appsList'] && this.profileData['appsList'].length > 0) {
      this.groupData['appList'] = this.profileData['appsList'].map((app) => {
        return app.appName;
      });
    }

    if (this.profileData['workgroupsList'] && this.profileData['workgroupsList'].length > 0) {
     this.groupData['workgroupList'] = this.profileData['workgroupsList'].map((data) => {
        console.log(data.name);
        return data.name;
      });
    }

  //Roles and Access Points from App Secure
   this.appSecure = this.profileData['appSecure'];
   this.roles = this.appSecure['roles'];
   this.authorizations = this.appSecure['authorizations']; 

   this.groupData['workgroupRoleList'] = [];
   this.roles.filterData = this.roles;
   this.authorizations.filterData = this.authorizations;   
    this.getMNetUser(userData.cuid);
   //this.profileListService.getMnetUserInfo(userData['cuid']).toPromise().then((response: any) => {
   
   // });
   // this.getUserProfile();

   this.userProfileService.getPageLayout('Workgroup_Role_AccessPoint_Table').toPromise().then(res => {
    var response: any = res;
    this.pagination = response.pageLayoutTemplate[1].fieldsList[0];
    this.pagination.selectedLimit = 10;
    /* if (localStorage.systemParameterPerPage) {
      this.pagination.selectedLimit = localStorage.systemParameterPerPage;
    } */
    this.actionButton = response.pageLayoutTemplate[2].fieldsList;
    this.sectionheader = response.pageLayoutTemplate[0].sectionHeader
    //this.actionColumn =  response.pageLayoutTemplate[3].fieldsList

    this.pagination.currentPageNumber = 1;
    this.pagination.allItems = [];
    this.pagination.pager = {startIndex: 0, endIndex:  this.pagination.selectedLimit - 1};
    response.pageLayoutTemplate[2].fieldsList.forEach(row => {
            if(row['fieldName'] =="Export")
            this.exportValues = row['fieldValue'];
          });
    this.getProfileInfo(response.pageLayoutTemplate[0].sectionHeader, response.pageLayoutTemplate[0].fieldsList, this.actionColumn);
  }).catch(error => { });
  this.filter = {};


  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    //this.subscription.unsubscribe();
}
 async ngOnInit() {
    this.loader = true;
    this.options = {
      multiple: true,
      tags: true
    };
     if(this.getCuid){
      this.loggedInUserId = this.getCuid
     }
    else{let userInfo = JSON.parse(localStorage.getItem('fd_user'));
    console.log("USERINFO>>>>>", userInfo);
     this.loggedInUserId = userInfo['cuid'];
    }
    if (this.editingProfileDetail && this.editingProfileDetail.id) {
      this.default.usercuid = JSON.parse(localStorage.fd_user).cuid;
      this.taskService
        .userPreference(this.editingProfileDetail.id)
        .subscribe(
          result => {
            // console.log("Result ===>> ", result);
            this.preference = result;
          },
          error => {
            this.IsError = true;
            this.message = "No Data Found";
            setTimeout(() => {
              this.IsError = false;
            }, 15000);
            // this.snackBar.open('No Data Found', 'Okay', {
            //   duration: 15000
            // });
          }
        );
    }
    // Fetch user profile info here
    //this.getUserProfile();

    // Tab details
    this.tabList = [
      {
        tabId: 'tab01',
        tabName: 'User Preferences',
        isWorkflowActive: false,
        data: {}
      },
      {
        tabId: 'tab02',
        tabName: 'Manager Hierarchy',
        isWorkflowActive: true,
        data: {}
      },
      {
        tabId: 'tab03',
        tabName: 'Workgroups',
        isWorkflowActive: false,
        data: {}
      },
      {
        tabId: 'tab04',
        tabName: 'Skills',
        isWorkflowActive: false,
        data: {}
      },
      {
        tabId: 'tab05',
        tabName: 'Applications',
        isWorkflowActive: false,
        data: {}
      }
    ];

    this.selectedAppList = [];
    // this.unSelectedSkillList = ["Skill1","Skill2","Skill3","Skill4","Skill5"];
    this.selectedSkillList = [];
    this.unSelectedWorkgroupRoleList = [];

    // this.unSelectedWorkgroupList = ["Workgroup1","Workgroup2","Workgroup3","Workgroup4","Workgroup5"];
    this.selectedWorkgroupList = [];

    // this.unSelectedWorkgroupRoleList = ["WorkgroupRole1","WorkgroupRole2","WorkgroupRole3","WorkgroupRole4","WorkgroupRole5"];
    this.selectedWorkgroupRoleList = [];

    // console.log("editingProfileDetail27 ==> ", this.editingProfileDetail);
    await this.taskService.callGetUrl('/PageLayoutTemplate/Get/Profile').toPromise().then(async (resp) => {
      this.pageLayout = resp;
      for (let i = 0; i < this.pageLayout['pageLayoutTemplate'].length; i++) {
        const SectionData = this.pageLayout['pageLayoutTemplate'][i];
        if (SectionData.sectionHeader == 'Tabs') {
          for (let j = 0; j < SectionData.fieldsList.length; j++) {
            const TabsData = this.pageLayout['pageLayoutTemplate'][i]['fieldsList'][j];
            if (TabsData.fieldName == 'Params') {
              for (let k = 0; k < TabsData.data.length; k++) {
                const TabParamData = this.pageLayout['pageLayoutTemplate'][i]['fieldsList'][j]['data'][k];
                if (TabParamData.systemParameterType == 'Routing Parameters') {
                  await this.taskService.GetUserProfileSystemParameterItem(TabParamData.systemParameterName, TabParamData.systemParameterType).toPromise().then((respsys) => {
                    // this.pageLayout['pageLayoutTemplate'][i]['fieldsList'][j]['data'][k]['ListOfValue']
                    respsys['systemParameterItem'].forEach(element => {
                      this.pageLayout['pageLayoutTemplate'][i]['fieldsList'][j]['data'][k]['ListOfValue'].push(element);
                      this.pageLayout['pageLayoutTemplate'][i]['fieldsList'][j]['data'][k]['OptionValue'].push(element.value);
                    });
                    this._ref.detectChanges();
                  });
                }
              }
            }
          }
        }
      }
      // this.pageLayout = resp;
      console.log(resp);
      this._ref.detectChanges();
    });
    this.onGetUsers();

    // console.log("editingProfileDetail28 ==> ", this.editingProfileDetail);  
  }

  onDropDownClick($event, elem, parentElem) {   
    console.log("elem", parentElem);
    console.log("elem.label ==> ", elem.label);
    switch (elem.label) {
      case "Available Workgroup":
        break;
      case "User Workgroup":
        this.onUnselectedWorkgroupDropdownClick(null, true);
        break;

      case "Available Workgroup Roles":
        break;

      case "User Workgroup Roles":
        break;

    }
  }

  getEmployeeHierarchy(userId) {
    this.profileListService
      .getEmployeeHierarchy(userId)
      .toPromise()
      .then((res: any) => {
        const colors = [
          '#7c2faf',
          '#d8cb36',
          '#a2d836',
          '#93193b',
          '#84311d',
          '#726b6a',
          '#141414',
          '#d15321',
          '#514b42',
          '#baa687',
          '#603e08',
          '#e5c929',
          '#877616',
          '#c1b157',
          '#afce16',
          '#427f01',
          '#899978',
          '#567732',
          '#142811',
          '#142811',
          '#91e0af',
          '#289175',
          '#556661',
          '#11949b',
          '#b1cfd1',
          '#8e84c9',
          '#8370ef',
          '#1a114c',
          '#110d26',
          '#857989',
          '#110714',
          '#0a010c',
          '#0f0d0f',
          '#b27eb2',
          '#635963',
          '#750c12',
          '#ea4444',
          '#4c0d0d',
          '#0c0000',
          '#edb8bb',
          '#7a4a4d',
          '#5b1d21',
          '#a8010b'
        ];

        let basePadding = 30;
        let baseMargin = 80;
        let defaultTop = basePadding - 20;
        const updatedResponse =
          res &&
          res.empList.map((data: any, i: number) => {
            let randomIndex = Math.floor(Math.random() * colors.length);
            const color = colors[randomIndex] || colors[0];
            const obj = {
              ...data,
              divpadding: i === 0 ? '0px' : `${30}px`,
              customTop: i === 0 ? '0px' : `${0}px`,
              leftMargin: `${baseMargin}px`,
              background: color
            };
            baseMargin += 100;
            if (i) {
              basePadding += 30;
              defaultTop = basePadding - 20;
            }
            return obj;
          });
        this.employeeHierarchy = {
          empList: updatedResponse
        };
        //this.getParamsLayoutResource();
      })
      .catch((error: any) => {
        this.IsError = true;
        this.message = error.error.message || 'Error fetching employee hierachy';
        setTimeout(() => {
          this.IsError = false;
        }, 15000);
        // this.snackBar.open(
        //   error.error.message || 'Error fetching employee hierarchy',
        //   'Okay',
        //   {
        //     duration: 15000
        //   }
        // );
      });
  }

  async onGetUsers() {
    /*  if (!this.editingProfileDetail) {
       this.profileListService
         .getUsers(this.loggedInUserId)
         .toPromise()
         .then((data: any) => {
           // console.log('data -? ', data);
           this.userInfo = data;
           this.editingProfileDetail = data;
           this.fetchDetails(this.editingProfileDetail.personalInfo);
         });
     } else {
       this.fetchDetails(this.editingProfileDetail.personalInfo);
     } */
    console.log('check status ==>', this.editingProfileDetail);
    if (!this.editingProfileDetail) {
       await this.profileListService.GetUserResource(this.loggedInUserId).toPromise().then(async (data: any) => {
        console.log('onGetUsers => ', data);
        this.userDetails = data;
        await this.profileListService.GetMoreUserResource(this.userDetails.id).toPromise().then((res: any) => {
          this.userInfo = res;
          this.editingProfileDetail = res;
          this.editingProfileDetail.appsList = data.appsList;
          this.fetchDetails(this.editingProfileDetail);
        });
      });
    } else {
      this.fetchDetails(this.editingProfileDetail);
    }
  }
  async parseMnetResponse(mnetUserInfo) {
    this.allWorkgroupRolesMapping = mnetUserInfo['allWorkgroupRolesList'];

    // this.taskService.callGetUrl('/PageLayoutTemplate/Get/Profile').toPromise().then((resp) => {
    this.profilePageLayout = this.pageLayout;
    console.log("hello");
    console.log(this.profilePageLayout);

    if (this.profilePageLayout && this.profilePageLayout['pageLayoutTemplate']
      && this.profilePageLayout['pageLayoutTemplate'][0]
      && this.profilePageLayout['pageLayoutTemplate'][0]['fieldsList']) {
    }

    if (this.profilePageLayout && this.profilePageLayout['pageLayoutTemplate']
      && this.profilePageLayout['pageLayoutTemplate'][1]
      && this.profilePageLayout['pageLayoutTemplate'][1]['fieldsList']) {
      for (let field of this.profilePageLayout['pageLayoutTemplate'][1]['fieldsList']) {

        if (field.fieldName == 'Workgroups') {
          field.data[0].json_descriptor.elem[0].options = mnetUserInfo['allWorkgroupsList'];
          // console.log("Total workgroup : ", field.data[0].json_descriptor.elem[0].options);
          // console.log("Selected workgroup : ", this.profileData['workgroupList']);
          if (this.profileData['workgroupsList'].length > 0) {
            for (let workgroup of this.profileData['workgroupsList']) {
              const index = field.data[0].json_descriptor.elem[0].options.indexOf(workgroup.name);
              if (index !== -1) {
                field.data[0].json_descriptor.elem[1].options.push(workgroup.name);
                field.data[0].json_descriptor.elem[0].options.splice(index, 1);
              }
            }
          }
        }

        if (field.fieldName == 'Skills') {
          field.data[0].json_descriptor.elem[0].options = mnetUserInfo['allSkillsList'];
          if (this.profileData['skillList']) {
            for (let skill of this.profileData['skillList']) {
              const index = field.data[0].json_descriptor.elem[0].options.indexOf(skill);
              if (index !== -1) {
                field.data[0].json_descriptor.elem[1].options.push(skill);
                field.data[0].json_descriptor.elem[0].options.splice(index, 1);
              }
            }
          }

        }

        if (field.fieldName == 'Applications') {
          field.data[0].json_descriptor.elem[0].options = mnetUserInfo['allAppsList'];
          // console.log("this.profileData['appsList'] ==> ", this.profileData['appsList']);
          if (this.profileData['appsList'].length > 0) {
            for (let app of this.profileData['appsList']) {
              // console.log("App name => ", app.appName);
              const index = field.data[0].json_descriptor.elem[0].options.indexOf(app.appName);
              if (index !== -1) {
                field.data[0].json_descriptor.elem[1].options.push(app.appName);
                field.data[0].json_descriptor.elem[0].options.splice(index, 1);
              }
            }
          }
        }

      }
    }
    this.loader = false;
    this._ref.detectChanges();
    // });
  }
  getMNetUser(cuid) {
    // console.log("1234 <<==>> ", cuid)
    this.profileListService
      .getMnetUserInfo(cuid)
      .toPromise()
      .then((response: any) => {
        // console.log(response);
        this.parseMnetResponse(response);
        this.userProfileData = response;
        this.unSelectedAppList = this.userProfileData.allAppsList;
        this.unSelectedSkillList = this.userProfileData.allSkillsList;
        this.unSelectedWorkgroupList = this.userProfileData.allWorkgroupsList;
        this.allWorkgroupRolesMapping = this.userProfileData.allWorkgroupRolesList;
        this.getUserProfile();
      })
      .catch((error: any) => {
        this.IsError = true;
        this.message = error.error.message;
        setTimeout(() => {
          this.IsError = false;
        }, 15000);
        // this.snackBar.open(error.error.message, 'Okay', {
        //   duration: 15000
        // });
      });
  }

  selectTab(fieldsList: any[], index: number, tab: any) {
    // Below line is added to fix GETCWM-7946 (Manager User - Edit User - System Not Refreshing Page After Successful Changes)
    if (tab.fieldName == "Workgroups" && this.currentWorkgroupSelectedVal !=null) {
    this.onUnselectedWorkgroupDropdownClick(null, true);  
    }     
    fieldsList.forEach((field, i) => {
      field.isWorkflowActive = (index === i);
    });
    if (tab.fieldName == "Params") {
    }
  }

  getParamsLayoutResource() {
    this.loader = true;
    this.taskService.callGetUrl('/PageLayoutTemplate/Get/paramsLayout_Resource').toPromise().then((resp) => {
      this.resourceLayout = resp;
      this.loader = false;
    }).catch((err: any) => {
      this.loader = false;
      console.log(err);
    });
  }

  async getUserProfile() {
    if (this.editingProfileDetail) {
      this.loader=true;
      console.log(this.userDetails);
       //await this.profileListService.GetUserResource(this.profileData.cuid).toPromise().then(async (res: any) => {
        //await this.profileListService.GetMoreUserResource(this.userDetails.id).toPromise().then((data: any) => {
          //var paramsList = data['params'];
          let user  = JSON.parse(localStorage.getItem('fd_user'));
         // var paramsList = user['params'];
          this.resourceLayoutResp =  this.editingProfileDetail.params;
        //  this.resourceLayoutResp = paramsList;
          console.log(JSON.stringify(this.resourceLayoutResp));
          this.loader=false;
          this.getParamsLayoutResource();
          this.getEmployeeHierarchy(this.profileData.cuid);
          if (!this.editingProfileDetail) {
            console.log(this.userInfo);
            this.editingProfileDetail = this.userInfo;
          }
          this.userId = this.userInfo.cuid;
          //this.profileListService.getMnetUserInfo(this.userInfo.cuid).toPromise().then((response: any) => {
            //this.userProfileData = response;
            this.unSelectedAppList = this.userProfileData.allAppsList;
            this.unSelectedSkillList = this.userProfileData.allSkillsList;
            this.unSelectedWorkgroupList = this.userProfileData.allWorkgroupsList; 
            this.allWorkgroupRolesMapping = this.userProfileData.allWorkgroupRolesList; 
            this.userId = this.editingProfileDetail.cuid;
            this.permissionType = this.editingProfileDetail.userType;
            if (
              this.editingProfileDetail.appsList &&
              this.editingProfileDetail.appsList.length > 0
            ) {
              let appList = [];
              this.editingProfileDetail.appsList.map(item => {
                this.currentAppUnSelectedVal = [];
                appList.push(item.appName);
              });
              this.onSingleSelectAppList(appList);
            }
            if (
              this.editingProfileDetail.skillsList &&
              this.editingProfileDetail.skillsList.length > 0
            ) {
              let skillList = [];
              this.editingProfileDetail.skillsList.map(item => {
                this.currentSkillUnSelectedVal = [];
                skillList.push(item.skillName);
              });
              this.onSingleSelectSkillList(skillList);
            }
            if (
              this.editingProfileDetail.workgroupsList &&
              this.editingProfileDetail.workgroupsList.length > 0
            ) {
              let workgroupList = [];
              this.editingProfileDetail.workgroupsList.map(item => {
                this.currentWorkgroupUnSelectedVal = [];
                workgroupList.push(item.name);
              });
              this.onSingleSelectWorkgroupList(workgroupList);
            }
            if (
              this.editingProfileDetail.workgroupRolesList &&
              this.editingProfileDetail.workgroupRolesList.length > 0
            ) {
              let workgroupRoleList = [];
              this.editingProfileDetail.workgroupRolesList.map(item => {
                this.currentWorkgroupRoleUnSelectedVal = [];
                workgroupRoleList.push(item.workgroupRoleName);
              });
              this.onSingleSelectWorkgroupRoleList(workgroupRoleList);
            }
         // });
       // });
      //});
      /* this.profileListService
        .getUsers(this.editingProfileDetail.personalInfo.cuid)
        .toPromise()
        .then((data: any) => {
          //this.profileData = data;
          this.getEmployeeHierarchy(this.editingProfileDetail.personalInfo.cuid);

          if (!this.editingProfileDetail) {
            this.editingProfileDetail = data;
          }
          this.userId = this.editingProfileDetail.personalInfo.cuid;
          // console.log("1235 <<==>> ", this.editingProfileDetail.personalInfo.cuid);
          this.profileListService
            .getMnetUserInfo(this.editingProfileDetail.personalInfo.cuid)
            .toPromise()
            .then((response: any) => {
              this.userProfileData = response;
              this.unSelectedAppList = response.allAppsList;
              this.unSelectedSkillList = response.allSkillsList;
              this.unSelectedWorkgroupList = response.allWorkgroupsList;
              this.allWorkgroupRolesMapping = response.allWorkgroupRolesList;
              this.userId = this.editingProfileDetail.cuid;
              this.permissionType = this.editingProfileDetail.userType;
              if (
                this.editingProfileDetail.appsList &&
                this.editingProfileDetail.appsList.length > 0
              ) {
                let appList = [];
                this.editingProfileDetail.appsList.map(item => {
                  this.currentAppUnSelectedVal = [];
                  appList.push(item.appName);
                });
                this.onSingleSelectAppList(appList);
              }
              if (
                this.editingProfileDetail.skillsList &&
                this.editingProfileDetail.skillsList.length > 0
              ) {
                let skillList = [];
                this.editingProfileDetail.skillsList.map(item => {
                  this.currentSkillUnSelectedVal = [];
                  skillList.push(item.skillName);
                });
                this.onSingleSelectSkillList(skillList);
              }
              if (
                this.editingProfileDetail.workgroupsList &&
                this.editingProfileDetail.workgroupsList.length > 0
              ) {
                let workgroupList = [];
                this.editingProfileDetail.workgroupsList.map(item => {
                  this.currentWorkgroupUnSelectedVal = [];
                  workgroupList.push(item.workgroupName);
                });
                this.onSingleSelectWorkgroupList(workgroupList);
              }
              if (
                this.editingProfileDetail.workgroupRolesList &&
                this.editingProfileDetail.workgroupRolesList.length > 0
              ) {
                let workgroupRoleList = [];
                this.editingProfileDetail.workgroupRolesList.map(item => {
                  this.currentWorkgroupRoleUnSelectedVal = [];
                  workgroupRoleList.push(item.roleName);
                });
                this.onSingleSelectWorkgroupRoleList(workgroupRoleList);
              }
            });

        })
        .catch((error: any) => { }); */
    }
  }

  onSingleSelectAppList(elem, currentAppUnSelectedVal = []) {
    if (currentAppUnSelectedVal.length > 0) {
      this.currentAppUnSelectedVal = currentAppUnSelectedVal;
    }
    if (
      this.currentAppUnSelectedVal &&
      this.currentAppUnSelectedVal.length > 0
    ) {
      this.currentAppUnSelectedVal.map((item, index) => {
        elem[0]['options'].splice(elem[0]['options'].indexOf(item), 1);
        elem[1]['options'].push(item);
      });
      this.currentAppSelectedVal = [];
      this.currentAppUnSelectedVal = [];
      this.groupData['appList'] = elem[1]['options'];
    }
  }

  onSingleUnSelectAppList(elem) {
    if (this.currentAppSelectedVal && this.currentAppSelectedVal.length > 0) {
      this.currentAppSelectedVal.map((item, index) => {
        elem[1]['options'].splice(elem[1]['options'].indexOf(item), 1);
        elem[0]['options'].push(item);
      });
      this.currentAppSelectedVal = [];
      this.currentAppUnSelectedVal = [];
      this.groupData['appList'] = elem[1]['options'];
    }
  }

  onUnselectedSkillDropdownClick(event) {
    this.selectedSkillText = event.target.value;
  }

  onSingleSelectSkillList(elem, currentSkillUnSelectedVal = []) {
    if (currentSkillUnSelectedVal.length > 0) {
      this.currentSkillUnSelectedVal = currentSkillUnSelectedVal;
    }
    if (
      this.currentSkillUnSelectedVal &&
      this.currentSkillUnSelectedVal.length > 0
    ) {
      this.currentSkillUnSelectedVal.map((item, index) => {
        elem[0]['options'].splice(
          elem[0]['options'].indexOf(item),
          1
        );
        elem[1]['options'].push(item);
        this.groupData['skillList'] = elem[1]['options'];
      });
      this.currentSkillSelectedVal = [];
      this.currentSkillUnSelectedVal = [];
    }
  }

  onSingleUnSelectSkillList(elem) {
    if (
      this.currentSkillSelectedVal &&
      this.currentSkillSelectedVal.length > 0
    ) {
      this.currentSkillSelectedVal.map((item, index) => {
        elem[1]['options'].splice(elem[1]['options'].indexOf(item), 1);
        elem[0]['options'].push(item);
      });
      this.currentSkillSelectedVal = [];
      this.currentSkillUnSelectedVal = [];
      this.groupData['skillList'] = elem[1]['options'];
    }
  }

  onUnselectedWorkgroupDropdownClick(event, isShowRole) {
    console.log("this.profileData['workgroupList']", this.profileData['workgroupsList']);
    this.currentWorkgroupRoleUnSelectedVal = [];
    if (isShowRole && this.allWorkgroupRolesMapping) {

      this.profilePageLayout['pageLayoutTemplate'].map(layout => {

        if (layout.sectionHeader == "Tabs") {
          layout.fieldsList.map(tab => {
            if (tab.fieldName == "Workgroups") {
              tab.data[1].json_descriptor.elem.map(element => {
                element.options = [];
                element.subRoles = [];
                if (element.label == "Available Workgroup Roles") {
                  this.unSelectedWorkgroupRoleList = [];
                  this.selectedWorkgroupRoleList = [];
                  if (this.profileData['workgroupRolesList'] && this.profileData['workgroupRolesList'].length > 0) {
                    this.profileData['workgroupRolesList'].map((item) => {
                      if (item['workgroupName'] == this.currentWorkgroupSelectedVal) {
                        // item.roles.map((name) => {
                        this.selectedWorkgroupRoleList.push(item.workgroupRoleName);
                        // });
                      }
                    });
                  }
                   // console.log(this.selectedWorkgroupRoleList);
                  // console.log(this.allWorkgroupRolesMapping);
                  this.allWorkgroupRolesMapping.map(item => {
                    if (this.currentWorkgroupSelectedVal.indexOf(item.workgroupName) != -1) {
                      item.roleNamesList.map(roleItem => {
                        if (this.selectedWorkgroupRoleList.indexOf(roleItem) == -1) {
                          element.options.push(roleItem);
                        }
                      });
                    }
                  })
                }

                if (element.label == 'User Workgroup Roles') {
                  this.allWorkgroupRolesMapping.map(item => {
                    if (this.currentWorkgroupSelectedVal.indexOf(item.workgroupName) != -1) {
                      item.roleNamesList.map(roleItem => {
                        if (this.selectedWorkgroupRoleList.indexOf(roleItem) !== -1) {
                          element.options.push(roleItem);
                        }
                      });
                    }
                  });
                }

              })
            }
          })
        }
      });
    }
  }

  removeItem() {
    this.profilePageLayout['pageLayoutTemplate'].map(layout => {

      if (layout.sectionHeader == "Tabs") {
        layout.fieldsList.map(tab => {
          if (tab.fieldName == "Workgroups") {
            tab.data[1].json_descriptor.elem.map(element => {
              element.options = [];
              element.subRoles = [];
              if (element.label == "Available Workgroup Roles") {
                this.unSelectedWorkgroupRoleList = [];
                this.selectedWorkgroupRoleList = [];
                if (this.profileData['workgroupRolesList'] && this.profileData['workgroupRolesList'].length > 0) {
                  this.profileData['workgroupRolesList'].map((item) => {
                    if (item['workgroupName'] == this.currentWorkgroupSelectedVal) {
                      this.selectedWorkgroupRoleList.push(item.workgroupRoleName);
                    }
                  });
                }
                this.allWorkgroupRolesMapping.map(item => {
                  if (this.currentWorkgroupSelectedVal.indexOf(item.workgroupName) != -1) {
                    item.roleNamesList.map(roleItem => {
                      if (this.selectedWorkgroupRoleList.indexOf(roleItem) == -1) {
                        element.options = [];
                      }
                    });
                  }
                })
              }

              if (element.label == 'User Workgroup Roles') {
                this.allWorkgroupRolesMapping.map(item => {
                  if (this.currentWorkgroupSelectedVal.indexOf(item.workgroupName) != -1) {
                    item.roleNamesList.map(roleItem => {
                      if (this.selectedWorkgroupRoleList.indexOf(roleItem) !== -1) {
                        element.options = [];
                      }
                    });
                  }
                });
              }

            })
          }
        })
      }
    });
  }

  onSingleSelectWorkgroupList(elem, currentWorkgroupUnSelectedVal = []) {
     console.log('single select called', currentWorkgroupUnSelectedVal);
    // console.log('single select (this)', this.currentWorkgroupUnSelectedVal);
    let selected = this.currentWorkgroupUnSelectedVal[0];
    let proceedFurther = 1;

    this.allWorkgroupRolesMapping.map(item => {
      if (item.workgroupName == selected && item.roleNamesList && item.roleNamesList.length > 0) {
        proceedFurther = 1;
      }
    });

    if (proceedFurther) {
      if (currentWorkgroupUnSelectedVal.length > 0) {
        this.currentWorkgroupUnSelectedVal = currentWorkgroupUnSelectedVal;
      }
      if (
        this.currentWorkgroupUnSelectedVal &&
        this.currentWorkgroupUnSelectedVal.length > 0
      ) {
        this.currentWorkgroupUnSelectedVal.map((item, index) => {
          if(elem.length>0){
          elem[0]['options'].splice(
            elem[0]['options'].indexOf(item),
            1
          );
          }
          if(elem.length>1){
          elem[1]['options'].push(item);
          }
        });
        this.currentWorkgroupSelectedVal = [];
        this.currentWorkgroupUnSelectedVal = [];
      }
      if(elem.length>1){
        this.groupData['workgroupList'] = elem[1]['options'];
      }
      
    } else {
      this.IsError = true;
      this.message = 'Workgroup dones\'t have any role, Please try wth another Workgroup';
      setTimeout(() => {
        this.IsError = false;
      }, 15000);
      // this.snackBar.open('Workgroup doesn\'t have any role',
      //   'Please try with another WorkGroup',
      //   {
      //     duration: 15000
      //   }
      // );
    }

  }
  onMoveAllWorkgroupList(elem) {
     console.log("Elem : ", elem);

    elem[1]['options'].push(...elem[0]['options']);
    elem[0]['options'] = [];

    if (elem[1]['model'] == "currentAppSelectedVal") {
      this.groupData['appList'] = elem[1]['options'];
    } else if (elem[1]['model'] == "currentSkillSelectedVal") {
      this.groupData['skillList'] = elem[1]['options'];
    } else if (elem[1]['model'] == "currentWorkgroupSelectedVal") {
      this.groupData['workgroupList'] = elem[1]['options'];
    } else if (elem[1]['model'] == "currentWorkgroupRoleSelectedVal") {
      if (!this.groupData['workgroupRoleList']) {
        this.groupData['workgroupRoleList'] = [];
      }
      this.groupData['workgroupRoleList'][this.currentWorkgroupSelectedVal[0]] = elem[1]['options'];
    }
  }

  onRemoveAllWorkgroupList(elem) {
    console.log(":: onRemoveAllWorkgroupList ::", elem);
    this.removeItem();
    let x = this.profilePageLayout;

    elem[0]['options'].push(...elem[1]['options']);
    elem[1]['options'] = [];
    if (elem[1]['model'] == "currentAppSelectedVal") {
      this.groupData['appList'] = elem[1]['options'];
    } else if (elem[1]['model'] == "currentSkillSelectedVal") {
      this.groupData['skillList'] = elem[1]['options'];
    } else if (elem[1]['model'] == "currentWorkgroupSelectedVal") {
      this.groupData['workgroupList'] = elem[1]['options'];
    } else if (elem[1]['model'] == "currentWorkgroupRoleSelectedVal") {
      if (!this.groupData['workgroupRoleList']) {
        this.groupData['workgroupRoleList'] = [];
      }
      this.groupData['workgroupRoleList'][this.currentWorkgroupSelectedVal[0]] = elem[1]['options'];
    }
    this.profileData['workgroupRolesList'].map((item) => {
      if (item['workgroupName'] == this.currentWorkgroupSelectedVal) {
        this.selectedWorkgroupRoleList.push(item.workgroupRoleName);
      }
    });
  }

  onSingleUnSelectWorkgroupList(elem) {
    console.log(elem);
    this.removeItem();
    let x = this.profilePageLayout;
    console.log(this.profilePageLayout);
    this.RemoveSelectedWorkGroup = this.currentWorkgroupSelectedVal;
     console.log('on single selected list : ', this.currentWorkgroupSelectedVal);
    // console.log('on single selected list : ', elem[1]['options']);

    if (this.currentWorkgroupSelectedVal &&
      this.currentWorkgroupSelectedVal.length > 0 &&
      elem[1]['options'] &&
      elem[1]['options'].length > 0) {
      this.currentWorkgroupSelectedVal.map(item => {
        elem[0]['options'].push(item);
        console.log(JSON.parse(JSON.stringify(elem[1])));
        elem[1]['options'].splice(
          elem[1]['options'].indexOf(item),
          1
        );
      });
    }

    if (
      this.currentWorkgroupSelectedVal &&
      this.currentWorkgroupSelectedVal.length > 0 &&
      this.selectedWorkgroupList &&
      this.selectedWorkgroupList.length > 0
    ) {
      let index = this.selectedWorkgroupList.indexOf(
        this.selectedWorkgroupText
      );

      if (
        (this.selectedWorkgroupRoleList &&
          this.selectedWorkgroupRoleList.length > 0) ||
        (this.unSelectedWorkgroupRoleList &&
          this.unSelectedWorkgroupRoleList.length > 0)
      ) {
        let roleList = [];
        this.currentWorkgroupSelectedVal.map(item => {
          let deleteIndex = this.allWorkgroupRolesMapping.findIndex(
            workgroupItem => {
              return workgroupItem.workgroupName == item;
            }
          );
          roleList.push(
            ...this.allWorkgroupRolesMapping[deleteIndex].roleNamesList
          );
          this.unSelectedWorkgroupList.push(item);
          this.selectedWorkgroupList.splice(
            this.selectedWorkgroupList.indexOf(item),
            1
          );
        });
      }
    }
    // roleList.map(item => {
    //   if (this.selectedWorkgroupRoleList.indexOf(item) != -1) {
    //     this.selectedWorkgroupRoleList.splice(
    //       this.selectedWorkgroupRoleList.indexOf(item),
    //       1
    //     );
    //   }
    //   if (this.unSelectedWorkgroupRoleList.indexOf(item) != -1) {
    //     this.unSelectedWorkgroupRoleList.splice(
    //       this.unSelectedWorkgroupRoleList.indexOf(item),
    //       1
    //     );
    //   }
    // });

    this.profileData['workgroupRolesList'].map((item) => {
      if (item['workgroupName'] == this.currentWorkgroupSelectedVal) {
        this.selectedWorkgroupRoleList.push(item.workgroupRoleName);
      }
    });
    
    // this.groupData['workgroupList'] = elem[1]['options'];
    // this.currentWorkgroupSelectedVal = [];
    // this.unSelectedWorkgroupRoleList =[];
  }

  onUnselectedWorkgroupRoleDropdownClick(event) {
    this.selectedWorkgroupRoleText = event.target.value;
  }

  onSingleSelectWorkgroupRoleList(elem, currentWorkgroupRoleUnSelectedVal = []) {
     console.log('Selected workGroup Role', elem);
    if (currentWorkgroupRoleUnSelectedVal.length > 0) {
      this.currentWorkgroupRoleUnSelectedVal = currentWorkgroupRoleUnSelectedVal;
    }
    if (
      this.currentWorkgroupRoleUnSelectedVal &&
      this.currentWorkgroupRoleUnSelectedVal.length > 0
    ) {
      this.currentWorkgroupRoleUnSelectedVal.map((item, index) => {
        elem[0]['options'].splice(
          elem[0]['options'].indexOf(item),
          1
        );
        elem[1]['options'].push(item);
      });

      if(this.RemoveSelectedWorkGroupRole && this.RemoveSelectedWorkGroupRole.length>0){
      this.RemoveSelectedWorkGroupRole =  this.RemoveSelectedWorkGroupRole.filter((workgroupName)=> {
          return !this.currentWorkgroupRoleUnSelectedVal.includes(workgroupName);
        })
      }
      this.currentWorkgroupRoleSelectedVal = [];
      this.currentWorkgroupRoleUnSelectedVal = [];
    }
    if (!this.groupData['workgroupRoleList']) {
      this.groupData['workgroupRoleList'] = [];
    }

    if (this.currentWorkgroupSelectedVal != undefined && elem[1] != undefined) {
      this.groupData['workgroupRoleList'][this.currentWorkgroupSelectedVal[0]] = elem[1]['options'];
    }
  }

  onSingleUnSelectWorkgroupRoleList(elem) {
    console.log('Unselect WorkGroup Role ', this.currentWorkgroupRoleSelectedVal);
   
    if (
      this.currentWorkgroupRoleSelectedVal &&
      this.currentWorkgroupRoleSelectedVal.length > 0
    ) {
      this.RemoveSelectedWorkGroupRole.push(...this.currentWorkgroupRoleSelectedVal);
      this.currentWorkgroupRoleSelectedVal.map((item, index) => {
        elem[1]['options'].splice(
          elem[1]['options'].indexOf(item),
          1
        );
        elem[0]['options'].push(item);
      });
      this.currentWorkgroupRoleSelectedVal = [];
      this.currentWorkgroupRoleUnSelectedVal = [];

      if (!this.groupData['workgroupRoleList']) {
        this.groupData['workgroupRoleList'] = [];
      }
      this.groupData['workgroupRoleList'][this.currentWorkgroupSelectedVal[0]] = elem[1]['options'];
    }
  }

  onSelectSystemPermission(selectedtype: any) {
    this.permissionType = selectedtype;
  }

  onUpdateUser() {
    console.log("Profile Data", this.profileData);
    if (this.selectedWorkgroupList && this.selectedWorkgroupList.length > 0) {
      let appList = [];
      let skillList = [];
      let workgroupList = [];
      let workgroupRoleList = [];
      this.selectedAppList.map(item => {
        appList.push({ appName: item, appRole: 'User' });
      });
      this.selectedSkillList.map(item => {
        skillList.push({ skillName: item, expertiseLevel: 0 });
      });
      this.selectedWorkgroupList.map(item => {
        workgroupList.push({ workgroupName: item });
      });
      console.log(this.selectedWorkgroupList);
      this.allWorkgroupRolesMapping.map(item => {
        if (this.selectedWorkgroupList.indexOf(item.workgroupName) != -1) {
          if (item.roleNamesList && item.roleNamesList.length > 0) {
            item.roleNamesList.map(roleItem => {
              workgroupRoleList.push({
                workgroupName: item.workgroupName,
                roleName: roleItem
              });
            });
          }
        }
      });

      let profileData = {
        cuid: this.userId,
        userType: this.permissionType,
        modifiedById: this.userId,
        appsList: appList,
        skillsList: skillList,
        workgroupsList: workgroupList,
        workgroupRolesList: workgroupRoleList
      };
      // console.log(workgroupRoleList);
      this.loader = true;
      this.profileListService
        .updateUser(profileData)
        .toPromise()
        .then((response: any) => {
          this.loader = false;
          // console.log(response);
          this.IsSuccess = true;
          this.message = 'User details are updated successfully';
          setTimeout(() => {
            this.IsSuccess = false;
          }, 15000);
          // this.snackBar.open('User updated successfully', 'Okay', {
          //   duration: 15000
          // });
        })
        .catch((error: any) => {
          this.loader = false;
          this.IsError = true;
          this.message = error.error.message || 'Error updating user details';
          setTimeout(() => {
            this.IsError = false;
          }, 15000);
          // this.snackBar.open(
          //   error.error.message || 'Error updating user detils',
          //   'Okay',
          //   {
          //     duration: 15000
          //   }
          // );
        });
    }
  }

  setPreference() {
    
    let userInfo = JSON.parse(localStorage.getItem('fd_user'));
    let data = {
      'resourceCuid': this.profileData.cuid,
      'appName': 'FlightDeck',
      'preferenceJson': JSON.stringify(this.profileData['userPreference'])
    }

    // console.log("Default data ==> ", data);
    this.taskService
      .updatePreference(`/Enterprise/v2/Work/resource/${this.profileData.id}/userPreferences`, data)
      .subscribe(
        result => {
          this.IsSuccess = true;
          this.message = result['message'];
          var getLocal= JSON.parse( localStorage.getItem('fd_user'));
      
          getLocal.appsList[0].userPreference= data.preferenceJson;
         localStorage.setItem('fd_user',JSON.stringify(getLocal))
          setTimeout(() => {
            this.IsSuccess = false;
          }, 15000);
          // this.snackBar.open(result['message'].toString(), 'Okay', {
          //   duration: 15000
          // });
        },
        error => {
          this.IsError = true;
          this.message = error.error.text;
          setTimeout(() => {
            this.IsError = false;
          }, 15000);
          // this.snackBar.open(error.error.text, 'Okay', {
          //   duration: 15000
          // });
        }
      );
  }

  submitData() {
    this.loader = true;
    let data = { ...this.profileData };
    let submitData = { ...this.editingProfileDetail };
    console.log(this.selectedWorkgroupList);
    console.log(this.unSelectedWorkgroupList);
    console.log(this.userProfileData);
    console.log(this.profileData);
    console.log(submitData);
    console.log(this.profilePageLayout);
    console.log("this.resourceLayout", this.resourceLayout);
    console.log(this.RemoveSelectedWorkGroup);
    let userWGList:any = true;
    this.profilePageLayout['pageLayoutTemplate'].forEach((pgLayoutItm:any) => {
      pgLayoutItm.fieldsList.forEach((field:any) => {
        if(field.fieldName== "Workgroups"){
          field.data.forEach((wgData:any) => {
            if(wgData.fieldLabel== "Available Workgroup"){
              wgData.json_descriptor.elem.forEach(element => {
                if(element.label=='User Workgroup' && element.options.length<=0){
                  userWGList = false;
                }
              });
            }
          });
        }
      });
    });
    console.log('default ==> ', this.groupData['workgroupList']);
    if (this.groupData['workgroupList'] == undefined) {
      // console.log(this.profileData);
      // this.groupData['workgroupList'] = this.profileData.workgroupsList;
      this.groupData['workgroupList'] = this.profileData['workgroupsList'].map((data) => {
        console.log(data.name);
        return data.name;
      });
    }
    // console.log("groupdata ===>>>> ", this.groupData);

    // data['userDetails'] = data['personalInfo'];
    //data['appList'] = data['appList']
    /* if (this.groupData && this.groupData['skillList']) {
      data['params'] = this.groupData['skillList'];
    } else {
      data['params'] = [];
    }

    data['paramModel'] = []; */
    submitData['params'] = [];
    if (this.groupData && this.groupData['appList']) {
      /* data['appsList'] = this.groupData['appList'].map((application) => {
        return {
          "appName": application,
          "appRole": "user"
        }
      }); */
      submitData['appsList'] = this.groupData['appList'].map((application) => {
        return {
          "appName": application,
          "appRole": "user"
        }
      });
    } else {
      // data['appsList'] = [];
      submitData['appsList'] = [];
    }
    console.log(this.groupData);
    // return false;
    if (this.groupData && this.groupData['workgroupList']) {
      /* data['workgroupsList'] = this.groupData['workgroupList'].map((application) => {
        let roles = [];
        if (this.groupData['workgroupRoleList'] && this.groupData['workgroupRoleList'][application]) {
          roles = this.groupData['workgroupRoleList'][application];
        } else {
          roles = [];
        }
        return {
          "workgroupName": application,
          "roles": roles
        }
      }); */

      submitData['workgroupsData'] = this.groupData['workgroupList'].map((application) => {
        let roles = [];
        if (this.groupData['workgroupRoleList'] && this.groupData['workgroupRoleList'][application]) {
          // roles = this.groupData['workgroupRoleList'][application];
          this.groupData['workgroupRoleList'][application].forEach(element => {
            roles.push({
              "workgroupName": application,
              "workgroupRoleName": element,
              "description": null,
              "createdById": null,
              "modifiedById": null,
              "params": [],
              "accesslevels": [],
              "resources": null,
              "workGroupId": null
            });
          });
        } else {
          roles = [];
        }
        return {
          "workgroup": {
            "name": application,
            "description": null,
            "roles": [],
            "resources": [],
            "params": [],
            "createdById": null,
            "createdDateTime": null,
            "modifiedById": null,
            "modifiedDateTime": null
          },
          "roles": roles
        }
      });
    } else {
      // data['workgroupsList'] = [];
      submitData['workgroupsList'] = [];
    }
    // console.log(this.profileData, data);
    console.log("submitData['workgroupsData']", submitData['workgroupsData']);
    submitData['workgroupsList'] = [];
    submitData['workgroupRolesList'] = [];
    // this.profileData.workgroupsList.forEach(element => {
    //   submitData['workgroupsList'].push(element);
    // });
    this.profileData.workgroupRolesList.forEach(element => {
      if (this.RemoveSelectedWorkGroup.filter((x) => x == element.workgroupName).length == 0) {
        if (this.RemoveSelectedWorkGroupRole.filter((y) => y == element.workgroupRoleName).length == 0) {
          console.log(element.workgroupName);
          submitData['workgroupRolesList'].push(element);
        }
      }
    });
    if (submitData['workgroupsData'] != undefined) {
      submitData['workgroupsData'].forEach(workgroup => {
        console.log(this.RemoveSelectedWorkGroup.filter((x) => x != workgroup.workgroup.name).length);
        if (this.RemoveSelectedWorkGroup.filter((x) => x == workgroup.workgroup.name).length == 0) {
          console.log('Work Group ==> ', workgroup.workgroup.name);
          if (this.profileData.workgroupsList.filter((x) => x.name == workgroup.workgroup.name).length == 0) {
            console.log(":: WORKGROUP LENGTH == 0 ::");
            submitData['workgroupsList'].push(workgroup.workgroup);
          } else {
            console.log(":: WORKGROUP LENGTH == 0 ELSE ::");
            const WP = this.profileData.workgroupsList.filter((x) => x.name == workgroup.workgroup.name);
            submitData['workgroupsList'].push(WP[0]);
          }

          workgroup.roles.forEach(roles => {
            if (this.profileData.workgroupRolesList.filter((x) => x.workgroupName == roles.workgroupName && x.workgroupRoleName == roles.workgroupRoleName).length == 0) {
              submitData['workgroupRolesList'].push(roles);
            }
          });
        }
        
      });
    }

    console.log("submitData['workgroupsList']", submitData['workgroupsList']);
    console.log("submitData['workgroupRolesList']", submitData['workgroupRolesList']);
    // return false;
    // submitData['workgroupsList'] = userWGList ? submitData['workgroupsList'] : [];
    // console.log(submitData['workgroupsList']);
    // return false;
    let userInfo = JSON.parse(localStorage.getItem('fd_user'));
    // data['modifiedById'] = userInfo['cuid'];
    submitData['modifiedById'] = userInfo['cuid'];

    /* delete data.personalInfo;
    delete data.userPreference;
    delete data.skillList;
    delete data.workgroupList; */
    delete submitData.workgroupsData;
    delete submitData.userPreference;
    let resourceParams: any = [];
    this.resourceLayout.pageLayoutTemplate.map((layoutDetails) => {
      console.log(layoutDetails);
      let RESData = this.utility.GetResponcesInPramaeData(layoutDetails);
      resourceParams = RESData.workgroupParams;
      /* layoutDetails.fieldsList.map((pltParam, index) => {
        var spiParam = {
          name: pltParam.fieldName,
          value: pltParam.fieldValue,
          systemParameterItems: []
        }
        if (pltParam.type == 'select') {
          pltParam.systemParameterItemModels.map((spim, spiIndex) => {
            if (spim.value == pltParam.fieldValue) {
              spiParam.systemParameterItems[0] = spim;
              resourceParams.push(spim);
            }
          });
        } else if (pltParam.type == 'MultiSelect') {
          if (pltParam.selectedItems && pltParam.selectedItems.length > 0) {
            spiParam.systemParameterItems = [];
            pltParam.selectedItems.map((selected, selectedIndex) => {
              pltParam.systemParameterItemModels.map((spim, spiIndex) => {
                if (spim.value == selected) {
                  spiParam.systemParameterItems.push(spim);
                }
              });
            });
            resourceParams.push(spiParam);
          }
        }
        else if (pltParam.fieldValue && pltParam.fieldValue != null) {
          if (spiParam.name == "EC" && spiParam.value.length < 2) {
            spiParam.value = "00" + spiParam.value;
          }
          else if (spiParam.name == "EC" && spiParam.value.length >= 2 && spiParam.value.length < 3) {
            spiParam.value = "0" + spiParam.value;
          }
          resourceParams.push(spiParam);
        }
      }); */
    });
    
    submitData['params'] = resourceParams;
    console.log("resourceParams", resourceParams);

    console.log("submitData : ", submitData);
    // return false;

    this.taskService.updateUserPreference(submitData['id'], submitData).toPromise().then((data: any) => {
      this.loader = false;
      this.IsSuccess = true;
      // To fix GETCWM-9961 US below code is added.
      this.message = 'User details are updated successfully';
      //This line adde because User Workgroups list was not refreshing if you add or remove work group and role .   
      this.profileData.workgroupsList=data.workgroupsList;
     // this.editingProfileDetail = null;
      this.RemoveSelectedWorkGroup = [];
      this.RemoveSelectedWorkGroupRole = [];
      // this.ngOnInit() function call removed because if we are updating User profile from 
      //Manage User . Loged in user details was comming.
      setTimeout(() => {
        this.IsSuccess = false;
      }, 7000);
    }).catch((error: any) => {
      console.error(error);
      this.loader = false;
      this.IsError = true;
      this.message = error.error.message;
      setTimeout(() => {
        this.IsError = false;
      }, 7000);
    });
    let auditLogRequest: AuditLog[]=[];
    auditLogRequest.push({ createdById:userInfo.cuid,resourceId: userInfo.id, module: "Manage User", type: "edit", value:submitData.id,display:submitData.cuid,
    status:"Success",detail:"Updated profile : "+submitData.cuid});
    this.userProfileService.saveResourceAuditLog(auditLogRequest).toPromise().then((response: any) => {
      console.log(JSON.stringify(response));
    }).catch((error: any) => {
      console.error(error);
      this.loader = false;
      this.IsError = true;
      this.message = error.error.message;
      setTimeout(() => {
        this.IsError = false;
      }, 7000);
    });
    /* this.taskService
  .updatePreference('/Resource/Update', data)
  .subscribe(
    result => {
      this.loader = false;
      this.IsSuccess = true;
      this.message = result['message'];
      setTimeout(() => {
        this.IsSuccess = false;
      }, 7000);
      // this.snackBar.open(result['message'].toString(), 'Okay', {
      //   duration: 15000
      // });
    },
    error => {
      this.loader = false;
      this.IsError = true;
      this.message = error.message;
      setTimeout(() => {
        this.IsError = false;
      }, 7000);
      // this.snackBar.open(error.message, 'Okay', {
      //   duration: 15000
      // });
    }
  ); */
  }

  /**
   * Method used to properly format email so that it will not overflow
   * Default maximum name limit is 16
   * After that, name is divided into two halfs  one of length 6 and other of 7
   * Finally they are combined with a '...' in middle and domain at the end
   * @param email
   */

  formatEmail(email: string = '') {
    // email = 'Balajeeseetha.Naidukandregula@centurylink.com';
    const splitted = email.split('@');
    const name = splitted[0];
    const domain = '@' + splitted[1];
    let final = email;
    if (name.length > 16) {
      final = name.slice(0, 7) + '...' + name.slice(-6) + domain;
    }
    return final;
  }

  SetParamSelectDropDownValue(Data) {
    // console.log(Data);
    // console.log(this.paramModelKey);
    // console.log(this.paramModelKey.find((x)=> x.name == Data));
    const GetData = this.paramModelKey.find((x) => x.name == Data);
    this.ParamTextboxValue = GetData.value;
  }

  ngAfterViewInit() {
    this.functionNames['onMoveAllWorkgroupList'] = 'onMoveAllWorkgroupList';
  }



//For Workgroup table
getProfileInfo(header, field, actions) {
  var add = false,
    editable = false,
    deleteable = false;

  actions.map((item) => {
    if (item.fieldName == "Add") {
      add = item.visible
    }
    if (item.fieldName == "Edit") {
      editable = item.visible
    }
    if (item.fieldName == "Delete") {
      deleteable = item.visible
    }
  })
  this.profileInfo = {
    ...this.profileInfo,
    add: add,
    editable: editable,
    deleteable: deleteable,
    sectionheader: header,
    header: field,
    tableData: [] 
  }
  this.getViewDataTable();
}

getViewDataTable() {
      this.profileInfo.tableData = [];
      let output =[];
      for(var a of this.profileData['workgroupRolesList']){
        if(a.accesslevels.length>1) {
          for(var accessPoint of a.accesslevels){
            let access ={};
            access['workgroupName'] = a.workgroupName,
            access['workgroupRoleName'] = a.workgroupRoleName,
            access['accessLevel'] = accessPoint.permissionName,
            output.push(access);
          }
        }else{
          let access ={};
          access['workgroupName'] = a.workgroupName,
            access['workgroupRoleName'] = a.workgroupRoleName,
            access['accessLevel'] = '',
            output.push(access);
}
}
      this.profileInfo.tableData = output;
      this.pagination.totalRecords = output.length;

      this.profileInfo.tableData.forEach(row => {
        row['rowEdit'] = false;
      });
      this.pagination.totalPage = Math.ceil(this.pagination.totalRecords / this.pagination.selectedLimit);
      var limit = 0
      if (this.pagination.totalRecords > 0 && this.loaderSystemParameters) {
        // this.pagination.pageNumber = 1;
      } else {
        if (this.pagination.pageNumber == 0 && this.pagination.totalRecords > 0) {
          // this.pagination.pageNumber = 1;
        } else if (this.pagination.totalRecords > 0) {
          limit = Number(this.pagination.pageNumber - 1) * Number(this.pagination.selectedLimit)
        }
      }
      this.pagination.allItems  = this.pagination.allItems.concat(this.profileInfo.tableData);
      this.loaderSystemParameters = false;
      this.profileInfo.tableData = this.profileInfo.tableData.slice(limit, this.pagination.selectedLimit * (limit + 1));
      this.pagination.currentPageNumber = 1;				
      this.convertNumberToArray(this.pagination.totalPage);
}

convertNumberToArray(count:number){
  this.tablePaginationData = [];
  for(let i =1;i<=count;i++){
    this.tablePaginationData.push(i);
  }
}

filterRoles() {
let temp = [];
    let searchCriteria = this.roles.RoleName;
    if (searchCriteria) {
      searchCriteria = searchCriteria.toUpperCase();
      temp = this.roles.filter(role => {
        return role['RoleName'].toUpperCase().indexOf(searchCriteria) !== -1;
      });
    } else {
      temp = this.roles;
    }
    this.roles.filterData = temp;
  }    

  filterAccessPoint() {
    let temp = [];
        let searchCriteria = this.authorizations.AccessPointName;
        if (searchCriteria) {
          searchCriteria = searchCriteria.toUpperCase();
          temp = this.authorizations.filter(accessPoint => {
            return accessPoint['AccessPointName'].toUpperCase().indexOf(searchCriteria) !== -1;
          });
        } else {
          temp = this.authorizations;
        }
        this.authorizations.filterData = temp;
      } 
//For Workgroup table- end

}

export class ProfileTabInfo {
  tabId: string;
  tabName: string;
  isWorkflowActive: boolean;
  data: {};
}
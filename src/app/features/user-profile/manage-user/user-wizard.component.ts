import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ProfileListService } from '../../profile-list/profile-list.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { MatSnackBar } from '@angular/material';
import { NotificationService } from '@app/core/services';
import { UserProfileService } from '../user-profile.service';

@Component({
  selector: 'sa-user-wizard',
  templateUrl: './user-wizard.component.html',
  styleUrls: ['./user-wizard.component.css']
})
export class UserWizardComponent implements OnInit {
  selectedAppList :Array<string>;
  unSelectedAppList :Array<string>;

  selectedSkillList :Array<string>;
  unSelectedSkillList :Array<string>;
  selectedSkillText:string;

  selectedWorkgroupList :Array<string>;
  unSelectedWorkgroupList :Array<string>;
  selectedWorkgroupText:string;
  userId:string="";
  userProfileData:any;
  loggedInUserId:string;
  UserFullName = '';

  allWorkgroupRolesMapping:Array<any>;
  selectedWorkgroupRoleList :Array<string>;
  unSelectedWorkgroupRoleList :Array<string>;
  selectedWorkgroupRoleText:string;
  @Input() editingProfileDetail:any = null;
  responseMessage:string ='';
  userHeading:string="";

  permissionType:string="User";

  isStep2: boolean = false;
  currentStep: number = 1;
  currentAppUnSelectedVal:any;
  currentAppSelectedVal:any;
  currentSkillUnSelectedVal:any;
  currentSkillSelectedVal:any;
  currentWorkgroupUnSelectedVal:any;
  currentWorkgroupSelectedVal:any;
  currentWorkgroupRoleUnSelectedVal:any;
  currentWorkgroupRoleSelectedVal:any;
  isSearchUserDisabled:string='';
  nextStepText="Next";
  tabHeaderText:string;
  @Input() isEditing:boolean;
  @Output() onTabNameChange = new EventEmitter<string>();
  @Output() onShowUserEditPage = new EventEmitter<any>();
  public loader:boolean;
  stubbedJson:any = {};
  public templateObject ={
    steps:[{
      stepNo:1,
      stepBadge:"Step 1",
      stepLabel:"User Information",
      active:"active"
    },
    {
    stepNo:2,
    stepBadge:"Step 2",
    stepLabel:"Associate Applications",
    //active:""
  },
  {
    stepNo:3,
    stepBadge:"Step 3",
    stepLabel:"Associate Workgroups",
    //active:""
  },
  {
    stepNo:4,
    stepBadge:"Step 4",
    stepLabel:"Associate Skills",
    //active:""
  },
  {
    stepNo:5,
    stepBadge:"Step 5",
    stepLabel:"User Preview",
    //active:""
  }]
  }
  constructor(private profileListService: ProfileListService,
    public notificationService: NotificationService,
    private snackBar: MatSnackBar,
    private userService: UserProfileService) { 
    this.userProfileData = {};
    this.userService.getPageLayout("Manage-User").toPromise().then((response:any)=>{ 
      this.stubbedJson = response.pageLayoutTemplate;
      }).then(()=>{
        this.initializePage();
      });
  }

  ngOnInit() {
  
  }
  initializePage(){
    let userInfo = JSON.parse(localStorage.getItem('fd_user'));
  this.loggedInUserId = userInfo['cuid'];
    // this.unSelectedAppList = ["App1","App2","App3","App4","App5"];
     this.selectedAppList = [];
    // this.unSelectedSkillList = ["Skill1","Skill2","Skill3","Skill4","Skill5"];
    this.selectedSkillList = [];
    this.unSelectedWorkgroupRoleList = [];

    // this.unSelectedWorkgroupList = ["Workgroup1","Workgroup2","Workgroup3","Workgroup4","Workgroup5"];
    this.selectedWorkgroupList = [];

    // this.unSelectedWorkgroupRoleList = ["WorkgroupRole1","WorkgroupRole2","WorkgroupRole3","WorkgroupRole4","WorkgroupRole5"];
     this.selectedWorkgroupRoleList = [];
     this.tabHeaderText = "Create User";
     this.userHeading = "Create User";
     if(this.editingProfileDetail){
       this.isSearchUserDisabled = 'disabled';
      this.userHeading = "Edit User";      
      this.tabHeaderText = "Edit User";

      this.profileListService.getMnetUserInfo(this.editingProfileDetail.cuid).toPromise().then((response:any)=>{        
        this.userProfileData = response;
        this.unSelectedAppList = response.allAppsList;
        this.unSelectedSkillList = response.allSkillsList;
        this.unSelectedWorkgroupList = response.allWorkgroupsList;
        this.allWorkgroupRolesMapping = response.allWorkgroupRolesList;
        this.userId = this.editingProfileDetail.cuid;
        this.permissionType = this.editingProfileDetail.userType;
        if(this.editingProfileDetail.appsList && this.editingProfileDetail.appsList.length>0){
          let appList = [];
          this.editingProfileDetail.appsList.map(item=>{
            this.currentAppUnSelectedVal = [];
            appList.push(item.appName);
          });
          this.onSingleSelectAppList(appList);
        }
        if(this.editingProfileDetail.skillsList && this.editingProfileDetail.skillsList.length>0){
          let skillList = [];
          this.editingProfileDetail.skillsList.map(item=>{
            this.currentSkillUnSelectedVal = [];
            skillList.push(item.skillName);
          });
          this.onSingleSelectSkillList(skillList);
        }
        if(this.editingProfileDetail.workgroupsList && this.editingProfileDetail.workgroupsList.length>0){
          let workgroupList = [];
          this.editingProfileDetail.workgroupsList.map(item=>{
            this.currentWorkgroupUnSelectedVal = [];
            workgroupList.push(item.workgroupName);
          });
          this.onSingleSelectWorkgroupList(workgroupList);
        }
        if(this.editingProfileDetail.workgroupRolesList && this.editingProfileDetail.workgroupRolesList.length>0){
          let workgroupRoleList = [];
          this.editingProfileDetail.workgroupRolesList.map(item=>{
            this.currentWorkgroupRoleUnSelectedVal = [];
            workgroupRoleList.push(item.roleName);
          });
          this.onSingleSelectWorkgroupRoleList(workgroupRoleList);
        }
       });
     }
  }
  onWizardComplete(data){
    console.log('fuel-ux wizard complete', data)
  }
  setCurrentStep(step:number){    
    if(this.selectedAppList.length >0 && step == 2)
      this.currentStep = step;
    if(this.selectedSkillList.length >0 && step ==4) 
    this.currentStep = step;
    if((this.selectedWorkgroupList.length >0 && this.selectedWorkgroupRoleList.length > 0) && step ==3)
      this.currentStep = step;
    if(step==1)
      this.currentStep = step;
  }
  onSearchUserInfo(){
    this.isSearchUserDisabled='';
    if(this.userId.trim().length > 0){
    this.loader = true;
    this.profileListService.getUsers(this.userId.trim()).toPromise().then((response:any)=>{
      this.loader = false;
      this.notificationService.smartMessageBox(
        {
          title:
            "<i class='fa fa-sign-out txt-color-orangeDark'></i> Confirm <span class='txt-color-orangeDark'></span> ?",
          content:
            "User already exists, Do you want to edit this.?",
          buttons: "[No][Yes]"
        },
        ButtonPressed => {
          if (ButtonPressed == "Yes") {
            this.onTabNameChange.emit("Edit User");
            this.isSearchUserDisabled = 'disabled';
            this.userHeading = "Edit User";  
            this.nextStepText = "Update";
            this.onShowUserEditPage.emit(this.userId);            
          }
        }
      );     
    }).catch((error: any) => {
      this.loader = false;
      if(error.status==404){
        this.getMNetUser();        
        }
      });
    }
    else{      
      this.snackBar.open("CUID can not be empty.", "Okay", {
        duration: 15000,
      });
    } 
    }
    getMNetUser(){
      this.profileListService.getMnetUserInfo(this.userId).toPromise().then((response:any)=>{
        console.log(response);
        this.userProfileData = response;
        let userInfoColOne:any = this.stubbedJson.page_layout[0].Json_descriptor[0].Json_descriptor[0];
        let userInfoColTwo:any = this.stubbedJson.page_layout[0].Json_descriptor[0].Json_descriptor[1];
        //let appUnselected:any = this.stubbedJson.page_layout[0].Json_descriptor[0].Json_descriptor[1];
        userInfoColOne.map(item=>{
          if(item.name=="cuid"){
            item.value = response.cuid;
          }else if(item.name=="firstName"){
            item.value = response.firstName;
          }else if(item.name=="lastName"){
            item.value = response.lastName;
          }else if(item.name=="department"){
            item.value = response.department;
          }else if(item.name=="managerId"){
            item.value = response.managerId;
          }else if(item.name=="fullName"){
            item.value = response.fullName;
            this.UserFullName = response.fullName;
          }else if(item.name=="email"){
            item.value = response.email;
          }else if(item.name=="phone"){
            item.value = response.emphoneail;
          }
        });
        userInfoColTwo.map(item=>{
          if(item.name=="address"){
            item.value = response.address;
          }else if(item.name=="firstName"){
            item.value = response.firstName;
          }else if(item.name=="managerId"){
            item.value = response.managerId;
          }else if(item.name=="title"){
            item.value = response.title;
          }else if(item.name=="email"){
            item.value = response.email;
          }else if(item.name=="phone"){
            item.value = response.emphoneail;
          }
        });
        this.stubbedJson.page_layout.map(layout=>{
            if(layout.type=="tabPanel"){
              layout.tabs.map(tab=>{

                if(tab.fieldLabel == "Applications"){
                  tab.json_descriptor.data.layoutElement[0].json_descriptor.elem.map(element=>{
                    if(element.label=="Available Applications"){
                      element.options = response.allAppsList;
                    }
                  })
                }
                if(tab.fieldLabel == "Skills"){
                  tab.json_descriptor.data.layoutElement[0].json_descriptor.elem.map(element=>{
                    if(element.label=="Available Skills"){
                      element.options = response.allSkillsList;
                    }
                  })
                }

                if(tab.fieldLabel == "Workgroups"){
                  tab.json_descriptor.data.layoutElement[0].json_descriptor.elem.map(element=>{
                    if(element.label=="Available Workgroup"){
                      element.options = response.allWorkgroupsList;
                    }
                  });
                }
                if(tab.fieldLabel == "Available Workgroup Roles"){
                  tab.json_descriptor.data.layoutElement[1].json_descriptor.elem.map(element=>{
                    if(element.label=="Available Workgroup Roles"){
                      element.options = response.allWorkgroupRolesList;
                    }
                  })
                }
              })
            }
        })
        this.unSelectedAppList = response.allAppsList;
        this.unSelectedSkillList = response.allSkillsList;
        this.unSelectedWorkgroupList = response.allWorkgroupsList;
        this.allWorkgroupRolesMapping = response.allWorkgroupRolesList;
       }).catch((error: any) => {      
        this.snackBar.open(error.error.message, "Okay", {
          duration: 15000,
        });
      });;
    }
onDropDownClick($event,elem){
switch(elem.label){
  case "Available Workgroup":
  break;
  case "User Workgroup":
  this.onUnselectedWorkgroupDropdownClick(null,true);
  break;
  
  case "Available Workgroup Roles":
  break;
  
  case "User Workgroup Roles":
  break;
  
}
}
onUnselectedAppDropdownClick(event){
  }
onSingleSelectAppList(elem,currentAppUnSelectedVal = []){
  if(currentAppUnSelectedVal.length>0){
    this.currentAppUnSelectedVal = currentAppUnSelectedVal;
  }
  if(this.currentAppUnSelectedVal && this.currentAppUnSelectedVal.length>0){
    this.currentAppUnSelectedVal.map((item,index)=>{
      elem[0]['options'].splice(elem[0]['options'].indexOf(item), 1);
        elem[1]['options'].push(item);
    })
   this.currentAppSelectedVal = [];
   this.currentAppUnSelectedVal = [];
 }
}
onMoveAllAppList(elem){
  elem[1]['options'].push(...elem[0]['options']);
  elem[0]['options'] = [];
}
onRemoveAllAppList(elem){ 
  elem[0]['options'].push(...elem[1]['options']);
  elem[1]['options'] = [];
}
onSingleUnSelectAppList(elem){
  if(this.currentAppSelectedVal && this.currentAppSelectedVal.length>0){
    this.currentAppSelectedVal.map((item,index)=>{
      elem[1]['options'].splice(elem[1]['options'].indexOf(item), 1);
      elem[0]['options'].push(item);
    })
   this.currentAppSelectedVal = [];
   this.currentAppUnSelectedVal = [];
 }
}


onUnselectedSkillDropdownClick(event){
  this.selectedSkillText = event.target.value;
}
onSingleSelectSkillList(elem,currentSkillUnSelectedVal=[]){
  if(currentSkillUnSelectedVal.length>0){
    this.currentSkillUnSelectedVal = currentSkillUnSelectedVal;
  }
  if(this.currentSkillUnSelectedVal && this.currentSkillUnSelectedVal.length>0){
    this.currentSkillUnSelectedVal.map((item,index)=>{
      elem[0]['options'].splice(elem[0]['options'].indexOf(item), 1);
      elem[1]['options'].push(item);
    })
   this.currentSkillSelectedVal = [];
   this.currentSkillUnSelectedVal = [];
 }
}
onMoveAllSkillList(){
this.selectedSkillList.push(...this.unSelectedSkillList);
this.unSelectedSkillList = [];
}
onRemoveAllSkillList(){
this.unSelectedSkillList.push(...this.selectedSkillList);
this.selectedSkillList = [];
}
onSingleUnSelectSkillList(elem){
  if(this.currentSkillSelectedVal && this.currentSkillSelectedVal.length>0){
    this.currentSkillSelectedVal.map((item,index)=>{
      elem[1]['options'].splice(elem[1]['options'].indexOf(item), 1);
      elem[0]['options'].push(item);
    })
   this.currentSkillSelectedVal = [];
   this.currentSkillUnSelectedVal = [];
 }
}

  onUnselectedWorkgroupDropdownClick(event, isShowRole) {
    if (isShowRole && this.allWorkgroupRolesMapping) {
      this.unSelectedWorkgroupRoleList = [];
      this.stubbedJson.page_layout.map(layout => {
        if (layout.type == "tabPanel") {
          layout.tabs.map(tab => {
            if (tab.fieldLabel == "Workgroups") {
              tab.json_descriptor.data.layoutElement[1].json_descriptor.elem.map(element => {
                element.options = [];
                element.subRoles = [];
                if (element.label == "Available Workgroup Roles") {
                  this.unSelectedWorkgroupRoleList = [];
                  this.selectedWorkgroupRoleList = [];
                  if (this.userProfileData.workgroupRoleList && this.userProfileData.workgroupRoleList.length > 0) {
                    this.userProfileData.workgroupRoleList.map((item) => {
                      if (item.workgroupName == this.currentWorkgroupSelectedVal) {
                        this.selectedWorkgroupRoleList.push(item.workgroupRoleName);
                      }
                    });
                  }
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
              })
            }
          })
        }
      });
    }
  }
onSingleSelectWorkgroupList(elem,currentWorkgroupUnSelectedVal=[]){
  if (currentWorkgroupUnSelectedVal.length > 0) {
    this.currentWorkgroupUnSelectedVal = currentWorkgroupUnSelectedVal;
  }
  if (
    this.currentWorkgroupUnSelectedVal &&
    this.currentWorkgroupUnSelectedVal.length > 0
  ) {
    this.currentWorkgroupUnSelectedVal.map((item, index) => {
      elem[0]['options'].splice(
        elem[0]['options'].indexOf(item),
        1
      );
      elem[1]['options'].push(item);
    });
    this.currentWorkgroupSelectedVal = [];
    this.currentWorkgroupUnSelectedVal = [];
  }
}
onMoveAllWorkgroupList(elem){
  elem[1]['options'].push(...elem[0]['options']);
  elem[0]['options'] = [];
}
onRemoveAllWorkgroupList(elem){
  elem[0]['options'].push(...elem[1]['options']);
  elem[1]['options'] = [];
  if(elem[1].label=="User Workgroup"){
    let userWorkgrouRoleList = [];
  let availableWorkgrouRoleList = [];
  let userWorkgrouList = [];
  let availableWorkgrouList = [];
  this.stubbedJson.page_layout.map(layout=>{
    if(layout.type=="tabPanel"){
      layout.tabs.map(tab=>{                
        if(tab.fieldLabel == "Workgroups"){          
          tab.json_descriptor.data.layoutElement[1].json_descriptor.elem.map(element=>{
            if(element.label=="Available Workgroup Roles"){
              element.options  = [];
            }
            if(element.label=="User Workgroup Roles"){
              element.options  = [];
            }
          })
        }
      })
    }
})
  }
}
onSingleUnSelectWorkgroupList(elem){
  if(this.currentWorkgroupSelectedVal &&
    this.currentWorkgroupSelectedVal.length > 0 &&
    elem[1]['options'] &&
    elem[1]['options'].length > 0)
  {
    this.currentWorkgroupSelectedVal.map(item => {
      elem[0]['options'].push(item);
      elem[1]['options'].splice(
        elem[1]['options'].indexOf(item),
        1
      );
    });    
  }
  let userWorkgrouRoleList = [];
  let availableWorkgrouRoleList = [];
  let userWorkgrouList = [];
  let availableWorkgrouList = [];
  this.stubbedJson.page_layout.map(layout=>{
    if(layout.type=="tabPanel"){
      layout.tabs.map(tab=>{                
        if(tab.fieldLabel == "Workgroups"){
          tab.json_descriptor.data.layoutElement[0].json_descriptor.elem.map(element=>{
            if(element.label=="Available Workgroup"){
              //element.options  = [];
              availableWorkgrouList = element.options;
            }
            if(element.label=="User Workgroup"){
              //element.options  = [];
              userWorkgrouList = element.options;
            }
          });
          tab.json_descriptor.data.layoutElement[1].json_descriptor.elem.map(element=>{
            if(element.label=="Available Workgroup Roles"){
              //element.options  = [];
              availableWorkgrouRoleList = element.options;
            }
            if(element.label=="User Workgroup Roles"){
              //element.options  = [];
              userWorkgrouRoleList = element.options;
            }
          })
        }
      })
    }
});
  if (
    this.currentWorkgroupSelectedVal &&  this.currentWorkgroupSelectedVal.length > 0) {
    if ((userWorkgrouRoleList && userWorkgrouRoleList.length > 0) ||
      (availableWorkgrouRoleList && availableWorkgrouRoleList.length > 0)
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
        //this.unSelectedWorkgroupList.push(item);
        //this.selectedWorkgroupList.splice(this.selectedWorkgroupList.indexOf(item),1);
        //availableWorkgrouList.push(item);
        //userWorkgrouList.splice(userWorkgrouList.indexOf(item),1);
      //   this.stubbedJson.page_layout.map(layout=>{
      //     if(layout.type=="tabPanel"){
      //       layout.tabs.map(tab=>{                
      //         if(tab.fieldLabel == "Workgroups"){
      //           tab.json_descriptor.data.layoutElement[1].json_descriptor.elem.map(element=>{
      //             if(element.label=="Available Workgroup"){
      //               //element.options  = [];
      //               element.options.push(item);
      //             }
      //             if(element.label=="User Workgroup"){
      //               //element.options  = [];
      //               element.options.splice(element.options.indexOf(item),1);
      //             }
      //           })
      //         }
      //       })
      //     }
      // });
      });
      roleList.map(item => {
        if (userWorkgrouRoleList.indexOf(item) != -1) {
          userWorkgrouRoleList.splice(userWorkgrouRoleList.indexOf(item),1);
        }
        if (availableWorkgrouRoleList.indexOf(item) != -1) {
          availableWorkgrouRoleList.splice(availableWorkgrouRoleList.indexOf(item),1);
        }
      });
    }
    this.currentWorkgroupSelectedVal = [];
  }
}




onUnselectedWorkgroupRoleDropdownClick(event){
  this.selectedWorkgroupRoleText = event.target.value;
}
onSingleSelectWorkgroupRoleList(elem,currentWorkgroupRoleUnSelectedVal=[]){
  if(currentWorkgroupRoleUnSelectedVal.length>0){
    this.currentWorkgroupRoleUnSelectedVal = currentWorkgroupRoleUnSelectedVal;
  }
  if(this.currentWorkgroupRoleUnSelectedVal && this.currentWorkgroupRoleUnSelectedVal.length>0){
    this.currentWorkgroupRoleUnSelectedVal.map((item,index)=>{
      elem[0]['options'].splice(elem[0]['options'].indexOf(item),1);
      elem[1]['options'].push(item);
    })
   this.currentWorkgroupRoleSelectedVal = [];
   this.currentWorkgroupRoleUnSelectedVal = [];
 }
}
onMoveAllWorkgroupRoleList(){
this.selectedWorkgroupRoleList.push(...this.unSelectedWorkgroupRoleList);
this.unSelectedWorkgroupRoleList = [];
}
onRemoveAllWorkgroupRoleList(){
this.unSelectedWorkgroupRoleList.push(...this.selectedWorkgroupRoleList);
this.selectedWorkgroupRoleList = [];
}
onSingleUnSelectWorkgroupRoleList(elem){
  if(this.currentWorkgroupRoleSelectedVal && this.currentWorkgroupRoleSelectedVal.length>0){
    this.currentWorkgroupRoleSelectedVal.map((item,index)=>{
      elem[0]['options'].push(item);
      elem[1]['options'].splice(elem[1]['options'].indexOf(item),1);
    })
   this.currentWorkgroupRoleSelectedVal = [];
   this.currentWorkgroupRoleUnSelectedVal = [];
 }
}

onSelectSystemPermission(selectedtype:any){
  this.permissionType = selectedtype;
}

onAddNewUser(){
  if(this.editingProfileDetail && this.currentStep > 4){
    this.onUpdateUser();
  }else{
    let appList = [];
  let skillList = [];
  let workgroupList = [];
  let workgroupRoleList = [];
  let userAppList = [];
  let userSkillList = [];
  let userWorkgroupList = [];
  let userworkgroupRoleList = [];
  let workgroupsList=[];
  let userRoleList = [];
  let roleList=[];
  this.stubbedJson.page_layout.map(layout=>{
    if(layout.type=="tabPanel"){
      layout.tabs.map(tab=>{                
        if(tab.fieldLabel == "Workgroups"){
          tab.json_descriptor.data.layoutElement[0].json_descriptor.elem.map(element=>{           
            if(element.label=="User Workgroup"){
              userWorkgroupList = element.options;
            }
          });
          tab.json_descriptor.data.layoutElement[1].json_descriptor.elem.map(element=>{           
            if(element.label=="User Workgroup Roles"){
              // workgroupRoleList = element.options;
             userRoleList =element.options;
            }
          })
        }
        if(tab.fieldLabel == "Skills"){
          tab.json_descriptor.data.layoutElement[0].json_descriptor.elem.map(element=>{           
            if(element.label=="User Skills"){              
              userSkillList = element.options;
            }
          });
        }
        if(tab.fieldLabel == "Applications"){
          tab.json_descriptor.data.layoutElement[0].json_descriptor.elem.map(element=>{           
            if(element.label=="Users Applications"){
              userAppList = element.options;
            }
          });
        }
      })
    }
});
  if(userWorkgroupList && userWorkgroupList.length>0 && this.currentStep > 3){
  
    userAppList.map(item=>{
    appList.push({appName:item,appRole:"User"});
  })
  userSkillList.map(item=>{
    // skillList.push({skillName:item,expertiseLevel:0});
    skillList.push(item);
  })
  userWorkgroupList.map(item=>{
    workgroupList.push({workgroupName:item});
  })
  this.allWorkgroupRolesMapping.map(item=>{
    
    if(workgroupList.findIndex(workgroup => workgroup.workgroupName === item.workgroupName) != -1){
      workgroupRoleList =[];
     // roleList=[];
      if(item.roleNamesList && item.roleNamesList.length>0){      
        item.roleNamesList.map(roleItem=>{
          workgroupRoleList.push({workgroupName:item.workgroupName,workgroupRoleName:roleItem});
        })         
      }
      workgroupsList.push({name:item.workgroupName,roles:workgroupRoleList});
      
      workgroupRoleList.map(item=>{
        if(userRoleList.findIndex(role => role === item.workgroupRoleName) != -1){
        roleList.push({workgroupName:item.workgroupName,workgroupRoleName:item.workgroupRoleName})
        }
      })
    }
})

  let profileData = {
    cuid: this.userId,
    userType: this.permissionType,
    fullName: this.UserFullName,
    createdById: this.loggedInUserId,
    modifiedById:this.loggedInUserId,
    appsList: appList,
    workgroupsList: workgroupsList,
    workgroupRolesList:roleList
  }
  // console.log('User Data', this.userProfileData);
  // console.log('profileData', profileData);
  // return false;
  console.log(workgroupRoleList)
  this.loader = true;
  this.profileListService.addNewUser(profileData).toPromise().then((response:any)=>{
    this.loader = false;
    this.responseMessage = response.message || "User Created Successfully";
    console.log(response)
  }).catch((error: any) => {
    this.loader = false;
    this.responseMessage = error.error.message
  });
  }
  }
}
onUpdateUser(){
  if(this.selectedWorkgroupList && this.selectedWorkgroupList.length>0){
  let appList = [];
  let skillList = [];
  let workgroupList = [];
  let workgroupRoleList = [];
  this.selectedAppList.map(item=>{
    appList.push({appName:item,appRole:"User"});
  })
  this.selectedSkillList.map(item=>{
    skillList.push({skillName:item,expertiseLevel:0});
  })
  this.selectedWorkgroupList.map(item=>{
    workgroupList.push({workgroupName:item});
  })

  this.allWorkgroupRolesMapping.map(item=>{
    if(this.selectedWorkgroupList.indexOf(item.workgroupName) != -1){
      if(item.roleNamesList && item.roleNamesList.length>0){      
        item.roleNamesList.map(roleItem=>{
          workgroupRoleList.push({workgroupName:item.workgroupName,roleName:roleItem});
        })         
      }
    }
  })

  let profileData = {
    cuid: this.userId,
    userType: this.permissionType,
    modifiedById: this.loggedInUserId,
    appsList: appList,
    skillsList:skillList ,
    workgroupsList: workgroupList,
    workgroupRolesList: workgroupRoleList
  }
  console.log(workgroupRoleList)
  this.loader = true;
  this.profileListService.updateUser(profileData).toPromise().then((response:any)=>{
    this.responseMessage = response.message;
    this.loader = false;
    console.log(response)
  }).catch((error: any) => {
    this.loader = false;
    this.responseMessage = error.error.message
  });
}
}
  recieve(data) {
    this.isStep2 = data;
  }
  recieveSelected(data) {
  if(data>=0){
    this.currentStep = data;
  }
  }
  check() {    
    if(this.editingProfileDetail && this.currentStep > 3){
      this.nextStepText = "Save";
    } else if(this.currentStep > 3){
      this.nextStepText ="Submit";
    }else{
      this.nextStepText = "Next";
    }
    if(this.currentStep>5){
      return true;
    }
    true;
    // if(this.selectedAppList.length ==0 && this.currentStep == 2)return true ;
    // if(this.selectedSkillList.length ==0 && this.currentStep ==4) return true;
    // if((this.selectedWorkgroupList.length ==0 || this.selectedWorkgroupRoleList.length == 0) && this.currentStep ==3) return true;
    // return false;
  }

}

export class KeyValueInfo{
  key:string;
  value:string;
  selected:boolean;
}
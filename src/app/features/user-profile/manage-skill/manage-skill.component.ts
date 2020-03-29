import { MatDialog, MatSnackBar } from '@angular/material';
import { filter } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { UserProfileService } from '../user-profile.service';
import { CreateSkillModalComponent } from './create-skill-modal/create-skill-modal.component';
import { NotificationService } from '@app/core/services';

@Component({
  selector: 'sa-manage-skill',
  templateUrl: './manage-skill.component.html',
  styleUrls: ['./manage-skill.component.scss']
})
export class ManageSkillComponent implements OnInit {

  public userdetailswodgetwa = 'skillWidget';
  public availableSkills: any;
  public availableSkillsBackup: any;
  public skillInputObj = { selectedSkills: ['ASP'], searchCriteria: '' };
  /** Static data for Skill details start */
  public skillTabs = [
    // { title: 'ASP', skillDetails: {roles: [{name: 'User', desc: '', createdById: 'AB43248', modifiedById: '', createdDateTime: '28/2/2019 3:54 PM', modifiedDeteTime: ''},
    // {name: 'Admin', desc: '', createdById: 'AB43248', modifiedById: '', createdDateTime: '28/2/2019 3:54 PM', modifiedDeteTime: ''}], skillName: 'ASP', skillDesc: '', createdById: 'AB43248', modifiedById: '', createdDateTime: '28/2/2019 3:54 PM', modifiedDeteTime: ''} },
    // { title: 'CDP', isActive: true, skillDetails: {roles: [{name: 'User', desc: '', createdById: 'AB43248', modifiedById: '', createdDateTime: '28/2/2019 3:54 PM', modifiedDeteTime: ''},
    // {name: 'Admin', desc: '', createdById: 'AB43248', modifiedById: '', createdDateTime: '28/2/2019 3:54 PM', modifiedDeteTime: ''}], skillName: 'CDP', skillDesc: '', createdById: 'AB43248', modifiedById: '', createdDateTime: '28/2/2019 3:54 PM', modifiedDeteTime: ''} },
    // { title: 'CDP-North', skillDetails: {roles: [{name: 'User', desc: '', createdById: 'AB43248', modifiedById: '', createdDateTime: '28/2/2019 3:54 PM', modifiedDeteTime: ''},
    // {name: 'Admin', desc: '', createdById: 'AB43248', modifiedById: '', createdDateTime: '28/2/2019 3:54 PM', modifiedDeteTime: ''}], skillName: 'CDP-North', skillDesc: '', createdById: 'AB43248', modifiedById: '', createdDateTime: '28/2/2019 3:54 PM', modifiedDeteTime: ''} },
    // { title: 'CDP-West', skillDetails: {roles: [{name: 'User', desc: '', createdById: 'AB43248', modifiedById: '', createdDateTime: '28/2/2019 3:54 PM', modifiedDeteTime: ''},
    // {name: 'Admin', desc: '', createdById: 'AB43248', modifiedById: '', createdDateTime: '28/2/2019 3:54 PM', modifiedDeteTime: ''}], skillName: 'CDP-West', skillDesc: '', createdById: 'AB43248', modifiedById: '', createdDateTime: '28/2/2019 3:54 PM', modifiedDeteTime: ''} },
    // { title: 'ASG', skillDetails: {roles: [{name: 'User', desc: '', createdById: 'AB43248', modifiedById: '', createdDateTime: '28/2/2019 3:54 PM', modifiedDeteTime: ''},
    // {name: 'Admin', desc: '', createdById: 'AB43248', modifiedById: '', createdDateTime: '28/2/2019 3:54 PM', modifiedDeteTime: ''}], skillName: 'ASG', skillDesc: '', createdById: 'AB43248', modifiedById: '', createdDateTime: '28/2/2019 3:54 PM', modifiedDeteTime: ''} }
  ];
  /** Static data for Skill details end */
  skillTabsBackUp = [];

  iconSave = false;
  iconEdit = true;
  iconDelete = false;
  tabObj: any;
  tabdata: any;
  userInfo: any;
  isSortAsc = false;
  skillDetails:any = {
    skills: [
      { name: 'User', desc: '', createdById: 'AB43248', modifiedById: 'KKADALI', createdDateTime: '28/2/2019 3:54 PM', modifiedDeteTime: '28/2/2019 3:54 PM' },
      { name: 'Admin', desc: '', createdById: 'AB43248', modifiedById: 'KKADALI', createdDateTime: '28/2/2019 3:54 PM', modifiedDeteTime: '28/2/2019 3:54 PM' }
    ],
    headers: [],
    title: '',
    showActions: false
  };
  filterFields: any[] = [];

  constructor(private userProfileService: UserProfileService, private dialog: MatDialog,
    private snackBar: MatSnackBar, private notificationService: NotificationService) {
    userProfileService.getAllSkills().toPromise().then(response => {
      this.availableSkills = response;
      this.availableSkillsBackup = this.availableSkills;
    }).catch(error => console.error(error));
  }

  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.getItem('fd_user'));
    this.getSkillDetails();
  }

  getSkillsHeaders() {
    this.userProfileService.getPageLayout("Manage-Skills").subscribe((response: any) => {
        const headers = response.pageLayoutTemplate.find((data: any) => data.sectionHeader === "Table Headers");
        this.skillDetails.title = response.pageLayoutTemplate.find((data: any) => data.sectionHeader === "Widget Title").fieldsList[0].label;
        this.skillDetails.showActions = headers.fieldsList.find(h => h.fieldName === "actions" && h.label === "").display;
        this.skillDetails.headers = headers.fieldsList.filter(header => header.display && header.label !== "");
    });
    
  }

  addSkill() {
    let dialogData = { name: '', desc: '', createdById: '' };
    if (localStorage.getItem('fd_user')) {
      dialogData.createdById = JSON.parse(localStorage.getItem('fd_user')).cuid ? JSON.parse(localStorage.getItem('fd_user')).cuid.toUpperCase() : '';
    }
    const createSkillDialog = this.dialog.open(CreateSkillModalComponent, {
      width: '650px',
      data: dialogData,
      hasBackdrop: true
    });

    createSkillDialog.componentInstance.onCreateSkill.subscribe(result => {
      if (result.buttonClicked === 'createSkill') {
        const requestObj = { skillName: result.skillName, skillDesc: result.desc, createdById: result.createdById };
        this.userProfileService.createSkill(requestObj).toPromise().then((response: any) => {
          this.showMessage(response.message);
        }).catch(error => this.showMessage(error.error.message));
      }
      createSkillDialog.close();
    });
  }
  private getUserCuid() {
    let cuid;
    if (localStorage.getItem('fd_user')) {
      cuid = JSON.parse(localStorage.getItem('fd_user')).cuid ? JSON.parse(localStorage.getItem('fd_user')).cuid.toUpperCase() : '';
    }
    return cuid;
  }



  getSkillDetails() {

    this.userProfileService.getSkillDetails()
      .subscribe(res => {
        this.tabdata = res;
        this.getSkillsHeaders();
        this.tabObj = {
          title: 'ASP',
          skillDetails: {
            skills: this.tabdata,
            // skillName: 'ASP',
            // skillDesc: 'This is static data',
            // createdById: 'AB43248',
            // modifiedById: 'KKADALI', 
            // createdDateTime: '28/2/2019 3:54 PM', 
            // modifiedDeteTime: '28/2/2019 3:54 PM'
          }
        };
        this.skillInputObj.selectedSkills.forEach(skillName => {
          this.tabObj.title = skillName;
          this.skillTabs = [];
          this.skillTabs.push(this.tabObj);
        });
        for (let i = 0; i < this.skillTabs.length; i++) {
          this.skillTabs[i].isActive = false;
        }
        this.skillTabs[this.skillTabs.length - 1].isActive = true;

        let index = 0;
        this.skillTabs[0]['skillDetails']['skills'].forEach(row => {

          row['rowEdit'] = false;

          index++;
        });

        // this.skillTabsBackUp =  JSON.parse(JSON.stringify(this.skillTabs));

        this.skillTabsBackUp = JSON.parse(JSON.stringify(this.skillTabs[0]['skillDetails']['skills']));
      }), (err) => {

      }




  }

  // deleteSkill(){
  //   this.skillInputObj.selectedSkills.forEach(skillName=>{
  //     //this.availableSkills.
  //     // this.userProfileService.deleteSkill(skillName).toPromise().then((response: any) => {
  //     //     this.showMessage(response.message);
  //     // }).catch(error => this.showMessage(error.error.message));
  //   });
  // }


  deleteSkill(skillId) {
    this.userProfileService.deleteSkill(skillId).
      toPromise().then((response: any) => {
        this.showMessage(response.message);
        this.getSkillDetails();
      })
      .catch(error => this.showMessage(error.error.message));
  }


  filterSkill() {
    let temp = [];
    let searchCriteria = this.skillInputObj.searchCriteria;
    if (searchCriteria) {
      searchCriteria = searchCriteria.toUpperCase();
      temp = this.availableSkillsBackup.filter(skill => {
        return skill.toUpperCase().indexOf(searchCriteria) !== -1;
      });
    } else {
      temp = this.availableSkillsBackup;
    }
    this.availableSkills = temp;
  }

  removeTab(index: number) {
    this.skillTabs.splice(index, 1);
    this.skillTabs.forEach(tab => tab.isActive = false);

    if (this.skillTabs.length > 0) {
      const activeIndex = index == 0 ? index : index - 1;
      this.skillTabs[activeIndex].isActive = true;
    }
  }

  markActive(index: number) {
    for (let i = 0; i < this.skillTabs.length; i++) {
      if (index == i)
        this.skillTabs[i].isActive = true;
      else
        this.skillTabs[i].isActive = false;
    }
  }

  showMessage(message: string) {
    this.snackBar.open(message, "Okay", {
      duration: 15000,
    });
  }

  onSaveClick(skillInx, roleIndex) {
    const roles = this.skillTabs[skillInx].skillDetails.skills;
    let role = roles[roleIndex];
    if (!role.skillId) {
      const requestObj =
      {
        skillDesc: roles[roleIndex].skillDesc,
        skillName: roles[roleIndex].skillName,
        createdById: this.userInfo.cuid,
      };
      this.createSkill(requestObj);
      return;
    }
    else {
      // update
      role.modifiedById = this.getUserCuid();
      const requestObj =
      {
        skillId: role.skillId,
        skillDesc: role.skillDesc,
        skillName: role.skillName,
        modifiedById: role.modifiedById,
      };
      this.userProfileService.updateSkill(requestObj)
        .toPromise().then((response: any) => {
          this.showMessage(response.message);
          this.getSkillDetails();
        }).catch(error => this.showMessage(error.error.message));

    }
    // let index = 0;
    // this.skillTabs[0]['skillDetails']['skills'].forEach(row => {
    //   if(roleIndex == index) {
    //     row['rowEdit'] = false;
    //   }
    //   index++;
    // });
  }

  createSkill(requestObj) {
    this.userProfileService.createSkill(requestObj).toPromise().then((response: any) => {
      this.showMessage(response.message);
      this.getSkillDetails();
    }).catch(error => this.showMessage(error.error.message));
  }
  onEditClick(roleIndex) {
    // this.iconEdit = false;
    // this.iconSave = true;
    let index = 0;
    this.skillTabs[0]['skillDetails']['skills'].forEach(row => {
      if (roleIndex == index) {
        row['rowEdit'] = true;
      }
      index++;
    });
  }
  onDeleteClick(skillId) {
    this.notificationService.smartMessageBox({
      title: "Smart Alert!",
      content: "Do you really want to delete this skill?",
      buttons: '[No][Yes]'
    }, (ButtonPressed) => {
      if (ButtonPressed === "Yes") {
        this.deleteSkill(skillId);
        // this.notificationService.smallBox({
        //   title: "Callback function",
        //   content: "<i class='fa fa-clock-o'></i> <i>You pressed Yes...</i>",
        //   color: "#659265",
        //   iconSmall: "fa fa-check fa-2x fadeInRight animated",
        //   timeout: 4000
        // });

      }
      if (ButtonPressed === "No") {
        // this.notificationService.smallBox({
        //   title: "Callback function",
        //   content: "<i class='fa fa-clock-o'></i> <i>You pressed No...</i>",
        //   color: "#C46A69",
        //   iconSmall: "fa fa-times fa-2x fadeInRight animated",
        //   timeout: 4000
        // });
      }

    });
  }
  onCloseClick(skillInx, roleIndex) {
    let index = 0;
    const temp = this.skillTabsBackUp;
    this.skillTabs[0]['skillDetails']['skills'][roleIndex]['rowEdit'] = false;
    if(temp.length > roleIndex) {
    this.skillTabs[0]['skillDetails']['skills'][roleIndex]['skillName'] = temp[roleIndex]['skillName'];
    this.skillTabs[0]['skillDetails']['skills'][roleIndex]['skillDesc'] = temp[roleIndex]['skillDesc'];
    }
    // this.skillTabs[0]['skillDetails']['skills'].forEach(row => {      
    //   if (roleIndex == index) {
    //     row['rowEdit'] = false;
    //     row['skillName'] = temp[roleIndex]['skillName'];
    //     row['skillDesc'] = temp[roleIndex]['skillDesc'];
    //   }
    //   index++;
    // });

    const roles = this.skillTabs[0].skillDetails.skills;
    if (roles[roleIndex] && !roles[roleIndex].skillId) {
      roles.splice(roleIndex, 1);
    }
  }

  addNewRow(createdById, modifiedById) {

    this.iconEdit = true;
    this.skillTabs[0]['skillDetails']['skills'].push(
      // {name: '', desc: '', createdById: this.userInfo['cuid'], modifiedById: this.userInfo['cuid'], createdDateTime: new Date().toUTCString(), modifiedDeteTime: new Date().toUTCString()}
      {
        name: '', desc: '', createdById: "", modifiedById: "", createdDateTime: new Date().toUTCString(),
        modifiedDeteTime: new Date().toUTCString(), rowEdit: true
      }
    )
  }

  onSortSelection(columnName: string) {
    if (this.isSortAsc) {
      this.isSortAsc = false;
      this.skillTabs[0]['skillDetails']['skills'].sort(this.dynamicSort(columnName));
    } else {
      this.isSortAsc = true;
      this.skillTabs[0]['skillDetails']['skills'].sort(this.dynamicSort('-' + columnName));
    }
  }

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

  filterSkills(fieldKey: string, criteriaValue: string) {
    this.skillTabs[0]['skillDetails']['skills'] = [...this.skillTabsBackUp];
    if (this.filterFields.length === 0) {
      this.filterFields = this.skillDetails.headers.map((h: any) => {
        return {key: h.fieldName, value: ""}
      });
    }
    this.filterFields.find(f => f.key === fieldKey).value = criteriaValue;
    this.filterFields.forEach(field => {
      if (field.value !== "") {
        this.skillTabs[0]['skillDetails']['skills'] = this.skillTabs[0]['skillDetails']['skills'].filter((role: any) => {
          return (role[field.key] && role[field.key].toUpperCase().indexOf((field.value).toUpperCase()) !== -1);
        });
      };
    });
  }

}

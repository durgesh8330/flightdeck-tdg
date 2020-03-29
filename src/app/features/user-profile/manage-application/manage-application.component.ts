import { MatDialog, MatSnackBar } from '@angular/material';
import { filter } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { UserProfileService } from '../user-profile.service';
import { CreateApplicationModalComponent } from './create-application-modal/create-application-modal.component';
import { NotificationService } from '@app/core/services';
import { SharedService } from '../shared/shared.service';
import printJS from 'print-js';
import { isObject, isArray } from 'util';

@Component({
  selector: 'sa-manage-application',
  templateUrl: './manage-application.component.html',
  styleUrls: ['./manage-application.component.scss']
})
export class ManageApplicationComponent implements OnInit {

  public userdetailswodgetwa = 'applicationWidget';
  public availableApplications: any;
  public availableApplicationsBackup: any;
  public applicationInputObj = { selectedApplications: ['ASP'], searchCriteria: '' };
  public pageResolved: boolean = false;
  /** Static data for Application details start */
  public applicationTabs = [
    // { title: 'ASP', applicationDetails: {roles: [{name: 'User', desc: '', createdById: 'AB43248', modifiedById: '', createdDateTime: '28/2/2019 3:54 PM', modifiedDeteTime: ''},
    // {name: 'Admin', desc: '', createdById: 'AB43248', modifiedById: '', createdDateTime: '28/2/2019 3:54 PM', modifiedDeteTime: ''}], applicationName: 'ASP', applicationDesc: '', createdById: 'AB43248', modifiedById: '', createdDateTime: '28/2/2019 3:54 PM', modifiedDeteTime: ''} },
    // { title: 'CDP', isActive: true, applicationDetails: {roles: [{name: 'User', desc: '', createdById: 'AB43248', modifiedById: '', createdDateTime: '28/2/2019 3:54 PM', modifiedDeteTime: ''},
    // {name: 'Admin', desc: '', createdById: 'AB43248', modifiedById: '', createdDateTime: '28/2/2019 3:54 PM', modifiedDeteTime: ''}], applicationName: 'CDP', applicationDesc: '', createdById: 'AB43248', modifiedById: '', createdDateTime: '28/2/2019 3:54 PM', modifiedDeteTime: ''} },
    // { title: 'CDP-North', applicationDetails: {roles: [{name: 'User', desc: '', createdById: 'AB43248', modifiedById: '', createdDateTime: '28/2/2019 3:54 PM', modifiedDeteTime: ''},
    // {name: 'Admin', desc: '', createdById: 'AB43248', modifiedById: '', createdDateTime: '28/2/2019 3:54 PM', modifiedDeteTime: ''}], applicationName: 'CDP-North', applicationDesc: '', createdById: 'AB43248', modifiedById: '', createdDateTime: '28/2/2019 3:54 PM', modifiedDeteTime: ''} },
    // { title: 'CDP-West', applicationDetails: {roles: [{name: 'User', desc: '', createdById: 'AB43248', modifiedById: '', createdDateTime: '28/2/2019 3:54 PM', modifiedDeteTime: ''},
    // {name: 'Admin', desc: '', createdById: 'AB43248', modifiedById: '', createdDateTime: '28/2/2019 3:54 PM', modifiedDeteTime: ''}], applicationName: 'CDP-West', applicationDesc: '', createdById: 'AB43248', modifiedById: '', createdDateTime: '28/2/2019 3:54 PM', modifiedDeteTime: ''} },
    // { title: 'ASG', applicationDetails: {roles: [{name: 'User', desc: '', createdById: 'AB43248', modifiedById: '', createdDateTime: '28/2/2019 3:54 PM', modifiedDeteTime: ''},
    // {name: 'Admin', desc: '', createdById: 'AB43248', modifiedById: '', createdDateTime: '28/2/2019 3:54 PM', modifiedDeteTime: ''}], applicationName: 'ASG', applicationDesc: '', createdById: 'AB43248', modifiedById: '', createdDateTime: '28/2/2019 3:54 PM', modifiedDeteTime: ''} }
  ];
  /** Static data for Application details end */
  pagination : any = {};
  
  actionButton:any = [];
  sectionheader = '';
  actionColumn:any = [];
  tablePaginationData: any = [];
  paginationLimitOption = 10;
  Newpagination: any = {};
  totalPage = 0;
  PageLength = 0;
  displayTaskResult:Array<TaskElement>=[];
  systemParameter:any = {
    from: 'manageapplication',
    title: 'manage application',
    isSortAsc: false,
    globalSearch: ''
  };
  public pageLayout = {};
  displayTaskHeaders = []; 
  header:any = {}

  iconSave = false;
  iconEdit = true;
  iconDelete = false;
  tabObj: any;
  tabdata: any;
  userInfo: any;
  isSortAsc = false;
  applicationTabsBackUp = [];
  applicationDetails: any = {
    applications: [
      { name: 'User', desc: '', createdById: 'AB43248', modifiedById: 'KKADALI', createdDateTime: '28/2/2019 3:54 PM', modifiedDeteTime: '28/2/2019 3:54 PM' },
      { name: 'Admin', desc: '', createdById: 'AB43248', modifiedById: 'KKADALI', createdDateTime: '28/2/2019 3:54 PM', modifiedDeteTime: '28/2/2019 3:54 PM' }
    ],
    headers: [],
    title: '',
    showActions: false
  };
  filterFields: any[] = [];
  filteredApplicationsList: any[] = [];
	// pagination:any = {};
  // paginationLimitOption: number = 1;
  showWidgetHeader: boolean = false;
  tempTaskResult:any;
  IsSuccess = false;
  IsError = false;
  message = '';

  constructor(private userProfileService: UserProfileService, private dialog: MatDialog,
      private snackBar: MatSnackBar, private notificationService: NotificationService,
      private sharedService: SharedService) {
    this.getApplicationHeaders();
    userProfileService.getAllApplications().toPromise().then(response => {
      this.availableApplications = response;
      this.availableApplicationsBackup = this.availableApplications;
    }).catch(error => console.error(error));
  }

  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.getItem('fd_user'));
  }

  addApplication() {
    let dialogData = { name: '', desc: '', createdById: '' };
    if (localStorage.getItem('fd_user')) {
      dialogData.createdById = JSON.parse(localStorage.getItem('fd_user')).cuid ? JSON.parse(localStorage.getItem('fd_user')).cuid.toUpperCase() : '';
    }
    const createApplicationDialog = this.dialog.open(CreateApplicationModalComponent, {
      width: '650px',
      data: dialogData,
      hasBackdrop: true
    });

    createApplicationDialog.componentInstance.onCreateApplication.subscribe(result => {
      if (result.buttonClicked === 'createApplication') {
        const requestObj = { applicationName: result.applicationName, applicationDesc: result.desc, createdById: result.createdById };
        this.userProfileService.createApplication(requestObj).toPromise().then((response: any) => {
          // this.showMessage(response.message);
          this.IsSuccess = true;
          this.message = response.message;
          setTimeout(() => {
            this.IsSuccess = false;
          }, 15000);
        }).catch(error => {
          this.IsError = true;
          this.message = error.error.message;
          setTimeout(() => {
            this.IsError = false;
          }, 15000);
        });
      }
      createApplicationDialog.close();
    });
  }



  private getUserCuid() {
    let cuid;
    if (localStorage.getItem('fd_user')) {
      cuid = JSON.parse(localStorage.getItem('fd_user')).cuid ? JSON.parse(localStorage.getItem('fd_user')).cuid.toUpperCase() : '';
    }
    return cuid;
  }

  private getApplicationHeaders() {
    this.userProfileService.getPageLayout("Manage-Applications").subscribe((response: any) => {
      console.log(response);

      this.pageLayout = response;
      var response: any = this.pageLayout
      this.pageResolved = true;
      this.pagination = response.pageLayoutTemplate[1].fieldsList[0];
			this.actionButton = response.pageLayoutTemplate[2].fieldsList;
      this.sectionheader = response.pageLayoutTemplate[0].sectionHeader;
      this.actionColumn =  response.pageLayoutTemplate[0].fieldsList;
  
      this.pagination.selectedLimit = this.pagination.pageLimitOptions[0];
      this.pagination.pageNumber = 0;
      this.pagination.pageSize = 100;
      var add = true,
    			editable = true,
          deleteable = true;

      // this.actionColumn.map((item) => {
      //   if (item.fieldName == "Add") {
      //     add = item.visible
      //   }
      //   if (item.fieldName == "Edit") {
      //     editable = item.visible
      //   }
      //   if (item.fieldName == "Delete") {
      //     deleteable = item.visible
      //   }
      // })
      for (let i = 0; i < this.actionColumn.length; i++) {
        console.log(this.actionColumn[i].fieldName);
        if (this.actionColumn[i].fieldName === 'actions' || this.actionColumn[i].fieldName === 'appId') {
          this.actionColumn.splice(i,1);
          i = i -1;
        }
      }
      console.log(this.actionColumn);
      
      this.systemParameter = {
        ...this.systemParameter,
        add: add,
  			editable: editable,
  			deleteable: deleteable,
        sectionheader: this.sectionheader,
        header: this.actionColumn,
        tableData: [] 
      }
      


      // const headers = response.pageLayoutTemplate.find((data: any) => data.sectionHeader === "Table Headers");
      // const widgetHeader = response.pageLayoutTemplate.find((data: any) => data.sectionHeader === "Widget Title");
      // if (widgetHeader) {
      //   this.applicationDetails.title = response.pageLayoutTemplate.find((data: any) => data.sectionHeader === "Widget Title").fieldsList[0].label;
      //   this.showWidgetHeader = widgetHeader.fieldsList[0].visible;
      // }
      // this.applicationDetails.showActions = headers.fieldsList.find(h => h.fieldName === "actions" && h.label === "").display;
      // this.applicationDetails.headers = headers.fieldsList.filter(header => header.display && header.label !== "");
      // this.pagination = response.pageLayoutTemplate.find((data: any) => data.sectionHeader === "Pagination").fieldsList[0];
      // this.pagination.totalRecords = 0;
      // this.paginationLimitOption = parseInt(this.pagination.pageLimitOptions[0]);
      // //this.paginationLimitOption = 2;
      this.getApplicationDetails();
    });
  }

  getApplicationDetails() {

    this.userProfileService.getManageApplicationDetails()
      .subscribe(res => {
        this.tabdata = res;
        this.tabObj = {
          title: 'ASP',
          applicationDetails: {
            applications: this.tabdata,
            // applicationName: 'ASP',
            // applicationDesc: 'This is static data',
            // createdById: 'AB43248',
            // modifiedById: 'KKADALI', 
            // createdDateTime: '28/2/2019 3:54 PM', 
            // modifiedDeteTime: '28/2/2019 3:54 PM'
          }
        };
        this.applicationInputObj.selectedApplications.forEach(applicationName => {
          this.tabObj.title = applicationName;
          this.applicationTabs = [];
          this.applicationTabs.push(this.tabObj);
        });
        for (let i = 0; i < this.applicationTabs.length; i++) {
          this.applicationTabs[i].isActive = false;
        }
        this.applicationTabs[this.applicationTabs.length - 1].isActive = true;

        let index = 0;
        this.applicationTabs[0]['applicationDetails']['applications'].forEach(row => {

          row['rowEdit'] = false;

          index++;
        });

        this.applicationTabsBackUp = JSON.parse(JSON.stringify(this.applicationTabs[0]['applicationDetails']['applications']));
				this.pagination.totalRecords = this.applicationTabsBackUp.length;
				this.pagination.totalPage = Math.ceil(this.pagination.totalRecords / this.paginationLimitOption);
        this.applicationTabs[0]['applicationDetails']['applications'] = this.applicationTabs[0]['applicationDetails']['applications'].slice(0, this.paginationLimitOption);
        this.pagination.currentPageNumber = 1;
        this.convertNumberToArray(this.pagination.totalPage);
      }), (err) => {

      }
  }

  filterApplications(fieldName: string, criteriaValue: string) {
    let list: any[] = [...this.applicationTabsBackUp];
    if (this.filterFields.length === 0) {
      this.filterFields = this.applicationDetails.headers.map((h: any) => {
        return { key: h.fieldName, value: "" }
      });
    }
    const data = {
      list, fieldName, criteriaValue, 
      filterFields: this.filterFields, 
      filterCleared: false
    }
    this.sharedService.filterData(data);
    this.filteredApplicationsList = (data.filterCleared) ? this.applicationTabsBackUp : data.list;
    this.handlePagination(data.list);
  }

  pageChanged(page: any) {
    const list = (this.filteredApplicationsList.length !== 0) ? this.filteredApplicationsList :
      this.applicationTabsBackUp;
    const startIndex = (page - 1) * this.paginationLimitOption;
    const endIndex = startIndex + this.paginationLimitOption;
    // this.pagination.pageNumber = data.page;
    this.pagination.currentPageNumber = page;
    this.applicationTabs[0]['applicationDetails']['applications'] = list.slice(startIndex, endIndex);
  }

  /* onSortSelection(columnName: any) {
    // check if connections are filtered, sort out filtered connections only
    const list = (this.filteredApplicationsList.length !== 0) ? this.filteredApplicationsList :
      this.applicationTabsBackUp;
    this.sharedService.sortData(list, this.isSortAsc, columnName);
    this.isSortAsc = !this.isSortAsc;
    this.handlePagination(list);
  } */

  handlePagination(list: any[]) {
    const fullList = [...list];
    this.pagination.currentPageNumber = 1;
    this.pagination.totalRecords = fullList.length;
    this.pagination.totalPage = Math.ceil(this.pagination.totalRecords / this.paginationLimitOption);
    this.applicationTabs[0]['applicationDetails']['applications'] = fullList.slice(0, this.paginationLimitOption);
  }
  paginationChange(option: any) {
		this.pagination.pageNumber = 1;
    this.pagination.totalRecords = this.applicationTabsBackUp.length;
    this.paginationLimitOption = parseInt(option);
    this.applicationTabs[0]['applicationDetails']['applications'] = this.applicationTabsBackUp.slice(0, this.paginationLimitOption);
		this.pagination.totalPage = Math.ceil(this.pagination.totalRecords / this.paginationLimitOption);
	}

  printPDF(){
      this.sharedService.printPDF(this.applicationDetails.headers,
        this.applicationTabsBackUp, "ManageApplications", "Manage Applications");
  }

  printData(){
    printJS({printable:this.applicationTabsBackUp,
      properties:this.applicationDetails.headers.map(header => header.fieldName),
      type:'json'});
  }

  deleteApplication(applicationName) {
    this.userProfileService.deleteApplication(applicationName).
      toPromise().then((response: any) => {
        // this.showMessage(response.message);
        this.IsSuccess = true;
        this.message = response.message;
        setTimeout(() => {
          this.IsSuccess = false;
        }, 15000);
        this.getApplicationDetails();
      }).catch(error => {
        this.IsError = true;
        this.message = error.error.message;
        setTimeout(() => {
          this.IsError = false;
        }, 15000);
      });
  }

  filterApplication() {
    let temp = [];
    let searchCriteria = this.applicationInputObj.searchCriteria;
    if (searchCriteria) {
      searchCriteria = searchCriteria.toUpperCase();
      temp = this.availableApplicationsBackup.filter(application => {
        return application.toUpperCase().indexOf(searchCriteria) !== -1;
      });
    } else {
      temp = this.availableApplicationsBackup;
    }
    this.availableApplications = temp;
  }

  removeTab(index: number) {
    this.applicationTabs.splice(index, 1);
    this.applicationTabs.forEach(tab => tab.isActive = false);

    if (this.applicationTabs.length > 0) {
      const activeIndex = index == 0 ? index : index - 1;
      this.applicationTabs[activeIndex].isActive = true;
    }
  }

  markActive(index: number) {
    for (let i = 0; i < this.applicationTabs.length; i++) {
      if (index == i)
        this.applicationTabs[i].isActive = true;
      else
        this.applicationTabs[i].isActive = false;
    }
  }

  showMessage(message: string) {
    this.snackBar.open(message, "Okay", {
      duration: 15000,
    });
  }

  onSaveClick(applicationInx: number, roleIndex: number) {

    const roles = this.applicationTabs[applicationInx].applicationDetails.applications;
    let role = roles[roleIndex];
    if (!role.appId) {
      const requestObj =
      {
        appDesc: roles[roleIndex].appDesc,
        appName: roles[roleIndex].appName,
        createdById: this.userInfo.cuid,
        appSecureAppName: ""
      };
      this.createApplication(requestObj);
      return;
    }
    else {
      // update
      role.modifiedById = this.getUserCuid();
      const requestObj =
      {
        appId: role.appId,
        appDesc: role.appDesc,
        appName: role.appName,
        modifiedById: role.modifiedById,
      };

      this.userProfileService.updateApplication(requestObj)
        .toPromise().then((response: any) => {
          // this.showMessage(response.message);
          this.IsSuccess = true;
          this.message = response.message;
          setTimeout(() => {
            this.IsSuccess = false;
          }, 15000);
          this.getApplicationDetails();
        }).catch(error => {
          this.IsError = true;
          this.message = error.error.message;
          setTimeout(() => {
            this.IsError = false;
          }, 15000);
        });

    }
    // let index = 0;
    // this.applicationTabs[0]['applicationDetails']['applications'].forEach(row => {
    //   if(roleIndex == index) {
    //     row['rowEdit'] = false;
    //   }
    //   index++;
    // });
  }
  createApplication(requestObj) {
    console.log("this request objectr==>" + JSON.stringify(requestObj));
    this.userProfileService.createApplication(requestObj)
      .toPromise().then((response: any) => {
        // this.showMessage(response.message);
        this.IsSuccess = true;
        this.message = response.message;
        setTimeout(() => {
          this.IsSuccess = false;
        }, 15000);
        this.getApplicationDetails();
      }).catch(error => {
        this.IsError = true;
        this.message = error.error.message;
        setTimeout(() => {
          this.IsError = false;
        }, 15000);
      });
  }
  onEditClick(roleIndex) {
    // this.iconEdit = false;
    // this.iconSave = true;
    let index = 0;
    this.applicationTabs[0]['applicationDetails']['applications'].forEach(row => {
      if (roleIndex == index) {
        row['rowEdit'] = true;
      }
      index++;
    });
  }
  onDeleteClick(index) {
    this.notificationService.smartMessageBox({
      title: "Smart Alert!",
      content: "Do you really want to delete this application?",
      buttons: '[No][Yes]'
    }, (ButtonPressed) => {
      if (ButtonPressed === "Yes") {
        console.log(this.applicationTabs[0]['applicationDetails']['applications'][index].appId);
        this.deleteApplication(this.applicationTabs[0]['applicationDetails']['applications'][index].appId);
      }
      if (ButtonPressed === "No") {
      }

    });
  }
  onCloseClick(applicationInx, roleIndex) {
    const temp = this.applicationTabsBackUp;
    this.applicationTabs[0]['applicationDetails']['applications'][roleIndex]['rowEdit'] = false;
    if (temp.length > roleIndex) {
      this.applicationTabs[0]['applicationDetails']['applications'][roleIndex]['appName'] = temp[roleIndex]['appName'];
      this.applicationTabs[0]['applicationDetails']['applications'][roleIndex]['appDesc'] = temp[roleIndex]['appDesc'];
    }
    // let index = 0;
    // this.applicationTabs[0]['applicationDetails']['applications'].forEach(row => {
    //     row['rowEdit'] = false;
    //   index++;
    // });
    const roles = this.applicationTabs[0].applicationDetails.applications;
    if (roles[roleIndex] && !roles[roleIndex].appId) {
      roles.splice(roleIndex, 1);
    }
  }

  addNewRow() {
    this.iconEdit = true;
    for (let i = 0; i < this.actionColumn.length; i++) {
      if (this.actionColumn[i].fieldName === 'appName') {
        
      }
    }
    this.applicationTabs[0]['applicationDetails']['applications'].push(
      // {name: '', desc: '', createdById: this.userInfo['cuid'], modifiedById: this.userInfo['cuid'], createdDateTime: new Date().toUTCString(), modifiedDeteTime: new Date().toUTCString()}
      {
        name: '', desc: '', createdById: "", modifiedById: "", createdDateTime: new Date().toUTCString(),
        modifiedDeteTime: new Date().toUTCString(), rowEdit: true
      }
    )
    console.log(this.applicationTabs);
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

  convertNumberToArray(count:number){
    this.tablePaginationData = [];
    for(let i =1;i<=count;i++){
      this.tablePaginationData.push(i);
    }
  }

  filterTaskResult(columnName){
    let thi = this;
    // console.log(thi);
    // console.log(this.systemParameter.globalSearch);
    const globalSearch = this.systemParameter.globalSearch;
    let temp: any;
    if (globalSearch !== '') {
      temp = this.applicationTabsBackUp.filter(row => {
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
      temp = this.applicationTabsBackUp.filter(function(item) {
        let flag = true;
        Object.keys(item).forEach((element) => {
          // console.log(thi.actionColumn[element], item[element]);
          if(flag && thi.actionColumn[element] && item[element] && thi.actionColumn[element] != "") {
            if(flag && item[element].toLowerCase().indexOf(thi.actionColumn[element].toLowerCase()) === -1) {
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

  onSortSelection(columnName:string){
    console.log(columnName, this.isSortAsc);
		if(this.isSortAsc){
      this.isSortAsc = false;
      this.systemParameter.isSortAsc = false;
			this.applicationTabs[0]['applicationDetails']['applications'].sort(this.dynamicSort(columnName));
		}else{
      this.isSortAsc = true;
      this.systemParameter.isSortAsc = true;
			this.applicationTabs[0]['applicationDetails']['applications'].sort(this.dynamicSort('-'+columnName));
    }
    this.handlePagination(this.applicationTabs[0]['applicationDetails']['applications']);
  }
}
export interface TaskElement {
  actions:boolean;
  appId:string;
  appName: string;
  appDesc: string;
  createdById: number;
  modifiedById: number;
  createdDttm: string;
  modifiedDttm: string;
}


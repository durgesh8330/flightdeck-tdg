import { ActivityLogService } from './../../activity-log/activity-log.service';
import {
	Component, OnInit, Input, AfterViewChecked, ElementRef, ViewChild, AfterViewInit,
	EventEmitter, Inject, TemplateRef
} from '@angular/core';
import { ProcessComponent } from '@app/core/page-content/process';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import * as $ from 'jquery';
import ElementQueries from 'css-element-queries/src/ElementQueries';
import { FormControl, FormGroup } from "@angular/forms";
// import { ActivityLog } from '@app/features/lmos/task-details/activity-log.model';
import { debug } from 'util';
import { NotificationService } from '@app/core/services';
import { timeout } from 'q';
import { element } from '@angular/core/src/render3/instructions';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { UserProfileService } from '@app/features/user-profile/user-profile.service';
import { ModalComponent } from '@app/shared/modal/modal.component';
import { TaskService } from '@app/features/task/task.service';
import {LocalDateTimeService} from '@app/core/services/local-date-time.service';

@Component({
	selector: 'sa-task-details',
	templateUrl: './task-details.component.html',
	styleUrls: ['./task-details.component.css']
})
export class TaskDetailsComponent implements OnInit, ProcessComponent, AfterViewChecked, AfterViewInit {
	@ViewChild('resizable1') r1: ElementRef;
	@ViewChild('resizable2') r2: ElementRef;
	@ViewChild(ModalComponent) modalChild: ModalComponent;

	@Input() processData: any;
	@Input() isHeaderControlVisible: boolean = true;
	public activityLog = {};
	public taskDetails: any = {};
	private taskDetailsBackup: any = {};
	public showViewPage = true;
	public loader = false;
	public isApplicationList: boolean = false;
	public isTaskTypeList: boolean = false;
	public showViewSection: boolean = true;

	public isSPRApplication: boolean = false;
	public isEditable: boolean = false;
	public isCancelAndReissue: boolean = false;
	public dueDateEditable: boolean = false;
	public todayDate = new Date();
	public afterDate = new Date();

	public fields: Array<{}> = [];
	public taskInstParams: Array<{}> = [];

	public header: string;
	public applicationName: string[] = new Array();
	public taskType: string[] = new Array();
	public skillName: string[] = new Array();
	public workGroupName: string[] = new Array();
	public workGroupNamenew: string[] = new Array();
	public leftSideTabs: any = {
		tab: 'task-details'
	}
	public applicationList = [];
	public taskTypeList = [];
	public skillList = [];
	public workgroupList = [];

	public pageLayout = {};
	public wcmPageLayout = [];
	public displayWCMDetails = false;
	private wcmRequestData: any = {};
	modalRef: BsModalRef;

	public logPageLayout = {};

	public logDetails = [
		{
			"activityType": "UPDATE", "activityModule": "TASK", "activityValue": "41947759", "activityStatus": "SUCCESS",
			"activityDetails": "Task Instance Id: 41947759 \n Application: BPMS \n Modified By Id: AC30164 \n Processing Time: 9225ms \n Task Notes: PROCESS_TEMPLATE_NAME : SL4_SDWAN_WaitAccessSbmt_V1 \n Task Status: TASK.SYS.COMPLETED \n WorkgroupList : BPMS-ASP, CDP <==(OldValue: BPMS-ASP ) \n ",
			"createdById": "BPMS_AUTOMATION_SDWANRELORDERSACCEPTED", "application": "BPMS", "createdDateTime": "2019-03-21 21:17:23.0"
		},
		{
			"activityType": "UPDATE", "activityModule": "TASK", "activityValue": "41947759", "activityStatus": "SUCCESS",
			"activityDetails": "Task Instance Id: 41947759 \n Application: BPMS \n Modified By Id: AC30164 \n Processing Time: 9255ms \n Task Notes: PROCESS_TEMPLATE_NAME : SL4_SDWAN_WaitAccessSbmt_V1 \n Task Status: TASK.SYS.COMPLETED \n WorkgroupList : BPMS-ASP, CDP <==(OldValue: BPMS-ASP ) \n ",
			"createdById": "BPMS_AUTOMATION_SDWANRELORDERSACCEPTED", "application": "BPMS", "createdDateTime": "2019-03-21 21:17:22.0"
		},
		{
			"activityType": "UPDATE", "activityModule": "TASK", "activityValue": "41947759", "activityStatus": "SUCCESS",
			"activityDetails": "Task Instance Id: 41947759 \n Application: BPMS \n Modified By Id: AC30164 \n Processing Time: 9222ms \n Task Notes: PROCESS_TEMPLATE_NAME : SL4_SDWAN_WaitAccessSbmt_V1 \n Task Status: TASK.SYS.COMPLETED \n ",
			"createdById": "BPMS_AUTOMATION_SDWANRELORDERSACCEPTED", "application": "BPMS", "createdDateTime": "2019-03-21 21:17:21.0"
		},
		{
			"activityType": "UPDATE", "activityModule": "TASK", "activityValue": "41947759", "activityStatus": "SUCCESS",
			"activityDetails": "Task Instance Id: 41947759 \n Application: BPMS \n Modified By Id: AC30164 \n Processing Time: 9392ms \n Task Notes: PROCESS_TEMPLATE_NAME : SL4_SDWAN_WaitAccessSbmt_V1 \n Task Status: TASK.SYS.COMPLETED \n WorkgroupList : BPMS-ASP, CDP <==(OldValue: CDP ) \n ",
			"createdById": "BPMS_AUTOMATION_SDWANRELORDERSACCEPTED", "application": "BPMS", "createdDateTime": "2019-01-11 17:28:22.0"
		},
		{
			"activityType": "UPDATE", "activityModule": "TASK", "activityValue": "41947759", "activityStatus": "SUCCESS",
			"activityDetails": "Task Instance Id: 41947759 \n Application: BPMS \n Modified By Id: AC30164 \n Processing Time: 9337ms \n Task Notes: PROCESS_TEMPLATE_NAME : SL4_SDWAN_WaitAccessSbmt_V1 \n Task Status: TASK.SYS.COMPLETED \n SkillList : Ethernet, G-Fast <==(OldValue: Ethernet)  \n ",
			"createdById": "BPMS_AUTOMATION_SDWANRELORDERSACCEPTED", "application": "BPMS", "createdDateTime": "2019-01-11 17:21:32.0"
		},
		{
			"activityType": "UPDATE", "activityModule": "TASK", "activityValue": "41947759", "activityStatus": "SUCCESS",
			"activityDetails": "Task Instance Id: 41947759 \n Application: BPMS \n Modified By Id: AC30164 \n Processing Time: 8790ms \n Task Notes: PROCESS_TEMPLATE_NAME : SL4_SDWAN_WaitAccessSbmt_V1 \n Task Status: TASK.SYS.COMPLETED \n WorkgroupList : CDP <==(OldValue:  ) \n SkillList : Ethernet <==(OldValue: )  \n ",
			"createdById": "BPMS_AUTOMATION_SDWANRELORDERSACCEPTED", "application": "BPMS", "createdDateTime": "2019-01-11 17:20:18.0"
		},
		{
			"activityType": "CREATE", "activityModule": "TASK", "activityValue": "41947759", "activityStatus": "SUCCESS",
			"activityDetails": "Task Instance Id: 41947759 \n Application: BPMS \n Task Status: TASK.SYS.COMPLETED \n Task Type: AUTO_Check_For_Related_Order_Sub \n Source System: BPMS-bsfidc01-dev1 \n WorkgroupList:  \n SkillList:  \n Claim Id:  \n Created By Id: BPMS_AUTOMATION_SDWANRELORDERSACCEPTED \n Modified By Id:  \n Processing Time: 5924ms \n Task Notes: PROCESS_TEMPLATE_NAME : SL4_SDWAN_WaitAccessSbmt_V1 \n **** Task Section Header : TASK STATIC SECTION \n name: AUTO_Check_For_Related_Order_Sub \n exception: null \n id: 41947759 \n priority: medium \n domain: CUSTOMER \n applicationName: SL4_SDWAN_WaitAccessSbmt \n status: I_COMPLETED \n label: AUTO_Check_For_Related_Order_Submit \n archived: false \n processInstanceId: 26921010 \n artifactKey: 550700600-332857659 \n extendedArtifactKey: 1 \n performer: bpms_automation_sdwanrelordersaccepted \n processName: SL4_SDWAN_WaitAccessSbmt_V1 \n processTemplateId: 2566 \n dueDate: null \n startDate: 2018-12-28T02:32:15Z \n completedTime: 2018-12-28T02:32:31Z \n workstepId: 1 \n age: 0 \n taskWarnings: null \n **** Task Section Header : DataSlots \n relatedAccessOrdersAccepted: false \n relatedAccessOrdersNotAccepted: 332857700 \n ",
			"createdById": "BPMS_AUTOMATION_SDWANRELORDERSACCEPTED", "application": "BPMS", "createdDateTime": "2019-01-03 09:38:17.0"
		}
	];

	logHeaders = [];
	logData = [];
	auditResults = [];
	tempAuditResults = [];
	activityType: string = '';
	activityStatus: string = '';
	activityDetails: string = '';
	activityCreatedBy: string = '';
	activityProcessingTime: string = '';
	activityCreatedDateTime: string = '';
	loaderTaskDetail: boolean = false;
	loaderDeviceDetail: boolean = false;
	loaderLogDetails: boolean = false;
	toppings = new FormControl();
	isSortAsc: boolean = false;
	workGroupValues = [];
	skillValues = [];
	taskTypeValues = [];
	applicationValues = [];
	userInfo: any;
	applicationTest = [];
	filter = [];

	public options: any;
	public lmosOptions: any = {multiple: false, tags: true };
	public tempDate: any;
	public value: string[];
	public versions = [];
	actionList = [
		{value: "Assign"},
		{value: "Complete"},
		{value: "Block"},
		{value: "Accepted"},
		{value: "Cancel"},
		{value: "UnBlock"}
	];
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
	selectedAction = '';
	lmosButtonDisabled = false;

	filterVersionDetails() {
		let isRowValid = false;
		const temp = this.versionDetailArrBackup.filter((row => {
			isRowValid = false;
			for (let i = 0; i < this.versions.length; i++) {
				const version = this.versions[i];
				if (!version.filterCriteria || (row[version.number] && row[version.number].toUpperCase().indexOf(version.filterCriteria.toUpperCase()) !== -1)) {
					isRowValid = true;
				} else {
					isRowValid = false;
					break;
				}
			}
			if ((isRowValid && !this.versionDetailObj.filterCriteria) || (isRowValid && row.field && row.field.toUpperCase().indexOf(this.versionDetailObj.filterCriteria.toUpperCase()) !== -1)) {
				isRowValid = true;
			} else {
				isRowValid = false;
			}
			return isRowValid;
		}));
		this.versionDetailArr = temp;
	}
	public versionDetailObj = { filterCriteria: '', tooltip: '' };
	public versionDetailArr = [];
	public versionDetailArrBackup = this.versionDetailArr;
	public authorizedLMOSUser: boolean = false;
	public errorMessage = '';

	constructor(private taskService: TaskService, private snackBar: MatSnackBar, private dialog: MatDialog, private activityLogService: ActivityLogService, private notificationService: NotificationService,
				private modalService: BsModalService, private userProfileService: UserProfileService,
				private localDateConvertor:LocalDateTimeService) {
		this.fields.push(this.taskInstParams);

	}

	ngOnInit() {
		this.options = {
			multiple: true,
			tags: true
		};

		console.log("this.processData.sourceSystem ==> ", this.processData);
		
		let url = '';
		if (this.processData && this.processData.sourceSystemName && this.processData.sourceSystemName == 'SASI') {
			url = '/PageLayoutTemplate/Get/ASRI Task Details View';
		} else if (this.processData && this.processData.sourceSystemName && this.processData.sourceSystemName == 'SPR') {
			url = '/PageLayoutTemplate/Get/SPR Task Details View';
		} else if (this.processData.sourceSystemName == 'LMOS') {
			this.displayWCMDetails = true;
			const userDetails = JSON.parse(localStorage.getItem('fd_user'));
			const authorizations = userDetails && userDetails.authorizations ? userDetails.authorizations : [];
			if(authorizations.indexOf('Task_View') > -1){
				this.authorizedLMOSUser = true;
			}else{
				this.errorMessage = 'You do not have access to view LMOS Trouble Ticket Details';
				return;
			}
		} else {
			url = '/PageLayoutTemplate/Get/BPMS Task Details View';
		}
		this.taskService.callGetUrl(url).toPromise().then((resp) => {
			this.pageLayout = resp;
			
		});
		this.taskService.callGetUrl('/PageLayoutTemplate/Get/Log%20Details%20Table').toPromise().then((resp) => {
			this.logPageLayout = resp;
		});

		this.loaderTaskDetail = true;

		this.taskService.getWorkgroups().toPromise().then((response2: any) => {
			this.workgroupList = response2;
			/*for (var i = 0; i < this.workgroupList.length; i++) {
				this.workGroupValues[i] = this.workgroupList[i];
			}*/

			/*this.taskService.getApplications().toPromise().then((response3: any)=>{
				console.log("response3 ==> ",response3);
				this.applicationList =  response3;
				/*for (var i = 0; i < this.applicationList.length; i++) {
					this.applicationValues[i] = this.applicationList[i];
				}* /

				this.isApplicationList = true;
				*/
				

			
			/*});*/
		});
		this.taskService.getTaskTypes().toPromise().then((response4: any) => {
			this.loaderTaskDetail = false;
			this.taskTypeList = response4;
			/*for (var i = 0; i < this.taskTypeList.length; i++) {
				this.taskTypeValues[i] = this.taskTypeList[i];
			}*/
			this.isTaskTypeList = true;
			this.getTaskDetails(false);
		});
		// this.getTaskDetails(false);
		console.log("Page Layout ==> ", this.pageLayout);

		// Get Log details
		console.log("Calling log details");
		this.getLogDetails();

		// Log field
		this.logHeaders = [];
		/* if (this.logPageLayout['pageLayoutTemplate']) {
			this.logPageLayout['pageLayoutTemplate'].map((template) => {
				if (template.fieldsList) {
					for (let i = 0; i <= template.fieldsList.length; ++i) {
						if (template.fieldsList[i] && template.fieldsList[i]['visible']) {
							this.logHeaders.push(template.fieldsList[i]);
						}
					}
				}
			});
		} */

		console.log("this.logDetails ==> ", this.logDetails, "++++++++++++++++++++++++++++++++++");
		console.log("this.logHeaders ==> ", this.logHeaders);

		for (let i = 0; i < this.logDetails.length; ++i) {
			let obj = {};
			for (let j = 0; j < this.logHeaders.length; ++j) {
				if (this.logDetails[i] && this.logDetails[i][this.logHeaders[j]['fieldName']]) {
					obj[this.logHeaders[j]['fieldName']] = this.logDetails[i][this.logHeaders[j]['fieldName']];
				} else if (this.logDetails[i] && this.logDetails[i][this.logHeaders[j]['fieldName']] =="Creadtedby"){
					console.log("hello");
				} 
				else{
					obj[this.logHeaders[j]['fieldName']] = '';
				}
			}
			this.logData.push(obj);
		}
		console.log("Log Data => ", this.logData);

		if (this.pageLayout['pageLayoutTemplate']) {
			this.pageLayout['pageLayoutTemplate'].map((template) => {
				if (template.fieldsList) {
					for (let i = 0; i <= template.fieldsList.length; ++i) {
						if (template.fieldsList[i] && template.fieldsList[i]['service']) {
							console.log("Service => ", template.fieldsList[i]['service']);
							this.taskService.callGetUrl(template.fieldsList[i]['service']).toPromise().then((res) => {
								console.log("abc ==> ", res);
								template.fieldsList[i]['dataSource'] = res;
							});

						}
					}
				}
			});
		}

		this.userInfo = JSON.parse(localStorage.getItem('fd_user'));
	}

	ngAfterViewInit() {
		ElementQueries.listen();
		$(function () {
			/*$("#expandLeft").click( function(){
				var f = $(".resizable2").width() / $('.resizable2').parent().width() * 100;

				if (f >= 98) {
					$(".resizable1").css("width", "50%");
					$(".resizable2").css("width", "50%");
				} else {
					$(".resizable1").css("width", "99%");
					$(".resizable2").css("width", "1%");
				}
			})

			$("#expandRight").click( function(){
				var f = $(".resizable1").width() / $('.resizable1').parent().width() * 100;

				if (f >= 98) {
					$(".resizable1").css("width", "50%");
					$(".resizable2").css("width", "50%");
				} else {
					$(".resizable1").css("width", "1%");
					$(".resizable2").css("width", "99%");
				}
			});*/


			$(".resizable1").resizable(
				{
					autoHide: true,
					handles: 'e',
					resize: function (e, ui) {
						var parent = ui.element.parent();
						//alert(parent.attr('class'));
						var remainingSpace = parent.width() - ui.element.outerWidth(),
							divTwo = ui.element.next(),
							divTwoWidth = (remainingSpace - (divTwo.outerWidth() - divTwo.width())) / parent.width() * 100 + "%";
						divTwo.width(divTwoWidth);
					},
					stop: function (e, ui) {
						var parent = ui.element.parent();
						const elementWidth = ui.element.width() / parent.width() * 100;
						ui.element.css(
							{
								width: elementWidth + "%",
							});
						$('.sticky-tab-header').css('width', $('.ui-sortable-handle').width());
					}
				});
		});

		$("div.bhoechie-tab-menu>div.list-group>a").click(function (e) {
			e.preventDefault();
			$(this).siblings('a.active').removeClass("active");
			$(this).addClass("active");
			var index = $(this).index();
			$("div.bhoechie-tab>div.bhoechie-tab-content").removeClass("active");
			$("div.bhoechie-tab>div.bhoechie-tab-content").eq(index).addClass("active");
		});
	}

	ngAfterViewChecked() { }

	showPopup() {
		this.notificationService.smartMessageBox({
			title:
				"<i class='fa fa-save txt-color-orangeDark'></i>&nbsp;&nbsp;Are you sure, you want to save the changes? ",
			content:
				"",
			buttons: "[No][Yes]"
		},
			ButtonPressed => {
				if (ButtonPressed == "Yes") {
					this.hideSection();
				}
			});
	}


	hideSection() {
		//this.showViewSection = !this.showViewSection;
		if (this.isCancelAndReissue) {
			// Cancel and Reissue
			console.log("Save details for Cancel and Reissue");

			// Prepare request
			const data = {};

			this.taskDetails['taskInstParams'].forEach((obj) => {
				const { header, fieldList } = obj;
				data[header] = {};
				fieldList.forEach((element) => {
					const { fieldName, fieldValue } = element;
					data[header][fieldName] = fieldValue;
				});
			});

			this.loaderTaskDetail = true;
			this.saveTaskDetails();
			this.loader = false;
			this.loaderTaskDetail = false;
			/*
			this.taskService.performAction(1,this.processData.appTaskInstanceId,this.userInfo.cuid,{taskDetails:data})
			.toPromise().then((response: any) =>{
				this.loaderTaskDetail = false;
				//this.snackBar.open(response.message, "Okay", {
				this.snackBar.open('Changes has been saved successfully', "Okay", {
					duration: 15000,
				});
				this.isEditable = false;
				this.isCancelAndReissue = false;
			}).catch((error: any)=>{
				this.loader = false;
				this.loaderTaskDetail = false;
				console.error(error);
				this.snackBar.open(error.error.message, "Okay", {
					duration: 15000,
				});
			});*/


		} else if (this.dueDateEditable) {
			console.log("Save details for Due date");

			// Prepare request
			let dueDate = '';
			let dueDateObj = {};

			this.taskDetails['taskInstParams'].forEach((obj) => {
				obj.fieldList.forEach((element) => {
					if (element.fieldName === 'DUEDATE') {
						dueDateObj = element;

						dueDate = dueDateObj['fieldValue'] = element.fieldValue.toISOString().substr(0, 10);
					}
				});
			});

			console.log("Due date =>> ", typeof dueDate, dueDate);
			this.loaderTaskDetail = true;
			this.saveTaskDetails();
			this.dueDateEditable = false;

			/*
			this.taskService.performAction(
				2,
				this.processData.appTaskInstanceId,
				this.userInfo.cuid,
				dueDate)
			.toPromise().then((response: any) =>{
				this.loaderTaskDetail = false;
				//this.snackBar.open(response.message, "Okay", {
				this.snackBar.open('Due date has been modified', "Okay", {
					duration: 15000,
				});
				this.isEditable = false;
				this.dueDateEditable = false;
			}).catch((error: any)=>{
				this.loaderTaskDetail = false;
				this.loader = false;
				console.error(error);
				this.snackBar.open(error.error.message, "Okay", {
					duration: 15000,
				});
			});

			*/
		} else {
			console.log("Else");
			this.saveTaskDetails();
		}
	}

	onRefreshTaskDetails(loaderType: string) {
		if (loaderType === 'taskdetails' || loaderType === 'logdetails') {
			this.loaderTaskDetail = true;
		} else {
			this.loaderDeviceDetail = true;
		}
		this.getTaskDetails(true);
	}

	getTaskDetails(refreshClicked: boolean) {
		//this.loader = true;
		this.loaderTaskDetail = true;
		const self = this;
		let dayToIncrease = 5;
		const isOvc = this.processData.sourceTaskId.match(/OVC/i);
		if (isOvc === null) {
			dayToIncrease = 7;
		}

		if (this.todayDate.getHours() >= 12) {
			dayToIncrease += 1;
		}

		this.afterDate.setDate(this.todayDate.getDate() + dayToIncrease);
		console.log("Today Date : ", this.todayDate);
		console.log("After Date : ", this.afterDate);
		console.log(self);

		self.taskService.getTask(self.processData.id, self.processData.sourceSystemName).
			toPromise().then((response: any) => {
				//debugger;
				console.log("Original response : ", response);
				this.actionList = [];
				// response.allowedactions.forEach(element => {
				// 	for (let i = 0; i < element.allowedactions.length; i++) {
			  //           this.actionList.push({value: element.allowedactions[i]});
				// 	}
				// });
				console.log("workgroupList : ", response.workgroupList);
				// Response related manual changes
				// response.taskType = response.taskType['taskName']; 


				if (response.workgroupList && response.workgroupList.length > 0) {
					response.workgroupList = response.workgroupList.map((w) => {
						return w.workgroupName;
					});
					console.log(response.workgroupList);
				} else {
					response.workgroupList = [];
				}


				this.workGroupNamenew = JSON.parse(JSON.stringify(response.workgroupList));
				console.log("workGroupName ==> ", this.workGroupNamenew);

				self.fields = response;
				self.loader = false;
				self.loaderTaskDetail = false;
				self.loaderDeviceDetail = false;
				self.taskDetails = response;
				if (this.taskDetails['taskSectionModels']) {

					this.taskDetails['taskSectionModels'].forEach((obj) => {
						if (obj.paramList) {
							obj.paramList.forEach((element) => {
								if (element.name === 'dueDate') {
									// dueDate = element.fieldValue.toISOString().substr(0, 10);
									console.log("]n]nDue date ==> ", element.value);
									console.log("]n]nDue date type ==> ", typeof element.value);
									let tempDate = new Date(element.value);
									let dueDate = new Date(Date.UTC(
										tempDate.getUTCFullYear(),
										tempDate.getUTCMonth(),
										tempDate.getUTCDate()) + 86400000);

									element.value = dueDate;
									console.log("After ]n]nDue date ==> ", element.value);
									console.log("After ]n]nDue date type ==> ", typeof element.value);
								}
								if (self.processData.sourceSystemName == 'LMOS') {
									console.log(element.name);
									if (element.name == 'EC') {
										this.wcmRequestData.EC = element.value;
									} else if (element.name == 'TTN') {
										this.wcmRequestData.TTN = element.value;
									} else if (element.name == 'TN') {
										this.wcmRequestData.TN = element.value;
									} else if (element.name == 'MC') {
										this.wcmRequestData.MC = element.value;
									} else if (element.name == 'REQ') {
										this.wcmRequestData.REQ = element.value;
									} else if (element.name == 'DB') {
										this.wcmRequestData.DB = element.value;
									} else if (element.name == 'T') {
										this.wcmRequestData.T = element.value;
									} else if (element.name == 'C') {
										this.wcmRequestData.C = element.value;
									} else if (element.name == 'D') {
										this.wcmRequestData.D = element.value;
									} else if (element.name == 'FL1') {
										this.wcmRequestData.FL1 = element.value;
									} else if (element.name == 'FL3') {
										this.wcmRequestData.FL3 = element.value;
									} else if (element.name == 'X') {
										this.wcmRequestData.X = element.value;
									} else if (element.name == 'TRACE') {
										this.wcmRequestData.TRACE = element.value;
									}

								}
							});
						}
					});
				}

				if (self.displayWCMDetails) {
					this.getLMOSScreeningData();
				}

				self.workGroupName = [];
				self.skillName = [];

				/*
				if(response['workgroupList'] && response['workgroupList'].length > 0){
				response['workgroupList'].forEach(item => {
						self.workGroupName.push(item);
				});
				}*/

				console.log("task details <<===>> ", this.taskDetails);
				this.taskService.callGetUrl('/Enterprise/v2/Work/task/'+response.id+'/activityLog').toPromise().then((Logresp: any) => {
					console.log("Log Details < == >", Logresp);
					this.logData = Logresp;
					this.logDetails = Logresp;
					for (let index = 0; index < this.logData.length; index++) {
						this.logData[index]['activityDetails'] = this.logData[index]['activityDetails'].replace('/n', '\n');
						Logresp[index]['createdDtTm'] = this.localDateConvertor.LocalDate(this.logData[index]['createdDtTm']);
					}
				});

				console.log("Response << == >> ", response);
				console.log("response['taskType']['taskName'] ==> ", response['taskType']['taskName']);
				console.log("taskDetails['taskType']['taskName'] ==> ", this.taskDetails['taskType']['taskName']);

				self.applicationName.push(response['application'] ? response['application']['applicationName'] : '');
				self.isSPRApplication = (self.applicationName.indexOf('SPR') === -1 ? false : true);
				console.log("isSPRApplication : ", self.isSPRApplication);
				console.log(response.scr);
				
				if (response.scr != undefined) {
					if (response.scr == '*') {
						this.lmosButtonDisabled = true;
					}
				}
				console.log(this.lmosButtonDisabled);

				//	self.taskType.push(response['taskType'] ? response['taskType']['taskName'].trim() : '');

				self.taskDetailsBackup = JSON.parse(JSON.stringify(self.taskDetails));

				/*
				self.taskService.getAuditResults(self.taskDetails.appTaskInstanceId, self.applicationName[0]).toPromise().then((response:any)=>{
				self.tempAuditResults = response;
				self.auditResults = self.tempAuditResults;
				if(this.processData.sourceSystem === 'SPR' && !refreshClicked)
					this.processAuditLog("VIEW");
				
			}).catch((error: any)=>{
				console.log("Error while reading Audit Resulst");
				});
				*/
				this.GettaskIncludeAADetails(response.id);
			}).catch((error: any) => {
				self.loader = false;
				console.error(error);
				self.snackBar.open("Error loading Task Details..", "Okay", {
					duration: 15000,
				});
			});

			// self.taskService.getTaskIncludeAA(self.processData.id, self.processData.sourceSystemName).
			// toPromise().then((response: any) => {
			// 	console.log("Original response : ", response);
			// 	this.actionList = [];
			// 	response.allowedactions.forEach(element => {
			// 		for (let i = 0; i < element.allowedactions.length; i++) {
			// 			this.actionList.push({value: element.allowedactions[i]});
			// 		}
			// 	});
			// }).catch((error: any) => {
			// 	self.loader = false;
			// 	console.error(error);
			// 	self.snackBar.open("Error loading Task Details..", "Okay", {
			// 		duration: 15000,
			// 	});
			// });
	}

	GettaskIncludeAADetails(id) {
		this.taskService.getTaskIncludeAA(id).toPromise().then((response: any) => {
				console.log("Original response : ", response);
				this.actionList = [];
				response.allowedactions.forEach(element => {
					for (let i = 0; i < element.allowedactions.length; i++) {
						this.actionList.push({value: element.allowedactions[i]});
					}
				});
			});
			// .catch((error: any) => {
			// 	self.loader = false;
			// 	console.error(error);
			// 	self.snackBar.open("Error loading Task Details..", "Okay", {
			// 		duration: 15000,
			// 	});
			// });
	}

	private relatedTabs: any = {};

	getLMOSScreeningData() {
		this.taskService.callGetUrl('/PageLayoutTemplate/Get/WCM-Screening').toPromise().then((resp: any) => {
			this.wcmPageLayout = resp['pageLayoutTemplate'];
			let mappedFieldObj: any = {};
			let facilities = [];
			this.checkTaskPermissions();
			this.taskDetails['taskSectionModels'].forEach((section: any) => {
				if (section.header != 'Facilities') {
					section.paramList.forEach((param: any) => {
						mappedFieldObj[param.name] = param.value;
					})
				} else {
					facilities = section.paramList;
				}
			});
			this.wcmPageLayout.forEach(pageElement => {
				if (pageElement.sectionHeader != 'Related-Tabs' && pageElement.sectionHeader != 'Buttons' && pageElement.sectionHeader != 'Facilities') {
					pageElement.fieldsList.forEach((field: any) => {
						field.fieldValue = mappedFieldObj[field.fieldName];
					})
				} else if (pageElement.sectionHeader == 'Facilities') {
					facilities.forEach(facility => {
						try {
							if (facility.value) {
								facility.facilityParsed = JSON.parse(facility.value);
							}
						} catch (error) {
							console.log("Error while parsing Facility object");
						}
					})
					pageElement.headers = pageElement.fieldsList;
					pageElement.fieldsList = facilities;
				} else if (pageElement.sectionHeader == 'Related-Tabs') {
					this.relatedTabs = pageElement.fieldsList;
					this.loadTabDetails(0);
				}
			});
		});
	}

	getLogDetails() {
		this.taskDetailsBackup = JSON.parse(JSON.stringify(this.taskDetails));
		/*
		this.taskService.getAuditResults(this.taskDetails.appTaskInstanceId, this.applicationName[0]).toPromise().then((response:any)=>{
			this.tempAuditResults = response;
			this.auditResults = this.tempAuditResults;
		}).catch((error: any)=>{
			console.log("Error while reading Audit Resulst");
		})*/

		/*
		this.taskService.callGetUrl('/ActivityLog/GetAll/BPMS/Task/41947776').toPromise().then((resp) => {
			console.log("Resp ==> ",resp);
		});*/
		/*
		this.taskService.getActivityLog(this.taskDetails.appTaskInstanceId).toPromise().then((response:any)=>{
			this.tempAuditResults = response;
			console.log("\n\nAudit Response ===> ",response);
			this.auditResults = this.tempAuditResults;
		}).catch((error: any)=>{
			console.log("Error while reading Audit Resulst");
		});
		*/
	}

	filterTaskResult(columnName: string) {
		/* let activityTypeValue = this.activityType.toLowerCase();
		let activityStatusValue = this.activityStatus.toLowerCase();
		let activityDetailsValue = this.activityDetails.toLowerCase();
		let activityCreatedByValue = this.activityCreatedBy.toLowerCase();
		let activityCreatedDateTime = this.activityCreatedDateTime.toLowerCase();

		const temp = this.tempAuditResults.filter(function (item) {
			if ((!activityTypeValue || item.activityType.toLowerCase().indexOf(activityTypeValue) !== -1)
				&& (!activityStatusValue || item.activityStatus && item.activityStatus.toLowerCase().indexOf(activityStatusValue) != -1) &&
				(!activityDetailsValue || item.activityDetails && item.activityDetails.toLowerCase().indexOf(activityDetailsValue) != -1) &&
				(!activityCreatedByValue || item.createdById.toString() && item.createdById.toString().toLowerCase().indexOf(activityCreatedByValue) != -1) &&
				(!activityCreatedDateTime || item.createdDateTime.toString() && item.createdDateTime.toString().toLowerCase().indexOf(activityCreatedDateTime) != -1)) {
				return true;
			} else {
				return false;
			}
		});
		this.auditResults = temp; */
		this.tempAuditResults = this.logDetails;
		let thi = this;
		const temp = this.logDetails.filter(function (item) {
		let flag = true;
		Object.keys(item).forEach((element) => {
			let searchelem = element;
			if (element === 'createdById') {
				searchelem = 'logdetailscreatedById';
			} else if (element === 'createdDateTime') {
				searchelem = 'logdeatilscreatedDateTime';
			}
			if (flag && thi.activityLog[searchelem] && item[element] && thi.activityLog[searchelem] != "") {
				if (flag && item[element].toLowerCase().indexOf(thi.activityLog[searchelem].toLowerCase()) === -1) {
					flag = false;
				}
			}
		});
		return flag;
		});
		this.logData = temp;
	}

	editTask() {
		this.showViewPage = false;
		this.taskDetails.selectedWorkgroups = [];
		this.taskDetails.selectedSkills = [];

		if (this.taskDetails.skillList && this.taskDetails.skillList.length > 0) {
			const skillList = this.taskDetails.skillList;
			skillList.forEach(element => {
				this.taskDetails.selectedSkills.push(element.skillName);
			});
		}
		/*
		if(this.taskDetails.workgroupList && this.taskDetails.workgroupList.length > 0){
			const workgroupList = this.taskDetails.workgroupList;
			workgroupList.forEach(element => {
				this.taskDetails.selectedWorkgroups.push(element.workgroupName);
			});
		}*/
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
	onSortSelection(columnName: string) {
		if (this.isSortAsc) {
			this.isSortAsc = false;
			this.auditResults.sort(this.dynamicSort(columnName));
		} else {
			this.isSortAsc = true;
			this.auditResults.sort(this.dynamicSort('-' + columnName));
		}
		switch (columnName) {
			case 'activitytype':
				break;
			case 'activitystatus':
				break;
			case 'activitydetails':
				//applicationValue = this.applicationName.toLowerCase();
				break;
		}
	}
	public isVersionSorAsc = false;
	onVersionSortSelection(columnName: string) {
		if (this.isVersionSorAsc) {
			this.isVersionSorAsc = false;
			this.versionDetailArr.sort(this.dynamicSort(columnName));
		} else {
			this.isVersionSorAsc = true;
			this.versionDetailArr.sort(this.dynamicSort('-' + columnName));
		}
	}

	cancel() {
		this.showViewPage = true;
		this.taskDetails = JSON.parse(JSON.stringify(this.taskDetailsBackup));
	}

	prepareRequest() {
		this.taskDetails.skillList = [];
		this.taskDetails.workgroupList = [];

		if (this.taskDetails.selectedSkills && this.taskDetails.selectedSkills.length > 0) {
			const selectedSkills = this.taskDetails.selectedSkills;
			this.taskDetails.skillList = [];
			selectedSkills.forEach(element => {
				this.taskDetails.skillList.push({ 'skillName': element });
			});
		}
		if (this.taskDetails.selectedWorkgroups && this.taskDetails.selectedWorkgroups.length > 0) {
			const selectedWorkgroupList = this.taskDetails.selectedWorkgroups;
			this.taskDetails.workgroupList = [];
			selectedWorkgroupList.forEach(element => {
				this.taskDetails.workgroupList.push({ 'workgroupName': element });
			});
		}
	}

	saveTaskDetails() {
		this.loader = true;
		this.prepareRequest();
		// this.taskDetails['workGroupName'] = this.workGroupName;
		// this.taskDetails['skillName'] = this.skillName;

		this.taskDetails['workgroupList'] = [];
		this.workGroupName.forEach(data => {
			this.taskDetails['workgroupList'].push(
				{ "workgroupName": data }
			)
		});
		// wgStr = wgStr.substring(0, wgStr.length - 1);

		// let skStr = '';
		this.taskDetails['skillList'] = [];
		this.skillName.forEach(data => {
			this.taskDetails['skillList'].push(
				{ "skillName": data }
			)
		});
		// skStr = skStr.substring(0, skStr.length - 1);

		let appStr = '';
		this.applicationName.forEach(data => {
			appStr += data + ',';
		});
		appStr = appStr.substring(0, appStr.length - 1);

		let taskTypeStr = '';
		this.taskType.forEach(data => {
			taskTypeStr += data + ',';
		});
		taskTypeStr = taskTypeStr.substring(0, taskTypeStr.length - 1);



		// this.taskDetails['workgroupList'] = [
		// 	{
		// 		"workgroupName": wgStr
		// 	}
		// ];
		// this.taskDetails['skillList'] = [
		// 	{
		// 		"skillName": skStr
		// 	}
		// ];

		// this.taskDetails['taskType'] = {
		//		'taskName': taskTypeStr
		//	}

		this.taskDetails['application'] = {
			'applicationName': appStr
		}
		// Setting task Type requied for WCM Complete/Cancel/Close
		this.taskDetails['taskType'] = {
			'taskName': this.taskDetails['taskType']
		}
		this.taskDetails['taskSectionModels']
		this.taskDetails['appTaskInstanceId'] = this.taskDetails.sourceTaskId;

		this.taskDetails['modifiedById'] = this.userInfo['cuid'];
		this.taskDetails['modifiedDateTime'] = new Date().toUTCString();
		this.loaderTaskDetail = true;

		let wrk_grp = this.taskDetails.workgroupList;
		let taskInstParamRequests = [];
		this.taskDetails['taskSectionModels'].forEach(taskSection => {
			console.log(taskSection);
			taskSection.paramList.forEach((taskInst) => {
				taskInstParamRequests.push({
					"header": taskInst.header,
					"name": taskInst.name,
					"value": taskInst.value
				})
			});
		});

		let req_data = {
			"sourceTaskId": this.taskDetails.sourceTaskId,
			"taskInstDesc": this.taskDetails.taskInstDesc,
			"sourceSystemName": this.taskDetails.sourceSystemName,
			"taskStatus": this.taskDetails.taskStatus,
			"assignedCuid": this.taskDetails.assignedCuid,
			"assignedName": this.taskDetails.assignedName,
			"taskType": {
				"id": this.taskDetails.taskType.taskName.id,
				"taskName": this.taskDetails.taskType.taskName.taskName,
				"createdById": this.taskDetails.taskType.taskName.createdById
			},
			"dependencyFlag": this.taskDetails.dependencyFlag,
			"hideTask": this.taskDetails.hideTask,
			"statusCode": this.taskDetails.statusCode,
			"statusMessage": this.taskDetails.statusMessage,
			"version": this.taskDetails.version,
			"workgroupList": wrk_grp,
			"createdById": this.taskDetails.createdById,
			"taskInstParamRequests": taskInstParamRequests
		}
		//req_data = JSON.parse(JSON.stringify(req_data));
		console.log(req_data);
		console.log(this.taskDetails['taskSectionModels']);
		
		this.taskService.saveTaskDetails(req_data).toPromise().then((response: any) => {
			this.loader = false;
			this.loaderTaskDetail = false;
			this.getTaskDetails(true);
			const appName = this.taskDetails.application ? this.taskDetails.application.applicationName : '';
			this.taskService.getAuditResults(this.taskDetails.appTaskInstanceId, appName).toPromise().then((response: any) => {
				this.tempAuditResults = response;
				this.auditResults = this.tempAuditResults;
			}).catch((error: any) => {
				console.log("Error while reading Audit Results");
			})
			this.showViewPage = true;
			this.snackBar.open(response.message, "Okay", {
				duration: 15000,
			});
		}).catch((error: any) => {
			this.loader = false;
			this.loaderTaskDetail = false;
			console.error(error);
			this.snackBar.open(error.message, "Okay", {
				duration: 15000,
			});
		});
	}

	maximizeLeftPanelWindow() {
		var f = $(".resizable1").width() / $('.resizable1').parent().width() * 100;
		$(".width50Per").removeClass('width50Per');
		$(".sticky-Width").removeClass('sticky-Width');
		if (f >= 98) {
			$(".resizable1").css("width", "50%");
			$('.sticky-tab-header').css('width', '41%');
			$(".resizable2").css("width", "50%");
		} else {
			$(".resizable1").css("width", "99%");
			$(".resizable2").css("width", "1%");
			$('.sticky-tab-header').css('width', '81.5%');
		}
	}

	maximizeRightPanelWindow() {
		var f = $(".resizable2").width() / $('.resizable2').parent().width() * 100;

		if (f >= 98) {
			$(".resizable1").css("width", "50%");
			$('.sticky-tab-header').css('visibility', 'visible');
			$('.sticky-tab-header').css('width', '41%');
			$(".resizable2").css("width", "50%");
		} else {
			$(".resizable1").css("width", "1%");
			$(".sticky-tab-header").css("visibility", "hidden");
			$(".resizable2").css("width", "99%");
		}
	}
	/* addActivityLog() {
		const dialogRef = this.dialog.open(ActivityLogDialog, {
			width: '270px',
			data: {
				header: this.header
			}
		});

		dialogRef.componentInstance.onLogAdd.subscribe(result => {
			if (result) {
				let activityLog = new ActivityLog();
				activityLog.activityType = "string";
				activityLog.activityModule = "string";
				activityLog.activityValue = result.activityValue;
				activityLog.activityStatus = "string";
				activityLog.activityDetails = "string";
				activityLog.createdById = "string";
				activityLog.processingTime = "string";
				activityLog.application = "string";

				this.taskService.saveActivityLog(activityLog).toPromise().then((response: any) => {
					this.snackBar.open(response.message, "Okay", {
						duration: 15000,
					});
				}).catch((error: any) => {
					this.snackBar.open(error.message, "Okay", {
						duration: 15000,
					});
				});
			}
		});
		dialogRef.afterClosed().subscribe(result => {
			console.log('The dialog was closed' + result);
		});
	} */

	getData(event) {
		console.log(event);
	}

	onChange() {
		this.options.mode = this.options.inline ? 'inline' : 'popup';
		this.lmosOptions.mode = this.lmosOptions.inline ? 'inline' : 'popup';
	}

	onEdit() {
		this.isEditable = true;
	}

	onCancel() {
		console.log("On cancel called");
		this.isEditable = false;
		this.isCancelAndReissue = false;
		this.dueDateEditable = false;
		this.taskDetails = JSON.parse(JSON.stringify(this.taskDetailsBackup));
	}

	onDueDateEdit() {
		this.dueDateEditable = true;
		// Store temp date
	}

	onCancelCall() {
		/*
		this.taskService.performAction(1,this.processData.appTaskInstanceId,this.userInfo.cuid,{})
		.toPromise().then((response: any) =>{
			this.snackBar.open(response.message, "Okay", {
				duration: 15000,
			});
		}).catch((error: any)=>{
			this.loader = false;
			console.error(error);
			this.snackBar.open(error.error.message, "Okay", {
				duration: 15000,
			});
		});*/
		this.loader = true;
		this.saveTaskDetails();
		this.loader = false;
	}

	onCancelAndReissue() {
		this.isEditable = true;
		this.isCancelAndReissue = true;
	}

	/* onRefreshTaskVersionDetails() {
		this.loaderTaskDetail = true;
		this.taskService.getTaskVersionDetails(this.processData.sourceSystemName, this.processData.taskInstanceId).toPromise().then((response: any) => {
			this.versions = response.versions;
			this.loaderTaskDetail = false;
			this.versionDetailArr = response.versionDetailArr;
			this.versionDetailArrBackup = this.versionDetailArr;
		}).catch(error => {
			this.loaderTaskDetail = false;
			console.error(error)
		});
	} */

	prepareTooltip(property) {
		this.versionDetailObj.tooltip = "";
		this.versionDetailArrBackup.forEach(row => {
			if (row.field === property) {
				this.versions.forEach(version => {
					if (row[version.number]) {
						this.versionDetailObj.tooltip = this.versionDetailObj.tooltip + row[version.number] + "\n";
					}
				});
			}
		});
	}

	/* processAuditLog(activityType: string) {
		let logObj: ActivityLog = new ActivityLog();
		logObj.activityType = activityType;
		logObj.activityValue = this.processData.sourceTaskId;
		logObj.activityStatus = 'SUCCESS';
		logObj.activityModule = 'TASK';
		logObj.application = this.processData.sourceSystemName;
		logObj.processingTime = '0';

		const userId = JSON.parse(localStorage.getItem('fd_user')) != null ? JSON.parse(localStorage.getItem('fd_user')).cuid.toUpperCase() : '';
		logObj.createdById = userId;
		logObj.activityDetails = 'Task Instance Id: ' + this.processData.sourceTaskId + '\n SourceSystem: ' + this.processData.sourceSystemName + '\n Task Status: ' + this.processData.taskStatus + '\n Created By Id: ' + userId + '\n Full Task Notes: ' + (this.taskDetails.taskInstNotes == null ? '' : this.taskDetails.taskInstNotes);
		this.activityLogService.logActivity(logObj);
	} */

	private loadTabDetails(index: number) {
		this.relatedTabs.forEach((tab: any) => tab.active = false);
		this.relatedTabs[index].active = true;
		const tab = this.relatedTabs[index];
		let serviceUrl = tab.service;
		if (tab.label == 'MLTFX') {
			serviceUrl = serviceUrl.replace('replaceEC', this.wcmRequestData.EC);
			serviceUrl = serviceUrl.replace('replaceTN', this.wcmRequestData.TN);
			serviceUrl = serviceUrl.replace('replaceREQ', this.wcmRequestData.REQ);
		} else if (tab.label == 'DLRL' || tab.label == 'DLETH') {
			serviceUrl = serviceUrl.replace('TN', this.wcmRequestData.TN);
			serviceUrl = serviceUrl + this.wcmRequestData.EC;
		} else if (tab.label == 'DSH' || tab.label == 'DETR') {
			serviceUrl = serviceUrl.replace('TN', this.wcmRequestData.TN);
		}
		const request = {url: serviceUrl, httpMethod: tab.httpMethod.toUpperCase()};
		this.taskService.invokeLMOSAPI(request).toPromise().then((response: any) => {
			this.setLMOSResponse(JSON.parse(response.message), index);
			}).catch(error => console.error(error));
		}

	private setLMOSResponse(response: any, index: number) {
		let responseStr = "";
		if (response.data.length > 0) {
			response.data[0].forEach(element => responseStr = responseStr + element + '\n');
		}
		this.relatedTabs[index].content = responseStr;
	}

	/**
	 * 
	 * 1. The input for the TTN field should come from the TN/TTN field on the left side of the screen.
	 * 2. The input for the MC should come from the MC field on the left side of the screen.
	 *  3. The input for the  EC, WP, IST, and RTE should be hard coded with the values shown
	 *	EC = 999
	 *	WP=3
	 *	IST = 112
	 *	RTE = 452
	 *	Narrative = The Screener CUID should precede this verbiage  ‘Returned to WM’
	 */
	private showTransferSection: boolean = false;
	private showRerouteSection: boolean = false;
	private showCloseSection: boolean = false;
	private showReturnTaskToWorkgroupSec = false;

	private comment = '';
	transferTo = '';
	private buttonObj: any = {}
	private lmosAction(buttonObj: any, template: TemplateRef<any>) {
		this.showTransferSection = false;
		this.showRerouteSection = false;
		this.showCloseSection = false;
		this.showReturnTaskToWorkgroupSec = false;
		this.transferTo = "";
		this.comment = '';
		this.buttonObj = buttonObj;
		if (buttonObj.label == 'Return Task To Workgroup') {
			this.showReturnTaskToWorkgroupSec = true;
			this.modalRef = this.modalService.show(template);
		} else if (buttonObj.label == 'Complete') {
			this.taskDetails.taskStatus = 'Complete';
			this.applicationName = [this.taskDetails.sourceSystemName];
			this.saveTaskDetails();
		} else if (buttonObj.label == 'Close') {
			this.showCloseSection = true;
			this.loadDropDowns('List of Values', 'Screening Cause Codes', true);
			this.loadDropDowns('List of Values', 'Screening Disposition Codes', true);
			if(this.dispositionCodes.length == 0 || this.causeCodes.length == 0){
				setTimeout(()=>{
					this.modalRef = this.modalService.show(template);
				}, 2000);
			}else{
				this.modalRef = this.modalService.show(template);
			}
		} else if (buttonObj.label == 'Transfer') {
			this.loadCUIDs();
			this.showTransferSection = true;
			if (this.cuidList.length == 0) {
				setTimeout(() => {
					this.modalRef = this.modalService.show(template);
				}, 2000);
			} else {
				this.modalRef = this.modalService.show(template);
			}
		} else if (buttonObj.label == 'Reroute') {
			this.showRerouteSection = true;
			this.loadWorkgroups();
			if (this.routWorkgroups.length == 0) {
				setTimeout(() => {
					this.modalRef = this.modalService.show(template);
					console.log(this.modalRef);
				}, 2000);
			} else {
				this.modalRef = this.modalService.show(template);
				console.log(this.modalRef);
			}
		} else if (buttonObj.label == 'Cancel') {
			this.taskDetails.taskStatus = 'Cancel';
			this.applicationName = [this.taskDetails.sourceSystemName];
			this.saveTaskDetails();
		}
	}

	private submitDataToLMOS(){
		if(this.showReturnTaskToWorkgroupSec){
			this.showReturnTaskToWorkgroupSec = false;
			this.modalService.hide(1);
			this.loaderTaskDetail = true;
			const user = JSON.parse(localStorage.getItem('fd_user'));
			// let url = this.buttonObj.service;
			var TTN = (this.wcmRequestData.TTN) ? this.wcmRequestData.TTN : '';
			var MC = (this.wcmRequestData.MC) ? this.wcmRequestData.MC : '';
			var TN = (this.wcmRequestData.TN) ? this.wcmRequestData.TN : '';
			var EC = (this.wcmRequestData.EC) ? this.wcmRequestData.EC : '';
			let url = "http://vlodts012.test.intranet:3000/v1/MSCR/TTN/UPDATE?TTN="+ TTN +"&MC="+ MC +"&TN="+ TN +"&EC="+ EC +"&NARR=RETURNED TO WM";
			// if(url){
			// 	url = url.replace('placeMC', this.wcmRequestData.MC);
			// 	url = url.replace('placeTTN', this.wcmRequestData.TTN);
			// 	url = url.replace('placeCUID', user.cuid);
			// }
			// url = url+' '+this.comment;
			const request = {url: url, httpMethod: 'PUT', 'request': ''};
			this.taskService.invokeLMOSAPI(request).toPromise().then((response: any)=>{
				let lmosResponse: any = {};
				this.loaderTaskDetail = false;
				lmosResponse = JSON.parse(response.message);
				this.taskDetails.taskStatus = 'Ready';
				this.taskDetails.assignedCuid = null;
				if (this.taskDetails['taskSectionModels']) {
					for (let i = 0; i < this.taskDetails['taskSectionModels'].length; i++) {
						if (this.taskDetails['taskSectionModels'][i]['paramList']) {
							for (let j = 0; j < this.taskDetails['taskSectionModels'][i]['paramList'].length; j++) {
								var paramData = this.taskDetails['taskSectionModels'][i]['paramList'][j];
								if (paramData.name == 'EC') {
									this.taskDetails['taskSectionModels'][i]['paramList'][j]['value'] = null;
								}
							}
						}
					}
				}
				console.log(this.taskDetails);
				this.taskService.saveTaskDetails(this.taskDetails).toPromise().then((response: any) => {
					this.loader = false;
					this.loaderTaskDetail = false;
					this.getTaskDetails(true);
					// const appName = this.taskDetails.application ? this.taskDetails.application.applicationName : '';
					// this.taskService.getAuditResults(this.taskDetails.appTaskInstanceId, appName).toPromise().then((response: any) => {
					// 	this.tempAuditResults = response;
					// 	this.auditResults = this.tempAuditResults;
					// }).catch((error: any) => {
					// 	console.log("Error while reading Audit Results");
					// })
					this.showViewPage = true;
					this.snackBar.open(response.message, "Okay", {
						duration: 15000,
					});
				}).catch((error: any) => {
					this.loader = false;
					this.loaderTaskDetail = false;
					console.error(error);
					this.snackBar.open(error.message, "Okay", {
						duration: 15000,
					});
				});
				// if(lmosResponse.status == 'ok'){
				// 	this.taskDetails.taskStatus = 'Ready';
				// 	this.applicationName = [this.taskDetails.sourceSystemName];
				// 	this.taskDetails.assignedCuid = '';
				// 	this.taskDetails.taskInstDesc = user.cuid+' '+this.comment;
				// 	this.taskDetails.taskSectionModels.forEach((sectionObj: any) => {
				// 		if(sectionObj && sectionObj.paramList){
				// 			sectionObj.paramList.forEach((field: any)=> {
				// 				if(field.name == 'EC'){
				// 					field.value = '';
				// 				}
				// 			});
				// 		}
				// 	});
				// 	this.saveTaskDetails();
				// }
			}).catch((errorObj: any) => {
				console.error(errorObj);
				this.loaderTaskDetail = false;
			});
		} else if (this.showRerouteSection) {
			this.showRerouteSection = false;
			this.modalService.hide(1);
			this.loaderTaskDetail = true;
			const user = JSON.parse(localStorage.getItem('fd_user'));
			console.log(this.wcmRequestData);
			var TTN = (this.wcmRequestData.TTN) ? this.wcmRequestData.TTN : '';
			var MC = (this.wcmRequestData.MC) ? this.wcmRequestData.MC : '';
			var TN = (this.wcmRequestData.TN) ? this.wcmRequestData.TN : '';
			var EC = (this.wcmRequestData.EC) ? this.wcmRequestData.EC : '';
			let url = "http://vlodts012.test.intranet:3000/v1/MSCR/TTN/UPDATE?TTN="+ TTN +"&MC="+ MC +"&TN="+ TN +"&EC="+ EC +"";
			// console.log(url);
			// return false;
			// if(url){
			// 	url = url.replace('placeMC', this.wcmRequestData.MC);
			// 	url = url.replace('placeTTN', this.wcmRequestData.TTN);
			// 	url = url.replace('placeCUID', user.cuid);
			// }
			// url = url+' '+this.comment;
			const request = {url: url, httpMethod: 'PUT', request: ''};
			this.taskService.invokeLMOSAPI(request).toPromise().then((response: any)=>{
				let lmosResponse: any = {};
				this.loaderTaskDetail = false;
				lmosResponse = JSON.parse(response.message);
				this.taskDetails.notes = this.comment;
				this.taskDetails.workgroupList.push({'workgroupName': this.transferTo});
				console.log(this.taskDetails);
				this.taskService.saveTaskDetails(this.taskDetails).toPromise().then((response: any) => {
					this.loader = false;
					this.loaderTaskDetail = false;
					this.getTaskDetails(true);
					// const appName = this.taskDetails.application ? this.taskDetails.application.applicationName : '';
					// this.taskService.getAuditResults(this.taskDetails.appTaskInstanceId, appName).toPromise().then((response: any) => {
					// 	this.tempAuditResults = response;
					// 	this.auditResults = this.tempAuditResults;
					// }).catch((error: any) => {
					// 	console.log("Error while reading Audit Results");
					// })
					this.showViewPage = true;
					this.snackBar.open(response.message, "Okay", {
						duration: 15000,
					});
				}).catch((error: any) => {
					this.loader = false;
					this.loaderTaskDetail = false;
					console.error(error);
					this.snackBar.open(error.message, "Okay", {
						duration: 15000,
					});
				});
				// return false;
				// if(lmosResponse.status == 'ok'){
				// 	this.taskDetails.taskStatus = 'Ready';
				// 	this.applicationName = [this.taskDetails.sourceSystemName];
				// }
			}).catch((errorObj: any) => {
				console.error(errorObj);
				this.loaderTaskDetail = false;
			});
		} else if (this.showCloseSection) {
			this.showCloseSection = false;
			this.modalService.hide(1);
			this.loaderTaskDetail = true;
			const user = JSON.parse(localStorage.getItem('fd_user'));
			console.log(this.wcmRequestData);
			var TTN = (this.wcmRequestData.TTN) ? this.wcmRequestData.TTN : '';
			var MC = (this.wcmRequestData.MC) ? this.wcmRequestData.MC : '';
			var TN = (this.wcmRequestData.TN) ? this.wcmRequestData.TN : '';
			var EC = (this.wcmRequestData.EC) ? this.wcmRequestData.EC : '';
			var DB = (this.wcmRequestData.DB) ? this.wcmRequestData.DB : '';
			var T = (this.wcmRequestData.T) ? this.wcmRequestData.T : '';
			var C = (this.wcmRequestData.C) ? this.wcmRequestData.C : '';
			var D = (this.wcmRequestData.D) ? this.wcmRequestData.D : '';
			var FL1 = (this.wcmRequestData.FL1) ? this.wcmRequestData.FL1 : '';
			var FL3 = (this.wcmRequestData.FL3) ? this.wcmRequestData.FL3 : '';
			var X = (this.wcmRequestData.X) ? this.wcmRequestData.X : '';
			var TRACE = (this.wcmRequestData.TRACE) ? this.wcmRequestData.TRACE : '';
			console.log(this.closePopupObj);
			let url = "http://vlodts012.test.intranet:3000/v1/MSCR/TTN/CLOSE?DB="+DB+"&MC="+MC+"&EC="+EC+"&TTN="+TTN+"&TN="+TN+"&T="+T+"&D="+D+"&C="+C+"&FL1="+FL1+"&FL2="+this.closePopupObj.fl2+"&FL3="+FL3+"&X="+X+"&NARR="+this.closePopupObj.comment+"&trace="+TRACE+"";
			// console.log(url);
			// return false;
			const request = {url: url, httpMethod: 'PUT', request: ''};
			this.taskService.invokeLMOSAPI(request).toPromise().then((response: any)=>{
				let lmosResponse: any = {};
				this.loaderTaskDetail = false;
				lmosResponse = JSON.parse(response.message);
				this.taskDetails.notes = this.closePopupObj.comment;
				this.taskDetails.taskStatus = 'Ready';
				// this.taskDetails.workgroupList.push({'workgroupName': this.transferTo});
				console.log(this.taskDetails);
				this.taskService.saveTaskDetails(this.taskDetails).toPromise().then((response: any) => {
					this.loader = false;
					this.loaderTaskDetail = false;
					this.getTaskDetails(true);
					this.showViewPage = true;
					this.snackBar.open(response.message, "Okay", {
						duration: 15000,
					});
				}).catch((error: any) => {
					this.loader = false;
					this.loaderTaskDetail = false;
					console.error(error);
					this.snackBar.open(error.message, "Okay", {
						duration: 15000,
					});
				});
			}).catch((errorObj: any) => {
				console.error(errorObj);
				this.loaderTaskDetail = false;
			});
		}
	}

	/**
	 * This method loads the Disposition codes and Cause codes from system parameter.
	 */
	private dispositionCodes = [];
	private dispositionChildCodes = [];
	private dispositionGrandChildCodes = [];
	private causeCodes = [];
	private causeChildCodes = [];
	private causeGrandChildCodes = [];
	private dispositionCodesObjArr = [];
	private causeCodesObjArr = [];
	private fl3Values = ['CBR Good', 'CBR Bad', 'CBR Not Used'];
	private closePopupObj: any = {};
	loadDropDowns(parameterType: string, parameterName: string, includeChilds: boolean){
	    var param = "?type=" + parameterType + "&name=" + parameterName;
	    if (includeChilds) {
	        param += "&include=spi";
	    }
		this.userProfileService.getSystemData(param).toPromise().then((response: any) => {
			if(parameterName == 'Screening Disposition Codes'){
				if(response.systemParameterModels.length > 0){
					this.dispositionCodesObjArr = response.systemParameterModels[0].systemParameterItem;
					this.dispositionCodes = [];
					this.dispositionCodesObjArr.forEach((codeObj: any) => {
						this.dispositionCodes.push(codeObj.value+' - '+codeObj.description);
					})
				}else{
					this.dispositionCodes = [];
				}
			}else if(parameterName == 'Screening Cause Codes'){
				if(response.systemParameterModels.length > 0){
					this.causeCodesObjArr = response.systemParameterModels[0].systemParameterItem;
					this.causeCodes = [];
					this.causeCodesObjArr.forEach((codeObj: any) => {
						this.causeCodes.push(codeObj.value+' - '+codeObj.description);
					})
				}else{
					this.causeCodes = [];
				}
			}
		}).catch(errorObj => console.error(errorObj));
	}

	private causeCodeChanged(fieldType: string){
		setTimeout((fieldType: string)=>{
			if(fieldType == 'parent'){
				const selectedValue = this.closePopupObj.parentCauseCode.split(' - ')[0]
				this.causeChildCodes = [];
				this.causeCodesObjArr.forEach((codeObj: any) => {
					if(codeObj.value == selectedValue){
						const selectArr = codeObj.systemParameterItem;
						selectArr.forEach((element: any) => {
							this.causeChildCodes.push(element.value+' - '+element.description);
						});
					}
				})
			}else if(fieldType == 'child'){
				const parentValue = this.closePopupObj.parentCauseCode.split(' - ')[0];
				const selectedValue = this.closePopupObj.childCauseCode.split(' - ')[0]
				this.causeGrandChildCodes = [];
				this.causeCodesObjArr.forEach((parentObj: any) => {
					if(parentObj.value == parentValue){
						const childArr = parentObj.systemParameterItem;
						childArr.forEach((childObj: any) => {
							if(childObj.value == selectedValue){
								const grandChildCodes = childObj.systemParameterItem;
								grandChildCodes.forEach((grandChildObj: any) => {
									this.causeGrandChildCodes.push(grandChildObj.value+' - '+grandChildObj.description);
								});
							}
						});
					}
				})
			}
		}, 100, fieldType);
	}

	private dispositionCodeChanged(fieldType: string){
		setTimeout((fieldType: string)=>{
			if(fieldType == 'parent'){
				const selectedValue = this.closePopupObj.parentDispositionCode.split(' - ')[0]
				this.dispositionChildCodes = [];
				this.dispositionCodesObjArr.forEach((codeObj: any) => {
					if(codeObj.value == selectedValue){
						const selectArr = codeObj.systemParameterItem;
						selectArr.forEach((element: any) => {
							this.dispositionChildCodes.push(element.value+' - '+element.description);
						});
					}
				})
			}else if(fieldType == 'child'){
				const parentValue = this.closePopupObj.parentDispositionCode.split(' - ')[0];
				const selectedValue = this.closePopupObj.childDispositionCode.split(' - ')[0]
				this.dispositionGrandChildCodes = [];
				this.dispositionCodesObjArr.forEach((parentObj: any) => {
					if(parentObj.value == parentValue){
						const childArr = parentObj.systemParameterItem;
						childArr.forEach((childObj: any) => {
							if(childObj.value == selectedValue){
								const grandChildCodes = childObj.systemParameterItem;
								grandChildCodes.forEach((grandChildObj: any) => {
									this.dispositionGrandChildCodes.push(grandChildObj.value+' - '+grandChildObj.description);
								});
							}
						});
					}
				})
	}
		}, 100, fieldType);
	}

	private cuidList = [];
	loadCUIDs() {
		this.cuidList = [];
		this.taskService.getAllResources().toPromise().then((response: any) => {
			if (response && response.length > 0) {
				response.forEach((resource: any) => {
					this.cuidList.push(resource.cuid);
				})
			}
		}).catch(errorObj => console.error(errorObj));
	}

	private routWorkgroups = [];
	loadWorkgroups() {
		this.routWorkgroups = [];
		this.taskService.getAllWorkgroups().toPromise().then((response: any) => {
			this.routWorkgroups = response;
		}).catch(errorObj => console.error(errorObj));
	}

	checkTaskPermissions(){
		const userDetails = JSON.parse(localStorage.getItem('fd_user'));
		let buttonPermissions = [];
		const buttonsAdnTabsSection: any = this.wcmPageLayout.filter((section: any) => section.sectionHeader == 'Buttons' || section.sectionHeader == 'Related-Tabs');
		const authorizations = userDetails && userDetails.authorizations ? userDetails.authorizations : [];
		buttonPermissions = authorizations.filter(authPermission => authPermission.startsWith('Button') || authPermission.startsWith('Tabs'));
		if(buttonsAdnTabsSection && buttonsAdnTabsSection.length > 0){
			for(let j=0; j<buttonsAdnTabsSection.length; j++){
				let templateButtons = buttonsAdnTabsSection[j].fieldsList;
				for(let i=0; i < templateButtons.length; i++){
					const button = templateButtons[i];
					if(button && (button.label == 'Close' && (buttonPermissions.indexOf('Button_LMOS_close') == -1)) || 
								(button.label == 'Complete' && (buttonPermissions.indexOf('Button_LMOS_complete') == -1)) ||
								(button.label == 'Reroute' && (buttonPermissions.indexOf('Button_LMOS_reroute') == -1)) || 
								(button.label == 'Transfer' && (buttonPermissions.indexOf('Button_LMOS_transfer') == -1)) ||
								(button.label == 'Return Task To Workgroup' && (buttonPermissions.indexOf('Button_LMOS_returnToWorkgroup') == -1)) ||
								(button.label == 'Cancel' && (buttonPermissions.indexOf('Button_LMOS_cancel') == -1)) ||
								(button.label == 'UnBlock' && (buttonPermissions.indexOf('Button_unblock') == -1)) ||
								(button.label == 'DLETH' && (buttonPermissions.indexOf('Tabs_LMOS_DLETH') == -1)) ||
								(button.label == 'DLRL' && (buttonPermissions.indexOf('Tabs_LMOS_DLRL') == -1)) ||
								(button.label == 'DSH' && (buttonPermissions.indexOf('Tabs_LMOS_DSH') == -1)) ||
								(button.label == 'DETR' && (buttonPermissions.indexOf('Tabs_LMOS_DETR') == -1)) ||
								(button.label == 'MLTFX' && (buttonPermissions.indexOf('Tabs_LMOS_MLTFX') == -1))){
						templateButtons.splice(i, 1);
						i--;
					}
				}
			}
		}
	}

	OnAction(action) {
		if (action == 'Accept' || action == 'Complete' || action == 'UnBlock') {
			if (action == 'UnBlock') {
				const userDetails = JSON.parse(localStorage.getItem('fd_user'));
				const authorizations = userDetails && userDetails.authorizations ? userDetails.authorizations : [];
				if (authorizations.indexOf('Button_unblock') === -1) {
					this.errorMessage = 'You do not have access to unblock the task';
					this.snackBar.open(this.errorMessage, "Okay", {
						duration: 5000,
					});
					return;
				}
			}
			// checkedRowList.forEach(element => {
				var obj = {};
				obj['id'] = this.taskDetails.id;
				obj['taskStatusActionRequest'] = {
					"action": action,
					"assignCuid": "",
					"taskInstanceId": "",
					"sourceSystem": "",
					"modifiedById": "",
					"comments": "",
					"workgroupList": [
						{
							"workgroupName": "",
							"roles": [
								""
							]
						}
					],
					"paramRequests": [
						{
							"header": "",
							"name": "",
							"paramFieldLayout": {},
							"value": "",
							"jsonDescriptor": "",
							"pageLayoutFieldId": ""
						}
					],
					"taskId": ""
				};
				console.log(obj);
				this.taskService.TaskAction(obj, action).toPromise().then((result:any)=>{
					this.loader = false;
					this.snackBar.open(result.message, "Okay", {
						duration: 15000,
					});
				}, (error:any)=>{
						console.log(error);
						this.loader = false;
						this.snackBar.open(error.error.message, "Okay", {
							duration: 15000,
						});
				});
			// });
		} else {
			this.taskService.getAllResources().toPromise().then((response: any) => {
				this.selectedAction = action;
				var ModalData = this.getModelData(action);
				var UserDetails = JSON.parse(localStorage.getItem('defaultValue'));
				var field = [{
				  dataType: '',
				  editable: true,
				  error: ModalData.fieldError,
				  fieldName: ModalData.fieldName,
				  fieldValue: ModalData.fieldValue,
				  label: ModalData.fieldLabel,
				  mandatory: true,
				  multiline: false,
				  service: "",
				  size: "",
				  type: "dropdown",
				  visible: true,
				  dropdownList: response
				}];
				var output = {};
				output[ModalData.fieldName] = '';
				var addRole: any = {
				  buttons: ModalData.actions,
				  fields: field,
				  title: ModalData.label,
				  output: output,
					from: 'taskassignedcuid',
					Reason: (this.selectedAction == 'Accept') ? UserDetails.personalInfo.cuid : ''
				}
				this.modalDetails = { ...this.modalDetails, ...addRole, className: "taskassignedcuid",error: {}, isDeleteConfirm: false };
				this.modalChild.showModal();
			}).catch(errorObj => console.error(errorObj));
		}
	}

	getModelData(value){
		return {
		  "fieldName": value + "_cuid",
		  "visible": true,
		  "editable": false,
		  "label":value,
		  "type": "select",
		  "fieldValue": "",
		  "mandatory": true,
		  "required": true,
		  "Sectionheader": value,
		  "service": null,
		  "fieldLabel": value + " cuid",
		  "disabled": false,
		  "placeholder": null,
		  "fieldError": "Please select one attribute",
		  "class": "form-control custom-select d-block w-100",
		  "actions": [
			{
			  "Sectionheader": "Cancel",
			  "fieldName": "Cancel",
			  "visible": true,
			  "service": null,
			  "fieldLabel": "Cancel",
			  "disabled": false,
			  "label": "Cancel",
			  "type": "button",
			  "title": "Cancel",
			  "fieldType": "button",
			  "class": "search-btn reset-bgclr",
			  "primary": false
			},
			{
			  "Sectionheader": "Add",
			  "fieldName": "Add",
			  "visible": true,
			  "service": null,
			  "fieldLabel": "Add",
			  "disabled": false,
			  "label": "Ok",
			  "type": "submit",
			  "title": "Add",
			  "fieldType": "button",
			  "class": "search-btn",
			  "primary": true
			}
		  ]
		}
	  }

	buttonClicked(fromModal) {
    console.log(fromModal);
    // var checkedRowList=_.filter(this.displayTaskResult,function(task){
    //   return task.isChecked;
    // });
    console.log(this.taskDetails);
    // this.taskDetails.forEach(element => {
			var obj = {};
			var assignCuid='';
      var value='';
      var name='';
      if(this.selectedAction=='Cancel' || this.selectedAction == 'Block')
      {
        assignCuid='';
        name= (this.selectedAction=='Cancel')? "cancel_reason": (this.selectedAction == 'Block')? 'blocking_reason' : '';
        value=localStorage.getItem('Reason');
      }
      else
      {
		  //assignCuid=fromModal.modal.output[this.selectedAction + '_cuid'];
		  assignCuid=fromModal.modal.fields[0].fieldValue;
      }
	  	obj['id'] = this.taskDetails.id;
      obj['taskStatusActionRequest'] = {
        "action": this.selectedAction,
        "assignCuid": assignCuid,
        "taskInstanceId": "",
        "sourceSystem": "",
        "modifiedById": "",
        "comments": "",
        "workgroupList": [
          {
            "workgroupName": "",
            "roles": [
              ""
            ]
          }
        ],
        "paramRequests": [
          {
            "header": "",
            "name": name,
            "paramFieldLayout": {},
            "value": value,
            "jsonDescriptor": "",
            "pageLayoutFieldId": ""
          }
        ],
        "taskId": ""
      };
      console.log(obj);
      this.taskService.TaskAction(obj, this.selectedAction).toPromise().then((result:any)=>{
		this.loader = false;
		this.snackBar.open(result.message, "Okay", {
			duration: 15000,
		});
      }, (error:any)=>{
          console.log(error);
		  this.loader = false;
          this.snackBar.open(error.error.message, "Okay", {
            duration: 15000,
          });
      });
    // });
  }
}


/* @Component({
	selector: 'activity-log-dialog',
	templateUrl: 'activity-log-dialog.html',
})
export class ActivityLogDialog {

	model: any = {};
	onLogAdd = new EventEmitter();

	constructor(public dialogRef: MatDialogRef<ActivityLogDialog>,
		@Inject(MAT_DIALOG_DATA) public data: any) {
	}

	onActivitySubmit() {
		this.dialogRef.close();
		this.onLogAdd.emit(this.model);
	}

	onNoClick(): void {
		this.dialogRef.close();
	}

} */


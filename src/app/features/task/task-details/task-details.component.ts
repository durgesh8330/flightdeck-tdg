import { ActivityLogService } from './../../activity-log/activity-log.service';
import {
	Component, OnInit, Input, AfterViewChecked, ElementRef, ViewChild, AfterViewInit,
	EventEmitter, Inject, TemplateRef, NgZone, OnDestroy, ChangeDetectorRef, OnChanges, SimpleChanges
} from '@angular/core';
import { TaskService } from '../task.service';
import { TabService } from '@app/core/tab/tab-service';
import { Tab } from '@app/core/tab/tab.model';
import { ProcessComponent } from '@app/core/page-content/process';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import * as $ from 'jquery';
import ElementQueries from 'css-element-queries/src/ElementQueries';
import { FormControl, FormGroup } from "@angular/forms";
import { ActivityLog } from '@app/features/task/task-details/activity-log.model';
import { debug, isObject, isArray } from 'util';
import { NotificationService } from '@app/core/services';
import { timeout } from 'q';
import { element } from '@angular/core/src/render3/instructions';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { UserProfileService } from '@app/features/user-profile/user-profile.service';
import { ModalComponent } from '@app/shared/modal/modal.component';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { combineLatest, Subscription } from 'rxjs';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
am4core.useTheme(am4themes_animated);

import { ChartType } from 'chart.js';
import { MultiDataSet, Label } from 'ng2-charts';
import { SmeTaskAssignComponent } from '../sme-task-assign/sme-task-assign.component';
import { SmetaskAddCommentDialogComponent } from '../smetask-add-comment-dialog/smetask-add-comment-dialog.component';
import { ConfDialogComponent } from '../conf-dialog/conf-dialog.component';
import { SprtaskdialogComponent } from '../sprtask/sprtaskdialog/sprtaskdialog.component';
import { SprtaskcanceldialogComponent } from '../sprtask/sprtaskcanceldialog/sprtaskcanceldialog.component';
import { DatePipe } from '@angular/common';
import { TableComponent } from '@app/shared/table/table.component';
import { AppService } from '@app/app.service';
import { AuditLog } from '@app/core/store/auditlog/AuditLog';
import { MyAbstractTask } from '../my-abstract-task';
import { DataStorageService } from '../data-storage.service';
import { LocalDateTimeService } from '@app/core/services/local-date-time.service';
import * as moment from 'moment';



const PARENT:string = 'parent';
const CHILD:string = 'child';
declare var $: any
@Component({
	selector: 'sa-task-details',
	templateUrl: './task-details.component.html',
	styleUrls: ['./task-details.component.css'],
	providers: [DatePipe]
})



export class TaskDetailsComponent extends MyAbstractTask implements OnInit, ProcessComponent, AfterViewChecked, AfterViewInit, AfterViewInit, OnDestroy {
	@ViewChild('resizable1') r1: ElementRef;
	@ViewChild('resizable2') r2: ElementRef;
	@ViewChild(ModalComponent) modalChild: ModalComponent;
	@ViewChild(BsModalService) modal: BsModalService;
	@ViewChild(TableComponent) tableComponent: TableComponent;
	@Input() processData: any;
	@Input() isHeaderControlVisible: boolean = true;

	public dateTime: any;

	public activityLog = {};
	public taskDetails: any = {};
	private taskDetailsBackup: any = {};
	public showViewPage = true;
	public loader = false;
	public isApplicationList: boolean = false;
	public isTaskTypeList: boolean = false;
	public showViewSection: boolean = true;
	public tabs = new Array<Tab>();
    public hideSpanDate= false;
	public isSPRApplication: boolean = false;
	public isEditable: boolean = false;
	public isCancelAndReissue: boolean = false;
	public dueDateEditable: boolean = false;
	public todayDate = new Date();
	public afterDate = new Date();
	public parentTask: any;
	public retryMethodType = false;
	public retryRequestHeader = false;
	public retryRequestURL = false;
	public retrySDWANAssigned = false;
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
	public taskTypeListSubscription: Subscription;
	public skillList = [];
	public workgroupList = [];
	public workGroupListSubscription: Subscription;
	public resourcesList = [];
	public resourceListSubscription: Subscription;
	public blockingReasonsList = [];
	private approvedCompleteActions = [];

	public pageLayout = {};
	public pageLayoutTemplate = [];
	public wcmPageLayout = [];
	public displayWCMDetails = false;
	modalRef: BsModalRef;
	subscriptions: Subscription[] = [];

	public logPageLayout: any = {};
	public editFields=false;
	public editcheck:any;
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
	TabloaderTaskDetail: boolean = false;
	loaderDeviceDetail: boolean = false;
	loaderLogDetails: boolean = false;
	loaderLmosTaskPopup = false;
	toppings = new FormControl();
	isSortAsc: boolean = false;
	workGroupValues = [];
	skillValues = [];
	taskTypeValues = [];
	applicationValues = [];
	userInfo: any;
	applicationTest = [];

	public options: any;
	public lmosOptions: any = { multiple: false, tags: true };
	public tempDate: any;
	public value: string[];
	public versions = [];
	actionList: any = [
		{ value: "Select" },
		{ value: "Assign" },
		{ value: "Complete" },
		{ value: "Block" },
		{ value: "Accept" },
		{ value: "Cancel" },
		{ value: "UnBlock" },
		{ value: "Dispatch" }
    ];
	actionListTD = [];
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
	SPRTask = false;
	SMETask = false;
	LMOSTask = false;
	SAOTask = false; //SAO layout
	SDWANTask : boolean = false;
	TaskDetails = false;
	RCMACTask = false;
	HeaderButton: any;
	Summary: any;
	TaskInfo: any;
	Details: any;
	TableFiedls: any;
	public customerDetails: any = {};
	statusTag: any = [];
	tablePaginationData: any = [];
	currentPageNumber: number;
	displayTaskResult: Array<any> = [];
	displayTaskHeaders = [];
	activeSort = '';
	actionButton: any = [];
	sectionheader = '';
	actionColumn: any = [];
	paginationLimitOption = 10;
	Newpagination: any = {};
	totalPage = 0;
	PageLength = 0;
	pagination: any = {};
	nextDisable: boolean = false;
	previousDisable: boolean = true;
	public currentPageLimit: number = 10;
	totalPageData: number;
	taskParentChildList: any = {};
	parentTaskHistory: any = [];
	timelineHistory: any = [];
	parentTaskAssignLog: any = [];
	childHistoryList: any = [];
	grandChildList: any = [];
	ChildData: any = {};
	tableData: any = [];
	subLoader: boolean = false;
	public blockingCategory:any = [];
	LogDetailsParameter: any = {
		from: 'logDetails',
		title: 'Log Details',
		isSortAsc: false,
		globalSearch: ''
	};
    SAOLayout: any = []; //SAO layout
    allowSAORetry = false;
	paginationChildren: any = {};
	actionColumnChildren: any = [];
	childrenSystemParameter: any = { //SAO layout children table
		from: 'childTasks', 
		title: 'Child Tasks', 
		isSortAsc: false, 
		globalSearch: '' 
	};
	SDWANLayout : any = [];
	filter = [];

	globalNotes: any = [];
	note: any = [];
	paginationglobal: any = {};
	GlobalNotesParameter: any = {
		from: 'globalNotes',
		title: 'Global Note',
		isSortAsc: false,
		globalSearch: ''
	};
	displayTaskResultGlobalNote: Array<any> = [];
	actionButtonGlobalNote: any = [];
	sectionheaderGlobalNote = '';
	actionColumnGlobalNote: any = [];
	globalNoteTableData: any = [];
	globalNotesPageLayout: any = [];
	refreshGlobalNotes = false;

	RetryEditButton:any=false;

	paginationPredecessorInstances: any = {};
	paginationSuccessorInstances: any = {};
	predTaskInstances: any = {};
	succTaskInstances: any = {};
	DependencyParameterPredecessor: any = {
		from: 'taskDependency',
		title: 'Predecessors',
		isSortAsc: false,
		globalSearch: ''
	};
	DependencyParameterSuccessor: any = {
		from: 'taskDependency',
		title: 'Successors',
		isSortAsc: false,
		globalSearch: ''
	};
	actionButtonDependency: any = [];
	sectionheaderDependency = '';
	actionColumnDependency: any = [];
	dependencyTableData: any = [];
	dependencyPageLayout: any = [];

	res2Full: any = false;
	arrayOfCategory;
	public completeData;
	public doughnutChartLabels: Label[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
	public doughnutChartData: MultiDataSet = [
		[350, 450, 100]
	];
	public doughnutChartType: ChartType = 'doughnut';
	private donutColors = [
		{
			backgroundColor: [
				'rgba(77, 169, 68, 1)',
				'rgba(56, 128, 170, 1)',
				'rgba(235, 163, 44, 1)',
				'rgba(228, 59, 52, 1)'
			]
		}
	];
	public chartOptions: any = {
		legend: { position: 'left' }
	}
	public chartjsData: any = {
		"sourceData": []
	};

	visible = true;
	selectable = true;
	removable = true;
	addOnBlur = true;
	readonly separatorKeysCodes: number[] = [ENTER, COMMA];
	NewV2Data: any = [];
	CustomerAttributorData: any = [];
	data: any = [];
	message: any = '';
	isModalErrMsgSet = false;
	IsSucess = false;
	IsError = false;
	IsOpenFullDiv = false;
	OpenFullDivData: any;
	private chart: am4charts.XYChart;
	IsHalfScreen = false;
	LmosButton: any = [];
	ShowUnmappedFieldSection: boolean = false;
	facilitiesData: any = [];
	TempfacilitiesData: any = [];
	DisplayfacilitiesData: any = [];
	systemParameter: any = {
		from: 'facilities',
		title: 'Facilities',
		isSortAsc: false,
		globalSearch: ''
	};
	CustomerContacted: any = ['Yes', 'No'];
	RerouteResult: any = ['Affecting Service', 'Out of Service'];
	IsOpenPopup = false;
	SetHeight: number;
	TaskLoader = true;
	GetAllReRouteWorkGroupsRes: any = [];
	loaderLmosTaskRelativeTab = false;


	boxedSectionModel: any = {
		"fieldList": [{
			Header: "Facilities",
			type: "tableRecord",
			fieldname: "doesnot matter",
			value: {
				"XCON": "201 POPLAR",
				"BINDINGPOST": "0000",
				"COLOR": "BLW-BKO",
				"CABLENAME": "1",
				"FAC": "F1",
				"PAIR": "1612"
			},
			visible: true
		},
		{
			Header: "Facilities",
			type: "tableRecord",
			fieldname: "doesnot matter",
			value: {
				"XCON": "X 7820 COUNTY RD 115",
				"BINDINGPOST": "0008",
				"COLOR": "BLW-BKO",
				"CABLENAME": "7800CR115",
				"FAC": "F2",
				"PAIR": "0008"
			},
			visible: true
		},
		{
			Header: "AnotherExample Table",
			type: "tableRecord",
			fieldname: "I told you doesnot matter",
			value: {
				'X': '111',
				'Y': '222',
				'Z': '333',
				'L': '444'
			},
			visible: true
		}
		]
	}
	facilityData = {
		"header": "Facilities",
		"paramList": [
			{
				"type": "tableData",
				"name": "1",
				"paramFieldLayout": {},
				"value": {
					"facility": "Facility1",
					"XCON": "HOPKINS SUB STATION",
					"BINDINGPOST": "0001",
					"COLOR": "",
					"CABLENAME": "HVP7820CR",
					"FAC": "FZ",
					"PAIR": "0001"
				},
				"jsonDescriptor": "",
				"pageLayoutFieldId": "string"
			},
			{
				"type": "tableData",
				"name": "2",
				"paramFieldLayout": {},
				"value": {
					"facility": "Facility2",
					"XCON": "HOPKINS SUB STATION 1",
					"BINDINGPOST": "0002",
					"COLOR": "",
					"CABLENAME": "HVP7820CR",
					"FAC": "FZ",
					"PAIR": "0002"
				},
				"jsonDescriptor": "",
				"pageLayoutFieldId": "string"
			},
			{
				"type": "tableHeader",
				"name": "tableHeaders",
				"value": "",
				"jsonDescriptor": {
					"tableHeaders": [
						{
							"columnHeader": "Facility",
							"columnKey": "facility",
							"position": 1
						},
						{
							"columnHeader": "XCON",
							"columnKey": "XCON",
							"position": 6
						}
					]
				},
				"pageLayoutFieldId": "string"
			}
		]
	};
	DisplayDLRTData = false;
	DisplayDLETHData = false;
	DLETHResponsStatus = false;
	MCNValue = '';
	PredictorData = '';
	countryIsoCode = 'US';
	ClosePopupLoader = false;
	RelatedTabMenuButtonDisabled = true;
	ClosePopupMinDate = new Date();
	currentTaskId : any;
	metaList: any = [
		{ value: "orderNumber", display:"OrderNumber" },
		{ value: "productId", display:"ProductPackageId" },
		{ value: "taskId", display: "TaskId" }
	];
	exportValues : any[];
	template = '';
	clikedMetaValue: any;
	//Method to pass meta data value clicked in dropdwon
	UpdateFields(){
		this.editFields=true;
	}
	CancelEditFields(){
		this.editFields= false;
	}
	metaSubmit(dataClicked: String) {
		this.clikedMetaValue = dataClicked;
		this.message = '';
		this.IsSuccess = false;
		this.IsError = false;
		
			if (!dataClicked || dataClicked == "Select") {
				this.IsError = true;
				this.message = "Please Select Anyone Of the Meta Data";
				setTimeout(() => {
					this.IsError = false;
				}, 7000);
				
			} else {
			this.searchGlobalNotes(this.taskDetails.id,dataClicked);
			}
	}

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

	public LMOSLayoutDetails: any = {};
	public isECAvailable: any = false;
	public isForceClose: boolean = false;
	public savingNotes: boolean = false;
	public loggedInUserDetails;
	public loggedInPermissibleUser= false;
	public updatedloggedInPermissibleUser= false;

	constructor(protected taskService: TaskService, private zone: NgZone, protected tabService: TabService, protected snackBar: MatSnackBar,
		private dialog: MatDialog, private activityLogService: ActivityLogService, private notificationService: NotificationService,
		protected modalService: BsModalService, protected userProfileService: UserProfileService, private app: AppService,
		public _ref: ChangeDetectorRef, protected dataStorageService: DataStorageService,
		private dateConvertor:LocalDateTimeService,
		private datePipe: DatePipe) {
		super(tabService, taskService, snackBar, dataStorageService, 'Task Details', modalService, userProfileService, _ref);
		this.loader = true;
		this.subscribeResourcesList();
		this.subscribeWorkGroupList();
		this.subscribeTaskTypeList();
		this.listOfvaluesChildDeatails();
		this.fields.push(this.taskInstParams);
		this.tabService.contentComponentService.subscribe((tabs) => {
			this.tabs = tabs;
		});
	}


	subscribeWorkGroupList() {		
		this.workGroupListSubscription = this.taskService.workGroups.subscribe(workGroups => {

			if (workGroups) {
				this.workgroupList = workGroups;
			} else {
				this.taskService.getWorkgroups().toPromise().then((response: any) => {
					this.taskService.workGroups.next(response);
					// this.workgroupList = response;

				}).catch((errorObj: any) => {
					this.loader = false;
					this.loaderLmosTaskPopup = false;
				});
			}
		});
	}

	subscribeTaskTypeList() {
		this.taskTypeListSubscription = this.taskService.taskTypes.subscribe(taskTypeList => {

			if (taskTypeList) {
				this.taskTypeList = taskTypeList;
				this.isTaskTypeList = true;
			} else {

				this.taskService.getTaskTypes().toPromise().then((response: any) => {
					// this.loader = false;
					// this.loaderTaskDetail = false;
					this.taskService.taskTypes.next(response)
					// this.taskTypeList = response4;
					// this.isTaskTypeList = true;
					// this.getTaskDetails(false, false);
				}).catch((errorObj: any) => {
					this.loader = false;
					this.loaderLmosTaskPopup = false;
				});
			}


		})
	}

	subscribeResourcesList() {
		this.resourceListSubscription = this.taskService.resources.subscribe(resourceList => {

			if (resourceList) {
				this.resourcesList = resourceList;
			} else {
				this.taskService.getAllResources().toPromise().then((response: any) => {
					this.taskService.resources.next(response);
				}).catch((errorObj: any) => {
					//    this.loader = false;
				});
			}


		})
	}
	ngOnChanges(changes: SimpleChanges) {

	}

	getglobalNotesPageLayoutTemplate(){
		var url = '/PageLayoutTemplate/Get/tblTask_GlobalNotes';
				this.taskService.callGetUrl(url).toPromise().then((res) => {
					this.globalNotesPageLayout = res;
			var response: any = res;
			//this.leftSideTabs.tab = 'global-notes';
            this.paginationglobal = response.pageLayoutTemplate[1].fieldsList[0];
            this.actionButtonGlobalNote = response.pageLayoutTemplate[2].fieldsList;
            this.sectionheaderGlobalNote = response.pageLayoutTemplate[0].sectionHeader;
            this.actionColumnGlobalNote = response.pageLayoutTemplate[0].fieldsList;
            this.filter = [];
			
            this.paginationglobal.selectedLimit = this.paginationglobal.pageLimitOptions[0];
            this.paginationglobal.pageNumber = 0;
            this.paginationglobal.pageSize = 10;
            this.paginationglobal.maxPageLimit = 10;
            this.currentPageNumber = 1;
            this.paginationglobal.currentPageNumber = 1;
            this.paginationglobal.totalRecords = 0;
			this.paginationglobal.pager = {startIndex: 0, endIndex:  this.pagination.selectedLimit - 1}
			this.paginationglobal.allItems = [];
			this.paginationglobal.allItems = this.globalNotes;
			this.paginationglobal.totalRecords = this.paginationglobal.allItems.length;
			if(this.refreshGlobalNotes){
				this.loader=false;
			}	
			
			this.GlobalNotesParameter = {
				...this.GlobalNotesParameter,
				add: true,
				editable: false,
                sectionheader: this.sectionheaderGlobalNote,
                header: this.actionColumnGlobalNote,
                tableData: []
			}
		this.loader = false;
		this.globalNoteData = true;
		//exportValues to display on Export Button
		response.pageLayoutTemplate[2].fieldsList.forEach(row => {
			if(row['fieldName'] =="Export")
			this.exportValues = row['fieldValue'];
		});

		}).catch((errorObj: any) => {
			this.loader = false;
		});
	}

	 async searchGlobalNotes(id: any,metaData: any) {
		 this.loader = true;
	 await this.taskService.getGlobalNotes(id,metaData).toPromise().then((result: any) => {
            if (result){
				this.globalNotes = result;
				this.globalNotes.forEach(row => {
					row['CreatedDate'] = this.datePipe.transform(row['CreatedDate'], 'yyyy-MM-dd HH:mm:ss');
					row['ModifiedDate'] = this.datePipe.transform(row['ModifiedDate'], 'yyyy-MM-dd HH:mm:ss');
				});
				
				this.GlobalNotesParameter.tableData = [];
				this.GlobalNotesParameter.tableData = result;
				this.GlobalNotesParameter.tableData.forEach(row => {
					row['rowEdit'] = false;
				});
				this.getglobalNotesPageLayoutTemplate();
		
            } else {
				// this.loader = false;
				if(this.refreshGlobalNotes){
					this.loader=false;
				}	
                this.message = "No global notes are available for this task";
            }
        }, (error: any) => {
            this.loader = false;
            this.message = "Error Searching for Global notes";
        });
	};

	onRefreshGlobalNotes() {
		this.loader=true;
		this.refreshGlobalNotes = true;
		this.searchGlobalNotes(this.taskDetails.id,null);
		this.clikedMetaValue = "orderNumber";
    };

	setGlobalNoteRequestobj(data: any){
		this.note = {  
				"Note":{ 
				   "Note":data.Note,
				   "NoteType":data.NoteType,
				   "Source":data.Source,
				   "CreatedBy":data.CreatedBy,
				   "CreatedDate":data.CreatedDate,
				   "ModifiedBy":data.ModifiedBy,
				   "ModifiedDate":data.ModifiedDate
				}
			 }
		}

	
	
	async ngOnInit() {
	
		this.clikedMetaValue = "orderNumber";		
		this.options = {
			multiple: true,
			tags: true
		};
		this.loader = true;
		this.loaderLmosTaskPopup = true;
		//  GETCWM-7111
		if(this.processData.isParentTaskClicked){
			this.getParentTaskProcessData();
		}else{
			await this.getTaskDetails(false, false);
			this.loadBlockingReasons();	 		
		}

        const userInfo = {} = JSON.parse(localStorage.getItem('fd_user'));
		this.getECAvailable(userInfo);
	

		this.loaderTaskDetail = true;
		
		this.loaderTaskDetail = false;
		
		this.isTaskTypeList = true;
		// this.getTaskDetails(false, false);

		//await this.getLogDetails();
		//await this.getActivityLog();
		this.showLogs = true;

		// Log field
		this.showLogs = true;
		this.logHeaders = [];

		for (let i = 0; i < this.logDetails.length; ++i) {
			let obj = {};
			for (let j = 0; j < this.logHeaders.length; ++j) {
				if (this.logDetails[i] && this.logDetails[i][this.logHeaders[j]['fieldName']]) {
					obj[this.logHeaders[j]['fieldName']] = this.logDetails[i][this.logHeaders[j]['fieldName']];
				} else {
					obj[this.logHeaders[j]['fieldName']] = '';
				}
			}
			this.logData.push(obj);
		}

		if (this.pageLayout['pageLayoutTemplate']) {
			this.pageLayout['pageLayoutTemplate'].map((template) => {
				if (template.fieldsList) {
					for (let i = 0; i <= template.fieldsList.length; ++i) {
						if (template.fieldsList[i] && template.fieldsList[i]['service']) {
							this.loader = true;
							this.taskService.callGetUrl(template.fieldsList[i]['service']).toPromise().then((res) => {
								// this.loader = false;
								template.fieldsList[i]['dataSource'] = res;
							}).catch((errorObj: any) => {
								this.loader = false;
							});

						}
					}
				}
			});
		}

		this.userInfo = userInfo;
		
	}

	async getPageLayoutTemplateForLogDetailsAndInit(){
		this.showLogs = false;
		this.loader = true;
		await this.taskService.callGetUrl('/PageLayoutTemplate/Get/Log%20Details%20Table').toPromise().then(async (resp) => {
			console.log(resp);
			this.logPageLayout = resp;
			
			this.pagination = this.logPageLayout.pageLayoutTemplate[1].fieldsList[0];
			this.actionButton = this.logPageLayout.pageLayoutTemplate[2].fieldsList;
			this.sectionheader = this.logPageLayout.pageLayoutTemplate[0].sectionHeader;
			this.actionColumn = this.logPageLayout.pageLayoutTemplate[0].fieldsList;
			this.filter = [];

			this.pagination.selectedLimit = this.pagination.pageLimitOptions[0];
			this.pagination.allItems = [];
			this.pagination.pageNumber = 0;
			this.pagination.pageSize = 100;
			this.pagination.currentPageNumber = 0;
			this.pagination.pager = { startIndex: 0, endIndex: this.pagination.selectedLimit - 1 };

			this.LogDetailsParameter = {
				...this.LogDetailsParameter,
				sectionheader: this.sectionheader,
				header: this.actionColumn,
				tableData: []
			}
			this.loaderLmosTaskPopup = false;

			this.taskDetails.id = this.processData.id;
			await this.getActivityLog();
			this.loader = false;
		}).catch((errorObj: any) => {
			this.loader = false;
			this.loaderLmosTaskPopup = false;
		});

	}
	async getECAvailable(userInfo){

		if (userInfo.params && userInfo.params.length > 0) {
			userInfo.params.forEach(element => {
				if (element.name == "EC" && element.value) {
					this.isECAvailable = true;
				}
			});
		}
	}
	ngAfterViewInit() {
		this._ref.detectChanges();
		ElementQueries.listen();
		let env = this;
		$(function () {

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



	ngAfterViewChecked() {
		this._ref.detectChanges();
	}

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
			// this.loader = false;
			this.loaderTaskDetail = false;
		
		} else if (this.dueDateEditable) {

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
			this.loaderTaskDetail = true;
			this.saveTaskDetails();
			this.dueDateEditable = false;

		} else {
			this.saveTaskDetails();
		}
	}

	onRefresh(){
		this.getTaskDetails(false, false);
	}

	getChilrenTaks(){
		//get and assign children data to children table
		for (let i = 0; i < this.SAOLayout.length; i++) {
			if (this.SAOLayout[i]['sectionHeader'] == "Children") {
				let requestData: any = {
					"parentTaskId": this.processData.id,
				}
				this.taskService.searchTaskParentChild(requestData).toPromise().then((response: any) => {
					console.log(response);
					this.SAOLayout[i]['tableData'] = response.taskResults || [];
					var headers = [];
					for (let i = 0; i < this.SAOLayout.length; i++) {
						if (this.SAOLayout[i]['sectionHeader'] == "Children") {
							headers = this.SAOLayout[i]['fieldsList']
						}
					}
					this.childrenSystemParameter = {
						...this.childrenSystemParameter,
						sectionheader: "Children",
						header: headers,
						tableData: []
					}
					this.actionColumnChildren = headers;
					this.paginationChildren.pageLimitOptions = [10,20,50,100];
					this.paginationChildren.selectedLimit = 10;
					this.paginationChildren.pageNumberText = "Page Number -";
					this.paginationChildren.pageNumber = 0;
					this.paginationChildren.pageSize = 10;
					this.paginationChildren.maxPageLimit = 10;
					this.paginationChildren.currentPageNumber = 1;
					this.paginationChildren.totalRecordsText = "Total number of records: ";
					this.paginationChildren.totalRecords = 0;
					this.paginationChildren.pager = {startIndex: 0, endIndex:  this.paginationChildren.selectedLimit - 1}
					this.paginationChildren.allItems = [];
					this.paginationChildren.allItems = response.taskResults || [];
					this.paginationChildren.totalRecords = this.paginationChildren.allItems.length;
					//console.log("assigning .taskResults of result to Childer table data-->", response, response.taskResults);
					this.onRefreshTD();
				});
			}
		}
	}

	setUrls(layoutUrls, keyUrls ){
		if(layoutUrls){
			layoutUrls = keyUrls.concat(layoutUrls);
		}else{
			layoutUrls = keyUrls;
		}
		return layoutUrls;
	}

	onRefreshTaskDetails(loaderType: string) {
		if (loaderType === 'taskdetails' || loaderType === 'logdetails') {
			this.loaderTaskDetail = true;
		} else {
			this.loaderDeviceDetail = true;
		}
		this.getTaskDetails(true, false);
	}
	saveDetails(){
		var	taskdetailsID=this.taskDetails.id
		let taskDetailsSourceSystem = this.taskDetails.sourceSystemName;
		let updateTaskDetails;
		this.taskService.getTask(taskdetailsID, taskDetailsSourceSystem).
			toPromise().then((response: any) => {
				updateTaskDetails=response;
				if((this.loggedInUserDetails).toUpperCase() == (updateTaskDetails.assignedCuid).toUpperCase()){
						this.loader = true;
						this.taskService.saveTaskDetails(this.taskDetails).toPromise().then((response: any) => {
							this.loader = false;
							this.editFields=false;
							this.IsSucess = true;
							this.message = response.message;
							setTimeout(() => {
								this.IsSucess = false;
							}, 7000);
						}).catch((error: any) => {
							this.loader = false;
							this.loaderTaskDetail = false;
							this.IsError = true;
							this.message = error.error.message;
							setTimeout(() => {
								this.IsError = false;
							}, 7000);
						});
					
				}
				else{
					this.editFields= false;
					this.IsError = true;
					this.message= "Assigned User and Logged In User are not same"
				}
			});

}
	//currentTaskId: any;
	tableDetailTableSection : any = {};
	showFacility : boolean = true;
	isActionColumnPresent : boolean = false;
	getTaskDetails(refreshClicked: boolean, removeTab: boolean) {

		this.isActionColumnPresent = false;
		// this.tableDetailTableSection = {};
		if (this.taskDetails.sourceSystemId == '553') {
			this.loaderLmosTaskPopup = true;
		} else {
			this.loader = true;
		}
		//console.clear();
		// console.log("Loader", this.loaderLmosTaskPopup, this.loader);
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
		
		self.taskService.getTask(self.processData.id, self.processData.sourceSystemName).
			toPromise().then((response: any) => {
				// console.log("taskService responce: ", response);
				this.PredictorData = '';
				this.currentTaskId = response.id;
				this.predTaskInstances = response.predTaskInstances;
				this.succTaskInstances = response.succTaskInstances;

				//this.loader = false;
				// const predector1 = "\"{\\\"lines\\\":[{\\\"sequence\\\" : \\\"0\\\",\\\"text\\\" : \\\"\\\"},\\r\\n{\\\"sequence\\\" : \\\"1\\\",\\\"text\\\" : \\\"**** OUTPUT MODE\\\"},\\r\\n{\\\"sequence\\\" : \\\"2\\\",\\\"text\\\" : \\\"\\\"},\\r\\n{\\\"sequence\\\" : \\\"3\\\",\\\"text\\\" : \\\"**** CMD: VTN 9705653045\\\"},\\r\\n{\\\"sequence\\\" : \\\"4\\\",\\\"text\\\" : \\\"\\\"},\\r\\n{\\\"sequence\\\" : \\\"5\\\",\\\"text\\\" : \\\"**** \\\\\\\"VTN\\\\\\\" IS INTERPRETED AS A MACRO\\\"},\\r\\n{\\\"sequence\\\" : \\\"6\\\",\\\"text\\\" : \\\"\\\"},\\r\\n{\\\"sequence\\\" : \\\"7\\\",\\\"text\\\" : \\\"**** SENDING COMMAND: QLEN 9705653045^M\\\"},\\r\\n{\\\"sequence\\\" : \\\"8\\\",\\\"text\\\" : \\\"\\\"},\\r\\n{\\\"sequence\\\" : \\\"9\\\",\\\"text\\\" : \\\"\\\"},\\r\\n{\\\"sequence\\\" : \\\"10\\\",\\\"text\\\" : \\\"**** WILL WAIT 90 SECONDS FOR A RESPONSE\\\"},\\r\\n{\\\"sequence\\\" : \\\"11\\\",\\\"text\\\" : \\\"\\\"},\\r\\n{\\\"sequence\\\" : \\\"12\\\",\\\"text\\\" : \\\"**** RESPONSE FOLLOWS\\\"},\\r\\n{\\\"sequence\\\" : \\\"13\\\",\\\"text\\\" : \\\"\\\"},\\r\\n{\\\"sequence\\\" : \\\"14\\\",\\\"text\\\" : \\\"QLEN 9705653045\\\"},\\r\\n{\\\"sequence\\\" : \\\"15\\\",\\\"text\\\" : \\\"THE DN IS UNASSIGNED\\\"},\\r\\n{\\\"sequence\\\" : \\\"16\\\",\\\"text\\\" : \\\"\\u003e\\\"},\\r\\n{\\\"sequence\\\" : \\\"17\\\",\\\"text\\\" : \\\"\\\"},\\r\\n{\\\"sequence\\\" : \\\"18\\\",\\\"text\\\" : \\\"**** MACRO COMPLETED - HIT \\\\\\\"RETURN\\\\\\\" FOR OUTPUT MODE OR \\\\\\\"DEL\\\\\\\" TO ENTER NEXT CMD \\\"}\\r\\n]}\"";
				if (removeTab && response.taskStatus == 'Complete') {
					$('.ng-tns-c0-0 .main-tab-group .mat-tab-header .mat-tab-label-container .mat-tab-list .mat-tab-labels .mat-tab-label').each(function (key, val) {
						if ($(val).hasClass('mat-tab-label-active')) {
							self.tabService.removeTab(key);
						}
					});
					// this.tabService.removeTab(2);
					// this.tabService.removeTab($('.ng-tns-c0-0 .main-tab-group .mat-tab-header .mat-tab-label-container .mat-tab-list .mat-tab-labels .mat-tab-label').length);
				}
				// console.log("self.taskService.getTask response", response);

				// When completing a task that has a list of "approved_complete_actions" 
				// the user should be able to select from that list
				if (response.taskInstParamRequests) {
					let completeActionsVal = response.taskInstParamRequests.filter((x) => x.name == 'approved_complete_actions');

					if (completeActionsVal && completeActionsVal.length > 0) {
						if (completeActionsVal[0].value) {
							let completeActions = completeActionsVal[0].value.split(",").map((item: string) => item.trim());
							this.approvedCompleteActions = completeActions.filter((x, i, val) => val.indexOf(x) == i);
						}
					}
				}

				// if (response.taskSectionModels) {
				// 	for (let i = 0; i < response.taskSectionModels.length; i++) {
				// 		// response.taskSectionModels[i]['type'] = response.taskSectionModels[i].header;
				// 	this.tableDetailTableSection[response.taskSectionModels[i]['header']] = {
				// 		'pagination' : '',
				// 		'actionButton':[],
				// 		'actionColumn':[],
				// 		'tableHeaders':[],
				// 		'tableData':[],
				// 		'tableOtherContent':'',
				// 		'filter':[],
				// 		'tablePaginationData':'',
				// 		'otherContent' : {
				// 			'from': 'taskdetails',
				// 			'title': 'Task Details',
				// 			'isSortAsc': false,
				// 			'globalSearch': '',
				// 			'add': true,
				// 			'editable': true,
				// 			'deleteable': true,
				// 			'sectionheader': [],
				// 			'header': [],
				// 			'tableData': [] 
				// 		}	


				// 	};
				// 		for (let j = 0; j < response.taskSectionModels[i].paramList.length; j++) {
				// 			const Data = response.taskSectionModels[i].paramList[j];
				// 			if (Data.type == 'tableData') {
				// 				response.taskSectionModels[i].paramList[j].value = JSON.parse(Data.value);
				// 			response.taskSectionModels[i].paramList[j].value['id']=response.taskSectionModels[i].paramList[j]['name'];
				// 			response.taskSectionModels[i].paramList[j].value['rowEdit']=false;
				// 			response.taskSectionModels[i].paramList[j].value['obj']=JSON.stringify(response.taskSectionModels[i].paramList[j]);
				// 			this.tableDetailTableSection[response.taskSectionModels[i]['header']]['tableData'].push(
				// 				response.taskSectionModels[i].paramList[j].value
				// 			);
				// 			}
				// 			if (Data.type == 'tableHeader') {
				// 				response.taskSectionModels[i].paramList[j].jsonDescriptor = JSON.parse(Data.jsonDescriptor);
				// 			}
				// 		}
				// 		// if (response.taskSectionModels[i].header == 'Other Details') {
				// 		// 	response.taskSectionModels[i].paramList.push({header: 'Other Details', jsonDescriptor: null, name: 'predictor1', value: predector1.substring(0,700)}); 
				// 		// 	response.taskSectionModels[i].paramList.push({header: 'Other Details', jsonDescriptor: null, name: 'predictor2', value: predector1.substring(701,1155)}); 
				// 		// 	response.taskSectionModels[i].paramList.push({header: 'Other Details', jsonDescriptor: null, name: 'predictor3', value: predector1.substring(4148,6185)}); 
				// 		// 	response.taskSectionModels[i].paramList.push({header: 'Other Details', jsonDescriptor: null, name: 'predictor4', value: predector1.substring(6186,8290)}); 
				// 		// }
				// 	}
				// }

				// response.taskSectionModels.push(this.facilityData);
				this.template = response.taskType.layoutTemplateName;
				console.log(this.template);
				// Assign layout template name statically for testing SME pagelayout for other task types
				//template = "LMOS TaskDetails";
				// ENd static
				if (this.template == null) {
					this.template = 'taskLayout_SAOTask';
				}			
				var url = '/PageLayoutTemplate/Get/' + this.template;
				this.taskService.callGetUrl(url).toPromise().then((resp) => {
					// SNMM857093;
					// self.pageLayout = 
					if (this.template == 'R2DG Automation View') {
						self.pageLayout = resp;
					} else {
						self.pageLayout = resp;
						this.checkTaskPermissions();
					}
					
					// Assign layout template name statically for testing SME pagelayout for other task types
					// template = "LMOS TaskDetails";
					// ENd static
					if (this.template == 'SME TaskDetails') {
						this.SMETask = true;
						this.leftSideTabs.tab = 'request-details';
						this.HeaderButton = this.pageLayout['pageLayoutTemplate'][3];
						/* this.HeaderButton.fieldsList.push({
							actionbutton: true,
							fieldName: "add_comment",
							visible: true,
							apiUrl: "",
							label: "Add Comments",
							class: "fa-comment",
							fieldValue: ""
						}); */
						this.Summary = this.pageLayout['pageLayoutTemplate'][4];
						this.Details = this.pageLayout['pageLayoutTemplate'][5];
						this.TableFiedls = this.pageLayout['pageLayoutTemplate'][1];
						this.relatedTabs = this.pageLayout['pageLayoutTemplate'][0].fieldsList;
						this.LmosButton = this.pageLayout['pageLayoutTemplate'][6];
						// this.loadTabDetails(0);

						for (let index = 0; index < this.Summary.fieldsList.length; index++) {
							this.Summary.fieldsList[index]['loader'] = false;
						}
						//  console.log(this.Summary);
						this.doughnutChartLabels = [];
						this.doughnutChartData = [];
						this.statusTag = [];
						this.taskDetails = response;
						Object.keys(this.taskDetails.childStatusCounts).forEach(function (key) {
							if (key != 'totalCounts') {
								self.doughnutChartLabels.push(key);
								self.doughnutChartData.push(response.childStatusCounts[key]);
								self.statusTag.push({ 'label': key, 'value': response.childStatusCounts[key] });
							}
						});
						if (this.taskDetails.taskSectionModels) {
							this.taskDetails.taskSectionModels.forEach((taskSectionModel: any) => {
								if (taskSectionModel.header == "CustomerDetails") {
									this.customerDetails = taskSectionModel;
								}
							});
						}
						//this.loader = false;
						if (response.sourceSystemName != "LMOS") {
							this.getTaskParentChildDetails();
						}
						else {
							//checking loader 
							//this.loader = false;
						}
						let retryObj: any = response['taskType'].params.filter((x) => x.name.toLowerCase() == 'retry');
						console.log("response['taskType'].params", response['taskType'].params);
						console.log("retryObj", retryObj);
						const RETRYData = retryObj.length > 0 ? JSON.parse(retryObj[0].value) : [];
						console.log(RETRYData);
						//const RETRYData = JSON.parse("[{\"code\":\"204\", \"enabled\":\"Y\"},{\"code\":\"4XX\", \"enabled\":\"Y\"},{\"code\":\"5XX\", \"enabled\":\"Y\"}]");
						const RETRY204Data = RETRYData.filter((x) => (x.code).toUpperCase() == '204');
						const RETRY4xxData = RETRYData.filter(x => x.code.startsWith('4'));
						const RETRY5xxData = RETRYData.filter((x) => x.code.startsWith('5'));
						let retryRequestURLObj: any = response['taskInstParamRequests'].filter((x) => x.name == 'retryRequestURL');
						const retryRequestURLData = retryRequestURLObj.length > 0 ? retryRequestURLObj[0] : {};
						const userDetails = JSON.parse(localStorage.getItem('fd_user'));
						const authorizations = userDetails && userDetails.authorizations ? userDetails.authorizations : [];
						let buttonPermissions = authorizations.filter(authPermission => authPermission.startsWith('Button'));
						this.RetryEditButton = true;
						console.log(RETRY204Data, RETRY4xxData, RETRY5xxData);
						if (retryRequestURLData.value) {
							if (((RETRY204Data.length > 0 && RETRY204Data[0].enabled == 'Y') ||
								(RETRY4xxData.length > 0 && RETRY4xxData[0].enabled == 'Y') ||
								(RETRY5xxData.length > 0 && RETRY5xxData[0].enabled == 'Y')) &&
								retryRequestURLData.value != '' && buttonPermissions.indexOf('Button_Edit&Retry') != -1) {
								this.RetryEditButton = false;
							}

						}
						this.loaderLmosTaskPopup = false;
					} else if (this.template == 'SPR Viewer') {
						this.SPRTask = true;
						this.NewV2Data = response['taskSectionModels'];
						if (isArray(this.NewV2Data)) {
							this.NewV2Data.forEach(element => {

								if (element.header === 'Customer Attributes') {
									element.paramList.forEach(filed => {
										this.CustomerAttributorData.push(JSON.parse(filed.value));
									});
								}
							});
						}
						this.data = [];
						this.data.push(response);
					} else if (this.template == 'LMOS TaskDetails') {
						// console.log("LMOS TASK DETAILS....");
						this.LMOSTask = true;
						this.leftSideTabs.tab = 'request-details';
						this.LMOSLayoutDetails.trouble_ticket = this.pageLayout['pageLayoutTemplate'][3];
						this.LMOSLayoutDetails.assigned_details = this.pageLayout['pageLayoutTemplate'][8];
						this.LMOSLayoutDetails.facilities = this.pageLayout['pageLayoutTemplate'][4];
						this.LMOSLayoutDetails.customer = this.pageLayout['pageLayoutTemplate'][5];
						this.LMOSLayoutDetails.task_history = this.pageLayout['pageLayoutTemplate'][9];
						this.LmosButton = this.pageLayout['pageLayoutTemplate'][1];
						// console.log("HalfScreen ", this.IsHalfScreen)
						if (!this.IsHalfScreen) {
							// console.log("RelatedTabs", this.pageLayout['pageLayoutTemplate'][0].fieldsList);
							this.relatedTabs = this.pageLayout['pageLayoutTemplate'][0].fieldsList;
						}
						// this.loadTabDetails(0);
						this.checkTaskPermissions();
						if (!this.savingNotes) {
							this.getLMOSScreeningData();
						}
						this.savingNotes = false;
						this.taskDetails = response;
						if (this.taskDetails.taskSectionModels) {
							this.taskDetails.taskSectionModels.forEach((taskSectionModel: any) => {
								if (taskSectionModel.header == "CustomerDetails") {
									this.customerDetails = taskSectionModel;
								}
							});
						}
					} else if (this.template == 'RCMAC TaskDetails') {
						// this.pageLayout = ;
						this.RCMACTask = true;
						this.leftSideTabs.tab = 'request-details';
						this.LMOSLayoutDetails.trouble_ticket = this.pageLayout['pageLayoutTemplate'][3];
						this.LMOSLayoutDetails.assigned_details = this.pageLayout['pageLayoutTemplate'][8];
						this.LMOSLayoutDetails.facilities = this.pageLayout['pageLayoutTemplate'][4];
						this.LMOSLayoutDetails.customer = this.pageLayout['pageLayoutTemplate'][5];
						this.LMOSLayoutDetails.task_history = this.pageLayout['pageLayoutTemplate'][9];
						this.LmosButton = this.pageLayout['pageLayoutTemplate'][1];
						if (!this.IsHalfScreen) {
							this.relatedTabs = this.pageLayout['pageLayoutTemplate'][0].fieldsList;
						}
						// this.loadTabDetails(0);
						this.checkTaskPermissions();
						if (!this.savingNotes) {
							this.getLMOSScreeningData();
						}
						this.savingNotes = false;
						this.taskDetails = response;

						if (this.taskDetails.taskSectionModels) {
							this.taskDetails.taskSectionModels.forEach((taskSectionModel: any) => {
								if (taskSectionModel.header == "CustomerDetails") {
									this.customerDetails = taskSectionModel;
								}
							});
						}
					} else if (this.template == 'taskLayout_SAOTask') {

						this.SAOTask = true;
						this.leftSideTabs.tab = 'request-details';
						this.taskDetails = response;
						
						  this.loggedInUserDetails = JSON.parse(localStorage.getItem('fd_user')).cuid;
						  if(this.loggedInUserDetails==null ||this.taskDetails.assignedCuid==null){
							this.loggedInPermissibleUser = false;
						  }
						 else  if ((this.loggedInUserDetails).toUpperCase() == this.taskDetails.assignedCuid.toUpperCase()){
							this.loggedInPermissibleUser = true;
						}
						//assign layout
						this.SAOLayout = this.pageLayout['pageLayoutTemplate'];

						// Delete Demarc Info from PageLayout if task type is not 'Service Validate Field'
						if(this.taskDetails.taskType.taskName != 'Service Validate Field'){
							const index = this.SAOLayout.findIndex(layout => layout.sectionHeader === 'Demarc Information');
							this.SAOLayout.splice(index, 1);
						}

						for (var key in this.taskDetails) {
							//simple key value
							if (!(typeof this.taskDetails[key] === 'object')) {
								var found = false;
								for (let i = 0; i < this.SAOLayout.length; i++) {
									//console.log("this.SAOLayout[i]['sectionHeader']-->", this.SAOLayout[i]['sectionHeader']);
									//check if key is the title of one of the bold header sections, else match with layout
									if ((this.SAOLayout[i].sectionStyle == "leftSideBoldHeaderSingleColumn" || this.SAOLayout[i].sectionStyle == "rightSideBoldHeaderTwoColumns") && this.SAOLayout[i].boldHeaderKey == key) {
										this.SAOLayout[i].boldHeaderValue = this.taskDetails[key];
										found = true;
									} else {
										for (let j = 0; j < this.SAOLayout[i].fieldsList.length; j++) {
											if (key == this.SAOLayout[i].fieldsList[j]['key']) {												
												this.SAOLayout[i].fieldsList[j]['fieldValue'] = this.taskDetails[key];
												//this.SAOLayout[i].fieldsList[j]['taskInstanceParam']=this.taskDetails[key];

												if (!this.SAOLayout[i].fieldsList[j]['fieldValue']) {
													//console.log(key, "this.SAOLayout[i].fieldsList[j]['fieldValue'] was blank-->", this.SAOLayout[i].fieldsList[j]['fieldValue']);
													this.SAOLayout[i].fieldsList[j]['fieldValue'] = "";
												}
												found = true;
												break;
											}
										}
									}
								}
								// Do not show the core properties of Task Instance in Other details for now. Uncomment this later if required.
								//if key not found in layout, add to other details section
								// if (!found && this.taskDetails[key]) {
								// 	//console.log("NOT in layout, add to other:",key, "-->", this.taskDetails[key]);
								// 	var otherDetailEntry = {
								// 		"visible": true,
								// 		"label": key,
								// 		"fieldValue": this.taskDetails[key],
								// 		"class": "systemtype",
								// 		"key": key
								// 	}
								// 	for (let i = 0; i < this.SAOLayout.length; i++) {
								// 		if (this.SAOLayout[i]['sectionHeader'] == "Other Details") {
								// 			this.SAOLayout[i]['fieldsList'].push(otherDetailEntry);
								// 		}
								// 	}
								// }
							} 
							//js object
							else {
								//grab the workgroup values from the workgroup array to assing to layout as a string
								if (key == "workgroupList") {
									var val = "";
									//console.log(">>>>>>>>>>", key, "-->", this.taskDetails[key]);
									for (let y = 0; y < this.taskDetails[key].length; y++) {
										val = val + this.taskDetails[key][y].workgroupName + ",";
									}
									//console.log("Workgroup to be displayed-->", val);
									//Trim off the last ','
									val = val.substring(0, val.length - 1);
									//console.log("Workgroup to be displayed after substring-->", val);
									for (let i = 0; i < this.SAOLayout.length; i++) {
										for (let j = 0; j < this.SAOLayout[i].fieldsList.length; j++) {
											if (key == this.SAOLayout[i].fieldsList[j]['key']) {
												//console.log("matched with layout-",key,"==",this.SAOLayout[i].fieldsList[j]['key'], "-->", this.taskDetails[key]);
												this.SAOLayout[i].fieldsList[j]['fieldValue'] = val;
												//console.log("this.SAOLayout[i].fieldsList[j]--->",this.SAOLayout[i].fieldsList[j]);
												if (!this.SAOLayout[i].fieldsList[j]['fieldValue']) {
													//console.log(key, "this.SAOLayout[i].fieldsList[j]['fieldValue'] was blank-->", this.SAOLayout[i].fieldsList[j]['fieldValue']);
													this.SAOLayout[i].fieldsList[j]['fieldValue'] = "";
												}
											}
										}
									}
									//loop thorugh taskSectionModels to match values to those needed to display on layout
								} else if (key == "taskSectionModels") {
									//var found = false;
									//console.log(key, "-->", this.taskDetails[key]);
									for (let h = 0; h < this.taskDetails[key].length; h++) {
										//console.log("in parent sectionHeader-->", this.taskDetails[key][h].sectionHeader);
										for (let i = 0; i < this.taskDetails[key][h].paramList.length; i++) {
											var tskDtl = this.taskDetails[key][h].paramList[i];
											var found = false;
											if (tskDtl.name) {
												//console.log(tskDtl.name, "-->", tskDtl.value);
												for (let x = 0; x < this.SAOLayout.length; x++) {
													var layout = this.SAOLayout[x];
													//console.log("CHECK:",layout.sectionHeader,"==?",tskDtl.sectionHeader, "value: ",tskDtl.value );
													//check if item is part of a table on the layout and confirm that table entry is json
													if (layout.sectionStyle == "table" && layout.sectionHeader == tskDtl.header && tskDtl.value.indexOf('{') != -1) {
														//get table headers from items
														//console.log("table item -->", tskDtl.name, "layoutfields: ", layout.fieldsList);
														if (layout.fieldsList && layout.fieldsList.length < 1 && tskDtl.paramFieldLayout) {
															//console.log("assigning table fields:",tskDtl.paramFieldLayout);
															var jsonFields = JSON.parse(tskDtl.paramFieldLayout.tableHeaders);
															layout.fieldsList = jsonFields
													
																														
														//GetCWM Start
														if(layout.sectionHeader == 'Location Information'){
															this.isActionColumnPresent = true;
															for(let header of layout.fieldsList){
																header['visible'] = true;
																// header['editable'] = true;
																if(header['fieldName']==undefined){
																	header['fieldName']= header['columnKey'];
																}
																if(header['label']==undefined){
																	header['label']= header['columnHeader'];
																}
																header['filter']= true
																header['sort']= true;
																
																if(header['type']=='Text'){
																	header['type']= "TableHeader";
																}
																
																this.tableDetailTableSection['Location Information']['tableHeaders'].push(header);

															}
															this.tableDetailTableSection['Location Information']['otherContent']['header'] = this.tableDetailTableSection['Location Information']['tableHeaders'];
														}
													//getcwm end
														//console.log("table layout:",layout.fieldsList);
													}
													//get table data json and add to out tableData array
													let addressjsn = JSON.parse(tskDtl.value);
													layout.tableData.push(addressjsn)
													let addressJson = addressjsn;

													//GetCWM Start

													if(layout.sectionHeader == 'Location Information'){
														addressJson['obj'] = tskDtl;
														addressJson['id'] = tskDtl['name'];
														addressJson['rowEdit'] = false;
														addressJson['new'] = false;
														this.tableDetailTableSection['Location Information']['tableData'].push(addressJson);
														this.tableDetailTableSection['Location Information']['otherContent']['tableData'] = this.tableDetailTableSection['Location Information']['tableData'];
													}


													let pagintn ={
														"totalRecords": this.tableDetailTableSection['Location Information']['tableData'].length,
														"fieldName": "pagination",
														"pageNumber": 0,
														"pageNumberText": "Page Number -",
														"totalRecordsText": "Total number of records: ",
														"pageLimitOptions": [
														  10,
														  20,
														  50,
														  100
														],
														'totalPage':15,
														"pageSize": 10,
														"pageLayoutFieldId": "441",
														"label": "pagination",
														"perPageText": "Per Page",
														"type": "pagination",
														"fieldValue": "",
														'selectedLimit' : 10,
														'currentPageNumber':1,
														'allItems' : this.tableDetailTableSection['Location Information']['tableData'],
														'pager':{startIndex: 0, endIndex:  2}
													  };
													pagintn.pageSize = 10;
													pagintn.pageNumber = 0;
													// this.pagination.allItems = this.pagination.allItems.concat(this.logData);
													let pageCount = 5 ;
													// this.totalPage = Math.ceil(5);
													pagintn.totalPage = Math.ceil(5);
													this.totalPageData = this.logData.length;
                                                    this.tableDetailTableSection['Location Information']['pagination']=pagintn;
                                                    
                                                    var editField = (tskDtl.paramFieldLayout.editable && (tskDtl.paramFieldLayout.editable == true || tskDtl.paramFieldLayout.editable == "true"))?true:false;
                                                    if (!(typeof tskDtl.paramFieldLayout.isEditableField === "undefined")){
                                                        editField = (tskDtl.paramFieldLayout.isEditableField && (tskDtl.paramFieldLayout.isEditableField == true || tskDtl.paramFieldLayout.isEditableField == "true"))?true:false;
                                                    }
									
													let actionClm = [
														{
															"apiUrl": "",
															"class": "search-btn",
															'fieldName': "Add",
															'fieldValue': "",
															'label': "Add",
															'pageLayoutFieldId': "3833",
															'visible': (tskDtl.paramFieldLayout.addRow && (tskDtl.paramFieldLayout.addRow == true || tskDtl.paramFieldLayout.addRow == "true"))?true:false
														},	{
															"apiUrl": "",
															"class": "search-btn",
															'fieldName': "Edit",
															'fieldValue': "",
															'label': "Edit",
															'pageLayoutFieldId': "3833",
															'visible': editField
														},	{
															"apiUrl": "",
															"class": "search-btn",
															'fieldName': "Delete",
															'fieldValue': "",
															'label': "Delete",
															'pageLayoutFieldId': "3833",
															'visible': editField 
															|| ((tskDtl.paramFieldLayout.addRow && (tskDtl.paramFieldLayout.addRow == true || tskDtl.paramFieldLayout.addRow == "true"))?true:false)
														}
													];
													this.tableDetailTableSection['Location Information']['actionColumn'] = actionClm;
													//GetCWM end

														found = true;
														break;
														//check if item currently being looped through is the title of one of the bold header sections, else match with layout
													} else if ((layout.sectionStyle == "leftSideBoldHeaderSingleColumn" || layout.sectionStyle == "rightSideBoldHeaderTwoColumns") && layout.boldHeaderKey == tskDtl.name) {
														layout.boldHeaderKey = tskDtl.value;
  													found = true;
														break;
													} else {
														for (let j = 0; j < layout.fieldsList.length; j++) {
															if (layout.fieldsList[j]['subkey'] && (tskDtl.name == layout.fieldsList[j]['subkey'])) {
																if (layout.fieldsList[j]['subkey_substring'] != null) {
																	//Handles the case when only a part/substring of the value is to be displayed
																	var value = tskDtl.value.split(" ")[layout.fieldsList[j]['subkey_substring']];
                                                                    //var editField= this.taskDetails[key][h].paramList[i].paramFieldLayout.editable;
                                                                    var editField = (tskDtl.paramFieldLayout.editable && (tskDtl.paramFieldLayout.editable == true || tskDtl.paramFieldLayout.editable == "true"))?true:false;
                                                                    if (!(typeof tskDtl.paramFieldLayout.isEditableField === "undefined")){
                                                                        editField = (tskDtl.paramFieldLayout.isEditableField && (tskDtl.paramFieldLayout.isEditableField == true || tskDtl.paramFieldLayout.isEditableField == "true"))?true:false;
                                                                    }
																	var fieldType= this.taskDetails[key][h].paramList[i].paramFieldLayout.type;
																	layout.fieldsList[j]['fieldValue'] = value;
																	layout.fieldsList[j]['editable']=editField;
																	layout.fieldsList[j]['type']=fieldType;
																	layout.fieldsList[j]['taskInstanceParam']=this.taskDetails[key][h].paramList[i];
																	found = true;
																} else {
                                                                    //var editField= this.taskDetails[key][h].paramList[i].paramFieldLayout.editable;
                                                                    var editField = (tskDtl.paramFieldLayout.editable && (tskDtl.paramFieldLayout.editable == true || tskDtl.paramFieldLayout.editable == "true"))?true:false;
                                                                    if (!(typeof tskDtl.paramFieldLayout.isEditableField === "undefined")){
                                                                        editField = (tskDtl.paramFieldLayout.isEditableField && (tskDtl.paramFieldLayout.isEditableField == true || tskDtl.paramFieldLayout.isEditableField == "true"))?true:false;
                                                                    }
																	var fieldType= this.taskDetails[key][h].paramList[i].paramFieldLayout.type;
																	var value = tskDtl.value;
																
																	
																	layout.fieldsList[j]['fieldValue'] = value;
																	layout.fieldsList[j]['editable']=editField;
																	layout.fieldsList[j]['type']=fieldType;
																	layout.fieldsList[j]['taskInstanceParam']=this.taskDetails[key][h].paramList[i];
																	layout.fieldsList[j]['options'];
																	
																
																	if (!layout.fieldsList[j]['fieldValue']) {
																		if (tskDtl.dateValue) {
																			console.log("indsidj date param")
																			layout.fieldsList[j]['fieldValue'] = tskDtl.dateValue;

																		}else{
																			layout.fieldsList[j]['fieldValue'] = "";
																		}
																	}
																	let taskInstParamFieldLayout = this.taskDetails[key][h].paramList[i].paramFieldLayout;
																	if(taskInstParamFieldLayout){
                                                                        for (var param in taskInstParamFieldLayout){
                                                                            //console.log("param in taskInstParamFieldLayout:", param);
                                                                            //console.log("layout.fieldsList[j][param]:",layout.fieldsList[j][param]);
                                                                            if(typeof layout.fieldsList[j][param] === "undefined"){
                                                                                //console.log("layout.fieldsList[j][param] is undefined, assigning:",taskInstParamFieldLayout[param]);
                                                                                layout.fieldsList[j][param] = taskInstParamFieldLayout[param];
                                                                            }
                                                                        }
                                                                        //console.log("layout.fieldsList[j] after adding params:", layout.fieldsList[j]);
																	}
																	if(tskDtl.urls){
																		layout.fieldsList[j]['urls'] = this.setUrls(layout.fieldsList[j]['urls'], tskDtl.urls);
																	}
																	found = true;
																	break;
																}
															}
														}
														if (found) { break; }
													}
												}
												//if item not matched with layout add to other details section
												if (!found) {
													//console.log("taskSectionModels NOT in layout, add to other:",tskDtl.name, "-->", tskDtl.value);
													
													var label: string = tskDtl.pageLayoutlabel;
													var otherDetailEntry = {};
													var value = tskDtl.dateValue?tskDtl.dateValue:tskDtl.value;
                                                    let taskInstParamFieldLayout = this.taskDetails[key][h].paramList[i].paramFieldLayout;
                                                    var editField = (tskDtl.paramFieldLayout.editable && (tskDtl.paramFieldLayout.editable == true || tskDtl.paramFieldLayout.editable == "true"))?true:false;
                                                    if (!(typeof tskDtl.paramFieldLayout.isEditableField === "undefined")){
                                                        editField = (tskDtl.paramFieldLayout.isEditableField && (tskDtl.paramFieldLayout.isEditableField == true || tskDtl.paramFieldLayout.isEditableField == "true"))?true:false;
                                                    }

													if(taskInstParamFieldLayout){
														otherDetailEntry = tskDtl.paramFieldLayout;
														if(otherDetailEntry['urls']==undefined){
															otherDetailEntry['urls']=tskDtl.urls;
														}
													}else{
														otherDetailEntry = {
															"visible": true,
                                                            "label": label,
                                                            "fieldValue": value,
															"class": "systemtype",
															"key": label,
                                                            "urls": tskDtl.urls,
                                                            "taskInstanceParam" : tskDtl,
                                                            "editable": editField
														}
													}
                                                    otherDetailEntry['fieldValue'] = value;
                                                    otherDetailEntry['editable'] = editField;
													tskDtl['paramFieldLayout'] = undefined;

													otherDetailEntry['taskInstanceParam'] = tskDtl
													// otherDetailEntry = {
													// 	"fieldValue": tskDtl.value,
													// 	'taskInstanceParam' : tskDtl
													// }
													for (let i = 0; i < this.SAOLayout.length; i++) {
														if (this.SAOLayout[i]['sectionHeader'] == "Other Details") {
															this.SAOLayout[i]['fieldsList'].push(otherDetailEntry);
														}
                                                    }
                                                    
                                                    //Check for task_status/Source Status == "ERROR" to allow retry
                                                    if((label == "Source Status" || tskDtl.name == "task_status") && tskDtl.value == "ERROR"){
                                                        this.allowSAORetry = true;
                                                    }
												}
											}
										}
									}
								} else if (key == "root_url") {
									for(let h = 0; h < this.taskDetails[key].length; h++){
										for (let i = 0; i < this.SAOLayout.length; i++) {
											for (let j = 0; j < this.SAOLayout[i].fieldsList.length; j++) {
												if (this.taskDetails[key][h].fieldName == this.SAOLayout[i].fieldsList[j]['key']) {
													
													this.SAOLayout[i].fieldsList[j]['urls'] = this.setUrls(this.SAOLayout[i].fieldsList[j]['urls'], this.taskDetails[key][h].urls);
													found = true;
													break;
												}
											}
											if (found) { break; }
										}
									}
								}
							}
						}
						//get and assign children data to children table
						if(this.taskDetails.isParent){
							this.getChilrenTaks();
						}
						
						//looks specifically for the "parent info" section on the layout and matches fields to the task's parent instance details
						if (this.parentTask) {
							//console.log("this.parentTask-->", this.parentTask);
							for (let i = 0; i < this.SAOLayout.length; i++) {
								//console.log("SAOLayout loop-->", i);
								//console.log("this.SAOLayout[i]['sectionHeader']-->", this.SAOLayout[i]['sectionHeader']);
								if (this.SAOLayout[i]['sectionHeader'] == "Parent Info") {
									//console.log("is parent info--> true", i);
									this.SAOLayout[i]['parentInfo'] = this.parentTask;
									//console.log("this.parentTask-->", i,":", this.parentTask);
									//console.log("this.SAOLayout-->", i,":", this.SAOLayout);
									for (let j = 0; j < this.SAOLayout[i].fieldsList.length; j++) {
										for (var key in this.parentTask) {
											//console.log("KEY label-->", key);
											if (key == this.SAOLayout[i].fieldsList[j]['key']) {
												//console.log("PKEY label-->", key);
												//console.log("PKEY value-->", this.parentTask[key]);
												this.SAOLayout[i].fieldsList[j]['fieldValue'] = this.parentTask[key];
											}
										};
									}
								}
							}
						}
						//loader check
						//this.loader = false;

					} 
					//GETCWM-3680 start
					else if (this.template == 'taskLayout_SDWAN') {

						this.SDWANTask = true;
						this.leftSideTabs.tab = 'request-details';
						//SDWAN Task
						this.taskDetails = response;

						//cycle through layout sections and assign each section layout to the correct variable that uses it
						for (let i = 0; i < this.pageLayout['pageLayoutTemplate'].length; i++) {
							switch (this.pageLayout['pageLayoutTemplate'][i].sectionHeader) {
								case "SDWAN Task":
									this.SDWANLayout = this.pageLayout['pageLayoutTemplate'][i].fieldsList;
									break;
								case "Related-Tabs":
									//console.log("case Order Details layout-->", i, ":", this.pageLayout['pageLayoutTemplate'][i]);
									this.relatedTabs = this.pageLayout['pageLayoutTemplate'][i].fieldsList;
									break;
								default:
									//console.log("case default -->", i, ":", this.pageLayout['pageLayoutTemplate'][i]);
									break;
							}
						}
						for (let key in this.taskDetails) {
							//simple key value
							if (!(typeof this.taskDetails[key] === 'object')) {
								let found = false;
								for (let i = 0; i < this.SDWANLayout.length; i++) {
									//console.log("this.SAOLayout[i]['header']-->", this.SAOLayout[i]['header']);
									//check if key is the title of one of the bold header sections, else match with layout
									if ((this.SDWANLayout[i].sectionStyle == "leftSideBoldHeaderSingleColumn" || this.SDWANLayout[i].sectionStyle == "rightSideBoldHeaderTwoColumns") && this.SDWANLayout[i].boldHeaderKey == key) {
										this.SDWANLayout[i].boldHeaderValue = this.taskDetails[key];
										found = true;
									} else {
										for (let j = 0; j < this.SDWANLayout[i].fieldsList.length; j++) {
											if (key == this.SDWANLayout[i].fieldsList[j]['key']) {
												this.SDWANLayout[i].fieldsList[j]['fieldValue'] = this.taskDetails[key];
												if (!this.SDWANLayout[i].fieldsList[j]['fieldValue']) {
													this.SDWANLayout[i].fieldsList[j]['fieldValue'] = "";
												}
												found = true;
												break;
											}
										}
									}
								}
								//if key not found in layout, add to other details section
								if (!found && this.taskDetails[key]) {
									let otherDetailEntry = {
										"visible": true,
										"editable":false,
										"label": key,
										"fieldValue": this.taskDetails[key],
										"class": "systemtype",
										"key": key
									}
									for (let i = 0; i < this.SDWANLayout.length; i++) {
										if (this.SDWANLayout[i]['header'] == "Other Details") {
											this.SDWANLayout[i]['fieldsList'].push(otherDetailEntry);
										}
									}
								}
							} 
							//js object
							else {
								//grab the workgroup values from the workgroup array to assing to layout as a string
								if (key == "workgroupList") {
									let val = "";
									//console.log(">>>>>>>>>>", key, "-->", this.taskDetails[key]);
									for (let y = 0; y < this.taskDetails[key].length; y++) {
										val = val + this.taskDetails[key][y].workgroupName + ",";
									}
									//console.log("Workgroup to be displayed-->", val);
									//Trim off the last ','
									val = val.substring(0, val.length - 1);
									//console.log("Workgroup to be displayed after substring-->", val);
									for (let i = 0; i < this.SDWANLayout.length; i++) {
										for (let j = 0; j < this.SDWANLayout[i].fieldsList.length; j++) {
											if (key == this.SDWANLayout[i].fieldsList[j]['key']) {
												//console.log("matched with layout-",key,"==",this.SAOLayout[i].fieldsList[j]['key'], "-->", this.taskDetails[key]);
												this.SDWANLayout[i].fieldsList[j]['fieldValue'] = val;
												//console.log("this.SAOLayout[i].fieldsList[j]--->",this.SAOLayout[i].fieldsList[j]);
												if (!this.SDWANLayout[i].fieldsList[j]['fieldValue']) {
													//console.log(key, "this.SAOLayout[i].fieldsList[j]['fieldValue'] was blank-->", this.SAOLayout[i].fieldsList[j]['fieldValue']);
													this.SDWANLayout[i].fieldsList[j]['fieldValue'] = "";
												}
											}
										}
									}
									//loop thorugh taskSectionModels to match values to those needed to display on layout
								} else if (key == "taskSectionModels") {
									//var found = false;
									//console.log(key, "-->", this.taskDetails[key]);
									for (let h = 0; h < this.taskDetails[key].length; h++) {
										//console.log("in parent header-->", this.taskDetails[key][h].header);
										for (let i = 0; i < this.taskDetails[key][h].paramList.length; i++) {
											var tskDtl = this.taskDetails[key][h].paramList[i];
											var found = false;
											if (tskDtl.name) {
												//console.log(tskDtl.name, "-->", tskDtl.value);
												for (let i = 0; i < this.SDWANLayout.length; i++) {
													var layout = this.SDWANLayout[i];
													//console.log("CHECK:",layout.header,"==?",tskDtl.header, "value: ",tskDtl.value );
													//check if item is part of a table on the layout and confirm that table entry is json
													if ((layout.sectionStyle == "table" || layout.sectionStyle == "TableDefinition") && layout.header == tskDtl.header && tskDtl.value.indexOf('{') != -1) {
														//get table headers from items
														if (layout.fieldsList && layout.fieldsList.length < 1 && tskDtl.paramFieldLayout) {
															var jsonFields = JSON.parse(tskDtl.paramFieldLayout.tableHeaders);
															layout.fieldsList = jsonFields
														}
														//get table data json and add to out tableData array
														let addressjsn = JSON.parse(tskDtl.value);
														layout.tableData.push(addressjsn)
														
														found = true;
														break;
														//check if item currently being looped through is the title of one of the bold header sections, else match with layout
													} else if ((layout.sectionStyle == "leftSideBoldHeaderSingleColumn" || layout.sectionStyle == "rightSideBoldHeaderTwoColumns") && layout.boldHeaderKey == tskDtl.name) {
														layout.boldHeaderKey = tskDtl.value;
														found = true;
														break;
													} else {
														for (let j = 0; j < layout.fieldsList.length; j++) {
															if (layout.fieldsList[j]['subkey'] && (tskDtl.name == layout.fieldsList[j]['subkey'])) {
																if (layout.fieldsList[j]['subkey_substring'] != null) {
																	//Handles the case when only a part/substring of the value is to be displayed
																	let value = tskDtl.value.split(" ")[layout.fieldsList[j]['subkey_substring']];
																	layout.fieldsList[j]['fieldValue'] = value;
																	found = true;
																} else {
																	let value = tskDtl.value;
																	layout.fieldsList[j]['fieldValue'] = value;
																	found = true;
																	break;
																}
															}
														}
														if (found) { break; }
													}
												}
												//if item not matched with layout add to other details section
												if (!found) {
													//console.log("taskSectionModels NOT in layout, add to other:",tskDtl.name, "-->", tskDtl.value);
													let label: string = tskDtl.name;
													let value = tskDtl.value;
													let otherDetailEntry = {
														"visible": true,
														"editable":false,
														"label": label,
														"fieldValue": tskDtl.value,
														"class": "systemtype",
														"key": label
													}
													for (let i = 0; i < this.SAOLayout.length; i++) {
														if (this.SDWANLayout[i]['header'] == "Other Details") {
															this.SDWANLayout[i]['fieldsList'].push(otherDetailEntry);
														}
													}
												}
											}
										}
									}
								}
							}
						}
						//check loader
						this.loader = false;

					}
					//GETCWM-3680 end


					
					else {						
						this.TaskDetails = true;
						if (this.template == 'WCM-Screening') {
							this.displayWCMDetails = true;
							this.getLMOSScreeningData();
							const userDetails = JSON.parse(localStorage.getItem('fd_user'));
							const authorizations = userDetails && userDetails.authorizations ? userDetails.authorizations : [];
							if (authorizations.indexOf('Task_View') > -1) {
								this.authorizedLMOSUser = true;
							} else {
								this.errorMessage = 'You do not have access to view LMOS Trouble Ticket Details';
								return;
							}
						}
						self.loader = false;
					}
					// this.loaderLmosTaskPopup = false;
				}).catch((errorObj: any) => {
					this.loader = false;
					this.loaderLmosTaskPopup = false;
				});
				this.iterateTaskSectionModels(response);				
				this.actionListTD = [];
				if (response.allowedactions && response.allowedactions.length > 0) {
					for (let i = 0; i < response.allowedactions.length; i++) {
						this.actionListTD.push({ value: response.allowedactions[i] });
                    }
				}
				// Call to fetch task dependency template
				//this.getTaskDependencyPageLayoutTemplate();
				if(this.template == "taskLayout_SAOTask") {
					this.getTaskDependencyPageLayoutTemplate();
				} 

				this.workGroupNamenew = JSON.parse(JSON.stringify(response.workgroupList));
				self.fields = response;
				//self.loader = false;
				self.loaderTaskDetail = false;
				self.loaderDeviceDetail = false;
				self.taskDetails['taskSectionModels'] = [];
				self.taskDetails = response;

				//getcwm-5153 start code commented and moved out to a common method iterateTaskSectionModels
				
				// if (self.taskDetails['taskSectionModels']) {
				// 	for (let i = 0; i < self.taskDetails['taskSectionModels'].length; i++) {
				// 		if (self.taskDetails['taskSectionModels'][i]['header'] == 'Trouble Report') {
				// 			for (let j = 0; j < self.taskDetails['taskSectionModels'][i]['paramList'].length; j++) {
				// 				var ParamListData = self.taskDetails['taskSectionModels'][i]['paramList'][j];
				// 				if (ParamListData.name == 'TN') {
				// 					self.taskDetails['taskSectionModels'][i]['paramList'][j]['value'] = self.taskDetails['taskSectionModels'][i]['paramList'][j]['value'].replace(/\s/g, "");
				// 				}
				// 			}
				// 		}
				// 	}
				// 	self.taskDetails['taskSectionModels'].forEach((obj) => {
				// 		if (obj.paramList) {
				// 			obj.paramList.forEach((element) => {
				// 				if (element.name === 'dueDate') {
				// 					// dueDate = element.fieldValue.toISOString().substr(0, 10);
				// 					let tempDate = new Date(element.value);
				// 					let dueDate = new Date(Date.UTC(
				// 						tempDate.getUTCFullYear(),
				// 						tempDate.getUTCMonth(),
				// 						tempDate.getUTCDate()) + 86400000);

				// 					element.value = dueDate;
				// 				}
				// 				if (self.taskDetails.sourceSystemName == 'LMOS') {
				// 					if (element.name == 'EC') {
				// 						this.wcmRequestData.EC = element.value;
				// 					} else if (element.name == 'TTN') {
				// 						this.wcmRequestData.TTN = element.value;
				// 					} else if (element.name == 'TN') {
				// 						this.wcmRequestData.TN = element.value;
				// 					} else if (element.name == 'MC') {
				// 						this.wcmRequestData.MC = element.value;
				// 					} else if (element.name == 'REQ') {
				// 						this.wcmRequestData.REQ = element.value;
				// 					} else if (element.name == 'DB') {
				// 						this.wcmRequestData.DB = element.value;
				// 					} else if (element.name == 'T') {
				// 						this.wcmRequestData.T = element.value;
				// 					} else if (element.name == 'C') {
				// 						this.wcmRequestData.C = element.value;
				// 					} else if (element.name == 'D') {
				// 						this.wcmRequestData.D = element.value;
				// 					} else if (element.name == 'FL1') {
				// 						this.wcmRequestData.FL1 = element.value;
				// 					} else if (element.name == 'FL3') {
				// 						this.wcmRequestData.FL3 = element.value;
				// 					} else if (element.name == 'X') {
				// 						this.wcmRequestData.X = element.value;
				// 					} else if (element.name == 'TRACE') {
				// 						this.wcmRequestData.TRACE = element.value;
				// 						//	} else if (element.name == 'URL') {
				// 						//		this.wcmRequestData.URL = element.value;
				// 					} else if (element.name == 'Region') {
				// 						this.wcmRequestData.Region = element.value;
				// 					}

				// 					if (element.name == 'SCR' && element.value == '*') {
				// 						this.lmosButtonDisabled = true;
				// 					}
				// 				}
				// 				if (element.name != '' && element.name != null) {
				// 					if (element.name.startsWith('predictor') && element.name != 'predictor') {
				// 						this.PredictorData = this.PredictorData + element.value;
				// 					}
				// 				}
				// 			});
				// 		}
				// 	});
				// }

				//getcwm-5153 end 
				if (response.sourceSystemName == 'LMOS') {

					var TTN = (this.wcmRequestData.TTN) ? this.wcmRequestData.TTN : '';
					var MC = (this.wcmRequestData.MC) ? this.wcmRequestData.MC : '';
					var TN = (this.wcmRequestData.TN) ? this.wcmRequestData.TN : '';
					var EC = (this.wcmRequestData.EC) ? this.wcmRequestData.EC : '';
					var region = (this.wcmRequestData.Region) ? this.wcmRequestData.Region : '';
					console.log("Region FROM SERVICE REGIONURL************" + region)
					let url = this.wcmRequestData.URL + "/v1/MSCR?MC=" + MC + "&TN=" + TN + "";
					// let url = "/v1/MSCR?MC=" + MC + "&TN=" + TN + "";
					const request = { url: url, httpMethod: 'PUT', region: region };

					//this.showLmosRecoredSection = true;
					//this.modalRef = this.modalService.show('');
					/* this.taskService.invokeLMOSAPI(request).toPromise().then((response: any) => {
						let lmosResponse: any = {};
						// this.loaderTaskDetail = false;
						lmosResponse = JSON.parse(response.message);
						if (lmosResponse.details[0] == 'LINE24: NO WORK ITEMS AVAILABLE') {
							this.showLmosRecoredSection = true;
							this.modalRef = this.modalService.show('');
						}
					}).catch((errorObj: any) => {
						console.error(errorObj);
					}); */
				}

				// if (self.displayWCMDetails) {
				// 	this.LMOScheckTaskPermissions();
				// 	this.getLMOSScreeningData();
				// } else {
				// 	this.checkTaskPermissions();
				// }

				self.workGroupName = [];
				self.skillName = [];

				/*
				if(response['workgroupList'] && response['workgroupList'].length > 0){
				response['workgroupList'].forEach(item => {
						self.workGroupName.push(item);
				});
				}*/

				// this.loader = false;
				// this.taskService.getActivityLogForTask('/Enterprise/v2/Work/task/' + response.id + '/activityLog?include=a').toPromise().then((Logresp: any) => {
				// 	//this.taskService.callGetUrl('/Enterprise/v2/Work/task/' + response.id + '/activityLog').toPromise().then((Logresp: any) => {
				// 	//this.loader = false;
				// 	this.logData = Logresp;
				// 	this.logDetails = Logresp;
				// 	for (let index = 0; index < this.logData.length; index++) {
				// 		this.logData[index]['activityDetails'] = this.logData[index]['activityDetails'].replace('/n', '\n');
				// 	}
				// 	this.LogDetailsParameter.tableData = [];
				// 	this.LogDetailsParameter.tableData = Logresp;
				// 	// let userData: any = JSON.parse(localStorage.getItem("fd_user"));
				// 	// this.LogDetailsParameter.tableData.forEach(element => {
				// 	// 	element.createdById = userData.cuid;
				// 	// });
				// 	this.pagination.totalRecords = Logresp.length;
				// 	this.pagination.pageSize = 10;
				// 	this.pagination.pageNumber = 0;
				// 	this.pagination.allItems = this.pagination.allItems.concat(this.logData);
				// 	let pageCount = this.logData.length % this.currentPageLimit == 0 ? this.logData.length / this.currentPageLimit :
				// 		this.logData.length / this.currentPageLimit + 1;
				// 	this.totalPageData = this.logData.length;
				// 	this.totalPage = Math.ceil(this.logData.length / this.currentPageLimit);
				// 	this.pagination.totalPage = this.totalPage;
				// 	/* let pageset = [];
				// 	for (let j = 1; j <= pageCount; j++) {
				// 		let page = this.makePage(j, j.toString(), j === 1);
				// 		pageset.push(page);
				// 		if (j == pageCount) {
				// 			this.convertNumberToArray(pageset);
				// 		}
				// 	}
				// 	this.onPaginateInnerGrid(1);*/
				// }).catch((errorObj: any) => {
				// 	this.loader = false;
				// });

				self.applicationName.push(response['application'] ? response['application']['applicationName'] : '');
				self.isSPRApplication = (self.applicationName.indexOf('SPR') === -1 ? false : true);

				// if (response.SCR != undefined) {
				// 	if (response.SCR == '*') {
				// 		this.lmosButtonDisabled = true;
				// 	}
				// }

				//	self.taskType.push(response['taskType'] ? response['taskType']['taskName'].trim() : '');

				self.taskDetailsBackup = JSON.parse(JSON.stringify(self.taskDetails));
				// self.loaderLmosTaskPopup = false;
				// self.loader = false;

				// self.loader = false;
				// self.loaderTaskDetail = false;
				// self.loaderDeviceDetail = false;

				/*
				self.taskService.getAuditResults(self.taskDetails.appTaskInstanceId, self.applicationName[0]).toPromise().then((response:any)=>{
				self.tempAuditResults = response;
				self.auditResults = self.tempAuditResults;
				if(this.processData.sourceSystem === 'SPR' && !refreshClicked)
					this.processAuditLog("VIEW");
				
			}).catch((error: any)=>{
				});
				*/
				// this.GettaskIncludeAADetails(response.id);
			}).catch((error: any) => {
				console.log(error);
				self.loader = false;
				self.loaderLmosTaskPopup = false;
				self.IsError = true;
				if (error && error.error && error.error.message) {
					self.message = error.error.message;
				} else {
					if (error && error.message) {
						self.message = error.message;
					}
				}
				setTimeout(() => {
					self.IsError = false;
				}, 7000);
			});
		//console.log("processData>>>>>>>>>>>>>", this.processData)
		//console.log("taskDetails>>>>>>>>>>>>>", this.taskDetails)
		//SAO Layout. Get Parent information of task. gets stored in this.parentTask. using parent id(this.processData.parentTaskId)
		if (this.processData.parentTaskInstId) {
			this.getParentTask(this.processData.parentTaskInstId);
		}
		if ( this.processData.parentTaskId) {
			this.getParentTask(this.processData.parentTaskId);
		}
		let userData: any = JSON.parse(localStorage.getItem("fd_user"));
		let auditLogRequest: AuditLog[]=[];
		auditLogRequest.push({ createdById:userData.cuid,resourceId:userData.id, 
			module: "Manage task", type: "view", value:this.processData.id, display:this.processData.sourceTaskId,
			status:"Success",detail:"Viewed task details : "+this.processData.sourceTaskId+", "+ this.processData.sourceSystem+", "+this.processData.id});
    	this.userProfileService.saveResourceAuditLog(auditLogRequest).toPromise().then((response: any) => {
		console.log(JSON.stringify(response));
		}).catch((errorObj: any) => {
			this.loader = false;
		});

		// self.taskService.getTaskIncludeAA(self.processData.id, self.processData.sourceSystemName).
		// toPromise().then((response: any) => {
		// 	this.actionList = [];
		// 	response.allowedactions.forEach(element => {
		// 		for (let i = 0; i < element.allowedactions.length; i++) {
		// 			this.actionList.push({value: element.allowedactions[i]});
		// 		}
		// 	});
		// }).catch((error: any) => {
		// 	self.loader = false;
		// 	self.snackBar.open("Error loading Task Details..", "Okay", {
		// 		duration: 15000,
		// 	});
		// });
	}
	changeFieldDate(fields,e){
		this.hideSpanDate=true;
		var date = new Date(e),
        mnth = ("0" + (date.getMonth()+1)).slice(-2),
        day  = ("0" + date.getDate()).slice(-2),
        hours  = ("0" + date.getHours()).slice(-2),
		minutes = ("0" + date.getMinutes()).slice(-2),
		seconds= ("0" + date.getSeconds()).slice(-2);
	var getValue= [date.getFullYear(), mnth, day].join("-");
	var getValue2 = [hours, minutes, seconds ].join(":");
	var result= getValue + " " + getValue2;
	this.taskDetails.taskInstParamRequests.forEach(element =>{
		if(fields.taskInstanceParam.header == element.header && fields.taskInstanceParam.name== element.name){
			if(element.value){
				element.value = result;

			}else{
				element.dateValue = result;

			}

		}
	})
}
	
	changeField(fields) {
		if (fields.key == 'notes') {
			this.taskDetails.notes = fields.fieldValue;
		} else {
			this.taskDetails.taskInstParamRequests.forEach(e => {
				if (fields.taskInstanceParam.header == e.header && fields.taskInstanceParam.name == e.name) {
					if (e.value) {
						e.value = fields.fieldValue;
					} else {
						e.dateValue = fields.fieldValue;
					}
				}
			})
		}

	}
	async iterateTaskSectionModels(response){
		if (response.taskSectionModels) {


			// if (self.taskDetails['taskSectionModels']) {
			// 	for (let i = 0; i < self.taskDetails['taskSectionModels'].length; i++) {
			// 		if (self.taskDetails['taskSectionModels'][i]['header'] == 'Trouble Report') {
			// 			for (let j = 0; j < self.taskDetails['taskSectionModels'][i]['paramList'].length; j++) {
			// 				var ParamListData = self.taskDetails['taskSectionModels'][i]['paramList'][j];
			// 				if (ParamListData.name == 'TN') {
			// 					self.taskDetails['taskSectionModels'][i]['paramList'][j]['value'] = self.taskDetails['taskSectionModels'][i]['paramList'][j]['value'].replace(/\s/g, "");
			// 				}
			// 			}
			// 		}
			// 	}
			// 	self.taskDetails['taskSectionModels'].forEach((obj) => {
			// 		if (obj.paramList) {
			// 			obj.paramList.forEach((element) => {
			// 				if (element.name === 'dueDate') {
			// 					// dueDate = element.fieldValue.toISOString().substr(0, 10);
			// 					let tempDate = new Date(element.value);
			// 					let dueDate = new Date(Date.UTC(
			// 						tempDate.getUTCFullYear(),
			// 						tempDate.getUTCMonth(),
			// 						tempDate.getUTCDate()) + 86400000);

			// 					element.value = dueDate;
			// 				}
			// 				if (self.taskDetails.sourceSystemName == 'LMOS') {
			// 					if (element.name == 'EC') {
			// 						this.wcmRequestData.EC = element.value;
			// 					} else if (element.name == 'TTN') {
			// 						this.wcmRequestData.TTN = element.value;
			// 					} else if (element.name == 'TN') {
			// 						this.wcmRequestData.TN = element.value;
			// 					} else if (element.name == 'MC') {
			// 						this.wcmRequestData.MC = element.value;
			// 					} else if (element.name == 'REQ') {
			// 						this.wcmRequestData.REQ = element.value;
			// 					} else if (element.name == 'DB') {
			// 						this.wcmRequestData.DB = element.value;
			// 					} else if (element.name == 'T') {
			// 						this.wcmRequestData.T = element.value;
			// 					} else if (element.name == 'C') {
			// 						this.wcmRequestData.C = element.value;
			// 					} else if (element.name == 'D') {
			// 						this.wcmRequestData.D = element.value;
			// 					} else if (element.name == 'FL1') {
			// 						this.wcmRequestData.FL1 = element.value;
			// 					} else if (element.name == 'FL3') {
			// 						this.wcmRequestData.FL3 = element.value;
			// 					} else if (element.name == 'X') {
			// 						this.wcmRequestData.X = element.value;
			// 					} else if (element.name == 'TRACE') {
			// 						this.wcmRequestData.TRACE = element.value;
			// 						//	} else if (element.name == 'URL') {
			// 						//		this.wcmRequestData.URL = element.value;
			// 					} else if (element.name == 'Region') {
			// 						this.wcmRequestData.Region = element.value;
			// 					}

			// 					if (element.name == 'SCR' && element.value == '*') {
			// 						this.lmosButtonDisabled = true;
			// 					}
			// 				}
			// 				if (element.name != '' && element.name != null) {
			// 					if (element.name.startsWith('predictor') && element.name != 'predictor') {
			// 						this.PredictorData = this.PredictorData + element.value;
			// 					}
			// 				}
			// 			});
			// 		}
			// 	});
			// }




			for (let i = 0; i < response.taskSectionModels.length; i++) {
				// response.taskSectionModels[i]['type'] = response.taskSectionModels[i].header;
				this.tableDetailTableSection[response.taskSectionModels[i]['header']] = {
					'pagination' : '',
					'actionButton':[],
					'actionColumn':[],
					'tableHeaders':[],
					'tableData':[],
					'tableOtherContent':'',
					'filter':[],
					'tablePaginationData':'',
					'otherContent' : {
						'from': 'taskdetails',
						'title': 'Task Details',
						'isSortAsc': false,
						'globalSearch': '',
						'add': true,
						'editable': true,
						'deleteable': true,
						'sectionheader': [],
						'header': [],
						'tableData': [] 
					}	


				};


				if (response['taskSectionModels'][i]['header'] == 'Trouble Report') {
					for (let j = 0; j < response['taskSectionModels'][i]['paramList'].length; j++) {
						var ParamListData = response['taskSectionModels'][i]['paramList'][j];
						if (ParamListData.name == 'TN') {
							response['taskSectionModels'][i]['paramList'][j]['value'] = response['taskSectionModels'][i]['paramList'][j]['value'].replace(/\s/g, "");
						}
						if (response.sourceSystemName == 'LMOS') {
							if (response.taskSectionModels[i].paramList[j].name == 'EC') {
								this.wcmRequestData.EC = response.taskSectionModels[i].paramList[j].value;
							} else if (response.taskSectionModels[i].paramList[j].name == 'TTN') {
								this.wcmRequestData.TTN = response.taskSectionModels[i].paramList[j].value;
							} else if (response.taskSectionModels[i].paramList[j].name == 'TN') {
								this.wcmRequestData.TN = response.taskSectionModels[i].paramList[j].value;
							} else if (response.taskSectionModels[i].paramList[j].name == 'MC') {
								this.wcmRequestData.MC = response.taskSectionModels[i].paramList[j].value;
							} else if (response.taskSectionModels[i].paramList[j].name == 'REQ') {
								this.wcmRequestData.REQ = response.taskSectionModels[i].paramList[j].value;
							} else if (response.taskSectionModels[i].paramList[j].name == 'DB') {
								this.wcmRequestData.DB = response.taskSectionModels[i].paramList[j].value;
							} else if (response.taskSectionModels[i].paramList[j].name == 'T') {
								this.wcmRequestData.T = response.taskSectionModels[i].paramList[j].value;
							} else if (response.taskSectionModels[i].paramList[j].name == 'C') {
								this.wcmRequestData.C = response.taskSectionModels[i].paramList[j].value;
							} else if (response.taskSectionModels[i].paramList[j].name == 'D') {
								this.wcmRequestData.D = response.taskSectionModels[i].paramList[j].value;
							} else if (response.taskSectionModels[i].paramList[j].name == 'FL1') {
								this.wcmRequestData.FL1 = response.taskSectionModels[i].paramList[j].value;
							} else if (response.taskSectionModels[i].paramList[j].name == 'FL3') {
								this.wcmRequestData.FL3 = response.taskSectionModels[i].paramList[j].value;
							} else if (response.taskSectionModels[i].paramList[j].name == 'X') {
								this.wcmRequestData.X = response.taskSectionModels[i].paramList[j].value;
							} else if (response.taskSectionModels[i].paramList[j].name == 'TRACE') {
								this.wcmRequestData.TRACE = response.taskSectionModels[i].paramList[j].value;
								//	} else if (element.name == 'URL') {
								//		this.wcmRequestData.URL = element.value;
							} else if (response.taskSectionModels[i].paramList[j].name == 'Region') {
								this.wcmRequestData.Region = response.taskSectionModels[i].paramList[j].value;
							}

							if (response.taskSectionModels[i].paramList[j].name == 'SCR' && response.taskSectionModels[i].paramList[j].value == '*') {
								this.lmosButtonDisabled = true;
							}
						}
					}
				}else{
					for (let j = 0; j < response.taskSectionModels[i].paramList.length; j++) {

						const Data = response.taskSectionModels[i].paramList[j];
						if (Data.type == 'tableData') {
							response.taskSectionModels[i].paramList[j].value = JSON.parse(Data.value);
						response.taskSectionModels[i].paramList[j].value['id']=response.taskSectionModels[i].paramList[j]['name'];
						response.taskSectionModels[i].paramList[j].value['rowEdit']=false;
						response.taskSectionModels[i].paramList[j].value['obj']=JSON.stringify(response.taskSectionModels[i].paramList[j]);
						this.tableDetailTableSection[response.taskSectionModels[i]['header']]['tableData'].push(
							response.taskSectionModels[i].paramList[j].value
						);
						}
						if (Data.type == 'tableHeader') {
							response.taskSectionModels[i].paramList[j].jsonDescriptor = JSON.parse(Data.jsonDescriptor);
						}



						
						if (response.taskSectionModels[i].paramList[j].name === 'dueDate') {
							// dueDate = element.fieldValue.toISOString().substr(0, 10);
							let tempDate = new Date(response.taskSectionModels[i].paramList[j].value);
							let dueDate = new Date(Date.UTC(
								tempDate.getUTCFullYear(),
								tempDate.getUTCMonth(),
								tempDate.getUTCDate()) + 86400000);

								response.taskSectionModels[i].paramList[j].value = dueDate;
						}
						if (response.sourceSystemName == 'LMOS') {
							if (response.taskSectionModels[i].paramList[j].name == 'EC') {
								this.wcmRequestData.EC = response.taskSectionModels[i].paramList[j].value;
							} else if (response.taskSectionModels[i].paramList[j].name == 'TTN') {
								this.wcmRequestData.TTN = response.taskSectionModels[i].paramList[j].value;
							} else if (response.taskSectionModels[i].paramList[j].name == 'TN') {
								this.wcmRequestData.TN = response.taskSectionModels[i].paramList[j].value;
							} else if (response.taskSectionModels[i].paramList[j].name == 'MC') {
								this.wcmRequestData.MC = response.taskSectionModels[i].paramList[j].value;
							} else if (response.taskSectionModels[i].paramList[j].name == 'REQ') {
								this.wcmRequestData.REQ = response.taskSectionModels[i].paramList[j].value;
							} else if (response.taskSectionModels[i].paramList[j].name == 'DB') {
								this.wcmRequestData.DB = response.taskSectionModels[i].paramList[j].value;
							} else if (response.taskSectionModels[i].paramList[j].name == 'T') {
								this.wcmRequestData.T = response.taskSectionModels[i].paramList[j].value;
							} else if (response.taskSectionModels[i].paramList[j].name == 'C') {
								this.wcmRequestData.C = response.taskSectionModels[i].paramList[j].value;
							} else if (response.taskSectionModels[i].paramList[j].name == 'D') {
								this.wcmRequestData.D = response.taskSectionModels[i].paramList[j].value;
							} else if (response.taskSectionModels[i].paramList[j].name == 'FL1') {
								this.wcmRequestData.FL1 = response.taskSectionModels[i].paramList[j].value;
							} else if (response.taskSectionModels[i].paramList[j].name == 'FL3') {
								this.wcmRequestData.FL3 = response.taskSectionModels[i].paramList[j].value;
							} else if (response.taskSectionModels[i].paramList[j].name == 'X') {
								this.wcmRequestData.X = response.taskSectionModels[i].paramList[j].value;
							} else if (response.taskSectionModels[i].paramList[j].name == 'TRACE') {
								this.wcmRequestData.TRACE = response.taskSectionModels[i].paramList[j].value;
								//	} else if (element.name == 'URL') {
								//		this.wcmRequestData.URL = element.value;
							} else if (response.taskSectionModels[i].paramList[j].name == 'Region') {
								this.wcmRequestData.Region = response.taskSectionModels[i].paramList[j].value;
							}

							if (response.taskSectionModels[i].paramList[j].name == 'SCR' && response.taskSectionModels[i].paramList[j].value == '*') {
								this.lmosButtonDisabled = true;
							}
						}
						if (response.taskSectionModels[i].paramList[j].name != '' && response.taskSectionModels[i].paramList[j].name != null) {
							if (response.taskSectionModels[i].paramList[j].name.startsWith('predictor') && response.taskSectionModels[i].paramList[j].name != 'predictor') {
								this.PredictorData = this.PredictorData + response.taskSectionModels[i].paramList[j].value;
							}
						}


					}
				}
			

			
				// if (response.taskSectionModels[i].header == 'Other Details') {
				// 	response.taskSectionModels[i].paramList.push({header: 'Other Details', jsonDescriptor: null, name: 'predictor1', value: predector1.substring(0,700)}); 
				// 	response.taskSectionModels[i].paramList.push({header: 'Other Details', jsonDescriptor: null, name: 'predictor2', value: predector1.substring(701,1155)}); 
				// 	response.taskSectionModels[i].paramList.push({header: 'Other Details', jsonDescriptor: null, name: 'predictor3', value: predector1.substring(4148,6185)}); 
				// 	response.taskSectionModels[i].paramList.push({header: 'Other Details', jsonDescriptor: null, name: 'predictor4', value: predector1.substring(6186,8290)}); 
				// }
			}
		}
	}

	getActivityLog() {
		// this.loader = false;
		console.log("this.taskDetails.id", this.taskDetails.id, this.taskDetails.sourceTaskId);
		this.taskService.getActivityLogForTask('/Enterprise/v2/Work/task/' + this.taskDetails.id + '/activityLog?include=a').toPromise().then((Logresp: any) => {
			//this.taskService.callGetUrl('/Enterprise/v2/Work/task/' + response.id + '/activityLog').toPromise().then((Logresp: any) => {
			//this.loader = false;
			this.logData = Logresp;
			this.logDetails = Logresp;
			for (let index = 0; index < this.logData.length; index++) {
				this.logData[index]['activityDetails'] = this.logData[index]['activityDetails'].replace('/n', '\n');
				this.logData[index]['createdDateTime'] = this.dateConvertor.LocalDate(this.logData[index]['createdDateTime']);
			}
			this.LogDetailsParameter.tableData = [];
			
			this.LogDetailsParameter.tableData = Logresp;
			console.log(this.LogDetailsParameter.tableData,"++++++++++++++++++")
			let userData: any = JSON.parse(localStorage.getItem("fd_user"));
			//this.LogDetailsParameter.tableData.forEach(element => {
			//element.createdById = userData.cuid;
			//});
			this.pagination.totalRecords = Logresp.length;
			this.pagination.pageSize = 10;
			this.pagination.pageNumber = 0;
			let pageCount = this.logData.length % this.currentPageLimit == 0 ? this.logData.length / this.currentPageLimit :
				this.logData.length / this.currentPageLimit + 1;
			this.totalPageData = this.logData.length;
			this.totalPage = Math.ceil(this.logData.length / this.currentPageLimit);
			this.pagination.totalPage = this.totalPage;
			this.pagination.allItems = this.pagination.allItems.concat(this.logData);
			/*let pageset = [];
			for (let j = 1; j <= pageCount; j++) {
				let page = this.makePage(j, j.toString(), j === 1);
				pageset.push(page);
				if (j == pageCount) {
					this.convertNumberToArray(pageset);
				}
			}
			this.onPaginateInnerGrid(1);*/
			this.showLogs = true;
			 this.loader = false;
			this.logDetailData = true;
		}).catch((errorObj: any) => {
			this.loader = false;
		});
	}

	/* GettaskIncludeAADetails(id) {
		this.taskService.getTaskIncludeAA(id).toPromise().then((response: any) => {
				this.actionList = [];
				response.allowedactions.forEach(element => {
					for (let i = 0; i < element.allowedactions.length; i++) {
						this.actionList.push({value: element.allowedactions[i]});
					}
				});
			});
			// .catch((error: any) => {
			// 	self.loader = false;
			// 	self.snackBar.open("Error loading Task Details..", "Okay", {
			// 		duration: 15000,
			// 	});
			// });
	} */

	private relatedTabs: any = {};

	getParsedArray(stringJSON) {
		let outputJSON: any;
		outputJSON = JSON.parse(stringJSON);
		return outputJSON;
	}

	getLMOSScreeningData() {
		// console.log(this.pageLayoutTemplate);
		let mappedFieldObj: any = {};
		let facilities = [];
		this.TempfacilitiesData = [];
		this.facilitiesData = [];
		this.taskDetails['taskSectionModels'].forEach((section: any) => {
			if (section.header != 'Facilities') {
				section.paramList.forEach((param: any) => {
					mappedFieldObj[param.name] = param.value;
				})
			} else {
				facilities = section.paramList;
			}
		});
		this.pageLayout['pageLayoutTemplate'].forEach(pageElement => {
			if (pageElement.sectionHeader != 'Related-Tabs' && pageElement.sectionHeader != 'Buttons' && pageElement.sectionHeader != 'Facilities'
				&& pageElement.sectionHeader != 'pagination' && pageElement.sectionHeader != 'WCM-ScreeningTable Buttons') {
				pageElement.fieldsList.forEach((field: any) => {
					field.fieldValue = mappedFieldObj[field.fieldName];
				})
				this.loaderLmosTaskPopup = false;
			} else if (pageElement.sectionHeader == 'Facilities') {
				// this.actionColumn = pageElement.fieldsList;
				this.showFacility = false;
				let addRow : boolean = false;
				let editRow : boolean = false;
				facilities.forEach(facility => {
					try {
						if (facility.jsonDescriptor) {
							facility.parsedjsonDescriptor = JSON.parse(facility.jsonDescriptor);
						}
						if (facility.paramFieldLayout && facility.paramFieldLayout.tableHeaders) {
							facility.parsedLayouttableHeaders = JSON.parse(facility.paramFieldLayout.tableHeaders);
							for(let header of facility.parsedLayouttableHeaders){
								header['visible'] = true;
								if(header['fieldName']==undefined){
									header['fieldName']= header['columnKey'];
								}
								if(header['label']==undefined){
									header['label']= header['columnHeader'];
								}
								header['filter']= true
								header['sort']= true;
								
								if(header['type']=='Text'){
									header['type']= "TableHeader";
								}
								
								
							}
							pageElement.headers = facility.parsedLayouttableHeaders;
							if(facility.paramFieldLayout.addRow && (facility.paramFieldLayout.addRow == true || facility.paramFieldLayout.addRow == "true") ){
								addRow = true
							}
							if(facility.paramFieldLayout.editable && (facility.paramFieldLayout.editable == true || facility.paramFieldLayout.editable == "true")){
								editRow = true
							}
						}else if(facility.parsedjsonDescriptor && facility.parsedjsonDescriptor.tableHeaders){

							facility.parsedLayouttableHeaders = facility.parsedjsonDescriptor.tableHeaders;
							for(let header of facility.parsedLayouttableHeaders){
								header['visible'] = true;
								if(header['fieldName']==undefined){
									header['fieldName']= header['columnKey'];
								}
								if(header['label']==undefined){
									header['label']= header['columnHeader'];
								}
								header['filter']= true
								header['sort']= true;
								
								if(header['type']=='Text'){
									header['type']= "TableHeader";
								}
								
								
							}
							pageElement.headers = facility.parsedLayouttableHeaders;
							if(facility.parsedjsonDescriptor.addRow && (facility.parsedjsonDescriptor.addRow == true || facility.parsedjsonDescriptor.addRow == "true") ){
								addRow = true
							}
							if(facility.parsedjsonDescriptor.editable && (facility.parsedjsonDescriptor.editable == true || facility.parsedjsonDescriptor.editable == "true")){
								editRow = true
							}


						}
						if (facility.value) {
							facility.facilityParsed = JSON.parse(facility.value);
							var obj = {};
							for (let i = 0; i < pageElement.fieldsList.length; i++) {
								obj[pageElement.fieldsList[i].fieldName] = facility.facilityParsed[pageElement.fieldsList[i].fieldName];
							}
							this.facilitiesData.push(obj);
							this.TempfacilitiesData.push(obj);
						}
					} catch (error) {
					}
				})

				if(pageElement && pageElement.headers && pageElement.headers.length<1){
					pageElement.headers = pageElement.fieldsList;

				}

				
				this.tableDetailTableSection['Facilities']['tableHeaders'] = pageElement.headers;
				
				this.tableDetailTableSection['Facilities']['otherContent']['tableData'] = this.tableDetailTableSection['Facilities']['tableData']
				//this pagination object will be come as part of the page layout template for facility table, will update till it is hardcoded
				let pagintn ={
					"totalRecords": this.tableDetailTableSection['Facilities']['otherContent']['tableData'].length,
					"fieldName": "pagination",
					"pageNumber": 0,
					"pageNumberText": "Page Number -",
					"totalRecordsText": "Total number of records: ",
					"pageLimitOptions": [
					  10,
					  20,
					  50,
					  100
					],
					'totalPage':15,
					"pageSize": 10,
					"pageLayoutFieldId": "441",
					"label": "pagination",
					"perPageText": "Per Page",
					"type": "pagination",
					"fieldValue": "",
					'selectedLimit' : 10,
					'currentPageNumber':1,
					'allItems' : this.tableDetailTableSection['Facilities']['tableData'],
					'pager':{startIndex: 0, endIndex:  2}
				  };
				pagintn.pageSize = 10;
				pagintn.pageNumber = 0;
				// this.pagination.allItems = this.pagination.allItems.concat(this.logData);
				let pageCount = 5 ;
				// this.totalPage = Math.ceil(5);
				pagintn.totalPage = Math.ceil(5);
				this.totalPageData = this.logData.length;
				this.tableDetailTableSection['Facilities']['pagination']=pagintn;

				let actionClm = [
					{
						"apiUrl": "",
						"class": "search-btn",
						'fieldName': "Add",
						'fieldValue': "",
						'label': "Add",
						'pageLayoutFieldId': "3833",
						'visible': addRow
					},	{
						"apiUrl": "",
						"class": "search-btn",
						'fieldName': "Edit",
						'fieldValue': "",
						'label': "Edit",
						'pageLayoutFieldId': "3833",
						'visible': editRow
					},	{
						"apiUrl": "",
						"class": "search-btn",
						'fieldName': "Delete",
						'fieldValue': "",
						'label': "Delete",
						'pageLayoutFieldId': "3833",
						'visible': editRow || addRow
					}
				];
				this.tableDetailTableSection['Facilities']['actionColumn'] = actionClm;
				setTimeout(() => {
					this.showFacility= true;
				}, 500);
				// this.tableComponent.setPage(1);


				// pageElement.fieldsList = facilities;
			} else if (pageElement.sectionHeader == 'Related-Tabs') {
				// this.relatedTabs = pageElement.fieldsList;
				let RelatedTabLength = this.relatedTabs.length - 1;
				for (let i = 0; i < this.relatedTabs.length; i++) {
					if (!this.IsHalfScreen) {
						if (i != 0) {
							this.loadTabDetails(i, false);
						}
					} else {
						if (this.relatedTabs[i]['fieldName'] == 'mltfx' || this.relatedTabs[i]['fieldName'] == 'dleth' || this.relatedTabs[i]['fieldName'] == 'dsh' || this.relatedTabs[i]['fieldName'] == 'dlrl' || this.relatedTabs[i]['fieldName'] == 'Predictor') {
							if (i != 0) {
								this.loadTabDetails(i, false);
							}
						}
					}
				}
				if (this.relatedTabs.length > 0) {
					if (!this.IsHalfScreen) {
						setTimeout(() => {
							this.loadTabDetails(0, true);
						}, 1000);
					}
				}
			} /* else if (pageElement.sectionHeader == 'pagination') {
				// this.actionColumn = pageElement.fieldsList;
				this.pagination = pageElement.fieldsList[0];

				this.pagination.selectedLimit = this.pagination.pageLimitOptions[0];
				this.pagination.pageNumber = 0;
				this.pagination.pageSize = 100;
				this.pagination.currentPageNumber = 1;
				this.pagination.totalRecords = 0;
				let pageCount = this.facilitiesData.length % this.currentPageLimit == 0 ? this.facilitiesData.length / this.currentPageLimit :
					this.facilitiesData.length / this.currentPageLimit + 1;
				this.totalPageData = this.facilitiesData.length;
				this.totalPage = Math.ceil(this.facilitiesData.length / this.currentPageLimit);
				this.pagination.totalPage = this.totalPage;
				this.pagination.totalRecords = this.facilitiesData.length;
				this.convertNumberToArray(pageCount);
				this.onPaginateInnerGrid(1);
			} else if (pageElement.sectionHeader == 'WCM-ScreeningTable Buttons') {
				this.actionButton = pageElement.fieldsList;
			} */
		});
		// });
	}

	getLogDetails() {
		this.taskDetailsBackup = JSON.parse(JSON.stringify(this.taskDetails));
		// this.getActivityLog();
		/*
		this.taskService.getAuditResults(this.taskDetails.appTaskInstanceId, this.applicationName[0]).toPromise().then((response:any)=>{
			this.tempAuditResults = response;
			this.auditResults = this.tempAuditResults;
		}).catch((error: any)=>{
		})*/

		/*
		this.taskService.callGetUrl('/ActivityLog/GetAll/BPMS/Task/41947776').toPromise().then((resp) => {
		});*/
		/*
		this.taskService.getActivityLog(this.taskDetails.appTaskInstanceId).toPromise().then((response:any)=>{
			this.tempAuditResults = response;
			this.auditResults = this.tempAuditResults;
		}).catch((error: any)=>{
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

	facilityfilterTaskResult(columnName: string) {
		let thi = this;
		const globalSearch = this.systemParameter.globalSearch;
		let temp: any;
		if (globalSearch !== '') {
			temp = this.TempfacilitiesData.filter(row => {
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
			temp = this.TempfacilitiesData.filter(function (item) {
				let flag = true;
				Object.keys(item).forEach((element) => {
					if (flag && thi.actionColumn[element] && item[element] && thi.actionColumn[element] != "") {
						if (flag && item[element].toLowerCase().indexOf(thi.actionColumn[element].toLowerCase()) === -1) {
							flag = false;
						}
					}
				});
				return flag;
			});
		}


		this.facilitiesData = temp;
		this.onPaginateInnerGrid(1);
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
	OnSMESortSection(columnName) {
		this.activeSort = columnName;
		if (this.isSortAsc) {
			this.isSortAsc = false;
			this.tableData.sort(this.dynamicSort(columnName));
		} else {
			this.isSortAsc = true;
			this.tableData.sort(this.dynamicSort('-' + columnName));
		}
	}

	onFacilitySortSelection(columnName: string) {
		if (this.isSortAsc) {
			this.isSortAsc = false;
			this.systemParameter.isSortAsc = false;
			this.DisplayfacilitiesData.sort(this.dynamicSort(columnName));
		} else {
			this.isSortAsc = true;
			this.systemParameter.isSortAsc = true;
			this.DisplayfacilitiesData.sort(this.dynamicSort('-' + columnName));
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
		this.loader = true;
		this.taskService.saveTaskDetails(req_data).toPromise().then((response: any) => {
			this.loader = false;
			this.loaderTaskDetail = false;
			this.getTaskDetails(true, false);
			const appName = this.taskDetails.application ? this.taskDetails.application.applicationName : '';
			this.loader = true;
			this.taskService.getAuditResults(this.taskDetails.appTaskInstanceId, appName).toPromise().then((response: any) => {
				this.loader = false;
				this.tempAuditResults = response;
				this.auditResults = this.tempAuditResults;
			}).catch((error: any) => {
				this.loader = false;
			})
			this.showViewPage = true;
			this.IsSucess = true;
			this.message = response.message;
			setTimeout(() => {
				this.IsSucess = false;
			}, 7000);
		}).catch((error: any) => {
			this.loader = false;
			this.loaderTaskDetail = false;
			this.IsError = true;
			this.message = error.error.message;
			setTimeout(() => {
				this.IsError = false;
			}, 7000);
		});
	}

	toggleRes2Width() {
		this.res2Full = !this.res2Full;
		if (this.res2Full == true) {
			$(".resizable2").css("width", "100%");
			$(".resizable1").css("width", "0%");
			//$(".resizable2").css("top", "0");
			$(".resizable1").hide();
			//$('.sticky-tab-header').css('width', 'calc(100% - 220px)');
		}
		else {
			if (this.IsHalfScreen == true) {

			}
			$(".resizable2").css("width", "50%");
			$(".resizable1").css("width", "50%");
			//$(".resizable2").css("top", "-38px");
			$(".resizable1").show();
			//$('.sticky-tab-header').css('width', 'calc(50% - 110px)');
		}
	}

	maximizeLeftPanelWindow() {
		var f = $(".resizable1").width() / $('.resizable1').parent().width() * 100;
		// var f = $(".contant-tab").width() / $('.resizable1').parent().width() * 100;
		$(".width50Per").removeClass('width50Per');
		$(".sticky-Width").removeClass('sticky-Width');
		$('.GetHeight').height();
		if (f >= 98) {
			// this.loadTabDetails(0);
			this.IsHalfScreen = true;
			this.res2Full = false;
			$(".resizable1").css("width", "50%");
			$(".resizable1").css("max-height", "calc(100vh - 200px)");
			//$('.sticky-tab-header').css('width', '41%');
			$(".resizable2").css("width", "50%");
			//$(".resizable2").css("top", "-38px");
			$(".resizable2").show();
			$(".resizable2").css("max-height", "calc(100vh - 200px)");
			$(".wcm_background").css("height", "calc(100vh - 265px)");
			// $(".wcm_background").css("min-height", "100%");
			$(".border-right-bottom").addClass('fix-cardbox-width');
			// $(".lmos-border-right-bottom").css("min-height", "auto");

			$(".Data-Box").addClass('fix-Data-Box-width');
			//$(".btn-header.menu-icon .toggle .fa-reorder").hide();
			/* $(".btn-header.menu-icon .toggle .lmos-tb-hvr").hide();
			$(".lmos-tb-hvr").css("display", "none"); */
			//$(".btn-header.menu-icon .toggle .handsymbol").show();
			$(".btn-header.menu-icon .toggle .fa-plane-alt").show();
			$('#tablesection .displayflex .actionbtnsection').css('width', '42%');
			$($('#tablesection .table .activesort')).each(function () {
				$(this).find('span').eq(0).addClass('field-label');
			});
			/*
			const getHeight = $('.GetHeight').height();
			this.SetHeight = getHeight - 69;
			$('.set-height').css({'min-height': getHeight - 69 + 'px', 'height': getHeight - 69 + 'px'}); */
		} else {
			this.IsHalfScreen = false;
			$(".resizable1").css("width", "100%");
			$(".resizable2").css("width", "0%");
			//$(".resizable2").css("top", "unset");
			$(".resizable2").hide();
			$(".resizable1").show();
			$(".height-100-200").css("height", "auto");
			//$('.sticky-tab-header').css('width', 'calc(100% - 220px)');
			$(".border-right-bottom").removeClass('fix-cardbox-width');
			// $(".lmos-border-right-bottom").css("min-height", "330px");
			$(".Data-Box").removeClass('fix-Data-Box-width');
			//$(".btn-header.menu-icon .toggle .fa-reorder").show();
			/* $(".btn-header.menu-icon .toggle .lmos-tb-hvr").show();
			$(".lmos-tb-hvr").css("display", "inline-block"); */
			//$(".btn-header.menu-icon .toggle .handsymbol").hide();
			$(".btn-header.menu-icon .toggle .fa-plane-alt").hide();
			$('#tablesection .displayflex .actionbtnsection').removeAttr('style');
			$($('#tablesection .table .activesort')).each(function () {
				$(this).find('span').eq(0).removeClass('field-label');
			});
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
				this.loader = true;
				this.taskService.saveActivityLog(activityLog).toPromise().then((response: any) => {
					this.loader = false;
					this.IsSucess = true;
					this.message = response.message;
					setTimeout(() => {
						this.IsSucess = false;
					}, 7000);
				}).catch((error: any) => {
					this.loader = false;
					this.IsError = true;
					this.message = error.error.message;
					setTimeout(() => {
						this.IsError = false;
					}, 7000);
				});
			}
		});
		dialogRef.afterClosed().subscribe(result => {
		});
	} */

	getData(event) {
	}

	onChange() {
		this.options.mode = this.options.inline ? 'inline' : 'popup';
		this.lmosOptions.mode = this.lmosOptions.inline ? 'inline' : 'popup';
	}

	onEdit() {
		this.isEditable = true;
	}

	onCancel() {
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
		this.loader = true;
		this.taskService.getTaskVersionDetails(this.processData.sourceSystemName, this.processData.taskInstanceId).toPromise().then((response: any) => {
			this.loader = false;
			this.versions = response.versions;
			this.loaderTaskDetail = false;
			this.versionDetailArr = response.versionDetailArr;
			this.versionDetailArrBackup = this.versionDetailArr;
		}).catch(error => {
			this.loader = false;
			this.loaderTaskDetail = false;
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

	processAuditLog(activityType: string) {
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
	}

	private reloadTaskDetails() {
		let index: number;
		// this.loaderLmosTaskRelativeTab = true;
		this.relatedTabs.forEach((tab: any, i) => {
			//tab.active = false;
			if (tab.active == true) {
				index = i;
			}
		});
		// this.relatedTabs[index].active = true;
		const tab = this.relatedTabs[index];
		this.relatedTabs[index].loader = true;
		// const getHeight = $('.GetHeight').height();
		// $('.set-height').css({'min-height': getHeight - 30 + 'px', 'height': getHeight - 30 + 'px'});
		let serviceUrl = tab.service;
		if (tab.fieldName == 'mltfx') {
			serviceUrl = serviceUrl.replace('replaceEC', this.wcmRequestData.EC);
			serviceUrl = serviceUrl.replace('replaceTN', this.wcmRequestData.TN);
			serviceUrl = serviceUrl.replace('replaceREQ', this.wcmRequestData.REQ);
		} else if (tab.fieldName == 'dleth') {
			serviceUrl = serviceUrl.replace('TN', this.wcmRequestData.TN);
			serviceUrl = serviceUrl + ((this.wcmRequestData.EC == null) ? 999 : this.wcmRequestData.EC);
		} else if (tab.fieldName == 'dsh' || tab.fieldName == 'detr') {
			serviceUrl = serviceUrl.replace('TN', this.wcmRequestData.TN);
		} else if (tab.fieldName == 'dlrl') {
			serviceUrl = serviceUrl.replace('TN', this.wcmRequestData.TN);
			serviceUrl = serviceUrl + ((this.wcmRequestData.EC == null) ? 999 : this.wcmRequestData.EC);
		} else if (tab.fieldName == 'Predictor') {
			serviceUrl = serviceUrl.replace('replaceTN', this.wcmRequestData.TN);
			// serviceUrl = serviceUrl.replace('TN=replaceTN', this.wcmRequestData.TN);
		}
		// const request = { url: serviceUrl, httpMethod: tab.httpMethod.toUpperCase() };
		// this.loaderLmosTaskRelativeTab = true;
		// this.taskService.invokeLMOSAPI(request).toPromise().then((response: any) => {
		// 	// this.loader = false;
		// 	this.setLMOSResponse(JSON.parse(response.message), index);
		// }).catch((errorObj: any) => {
		// 	this.loaderLmosTaskRelativeTab = false;
		// });
		if (tab.fieldName == 'Predictor' || tab.fieldName == 'mltfx' || tab.fieldName == 'bossCars'
			|| tab.fieldName == 'dleth' || tab.fieldName == 'dsh' || tab.fieldName == 'dlrl') {
			// console.log(tab.label);
			if (this.relatedTabs[index].active) {
				var param = "";
				if (tab.fieldName == 'Predictor')
					param = "PRED";
				else if (tab.fieldName == 'mltfx')
					param = "MLTFX";
				else if (tab.fieldName == 'bossCars')
					param = "BOSS";
				else if (tab.fieldName == 'dleth')
					param = "DLETH"
				else if (tab.fieldName == 'dlrl')
					param = "DLR"
				else if (tab.fieldName == 'dsh')
					param = "DSH"
				this.taskService.LoadlmostabData(this.taskDetails.id, param).toPromise().then((res: any) => {
					//refreshicon
					// this.setLMOSResponse(JSON.parse(res.message), index);
					if (res.message == 'Enriched') {
						// this.relatedTabs[index].content = 'MLTFX and Predictor Enriched';
						this.IsSucess = true;
						this.getTaskDetails(false, false);
						// if (param == "PRED")
						// 	this.message = 'Predictor Refreshed Successfully';
						// else if (param == "MLTFX")
						// 	this.message = 'MLTFX Refreshed Successfully';
						// else if (param == "BOSS")
						// 	this.message = 'BOSS Refreshed Successfully';
						this.message = param + ' Refreshed Successfully'
						setTimeout(() => {
							this.IsSucess = false;
						}, 7000);
					}
					// this.loaderLmosTaskRelativeTab = false;
					// this.relatedTabs.forEach((tab: any) => tab.active = false);
					// this.relatedTabs[index].active = true;
					this.relatedTabs[index].loader = false;
				}).catch((errorObj: any) => {
					// this.loader = false;
					this.IsError = true;
					this.message = errorObj.error.message;
					setTimeout(() => {
						this.IsError = false;
					}, 7000);
					this.loaderLmosTaskRelativeTab = false;
					this.relatedTabs[index].loader = false;
				});
			}
		} else {
			const UnMappedFieldsData = this.taskDetails['taskSectionModels'].find((x) => x.header == 'Other Details');
			//const URLData = UnMappedFieldsData['paramList'].find((x) => x.name == 'URL');
			const region = this.taskDetails['taskInstParamRequests'].filter((x) => x.name == 'Region');

			//if (URLData) {
			serviceUrl = serviceUrl.replace('http://vlodts012.test.intranet:3000', "");
			let DB_Data = UnMappedFieldsData['paramList'].find((x) => x.name == 'DB');
			let isMCMD = serviceUrl.indexOf('MCMD') > -1;
			if (isMCMD && DB_Data && DB_Data.name == "DB" && DB_Data.value) {
				serviceUrl = serviceUrl + "&" + DB_Data.name + "=" + DB_Data.value;
			}
			const request = { url: serviceUrl, httpMethod: tab.httpMethod.toUpperCase(), region: region[0].value };
			// this.loader = true;
			this.taskService.invokeLMOSAPI(request).toPromise().then((response: any) => {
				// this.loader = false;
				this.setLMOSResponse(JSON.parse(response.message), index, true);
				// this.loaderLmosTaskRelativeTab = false;
				// this.relatedTabs.forEach((tab: any) => tab.active = false);
				// this.relatedTabs[index].active = true;
			}).catch((errorObj: any) => {
				// this.loader = false;
				this.relatedTabs[index].content = 'Data not found';
				this.loaderLmosTaskRelativeTab = false;
				this.relatedTabs.forEach((tab: any) => tab.active = false);
				this.relatedTabs[index].active = true;
				this.relatedTabs[index].loader = false;
			});
			// } else {
			// 	this.relatedTabs[index].content = 'Data URL not found';
			// 	this.loaderLmosTaskRelativeTab = false;
			// 	this.relatedTabs.forEach((tab: any) => tab.active = false);
			// 	this.relatedTabs[index].active = true;
			// 	this.relatedTabs[index].loader = false;
			// }
			//}
		}
	}

	private async loadTabDetails(index: number, IsActive) {
		//console.clear();
		// console.log(index, this.relatedTabs[index]);
		// this.TabloaderTaskDetail = true;
		// console.log(this.relatedTabs[index]);
		// console.log(this.IsHalfScreen);
		if (!this.IsHalfScreen) {
			this.RelatedTabMenuButtonDisabled = true;
			// this.loaderLmosTaskPopup = true;
		}

		if (this.relatedTabs[index].loader) {
			this.relatedTabs.forEach((tab: any) => tab.active = false);
			this.relatedTabs[index].active = true;
			return false;
		}
		if (IsActive) {
			this.loaderLmosTaskRelativeTab = true;
			this.relatedTabs[index].loader = true;
		}

		// this.relatedTabs[index].active = true;
		const tab = this.relatedTabs[index];
		// const getHeight = $('.GetHeight').height();
		// $('.set-height').css({'min-height': getHeight - 30 + 'px', 'height': getHeight - 30 + 'px'});

		let serviceUrl = tab.service;
		if (tab.fieldName == 'mltfx') {
			serviceUrl = serviceUrl.replace('replaceEC', this.wcmRequestData.EC);
			serviceUrl = serviceUrl.replace('replaceTN', this.wcmRequestData.TN);
			serviceUrl = serviceUrl.replace('replaceREQ', this.wcmRequestData.REQ);
		} else if (tab.fieldName == 'dleth') {
			serviceUrl = serviceUrl.replace('TN', this.wcmRequestData.TN);
			serviceUrl = serviceUrl + ((this.wcmRequestData.EC == null) ? 999 : this.wcmRequestData.EC);
		} else if (tab.fieldName == 'dsh' || tab.fieldName == 'detr') {
			serviceUrl = serviceUrl.replace('TN', this.wcmRequestData.TN);
		} else if (tab.fieldName == 'dlrl') {
			serviceUrl = serviceUrl.replace('TN', this.wcmRequestData.TN);
			serviceUrl = serviceUrl + ((this.wcmRequestData.EC == null) ? 999 : this.wcmRequestData.EC);
		} else if (tab.fieldName == 'Predictor') {
			serviceUrl = serviceUrl.replace('replaceTN', this.wcmRequestData.TN);
			// serviceUrl = serviceUrl.replace('TN=replaceTN', this.wcmRequestData.TN);
		}
		//console.clear();
		// console.log(serviceUrl);
		if (tab.fieldName == 'Predictor' || tab.fieldName == 'mltfx' || tab.fieldName == 'bossCars'
			|| tab.fieldName == 'dsh' || tab.fieldName == 'dleth' || tab.fieldName == 'dlrl') {
			// console.log(tab.label);
			// if (this.relatedTabs[index].active) {
			// 	this.taskService.LoadlmostabData(this.taskDetails.sourceTaskId).toPromise().then((res: any) => {
			// 		this.loaderLmosTaskRelativeTab = false;
			// 	});
			// } else {
			if (tab.fieldName == 'Predictor') {
				this.relatedTabs[index].content = this.taskDetails.predictor;//param predictor
				// this.setLMOSResponse(JSON.parse(this.taskDetails.Predictor), index);
				const UnMappedFieldsData = this.taskDetails['taskSectionModels'].find((x) => x.header == 'Other Details');
				if (isObject(UnMappedFieldsData)) {
					// const predictorData = UnMappedFieldsData['paramList'].find((x) => x.name == 'predictor');
					if (this.PredictorData != '') {
						try {
							this.setLMOSResponse(JSON.parse(this.PredictorData), index, IsActive);
							// this.loaderLmosTaskRelativeTab = false;
							// this.relatedTabs.forEach((tab: any) => tab.active = false);
							// this.relatedTabs[index].active = true;
							// this.relatedTabs[index].loader = false;
						} catch (e) {
							this.relatedTabs[index].content = 'Data not found';
							if (IsActive) {
								this.loaderLmosTaskRelativeTab = false;
								this.relatedTabs.forEach((tab: any) => tab.active = false);
								this.relatedTabs[index].active = true;
								this.relatedTabs[index].loader = false;
								this.RelatedTabMenuButtonDisabled = false;
								this.loaderLmosTaskPopup = false;
							}
						}
					} else {
						this.relatedTabs[index].content = 'Data not found';
						if (IsActive) {
							this.loaderLmosTaskRelativeTab = false;
							this.relatedTabs.forEach((tab: any) => tab.active = false);
							this.relatedTabs[index].active = true;
							this.relatedTabs[index].loader = false;
							this.RelatedTabMenuButtonDisabled = false;
							this.loaderLmosTaskPopup = false;
						}
					}

				}
			} else if (tab.fieldName == 'dsh') {
				const UnMappedFieldsData = this.taskDetails['taskSectionModels'].find((x) => x.header == 'Other Details');
				if (isObject(UnMappedFieldsData)) {
					const DSHData = UnMappedFieldsData['paramList'].find((x) => x.name == 'DSH');
					if (DSHData) {
						try {
							this.setLMOSResponse(JSON.parse(DSHData.value), index, IsActive);
						} catch (e) {
							this.relatedTabs[index].content = 'Data not found';
							if (IsActive) {
								this.loaderLmosTaskRelativeTab = false;
								this.relatedTabs.forEach((tab: any) => tab.active = false);
								this.relatedTabs[index].active = true;
								this.relatedTabs[index].loader = false;
								this.RelatedTabMenuButtonDisabled = false;
								this.loaderLmosTaskPopup = false;
							}
						}
					} else {
						// console.log(5);
						this.relatedTabs[index].content = 'Data not found';
						if (IsActive) {
							this.loaderLmosTaskRelativeTab = false;
							this.relatedTabs.forEach((tab: any) => tab.active = false);
							this.relatedTabs[index].active = true;
							this.relatedTabs[index].loader = false;
							this.RelatedTabMenuButtonDisabled = false;
							this.loaderLmosTaskPopup = false;
						}
					}

					// console.log(this.relatedTabs[index]);

				}
			}
			else if (tab.fieldName == 'dleth') {
				const UnMappedFieldsData = this.taskDetails['taskSectionModels'].find((x) => x.header == 'Other Details');
				if (isObject(UnMappedFieldsData)) {
					const DLETHData = UnMappedFieldsData['paramList'].find((x) => x.name == 'DLETH');
					if (DLETHData) {
						try {
							this.setLMOSResponse(JSON.parse(DLETHData.value), index, IsActive);
						} catch (e) {
							this.relatedTabs[index].content = 'Data not found';
							if (IsActive) {
								this.loaderLmosTaskRelativeTab = false;
								this.relatedTabs.forEach((tab: any) => tab.active = false);
								this.relatedTabs[index].active = true;
								this.relatedTabs[index].loader = false;
								this.RelatedTabMenuButtonDisabled = false;
								this.loaderLmosTaskPopup = false;
							}
						}
					} else {
						// console.log(5);
						this.relatedTabs[index].content = 'Data not found';
						if (IsActive) {
							this.loaderLmosTaskRelativeTab = false;
							this.relatedTabs.forEach((tab: any) => tab.active = false);
							this.relatedTabs[index].active = true;
							this.relatedTabs[index].loader = false;
							this.RelatedTabMenuButtonDisabled = false;
							this.loaderLmosTaskPopup = false;
						}
					}

					// console.log(this.relatedTabs[index]);

				}
			}
			else if (tab.fieldName == 'dlrl') {
				// this.relatedTabs[index].content = this.taskDetails.MLTFX;
				const UnMappedFieldsData = this.taskDetails['taskSectionModels'].find((x) => x.header == 'Other Details');
				if (isObject(UnMappedFieldsData)) {
					const DLRLData = UnMappedFieldsData['paramList'].find((x) => x.name == 'DLR');
					//console.clear();
					// console.log(MLTFXData);
					if (DLRLData) {
						// console.log(1);
						// console.log(JSON.parse(MLTFXData.value));
						try {
							// console.log(2);
							this.setLMOSResponse(JSON.parse(DLRLData.value), index, IsActive);
							// console.log(3);
							// this.loaderLmosTaskRelativeTab = false;
							// this.relatedTabs.forEach((tab: any) => tab.active = false);
							// this.relatedTabs[index].active = true;
							// this.relatedTabs[index].loader = false;
						} catch (e) {
							// console.log(4);
							// console.log(e);
							this.relatedTabs[index].content = 'Data not found';
							if (IsActive) {
								this.loaderLmosTaskRelativeTab = false;
								this.relatedTabs.forEach((tab: any) => tab.active = false);
								this.relatedTabs[index].active = true;
								this.relatedTabs[index].loader = false;
								this.RelatedTabMenuButtonDisabled = false;
								this.loaderLmosTaskPopup = false;
							}
						}
					} else {
						// console.log(5);
						this.relatedTabs[index].content = 'Data not found';
						if (IsActive) {
							this.loaderLmosTaskRelativeTab = false;
							this.relatedTabs.forEach((tab: any) => tab.active = false);
							this.relatedTabs[index].active = true;
							this.relatedTabs[index].loader = false;
							this.RelatedTabMenuButtonDisabled = false;
							this.loaderLmosTaskPopup = false;
						}
					}

					// console.log(this.relatedTabs[index]);

				}
			}
			else if (tab.fieldName == 'mltfx') {
				// this.relatedTabs[index].content = this.taskDetails.MLTFX;
				const UnMappedFieldsData = this.taskDetails['taskSectionModels'].find((x) => x.header == 'Other Details');
				if (isObject(UnMappedFieldsData)) {
					const MLTFXData = UnMappedFieldsData['paramList'].find((x) => x.name == 'MLTFX');
					if (MLTFXData) {
						try {
							this.setLMOSResponse(JSON.parse(MLTFXData.value), index, IsActive);
							// this.loaderLmosTaskRelativeTab = false;
							// this.relatedTabs.forEach((tab: any) => tab.active = false);
							// this.relatedTabs[index].active = true;
							// this.relatedTabs[index].loader = false;
						} catch (e) {
							this.relatedTabs[index].content = 'Data not found';
							if (IsActive) {
								this.loaderLmosTaskRelativeTab = false;
								this.relatedTabs.forEach((tab: any) => tab.active = false);
								this.relatedTabs[index].active = true;
								this.relatedTabs[index].loader = false;
								this.RelatedTabMenuButtonDisabled = false;
								this.loaderLmosTaskPopup = false;
							}
						}
					} else {
						this.relatedTabs[index].content = 'Data not found';
						if (IsActive) {
							this.loaderLmosTaskRelativeTab = false;
							this.relatedTabs.forEach((tab: any) => tab.active = false);
							this.relatedTabs[index].active = true;
							this.relatedTabs[index].loader = false;
							this.RelatedTabMenuButtonDisabled = false;
							this.loaderLmosTaskPopup = false;
						}
					}
				}
			}

			else if (tab.fieldName == 'bossCars') {

				const UnMappedFieldsData = this.taskDetails['taskSectionModels'].find((x) => x.header == 'Other Details');
				if (isObject(UnMappedFieldsData)) {
					const BossData = UnMappedFieldsData['paramList'].find((x) => x.name == 'BossCars');
					// if (BossData) {
					// 	this.relatedTabs[index].content = 'boss cars';
					// }
					if (BossData.value != '') {
						try {
							this.relatedTabs[index].content = BossData.value;
							if (IsActive) {
								this.relatedTabs.forEach((tab: any) => tab.active = false);
								this.relatedTabs[index].active = true;
								// this.loaderLmosTaskRelativeTab = false;	
								this.RelatedTabMenuButtonDisabled = false;
								this.loaderLmosTaskPopup = false;
								this.relatedTabs[index].loader = false;
							}
						} catch (e) {
							this.relatedTabs[index].content = 'Data not found';
							if (IsActive) {
								this.loaderLmosTaskRelativeTab = false;
								this.relatedTabs.forEach((tab: any) => tab.active = false);
								this.relatedTabs[index].active = true;
								this.relatedTabs[index].loader = false;
								this.RelatedTabMenuButtonDisabled = false;
								this.loaderLmosTaskPopup = false;
							}
						}
					}
				} else {

					this.relatedTabs[index].content = 'Data not found';
					if (IsActive) {
						this.loaderLmosTaskRelativeTab = false;
						this.relatedTabs.forEach((tab: any) => tab.active = false);
						this.relatedTabs[index].active = true;
						this.relatedTabs[index].loader = false;
						this.RelatedTabMenuButtonDisabled = false;
						this.loaderLmosTaskPopup = false;
					}
				}
			}
			// }
		} else {
			const UnMappedFieldsData = this.taskDetails['taskSectionModels'].find((x) => x.header == 'Other Details');
			//const URLData = UnMappedFieldsData['paramList'].find((x) => x.name == 'URL');
			const region = this.taskDetails['taskInstParamRequests'].filter((x) => x.name == 'Region');
			//console.log("***** stringify region" + JSON.stringify(region));
			//	if (URLData) {
			// console.log(URLData.value);
			serviceUrl = serviceUrl.replace('http://vlodts012.test.intranet:3000', "");
			// serviceUrl = serviceUrl.replace('https://sasi-sasiwrap-dev1.kubeodc.corp.intranet', URLData.value);
			let DB_Data = UnMappedFieldsData['paramList'].find((x) => x.name == 'DB');
			console.log("DB_Data", DB_Data);
			let isMCMD = serviceUrl.indexOf('MCMD') > -1;
			if (isMCMD && DB_Data && DB_Data.name == "DB" && DB_Data.value) {
				serviceUrl = serviceUrl + "&" + DB_Data.name + "=" + DB_Data.value;
			}
			const request = { url: serviceUrl, httpMethod: tab.httpMethod.toUpperCase(), region: region[0].value }; //((region.length > 0)? region[0].value : '')
			// this.loader = true;
			if (this.relatedTabs[index].content == undefined) {
				await this.taskService.invokeLMOSAPI(request).toPromise().then((response: any) => {
					this.setLMOSResponse(JSON.parse(response.message), index, IsActive);
					// this.loader = false;
					if (tab.fieldName == 'detr' && 
									!(this.taskDetails.taskStatus == "Complete" || this.taskDetails.taskStatus == "Cancelled")) {
						let taskData = JSON.parse(response.message);
						console.log('test sample data ' + JSON.stringify(taskData));
						
						if (taskData && taskData.details &&
							(taskData.details.indexOf('REPORT FAILED: NO TROUBLE PENDING') > -1
							|| taskData.details.indexOf('REPORT FAILED: NO MAINTENANCE WORK ITEM PENDING') > -1
							|| taskData.details.indexOf('REPORT FAILED: NO JUNK PENDING') > -1
							|| taskData.details.indexOf('WORK ITEM BUSY - DISPLAY ONLY') > -1
							|| taskData.details.indexOf('TRACKER ITEM - DISPLAY ONLY') > -1
							|| taskData.details.indexOf('PSM WORK ITEM - DISPLAY ONLY') > -1) ) {

							this.message = "LMOS ticket is already closed, please use ForceClose button to complete in Flightdeck";
							this.isForceClose = true;							
							this.showLmosRecoredSection = true;
							this.IsSucess = true;
							console.log("EC Value::: "+ this.isECAvailable + " and ForceClose Button::: " +this.isForceClose);
							setTimeout(() => {
								this.IsSucess = false;
							}, 5000);
						}

					}
					console.log("EC Value::: "+ this.isECAvailable + " and ForceClose Button::: " +this.isForceClose +"  and  message::::"+this.message);
					
					
					// this.loaderLmosTaskRelativeTab = false;
					// this.relatedTabs.forEach((tab: any) => tab.active = false);
					// this.relatedTabs[index].active = true;
					// this.relatedTabs[index].loader = false;
				}).catch((errorObj: any) => {
					console.error(errorObj);
					// this.loader = false;
					this.relatedTabs[index].content = 'Data not found';
					if (IsActive) {
						this.loaderLmosTaskRelativeTab = false;
						this.relatedTabs.forEach((tab: any) => tab.active = false);
						this.relatedTabs[index].active = true;
						this.relatedTabs[index].loader = false;
						this.RelatedTabMenuButtonDisabled = false;
						this.loaderLmosTaskPopup = false;
					}
				});
			} else {
				if (IsActive) {
					this.loaderLmosTaskRelativeTab = false;
					this.relatedTabs.forEach((tab: any) => tab.active = false);
					this.relatedTabs[index].active = true;
					this.relatedTabs[index].loader = false;
					this.RelatedTabMenuButtonDisabled = false;
					this.loaderLmosTaskPopup = false;
				}
			}
		}

		// } else {
		// 	this.relatedTabs[index].content = 'Data URL not found';
		// 	if (IsActive) {
		// 		this.loaderLmosTaskRelativeTab = false;
		// 		this.relatedTabs.forEach((tab: any) => tab.active = false);
		// 		this.relatedTabs[index].active = true;
		// 		this.relatedTabs[index].loader = false;
		// 		this.RelatedTabMenuButtonDisabled = false;
		// 		this.loaderLmosTaskPopup = false;
		// 	}
		// }

	}


	private setLMOSResponse(response: any, index: number, IsActive) {
		const tab = this.relatedTabs[index];
		/* $(".wcm_background").css("height", "calc(100vh - 200px)");
		$(".wcm_background").css("min-height", "100%"); */
		let responseStr = "";
		if (tab.fieldName == 'Predictor') {
			const Data = JSON.parse(response);
			if (Data.lines.length > 0) {
				Data.lines.forEach(element => responseStr = responseStr + element.sequence + ' ' + element.text + '\n');
			}
		} else if (tab.fieldName == 'dlrl') {
			// responseStr = response;

			try {
				response = JSON.parse(response);
			} catch (e) {
				response = response;
			}
			if (response.parsed != undefined) {
				if (response.parsed.DetailLineRecord != undefined) {
					this.DisplayDLRTData = true;
					const MCN = response.parsed.DetailLineRecord.LineRecords.SvcAndEquips.find((x) => x.SvcAndEquip.USOC == 'MCN');
					this.MCNValue = MCN.SvcAndEquip.SvcNarrs[0].SvcNarr.SvcNarrText.replace('/MCN ', '');
				}
			}

			responseStr = response;

			// if (Data.data.length > 0) {
			// 	Data.data.forEach(dataElement => {
			// 		dataElement.forEach(element => responseStr = responseStr + element + '\n');
			// 	});
			// 	if (responseStr == '') {
			// 		responseStr = 'Error : ' + Data.details[0];
			// 	}
			// } else if (Data.status == "error" && Data.details.length > 0) {
			// 	responseStr = 'Error : ' + Data.details[0];
			// } else {
			// 	responseStr = 'Data not Found , Please Enrich it , Note : it takes over a min to run a FULLX Test';
			// }
			/* Object.keys(response).forEach(MainKey => {
				if (isArray(response[MainKey])) {
					response[MainKey].forEach(element => {
						if (isArray(element)) {
							element.forEach(resdata => responseStr = responseStr + resdata + '\n');
						}
					});
				} else if (isObject(response[MainKey]) && !isArray(response[MainKey])) {
					Object.keys(response[MainKey]).forEach(SubKey => {
						if (isObject(response[MainKey][SubKey]) && !isArray(response[MainKey][SubKey])) {
							Object.keys(response[MainKey][SubKey]).forEach(InnerSubKey => {
								if (isArray(response[MainKey][SubKey][InnerSubKey]) && isObject(response[MainKey][SubKey][InnerSubKey])) {
									for (let i = 0; i < response[MainKey][SubKey][InnerSubKey].length; i++) {
										Object.keys(response[MainKey][SubKey][InnerSubKey][i]).forEach(lev3 => {
											if (isArray(response[MainKey][SubKey][InnerSubKey][i][lev3]) && isObject(response[MainKey][SubKey][InnerSubKey][i][lev3])) {

											} else if (!isArray(response[MainKey][SubKey][InnerSubKey][i][lev3]) && isObject(response[MainKey][SubKey][InnerSubKey][i][lev3])) {
												Object.keys(response[MainKey][SubKey][InnerSubKey][i][lev3]).forEach(level4 => {
													if (isArray(response[MainKey][SubKey][InnerSubKey][i][lev3][level4]) && isObject(response[MainKey][SubKey][InnerSubKey][i][lev3][level4])) {

													} else if (!isArray(response[MainKey][SubKey][InnerSubKey][i][lev3][level4]) && isObject(response[MainKey][SubKey][InnerSubKey][i][lev3][level4])) {

													} else {
														responseStr = responseStr + response[MainKey][SubKey][InnerSubKey][i][lev3][level4] + '\n';
													}
												})
											} else {
												responseStr = responseStr + response[MainKey][SubKey][InnerSubKey][i][lev3] + '\n';
											}
										})
									}
								} else if (!isArray(response[MainKey][SubKey][InnerSubKey]) && isObject(response[MainKey][SubKey][InnerSubKey])) {
									Object.keys(response[MainKey][SubKey][InnerSubKey]).forEach(lev4SubKey => {
										if (isArray(response[MainKey][SubKey][InnerSubKey][lev4SubKey]) && isObject(response[MainKey][SubKey][InnerSubKey][lev4SubKey])) {
											for (let i = 0; i < response[MainKey][SubKey][InnerSubKey][lev4SubKey].length; i++) {
												Object.keys(response[MainKey][SubKey][InnerSubKey][lev4SubKey][i]).forEach(lev5 => {
													if (isArray(response[MainKey][SubKey][InnerSubKey][lev4SubKey][i][lev5]) && isObject(response[MainKey][SubKey][InnerSubKey][lev4SubKey][i][lev5])) {
														} else if (!isArray(response[MainKey][SubKey][InnerSubKey][lev4SubKey][i][lev5]) && isObject(response[MainKey][SubKey][InnerSubKey][lev4SubKey][i][lev5])) {
														Object.keys(response[MainKey][SubKey][InnerSubKey][lev4SubKey][i][lev5]).forEach(lev6 => {
															if (isArray(response[MainKey][SubKey][InnerSubKey][lev4SubKey][i][lev5][lev6]) && isObject(response[MainKey][SubKey][InnerSubKey][lev4SubKey][i][lev5][lev6])) {
																for (let j = 0; j < response[MainKey][SubKey][InnerSubKey][lev4SubKey][i][lev5][lev6].length; j++) {
																	Object.keys(response[MainKey][SubKey][InnerSubKey][lev4SubKey][i][lev5][lev6][j]).forEach(lev7 => {
																		if (isArray(response[MainKey][SubKey][InnerSubKey][lev4SubKey][i][lev5][lev6][j][lev7]) && isObject(response[MainKey][SubKey][InnerSubKey][lev4SubKey][i][lev5][lev6][j][lev7])) {

																		} else if (!isArray(response[MainKey][SubKey][InnerSubKey][lev4SubKey][i][lev5][lev6][j][lev7]) && isObject(response[MainKey][SubKey][InnerSubKey][lev4SubKey][i][lev5][lev6][j][lev7])) {
																			Object.keys(response[MainKey][SubKey][InnerSubKey][lev4SubKey][i][lev5][lev6][j][lev7]).forEach(lev8 => {
																				if (isArray(response[MainKey][SubKey][InnerSubKey][lev4SubKey][i][lev5][lev6][j][lev7][lev8]) && isObject(response[MainKey][SubKey][InnerSubKey][lev4SubKey][i][lev5][lev6][j][lev7][lev8])) {

																				} else if (!isArray(response[MainKey][SubKey][InnerSubKey][lev4SubKey][i][lev5][lev6][j][lev7][lev8]) && isObject(response[MainKey][SubKey][InnerSubKey][lev4SubKey][i][lev5][lev6][j][lev7][lev8])) {

																				} else {
																					responseStr = responseStr + response[MainKey][SubKey][InnerSubKey][lev4SubKey][i][lev5][lev6][j][lev7][lev8] + '\n';
																				}
																			});
																		} else {
																			responseStr = responseStr + response[MainKey][SubKey][InnerSubKey][lev4SubKey][i][lev5][lev6][j][lev7] + '\n';
																		}
																	});
																}
															} else if (!isArray(response[MainKey][SubKey][InnerSubKey][lev4SubKey][i][lev5][lev6]) && isObject(response[MainKey][SubKey][InnerSubKey][lev4SubKey][i][lev5][lev6])) {

															} else {
																responseStr = responseStr + response[MainKey][SubKey][InnerSubKey][lev4SubKey][i][lev5][lev6] + '\n';
															}
														});
													} else {
														responseStr = responseStr + response[MainKey][SubKey][InnerSubKey][lev4SubKey][i][lev5] + '\n';
													}
												});
											}
										} else if (!isArray(response[MainKey][SubKey][InnerSubKey][lev4SubKey]) && isObject(response[MainKey][SubKey][InnerSubKey][lev4SubKey])) {

										} else {
											responseStr = responseStr + response[MainKey][SubKey][InnerSubKey][lev4SubKey] + '\n';
										}
									})
								} else {
									responseStr = responseStr + response[MainKey][SubKey][InnerSubKey] + '\n';
								}
							});
						} else {
							responseStr = responseStr + response[MainKey][SubKey] + '\n';
						}
					});
				} else {
					responseStr = responseStr + response[MainKey] + '\n';
				}
			}); */
			// if (response.data.length > 0) {
			// 	response.data[0].forEach(element => responseStr = responseStr + element + '\n');
			// }
			// if (response.details.length > 0) {
			// 	response.details.forEach(element => responseStr = responseStr + element + '\n');
			// }
			// responseStr = responseStr + response.itime + '\n';
			// responseStr = responseStr + response.otime + '\n';
			// responseStr = responseStr + response.rowcol + '\n';
			// responseStr = responseStr + response.status + '\n';
			// response.trace.forEach(element => {
			// 	if (isArray(element)) {
			// 		element.forEach(res => responseStr = responseStr + res + '\n');
			// 	}

			// });
		} else if (tab.fieldName == 'dleth') {
			try {
				response = JSON.parse(response);
			} catch (e) {
				response = response;
			}
			const Data = response;

			if (Data.data.length > 0) {
				Data.data.forEach(dataElement => {
					dataElement.forEach(element => responseStr = responseStr + element + '\n');
				});
				if (responseStr == '') {
					responseStr = 'Error : ' + Data.details[0];
				}
			} else if (Data.status == "error" && Data.details.length > 0) {
				responseStr = 'Error : ' + Data.details[0];
			} else {
				responseStr = 'Data not Found , Please Enrich it , Note : it takes over a min to run a FULLX Test';
			}

			/* fix for nov/DEC release

			if(this.LMOSTask){
				this.DisplayDLETHData = false;
				this.DLETHResponsStatus = false;
				//start
				try {
					responseStr = JSON.parse(response);

				} catch (e) {
					responseStr = response;
				}

				if (responseStr && responseStr['parsed'] != undefined) {
					this.DisplayDLETHData = true;
					this.DLETHResponsStatus = true;
				} else {
					this.DisplayDLETHData = false;
					this.DLETHResponsStatus = false;

				}
			}
			if(this.RCMACTask){
					try {
					response = JSON.parse(response);
				} catch (e) {
					response = response;
				}
				const Data = response;

				if (Data.data.length > 0) {
					Data.data.forEach(dataElement => {
						dataElement.forEach(element => responseStr = responseStr + element + '\n');
					});
					if (responseStr == '') {
						responseStr = 'Error : ' + Data.details[0];
					}
				} else if (Data.status == "error" && Data.details.length > 0) {
					responseStr = 'Error : ' + Data.details[0];
				} else {
					responseStr = 'Data not Found , Please Enrich it , Note : it takes over a min to run a FULLX Test';
				}
			}*/
			//console.log("Dleth response string :::::::" + responseStr);



		} else if (tab.fieldName == 'mltfx') {

			try {
				response = JSON.parse(response);
			} catch (e) {
				response = response;
			}
			const Data = response;

			if (Data.data.length > 0) {
				Data.data.forEach(dataElement => {
					dataElement.forEach(element => responseStr = responseStr + element + '\n');
				});
				if (responseStr == '') {
					responseStr = 'Error : ' + Data.details[0];
				}
			} else if (Data.status == "error" && Data.details.length > 0) {
				responseStr = 'Error : ' + Data.details[0];
			} else {
				responseStr = 'Data not Found , Please Enrich it , Note : it takes over a min to run a FULLX Test';
			}
		} else if (tab.fieldName == 'dsh') {

			try {
				response = JSON.parse(response);
			} catch (e) {
				response = response;
			}
			const Data = response;

			if (Data.data.length > 0) {
				Data.data.forEach(dataElement => {
					dataElement.forEach(element => responseStr = responseStr + element + '\n');
				});
				if (responseStr == '') {
					responseStr = 'Error : ' + Data.details[0];
				}
			} else if (Data.status == "error" && Data.details.length > 0) {
				responseStr = 'Error : ' + Data.details[0];
			} else {
				responseStr = 'Data not Found , Please Enrich it , Note : it takes over a min to run a FULLX Test';
			}
		}
		else {
			console.log("ELSE", response);
			try {
				if (response.data) {
					if (response.data.length > 0) {
						response.data.forEach(dataElement => {
							dataElement.forEach(element => responseStr = responseStr + element + '\n');
						});
						//response.data[0].forEach(element => responseStr = responseStr + element + '\n');
					}
				} else {
					responseStr = 'Data not found';
				}
			} catch (e) {
				responseStr = 'Data not found';
			}
		}

		this.relatedTabs[index].content = responseStr;

		if (IsActive) {
			this.relatedTabs.forEach((tab: any) => tab.active = false);
			this.relatedTabs[index].active = true;
			// this.loaderLmosTaskRelativeTab = false;	
			this.RelatedTabMenuButtonDisabled = false;
			this.loaderLmosTaskPopup = false;
			this.relatedTabs[index].loader = false;
		}
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
	 private showForceCloseSection: boolean = false;

	transferTo = '';
	RerouteResultvalue = '';
	private lmosAction(buttonObj: any, template: TemplateRef<any>) {
		this.tabService.updateGraphService();
		this.tabService.contentComponentService.subscribe((tabs) => {
			this.tabs = tabs;
		});
		const _combine = combineLatest(
			this.modalService.onShow,
			this.modalService.onShown,
			this.modalService.onHide,
			this.modalService.onHidden
		).subscribe(() => this._ref.markForCheck());
		this.subscriptions.push(
			this.modalService.onShow.subscribe((reason: string) => {
				//   this.messages.push(`onShow event has been fired`);
			})
		);
		this.subscriptions.push(
			this.modalService.onShown.subscribe((reason: string) => {
				//   this.messages.push(`onShown event has been fired`);
			})
		);
		this.subscriptions.push(
			this.modalService.onHide.subscribe((reason: string) => {
				this.IsOpenPopup = false;
				const _reason = reason ? `, dismissed by ${reason}` : '';
				//   this.messages.push(`onHide event has been fired${_reason}`);
			})
		);
		this.subscriptions.push(
			this.modalService.onHidden.subscribe((reason: string) => {
				this.IsOpenPopup = false;
				const _reason = reason ? `, dismissed by ${reason}` : '';
				//   this.messages.push(`onHidden event has been fired${_reason}`);
				this.unsubscribe();
			})
		);

		this.subscriptions.push(_combine);

		//   this.modalRef = this.modalService.show(template);
		//   this.showCancelSection = true;
		//   return false;
		if (this.IsOpenPopup == false) {
			this.loaderLmosTaskPopup = true;
			this.showTransferSection = false;
			this.showRerouteSection = false;
			this.showCloseSection = false;
			this.showReturnTaskToWorkgroupSec = false;
			this.showForceCloseSection = false;
			this.showCancelSection = false;
			this.transferTo = "";
			this.comment = '';
			this.RerouteResultvalue = '';
			this.buttonObj = buttonObj;
			this.transferTo = '';
			this.closePopupObj.comment = '';
			this.closePopupObj.fl2 = '';
			this.closePopupObj.fl3 = '';
			this.closePopupObj.backtime = false;
			this.closePopupObj.closeOutDateTime = '';
			this.closePopupObj.timezone = '';
			this.dispositionChildCodes = [];
			this.dispositionGrandChildCodes = [];
			this.causeChildCodes = [];
			this.causeGrandChildCodes = [];
			if (buttonObj.label == 'Return Task To Workgroup') {
				this.showReturnTaskToWorkgroupSec = true;
				this.IsOpenPopup = true;
				this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
				this.loaderLmosTaskPopup = false;
				setTimeout(() => {
					$($('body .modal.fade')).each(function (key, val) {
						if ($(val).attr('data-id') == undefined) {
							$(val).attr('data-id', $('.ng-tns-c0-0 .main-tab-group .mat-tab-header .mat-tab-label-container .mat-tab-list .mat-tab-labels .mat-tab-label-active .mat-tab-label-content').text().trim());
						}
					});
					// $('body .modal.fade').attr('data-id', $('.ng-tns-c0-0 .main-tab-group .mat-tab-header .mat-tab-label-container .mat-tab-list .mat-tab-labels .mat-tab-label-active .mat-tab-label-content').text().trim());
				}, 1000);
				// $('body .modal.fade').attr('data-id', $('.ng-tns-c0-0 .main-tab-group .mat-tab-header .mat-tab-label-container .mat-tab-list .mat-tab-labels .mat-tab-label-active .mat-tab-label-content').text());
			} else if (buttonObj.label == 'Complete') {
				this.taskDetails.taskStatus = 'Complete';
				this.IsOpenPopup = true;
				this.applicationName = [this.taskDetails.sourceSystemName];
				this.saveTaskDetails();
				this.loaderLmosTaskPopup = false;
			} else if (buttonObj.label == 'Close') {
				this.showCloseSection = true;
				this.ClosePopupMinDate = new Date();
				this.IsOpenPopup = true;
				if (this.RCMACTask) {
					this.TroubleFound();
				} else {
					//this.loadDropDowns('List of Values', 'Screening Cause Codes', true);
					//this.loadDropDowns('List of Values', 'Screening Disposition Codes', true);
					//this.causeCodes = ["1**","2**","X**"];
					this.causeCodes = JSON.parse(localStorage.getItem('ScreeningCauseCodes'));
					this.dispositionCodes = JSON.parse(localStorage.getItem('ScreeningDispositionCodes'));

				}

				this.closePopupObj.customerContacted = '';
				if (this.dispositionCodes.length == 0 || this.causeCodes.length == 0) {
					setTimeout(() => {
						this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
						this.loaderLmosTaskPopup = false;
						this._ref.detectChanges();
					}, 2000);
					setTimeout(() => {
						$($('body .modal.fade')).each(function (key, val) {
							if ($(val).attr('data-id') == undefined) {
								$(val).attr('data-id', $('.ng-tns-c0-0 .main-tab-group .mat-tab-header .mat-tab-label-container .mat-tab-list .mat-tab-labels .mat-tab-label-active .mat-tab-label-content').text().trim());
							}
						});
						// $('body .modal.fade').attr('data-id', $('.ng-tns-c0-0 .main-tab-group .mat-tab-header .mat-tab-label-container .mat-tab-list .mat-tab-labels .mat-tab-label-active .mat-tab-label-content').text().trim());
					}, 3000);
				} else {
					this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
					this.loaderLmosTaskPopup = false;
					this._ref.detectChanges();
					setTimeout(() => {
						$($('body .modal.fade')).each(function (key, val) {
							if ($(val).attr('data-id') == undefined) {
								$(val).attr('data-id', $('.ng-tns-c0-0 .main-tab-group .mat-tab-header .mat-tab-label-container .mat-tab-list .mat-tab-labels .mat-tab-label-active .mat-tab-label-content').text().trim());
							}
						});
						// $('body .modal.fade').attr('data-id', $('.ng-tns-c0-0 .main-tab-group .mat-tab-header .mat-tab-label-container .mat-tab-list .mat-tab-labels .mat-tab-label-active .mat-tab-label-content').text().trim());
					}, 1000);
				}

			} else if (buttonObj.label == 'Transfer') {
				this.loadCUIDs(template);
				this.IsOpenPopup = true;
				this.showTransferSection = true;
			} else if (buttonObj.label == 'Reroute') {
				this.showRerouteSection = true;
				this.IsOpenPopup = true;
				this.loadWorkgroups(template);
				/* if (this.routWorkgroups.length == 0) {
					setTimeout(() => {
						this.modalRef = this.modalService.show(template, {backdrop: 'static', keyboard: false});
						// this.loaderTaskDetail = false;
					}, 2000);
				} else {
					this.modalRef = this.modalService.show(template, {backdrop: 'static', keyboard: false});
					// this.loaderTaskDetail = false;
				} */
			} else if (buttonObj.label == 'Cancel') {
				// this.taskDetails.taskStatus = 'cancel';
				this.showCancelSection = true;
				this.IsOpenPopup = true;
				// setTimeout(() => {
				this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
				this.loaderLmosTaskPopup = false;
				// }, 2000);
				this.applicationName = [this.taskDetails.sourceSystemName];
				setTimeout(() => {
					$($('body .modal.fade')).each(function (key, val) {
						if ($(val).attr('data-id') == undefined) {
							$(val).attr('data-id', $('.ng-tns-c0-0 .main-tab-group .mat-tab-header .mat-tab-label-container .mat-tab-list .mat-tab-labels .mat-tab-label-active .mat-tab-label-content').text().trim());
						}
					});
					// $('body .modal.fade').attr('data-id', $('.ng-tns-c0-0 .main-tab-group .mat-tab-header .mat-tab-label-container .mat-tab-list .mat-tab-labels .mat-tab-label-active .mat-tab-label-content').text().trim());
				}, 1000);
				// this.submitDataToLMOS();
				// this.saveTaskDetails();
			} else if (buttonObj.label == 'Force Close') {
				//this.loader = true;
				this.showForceCloseSection = true;
				this.IsOpenPopup = true;
				this.showLmosRecoredSection = true;
				//this.isForceClose = false;

				this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
				this.loaderLmosTaskPopup = false;
				this.applicationName = [this.taskDetails.sourceSystemName];


				// let BodyRequest = {
				// 	"httpMethod": "PUT",
				// 	"action": "ForceClose",
				// 	"assignCuid": "",
				// 	"taskInstanceId": this.taskDetails.sourceTaskId
				// }
				// console.log('body request ' + JSON.stringify(BodyRequest));
				// this.taskService.AllowAction(BodyRequest, this.taskDetails.id).toPromise().then((response: any) => {


				// 	this.loader = false;
				// 	this.loaderTaskDetail = false;
				// 	this.getTaskDetails(true, false);
				// 	const appName = this.taskDetails.application ? this.taskDetails.application.applicationName : '';
				// 	this.taskService.getAuditResults(this.taskDetails.appTaskInstanceId, appName).toPromise().then((response: any) => {
				// 		this.loader = false;
				// 		this.tempAuditResults = response;
				// 		this.auditResults = this.tempAuditResults;
				// 	}).catch((error: any) => {
				// 		this.loader = false;
				// 		console.log("Error while reading Audit Results");
				// 	})
				// 	this.showViewPage = true;
				// 	this.IsSucess = true;
				// 	this.message = response.message;
				// 	setTimeout(() => {
				// 		this.IsSucess = false;
				// 	}, 7000);

				// 	// 	this.loader = false;
				// 	// 	this.getTaskDetails(true, true);
				// 	// 	this.loaderTaskDetail = false;
				// 	// 	this.loaderLmosTaskPopup = false;
				// 	// 	this.showViewPage = true;
				// 	// 	this.IsSucess = true;
				// 	// 	this.message = response.message;
				// 	// 	setTimeout(() => {
				// 	// 		this.IsSucess = false;
				// 	// 	}, 7000);
				// 	// }).catch((error: any) => {
				// 	// 	this.loader = false;
				// 	// 	this.loaderTaskDetail = false;
				// 	// 	console.error(error);
				// 	// 	this.IsError = true;
				// 	// 	this.message = error.error.message;
				// 	// 	setTimeout(() => {
				// 	// 		this.IsError = false;
				// 	// 	}, 7000);
				// });
			}
		}

	}

	private submitDataToLMOSTD() {
		// this.loaderTaskDetail = true;
		// return false;
		// const UnMappedFieldsData = this.taskDetails['taskSectionModels'].find((x) => x.header == 'Other Details');
		//const URLData = UnMappedFieldsData['paramList'].find((x) => x.name == 'URL');
		//const region = UnMappedFieldsData['paramList'].find((x) => x.name == 'Region');
		let URL = '';
		// if (URLData) {
		// 	URL = URLData.value;
		// }

		// return false;
		this.loaderLmosTaskPopup = true;
		this.IsOpenPopup = false;
		var userInfo = {} = JSON.parse(localStorage.getItem('fd_user'));
		let ec_reqData = {
			"type": "",
			"header": "",
			"name": "EC",
			"value": "",
			"jsonDescriptor": "",
			"paramFieldLayout": {},
			"pageLayoutFieldId": "",
			"pageLayoutlabel": ""
		};
		if (userInfo.params && userInfo.params.length > 0) {
			userInfo.params.forEach(element => {
				if (element.name == "EC") {
					ec_reqData.value = element.value;
					this.wcmRequestData.EC = element.value;
				}
			});
		}
		let Disposition_Code_req = {
			"type": "",
			"header": "",
			"name": "Disposition Code",
			"value": "",
			"jsonDescriptor": "",
			"paramFieldLayout": {},
			"pageLayoutFieldId": "",
			"pageLayoutlabel": ""
		}
		if (this.closePopupObj.grandChildDispositionCode) {
			Disposition_Code_req.value = this.closePopupObj.grandChildDispositionCode;
		}
		let Cause_Code_req = {
			"type": "",
			"header": "",
			"name": "Cause Code",
			"value": "",
			"jsonDescriptor": "",
			"paramFieldLayout": {},
			"pageLayoutFieldId": "",
			"pageLayoutlabel": ""
		}
		if (this.closePopupObj.grandChildCauseCode) {
			Cause_Code_req.value = this.closePopupObj.grandChildCauseCode;
		}
		let Customer_Contacted_req = {
			"type": "",
			"header": "",
			"name": "Customer Contacted",
			"value": "",
			"jsonDescriptor": "",
			"paramFieldLayout": {},
			"pageLayoutFieldId": "",
			"pageLayoutlabel": ""
		}
		if (this.closePopupObj.customerContacted) {
			Customer_Contacted_req.value = this.closePopupObj.customerContacted;
		}
		let FL2_req = {
			"type": "",
			"header": "",
			"name": "FL2",
			"value": "",
			"jsonDescriptor": "",
			"paramFieldLayout": {},
			"pageLayoutFieldId": "",
			"pageLayoutlabel": ""
		}
		if (this.closePopupObj.fl2) {
			FL2_req.value = this.closePopupObj.fl2;
		}
		let FL3_req = {
			"type": "",
			"header": "",
			"name": "FL3",
			"value": "",
			"jsonDescriptor": "",
			"paramFieldLayout": {},
			"pageLayoutFieldId": "",
			"pageLayoutlabel": ""
		}
		if (this.closePopupObj.fl3) {
			FL3_req.value = this.closePopupObj.fl3;
		}
		let Trouble_Found_req = {
			"type": "",
			"header": "",
			"name": "Trouble Found",
			"value": "",
			"jsonDescriptor": "",
			"paramFieldLayout": {},
			"pageLayoutFieldId": "",
			"pageLayoutlabel": ""
		}
		if (this.closePopupObj.TroubleFound) {
			Trouble_Found_req.value = this.closePopupObj.TroubleFound
		}
		let Closeout_date_time_req = {
			"type": "",
			"header": "",
			"name": "CloseOut Date/Time",
			"value": "",
			"jsonDescriptor": "",
			"paramFieldLayout": {},
			"pageLayoutFieldId": "",
			"pageLayoutlabel": ""
		}
		if (this.closePopupObj.closeOutDateTime) {
			//Closeout_date_time_req.value = this.closePopupObj.closeOutDateTime;
			Closeout_date_time_req.value = this.datePipe.transform(this.closePopupObj.closeOutDateTime, 'MM-dd-yy, HH:mm:ss');
		}
		let Time_zone_req = {
			"type": "",
			"header": "",
			"name": "Time zone",
			"value": "",
			"jsonDescriptor": "",
			"paramFieldLayout": {},
			"pageLayoutFieldId": "",
			"pageLayoutlabel": ""
		}
		if (this.closePopupObj.timezone) {
			Time_zone_req.value = this.closePopupObj.timezone
		}
		var BodyRequest = {
			"httpMethod": "",
			"action": "",
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
				},
				ec_reqData
			],
			"taskId": "",
			"parentTaskInstanceId": "",
			"request": "",
			"url": ""
		};
		if (this.showReturnTaskToWorkgroupSec) {
			this.showReturnTaskToWorkgroupSec = false;
			this.modalService.hide(1);
			// this.loaderTaskDetail = true;
			const user = JSON.parse(localStorage.getItem('fd_user'));
			// let url = this.buttonObj.service;
			var TTN = (this.wcmRequestData.TTN) ? this.wcmRequestData.TTN : '';
			var MC = (this.wcmRequestData.MC) ? this.wcmRequestData.MC : '';
			var TN = (this.wcmRequestData.TN) ? this.wcmRequestData.TN : '';
			var EC = (this.wcmRequestData.EC) ? this.wcmRequestData.EC : '';
			//let url = URL + "/v1/MSCR/TTN/UPDATE?TTN=" + TTN + "&MC=" + MC + "&TN=" + TN + "&EC=" + EC + "&NARR=RETURNED TO WM";
			// if(url){
			// 	url = url.replace('placeMC', this.wcmRequestData.MC);
			// 	url = url.replace('placeTTN', this.wcmRequestData.TTN);
			// 	url = url.replace('placeCUID', user.cuid);
			// }
			// url = url+' '+this.comment;
			// const request = {url: url, httpMethod: 'PUT', 'request': ''};
			// this.taskService.invokeLMOSAPI(request).toPromise().then((response: any)=>{
			// let lmosResponse: any = {};
			// this.loaderTaskDetail = false;
			// lmosResponse = JSON.parse(response.message);
			// this.taskDetails.taskStatus = 'Ready';
			// this.taskDetails.assignedCuid = null;
			// if (this.taskDetails['taskSectionModels']) {
			// 	for (let i = 0; i < this.taskDetails['taskSectionModels'].length; i++) {
			// 		if (this.taskDetails['taskSectionModels'][i]['paramList']) {
			// 			for (let j = 0; j < this.taskDetails['taskSectionModels'][i]['paramList'].length; j++) {
			// 				var paramData = this.taskDetails['taskSectionModels'][i]['paramList'][j];
			// 				if (paramData.name == 'EC') {
			// 					this.taskDetails['taskSectionModels'][i]['paramList'][j]['value'] = null;
			// 				}
			// 			}
			// 		}
			// 	}
			// }
			BodyRequest.httpMethod = 'PUT';
			//BodyRequest.url = url;
			BodyRequest.action = 'Release';
			BodyRequest.comments = this.comment;
			BodyRequest.taskInstanceId = this.taskDetails.sourceTaskId;
			BodyRequest.paramRequests[0].value = this.comment;
			this.taskService.AllowAction(BodyRequest, this.taskDetails.id).toPromise().then((response: any) => {
				this.loader = false;
				this.loaderTaskDetail = false;
				this.loaderLmosTaskPopup = false;
				this.getTaskDetails(true, false);
				// const appName = this.taskDetails.application ? this.taskDetails.application.applicationName : '';
				// this.taskService.getAuditResults(this.taskDetails.appTaskInstanceId, appName).toPromise().then((response: any) => {
				// 	this.tempAuditResults = response;
				// 	this.auditResults = this.tempAuditResults;
				// }).catch((error: any) => {
				// })
				this.showViewPage = true;
				this.IsSucess = true;
				this.message = response.message;
				setTimeout(() => {
					this.IsSucess = false;
				}, 7000);
			}).catch((error: any) => {
				this.loader = false;
				this.loaderTaskDetail = false;
				this.IsError = true;
				this.message = error.error.message;
				setTimeout(() => {
					this.IsError = false;
				}, 7000);
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
			// }).catch((errorObj: any) => {
			// 	this.loaderTaskDetail = false;
			// });
		} else if (this.showRerouteSection) {
			this.showRerouteSection = false;
			this.modalService.hide(1);
			this.loaderTaskDetail = true;
			const user = JSON.parse(localStorage.getItem('fd_user'));
			var TTN = (this.wcmRequestData.TTN) ? this.wcmRequestData.TTN : '';
			var MC = (this.wcmRequestData.MC) ? this.wcmRequestData.MC : '';
			var TN = (this.wcmRequestData.TN) ? this.wcmRequestData.TN : '';
			var EC = (this.wcmRequestData.EC) ? this.wcmRequestData.EC : '';
			const SelectWorkgroupData = this.GetAllReRouteWorkGroupsRes.find((x) => x.description == this.transferTo);

			const ServiceResult = (this.RerouteResultvalue == 'Affecting Service') ? 900 : 100;

			BodyRequest.httpMethod = 'PUT';
			// BodyRequest.url = url;
			BodyRequest.action = 'Complete';
			BodyRequest.comments = this.comment;
			BodyRequest.taskInstanceId = this.taskDetails.sourceTaskId;
			BodyRequest.workgroupList[0].workgroupName = this.transferTo;
			//BodyRequest.paramRequests = [ec_reqData]
			BodyRequest.paramRequests[0].value = this.RerouteResultvalue;
			BodyRequest.paramRequests[0].name = 'Result';
			this.taskService.AllowAction(BodyRequest, this.taskDetails.id).toPromise().then((response: any) => {
				this.loader = false;
				this.loaderTaskDetail = false;
				this.loaderLmosTaskPopup = false;
				this.getTaskDetails(true, true);
				this.showViewPage = true;
				this.IsSucess = true;
				this.message = response.message;
				setTimeout(() => {
					this.IsSucess = false;
				}, 7000);
			}).catch((error: any) => {
				this.loader = false;
				this.loaderTaskDetail = false;
				this.IsError = true;
				this.message = error.error.message;
				setTimeout(() => {
					this.IsError = false;
				}, 7000);
			});

			// return false;
			// if(lmosResponse.status == 'ok'){
			// 	this.taskDetails.taskStatus = 'Ready';
			// 	this.applicationName = [this.taskDetails.sourceSystemName];
			// }
			// }).catch((errorObj: any) => {
			// 	this.loaderTaskDetail = false;
			// });
		} else if (this.showCloseSection) {
			this.showCloseSection = false;
			this.modalService.hide(1);
			// this.loaderTaskDetail = true;
			const user = JSON.parse(localStorage.getItem('fd_user'));
			var TTN = (this.wcmRequestData.TTN) ? this.wcmRequestData.TTN : '';
			var MC = (this.wcmRequestData.MC) ? this.wcmRequestData.MC : '';
			var TN = (this.wcmRequestData.TN) ? this.wcmRequestData.TN : '';
			var EC = (this.wcmRequestData.EC) ? this.wcmRequestData.EC : '';
			var FL1 = (this.wcmRequestData.FL1) ? this.wcmRequestData.FL1 : '';
			var FL3 = this.closePopupObj.fl3;
			var IST = (this.closePopupObj.customerContacted == 'Yes') ? '091' : '092';
			var DATE = this.datePipe.transform(this.closePopupObj.closeOutDateTime, 'MM-dd-yy');
			var TIME = this.datePipe.transform(this.closePopupObj.closeOutDateTime, 'HH:mm:ss');

			// let url = URL + "/v1/MSCR/TTN/UPDATE?MC=" + MC + "&EC=" + EC + "&TTN=" + TTN + "&TN=" + TN + "&WP=5&IST=" + IST + "&RTE=" + EC + "&DATE=" + DATE + "&TIME=" + TIME + "&FL2=" + this.closePopupObj.fl2 + "&FL3=" + FL3 + "&NARR=" + this.closePopupObj.comment + "";
			//uncomment this one not above one	//let url = URL + "/v1/MSCR/TTN/UPDATE?MC=" + MC + "&EC=" + EC + "&TTN=" + TTN + "&WP=5&IST=" + IST + "&RTE=" + EC + "&FL2=" + encodeURI(this.closePopupObj.fl2) + "&FL3=" + encodeURI(FL3) + "";

			/* const request = { url: url, httpMethod: 'PUT' };
			this.taskService.invokeLMOSAPI(request).toPromise().then((response: any) => {
			}).catch((errorObj: any) => {
				// this.loaderTaskDetail = false;
			}); */

			if (this.RCMACTask) {
				const TFData = this.TroubleFoundArr.find((x) => x.description == this.closePopupObj.TroubleFound);
				this.taskService.GetTroubleFoundInCD(TFData.id).toPromise().then((res: any) => {
					var TTN = (this.wcmRequestData.TTN) ? this.wcmRequestData.TTN : '';
					var MC = (this.wcmRequestData.MC) ? this.wcmRequestData.MC : '';
					var TN = (this.wcmRequestData.TN) ? this.wcmRequestData.TN : '';
					var EC = (this.wcmRequestData.EC) ? this.wcmRequestData.EC : '';
					var DB = (this.wcmRequestData.DB) ? this.wcmRequestData.DB : '';
					var T = (this.wcmRequestData.T) ? this.wcmRequestData.T : '';
					var C = res.systemParameterItem[0].systemParameterItem.find((x) => x.description == 'CAUSE_CODES');
					var D = res.systemParameterItem[0].systemParameterItem.find((x) => x.description == 'DISPOSITION_CODES');
					var FL1 = (this.wcmRequestData.FL1) ? this.wcmRequestData.FL1 : '';
					var FL3 = this.closePopupObj.fl3;
					var X = (this.wcmRequestData.X) ? this.wcmRequestData.X : '';
					var TRACE = (this.wcmRequestData.TRACE) ? this.wcmRequestData.TRACE : '';
					//let url = URL + "/v1/MSCR/TTN/CLOSE?DB=" + DB + "&MC=" + MC + "&EC=" + EC + "&TTN=" + TTN + "&T=" + T + "&D=" + D.value + "&C=" + C.value + "&FL1=" + encodeURI(FL1) + "&FL2=" + encodeURI(this.closePopupObj.fl2) + "&FL3=" + encodeURI(FL3) + "&X=" + X + "&NARR=" + encodeURI(this.closePopupObj.comment) + "&trace=" + TRACE + "";

					BodyRequest.httpMethod = 'PUT';
					//BodyRequest.url = url;
					BodyRequest.action = 'Complete';
					BodyRequest.comments = this.closePopupObj.comment;
					BodyRequest.taskInstanceId = this.taskDetails.sourceTaskId;
					/* BodyRequest.paramRequests[0].name = 'Complte_Complete';
					BodyRequest.paramRequests[0].value = this.closePopupObj.comment; */
					BodyRequest.sourceSystem = this.taskDetails.sourceSystemName;
					BodyRequest.workgroupList = null;
					BodyRequest.paramRequests = [
						ec_reqData,
						Trouble_Found_req,
						Customer_Contacted_req,
						FL2_req,
						FL3_req,
						Closeout_date_time_req,
						Time_zone_req
					];

					this.taskService.AllowAction(BodyRequest, this.taskDetails.id).toPromise().then((response: any) => {
						this.loader = false;
						this.loaderTaskDetail = false;
						this.loaderLmosTaskPopup = false;
						this.getTaskDetails(true, true);
						this.showViewPage = true;
						this.IsSucess = true;
						this.message = response.message;
						setTimeout(() => {
							this.IsSucess = false;
						}, 7000);
					}).catch((error: any) => {
						this.loader = false;
						this.loaderTaskDetail = false;
						this.IsError = true;
						this.message = error.error.message;
						setTimeout(() => {
							this.IsError = false;
						}, 7000);
					});
				});
			} else {
				var TTN = (this.wcmRequestData.TTN) ? this.wcmRequestData.TTN : '';
				var MC = (this.wcmRequestData.MC) ? this.wcmRequestData.MC : '';
				var TN = (this.wcmRequestData.TN) ? this.wcmRequestData.TN : '';
				var EC = (this.wcmRequestData.EC) ? this.wcmRequestData.EC : '';
				var DB = (this.wcmRequestData.DB) ? this.wcmRequestData.DB : '';
				var T = (this.wcmRequestData.T) ? this.wcmRequestData.T : '';
				//var C = this.closePopupObj.grandChildCauseCode.split('-')[0].trim();
				//var D = this.closePopupObj.grandChildDispositionCode.split('-')[0].trim();
				var C = this.closePopupObj.grandChildCauseCode;
				var D = this.closePopupObj.grandChildDispositionCode;
				var FL1 = (this.wcmRequestData.FL1) ? this.wcmRequestData.FL1 : '';
				var FL3 = this.closePopupObj.fl3;
				var X = (this.wcmRequestData.X) ? this.wcmRequestData.X : '';
				var TRACE = (this.wcmRequestData.TRACE) ? this.wcmRequestData.TRACE : '';
				//let url = URL + "/v1/MSCR/TTN/CLOSE?DB=" + DB + "&MC=" + MC + "&EC=" + EC + "&TTN=" + TTN + "&T=" + T + "&D=" + D + "&C=" + C + "&FL1=" + encodeURI(FL1) + "&FL2=" + encodeURI(this.closePopupObj.fl2) + "&FL3=" + encodeURI(FL3) + "&X=" + X + "&NARR=" + encodeURI(this.closePopupObj.comment) + "&trace=" + TRACE + "";
				// return false;
				// const request = {url: url, httpMethod: 'PUT', request: ''};
				// this.taskService.invokeLMOSAPI(request).toPromise().then((response: any)=>{
				// let lmosResponse: any = {};
				// this.loaderTaskDetail = false;
				// lmosResponse = JSON.parse(response.message);
				// this.taskDetails.notes = this.closePopupObj.comment;
				// this.taskDetails.taskStatus = 'Close';
				// this.taskDetails.workgroupList.push({'workgroupName': this.transferTo});
				BodyRequest.httpMethod = 'PUT';
				//BodyRequest.url = url;
				BodyRequest.action = 'Complete';
				BodyRequest.comments = this.closePopupObj.comment;
				BodyRequest.taskInstanceId = this.taskDetails.sourceTaskId;
				/* BodyRequest.paramRequests[0].name = 'Complte_Complete';
				BodyRequest.paramRequests[0].value = this.closePopupObj.comment; */
				BodyRequest.sourceSystem = this.taskDetails.sourceSystemName;
				BodyRequest.workgroupList = null;
				BodyRequest.paramRequests = [
					ec_reqData,
					Disposition_Code_req,
					Cause_Code_req,
					Customer_Contacted_req,
					FL2_req,
					FL3_req,
					Closeout_date_time_req,
					Time_zone_req
				];

				this.taskService.AllowAction(BodyRequest, this.taskDetails.id).toPromise().then((response: any) => {
					this.loader = false;
					this.loaderTaskDetail = false;
					this.loaderLmosTaskPopup = false;
					this.getTaskDetails(true, true);
					this.showViewPage = true;
					this.IsSucess = true;
					this.message = response.message;
					setTimeout(() => {
						this.IsSucess = false;
					}, 7000);
				}).catch((error: any) => {
					this.loader = false;
					this.loaderTaskDetail = false;
					this.IsError = true;
					this.message = error.error.message;
					setTimeout(() => {
						this.IsError = false;
					}, 7000);
				});
			}
			// }).catch((errorObj: any) => {
			// 	this.loaderTaskDetail = false;
			// });
		} else if (this.showTransferSection) {
			this.showTransferSection = false;
			this.modalService.hide(1);
			// this.loaderTaskDetail = true;
			const user = JSON.parse(localStorage.getItem('fd_user'));
			// let url = this.buttonObj.service;
			var TTN = (this.wcmRequestData.TTN) ? this.wcmRequestData.TTN : '';
			var MC = (this.wcmRequestData.MC) ? this.wcmRequestData.MC : '';
			var TN = (this.wcmRequestData.TN) ? this.wcmRequestData.TN : '';
			var EC = (this.wcmRequestData.EC) ? this.wcmRequestData.EC : '';
			//	let url = URL + "/v1/MSCR/TTN/UPDATE?TTN=" + TTN + "&MC=" + MC + "&TN=" + TN + "&EC=" + EC + "&NARR=" + this.comment + "";
			// const request = {url: url, httpMethod: 'PUT', 'request': ''};
			// this.taskService.invokeLMOSAPI(request).toPromise().then((response: any)=>{
			// let lmosResponse: any = {};
			// this.loaderTaskDetail = false;
			// lmosResponse = JSON.parse(response.message);
			// this.taskDetails.taskStatus = 'Assigned'; // transfer task status
			// this.taskDetails.assignedCuid = this.transferTo;
			// return false;
			BodyRequest.httpMethod = 'PUT';
			//	BodyRequest.url = url;
			BodyRequest.action = 'Assign';
			BodyRequest.comments = this.comment;
			BodyRequest.taskInstanceId = this.taskDetails.sourceTaskId;
			BodyRequest.assignCuid = this.transferTo.split(' - ')[1];
			BodyRequest.paramRequests[0].name = 'Transfer_comment';
			BodyRequest.paramRequests[0].value = this.comment;
			this.taskService.AllowAction(BodyRequest, this.taskDetails.id).toPromise().then((response: any) => {
				this.loader = false;
				this.loaderTaskDetail = false;
				this.loaderLmosTaskPopup = false;
				this.getTaskDetails(true, false);
				// const appName = this.taskDetails.application ? this.taskDetails.application.applicationName : '';
				// this.taskService.getAuditResults(this.taskDetails.appTaskInstanceId, appName).toPromise().then((response: any) => {
				// 	this.tempAuditResults = response;
				// 	this.auditResults = this.tempAuditResults;
				// }).catch((error: any) => {
				// })
				this.showViewPage = true;
				this.IsSucess = true;
				this.message = response.message;
				setTimeout(() => {
					this.IsSucess = false;
				}, 7000);
			}).catch((error: any) => {
				this.loader = false;
				this.loaderTaskDetail = false;
				this.IsError = true;
				this.message = error.error.message;
				setTimeout(() => {
					this.IsError = false;
				}, 7000);
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
			// }).catch((errorObj: any) => {
			// 	this.loader = false;
			// 	this.loaderTaskDetail = false;
			// });
		} else if (this.showCancelSection) {
			this.showCancelSection = false;
			this.modalService.hide(1);
			var TTN = (this.wcmRequestData.TTN) ? this.wcmRequestData.TTN : '';
			var MC = (this.wcmRequestData.MC) ? this.wcmRequestData.MC : '';
			var TN = (this.wcmRequestData.TN) ? this.wcmRequestData.TN : '';
			var EC = (this.wcmRequestData.EC) ? this.wcmRequestData.EC : '';
			//	let url = URL + "/v1/MSCR/TTN/UPDATE?TTN=" + TTN + "&MC=" + MC + "&TN=" + TN + "&EC=" + EC + "&NARR=''";
			// const request = {url: url, httpMethod: 'PUT', 'request': ''};
			// this.taskService.invokeLMOSAPI(request).toPromise().then((response: any)=>{
			// let lmosResponse: any = {};
			// this.loaderTaskDetail = false;
			// lmosResponse = JSON.parse(response.message);
			// this.taskDetails.taskStatus = 'Cancelled';
			// this.taskDetails.assignedCuid = null;
			BodyRequest.httpMethod = 'PUT';
			//	BodyRequest.url = url;
			BodyRequest.action = 'Cancelled';
			BodyRequest.comments = this.comment;
			BodyRequest.taskInstanceId = this.taskDetails.sourceTaskId;
			BodyRequest.paramRequests[0].name = 'cancel_reason';
			BodyRequest.paramRequests[0].value = this.comment;
			this.taskService.AllowAction(BodyRequest, this.taskDetails.id).toPromise().then((response: any) => {
				this.loader = false;
				this.loaderTaskDetail = false;
				this.loaderLmosTaskPopup = false;
				this.getTaskDetails(true, false);
				this.showViewPage = true;
				this.IsSucess = true;
				this.message = response.message;
				setTimeout(() => {
					this.IsSucess = false;
				}, 7000);
			}).catch((error: any) => {
				this.loader = false;
				this.loaderTaskDetail = false;
				this.IsError = true;
				this.message = error.error.message;
				setTimeout(() => {
					this.IsError = false;
				}, 7000);
			});
			// }).catch((errorObj: any) => {
			// 	this.loaderTaskDetail = false;
			// });
		} else if (this.showLmosRecoredSection) {
			this.showLmosRecoredSection = false;
			this.modalService.hide(1);
			// var TTN = (this.wcmRequestData.TTN) ? this.wcmRequestData.TTN : '';
			// var MC = (this.wcmRequestData.MC) ? this.wcmRequestData.MC : '';
			// var TN = (this.wcmRequestData.TN) ? this.wcmRequestData.TN : '';
			// var EC = (this.wcmRequestData.EC) ? this.wcmRequestData.EC : '';
			// let url = "http://vlodts012.test.intranet:3000/v1/MSCR/TTN/UPDATE?TTN="+ TTN +"&MC="+ MC +"&TN="+ TN +"&EC="+ EC +"&NARR=''";
			// const request = {url: url, httpMethod: 'PUT', 'request': ''};
			// this.taskService.invokeLMOSAPI(request).toPromise().then((response: any)=>{
			let lmosResponse: any = {};
			// this.loaderTaskDetail = false;
			// lmosResponse = JSON.parse(response.message);
			this.taskDetails.taskStatus = 'Assigned';
			var UserDetails = JSON.parse(localStorage.getItem('defaultValue'));
			// this.taskDetails.assignCuid = UserDetails.personalInfo.cuid;
			this.taskDetails.assignedCuid = null;
			// this.loader = true;
			let ForceBodyRequest = {
				"action": "ForceClose",
				"modifiedById": UserDetails.personalInfo.cuid,
				"comments": this.comment
			};
			this.taskService.ForceCloseTaskDetails(ForceBodyRequest, this.taskDetails.id).toPromise().then((response: any) => {
				this.loader = false;
				this.loaderTaskDetail = false;
				this.loaderLmosTaskPopup = false;
				this.getTaskDetails(true, false);
				this.showViewPage = true;
				this.IsSucess = true;
				this.message = response.message;
				setTimeout(() => {
					this.IsSucess = false;
				}, 7000);
			}).catch((error: any) => {
				this.loader = false;
				this.loaderTaskDetail = false;
				this.IsError = true;
				this.message = error.error.message;
				setTimeout(() => {
					this.IsError = false;
				}, 7000);
			});
			// }).catch((errorObj: any) => {
			// 	this.loaderTaskDetail = false;
			// });
		} else if (this.showForceCloseSection) {
			//this.showForceCloseSection = false;
			this.modalService.hide(1);
			// var TTN = (this.wcmRequestData.TTN) ? this.wcmRequestData.TTN : '';
			// var MC = (this.wcmRequestData.MC) ? this.wcmRequestData.MC : '';
			// var TN = (this.wcmRequestData.TN) ? this.wcmRequestData.TN : '';
			// var EC = (this.wcmRequestData.EC) ? this.wcmRequestData.EC : '';
			// let url = "http://vlodts012.test.intranet:3000/v1/MSCR/TTN/UPDATE?TTN="+ TTN +"&MC="+ MC +"&TN="+ TN +"&EC="+ EC +"&NARR=''";
			// const request = {url: url, httpMethod: 'PUT', 'request': ''};
			// this.taskService.invokeLMOSAPI(request).toPromise().then((response: any)=>{
			//let lmosResponse: any = {};
			// this.loaderTaskDetail = false;
			// lmosResponse = JSON.parse(response.message);
			//this.taskDetails.taskStatus = 'Complete';
			var UserDetails = JSON.parse(localStorage.getItem('defaultValue'));
			// this.taskDetails.assignCuid = UserDetails.personalInfo.cuid;
			this.taskDetails.assignedCuid = null;
			let BodyRequest = {
				"httpMethod": "PUT",
				"action": "ForceClose",
				"assignCuid": "",
				"taskInstanceId": this.taskDetails.sourceTaskId,
				"comments": this.comment
			}
			console.log('body request ' + JSON.stringify(BodyRequest));
			this.taskService.AllowAction(BodyRequest, this.taskDetails.id).toPromise().then((response: any) => {
				this.loader = false;
				this.isForceClose = false;
				this.loaderLmosTaskPopup = false;
				this.loaderTaskDetail = false;
				this.getTaskDetails(true, false);
				const appName = this.taskDetails.application ? this.taskDetails.application.applicationName : '';
				this.taskService.getAuditResults(this.taskDetails.appTaskInstanceId, appName).toPromise().then((response: any) => {
					this.loader = false;
					this.loaderLmosTaskPopup = false;
					this.loaderTaskDetail = false;
					this.tempAuditResults = response;
					this.auditResults = this.tempAuditResults;
				}).catch((error: any) => {
					this.loader = false;
					this.loaderLmosTaskPopup = false;
					this.loaderTaskDetail = false;
					console.log("Error while reading Audit Results");
				})
				this.showViewPage = true;
				this.IsSucess = true;
				this.message = response.message;
				setTimeout(() => {
					this.IsSucess = false;
				}, 7000);

				// 	this.loader = false;
				// 	this.getTaskDetails(true, true);
				// 	this.loaderTaskDetail = false;
				// 	this.loaderLmosTaskPopup = false;
				// 	this.showViewPage = true;
				// 	this.IsSucess = true;
				// 	this.message = response.message;
				// 	setTimeout(() => {
				// 		this.IsSucess = false;
				// 	}, 7000);
				// }).catch((error: any) => {
				// 	this.loader = false;
				// 	this.loaderTaskDetail = false;
				// 	console.error(error);
				// 	this.IsError = true;
				// 	this.message = error.error.message;
				// 	setTimeout(() => {
				// 		this.IsError = false;
				// 	}, 7000);
			}).catch((error: any) => {
				this.loader = false;
				this.loaderLmosTaskPopup = false;
				this.loaderTaskDetail = false;
				console.log("Error while closing the task using forceClose");
				this.IsError = true;
				this.message = error.error.message;
				setTimeout(() => {
					this.IsError = false;
				}, 7000);
			});
		}
	}

	unsubscribe() {
		this.subscriptions.forEach((subscription: Subscription) => {
			subscription.unsubscribe();
		});
		this.subscriptions = [];
	}

	CloseLmosButtonPopup() {
		// this.showCancelSection = false;
		this.modalService.hide(1);
		setTimeout(() => {
			this.showCancelSection = false;
		}, 500);

		this.IsOpenPopup = false;
	}
	/**
	 * This method loads the Disposition codes and Cause codes from system parameter.
	 */
	private TroubleFoundArr = [];
	private TroubleFoundData = [];
	

	TroubleFound() {
		this.taskService.TroubleFound().toPromise().then((response: any) => {
			this.loader = false;
			if (response.systemParameterModels.length > 0) {
				this.TroubleFoundArr = response.systemParameterModels[0].systemParameterItem;
				this.TroubleFoundData = [];
				this.TroubleFoundArr.forEach((codeObj: any) => {
					this.TroubleFoundData.push(codeObj.description);
				})
			} else {
				this.TroubleFoundData = [];
			}
		}).catch((errorObj: any) => {
			this.loader = false;
			this.IsOpenPopup = false;
		});
	}

	private causeCodeChanged(fieldType: string) {
		this.ClosePopupLoader = true;
		setTimeout(async (fieldType: string) => {
			if (fieldType === PARENT) {

				await this.userProfileService.getListofValueDataParams('Screening Cause Codes',this.closePopupObj.parentCauseCode,"").toPromise().then((response: any) => {

					this.causeChildCodes = response;
					
					this.ClosePopupLoader = false;
					this._ref.detectChanges();
				}).catch(err =>{
					this.ClosePopupLoader = false;
					//this.causeChildCodes = ["1*", "2*","3*"]
				});


			} else if (fieldType === CHILD) {

				await this.userProfileService.getListofValueDataParams('Screening Cause Codes',this.closePopupObj.parentCauseCode,this.closePopupObj.childCauseCode).toPromise().then((response: any) => {
					
					this.causeGrandChildCodes = response;
					
					this.ClosePopupLoader = false;
					this._ref.detectChanges();
				}).catch(err=>{
					this.ClosePopupLoader = false;
					//this.causeGrandChildCodes = ["11", "22","33"];
				})
			}
		}, 100, fieldType);
	}

	private dispositionCodeChanged(fieldType: string) {
		this.ClosePopupLoader = true;
		setTimeout(async (fieldType: string) => {
			if (fieldType === PARENT) {

				await this.userProfileService.getListofValueDataParams('Screening Disposition Codes',this.closePopupObj.parentDispositionCode,"").toPromise().then((response: any) => {
					
					this.dispositionChildCodes = response;

					this.ClosePopupLoader = false;
					this._ref.detectChanges();
				}).catch(err =>{
					this.ClosePopupLoader = false;
				});

			} else if (fieldType === CHILD) {


				await this.userProfileService.getListofValueDataParams('Screening Disposition Codes',this.closePopupObj.parentDispositionCode,this.closePopupObj.childDispositionCode).toPromise().then((response: any) => {
					this.dispositionGrandChildCodes = response;

					this.ClosePopupLoader = false;
					this._ref.detectChanges();
				}).catch(err=>{
					this.ClosePopupLoader = false;
				})

			}
		}, 100, fieldType);
	}

	async loadCUIDs(template) {
		this.cuidList = [];
		let userInfo = JSON.parse(localStorage.getItem('fd_user'));
		let resultArr = [];
		if (this.taskDetails['workgroupList'].length > 0) {
			for (let WordgroupIndex = 0; WordgroupIndex < this.taskDetails['workgroupList'].length; WordgroupIndex++) {
				await this.taskService.GetTransferWorkGroupId(this.taskDetails['workgroupList'][WordgroupIndex]['workgroupId']).toPromise().then(async (response: any) => {
					if (response && response.length > 0) {
						response.forEach((resource: any) => {
							if (!this.cuidList.find((x) => x == resource.fullName + " - " + resource.cuid)) {
								this.cuidList.push(resource.fullName + " - " + resource.cuid);
							}
						})
					}
					this.loaderLmosTaskPopup = false;
					this.cuidList = this.cuidList.sort((a, b) => a > b ? 1 : -1);
					if (this.cuidList.length == 0) {
						setTimeout(() => {
							this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
							this.loaderLmosTaskPopup = false;
						}, 2000);
						setTimeout(() => {
							$($('body .modal.fade')).each(function (key, val) {
								if ($(val).attr('data-id') == undefined) {
									$(val).attr('data-id', $('.ng-tns-c0-0 .main-tab-group .mat-tab-header .mat-tab-label-container .mat-tab-list .mat-tab-labels .mat-tab-label-active .mat-tab-label-content').text().trim());
								}
							});
						}, 3000);
					} else {
						this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
						this.loaderLmosTaskPopup = false;
						setTimeout(() => {
							$($('body .modal.fade')).each(function (key, val) {
								if ($(val).attr('data-id') == undefined) {
									$(val).attr('data-id', $('.ng-tns-c0-0 .main-tab-group .mat-tab-header .mat-tab-label-container .mat-tab-list .mat-tab-labels .mat-tab-label-active .mat-tab-label-content').text().trim());
								}
							});
							// $('body .modal.fade').attr('data-id', $('.ng-tns-c0-0 .main-tab-group .mat-tab-header .mat-tab-label-container .mat-tab-list .mat-tab-labels .mat-tab-label-active .mat-tab-label-content').text().trim());
						}, 1000);
					}
				}).catch(errorObj => {
					this.IsOpenPopup = false;
					this.loaderLmosTaskPopup = false;
					this.IsError = true;
					this.message = errorObj.error.message;
					setTimeout(() => {
						this.IsError = false;
					}, 7000);
				});
			}
		} else {
			this.taskService.GetTransferWorkGroupId('LMOS_SCREENERS').toPromise().then((response: any) => {
				if (response && response.length > 0) {
					response.forEach((resource: any) => {
						if (!this.cuidList.find((x) => x == resource.fullName + " - " + resource.cuid)) {
							this.cuidList.push(resource.fullName + " - " + resource.cuid);
						}
					})
				}
				this.loaderLmosTaskPopup = false;
				this.cuidList = this.cuidList.sort((a, b) => a > b ? 1 : -1);
				if (this.cuidList.length == 0) {
					setTimeout(() => {
						this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
						this.loaderLmosTaskPopup = false;
					}, 2000);
					setTimeout(() => {
						$($('body .modal.fade')).each(function (key, val) {
							if ($(val).attr('data-id') == undefined) {
								$(val).attr('data-id', $('.ng-tns-c0-0 .main-tab-group .mat-tab-header .mat-tab-label-container .mat-tab-list .mat-tab-labels .mat-tab-label-active .mat-tab-label-content').text().trim());
							}
						});
						// $('body .modal.fade').attr('data-id', $('.ng-tns-c0-0 .main-tab-group .mat-tab-header .mat-tab-label-container .mat-tab-list .mat-tab-labels .mat-tab-label-active .mat-tab-label-content').text().trim());
					}, 3000);
				} else {
					this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
					this.loaderLmosTaskPopup = false;
					setTimeout(() => {
						$($('body .modal.fade')).each(function (key, val) {
							if ($(val).attr('data-id') == undefined) {
								$(val).attr('data-id', $('.ng-tns-c0-0 .main-tab-group .mat-tab-header .mat-tab-label-container .mat-tab-list .mat-tab-labels .mat-tab-label-active .mat-tab-label-content').text().trim());
							}
						});
						// $('body .modal.fade').attr('data-id', $('.ng-tns-c0-0 .main-tab-group .mat-tab-header .mat-tab-label-container .mat-tab-list .mat-tab-labels .mat-tab-label-active .mat-tab-label-content').text().trim());
					}, 1000);
				}
			}).catch(errorObj => {
				this.IsOpenPopup = false;
				this.loaderLmosTaskPopup = false;
				this.IsError = true;
				this.message = "No Work group Has Been Assigned to this Task.";
				setTimeout(() => {
					this.IsError = false;
				}, 7000);
			});
			// this.taskService.GetTransferWorkGroupId('LMOS_SCREENERS').toPromise().then((response: any) => {
			// 	if (response && response.length > 0) {
			// 		response.forEach((resource: any) => {
			// 			if (!this.cuidList.find((x) => x == resource.fullName + " - " + resource.cuid)) {
			// 				this.cuidList.push(resource.fullName + " - " + resource.cuid);
			// 			}
			// 		})
			// 	}
			// 	this.cuidList = this.cuidList.sort((a, b) => a > b ? 1: -1);
			// 	if (this.cuidList.length == 0) {
			// 		setTimeout(() => {
			// 			this.modalRef = this.modalService.show(template, {backdrop: 'static', keyboard: false});
			// 			this.loaderLmosTaskPopup = false;
			// 		}, 2000);
			// 	} else {
			// 		this.modalRef = this.modalService.show(template, {backdrop: 'static', keyboard: false});
			// 		this.loaderLmosTaskPopup = false;
			// 	}
			// }).catch(errorObj => {
			// 	this.IsOpenPopup = false;
			// 	this.loaderLmosTaskPopup = false;
			// 	this.IsError = true;
			// 	this.message = errorObj.error.message;
			// 	setTimeout(() => {
			// 		this.IsError = false;
			// 	}, 7000);
			// });
		}

		/* this.taskService.getResource(userInfo['cuid']).toPromise().then((result:any)=>{
			let worklistArr = result.workgroupList;
			worklistArr.forEach(element => {
			  resultArr.push(element['workgroupName']);
			});
			resultArr.forEach(element => {
				this.taskService.getWorkGroupMember(element).toPromise().then((response: any) => {
					if (response && response.length > 0) {
						response.forEach((resource: any) => {
							this.cuidList.push(resource.fullName + " - " + resource.cuid);
						})
					}
				}).catch(errorObj => );
			});
			// this.workgroupList  = {"workgroupList":resultArr};
		}).catch((error: any) => {
		  this.loader = false;
		  if(error.status==404){
			this.loader = false;
			this.snackBar.open("Error Searching for Task", "Okay", {
			  duration: 15000,
			});        
		  } 
			}); */
	}

	loadWorkgroups(template) {
		this.routWorkgroups = [];
		if (this.RCMACTask) {
			this.taskService.RCMACReRouteWorkGroups().toPromise().then((response: any) => {
				var WorkGroup = [];
				this.GetAllReRouteWorkGroupsRes = response.systemParameterModels[0].systemParameterItem;
				this.GetAllReRouteWorkGroupsRes.forEach(element => {
					WorkGroup.push(element.description);
				});

				WorkGroup = WorkGroup.sort((a, b) => a > b ? 1 : -1);
				this.routWorkgroups = WorkGroup;
				this.loaderLmosTaskPopup = false;
				if (this.routWorkgroups.length == 0) {
					setTimeout(() => {
						this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
					}, 2000);
					setTimeout(() => {
						$($('body .modal.fade')).each(function (key, val) {
							if ($(val).attr('data-id') == undefined) {
								$(val).attr('data-id', $('.ng-tns-c0-0 .main-tab-group .mat-tab-header .mat-tab-label-container .mat-tab-list .mat-tab-labels .mat-tab-label-active .mat-tab-label-content').text().trim());
							}
						});
					}, 3000);
				} else {
					this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
					setTimeout(() => {
						$($('body .modal.fade')).each(function (key, val) {
							if ($(val).attr('data-id') == undefined) {
								$(val).attr('data-id', $('.ng-tns-c0-0 .main-tab-group .mat-tab-header .mat-tab-label-container .mat-tab-list .mat-tab-labels .mat-tab-label-active .mat-tab-label-content').text().trim());
							}
						});
					}, 1000);
				}
			}).catch(errorObj => {
				this.IsOpenPopup = false;
				this.loaderLmosTaskPopup = false;
				this.IsError = true;
				this.message = errorObj.error.message;
				setTimeout(() => {
					this.IsError = false;
				}, 7000);
			});
		} else {
			this.taskService.GetAllReRouteWorkGroups().toPromise().then((response: any) => {
				var WorkGroup = [];
				this.GetAllReRouteWorkGroupsRes = response.systemParameterModels[0].systemParameterItem;
				this.GetAllReRouteWorkGroupsRes.forEach(element => {
					WorkGroup.push(element.description);
				});

				WorkGroup = WorkGroup.sort((a, b) => a > b ? 1 : -1);
				this.routWorkgroups = WorkGroup;
				this.loaderLmosTaskPopup = false;
				if (this.routWorkgroups.length == 0) {
					setTimeout(() => {
						this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
						// this.loaderTaskDetail = false;
					}, 2000);
					setTimeout(() => {
						$($('body .modal.fade')).each(function (key, val) {
							if ($(val).attr('data-id') == undefined) {
								$(val).attr('data-id', $('.ng-tns-c0-0 .main-tab-group .mat-tab-header .mat-tab-label-container .mat-tab-list .mat-tab-labels .mat-tab-label-active .mat-tab-label-content').text().trim());
							}
						});
						// $('body .modal.fade').attr('data-id', $('.ng-tns-c0-0 .main-tab-group .mat-tab-header .mat-tab-label-container .mat-tab-list .mat-tab-labels .mat-tab-label-active .mat-tab-label-content').text().trim());
					}, 3000);
				} else {
					this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
					setTimeout(() => {
						$($('body .modal.fade')).each(function (key, val) {
							if ($(val).attr('data-id') == undefined) {
								$(val).attr('data-id', $('.ng-tns-c0-0 .main-tab-group .mat-tab-header .mat-tab-label-container .mat-tab-list .mat-tab-labels .mat-tab-label-active .mat-tab-label-content').text().trim());
							}
						});
						// $('body .modal.fade').attr('data-id', $('.ng-tns-c0-0 .main-tab-group .mat-tab-header .mat-tab-label-container .mat-tab-list .mat-tab-labels .mat-tab-label-active .mat-tab-label-content').text().trim());
					}, 1000);
					// this.loaderTaskDetail = false;
				}
			}).catch(errorObj => {
				this.IsOpenPopup = false;
				this.loaderLmosTaskPopup = false;
				this.IsError = true;
				this.message = errorObj.error.message;
				setTimeout(() => {
					this.IsError = false;
				}, 7000);
			});
		}
		// this.taskService.getAllWorkgroups().toPromise().then((response: any) => {
		// 	this.routWorkgroups = response;
		// }).catch(errorObj => );

	}

	checkTaskPermissions() {
		const userDetails = JSON.parse(localStorage.getItem('fd_user'));
		let buttonPermissions = [];
		const buttonsAdnTabsSection: any = this.pageLayout['pageLayoutTemplate'].filter((section: any) => section.sectionHeader == 'Buttons' || section.sectionHeader == 'Related-Tabs' || section.sectionHeader == 'LMOS Buttons');
		const authorizations = userDetails && userDetails.authorizations ? userDetails.authorizations : [];

		buttonPermissions = authorizations.filter(authPermission => authPermission.startsWith('Button') || authPermission.startsWith('Tabs'));
		if (buttonsAdnTabsSection && buttonsAdnTabsSection.length > 0) {
			for (let j = 0; j < buttonsAdnTabsSection.length; j++) {
				let templateButtons = buttonsAdnTabsSection[j].fieldsList;
				for (let i = 0; i < templateButtons.length; i++) {
					const button = templateButtons[i];
					if (button && button.accessPoint) {
						if (button && buttonPermissions.indexOf(button.accessPoint) == -1) {
							// Not authorized
							templateButtons.splice(i, 1);
							i--;
							continue;
						} else {
						}

						if ((button.label == 'Close' && (this.taskDetails.allowedactions.indexOf('Complete') == -1)) ||
							(button.label == 'Dispatch' && (this.taskDetails.allowedactions.indexOf('Dispatch') == -1)) ||
							(button.label == 'Assign' && (this.taskDetails.allowedactions.indexOf('Assign') == -1)) ||
							(button.label == 'Release' && (this.taskDetails.allowedactions.indexOf('Release') == -1)) ||
							(button.label == 'Reroute' && (this.taskDetails.allowedactions.indexOf('Complete') == -1)) ||
							(button.label == 'Transfer' && (this.taskDetails.allowedactions.indexOf('Assign') == -1)) ||
							(button.label == 'Return Task To Workgroup' && (this.taskDetails.allowedactions.indexOf('Release') == -1)) ||
							(button.label == 'Cancel' && (this.taskDetails.allowedactions.indexOf('Cancel') == -1)) ||
							(button.label == 'Force Close' && (this.taskDetails.allowedactions.indexOf('ForceClose') == -1))) {
							// console.log("Button not an allowed action: " + button.label);
							templateButtons.splice(i, 1);
							i--;
						} else {
						}
					}
				}
			}
		}
		this.loader = false;
		this.loaderTaskDetail = false;
		this.loaderDeviceDetail = false;
		this.TaskLoader = false;
	}

	LMOScheckTaskPermissions() {
		const userDetails = JSON.parse(localStorage.getItem('fd_user'));
		let buttonPermissions = [];
		const buttonsAdnTabsSection: any = this.wcmPageLayout.filter((section: any) => section.sectionHeader == 'Buttons' || section.sectionHeader == 'Related-Tabs');
		const authorizations = userDetails && userDetails.authorizations ? userDetails.authorizations : [];
		var LMOSSection = authorizations.filter(authPermission => authPermission.startsWith('LMOS'));

		if (LMOSSection.indexOf('LMOS_UnMappedFields') > -1) {
			this.ShowUnmappedFieldSection = true;
		}
		for (let i = 0; i < this.wcmPageLayout.length; i++) {
			// if ((this.wcmPageLayout[i].sectionHeader == 'Task Summary' && (LMOSSection.indexOf('LMOS_task_summery') == -1) ) ||
			// (this.wcmPageLayout[i].sectionHeader == 'Trouble Report' && (LMOSSection.indexOf('LMOS_Trouble_Report') == -1)) ||
			// (this.wcmPageLayout[i].sectionHeader == 'Facilities' && (LMOSSection.indexOf('LMOS_Facilities') == -1)) ||
			// (this.wcmPageLayout[i].sectionHeader == 'Customer' && (LMOSSection.indexOf('LMOS_Customer') == -1))) {
			// 	this.wcmPageLayout.splice(i, 1);
			// 	i--;
			// }

		}

		buttonPermissions = authorizations.filter(authPermission => authPermission.startsWith('Button') || authPermission.startsWith('Tabs'));
		if (buttonsAdnTabsSection && buttonsAdnTabsSection.length > 0) {
			for (let j = 0; j < buttonsAdnTabsSection.length; j++) {
				let templateButtons = buttonsAdnTabsSection[j].fieldsList;
				for (let i = 0; i < templateButtons.length; i++) {
					const button = templateButtons[i];
					if (button && button.accessPoint) {
						if (button && buttonPermissions.indexOf(button.accessPoint) == -1) {
							// Not authorized
							templateButtons.splice(i, 1);
							i--;
							continue;
						} else {
						}
						// if(button && (button.label == 'Close' && (buttonPermissions.indexOf('Button_LMOS_close') == -1)) || 
						// 			(button.label == 'Complete' && (buttonPermissions.indexOf('Button_LMOS_complete') == -1)) ||
						// 			(button.label == 'Reroute' && (buttonPermissions.indexOf('Button_LMOS_reroute') == -1)) || 
						// 			(button.label == 'Transfer' && (buttonPermissions.indexOf('Button_LMOS_transfer') == -1)) ||
						// 			(button.label == 'Return Task To Workgroup' && (buttonPermissions.indexOf('Button_LMOS_returnToWorkgroup') == -1)) ||
						// 			(button.label == 'Cancel' && (buttonPermissions.indexOf('Button_LMOS_cancel') == -1)) ||
						// 			(button.label == 'DLETH' && (buttonPermissions.indexOf('Tabs_LMOS_DLETH') == -1)) ||
						// 			(button.label == 'DLRL' && (buttonPermissions.indexOf('Tabs_LMOS_DLRL') == -1)) ||
						// 			(button.label == 'DSH' && (buttonPermissions.indexOf('Tabs_LMOS_DSH') == -1)) ||
						// 			(button.label == 'DETR' && (buttonPermissions.indexOf('Tabs_LMOS_DETR') == -1)) ||
						// 			(button.label == 'MLTFX' && (buttonPermissions.indexOf('Tabs_LMOS_MLTFX') == -1))){
						// 	templateButtons.splice(i, 1);
						// 	i--;
						// }

						if ((button.label == 'Close' && (this.taskDetails.allowedactions.indexOf('Complete') == -1)) ||
							(button.label == 'Reroute' && (this.taskDetails.allowedactions.indexOf('Dispatch') == -1)) ||
							(button.label == 'Transfer' && (this.taskDetails.allowedactions.indexOf('Assign') == -1)) ||
							(button.label == 'Return Task To Workgroup' && (this.taskDetails.allowedactions.indexOf('Release') == -1)) ||
							(button.label == 'Cancel' && (this.taskDetails.allowedactions.indexOf('Cancel') == -1)) ||
							(button.label == 'Force Close' && (this.taskDetails.allowedactions.indexOf('ForceClose') == -1))) {
							// console.log("Button not an allowed action: " + button.label);
							templateButtons.splice(i, 1);
							i--;
						} else {
						}
					}
				}
			}
		}
		this.loader = false;
		this.loaderTaskDetail = false;
		this.loaderDeviceDetail = false;
		this.TaskLoader = false;
	}

	OnActionTD(action) {
		var name = '';
		this.IsSucess = false;
		this.IsError = false;
		this.message = '';
		if (action == 'Accept' || action == 'UnBlock' || action == 'Release' || action == "Retry") {
			var sourceSystem = this.taskDetails.sourceSystemName;
			if (action == 'UnBlock') {
				sourceSystem = "";
				const userDetails = JSON.parse(localStorage.getItem('fd_user'));
				const authorizations = userDetails && userDetails.authorizations ? userDetails.authorizations : [];
				if (authorizations.indexOf('Button_unblock') === -1) {
					this.errorMessage = 'You do not have access to unblock the task';
					// this.snackBar.open(this.errorMessage, "Okay", {
					// 	duration: 5000,
					// });
					return;
				}
				name = 'blocking_reason';
			}

			var obj = {};
			obj['id'] = this.taskDetails.id;
			obj['taskStatusActionRequest'] = {
				"action": action,
				"assignCuid": "",
				"taskInstanceId": "",
				"sourceSystem": sourceSystem,
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
						"value": "",
						"jsonDescriptor": "",
						"pageLayoutFieldId": ""
					}
				],
				"taskId": ""
			};
			this.loader = true;
			this.taskService.TaskAction(obj, action).toPromise().then((result: any) => {
				this.loader = false;
				this.IsSucess = true;
				this.message = result.message;
				setTimeout(() => {
					this.IsSucess = false;
				}, 7000);
				this.getTaskDetails(false, false);
			}, (error: any) => {
				this.loader = false;
				this.IsError = true;
				this.message = error.error.message;
				setTimeout(() => {
					this.IsError = false;
				}, 7000);
			}).catch((errorObj: any) => {
				this.loader = false;
			});

		}
		else if (action == 'Edit'){
			this.UpdateFields();
        } else {
			// console.log("ACTION ELSE EXECUTED");
			this.modalDetails.UserDetailsObj=this.userInfo;
			this.loader = false;
			this.selectedAction = action;
			var ModalData = this.getModelData();
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
				dropdownList: action == 'Assign' ? this.getWorkgroupResources() : this.resourcesList
			}];
			var output = {};
			let completeButtons: any = [];
			completeButtons = [{ "Sectionheader": "Cancel", "fieldName": "Cancel", "visible": true, "service": null, "fieldLabel": "Cancel", "disabled": false, "label": "Cancel", "type": "button", "title": "Cancel", "fieldType": "button", "class": "search-btn reset-bgclr", "primary": false }, { "Sectionheader": "Save", "fieldName": "Save", "visible": true, "service": null, "fieldLabel": "Save", "disabled": false, "label": "Save", "type": "submit", "title": "Save", "fieldType": "button", "class": "search-btn", "primary": true }]
			if (this.selectedAction == 'Complete') {
			let tmpPageLayout: any = {
				"pageLayoutTemplate": [
					{
						"sectionHeader": "Buttons",
						"fieldsList": [
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
								"Sectionheader": "Save",
								"fieldName": "Save",
								"visible": true,
								"service": null,
								"fieldLabel": "Save",
								"disabled": false,
								"label": "Save",
								"type": "submit",
								"title": "Save",
								"fieldType": "button",
								"class": "search-btn",
								"primary": true
							}
						]
					}
				],
				"templateName": "paramsLayout_Complete",
				"createdById": "AC30161"
			};
			this.loader = true;
			this.taskService.getTaskType(this.taskDetails.taskType.id).toPromise().then((resp: any) => {
				let isCloseLayout:any = false;
				let blockingCategoryReason = this.arrayOfCategory
				resp.params.forEach((paramElement: any) => {
					console.log(paramElement.name);
					if(paramElement.name=="closeLayout"){
						isCloseLayout=true;
						let ActionPageLayOutName: any = "";
						//resp.params[0] = "paramsLayout_CompleteWithCompleteAction";
						ActionPageLayOutName = resp.params && resp.params.length > 0 ? paramElement.value : 'paramsLayout_CompleteDefault';
						this.taskService.callGetUrl('/PageLayoutTemplate/Get/' + ActionPageLayOutName).toPromise().then((pgLayoutResp) => {
							this.loader = false;
							output[ModalData.fieldName] = '';
							tmpPageLayout = pgLayoutResp;

							if (this.selectedAction == 'Complete') {
								this.setCompleteActionListOfValues(tmpPageLayout, this.approvedCompleteActions);
							}
							
							var addRole: any = {
								buttons: ModalData.actions,
								pageLayoutData: tmpPageLayout,
								fields: field,
								title: ModalData.label,
								output: output,
								from: 'taskassignedcuid',
								Reason: (this.selectedAction == 'Accept') ? UserDetails.personalInfo.cuid : '',
								Category:(this.selectedAction == 'Accept') ? UserDetails.personalInfo.cuid : '',
								blockingReasons: (this.selectedAction == 'Block') ? this.blockingReasons : '',
								workgroupList: (this.selectedAction == 'Dispatch') ? this.workgroupList : '',
								blockingCategory:(this.selectedAction == 'Block') ? this.blockingCategory : '',
								size: (this.selectedAction == 'Block' || this.selectedAction == 'Complete') ? 'modal-lg' : 'modal-sm'
							}
							this.modalDetails = { ...this.modalDetails, ...addRole, className: "taskassignedcuid", error: {}, isDeleteConfirm: false, isFromTD: true};
							this.modalChild.showModal();
						}).catch((err) => {
							this.loader = false;
						});
					}
				});
				if(isCloseLayout==false){
					let ActionPageLayOutName: any = "";
						//resp.params[0] = "paramsLayout_CompleteWithCompleteAction";
						ActionPageLayOutName = 'paramsLayout_CompleteDefault';
						this.taskService.callGetUrl('/PageLayoutTemplate/Get/' + ActionPageLayOutName).toPromise().then((pgLayoutResp) => {
							this.loader = false;
							output[ModalData.fieldName] = '';
							tmpPageLayout = pgLayoutResp;
							var addRole: any = {
								buttons: ModalData.actions,
								pageLayoutData: tmpPageLayout,
								fields: field,
								title: ModalData.label,
								output: output,
								from: 'taskassignedcuid',
								Reason: (this.selectedAction == 'Accept') ? UserDetails.personalInfo.cuid : '',
								blockingReasons: (this.selectedAction == 'Block') ? this.blockingReasons : '',
								workgroupList: (this.selectedAction == 'Dispatch') ? this.workgroupList : '',
								blockingCategory:(this.selectedAction == 'Block') ? this.blockingCategory : '',
								size: 'modal-sm'
							}
							this.modalDetails = { ...this.modalDetails, ...addRole, className: "taskassignedcuid", error: {}, isDeleteConfirm: false, isFromTD: true };
							this.modalChild.showModal();
						}).catch((err) => {
							this.loader = false;
						});
				}
				console.log(resp);
				

			}).catch((err: any) => {
				this.loader = false;
			});
		} else {
			output[ModalData.fieldName] = '';			
			let taskDispatchAreaName
				if (this.selectedAction == 'Copy Task') {					
					taskDispatchAreaName = this.taskDetails.taskInstParamRequests.filter(x => { return x.name == "dispatchArea" })[0].value;
				}
			var addRole: any = {
				buttons: ModalData.actions,
				fields: field,
				title: ModalData.label,
				output: output,
				from: 'taskassignedcuid',
				taskTypeName: (this.taskDetails.taskType.taskName != '') ? this.taskDetails.taskType.taskName : '',
				Reason: (this.selectedAction == 'Accept') ? UserDetails.personalInfo.cuid : '',
				Category:(this.selectedAction == 'Accept') ? UserDetails.personalInfo.cuid : '',
				blockingReasons: (this.selectedAction == 'Block') ? this.blockingReasons : '',
				workgroupList: (this.selectedAction == 'Dispatch') ? this.workgroupList : '',
				blockingCategory:(this.selectedAction == 'Block') ? this.blockingCategory : '',
				dispatchAreaList: (this.selectedAction == 'Copy Task') ? this.systemParmaChild['Dispatch Areas'] : '',
				taskTypeList: (this.selectedAction == 'Copy Task') ? this.taskTypeList : '',
				dispatchArea: taskDispatchAreaName,
				taskType: '',
				size: (this.selectedAction == 'Block' || this.selectedAction == 'Complete' || this.selectedAction == 'Copy Task') ? 'modal-lg' : 'modal-sm'
			}
			this.modalDetails = { ...this.modalDetails, ...addRole, className: "taskassignedcuid", error: {}, isDeleteConfirm: false, isFromTD: true };
			this.modalChild.showModal();
		}
			/* if (this.selectedAction == 'Complete') {
				ModalData.actions = completeButtons;
				this.loader = true;
				this.taskService.callGetUrl('/PageLayoutTemplate/Get/paramsLayout_Complete').toPromise().then((resp) => {
					this.loader = false;
					output[ModalData.fieldName] = '';
					
					var addRole: any = {
						buttons: ModalData.actions,
						pageLayoutData: tmpPageLayout,
						fields: field,
						title: ModalData.label,
						output: output,
						from: 'taskassignedcuid',
						Reason: (this.selectedAction == 'Accept') ? UserDetails.personalInfo.cuid : '',
						blockingReasons: (this.selectedAction == 'Block') ? this.blockingReasons : '',
						workgroupList: (this.selectedAction == 'Dispatch') ? this.workgroupList : '',
						size: (this.selectedAction == 'Block' || this.selectedAction == 'Complete') ? 'modal-lg' : 'modal-sm'
					}
					this.modalDetails = { ...this.modalDetails, ...addRole, className: "taskassignedcuid", error: {}, isDeleteConfirm: false };
					this.modalChild.showModal();
				}).catch((err) => {
					this.loader = false;
				});
			}
			else {
				output[ModalData.fieldName] = '';
				var addRole: any = {
					buttons: ModalData.actions,
					fields: field,
					title: ModalData.label,
					output: output,
					from: 'taskassignedcuid',
					Reason: (this.selectedAction == 'Accept') ? UserDetails.personalInfo.cuid : '',
					blockingReasons: (this.selectedAction == 'Block') ? this.blockingReasons : '',
					workgroupList: (this.selectedAction == 'Dispatch') ? this.workgroupList : '',
					size: (this.selectedAction == 'Block' || this.selectedAction == 'Complete') ? 'modal-lg' : 'modal-sm'
				}
				this.modalDetails = { ...this.modalDetails, ...addRole, className: "taskassignedcuid", error: {}, isDeleteConfirm: false };
				this.modalChild.showModal();
			} */


		}
    }
	
	
	
	showRetryButton(models: any[]) {
        let showRetry = false;
		let retryMethodType = false;
		let retryRequestHeader = false;
        let retryRequestURL = false;
        const userObj = JSON.parse(localStorage.getItem('fd_user'));
		models.forEach(model => {
		    if(model.header = 'Reference'){
                model.paramList.forEach(param => {
                    if(param.name){
                        if ( param.name == 'retryMethodType' && param.value && param.value != null){
                            retryMethodType=true;
                        }
                        else if (param.name == 'retryRequestHeader' && param.value && param.value != null){
                            retryRequestHeader=true;
                        }
                        else if (param.name == 'retryRequestURL' && param.value && param.value != null){
                            retryRequestURL=true;
                        }

                    }
                });
            }
		});
		if (retryRequestURL && retryMethodType && retryRequestHeader){
			if(userObj.cuid == this.taskDetails.assignedCuid) {
				showRetry = true;
			}
			else{
				showRetry = false;
			}
		} else {
			showRetry = false;
		}
		
	   return showRetry;
	}
    //Check if action button is allowed
    showActionBtn(action){
        var show = false;
        const userObj = JSON.parse(localStorage.getItem('fd_user'));
        //console.log("userObj:", userObj)
        //console.log("action:", action)
        if(action == "Retry"){
			if(this.taskDetails.sourceSystemName == 'SAO'){
				//check to show Retry button
			   // console.log("this.allowSAORetry:", this.allowSAORetry)
				//console.log(userObj.cuid, "==?:", this.taskDetails.assignedCuid)
				if(this.allowSAORetry && userObj.cuid == this.taskDetails.assignedCuid){
					show = true;
				}
				else {
					show = false;
				}
			} else if (this.taskDetails.sourceSystemName == 'AUTOPILOT'){
                show = this.showRetryButton(this.taskDetails.taskSectionModels);
            }
        } else {
            show = true;
        }
        return show;
    }

	// Set ListOfValues for page layout field called "complete_action" from 
	// the list of approved_complete_actions in task_instance_params
	setCompleteActionListOfValues(pageLayoutData, list) {
		if (pageLayoutData && pageLayoutData.pageLayoutTemplate && pageLayoutData.pageLayoutTemplate.length > 1) {
			pageLayoutData.pageLayoutTemplate.forEach((element: any) => {
				if (element.sectionHeader == "Parameters") {
					element.fieldsList.forEach((fieldDtls: any) => {
						if (fieldDtls.fieldName == 'complete_action') {
							fieldDtls.ListOfValues = list;
							return;
						}
					});
				}
			});
		}
	}

	/* getModelData(value) {
		return {
			"fieldName": value + "_cuid",
			"visible": true,
			"editable": false,
			"label": value,
			"type": "select",
			"fieldValue": "",
			"mandatory": true,
			"required": true,
			"Sectionheader": value,
			"service": null,
			"fieldLabel": value + " cuid",
			"disabled": false,
			"placeholder": null,
			"fieldError": "You must enter a value to proceed",
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
	} */

	buttonClickedTD(fromModal) {
		if(fromModal['modal']['from'] != 'deletetaskinstanceparameter'){
		console.log(fromModal, this.selectedAction);
		var obj = {};
		var globalNotesobj={};
		var blockglNotes='';
		var blockingTimestamp='';
		var blockgUser='';
		var assignCuid = '';
		var value = '';
		var comments = '';
		var name = '';
		var taskType = '';
		var workgrpName: any= [];
		var workGroupName = '';
		var modifiedById = '';
		let paramRequests:any=[];
			if (fromModal.modal.title == 'Copy Task') {
				taskType = fromModal.modal.taskType;
				var UserDetails = JSON.parse(localStorage.getItem('defaultValue'));
				modifiedById = UserDetails.personalInfo.cuid,
					paramRequests = [
						{
							"name": "dispatchArea",
							"value": fromModal.modal.dispatchArea
						}];
			}
			else if (this.selectedAction == 'Cancel' || this.selectedAction == 'Block') {
			assignCuid = "";
			name = (this.selectedAction == 'Cancel') ? "cancel_reason" : (this.selectedAction == 'Block') ? 'blocking_reason' : '';
			value = localStorage.getItem('Reason');   
		
			paramRequests = [
				{
					"header": "",
					"name": name,
					"paramFieldLayout": {},
					"value": value,
					"jsonDescriptor": "",
					"pageLayoutFieldId": ""
				},
				{
					"header": "",
					"name": 'blocking_category',
					"paramFieldLayout": {},
					"value": fromModal.modal.Category,
					"jsonDescriptor": "",
					"pageLayoutFieldId": ""
				},
				
			];
			if(this.selectedAction=='Block'){
			blockglNotes = fromModal.modal.blockingGlNote;
			blockingTimestamp=fromModal.modal.blockingTimestamp;
			blockgUser=fromModal.modal.UserDetailsObj.fullName;
			if(blockingTimestamp!=''){	
			var blockDate=new Date(blockingTimestamp);
			var blockDateUTCString=blockDate.getUTCFullYear()+"-"+(blockDate.getUTCMonth()+1<10? "0"+(blockDate.getUTCMonth()+1): (blockDate.getUTCMonth()+1))+"-"+(blockDate.getUTCDate()<10?"0"+blockDate.getUTCDate():blockDate.getUTCDate())+" "+(blockDate.getUTCHours()<10? "0"+(blockDate.getUTCHours()): (blockDate.getUTCHours()))+":"+(blockDate.getUTCMinutes()<10? "0"+(blockDate.getUTCMinutes()): (blockDate.getUTCMinutes()))+":"+(blockDate.getUTCSeconds()<10? "0"+(blockDate.getUTCSeconds()): (blockDate.getUTCSeconds()));
						
			paramRequests.push(
				{
					"header": "Other Details",
					"name": "blockingTimestamp",
					"paramFieldLayout": {},
					"dateValue": blockDateUTCString,
					"jsonDescriptor": "",
					"pageLayoutFieldId": ""
				});
			}

			if(blockgUser!=''){	
						
				paramRequests.push(
					{
						"header": "Other Details",
						"name": "blockingUser",
						"paramFieldLayout": {},
						"value": blockgUser,
						"jsonDescriptor": "",
						"pageLayoutFieldId": ""
					});
				}
		}
			if(this.selectedAction == 'Block' && blockglNotes!=''){
				comments = blockglNotes;
			// globalNotesobj['Note'] = 	{
				
				
			// 	   "Note":blockglNotes,
			// 	   "NoteType":"Application",
			// 	   "Source":"SAO"
				
			//  };
			
		// 	this.loader = true;
		// this.taskService.createGlobalNote(this.taskDetails.id,globalNotesobj).toPromise().then((result: any) => {
		// 	this.loader = false;
		// 	this.IsSucess = true;
		// 	this.modalChild.hideModal();
		// 	this.message = result.message;
			

		// }, (error: any) => {
		// 	this.loader = false;
		// 	this.IsError = true;
		// 	this.message = error.error.message;
		// 	this.modalChild.setErrorMessage(this.message);
		// 	this.isModalErrMsgSet = true;
		// }).catch((errorObj: any) => {
		// 	this.loader = false;
		// });
	}
		} else if (this.selectedAction == 'Dispatch') {
			workGroupName = localStorage.getItem('DispatchWorkgroup');
			paramRequests = [
				{
					"header": "",
					"name": name,
					"paramFieldLayout": {},
					"value": value,
					"jsonDescriptor": "",
					"pageLayoutFieldId": ""
				}
			];
				obj['taskStatusActionRequest'] = {
					"action": this.selectedAction,
					"assignCuid": assignCuid,
					"taskInstanceId": "",
					"sourceSystem": "",
					"modifiedById": "",
					"comments": comments,
					"workgroupList": [
						{
							"workgroupName": workGroupName,
							"roles": [
								""
							]
						}
					],
					"paramRequests": paramRequests,
					"taskId": ""
				};
		}
		else if(this.selectedAction.toLowerCase()=="complete"){
			//Updating user's complete action remark in global notes
			this.taskService.createGlobalNote(this.taskDetails.id, fromModal.modal.pageLayoutData.pageLayoutTemplate[0].fieldsList[1].fieldValue);
			fromModal.modal.pageLayoutData.pageLayoutTemplate.forEach((element:any) => {
				if(element.sectionHeader== "Parameters" || element.sectionHeader== "Demarc Information"){
					element.fieldsList.forEach((fieldDtls:any) => {
						let value = fieldDtls.fieldValue;
						if (fieldDtls.type == "select") {
							if (!this.app.fieldHasValue(value) && fieldDtls.ListOfValues && fieldDtls.ListOfValues.length == 1) {
								value = fieldDtls.ListOfValues[0];
							}
						}
						if(element.sectionHeader== "Demarc Information") {
							paramRequests.push(
								{
									"header": element.sectionHeader,
									"name": fieldDtls.fieldName,
									"paramFieldLayout": {},
									"value": value,
									"jsonDescriptor": "",
									"pageLayoutFieldId": fieldDtls.pageLayoutFieldId
								});
						} else {
						paramRequests.push(
							{
								"header": "",
								"name": fieldDtls.fieldName,
								"paramFieldLayout": {},
								"value": value,
								"jsonDescriptor": "",
								"pageLayoutFieldId": ""
							});
						}
					});
				}
			});
		} else {
			// assignCuid = fromModal.modal.output[this.selectedAction + '_cuid'];
			assignCuid=fromModal.modal.fields[0].fieldValue;
			paramRequests = [
				{
					"header": "",
					"name": name,
					"paramFieldLayout": {},
					"value": value,
					"jsonDescriptor": "",
					"pageLayoutFieldId": ""
				}
			];
		}
		obj['id'] = this.taskDetails.id;
		if(this.selectedAction != 'Dispatch'){
		for(let i=0; i<this.taskDetails.workgroupList.length; i++){
			if(this.taskDetails.workgroupList[i]['workgroupName'] != null || this.taskDetails.workgroupList[i]['workgroupName'] != ""){
				workgrpName.push({"workgroupName":this.taskDetails.workgroupList[i]['workgroupName'],"roles":[""]});
			}
			else{
				workgrpName = "";
			}
		}
		obj['taskStatusActionRequest'] = {
			"action": this.selectedAction,
			"assignCuid": assignCuid,
			"taskInstanceId": "",
			"sourceSystem": "",
			"modifiedById": modifiedById,
			"comments": comments,
			"workgroupList": workgrpName,
			"taskType": taskType,
			"allowEnrichment":false,
			"paramRequests": paramRequests,
			"taskId": ""
		}};
		this.loader = true;
		this.taskService.TaskAction(obj, this.selectedAction).toPromise().then((result: any) => {
			this.loader = false;
			this.IsSucess = true;
			this.modalChild.hideModal();
			this.message = result.message;
			this.getTaskDetails(false, false);

		}, (error: any) => {
			this.loader = false;
			this.IsError = true;
			this.message = error.error.message;
			this.modalChild.setErrorMessage(this.message);
			this.isModalErrMsgSet = true;
		}).catch((errorObj: any) => {
			this.loader = false;
		});
	}else{
		let data = fromModal['modal']['data'];
		let taskInstanceParam = JSON.parse(data['pagedItems'][data['rowIndex']]['obj']);

		let pagedItems = data.pagedItems;
		let rowIndex = data.rowIndex;
		let taskInstanceParamValue = pagedItems[rowIndex];
	
		taskInstanceParamValue['id']= undefined;
		taskInstanceParamValue['obj'] = undefined;
		if (taskInstanceParamValue['new']) {
			
			taskInstanceParam['name'] = pagedItems.length+1;
		}
		
		taskInstanceParamValue['new'] = undefined;
		taskInstanceParamValue['rowEdit'] = undefined;
		taskInstanceParam['value'] = JSON.stringify(taskInstanceParamValue);
		// update
		taskInstanceParam['modifiedById'] = this.userInfo.cuid;
		this.loader = true;
		this.showFacility = false;
		
		this.taskService.deleteTaskInstanceParam(this.currentTaskId,taskInstanceParam).toPromise().then(response =>{
			this.loader=false;
			this.IsSucess = true;
			this.message = response['message'];
			setTimeout(() => {
						this.IsSucess = false;
			}, 2000);
			this.tableDetailTableSection[taskInstanceParam['header']]['tableData'].push(pagedItems[rowIndex]);
			this.showFacility=true;
			this.getTaskDetails(true, false);
			// this.tableComponent.updateItemInAllItems(pagedItems[rowIndex]);
			
		}).catch((errorObj: any) => {
			this.loader = false;
			this.IsError=true;
			this.message=errorObj.error.message;
			// this.loaderLmosTaskPopup = false;
		});


		
	}
	}
	modalClosed() {
		this.IsError = false;
		this.isModalErrMsgSet = false;
	}

	getStatusColor(taskStatus) {
			switch (taskStatus.toLowerCase()) {
		// switch (taskStatus) {
			case 'in progress':
				return 'rgb(56, 128, 170)'
				break;
			case 'complete':
				return 'rgb(77, 169, 68)'
				break;
			case 'cancelled':
				return 'rgb(235, 163, 44)'
				break;
			case 'failed':
				return 'rgb(228, 59, 52)'
				break;
			default:
				return 'rgb(0, 0, 0)'
				break;
		}
	}

	ngOnDestroy() {
		this.modalService.hide(1);
		this.resourceListSubscription.unsubscribe();
		this.taskTypeListSubscription.unsubscribe();
		this.workGroupListSubscription.unsubscribe();
	}

	convertNumberToArray(count) {
		this.tablePaginationData = [];
		for (let i = 1; i <= count.length; i++) {
			this.tablePaginationData.push(count[i - 1].number);
		}
	}

	onPaginateInnerGrid(pageNumber: number) {
		if (this.logData && this.logData.length > 0) {
			let tempArray = [];
			this.logData.map((item) => {
				tempArray.push(item);
			})
			this.displayTaskResult = tempArray.splice((pageNumber - 1) * this.currentPageLimit, this.currentPageLimit);
			this.currentPageNumber = pageNumber; this.displayTaskResult
			let pageCount = this.logData.length % this.currentPageLimit == 0 ? this.logData.length / this.currentPageLimit :
				this.logData.length / this.currentPageLimit + 1;
			this.pagination.currentPageNumber = this.currentPageNumber;
			this.pagination.totalRecords = this.logData.length;
			let pageset = [];
			for (let j = 1; j <= pageCount; j++) {
				let page = this.makePage(j, j.toString(), j === 1);
				pageset.push(page);
				if (j == pageCount) {
					this.convertNumberToArray(pageset);
				}
			}
			// this.convertNumberToArray(pageCount);

			let totalPages = pageCount;
			let pages: any[] = [];
			let startPage = 1;
			let maxSize = 10;
			let rotate = true;
			let endPage = totalPages;
			let isMaxSized = typeof maxSize !== 'undefined' && maxSize < totalPages;

			// recompute if maxSize
			if (isMaxSized) {
				if (rotate) {
					// Current page is displayed in the middle of the visible ones
					startPage = Math.max(pageNumber - Math.floor(maxSize / 2), 1);
					endPage = startPage + maxSize - 1;

					// Adjust if limit is exceeded
					if (endPage > totalPages) {
						endPage = totalPages;
						startPage = endPage - maxSize + 1;
					}
				} else {
					// Visible pages are paginated with maxSize
					startPage = ((Math.ceil(pageNumber / maxSize) - 1) * maxSize) + 1;

					// Adjust last page if limit is exceeded
					endPage = Math.min(startPage + maxSize - 1, totalPages);
				}
			}

			// Add page number links
			for (let num = startPage; num <= endPage; num++) {
				let page = this.makePage(num, num.toString(), num == pageNumber);
				pages.push(page);
			}

			// Add links to move between page sets
			if (isMaxSized && !rotate) {
				if (startPage > 1) {
					let previousPageSet = this.makePage(startPage - 1, '...', false);
					pages.unshift(previousPageSet);
				}

				if (endPage < totalPages) {
					let nextPageSet = this.makePage(endPage + 1, '...', false);
					pages.push(nextPageSet);
				}
			}

			this.convertNumberToArray(pages);

		} else {
			this.displayTaskResult = [];
		}
	}

	makePage(num: number, text: string, active: boolean) {
		return { text, number: num, active };
	}

	public onLimitChange(limit: any): void {
		this.changePageLimit(limit);
		//this.table.limit = this.currentPageLimit;
		//this.table.recalculate();
		this.onPaginateInnerGrid(1);
	}

	private changePageLimit(limit: any): void {
		this.currentPageLimit = parseInt(limit, 10);
		this.pagination.pageSize = this.currentPageLimit;
		// this.pagination.pageNumber = Math.ceil(this.taskResults.length / this.currentPageLimit);
		this.totalPage = Math.ceil(this.logData.length / this.currentPageLimit);
		this.pagination.totalPage = this.totalPage;
	}

	onGridNext() {
		if (this.currentPageNumber < this.pagination.totalPage) {
			this.currentPageNumber += 1;
			this.onPaginateInnerGrid(this.currentPageNumber);
		}
	}

	onGridPrevious() {
		if (this.currentPageNumber != 1) {
			this.currentPageNumber -= 1;
			this.onPaginateInnerGrid(this.currentPageNumber);
		}
	}

	onLogSortSelection(columnName: string) {
		this.activeSort = columnName;
		if (this.isSortAsc) {
			this.isSortAsc = false;
			this.LogDetailsParameter.isSortAsc = false;
			this.logData.sort(this.dynamicSort(columnName));
		} else {
			this.isSortAsc = true;
			this.LogDetailsParameter.isSortAsc = true;
			this.logData.sort(this.dynamicSort('-' + columnName));
		}
		this.onPaginateInnerGrid(1);
	}

	LogfilterTaskResult(columnName: string) {
		let thi = this;

		const globalSearch = this.LogDetailsParameter.globalSearch;
		let temp: any;
		if (globalSearch !== '') {
			temp = this.logDetails.filter(row => {
				var result = {};
				for (var key in row) {
					let searchelem = key;
					// if (searchelem === 'createdById') {
					// 	searchelem = 'logdetailscreatedById';
					// } else if (searchelem === 'createdDateTime') {
					// 	searchelem = 'logdeatilscreatedDateTime';
					// }
					if (isObject(row[searchelem]) === false || isArray(row[searchelem]) === false) {
						if (row.hasOwnProperty(searchelem) && row[searchelem] && row[searchelem].toUpperCase().indexOf(globalSearch.toUpperCase()) !== -1) {
							result[searchelem] = row[searchelem];
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
			temp = this.logDetails.filter(function (item) {
				let flag = true;
				Object.keys(item).forEach((element) => {
					let searchelem = element;
					// if (element === 'createdById') {
					// 	searchelem = 'logdetailscreatedById';
					// } else if (element === 'createdDateTime') {
					// 	searchelem = 'logdeatilscreatedDateTime';
					// }
					if (flag && thi.actionColumn[searchelem] && item[element] && thi.actionColumn[searchelem] != "") {
						if (flag && item[element].toLowerCase().indexOf(thi.actionColumn[searchelem].toLowerCase()) === -1) {
							flag = false;
						}
					}
				});
				return flag;
			});
		}

		this.logData = temp;
		this.onPaginateInnerGrid(1);
	}

	getTaskParentChildDetails() {
		let that = this;
		// this.doughnutChartLabels = [];
		// this.doughnutChartData = [];
		let requestData: any = {
			"parentTaskId": this.processData.id,
		}
		this.loader = true;
		this.taskService.searchTaskParentChild(requestData).toPromise().then((response: any) => {
			//this.loader = false;
			this.taskParentChildList = response.taskResults || [];
			this.tableData = response.taskResults || [];
			//console.log("parentchild call response <==> ", response);
			//console.log("child table data <==> ", this.tableData);
			var counts = {};
			this.tableData.forEach(function (x) { counts[x.statusMessage] = (counts[x.statusMessage] || 0) + 1; });
			Object.keys(counts).forEach(function (key) {
				that.chartjsData.sourceData.push({ "label": key, "data": counts[key] });
				// that.doughnutChartLabels.push(key);
				// that.doughnutChartData.push(counts[key]);
			});
			this.tableData.forEach((tableRow: any, i) => {
				//tableRow.requestType = 'child';
				tableRow.seq = i + 1;
				tableRow.isRowDetailOpen = false;
				tableRow.isIconMinus = true;
				tableRow.totalCounts = tableRow.childStatusCounts.totalCounts;
				tableRow.doughnutChartData = [];
				tableRow.doughnutChartLabels = [];
				Object.keys(tableRow.childStatusCounts).forEach(function (key) {
					if (key != 'totalCounts') {
						tableRow.doughnutChartLabels.push(key);
						tableRow.doughnutChartData.push(tableRow.childStatusCounts[key]);
					}
				});

			});
			console.log(this.tableData);
			this.getWorkGroupActivity(this.taskDetails);
			//this.loader = false;
		}).catch((error: any) => {
			this.loader = false;
			this.IsError = true;
			this.message = error.error.message;
			setTimeout(() => {
				this.IsError = false;
			}, 5000);
			// this.snackBar.open("Error loading Task Details..", "Okay", {
			// 	duration: 15000,
			// });
		});
	}
	remove(fruit, idx, workgroupList): void {
		let dialogRef = this.dialog.open(ConfDialogComponent, {
			disableClose: true, data: {
				message: "Are you sure?",
				okText: "Yes",
				cancelText: "No"
			}
		});
		dialogRef.afterClosed().subscribe(resultl => {
			if (!resultl) {
				//const index = this.taskDetails.assignedWorkGroups.indexOf(fruit);
				if (idx >= 0) {
					workgroupList.splice(idx, 1);
				}
			}
		});
	}

	getWorkGroupActivity(taskDetails) {
		this.loader = false;
		/* this.taskService.getUserorWorkgroupactivity(taskDetails.id, 'ASSIGN WORKGROUP').toPromise().then((response: any) => {
			this.loader = false;
			this.taskDetails.assignedWorkGroupData = response;
			this.taskDetails.assignedWorkGroups = [];
			this.taskDetails.assignedWorkGroups.push(response[0].activityValue);
			this.options.active = response;
			//this.taskDetails.assignedWorkGroups = JSON.parse(this.taskDetails.assignedWorkGroups);
		}).catch((error: any) => {
			this.loader = false;
			this.IsError = true;
			this.message = error.error.message;
			setTimeout(() => {
				this.IsError = false;
			}, 7000);
		}); */
	}

	getParentTaskStatusHistory(taskDetails, history, box) {
		// box.loader = true;
		if (!history && box.header.label == 'Status') {
			box.loader = true;
			this.taskService.getStatusHistory(taskDetails.id).toPromise().then((response: any) => {
				this.loader = false;
				box.loader = false;
				this.parentTaskHistory = response || [];
			}).catch((error: any) => {
				this.loader = false;
				box.loader = false;
				this.IsError = true;
				this.message = error.error.message;
				setTimeout(() => {
					this.IsError = false;
				}, 7000);
			});
		}
		else if (!history && box.header.label == 'Assigned To') {
			box.loader = true;
			this.taskService.getUserorWorkgroupactivity(taskDetails.id, 'ASSIGN USER').toPromise().then((response: any) => {
				this.loader = false;
				box.loader = false;
				this.parentTaskAssignLog = response || [];
			}).catch((error: any) => {
				this.loader = false;
				box.loader = false;
				this.IsError = true;
				this.message = error.error.message;
				setTimeout(() => {
					this.IsError = false;
				}, 7000);
			});
		}
		else if (!history && box.header.label == 'Duration') {
			box.loader = true;
			this.taskService.getStatusHistory(taskDetails.id).toPromise().then((response: any) => {
				this.loader = false;
				box.loader = false;
				this.timelineHistory = response || [];
				this.timelineHistory = this.timelineHistory.reverse();
			}).catch((error: any) => {
				this.loader = false;
				box.loader = false;
				this.IsError = true;
				this.message = error.error.message;
				setTimeout(() => {
					this.IsError = false;
				}, 7000);
			});
		}
	}

	expandAddRow(data, index) {
		let taskelement = {
			...data,
			isRowDetailOpen: true,
			isSelected: false,
			isStatusEditing: false,
			isIconMinus: false,
			isLoader: true
		};
		//AP_SEP_09_10_2019_P2 204
		//AP_SEP_09_10_2019_P1


		let openedTask = this.tableData[index + 1];
		
		if (data.isIconMinus) {
			this.subLoader = true;
			data.isIconMinus = false;
			this.taskService.getTask(data.id, data.sourceSystemName).toPromise().then((response: any) => {
				if (!this.tableData[index].isIconMinus) {
					this.ChildData = response;
					let retryObj: any = response['taskType'].params.filter((x) => x.name.toLowerCase() == 'retry');
					console.log("response['taskType'].params", response['taskType'].params);
					console.log("retryObj", retryObj);
					const RETRYData = retryObj.length > 0 ? JSON.parse(retryObj[0].value) : [];
					console.log(RETRYData);
					//const RETRYData = JSON.parse("[{\"code\":\"204\", \"enabled\":\"Y\"},{\"code\":\"4XX\", \"enabled\":\"Y\"},{\"code\":\"5XX\", \"enabled\":\"Y\"}]");
					const RETRY204Data = RETRYData.filter((x) => (x.code).toUpperCase() == '204');
					const RETRY4xxData = RETRYData.filter(x => x.code.startsWith('4'));
					const RETRY5xxData = RETRYData.filter((x) => x.code.startsWith('5'));
					let retryRequestURLObj: any = response['taskInstParamRequests'].filter((x) => x.name == 'retryRequestURL');
					const retryRequestURLData = retryRequestURLObj.length > 0 ? retryRequestURLObj[0] : {};
					const userDetails = JSON.parse(localStorage.getItem('fd_user'));
					const authorizations = userDetails && userDetails.authorizations ? userDetails.authorizations : [];
					let buttonPermissions = authorizations.filter(authPermission => authPermission.startsWith('Button'));
					let retryEditButton = true;
					console.log(RETRY204Data, RETRY4xxData, RETRY5xxData);
					if (retryRequestURLData.value) {
						if (((RETRY204Data.length > 0 && RETRY204Data[0].enabled == 'Y') ||
							(RETRY4xxData.length > 0 && RETRY4xxData[0].enabled == 'Y') ||
							(RETRY5xxData.length > 0 && RETRY5xxData[0].enabled == 'Y')) &&
							retryRequestURLData.value != '' && buttonPermissions.indexOf('Button_Edit&Retry') != -1) {
							retryEditButton = false;
						}

					}
					// if(){}
					let element = {
						...response,
						isRowDetailOpen: true,
						isSelected: false,
						isStatusEditing: false,
						isIconMinus: false,
						isLoader: false,
						RetryEditButton: retryEditButton
					};
					// if (index == 9) {
					// 	this.tableData.push(element);
					// } else {
					// 	this.tableData.splice(index + 1, 1);
					// 	this.tableData.splice(index + 1, 0, element);
					// }

					this.tableData.splice(index + 1, 1);
					this.tableData.splice(index + 1, 0, element);
				}

				this.subLoader = false;
			}).catch((error: any) => {
				console.log(error);
				this.subLoader = false;
				this.loader = false;
				this.IsError = true;
				this.message = error.error.message;
				setTimeout(() => {
					this.IsError = false;
				}, 7000);
			});

			// if (index == 9) {
			// 	this.tableData.push(taskelement);
			// } else {
			// 	this.tableData.splice(index + 1, 0, taskelement);
			// }

			this.tableData.splice(index + 1, 0, taskelement);

		} else {
			data.isIconMinus = true;
			this.tableData.splice(index + 1, 1);
		}
	}

	editAndRetry(taskDetails){
		taskDetails.isEditing=true;
		taskDetails.OriginalData = JSON.parse(JSON.stringify(taskDetails));
	}

	cancelRetry(taskDetails){
		taskDetails.taskSectionModels = JSON.parse(JSON.stringify(taskDetails.OriginalData.taskSectionModels));
		setTimeout(() => {
			taskDetails.isEditing=false;
		}, 500);
	}

	openTskDtls(rowData) {
		const tab: Tab = new Tab(TaskDetailsComponent, 'Task : ' + rowData['sourceTaskId'], 'TaskDetailsComponent', rowData);
		this.tabService.openTab(tab);
	}
openTskDtlsForId(id) {
		this.loader=true;
		this.taskService.getTask(id, "SAO").
			toPromise().then((response: any) => {
				
				const tab: Tab = new Tab(TaskDetailsComponent, 'Task : ' + id, 'TaskDetailsComponent', response);
				this.tabService.openTab(tab);
				this.loader=false;
			});
		
	}
	nextTasks() {
		//this.loader = true;


		this.currentPageLimit = 100;
		this.pagination.pageSize = 100;
		this.pagination.pageNumber = this.pagination.pageNumber + 1;
		let tempArray = [];
		this.logData.map((item) => {
			tempArray.push(item);
		});

		this.displayTaskResult = tempArray.splice((this.pagination.pageNumber - 1) * this.currentPageLimit, this.currentPageLimit);
		this.currentPageNumber = this.pagination.pageNumber;
		let pageCount = this.logData.length % this.currentPageLimit == 0 ? this.logData.length / this.currentPageLimit :
			this.logData.length / this.currentPageLimit + 1;
		this.pagination.currentPageNumber = 1;
		this.pagination.totalRecords = this.logData.length;
		let pageset = [];
		for (let j = 1; j <= pageCount; j++) {
			let page = this.makePage(j, j.toString(), j === 1);
			pageset.push(page);
			if (j == pageCount) {
				this.convertNumberToArray(pageset);
			}
		}
	}

	previousTasks() {
		//this.loader = true;
		this.previousDisable = false;
		this.nextDisable = false;

		let previousPage = this.pagination.pageNumber - 1;
		if (previousPage == 1) {
			this.previousDisable = true;
		}
		this.pagination.pageNumber = previousPage;
		this.onPaginateInnerGrid(1);
	}

	getStatusHistory(rowData) {
		//SME_1800477888
		//SME_Test_7112019
		// SDW392844SHW_C05
		//SDW392844SHW_C18
		//SDW392844SHW_C15
		//1560811517731
		//SDW392TR53-C10_26
		this.subLoader = true;
		this.taskService.getStatusHistory(rowData.id).toPromise().then((response: any) => {
			this.childHistoryList = response || [];
			this.subLoader = false;
		}).catch((error: any) => {
			this.subLoader = false;
			this.loader = false;
			this.IsError = true;
			this.message = error.error.message;
			setTimeout(() => {
				this.IsError = false;
			}, 7000);
		});
	}

	getGrandChildList(childDetails) {
		let requestData: any = {
			"parentTaskId": childDetails.id,
		}
		// this.chartjsData.sourceData = [];
		this.loader = true;
		this.taskService.searchTaskParentChild(requestData).toPromise().then((response: any) => {
			this.grandChildList = response.taskResults || [];
			this.grandChildList.forEach((tableRow: any, i) => {
				tableRow.seq = i + 1;
				tableRow.isRowDetailOpen = false;
				tableRow.isIconMinus = true;
				tableRow.totalCounts = tableRow.childStatusCounts.totalCounts;
			});
			this.loader = false;
		}).catch((error: any) => {
			this.loader = false;
			this.IsError = true;
			this.message = error.error.message;
			setTimeout(() => {
				this.IsError = false;
			}, 5000);
			// this.snackBar.open("Error loading Task Details..", "Okay", {
			// 	duration: 15000,
			// });
		});
	}

	ButtonClick(fieldName) {
		switch (fieldName) {
			case 'add_comment':
				this.UserAddComment();
				break;
			case 'assign_user':
				this.AssignUserDialog();
				break;
			default:
				break;
		}
	}

	UserAddComment() {
		const dialogRef = this.dialog.open(SmetaskAddCommentDialogComponent, {
			data: {
				id: this.processData.id,
				createdById: this.processData.createdById
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.loader = true;
				this.taskService.TaskNotes(result).toPromise().then((response: any) => {
					this.message = response.message;
					this.IsSucess = true;
					this.loader = false;
					this.getTaskDetails(false, false);
					setTimeout(() => {
						this.IsSucess = false;
					}, 5000);
					// this.snackBar.open(response.message, "Okay", {
					//   duration: 15000,
					// });
				}).catch((error: any) => {
					this.loader = false;
					this.IsError = true;
					this.message = error.error.message;
					setTimeout(() => {
						this.IsError = false;
					}, 5000);
				});
			}
		});
	}

	AssignUserDialog() {
		const dialogRef = this.dialog.open(SmeTaskAssignComponent, {
			data: {
				id: this.processData.id
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			if (isObject(result)) {
				this.loader = true;
				this.taskService.SMETaskAction(result, this.processData.id).toPromise().then((res: any) => {
					this.message = res.message;
					this.IsSucess = true;
					setTimeout(() => {
						this.IsSucess = false;
					}, 5000);
					this.getTaskDetails(false, false);
					this.loader = false;
					// this.snackBar.open(res.message, "Okay", {
					// 	duration: 15000,
					// });
				}, (errorRes: any) => {
					this.IsError = true;
					this.message = errorRes.error.message;
					this.loader = false;
					setTimeout(() => {
						this.IsError = false;
					}, 5000);
					// this.snackBar.open(errorRes.error.message, "Okay", {
					// 	duration: 15000,
					// });
				}).catch((errorObj: any) => {
					this.loader = false;
				});;
			}
		});
	}

	public OpenFullDiv(Data) {
		this.IsOpenFullDiv = true;
		this.OpenFullDivData = Data;
	}

	public RestoreDiv() {
		this.IsOpenFullDiv = false;
	}

	ForceComplete(ID) {
		this.loader = true;
		const result = {
            "action": "Complete",
			"taskId": this.taskDetails.id
		};
		this.taskService.SMETaskAction(result, ID).toPromise().then((response: any) => {
			this.message = response.message;
			this.IsSucess = true;
			this.loader = false;
			this.getTaskDetails(false, false);
			setTimeout(() => {
				this.IsSucess = false;
			}, 5000);
		}).catch((error: any) => {
			this.loader = false;
			this.IsError = true;
			this.message = error.error.message;
			setTimeout(() => {
				this.IsError = false;
			}, 5000);
		});
	}

	handler(type, data) {
	}

	PopupsubmitButtonDisabled() {
		// ((showRerouteSection || showTransferSection) ? (transferTo != '' && comment != '') ? false : true : ((showReturnTaskToWorkgroupSec && comment != '')? false: ((showCloseSection || showCancelSection) ? false: true) ))
		if (this.showTransferSection) {
			return (this.transferTo != '' && this.comment != '') ? false : true;
		} else if (this.showReturnTaskToWorkgroupSec && this.comment != '') {
			return false;
		} else if (this.showCancelSection) {
			return false;
		} else if (this.showCloseSection) {
			if (this.RCMACTask) {
				if (this.closePopupObj.backtime) {
					if (this.closePopupObj.TroubleFound != '' && this.closePopupObj.customerContacted != '' && this.closePopupObj.comment != '' && this.closePopupObj.fl2 != '' &&
						this.closePopupObj.fl3 != '' && this.closePopupObj.closeOutDateTime != '' && this.closePopupObj.timezone != '') {
						return false;
					} else {
						return true;
					}
				} else {
					if (this.closePopupObj.TroubleFound != '' && this.closePopupObj.customerContacted != '' && this.closePopupObj.comment != '' && this.closePopupObj.fl2 != '' && this.closePopupObj.fl3 != '') {
						return false;
					} else {
						return true;
					}
				}
			} else {
				if (this.closePopupObj.backtime) {
					if (this.closePopupObj.parentDispositionCode != '' && this.closePopupObj.childDispositionCode != '' && this.closePopupObj.grandChildDispositionCode != '' &&
						this.closePopupObj.parentCauseCode != '' && this.closePopupObj.childCauseCode != '' && this.closePopupObj.grandChildCauseCode != '' && this.closePopupObj.customerContacted != '' &&
						this.closePopupObj.comment != '' && this.closePopupObj.fl2 != '' && this.closePopupObj.fl3 != '' && this.closePopupObj.closeOutDateTime != '' && this.closePopupObj.timezone != '') {
						return false;
					} else {
						return true;
					}
				} else {
					if (this.closePopupObj.parentDispositionCode != '' && this.closePopupObj.childDispositionCode != '' && this.closePopupObj.grandChildDispositionCode != '' &&
						this.closePopupObj.parentCauseCode != '' && this.closePopupObj.childCauseCode != '' && this.closePopupObj.grandChildCauseCode != '' && this.closePopupObj.customerContacted != '' &&
						this.closePopupObj.comment != '' && this.closePopupObj.fl2 != '' && this.closePopupObj.fl3 != '') {
						return false;
					} else {
						return true;
					}
				}
			}

		} else if (this.showRerouteSection) {
			return (this.transferTo != '' && this.comment != '' && this.RerouteResultvalue != '') ? false : true;
		} else if (this.showForceCloseSection) {
			return false;
		}

		else {
			return true;
		}
	}

	getDueDate(data) {
		if (data && data[0] && data[0].taskSectionModels) {
			for (let index = 0; index < data[0].taskSectionModels.length; index++) {
				const element = data[0].taskSectionModels[index];
				if (element.header == "Customer Order" && element.paramList) {
					for (let index = 0; index < element.paramList.length; index++) {
						const prmDetails = element.paramList[index];
						if (prmDetails.name == "dueDate") {
							return prmDetails.value ? prmDetails.value : '';
						}
					}
				}
			}
		}
	}

	OpenDuaDateDialog() {
		this.data && this.data[0] ? localStorage.setItem('taskName', this.data[0].taskName) : '';
		let dueDate: any = this.getDueDate(this.data);
		const dialogRef = this.dialog.open(SprtaskdialogComponent, {
			data: { sourceTaskId: this.data.sourceTaskId, dueDate: dueDate }
		});

		dialogRef.afterClosed().subscribe(result => {
			if (isObject(result)) {
				this.loader = true;
				this.taskService.updateSprDueTask(this.taskDetails.id, 2, result.date, result.reason).toPromise().then((res: any) => {

					this.message = res.message;
					if (res.code === '200') {
						this.getTaskDetails(false, false);
						this.IsSucess = true;
						this.loader = false;
						setTimeout(() => {
							this.IsSucess = false;
						}, 5000);
					} else {
						this.IsError = true;
						this.loader = false;
						setTimeout(() => {
							this.IsError = false;
						}, 5000);
					}
				}, (errorRes: any) => {
					this.message = errorRes.error.message;
					this.IsError = true;
					this.loader = false;
					setTimeout(() => {
						this.IsError = false;
					}, 5000);
				});
			}
		});
	}

	OpenCancelDialog() {
		const dialogRef = this.dialog.open(SprtaskcanceldialogComponent, this.data.sourceTaskId);

		dialogRef.afterClosed().subscribe(result => {
			if (isObject(result)) {
				this.loader = true;
				this.taskService.updateSprDueTask(this.taskDetails.id, 1, '', result.reason).toPromise().then((res: any) => {
					this.message = res.message;
					if (res.code === '200') {
						this.loader = false;
						this.getTaskDetails(false, false);
						this.IsSucess = true;
						setTimeout(() => {
							this.IsSucess = false;
						}, 5000);
					} else {
						this.IsError = true;
						this.loader = false;
						setTimeout(() => {
							this.IsError = false;
						}, 5000);
					}

				}, (errorRes: any) => {
					this.message = errorRes.error.message;
					this.IsError = true;
					this.loader = false;
					setTimeout(() => {
						this.IsError = false;
					}, 5000);
				});
			}
		});
	}

	SaveTaskNotes() {
		this.loaderLmosTaskPopup = true;
		let userData: any = JSON.parse(localStorage.getItem("fd_user"));
		const obj = {
			"notes": this.taskDetails.notes,
			"createdById": userData.cuid
		};
		this.savingNotes = true;
		this.taskService.Savetasknotes(obj, this.taskDetails.id).toPromise().then((res: any) => {
			this.message = res.message;
			this.IsSucess = true;
			setTimeout(() => {
				this.IsSucess = false;
			}, 7000);
			this.getTaskDetails(false, false);
			this.loaderLmosTaskPopup = false;
		}, (errorRes: any) => {
			this.IsError = true;
			this.message = errorRes.error.message;
			this.loaderLmosTaskPopup = false;
			setTimeout(() => {
				this.IsError = false;
			}, 7000);
		}).catch((errorObj: any) => {
			this.IsError = true;
			this.message = errorObj.error.message;
			this.loaderLmosTaskPopup = false;
			setTimeout(() => {
				this.IsError = false;
			}, 7000);
		});
	}

	CheckValue(name) {
		if (name != '' && name != null) {
			return name.startsWith('predictor');
		} else {
			return true;
		}
	}

	showAdditionalDetails(event, taskDetails) {
		let task: any = taskDetails.id;
		let log: any = event.data.id;
		let url: any = '/Enterprise/v2/Work/task/' + task + '/activityLog/' + log + '/additionalDetails'
		this.taskService.getAddionalDetails(url).toPromise().then((Logresp: any) => {

			let details: any = "";
			// var parser, xmlDoc;
			if (Logresp) {
				details = Logresp;
				// parser = new DOMParser();
				// xmlDoc = parser.parseFromString(details,"text/xml");
			} else {
				details = "No Additional Details.";
			}
			let dialogRef = this.dialog.open(ConfDialogComponent, {
				disableClose: false, data: {
					message: details,
					okText: "Close"
				}
			});

		}).catch((errorObj: any) => {
		});
	}

	getParentTask(parentId: any) {
		let url: any = '/Enterprise/v2/Work/task/' + parentId + '?include=aa,tsm,c,p,wg';
		//console.log("parentId< == >", parentId);
		this.taskService.getParentDetails(url).toPromise().then((Logresp: any) => {
			//console.log("parent Details resp< == >", Logresp);
			this.parentTask = Logresp;
			//console.log("parent task table data < == >", this.parentTask)
		}).catch((errorObj: any) => {

		});
	}
	getParentTaskProcessData() {		
		this.taskService.getTask(this.processData.parentTaskInstId, '').toPromise().then((parentTaskRes: any) => {
			this.processData = parentTaskRes;
			this.getTaskDetails(false, false);
			this.loadBlockingReasons();	 
		}).catch((errorObj: any) => {
			console.log("Error while getting parent task deatils : " + this.processData.parentTaskInstId);
		});
	}
	public listData=["Dispatch Areas","Blocking Category/Reasons"]	
	systemParmaChild = {};
	
	async listOfvaluesChildDeatails() {
		for (let i = 0; i < this.listData.length; i++) {
			await this.taskService.getListofValueChildData(this.listData[i]).toPromise().then((data) => {
				this.completeData = data
				//console.log(this.convertObjecttoArray(data));
				if (this.listData[i] == 'Blocking Category/Reasons') {
					this.arrayOfCategory = this.completeData;
					for (var key in this.arrayOfCategory) {
						if (this.arrayOfCategory.hasOwnProperty(key)) {
							this.blockingCategory.push(key);
							for (var key in this.arrayOfCategory[key]) {
								this.blockingReasons.push(key);
							}
						}
					}
				}
				else {
					this.systemParmaChild[this.listData[i]] = this.convertObjecttoArray(this.completeData);
				}



			}).catch(err => {
				console.log(err)
			});


		}



	}
		//get nested junk object to array
	convertObjecttoArray(data) {
		let dataSample = Object.keys(data);
		let samplearrayOne = []
		dataSample.forEach(element => {
			samplearrayOne.push(Object.keys(data[element]));
		});
		let sampleArrayTwo = [];
		samplearrayOne.forEach(x => {
			for (let i = 0; i < x.length; i++) {
				sampleArrayTwo.push(x[i])
			}
		});
		return dataSample.concat(sampleArrayTwo);
	}
	 loadBlockingReasons(){	

		if (this.processData && this.processData.sourceSystemId == '688' ) {

			// this.arrayOfCategory = {
			// 	"Order": {},
			// 	"Work Assignment": {},
			// 	"Customer": {
			// 		"Cost Variance Approval": [],
			// 		"Date change": [],
			// 		"Customer UnReachable": []
			// 	},
			// 	"Network": {},
			// 	"Level 3 LEC/vendor": {},
			// 	"Field Ops Codes": {
			// 		"GFSCSTMRAC: Delay Customer Access": []
			// 	},
			// 	"Service": {},
			// 	"Cancelled": {
			// 		"Job Cancelled at Prem": []
			// 	},
			// 	"Systems": {}
			// }
			
			// for (var key in this.arrayOfCategory) {
			// 	if (this.arrayOfCategory.hasOwnProperty(key)) {
			// 		this.blockingCategory.push(key);
			// 		for (var key in this.arrayOfCategory[key]) {
			// 			this.blockingReasons.push(key);
			// 		}
			// 	}
			// }
		}
	}

	ShowRetryMessage(data) {
		this.message = data.message;
		if (data.status) {
			this.IsSucess = true;
			setTimeout(() => {
				this.IsSucess = false;
			}, 7000);
		} else {
			this.IsError = true;
			setTimeout(() => {
				this.IsError = false;
			}, 7000);
		}
	}

	logDetailData: boolean= false;
	taskDepandencyData: boolean = false;
	globalNoteData: boolean = false;
	selectTab(tab: string) {
		switch (tab) {
			case "request-details":
				this.leftSideTabs.tab = tab;
				break;
			case "log-details":
				//this.showLogs = false;
				this.leftSideTabs.tab = tab;
				if(!this.logDetailData){
					this.getPageLayoutTemplateForLogDetailsAndInit();
				}
				
				// setTimeout(() => {
				// 	this.showLogs = true;
				// }, 5000);
				break;
			case "task-dependencies":
				this.leftSideTabs.tab = tab;
					if(!this.taskDepandencyData){
						this.getTaskDependencyPageLayoutTemplate();
					}
					
				
				break;
			case "global-notes":
					this.leftSideTabs.tab = tab;
					if(!this.globalNoteData){
						if(this.processData && this.processData.sourceSystemId == '688'){
							this.searchGlobalNotes(this.processData.id,null);
							}
					}
					break;
			default:
				this.leftSideTabs.tab = tab;
				break;
		}
	}


	showLogs: boolean = true;

	onRefreshLogs() {
		this.loader = true;
		this.LogDetailsParameter.tableData = [];
		this.showLogs = false;
		this.taskService.getActivityLogForTask('/Enterprise/v2/Work/task/' + this.currentTaskId + '/activityLog?include=a').toPromise().then((Logresp: any) => {
			//this.taskService.callGetUrl('/Enterprise/v2/Work/task/' + response.id + '/activityLog').toPromise().then((Logresp: any) => {
			//this.loader = false;
			this.logData = Logresp;
			this.logDetails = Logresp;
			for (let index = 0; index < this.logData.length; index++) {
				this.logData[index]['activityDetails'] = this.logData[index]['activityDetails'].replace('/n', '\n');
				this.logData[index]['createdDateTime'] = this.dateConvertor.LocalDate(this.logData[index]['createdDateTime']);
			}
			this.LogDetailsParameter.tableData = Logresp;
			// let userData: any = JSON.parse(localStorage.getItem("fd_user"));
			// this.LogDetailsParameter.tableData.forEach(element => {
			// 	element.createdById = userData.cuid;
			// });
			this.pagination.totalRecords = Logresp.length;
			this.pagination.pageSize = 10;
			this.pagination.pageNumber = 0;
			this.pagination.allItems = this.pagination.allItems.concat(this.logData);
			let pageCount = this.logData.length % this.currentPageLimit == 0 ? this.logData.length / this.currentPageLimit :
				this.logData.length / this.currentPageLimit + 1;
			this.totalPageData = this.logData.length;
			this.totalPage = Math.ceil(this.logData.length / this.currentPageLimit);
			this.pagination.totalPage = this.totalPage;
			/* let pageset = [];
			for (let j = 1; j <= pageCount; j++) {
				let page = this.makePage(j, j.toString(), j === 1);
				pageset.push(page);
				if (j == pageCount) {
					this.convertNumberToArray(pageset);
				}
			}
			this.onPaginateInnerGrid(1);*/

			setTimeout(() => {
				this.showLogs = true;
				this.loader = false;
			}, 1000);
		}).catch((errorObj: any) => {
			this.loader = false;
		});
	}
	
	onSaveClick(data) {
		if(data.from === 'globalNotes') {
			
		var pagedItems = data.pagedItems;
		var rowIndex = data.rowIndex;
		var sysParam = pagedItems[rowIndex];
		sysParam['CreatedBy'] = this.userInfo.fullName+"("+this.userInfo.cuid+")";
		sysParam['ModifiedBy'] = this.userInfo.cuid;
		this.setGlobalNoteRequestobj(sysParam);
		// create global note
		this.loader = true;
		this.taskService.createGlobalNote(this.taskDetails.id, this.note)
			.toPromise().then((response: any) => {
			if(response.IsSuccess){
				this.loader=false;
				this.IsSucess = true;
				pagedItems.splice(rowIndex, 1,sysParam);
				//this.paginationglobal.allItems.push(sysParam); // Was adding the record at last 
				this.paginationglobal.allItems.splice(rowIndex,0,sysParam)
				this.paginationglobal.totalRecords = this.paginationglobal.allItems.length;
				this.tableComponent.setPage(this.tableComponent.pager.currentPage);
				setTimeout(() => {
					this.IsSucess = false;
				}, 2000);
			}
		}).catch(error => {
			this.tableComponent.setPage(this.tableComponent.pager.currentPage);
			this.loader = false;
			this.IsError=true;
		});

		} else {
		let pagedItems = data.pagedItems;
		let rowIndex = data.rowIndex;
		let taskInstanceParamValue = pagedItems[rowIndex];
		let taskInstanceParam : any;
		try{
			taskInstanceParam = JSON.parse(taskInstanceParamValue['obj']);
		}catch(e){
			taskInstanceParam = taskInstanceParamValue['obj'];
		}
		taskInstanceParamValue['id']= undefined;
		taskInstanceParamValue['obj'] = undefined;
		if (taskInstanceParamValue['new']) {
			
			taskInstanceParam['name'] = pagedItems.length+1;
		}
		
		taskInstanceParamValue['new'] = undefined;
		taskInstanceParamValue['rowEdit'] = undefined;
		taskInstanceParam['value'] = JSON.stringify(taskInstanceParamValue);
		// update
		taskInstanceParam['modifiedById'] = this.userInfo.cuid;
		this.loader = true;
		this.showFacility = false;
		
		this.taskService.createOrUpdateTaskInstanceParam(this.currentTaskId,taskInstanceParam).toPromise().then(response =>{
			this.loader=false;
			this.IsSucess = true;
			this.message = response['message'];
			setTimeout(() => {
						this.IsSucess = false;
			}, 2000);
			
			pagedItems[rowIndex]['id']=taskInstanceParam['name'];
			this.tableDetailTableSection[taskInstanceParam['header']]['tableData'].push(pagedItems[rowIndex]);
			pagedItems[rowIndex]['rowEdit'] = false;
			this.showFacility=true;
			if(taskInstanceParam['header'] == 'Facilities'){
				this.getTaskDetails(true,false);
			}
			// this.tableComponent.updateItemInAllItems(pagedItems[rowIndex]);
			
		}).catch((errorObj: any) => {
			this.loader = false;
			this.IsError=true;
			this.message=errorObj.error.message;
			// this.loaderLmosTaskPopup = false;
		});
	}
		
	}

	addNewRow(event) {
		if(event.from === 'globalNotes'){
			event.pagedItems.unshift({
				Note: '', NoteType: "Application", Source: "Flight Deck", Action: "Create", CreatedBy: this.userInfo.fullName+"("+this.userInfo.cuid+")", ModifiedBy: this.userInfo.cuid, CreatedDate: this.dateConvertor.LocalDate(new Date().toUTCString()), ModifiedDate: this.dateConvertor.LocalDate(new Date().toUTCString()), rowEdit: true
			});
		} else {
		
		if(event.pagedItems.length>0){
		let tip =event.pagedItems[event.pagedItems.length-1];
		let keys :any = Object.keys(tip);
		let newRow ={rowEdit : true,new:true , obj :tip['obj'] };
		for(let key of keys){
			if(key != 'obj' && key != 'new' && key != 'rowEdit')
			newRow[key]='';
		}
		event.pagedItems.unshift(newRow);
	}
	}
	}

	onRefreshTD(){
		this.loader=true;
			
		setTimeout(() => {
			this.loader = false;
		}, 1000);
	}

	openDetailViewTD(element: any) {
		console.log("openDetailViewTD element:", element);
		element.task.id = element.task.taskId;
        const tab: Tab = new Tab(TaskDetailsComponent, 'Task : ' + element.task['sourceTaskId'], 'TaskDetailsComponent', element.task);
        this.tabService.openTab(tab);
    };

	onDeleteClick(data) {
		this.modalDetails = { ...this.modalDetails, isDeleteConfirm: true, 
			title: "Confirm", className: "deletemodal", 
			subTitle: "Are you sure that you want to delete the Task Instance Parameter?", 
			from: "deletetaskinstanceparameter", data: data};
        this.modalChild.showModal();
	}
	
	async getTaskDependencyPageLayoutTemplate(){
		this.loader = true;
		var url = '/PageLayoutTemplate/Get/tblTask_Dependency';
				this.taskService.callGetUrl(url).toPromise().then((res) => {
					this.dependencyPageLayout = res;
			var response: any = res;
			
			
            this.actionButtonDependency = response.pageLayoutTemplate[2].fieldsList;
            this.sectionheaderDependency = response.pageLayoutTemplate[0].sectionHeader;
            this.actionColumnDependency = response.pageLayoutTemplate[0].fieldsList;
            this.filter = [];

			
			this.paginationPredecessorInstances = Object.create(response.pageLayoutTemplate[1].fieldsList[0]);
            this.paginationPredecessorInstances.selectedLimit = this.paginationPredecessorInstances.pageLimitOptions[0];
            this.paginationPredecessorInstances.pageNumber = 0;
            this.paginationPredecessorInstances.pageSize = 10;
            this.paginationPredecessorInstances.maxPageLimit = 10;
            this.currentPageNumber = 1;
            this.paginationPredecessorInstances.currentPageNumber = 1;
            this.paginationPredecessorInstances.totalRecords = 0;
			this.paginationPredecessorInstances.pager = {startIndex: 0, endIndex:  this.paginationPredecessorInstances.selectedLimit - 1}
			this.paginationPredecessorInstances.allItems = [];
			
			this.paginationPredecessorInstances.allItems = this.predTaskInstances;
			this.paginationPredecessorInstances.totalRecords = this.paginationPredecessorInstances.allItems.length;

			this.DependencyParameterPredecessor = {
				...this.DependencyParameterPredecessor,
				editable: false,
                sectionheader: this.sectionheaderDependency,
                header: this.actionColumnDependency,
                tableData: []
			}

			this.paginationSuccessorInstances = Object.create(response.pageLayoutTemplate[1].fieldsList[0]);
			this.paginationSuccessorInstances.selectedLimit = this.paginationSuccessorInstances.pageLimitOptions[0];
            this.paginationSuccessorInstances.pageNumber = 0;
            this.paginationSuccessorInstances.pageSize = 10;
            this.paginationSuccessorInstances.maxPageLimit = 10;
            this.currentPageNumber = 1;
            this.paginationSuccessorInstances.currentPageNumber = 1;
            this.paginationSuccessorInstances.totalRecords = 0;
			this.paginationSuccessorInstances.pager = {startIndex: 0, endIndex:  this.paginationSuccessorInstances.selectedLimit - 1}
			this.paginationSuccessorInstances.allItems = [];
			
			this.paginationSuccessorInstances.allItems = this.succTaskInstances;
			this.paginationSuccessorInstances.totalRecords = this.paginationSuccessorInstances.allItems.length;

			
			
			
			this.DependencyParameterSuccessor = {
				...this.DependencyParameterSuccessor,
				editable: false,
                sectionheader: this.sectionheaderDependency,
                header: this.actionColumnDependency,
                tableData: []
			}
		this.loader = false;
		this.taskDepandencyData = true;
		}).catch((errorObj: any) => {
			this.loader = false;
		});
	}
	
	openchildtask(element) {
		const tab: Tab = new Tab(TaskDetailsComponent, 'Task : ' + element['sourceTaskId'], 'TaskDetailsComponent', element);
        this.tabService.openTab(tab);
	}

	GetRetryServices () {
		console.log(this.taskDetails);
		this.loaderLmosTaskPopup = true;
		let userData: any = JSON.parse(localStorage.getItem("fd_user"));
		const Payload = {
		  "action": "Retry",
		  "paramRequests": [],
		  "taskId": this.taskDetails['id'],
		  "modifiedById": userData.cuid
		};
	
		this.taskDetails['taskSectionModels'].forEach(element => {
		  if (element.header == 'AdditionalMicroserviceDetailsList') {
			const AdditionData = element.paramList.filter((x) => x.name == 'retryRequestURL');
			Payload.paramRequests.push({ header: AdditionData[0].header, name: AdditionData[0].name, value: AdditionData[0].value });
		  } else {
			element.paramList.forEach(data => {
			  Payload.paramRequests.push({ header: data.header, name: data.name, value: data.value });
			});
		  }
		});
	
		console.log("Payload", Payload);
		this.taskService.RetryServiceData(Payload).toPromise().then((res: any) => {
		  this.loaderLmosTaskPopup = false;
		  if (res.code == '200') {
			// this.rowData = this.rowData.OriginalData;
			this.taskDetails.isEditing = false;
			this.ShowRetryMessage({status: true, message: res.message});
		  } else {
			this.ShowRetryMessage({status: true, message: res.message});
		  }
		  
		}).catch((error) => {
		  this.loaderLmosTaskPopup = false;
		  console.log(error);
		  this.taskDetails.taskSectionModels = this.taskDetails.OriginalData.taskSectionModels;
		  this.taskDetails.isEditing = false;
		  this.ShowRetryMessage({status: false, message: error.error.message});
		});
	}
	// Added for GETCWM-12761
	getWorkgroupResources() {
		let workgroupcuidList = [];
		this.modalDetails.errorMessage = '';		
		if (this.taskDetails['workgroupList'].length > 0) {
			for (let WordgroupIndex = 0; WordgroupIndex < this.taskDetails['workgroupList'].length; WordgroupIndex++) {
				  this.taskService.GetTransferWorkGroupId(this.taskDetails['workgroupList'][WordgroupIndex]['workgroupId']).toPromise().then(async (response: any) => {	
					if (response && response.length > 0) {
						response.forEach((resource: any) => {
							if (!workgroupcuidList.find((x) => x.cuid == resource.cuid)) {
								workgroupcuidList.push({cuid: resource.cuid,
									fullName: resource.fullName					
								});
							}							
						})
						this.modalDetails.errorMessage = '';
					}
					else{
						this.prepareErrorMessage(workgroupcuidList);
					}					
					workgroupcuidList = workgroupcuidList.sort((a, b) => a.fullName > b.fullName ? 1 : -1);										
				}).catch(errorObj => {								
					this.prepareErrorMessage(workgroupcuidList);				
				});
			}			
		} 
		else{
			this.modalDetails.errorMessage = 'No workgroup assigned.';	
			this.modalDetails.infoMessage = 'Please assign a workgroup using Dispatch Function.';		
		}
		return workgroupcuidList;
	}
	prepareErrorMessage(workgroupcuidList) {
		if (this.modalDetails.errorMessage == "" && workgroupcuidList.length == 0) {
			let workgroupsList = [];
			this.taskDetails['workgroupList'].forEach(element => {
				workgroupsList.push(element['workgroupName']);
			});
			this.modalDetails.errorMessage = 'No resources/users in <b>'+ workgroupsList + '</b> workgroup(s).';
			this.modalDetails.infoMessage = 'Your Line Manager can add resources/users from Manage Workgroup.';	
		}
	}
}


@Component({
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
}
//
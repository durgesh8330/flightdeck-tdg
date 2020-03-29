import { AfterViewInit, ChangeDetectorRef, Component, OnChanges, OnInit, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator, MatSnackBar, MatSort, MatTableDataSource } from '@angular/material';
import { TabService } from '@app/core/tab/tab-service';
import { Tab } from '@app/core/tab/tab.model';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { DataStorageService } from './data-storage.service';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { TaskService } from './task.service';
import * as _ from 'lodash';
import { ModalComponent } from '@app/shared/modal/modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { combineLatest, Subscription } from 'rxjs';
import { UserProfileService } from '@app/features/user-profile/user-profile.service';


export abstract class MyAbstractTask implements OnInit, AfterViewInit, OnChanges, OnDestroy{
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(DatatableComponent) public table: DatatableComponent;
    @ViewChild(ModalComponent) modalChild: ModalComponent;
	@ViewChild(BsModalService) modal: BsModalService;

    loader: boolean = false;
    loaderTaskDetail = true;
    nextDisable: boolean = false;
    previousDisable: boolean = true;

    searchCriteria: any = {};
    errorMessage: string = null;

    showResultsTemp: boolean = false;
    tempTaskResult: any = [];
    taskResults: Array<TaskElement> = [];
    dataSource: MatTableDataSource<TaskElement>;

    isAllTaskSelected: boolean = false;
    selectedTaskResultCount: number = 0;

    pagination: any = {};
    totalPageData: number;
    totalPage = 0;
    tablePaginationData: any = [];
    displayTaskResult: Array<TaskElement> = [];
    currentPageNumber: number;

    filter = [];

    public currentPageLimit: number = 10;
    public maxPageLimit: number = 100;
    public readonly pageLimitOptions = [
        { value: 10 },
        { value: 20 },
        { value: 50 },
        { value: 100 }
    ];

    public pageLayout = {};
    header: any = {

    }
    //in grid pagination
    gridTotalRecord: number;
    isInnerPageNextEnabled: boolean;
    isInnerPagePreviousEnabled: boolean;
    displayTaskHeaders = [];
    activeSort = '';
    actionButton: any = [];
    sectionheader = '';
	actionColumn: any = [];
	defaultActionColumns: any = [];
    paginationLimitOption = 10;
    Newpagination: any = {};

    systemParameter: any = {};
    title: string = null;

    IsSuccess = false;
    message = '';
    IsError = false;
    IsWarning = false;

    selectedAction = "";
    resourcesList = [];
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
    blockingReasons = [];
    workgroupList = [];
    actionList: any = [
		{ value: "Select" },
		{ value: "Assign" },
		// { value: "Complete" }, Commented for GETCWM-13647 issue
		{ value: "Block" },
		{ value: "Accept" },
		{ value: "Cancel" },
		{ value: "UnBlock" },
		{ value: "Dispatch" }
    ];
    IsOpenPopup = false;
	modalRef: BsModalRef;
	subscriptions: Subscription[] = [];
	loaderLmosTaskPopup = false;
	transferTo = '';
	comment = '';
	RerouteResultvalue = '';
    closePopupObj: any = {};
    
    /**
	 * This method loads the Disposition codes and Cause codes from system parameter.
	 */
	dispositionCodes = [];
	dispositionChildCodes = [];
	dispositionGrandChildCodes = [];
	causeCodes = [];
	causeChildCodes = [];
	causeGrandChildCodes = [];
	dispositionCodesObjArr = [];
	dispositionCodesChildObjArr = [];
	causeCodesObjArr = [];
	causeCodesChildObjArr = [];
	blockingReasonsObjArr = [];
	fl3Values = ['CBR Good', 'CBR Bad', 'CBR Not Used'];
    
	showTransferSection: boolean = false;
	showRerouteSection: boolean = false;
	showCloseSection: boolean = false;
	showReturnTaskToWorkgroupSec = false;
	showCancelSection: boolean = false;
	showUnblockSection: boolean = false;
    showLmosRecoredSection: boolean = false;
	showSATable: boolean = true;
	
	GetAllReRouteWorkGroupsRes: any = [];

	public resourceListSubscription : Subscription;
	public workgroupListSubscription : Subscription;

    constructor(protected tabService: TabService, protected taskService: TaskService, protected snackBar: MatSnackBar, protected dataStorageService: DataStorageService, title: string, protected modalService: BsModalService, protected userProfileService: UserProfileService, public _ref: ChangeDetectorRef) {
		this.title = title;
		this.subscribeTab(); //To refresh the My Task tab even if it is opened before
		

		
		this.searchCriteria = dataStorageService.getSearchCriteria();
		this.title != "Task Details" ? this.getPageLayoutData('No Data Found for the provided criteria, Please try searching with valid data.') : '';

		switch (title) {
			case "My Tasks":
				this.subscribeResourceList();
				this.subscribeWorkgroupList();
				this.systemParameter = { from: 'mytasks', title: 'My Tasks', isSortAsc: false, globalSearch: '' };
				break;
			case "My Workgroup tasks":
				this.subscribeResourceList();
				this.subscribeWorkgroupList();
				this.systemParameter = { from: 'myworkgrouptasks', title: 'My Workgroup tasks', isSortAsc: false, globalSearch: '' };
				break;
			case "Task Results":
				//add to get the workgroups in the dialog drop down values
				this.subscribeResourceList();
				this.subscribeWorkgroupList();
				this.systemParameter = { from: 'taskresults', title: 'Task Results', isSortAsc: false, globalSearch: '' };
				this.dataSource = new MatTableDataSource<TaskElement>(this.dataStorageService.getData());
				break;
		}
	}
	
	//To refresh the My Task tab even if it is opened before
	subscribeTab(){
		this.taskService.test.subscribe((data)=>{
		  if(data){
			this.getPageLayoutData(data);
		  }
		});
	}

    getPageLayoutData(errorMessage: string) {
        this.errorMessage = errorMessage;
        this.loader = true;
        this.taskService.callGetUrl('/PageLayoutTemplate/Get/tblTask_SearchResults').toPromise().then((res) => {
            this.pageLayout = res;
            var response: any = res;
            this.pagination = response.pageLayoutTemplate[1].fieldsList[0];
            this.actionButton = response.pageLayoutTemplate[2].fieldsList;
            this.sectionheader = response.pageLayoutTemplate[0].sectionHeader;
			this.actionColumn = response.pageLayoutTemplate[0].fieldsList;
			this.defaultActionColumns = JSON.parse(JSON.stringify(response.pageLayoutTemplate[0].fieldsList));
            this.filter = [];

            this.loader = false;

            this.pagination.selectedLimit = this.pagination.pageLimitOptions[0];
            this.pagination.pageNumber = 0;
            this.pagination.pageSize = this.maxPageLimit;
            this.pagination.maxPageLimit = this.maxPageLimit;
            this.currentPageNumber = 1;
            this.pagination.currentPageNumber = 1;
            this.pagination.totalRecords = 0;
            this.pagination.allItems = [];
            this.pagination.pager = {startIndex: 0, endIndex:  this.pagination.selectedLimit - 1};
            this.systemParameter = {
                ...this.systemParameter,
                sectionheader: this.sectionheader,
                header: this.actionColumn,
                tableData: []
            }


            this.tempTaskResult = this.dataStorageService.getData();
            // for (let index = 0; index < this.tempTaskResult.length; index++) {
            //   this.tempTaskResult[index]['escalated'] = this.tempTaskResult[index]['escalated'].toString();
            // }
            this.pageLayout['pageLayoutTemplate'].forEach(element => {
                this.displayTaskHeaders = [];
                element.fieldsList.forEach(h => {
                    if (h.visible) {
                        this.displayTaskHeaders.push(h);
                        this.header[h.key] = '';
                    }
                });
            });

            let data = [];
            if (this.tempTaskResult.length > 0) {
                this.tempTaskResult.forEach(elem => {
                    let newObj = {};
                    this.displayTaskHeaders.forEach(h => {
                        if (elem && h.key && elem[h.key]) {
                            newObj[h.key] = elem[h.key];
                        } else {
                            newObj[h.key] = null;
                        }
                    });
                    data.push(newObj);
                });
            }

			const paginationData = this.dataStorageService.getPagination();
			
			if(this.dataStorageService.getWarningMessage()){
				this.message = this.dataStorageService.getWarningMessage();
				this.IsWarning = true;
			}
            this.searchCriteria = this.dataStorageService.getSearchCriteria();
            if (this.tempTaskResult.length > 0) {
                this.tempTaskResult.map((item, index) => {
                    item.isSelected = false;
                    item.taskId = 'T' + index;
                });
            }
            if (this.title === 'Task Results') {
                const paginationData = this.dataStorageService.getPagination();
                this.tempTaskResult = this.dataStorageService.getData();
                this.pagination.totalRecords = paginationData.totalRecords;
                this.pagination.allItems = this.tempTaskResult;
                this.pagination.pageSize = paginationData.pageSize;
                this.pagination.pageNumber = paginationData.pageNumber;
                this.setResults();
            } else {
				if(this.title!= "Task Details"){
					this.searchTask();
				}
            }
        });
    }

    searchTask() {
        this.isAllTaskSelected = false;
        this.selectedTaskResultCount = 0;
        this.searchCriteria.pagination = {
            "pageNumber": this.pagination.pageNumber,
            "pageSize": this.pagination.pageSize,
            "totalRecords": this.pagination.totalRecords
        };
        this.searchTaskDetails();
    }

    public searchTaskDetails() {		
		this.showSATable = false;
        this.taskService.advancedSearchV3Task(this.searchCriteria).toPromise().then((result: any) => {
            this.loader = false;
            this.loaderTaskDetail = false;
            
            if (result && result.taskResults) {
                this.showResultsTemp = true;
                result.taskResults.map((item, index) => {
                    item.isSelected = false;
                    item.taskId = 'T' + index;
				});
				
				if(result.warningMessge){
					this.message = result.warningMessge;
					this.IsWarning = true;
				}
                this.tempTaskResult = result.taskResults;
                this.pagination.totalRecords = result.pagination.totalRecords;
				this.pagination.allItems = this.pagination.allItems.concat(this.tempTaskResult);
                this.pagination.pageSize = result.pagination.pageSize;
                this.pagination.pageNumber = result.pagination.pageNumber;
				this.setResults();
				//this.refreshSATable();
				this.showSATable = true;
            } else {
                this.loaderTaskDetail = false;
                this.IsWarning = true;
                this.message = "No Data Found for the provided criteria, Please try searching with valid data.";
                setTimeout(() => {
                  this.IsWarning = false;
                }, 15000);
            }
        }, (error: any) => {
            this.loader = false;
            this.loaderTaskDetail = false;
            this.IsWarning = true;
            this.message = "Error Searching for Task";
            setTimeout(() => {
                this.IsWarning = false;
            }, 15000);
        });
    };

    setResults() {
        this.taskResults = this.tempTaskResult;        
        this.dataSource = new MatTableDataSource<TaskElement>(this.taskResults);
        this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
        let pageCount = this.taskResults.length % this.currentPageLimit == 0 ? this.taskResults.length / this.currentPageLimit :
            this.taskResults.length / this.currentPageLimit + 1;
        this.totalPageData = this.taskResults.length;
        this.totalPage = Math.ceil(this.taskResults.length / this.currentPageLimit);
        this.pagination.totalPage = this.totalPage;
		this.loaderTaskDetail = false;
	};
	
	refreshSATable() {		
		//hides table and re-shows it to update data on UI
		this.showSATable = false;
		setTimeout( () => {
			this.showSATable = true;
		},);
	}

    onRowDetailClick(task: TaskElement, index: number) {
        let taskelement = {
            ...task,
            isRowDetailOpen: true,
            isSelected: false,
            isStatusEditing: false,
            isIconMinus: false
        };

        let openedTask = this.displayTaskResult[index + 1];
        if (openedTask && openedTask.isRowDetailOpen) {
            task.isIconMinus = false;
            this.displayTaskResult.splice(index + 1, 1);
        } else {
            task.isIconMinus = true;

            if (index == 9) {
                this.displayTaskResult.push(taskelement);
            } else {
                this.displayTaskResult.splice(index + 1, 0, taskelement);
            }
        }

    };

    onGridNext() {
        if (this.currentPageNumber < this.tablePaginationData.length) {
            this.currentPageNumber += 1;
        }
    };

    onGridPrevious() {
        if (this.currentPageNumber != 1) {
            this.currentPageNumber -= 1;
        }
    };

    onSingleTaskSelected(task) {
        this.taskResults.map(item => {
            if (task.taskId === item.taskId) {
                if (item.isSelected) {
                    this.selectedTaskResultCount -= 1;
                    item.isSelected = false;
                } else {
                    this.selectedTaskResultCount += 1;
                    item.isSelected = true;
                }
            }
        })
    };

    onSelectAllCheckBox(event) {
        this.selectedTaskResultCount = 0;
        if (event.target.checked) {
            this.isAllTaskSelected = true;
            this.tempTaskResult.map((item, index) => {
                if (!item.isRowDetailOpen) {
				item.isSelected = true;
				this.selectedTaskResultCount += 1;
                }
            });
        } else {
            this.isAllTaskSelected = false;
            this.tempTaskResult.map((item, index) => {
             item.isSelected = false;
            });
        }
    };

    nextTasks() {
        /* this.currentPageNumber = this.pagination.currentPageNumber;

       
		this.searchCriteria.pagination = this.pagination; */
		// this.loader = true;
		setTimeout(() => {
			this.loader = true;
			// this.loaderTaskDetail = true;
		}, 10);

        this.searchTask();
    };

    onRefresh() {
		this.pagination.pageNumber = 0;
		this.pagination.allItems = [];
        this.nextTasks();
    };
	   
	openDetailView(element: any) {		
		//console.log("OPEN MY TASK DETAIL VIEW==>>>>", element);
		/* const tab: Tab = new Tab(TaskDetailsComponent, 'Task : ' + element.task['sourceTaskId'], 'viewTask', element.task); */
		//  GETCWM-7111
		switch (element.name) {
			case element.task.parentSourceTaskId:
				element.task.isParentTaskClicked = true;
				break;
			case element.task.sourceTaskId:
				element.task.isParentTaskClicked = false;
				break;
		}		
		const tab: Tab = new Tab(TaskDetailsComponent, 'Task : ' + element.name, 'TaskDetailsComponent', element.task);
        this.tabService.openTab(tab);
	};
	
    public onActionChange(actions: any): void {
		this.selectedAction = actions;
		//this.onAction();
	}

	onAction(event: any) {
		// this.actionList =[{
		// 	value:"Select"
		// }];
		this.message = '';
		this.IsSuccess = false;
		this.IsError = false;
		this.taskResults = event.data;
		var checkedRowList = _.filter(this.taskResults, function (task) {
			return task.isChecked;
		});

		if (!checkedRowList || !checkedRowList.length) {
			this.IsError = true;
			this.message = "Please Select Anyone Of the Task";
			setTimeout(() => {
				this.IsError = false;
			}, 7000);

		} else {
			if (!this.selectedAction || this.selectedAction == "Select") {
				this.IsError = true;
				this.message = "Please Select Anyone Of the Action";
				setTimeout(() => {
					this.IsError = false;
				}, 7000);
				
			} else {
				
				this.loader = true;
				if (this.selectedAction == 'Accept' || this.selectedAction == 'Complete' || this.selectedAction == 'UnBlock' || this.selectedAction == 'Release') {
					checkedRowList.forEach(element => {
						var obj = {};
						obj['id'] = element.id;
						obj['taskStatusActionRequest'] = {
							"action": this.selectedAction,
							"assignCuid": "",
							"taskInstanceId": "",
							"sourceSystem": element.sourceSystemName,
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
						//console.log(obj);
						this.taskService.TaskAction(obj, this.selectedAction).toPromise().then((result: any) => {
							//this.loader = false;
							this.IsSuccess = true;
							this.message = result.message;
							setTimeout(() => {
								this.IsSuccess = false;
							}, 7000);

							this.pagination.pageSize = this.pagination.allItems.length;
							this.onRefresh();
						}, (error: any) => {
							//console.log(error);
							this.loader = false;
							this.IsError = true;
							this.message = error.error.message;
							setTimeout(() => {
								this.IsError = false;
							}, 7000);
							
						});
					});
				} else {
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
							dropdownList: this.resourcesList
						}];
						var output = {};
						output[ModalData.fieldName] = '';
						var addRole: any = {
							buttons: ModalData.actions,
							fields: field,
							title: ModalData.label,
							output: output,
							from: 'taskassignedcuid',
							Reason: (this.selectedAction == 'Accept') ? UserDetails.personalInfo.cuid : '',
							blockingReasons: (this.selectedAction == 'Block') ? JSON.parse(localStorage.getItem('BlockingReasons')) : '',
							workgroupList: (this.selectedAction == 'Dispatch') ? this.workgroupList : '',
							size: (this.selectedAction == 'Block') ? 'modal-lg' : 'modal-sm'
						}
						this.loader = false;
						this.modalDetails = { ...this.modalDetails, ...addRole, className: "taskassignedcuid", error: {}, isDeleteConfirm: false };
						//console.log("this.modalDetails in onAction ==>", this.modalDetails);
						//console.log("this.modalChild in onAction ==>", this.modalChild);
						this.modalChild.showModal();
					
				}



				/* const dialogRef: any = this.dialog.open(SearchResultDialogComponent, {
				  width: 'auto',
				  data: {
					...this.getModelData(),
					// dropdownList: ["dfdsds","dfdsfsdfsd"]
				  }
				});
				dialogRef.componentInstance.onAttributeAdded &&
				dialogRef.componentInstance.onAttributeAdded.subscribe(({result, modalData}) => {
			   
				});
				dialogRef.afterClosed().subscribe(result => {
				  console.log('The dialog was closed' + result);
				}); */
			}
		}
    }

    getModelData() {
		return {
			"fieldName": this.selectedAction + "_cuid",
			"visible": true,
			"editable": false,
			"label": this.selectedAction,
			"type": "select",
			"fieldValue": "",
			"mandatory": true,
			"required": true,
			"Sectionheader": this.selectedAction,
			"service": null,
			"fieldLabel": this.selectedAction + " cuid",
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
    }
    
    checkAllRows(event) {
		if (event.target.checked) {
			this.taskResults.map((item) => {
				item.isChecked = true;
			});
		} else {
			this.taskResults.map((item) => {
				item.isChecked = false;
			});

		}
    }

    SetActionDropdown(event) {
		this.actionList = [];
		this.displayTaskResult = event.data;
		const select = { value: "Select" };
		setTimeout(() => {
			//actionList.push({ value: 'Select' });
			var checkedRowList = event.data;

			console.log(checkedRowList);
			checkedRowList.forEach(element => {
				if (element.allowedActions) {
					var actions: string[] = element.allowedActions.split(",").map((item: string) => item.trim());
					for (let i = 0; i < actions.length; i++) {
						var data = this.actionList.find(elm => elm.value === actions[i]);
						if (data === undefined || data === null) {
							this.actionList.push({ value: actions[i] });
						}
					}
				} else if (element.allowedactions){
					var actions: string[] = element.allowedactions;
					for (let i = 0; i < actions.length; i++) {
						var data = this.actionList.find(elm => elm.value === actions[i]);
						if (data === undefined || data === null) {
							this.actionList.push({ value: actions[i] });
						}
					}
				}
			});
			//removed the === and made it to == for duplicate select
			var data = this.actionList.find(elm => elm.value == select);
			if(data === undefined || data === null) {
				this.actionList.sort().unshift(select);
			}

			// Fix for GETCWM-13647 issue. Once GETCWM-4492 US implemented this block of code should be removed.
			if (checkedRowList.length > 0 && this.actionList.length > 1) {
				let isSaoTaksExists: boolean = false;
				checkedRowList.forEach(element => {
					if (element.sourceSystemId == '688') {
						isSaoTaksExists = true; return;
					}
				});
				if (isSaoTaksExists) {
					this.actionList = this.actionList.filter(e => e.value !== 'Complete')
				}
			}
			//  GETCWM-13647 -End

			if (this.actionList.length == 1 && checkedRowList.length > 0) {
				// this.IsError = true;
				// this.message = 'No Allowed Actions assigned to this Task';
				// setTimeout(() => {
				// 	this.IsError = false;
				// }, 7000);
				this.snackBar.open('No Allowed Actions assigned to this Task', "Okay", {
				  duration: 15000,
				});
			}
			// if(checkedRowList.length == 0){
			// 	this.actionList = [
			// 		{ value: "Select" }
			// 	]
			// }
		
		}, 1000);

    }

	unsubscribe() {
		this.subscriptions.forEach((subscription: Subscription) => {
			subscription.unsubscribe();
		});
		this.subscriptions = [];
    }
    
    loadDropDowns(parameterType: string, parameterName: string, includeChilds: boolean) {
		this.userProfileService.getV2SystemData(parameterName).toPromise().then((response: any) => {
			this.loader = false;
			if (parameterName == 'Screening Disposition Codes') {
				if (response.systemParameterModels.length > 0) {
					this.dispositionCodesObjArr = response.systemParameterModels[0].systemParameterItem;
					this.dispositionCodes = [];
					this.dispositionCodesObjArr.forEach((codeObj: any) => {
						this.dispositionCodes.push(codeObj.value + ' - ' + codeObj.description);
					})
				} else {
					this.dispositionCodes = [];
				}
			} else if (parameterName == 'Screening Cause Codes') {
				if (response.systemParameterModels.length > 0) {
					this.causeCodesObjArr = response.systemParameterModels[0].systemParameterItem;
					this.causeCodes = [];
					this.causeCodesObjArr.forEach((codeObj: any) => {
						this.causeCodes.push(codeObj.value + ' - ' + codeObj.description);
					})
				} else {
					this.causeCodes = [];
				}
			} else if (parameterName == 'Blocking Reasons') {
				if (response.systemParameterModels.length > 0) {
					this.blockingReasonsObjArr = response.systemParameterModels[0].systemParameterItem;
					this.blockingReasons = [];
					this.blockingReasonsObjArr.forEach((codeObj: any) => {
						this.blockingReasons.push(codeObj.value);
					})
				} else {
					this.blockingReasons = [];
				}
			}
		}).catch((errorObj: any) => {
			console.error(errorObj);
			this.loader = false;
		});
    }
    
    cuidList = [];
	async loadCUIDs(template) {
		var checkedRowList = _.filter(this.displayTaskResult, function (task) {
			return task.isChecked;
		});
		this.cuidList = [];
		let userInfo = JSON.parse(localStorage.getItem('fd_user'));
		let resultArr = [];
		if (checkedRowList[0]['workgroupList'] && checkedRowList[0]['workgroupList'] != null && checkedRowList[0]['workgroupList'].length > 0) {
			for (let WordgroupIndex = 0; WordgroupIndex < checkedRowList[0]['workgroupList'].length; WordgroupIndex++) {
				await this.taskService.GetTransferWorkGroupId(checkedRowList[0]['workgroupList'][WordgroupIndex]).toPromise().then(async (response: any) => {
					if (response && response.length > 0) {
						response.forEach((resource: any) => {
							if (!this.cuidList.find((x) => x == resource.fullName + " - " + resource.cuid)) {
								this.cuidList.push(resource.fullName + " - " + resource.cuid);
							}
						})
					}
					if (this.cuidList.length == 0) {
						setTimeout(() => {
							this.modalRef = this.modalService.show(template);
							this.loaderLmosTaskPopup = false;
						}, 2000);
					} else {
						this.modalRef = this.modalService.show(template);
						this.loaderLmosTaskPopup = false;
					}
				}).catch(errorObj => console.error(errorObj));
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
				if (this.cuidList.length == 0) {
					setTimeout(() => {
						this.modalRef = this.modalService.show(template);
						this.loaderLmosTaskPopup = false;
					}, 2000);
				} else {
					this.modalRef = this.modalService.show(template);
					this.loaderLmosTaskPopup = false;
				}
			}).catch(errorObj => console.error(errorObj));
		}
    }
    
	routWorkgroups = [];
	loadWorkgroups(template) {
		this.routWorkgroups = [];
		this.taskService.GetAllReRouteWorkGroups().toPromise().then((response: any) => {
			var WorkGroup = [];
			this.GetAllReRouteWorkGroupsRes = response.systemParameterModels[0].systemParameterItem;
			this.GetAllReRouteWorkGroupsRes.forEach(element => {
				WorkGroup.push(element.description);
			});
			this.routWorkgroups = WorkGroup;
			this.loaderLmosTaskPopup = false;
			if (this.routWorkgroups.length == 0) {
				setTimeout(() => {
					this.modalRef = this.modalService.show(template);
					// this.loaderTaskDetail = false;
					console.log(this.modalRef);
				}, 2000);
			} else {
				this.modalRef = this.modalService.show(template);
				// this.loaderTaskDetail = false;
				console.log(this.modalRef);
			}
		}).catch(errorObj => console.error(errorObj));

		// this.taskService.getAllWorkgroups().toPromise().then((response: any) => {
		// 	this.routWorkgroups = response;
		// }).catch(errorObj => console.error(errorObj));

    }
    
    buttonObj: any = {};
	wcmRequestData: any = {};
	submitDataToLMOS() {
		// this.loaderTaskDetail = true;
		var checkedRowList = _.filter(this.displayTaskResult, function (task) {
			return task.isChecked;
		});
		this.wcmRequestData.TTN = '';
		this.wcmRequestData.MC = '';
		this.wcmRequestData.TN = '';
		this.wcmRequestData.EC = '';
		this.wcmRequestData.DB = '';
		this.wcmRequestData.T = '';
		this.wcmRequestData.C = '';
		this.wcmRequestData.D = '';
		this.wcmRequestData.FL1 = '';
		this.wcmRequestData.FL3 = '';
		this.wcmRequestData.X = '';
		this.wcmRequestData.TRACE = '';

		if (checkedRowList.length > 0) {
			const UnMappedFieldsData = checkedRowList[0]['taskInstParamRequests'].find((x) => x.name == 'URl');
			const MainTTN = checkedRowList[0]['taskInstParamRequests'].find((x) => x.name == 'TTN');
			const MainMC = checkedRowList[0]['taskInstParamRequests'].find((x) => x.name == 'MC');
			const MainTN = checkedRowList[0]['taskInstParamRequests'].find((x) => x.name == 'TN');
			const MainEC = checkedRowList[0]['taskInstParamRequests'].find((x) => x.name == 'EC');
			const MainDB = checkedRowList[0]['taskInstParamRequests'].find((x) => x.name == 'DB');
			const MainT = checkedRowList[0]['taskInstParamRequests'].find((x) => x.name == 'T');
			const MainC = checkedRowList[0]['taskInstParamRequests'].find((x) => x.name == 'C');
			const MainD = checkedRowList[0]['taskInstParamRequests'].find((x) => x.name == 'D');
			const MainFL1 = checkedRowList[0]['taskInstParamRequests'].find((x) => x.name == 'FL1');
			const MainFL3 = checkedRowList[0]['taskInstParamRequests'].find((x) => x.name == 'FL3');
			const MainX = checkedRowList[0]['taskInstParamRequests'].find((x) => x.name == 'X');
			const MainTRACE = checkedRowList[0]['taskInstParamRequests'].find((x) => x.name == 'TRACE');
			if (MainTTN) {
				this.wcmRequestData.TTN = MainTTN.value;
			}
			if (MainMC) {
				this.wcmRequestData.MC = MainMC.value;
			}
			if (MainTN) {
				this.wcmRequestData.TN = MainTN.value;
			}
			if (MainEC) {
				this.wcmRequestData.EC = MainEC.value;
			}
			if (MainDB) {
				this.wcmRequestData.DB = MainDB.value;
			}
			if (MainT) {
				this.wcmRequestData.T = MainT.value;
			}
			if (MainC) {
				this.wcmRequestData.C = MainC.value;
			}
			if (MainD) {
				this.wcmRequestData.D = MainD.value;
			}
			if (MainFL1) {
				this.wcmRequestData.FL1 = MainFL1.value;
			}
			if (MainFL3) {
				this.wcmRequestData.FL3 = MainFL3.value;
			}
			if (MainX) {
				this.wcmRequestData.X = MainX.value;
			}
			if (MainTRACE) {
				this.wcmRequestData.TRACE = MainTRACE.value;
			}
			let URL = '';
			if (UnMappedFieldsData) {
				URL = UnMappedFieldsData.value;
			}
		}
		console.log(URL);

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
		if (userInfo.paramModel && userInfo.paramModel.length > 0) {
			userInfo.paramModel.forEach(element => {
				if (element.name == "EC") {
					ec_reqData.value = element.value;
					this.wcmRequestData.EC = element.value;
				}
			});
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
			let url = URL + "/v1/MSCR/TTN/UPDATE?TTN=" + TTN + "&MC=" + MC + "&TN=" + TN + "&EC=" + EC + "&NARR=RETURNED TO WM";

			BodyRequest.httpMethod = 'PUT';
			BodyRequest.url = url;
			BodyRequest.action = 'Release';
			BodyRequest.comments = this.comment;
			BodyRequest.taskInstanceId = checkedRowList.sourceTaskId;
			BodyRequest.paramRequests[0].value = this.comment;
			console.log(checkedRowList);
			this.taskService.AllowAction(BodyRequest, checkedRowList.id).toPromise().then((response: any) => {
				this.loader = false;
				this.loaderLmosTaskPopup = false;
				this.searchTask();
				this.IsSuccess = true;
				this.message = response.message;
				setTimeout(() => {
					this.IsSuccess = false;
				}, 7000);
			}).catch((error: any) => {
				this.loader = false;
				console.error(error);
				this.IsError = true;
				this.message = error.error.message;
				setTimeout(() => {
					this.IsError = false;
				}, 7000);
			});

		} else if (this.showRerouteSection) {
			this.showRerouteSection = false;
			this.modalService.hide(1);
			// this.loaderTaskDetail = true;
			const user = JSON.parse(localStorage.getItem('fd_user'));
			// console.log(this.wcmRequestData);
			var TTN = (this.wcmRequestData.TTN) ? this.wcmRequestData.TTN : '';
			var MC = (this.wcmRequestData.MC) ? this.wcmRequestData.MC : '';
			var TN = (this.wcmRequestData.TN) ? this.wcmRequestData.TN : '';
			var EC = (this.wcmRequestData.EC) ? this.wcmRequestData.EC : '';
			// console.log(this.GetAllReRouteWorkGroupsRes.find((x) => x.description == this.transferTo));
			const SelectWorkgroupData = this.GetAllReRouteWorkGroupsRes.find((x) => x.description == this.transferTo);

			const ServiceResult = (this.RerouteResultvalue == 'Affecting Service') ? 900 : 100;
			let url = URL + "/v1/MSCR/TTN/UPDATE?TTN=" + TTN + "&MC=" + MC + "&TN=" + TN + "&EC=" + EC + "" + SelectWorkgroupData.value + "&RSLT=" + ServiceResult + " ";

			BodyRequest.httpMethod = 'PUT';
			BodyRequest.url = url;
			BodyRequest.action = 'Complete';
			BodyRequest.comments = this.comment;
			BodyRequest.taskInstanceId = checkedRowList.sourceTaskId;
			BodyRequest.workgroupList[0].workgroupName = this.transferTo;
			BodyRequest.paramRequests[0].value = this.comment;
			console.log(checkedRowList);
			this.taskService.AllowAction(BodyRequest, checkedRowList.id).toPromise().then((response: any) => {
				this.loader = false;
				this.loaderLmosTaskPopup = false;
				this.searchTask();
				this.IsSuccess = true;
				this.message = response.message;
				setTimeout(() => {
					this.IsSuccess = false;
				}, 7000);
			}).catch((error: any) => {
				this.loader = false;
				console.error(error);
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
			// 	console.error(errorObj);
			// 	this.loaderTaskDetail = false;
			// });
		} else if (this.showCloseSection) {
			this.showCloseSection = false;
			this.modalService.hide(1);
			// this.loaderTaskDetail = true;
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
			let url = URL + "/v1/MSCR/TTN/CLOSE?DB=" + DB + "&MC=" + MC + "&EC=" + EC + "&TTN=" + TTN + "&TN=" + TN + "&T=" + T + "&D=" + D + "&C=" + C + "&FL1=" + FL1 + "&FL2=" + this.closePopupObj.fl2 + "&FL3=" + FL3 + "&X=" + X + "&NARR=" + this.closePopupObj.comment + "&trace=" + TRACE + "";

			BodyRequest.httpMethod = 'PUT';
			BodyRequest.url = url;
			BodyRequest.action = 'Complete';
			BodyRequest.comments = this.closePopupObj.comment;
			BodyRequest.taskInstanceId = checkedRowList.sourceTaskId;
			BodyRequest.paramRequests[0].name = 'Complte_Complete';
			BodyRequest.paramRequests[0].value = this.closePopupObj.comment;
			BodyRequest.sourceSystem = checkedRowList.sourceSystemName;
			console.log(checkedRowList);

			this.taskService.AllowAction(BodyRequest, checkedRowList.id).toPromise().then((response: any) => {
				this.loader = false;
				this.loaderLmosTaskPopup = false;
				this.searchTask();
				this.IsSuccess = true;
				this.message = response.message;
				setTimeout(() => {
					this.IsSuccess = false;
				}, 7000);
			}).catch((error: any) => {
				this.loader = false;
				console.error(error);
				this.IsError = true;
				this.message = error.error.message;
				setTimeout(() => {
					this.IsError = false;
				}, 7000);
			});
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
			let url = URL + "/v1/MSCR/TTN/UPDATE?TTN=" + TTN + "&MC=" + MC + "&TN=" + TN + "&EC=" + EC + "&NARR=" + this.comment + "";

			BodyRequest.httpMethod = 'PUT';
			BodyRequest.url = url;
			BodyRequest.action = 'Assign';
			BodyRequest.comments = this.comment;
			BodyRequest.taskInstanceId = checkedRowList.sourceTaskId;
			BodyRequest.assignCuid = this.transferTo.split(' - ')[1];
			BodyRequest.paramRequests[0].name = 'Transfer_comment';
			BodyRequest.paramRequests[0].value = this.comment;
			console.log(checkedRowList);
			this.taskService.AllowAction(BodyRequest, checkedRowList.id).toPromise().then((response: any) => {
				this.loader = false;
				this.loaderLmosTaskPopup = false;
				this.searchTask();
				this.IsSuccess = true;
				this.message = response.message;
				setTimeout(() => {
					this.IsSuccess = false;
				}, 7000);
			}).catch((error: any) => {
				this.loader = false;
				console.error(error);
				this.IsError = true;
				this.message = error.error.message;
				setTimeout(() => {
					this.IsError = false;
				}, 7000);
			});
		} else if (this.showCancelSection) {
			this.showCancelSection = false;
			this.modalService.hide(1);
			var TTN = (this.wcmRequestData.TTN) ? this.wcmRequestData.TTN : '';
			var MC = (this.wcmRequestData.MC) ? this.wcmRequestData.MC : '';
			var TN = (this.wcmRequestData.TN) ? this.wcmRequestData.TN : '';
			var EC = (this.wcmRequestData.EC) ? this.wcmRequestData.EC : '';
			let url = URL + "/v1/MSCR/TTN/UPDATE?TTN=" + TTN + "&MC=" + MC + "&TN=" + TN + "&EC=" + EC + "&NARR=''";

			BodyRequest.httpMethod = 'PUT';
			BodyRequest.url = url;
			BodyRequest.action = 'Cancelled';
			BodyRequest.comments = this.comment;
			BodyRequest.taskInstanceId = checkedRowList.sourceTaskId;
			BodyRequest.paramRequests[0].name = 'cancel_reason';
			BodyRequest.paramRequests[0].value = this.comment;
			this.taskService.AllowAction(BodyRequest, checkedRowList.id).toPromise().then((response: any) => {
				this.loader = false;
				this.loaderLmosTaskPopup = false;
				this.searchTask();
				this.IsSuccess = true;
				this.message = response.message;
				setTimeout(() => {
					this.IsSuccess = false;
				}, 7000);
			}).catch((error: any) => {
				this.loader = false;
				console.error(error);
				this.IsError = true;
				this.message = error.error.message;
				setTimeout(() => {
					this.IsError = false;
				}, 7000);
			});
		} else if (this.showLmosRecoredSection) {
			this.showLmosRecoredSection = false;
			this.modalService.hide(1);
			let lmosResponse: any = {};
			checkedRowList.taskStatus = 'Assigned';
			var UserDetails = JSON.parse(localStorage.getItem('defaultValue'));
			checkedRowList.assignedCuid = null;
			console.log(checkedRowList);
			this.loader = true;
			this.taskService.saveTaskDetails(checkedRowList).toPromise().then((response: any) => {
				// this.loader = false;
				this.loaderLmosTaskPopup = false;
				this.searchTask();
				this.IsSuccess = true;
				this.message = response.message;
				setTimeout(() => {
					this.IsSuccess = false;
				}, 7000);
			}).catch((error: any) => {
				this.loader = false;
				console.error(error);
				this.IsError = true;
				this.message = error.error.message;
				setTimeout(() => {
					this.IsError = false;
				}, 7000);
			});
		}
	}

	buttonClicked(fromModal) {
		console.log(fromModal);
		this.loader = true;
		var checkedRowList = _.filter(this.taskResults, function (task) {
			return task.isChecked;
		});
		console.log(checkedRowList);
		checkedRowList.forEach(element => {
			var obj = {};
			var assignCuid = '';
			var value = '';
			var name = '';
			var workgrpName = '';
			if (this.selectedAction == 'Cancel' || this.selectedAction == 'Block') {
				assignCuid = '';
				name = (this.selectedAction == 'Cancel') ? "cancel_reason" : (this.selectedAction == 'Block') ? 'blocking_reason' : '';
				value = localStorage.getItem('Reason');
			}else if(this.selectedAction == 'Dispatch'){
				workgrpName = localStorage.getItem('DispatchWorkgroup');			
			}else {
				//assignCuid = fromModal.modal.output[this.selectedAction + '_cuid'];
				assignCuid = fromModal.modal.fields[0].fieldValue;
			}
			obj['id'] = element.id;
			obj['taskStatusActionRequest'] = {
				"action": this.selectedAction,
				"assignCuid": assignCuid,
				"taskInstanceId": "",
				"sourceSystem": "",
				"modifiedById": "",
				"comments": "",
				"workgroupList": [
					{
						"workgroupName": workgrpName,
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
			this.loader = true;
			this.taskService.TaskAction(obj, this.selectedAction).toPromise().then((result: any) => {
				//this.loader = false;
				this.IsSuccess = true;
				this.modalChild.hideModal();
				this.message = result.message;
				setTimeout(() => {
					this.IsSuccess = false;
				}, 7000);
				
				this.pagination.pageSize = this.pagination.allItems.length;
				this.onRefresh();
			}, (error: any) => {
				console.log(error);
				this.loader = false;
				this.IsError = true;
				this.message = error.error.message;
				this.modalChild.setErrorMessage(this.message);
				setTimeout(() => {
					this.IsError = false;
				}, 7000);
				// this.snackBar.open(error.error.message, "Okay", {
				//   duration: 15000,
				// });
			});
		});
		// if(fromModal.modal.from == 'addrolegroup'){
		//   this.createWorkGroupClicked(fromModal);
		// } else if (fromModal.modal.from == 'addworkgrouprole') {
		//   this.addWorkgroupRoleClicked(fromModal)
		// }  else  if(fromModal.modal.from == 'editworkgrouprole'){
		//   this.editWorkGroupRoleClicked(fromModal);
		// } else  if(fromModal.modal.from == 'deleteworkgroup'){
		//   this.onDeleteWorkgroupConfirm(fromModal);
		// } else if(fromModal.modal.from == 'deleteworkgrouprole') {
		//   this.deleteworkgrouproleModal(fromModal);
		// }
	}

	ngAfterViewChecked() {
		$('table').removeClass('smart-form');
	}

	ngAfterViewInit() {
		$('table').removeClass('smart-form');
		// var $x = $(".smart-form");
		// $x.removeProp("padding");
	}

	ngOnInit() {

		// this.taskService.getAllResources().toPromise().then((response: any) => {
		// 	this.taskService.resources.next(response);
		// 	this.resourcesList = response;
		//    }).catch((errorObj: any) => {
		//    console.error(errorObj);
		//    this.loader = false;
		//    });
		if (document.URL.indexOf('task/my-task') < 0 ) {
			if (this.title != 'Task Results') {
				console.log(":::: Calling loadDropDown ::::");
		   		this.loadDropDowns('List of Values', 'Blocking Reasons', true);
			}
		}
		//    this.getWorkgroupListValues();

	}

	ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
		console.log(changes);
		throw new Error("Method not implemented.");
	}

	ngOnDestroy(){
		this.resourceListSubscription.unsubscribe();
		this.workgroupListSubscription.unsubscribe();
	}

	subscribeResourceList(){
		this.resourceListSubscription = this.taskService.resources.subscribe(resources =>{
			if(resources){
				this.resourcesList  = resources;

			}else{
				this.taskService.getAllResources().toPromise().then((response: any) => {
					this.taskService.resources.next(response);
					this.resourcesList = response;
				   }).catch((errorObj: any) => {
				   console.error(errorObj);
				   this.loader = false;
				   });
			}
		});
	}

	subscribeWorkgroupList(){
		console.log('Abstarct get work group list');
		this.workgroupListSubscription = this.taskService.workGroups.subscribe(workgroups =>{
			if(workgroups){
				this.workgroupList = workgroups;
			}else{
				this.taskService.getWorkgroups().toPromise().then((response: any) => {
					this.workgroupList = response;
					this.taskService.workGroups.next(response);
			
				}).catch((errorObj: any) => {
					console.error(errorObj);
					this.loader = false;
					this.loaderLmosTaskPopup = false;
				});
			}
		})
	}
}

export interface TaskElement {
    isIconMinus: boolean;
    taskId: string;
    appTaskInstanceId: string;
    application: string;
    taskInstDesc: number;
    taskStatus: number;
    claimId: string;
    sourceSystem: string;
    createdById: string;
    createdDateTime: string;
    isSelected: boolean;
    isRowDetailOpen: boolean;
    isStatusEditing: boolean;
    isChecked: boolean;
}

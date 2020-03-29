import { Component, OnInit, ViewChild,Type } from '@angular/core';
import { MatSnackBar, MatDialog } from '@angular/material';
import { UserProfileService } from '../user-profile.service';
import { NotificationService } from '@app/core/services';
import { TabService } from '@app/core/tab/tab-service';
import { ModalComponent } from '@app/shared/modal/modal.component';
import { TaskService } from '@app/features/task/task.service';

@Component({
  selector: 'sa-manage-notification',
  templateUrl: './manage-notification.component.html',
  styleUrls: ['./manage-notification.component.scss']
})
export class ManageNotificationComponent implements OnInit {

  @ViewChild(ModalComponent) modalChild: ModalComponent;
	public currentPageLimit: number = 10;
	public userdetailswodgetwa = 'skillWidget';
	public availableSkills: any;
	public availableSkillsBackup: any;
	public skillInputObj = { selectedSkills: ['ASP'], searchCriteria: '' };
	/** Static data for Skill details start */
	public skillTabs = [];
	/** Static data for Skill details end */
	dismissible = true;
	iconSave = false;
	iconEdit = true;
	iconDelete = false;
	tabdata: any;
	userInfo: any;
	tablePaginationData = [];
	filter = {};
	sectionheader = '';
	actions = [];
	loaderTaskDetail = true;
	pagination: any = {};
	actionButton:any = [];
	actionColumn:any = [];
	error:any = {}

	notifyKeySet:any = {
		from: 'notifykeyset',
		title: 'Notify Key Set',
		isSortAsc: false,
		globalSearch: ''
};
notifyKeySettableDataBackup: any = [];
loader: boolean = true;
nextDisable : boolean = false;
previousDisable : boolean = true;
currentPageNumber:number;
IsSuccess = false;
IsError = false;
message = '';
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
	constructor(private userProfileService: UserProfileService, private dialog: MatDialog,
		private snackBar: MatSnackBar, private notificationService: NotificationService,
		private taskService : TaskService, private tabService: TabService) {
		this.getPageLayout();

	}

	ngOnInit() {
		// debugger;
		this.userInfo = JSON.parse(localStorage.getItem('fd_user'));
	}

	getPageLayout() {

		this.userProfileService.getPageLayout('Manage Notification').toPromise().then(res => {
			// debugger;

			// res = {
			// 	"pageLayoutTemplate": [
			// 	  {
			// 		"sectionHeader": "Notify Key Set",
			// 		"fieldsList": [
			// 			{
			// 				"filter": true,
			// 				"fieldName": "id",
			// 				"visible": true,
			// 				"editable": false,
			// 				"link": false,
			// 				"pageLayoutFieldId": "99946",
			// 				"label": "ID",
			// 				"sort": true,
			// 				"type": "TableHeader",
			// 				"fieldValue": "",
			// 				"class": "systemtype"
			// 			  },
			// 		  {
			// 			"filter": true,
			// 			"fieldName": "taskTypeName",
			// 			"visible": true,
			// 			"editable": true,
			// 			"link": false,
			// 			"pageLayoutFieldId": "99946",
			// 			"label": "Task Type",
			// 			"sort": true,
			// 			"type": "MultiSelect",
			// 			"fieldValue": "",
			// 			"class": "systemtype"
			// 		  },
			// 		  {
			// 			"filter": true,
			// 			"fieldName": "statusCodes",
			// 			"visible": true,
			// 			"editable": true,
			// 			"link": false,
			// 			"pageLayoutFieldId": "99947",
			// 			"label": "Status",
			// 			"sort": true,
			// 			"type": "MultiSelect",
			// 			"fieldValue": "",
			// 			"class": "systemname"
			// 		  },
			// 		  {
			// 			"filter": true,
			// 			"fieldName": "mesgType",
			// 			"visible": true,
			// 			"editable": true,
			// 			"link": false,
			// 			"pageLayoutFieldId": "99948",
			// 			"label": "Message Type",
			// 			"sort": true,
			// 			"type": "TableHeader",
			// 			"fieldValue": "",
			// 			"class": "systemvalue"
			// 		  },
			// 		   {
			// 			"filter": true,
			// 			"fieldName": "isNotified",
			// 			"visible": true,
			// 			"editable": true,
			// 			"link": false,
			// 			"pageLayoutFieldId": "99955",
			// 			"label": "Is Notified",
			// 			"sort": true,
			// 			"type": "dropdown",
			// 			"fieldValue": "",
			// 			"class": "systemvalue"
			// 		  },
			// 		  {
			// 			"filter": true,
			// 			"fieldName": "createdById",
			// 			"visible": true,
			// 			"editable": false,
			// 			"link": false,
			// 			"pageLayoutFieldId": "49",
			// 			"label": "Created By",
			// 			"sort": true,
			// 			"type": "TableHeader",
			// 			"fieldValue": "",
			// 			"class": "systemcreatedby"
			// 		  },
			// 		  {
			// 			"filter": true,
			// 			"fieldName": "createdDtTm",
			// 			"visible": true,
			// 			"editable": false,
			// 			"link": false,
			// 			"pageLayoutFieldId": "50",
			// 			"label": "Created Time",
			// 			"sort": true,
			// 			"type": "TableHeader",
			// 			"fieldValue": "",
			// 			"class": "systemcreatedtime"
			// 		  },
			// 		  {
			// 			"filter": true,
			// 			"fieldName": "modifiedById",
			// 			"visible": true,
			// 			"editable": false,
			// 			"link": false,
			// 			"pageLayoutFieldId": "51",
			// 			"label": "Modified By",
			// 			"sort": true,
			// 			"type": "TableHeader",
			// 			"fieldValue": "",
			// 			"class": "systemodifiedid"
			// 		  },
			// 		  {
			// 			"filter": true,
			// 			"fieldName": "modifiedDtTm",
			// 			"visible": true,
			// 			"editable": false,
			// 			"link": false,
			// 			"pageLayoutFieldId": "52",
			// 			"label": "Modified Time",
			// 			"sort": true,
			// 			"type": "TableHeader",
			// 			"fieldValue": "",
			// 			"class": "systemmodifieddate"
			// 		  }
			// 		]
			// 	  },
			// 	  {
			// 		"sectionHeader": "Buttons",
			// 		"fieldsList": [
			// 		  {
			// 			"fieldName": "Add",
			// 			"visible": true,
			// 			"apiUrl": "",
			// 			"pageLayoutFieldId": "53",
			// 			"label": "Add",
			// 			"fieldValue": "",
			// 			"class": "search-btn"
			// 		  },
			// 		  {
			// 			"fieldName": "Edit",
			// 			"visible": true,
			// 			"apiUrl": "",
			// 			"pageLayoutFieldId": "54",
			// 			"label": "Edit",
			// 			"fieldValue": "",
			// 			"class": "search-btn"
			// 		  },
			// 		  {
			// 			"fieldName": "Delete",
			// 			"visible": true,
			// 			"apiUrl": "",
			// 			"pageLayoutFieldId": "55",
			// 			"label": "Delete",
			// 			"fieldValue": "",
			// 			"class": "search-btn"
			// 		  }
			// 		]
			// 	  },
			// 	  {
			// 		"sectionHeader": "pagination",
			// 		"fieldsList": [
			// 		  {
			// 			"totalRecords": 15,
			// 			"fieldName": "pagination",
			// 			"pageNumber": 0,
			// 			"pageNumberText": "Page Number -",
			// 			"totalRecordsText": "Total number of records: ",
			// 			"pageLimitOptions": [
			// 			  10,
			// 			  20,
			// 			  50,
			// 			  100
			// 			],
			// 			"pageSize": 10,
			// 			"pageLayoutFieldId": "441",
			// 			"label": "pagination",
			// 			"perPageText": "Per Page",
			// 			"type": "pagination",
			// 			"fieldValue": ""
			// 		  }
			// 		]
			// 	  },
			// 	  {
			// 		"sectionHeader": "Manage Notify Keyset Buttons",
			// 		"fieldsList": [
			// 		  {
			// 			"fieldName": "Filter",
			// 			"visible": true,
			// 			"actionbutton": true,
			// 			"apiUrl": "",
			// 			"pageLayoutFieldId": "683",
			// 			"label": "Filter",
			// 			"fieldValue": "",
			// 			"class": "search-btn"
			// 		  },
			// 		  {
			// 			"fieldName": "Pdf",
			// 			"visible": true,
			// 			"actionbutton": true,
			// 			"apiUrl": "",
			// 			"pageLayoutFieldId": "684",
			// 			"label": "PDF",
			// 			"fieldValue": "",
			// 			"class": "search-btn"
			// 		  },
			// 		  {
			// 			"fieldName": "Print",
			// 			"visible": true,
			// 			"actionbutton": true,
			// 			"apiUrl": "",
			// 			"pageLayoutFieldId": "685",
			// 			"label": "Print",
			// 			"fieldValue": "",
			// 			"class": "search-btn"
			// 		  },
			// 		  {
			// 			"fieldName": "showHideColumns",
			// 			"visible": true,
			// 			"actionbutton": true,
			// 			"apiUrl": "",
			// 			"pageLayoutFieldId": "919",
			// 			"label": " Show / Hide columns",
			// 			"fieldValue": "",
			// 			"class": "search-btn"
			// 		  }
			// 		]
			// 	  }
			// 	],
			// 	"templateName": "System Parameter Table",
			// 	"createdById": "KKADALI"
			//   };
			
			let response : any = res;
			
			this.pagination = response.pageLayoutTemplate[2].fieldsList[0];
			this.pagination.selectedLimit = 10;
			/* if (localStorage.notifyKeySetPerPage) {
				this.pagination.selectedLimit = localStorage.notifyKeySetPerPage;
			} */
			this.actionButton = response.pageLayoutTemplate[3].fieldsList;
			this.sectionheader = response.pageLayoutTemplate[0].sectionHeader
			this.actionColumn =  response.pageLayoutTemplate[1].fieldsList

			this.pagination.currentPageNumber = 1;
			this.pagination.allItems = [];
            this.pagination.pager = {startIndex: 0, endIndex:  this.pagination.selectedLimit - 1};
			
			this.getAllNotifyKeySet(response.pageLayoutTemplate[0].sectionHeader, response.pageLayoutTemplate[0].fieldsList, this.actionColumn)
		}).catch(error => { });
	}

	buttonClicked(fromModal) {
		if(fromModal.modal.from == 'deletenotifykeyset') {
      this.deletenotifyKeySet(fromModal.modal.data);
    }
	}


	deletenotifyKeySet(event) {


		var pagedItems = event.pagedItems;
		var pagedItems = event.pagedItems;
		var rowIndex = event.rowIndex;
        console.log(pagedItems[rowIndex]);
		var id = pagedItems[rowIndex]['id'];

		// var id = this.notifyKeySet.tableData[event['rowIndex']]['id'];
		
		if (!id) {
			this.IsSuccess = false;
			this.IsError = true;
			this.message = "Notify Key Set to be deleted does not have an ID";
			return;
		}
		this.userProfileService.deleteNotifyKeySet('/Enterprise/v2/Work/notification/deleteNotifyKeySet/', id).
			toPromise().then((response: any) => {
			
				this.IsSuccess = true;
				this.modalChild.hideModal();
				pagedItems.splice(rowIndex,1);
				this.message = "Successfully Deleted";
                setTimeout(() => {
                	this.IsSuccess = false;
                }, 15000);


			})
			.catch(error => { 
				this.IsError = true;
				this.modalChild.hideModal();
				this.message = error.error.message;
				setTimeout(() => {
				this.IsError = false;
				}, 15000);
			 });
	}
	getViewDataTable() {
		this.getTaskTypes();
		this.getAllStatus();
		this.getIsNotifiedOptions();
		// this.getMessageTypeOptions();
		this.userProfileService.getNotifyKeySet()
			.subscribe(res => {
			
				let response  = res;
				this.notifyKeySet.tableData = [];
				// var response: any = [
				this.notifyKeySet.tableData =  res;
				this.pagination.totalRecords = res['length'];
				
				this.notifyKeySet.tableData.forEach(row => {
					row['rowEdit'] = false;
				});
				this.notifyKeySettableDataBackup = JSON.parse(JSON.stringify(	this.notifyKeySet.tableData));
				this.pagination.totalPage = Math.ceil(this.pagination.totalRecords / this.pagination.selectedLimit);
				var limit = 0
				if (this.pagination.totalRecords > 0 && this.loaderTaskDetail) {
					// this.pagination.pageNumber = 1;
				} else {
					if (this.pagination.pageNumber == 0 && this.pagination.totalRecords > 0) {
						// this.pagination.pageNumber = 1;
					} else if (this.pagination.totalRecords > 0) {
						limit = Number(this.pagination.pageNumber - 1) * Number(this.pagination.selectedLimit)
					}
				}
				this.pagination.allItems  = this.pagination.allItems.concat(this.notifyKeySet.tableData);
				this.loaderTaskDetail = false;
				this.notifyKeySet.tableData = this.notifyKeySet.tableData.slice(limit, this.pagination.selectedLimit * (limit + 1));
				this.pagination.currentPageNumber = 1;				
				this.convertNumberToArray(this.pagination.totalPage);
			}), (err) => {
			}
	}

	getTaskTypes(){

		this.taskService.getTaskTypes()
		.subscribe(res => {
			this.filter = {};
			var response: any = res;
			this.notifyKeySet.header.map((val, index)=> {
				if(val.fieldName=='taskTypeName') {
					this.notifyKeySet.header[index]['dropDown'] = response;
				}
			})
			// response.map((val) => {
			// 	this.notifyKeySet.header.map((typeVal, index)=> {
			// 		if(typeVal.fieldName=='taskType') {
			// 			this.notifyKeySet.header[index]['dropDown'].push(val['taskType'][0]['taskName']);
			// 		}
			// 		else if (typeVal.fieldName=='status'){
			// 			this.notifyKeySet.header[index]['dropDown'].push(val['statusCodes'][0]['value']);

			// 		}else if(typeVal.fieldName=='isNotified') {
			// 			this.notifyKeySet.header[index]['dropDown'].push(val['isNotified']);


			// 		}
			// 	})
			// })
		}), (err) => {
		}
	}
	statusCodesValueToStatusCodesIdMap :any = {};
	getAllStatus(){

		this.taskService.getAvailableTaskStatus().subscribe(res => {
			this.statusCodesValueToStatusCodesIdMap = {};
				const response: any = res;
				this.notifyKeySet.header.map((val, index)=> {
					if(val.fieldName=='statusCodes') {
						this.notifyKeySet.header[index]['dropDown'] = [];
					}
				})
				response.systemParameterModels[0].systemParameterItem.map((val) => {
					this.notifyKeySet.header.map((typeVal, index)=> {
						if(typeVal.fieldName=='statusCodes') {
							this.notifyKeySet.header[index]['dropDown'].push(
									// val.value +' ,'+val.id
									val.value
							);
							this.statusCodesValueToStatusCodesIdMap[val.value] = val.id;
						}
					})
				})
		});
	}
	getIsNotifiedOptions(){
		this.notifyKeySet.header.map((val, index)=> {
			if(val.fieldName=='isNotified') {
				this.notifyKeySet.header[index]['dropDown'] = ['Y','N'];
			}
		})
	}

	// getMessageTypeOptions(){
	// 	this.notifyKeySet.header.map((val, index)=> {
	// 		if(val.fieldName=='mesgType') {
	// 			this.notifyKeySet.header[index]['dropDown'] = ['Status_UPDATE'];
	// 		}
	// 	})
	// }
	convertNumberToArray(count:number){
		this.tablePaginationData = [];
		for(let i =1;i<=count;i++){
		  this.tablePaginationData.push(i);
		}
	}

	getAllNotifyKeySet(header, field, actions) {
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
		this.notifyKeySet = {
			...this.notifyKeySet,
			add: add,
			editable: editable,
			deleteable: deleteable,
			sectionheader: header,
			header: field,
			tableData: [] 
		}
		this.getViewDataTable();
	}

	// addNewRow(e) {
	
	// 	this.iconEdit = true;
	// 	this.notifyKeySet.tableData.unshift(
	// 		{
	// 			taskType: '', status: '', msgType:'',isNotified : '', createdById: "", modifiedById: "", createdDtTm: new Date().toUTCString(),
	// 			modifiedDtTm: new Date().toUTCString(), rowEdit: true
	// 		}
	// 	)
	// }

	addNewRow(event) {
	    console.log("addNewRow");
		this.iconEdit = true;
		event.pagedItems.unshift(
			{
				taskType: '', status: '', msgType:'',isNotified : '', createdById: "", modifiedById: "", createdDtTm: new Date().toUTCString(),
				modifiedDtTm: new Date().toUTCString(), rowEdit: true
			});
        console.log(event.pagedItems);
	}
	prepareRequest(requestObj) : any{
		let reqObj = {
			'statusCodes' : [],
			'taskType' : []
		};
	if(Array.isArray(requestObj['statusCodes'])){
		for(let i =0;i<requestObj['statusCodes'].length;i++){

			reqObj['statusCodes'].push(
				{
					'id' : this.statusCodesValueToStatusCodesIdMap[requestObj['statusCodes'][i]]
				}
			);

		}
	}else{
		reqObj['statusCodes'].push(
			{
				'id' : requestObj['statusCodesId']
			}
		);
	}
	if(Array.isArray(requestObj['taskTypeName'])){
		for(let i =0;i<requestObj['taskTypeName'].length;i++){

			reqObj['taskType'].push(
				{
					'taskName' : requestObj['taskTypeName'][i]
				}
			);

		}
	}else{

		reqObj['taskType'].push(
			{
				'taskName' : requestObj['taskTypeName']
			}
		);
	}
		return reqObj;
	}
	createNotifyKeySet(pagedItems,rowIndex,requestObj) {
		let reqObj = this.prepareRequest(requestObj);
		requestObj['taskType'] = reqObj['taskType'];
		requestObj['statusCodes'] = reqObj['statusCodes'];
		requestObj['modifiedById'] = requestObj['createdById'];
		
		
		// requestObj['taskType' : ]
		this.userProfileService.createNotifyKeySet(requestObj).toPromise().then((response: any) => {
			// this.getViewDataTable();
			// this.showMessage(response, 1);
			// this.IsSuccess = true;
			// this.message = "Created Successfully";


			console.log("set pagedItems = response");
			let i = 0;
			response.forEach(notifyKeySet => {
				if(pagedItems[i]['id']){
					pagedItems.unshift(notifyKeySet);
					// this.pagination.totalRecords++;
				}else{
					pagedItems[i]=notifyKeySet;
				}
			});


			// pagedItems[rowIndex] = response[0];
			console.log(pagedItems);
			this.IsSuccess = true;
			this.message = "Successfully Created";
			setTimeout(() => {
				this.IsSuccess = false;
			}, 15000);
			
		}).catch(error => {
			// this.errorHandlerData(error);
			this.IsError = true;
			this.message = error.error.message;
			setTimeout(() => {
			this.IsError = false;
			}, 15000);
		});
	}

	onEditClick(rowIndex) {
		// this.iconEdit = false;
		// this.iconSave = true;
		let index = 0;
	
		this.notifyKeySet.tableData.forEach(row => {
			if (rowIndex == index) {
				row['rowEdit'] = true;
			}
			index++;
		});
	}


	// onDeleteClick1(rowIndex) {
	// 	this.modalDetails = { ...this.modalDetails, isDeleteConfirm: true,
	// 		 title: "Confirm", className: "deletemodal", 
	// 		 subTitle: "Are you sure that you want to delete the Notify Key Set?", 
	// 		 from: "deletenotifykeyset", rowIndex: rowIndex };
	// 	this.modalChild.showModal();
	// }

	onDeleteClick(data) {
        console.log("deleting..");
		this.modalDetails = { ...this.modalDetails, isDeleteConfirm: true, 
			title: "Confirm", className: "deletemodal", 
			subTitle: "Are you sure that you want to delete the Notify Key Set?", 
			from: "deletenotifykeyset", data: data };
        this.modalChild.showModal();
    }

	onCloseClick(rowIndex) {
		let index = 0;
		const temp = JSON.parse(JSON.stringify(this.notifyKeySettableDataBackup));
		var tempIndex = rowIndex
		if (this.pagination.pageNumber > 1) {
			tempIndex = ((this.pagination.pageNumber - 1) * this.pagination.selectedLimit) + rowIndex;
		}
		
		if (temp.length > rowIndex) {
			for (var val in this.notifyKeySet.tableData[rowIndex]) {
				this.notifyKeySet.tableData[rowIndex][val] = temp[tempIndex][val];
			}
		}
		this.notifyKeySet.tableData[rowIndex]['rowEdit'] = false;
		const rows = this.notifyKeySet.tableData;
		if (rows[rowIndex] && !rows[rowIndex].id) {
			rows.splice(rowIndex, 1);
		}
	}



	onSaveClick(data) {
		console.log("onSaveClick");
		console.log(data);
		var pagedItems = data.pagedItems;
		var rowIndex = data.rowIndex;
		var row = pagedItems[rowIndex];
		if (!row.id) {
			row['createdById'] = this.userInfo.cuid
			this.createNotifyKeySet(pagedItems,rowIndex, row);
			return;
		}
		// update
		row['modifiedById'] = this.userInfo.cuid;
		let reqObj = this.prepareRequest(row);
		row['taskType'] = reqObj['taskType'];
		row['statusCodes'] = reqObj['statusCodes'];
		this.userProfileService.createNotifyKeySet(row)
			.toPromise().then((response: any) => {
				// this.showMessage(response.text, 1);
				this.IsSuccess = true;
				console.log("set pagedItems = response");
				pagedItems[rowIndex] = response[0];
				console.log(pagedItems);
				setTimeout(() => {
					this.IsSuccess = false;
				}, 15000);
				// this.getViewDataTable();
			}).catch(error => {
				this.IsError = true;
				this.message = error.error.message;
				setTimeout(() => {
				this.IsError = false;
				}, 15000);
				});
	}




	// getComponentType(componentStr: string): Type<any> {
	// 	let componentType: Type<any>;
	// 	switch (componentStr) {
	// 		case 'ManageNotificationComponent': componentType = ManageNotificationComponent;
	// 			break;
	// 	}
	// 	return componentType;
	// }
	showMessage(message: string, isSuccess = 0) {
		this.error = {
			type: isSuccess == 1 ?'success': 'danger',
			msg: message
		}
		if(isSuccess == 1) {
			this.modalChild.hideModal();
		}
		setTimeout(() => {
			this.error = {}
		}, 3000);
		// this.snackBar.open(message, "Okay", {
		// 	duration: 15000,
		// });
	}

	onRefresh() {
		this.loaderTaskDetail = true;
        this.getViewDataTable();
    };
}

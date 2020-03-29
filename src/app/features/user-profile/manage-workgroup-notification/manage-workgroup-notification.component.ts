import { Component, OnInit, ViewChild,Type } from '@angular/core';
import { MatSnackBar, MatDialog } from '@angular/material';
import { UserProfileService } from '../user-profile.service';
import { NotificationService } from '@app/core/services';
import { TabService } from '@app/core/tab/tab-service';
import { ModalComponent } from '@app/shared/modal/modal.component';
import { TaskService } from '@app/features/task/task.service';
@Component({
  selector: 'sa-manage-workgroup-notification',
  templateUrl: './manage-workgroup-notification.component.html',
  styleUrls: ['./manage-workgroup-notification.component.css']
})
export class ManageWorkgroupNotificationComponent implements OnInit {
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

	workGroupNotification:any = {
		from: 'workgroupnotification',
		title: 'Workgroup Notification',
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

		this.userProfileService.getPageLayout('Manage Workgroup Notification').toPromise().then(res => {
			// debugger;
			// var response: any = {
			// 	"pageLayoutTemplate": [
			// 	  {
			// 		"sectionHeader": "Workgroup Notification",
			// 		"fieldsList": [
			// 		  {
			// 			"filter": true,
			// 			"fieldName": "workGroupName",
			// 			"visible": true,
			// 			"editable": true,
			// 			"link": false,
			// 			"pageLayoutFieldId": "99946",
			// 			"label": "Work Group",
			// 			"sort": true,
			// 			"type": "MultiSelect",
			// 			"fieldValue": "",
			// 			"class": "systemtype"
			// 		  },
			// 		  {
			// 			"filter": true,
			// 			"fieldName": "notifyKeySetId",
			// 			"visible": true,
			// 			"editable": true,
			// 			"link": false,
			// 			"pageLayoutFieldId": "99947",
			// 			"label": "Notify Key Set",
			// 			"sort": true,
			// 			"type": "MultiSelect",
			// 			"fieldValue": "",
			// 			"class": "systemname"
			// 		  },
			// 		  {
			// 			"filter": true,
			// 			"fieldName": "notificationTypeName",
			// 			"visible": true,
			// 			"editable": true,
			// 			"link": false,
			// 			"pageLayoutFieldId": "99948",
			// 			"label": "Notification Type",
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
			// 		"sectionHeader": "Manage Workgroup Buttons",
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

			let response = res;
			
			this.pagination = response['pageLayoutTemplate'][2].fieldsList[0];
			this.pagination.selectedLimit = 10;
			/* if (localStorage.notifyKeySetPerPage) {
				this.pagination.selectedLimit = localStorage.notifyKeySetPerPage;
			} */
			this.actionButton = response['pageLayoutTemplate'][3].fieldsList;
			this.sectionheader = response['pageLayoutTemplate'][0].sectionHeader
			this.actionColumn =  response['pageLayoutTemplate'][1].fieldsList

			this.pagination.currentPageNumber = 1;
			this.pagination.allItems = [];
            this.pagination.pager = {startIndex: 0, endIndex:  this.pagination.selectedLimit - 1};
			
			this.getAllWorkGroupNotifications(response['pageLayoutTemplate'][0].sectionHeader, response['pageLayoutTemplate'][0].fieldsList, this.actionColumn)
		}).catch(error => { });
	}

	buttonClicked(fromModal) {
		if(fromModal.modal.from == 'deleteworkgroupnotification') {
      this.deleteWgNotifyKeySet(fromModal.modal.data);
    }
	}

	deleteWgNotifyKeySet(event) {

		

		var pagedItems = event.pagedItems;
		var pagedItems = event.pagedItems;
		var rowIndex = event.rowIndex;
        console.log(pagedItems[rowIndex]);
		var id = pagedItems[rowIndex]['id'];

		
		if (!id) {
			this.IsSuccess = false;
			this.IsError = true;
			this.message = "Notify Key Set to be deleted does not have an ID";
			return;
		}


		// var id = this.workGroupNotification.tableData[event['rowIndex']]['id'];
		this.userProfileService.deleteWorkGroupNotification('/Enterprise/v2/Work/notification/deleteWorkGroupNotifyKeySet/', id).
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
		this.getAllWorkGroup();
		this.getAllNotifyKeySet();
		this.getAllNotificationTypes();
		this.userProfileService.getWorkgroupNotifications()
			.subscribe(res => {
				
				let response  = res;
				this.workGroupNotification.tableData = [];
				// var response: any = [
				this.workGroupNotification.tableData =  res;
				this.pagination.totalRecords = res['length'];
				
				this.workGroupNotification.tableData.forEach(row => {
					row['rowEdit'] = false;
				});
				this.notifyKeySettableDataBackup = JSON.parse(JSON.stringify(	this.workGroupNotification.tableData));
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
				this.pagination.allItems  = this.pagination.allItems.concat(this.workGroupNotification.tableData);
				this.loaderTaskDetail = false;
				this.workGroupNotification.tableData = this.workGroupNotification.tableData.slice(limit, this.pagination.selectedLimit * (limit + 1));
				this.pagination.currentPageNumber = 1;				
				this.convertNumberToArray(this.pagination.totalPage);
			}), (err) => {
			}
	}

	getAllWorkGroup(){

		this.taskService.getAllWorkgroups()
		.subscribe(res => {
			this.filter = {};
      var response: any = res;
    //   let response = ["3600 Fallout","Activate L1","Activate L2/3","Activate L2/3 - Disconnect","Activate L2/3 Non Prime","Activate Voice","Akron Field Ops","Alabama Field Ops","Albany Field Ops","Alcatel OOM","AMOF Build Fallout","Amsterdam Field Ops","APAC AMO Disconnects","APAC COIT Activate","APAC COIT Build","APAC Design","APAC Field Ops","APAC Implementation Deployment","APAC Offnet Activation","ASRIRECON","Austin Field Ops","Bakersfield Field Ops","Baltimore Field Ops","Baton Rouge Field Ops","Berlin Field Ops","Binghamton Field Ops","Brussels Field Ops","Buffalo Field Ops","Build L1","Build L2\u0003 Internet","Build L2/3","Build L2/3 - Non Prime","Build Voice","Canceled in SwIFT","CCM Community","Central California Field Ops","CenturyLink Ethernet","Charlotte Field Ops","Cincinnati Field Ops","Cleveland Field Ops","Columbia Field Ops","Columbus, OH Field Ops","Complex ASR Ethernet","CPE Fulfillment Engineers","CPE Refurbishment Team","Customer Assurance","Dallas Field Ops","Dayton, OH Field Ops","Denmark-Norway-Iceland Field Ops","Denver Field Ops","Design","Directory Listing","Dusseldorf Field Ops","Early CNR","El Paso Field Ops","EMEA AMO Disconnects","EMEA COIT Activate","EMEA COIT Build","EMEA DST","EMEA Implementation Deployment","EMEA Logistics Team","EMEA Offnet Activation","Ethernet Activate","Ethernet Build","Ethernet Disconnect","Ethernet DyCap Fallout","Ethernet Order Management","Ethernet Pre-Validation","Ethernet UNI Validation - Central/Mountain","Ethernet UNI Validation - East","Ethernet UNI Validation - West","eWFM Voice","Fallout Intervention Team","FLIGHTDECK_DEFAULT","Frankfurt Field Ops","Ft Lauderdale Field Ops","Ft Worth Field Ops","Georgia Field Ops","Greensboro Field Ops","Greenville Field Ops","Hamburg Field Ops","Hawaii Field Ops","Hong Kong Field Ops","Houston Field Ops","Idaho Field Ops","Illinois Field Ops","Indiana Field Ops","Infosys Team","Inland Empire Field Ops","International Logistics - APAC","Ireland Field Ops","Italy Field Ops","Jacksonville Field Ops","Japan Field Ops","Kansas City Field Ops","Kentucky Field Ops","L2/3 DyCap Fallout","Lake Charles Field Ops","Las Vegas Field Ops","LD 8xx","Level 3 Cable Ethernet","Lexington Field Ops","Little Rock Field Ops","LMOS_SCREENERS","LMOS_SCREENING","London - Braham St Field Ops","London - Docklands Field Ops","London - Goswell RD Field Ops","Los Angeles Field Ops","Louisiana-Mississippi Field Ops","Louisville Field Ops","Managed Secure Services","Managed Secure Services - All Products","Managed Services Design","Manhattan Field Ops","Memphis Field Ops","Michigan Field Ops","Milwaukee Field Ops","Minneapolis Field Ops","Montana Field Ops","Montreal Field Ops","Munich Field Ops","NA CPE Disconnect","NA Offnet Activation","NA PROV Disconnect","Nashville Field Ops","New England Field Ops","New Jersey Field Ops","New Mexico Field Ops","New Orleans Field Ops","NIT","Non Ethernet Order Management","Oakland Field Ops","Offnet Disconnect","Offnet Infrastructure","Offnet LEC Call","Offnet LEC Call - Infra","Oklahoma Field Ops","Old Disconnect","OMG","OOM Scheduling","Orange County Field Ops","Order Assurance","Order Assurance Scheduling","Order Entry","Orlando Field Ops","Paris - GW Field Ops","Philadelphia Field Ops","Phoenix Field Ops","Pittsburgh Field Ops","Port In","Port Out OE","Portland Field Ops","Raleigh Field Ops","RCMAC BOISE","Red Hybrid","Richmond Field Ops","Rochester Field Ops","Sacramento Field Ops","Saint Louis Field Ops","Salt Lake City Field Ops","San Antonio Field Ops","San Diego Field Ops","San Francisco Field Ops","San Jose Field Ops","San Luis Obispo Field Ops","Santa Barbara Field Ops","SAO Support","Seattle Field Ops","Security Advanced Support","Singapore Field Ops","Site Readiness Engineers","South Carolina Field Ops","Spain-Portugal Field Ops","Spokane Field Ops","SPR_Workgroup","Sweeden-Finland-Estonia-Russia Field Ops","Switch Implementation Translations","Switzerland Field Ops","Tampa Field Ops","Toledo Field Ops","Toronto Field Ops","Transport Disconnect","Tucson Field Ops","Tulsa Field Ops","UK - Ireland Field Ops","UK - South Field Ops","UK-Midlands Field Ops","UK-North Field Ops","UK-Southwest Field Ops","Verizon Ethernet","Vermont Field Ops","Voice Services Provisioning","Voice Validate","Warehouse Tech","Washington DC Field Ops","WFM Configuration Group","WFM External Users","Work Optimization Center","Worked in Work Center","Wyoming Field Ops"];
			this.workGroupNotification.header.map((val, index)=> {
				if(val.fieldName=='workGroupName') {
					this.workGroupNotification.header[index]['dropDown'] = response;
				}
			})
	
		}), (err) => {
		}
  }
  
	getAllNotifyKeySet(){

		this.userProfileService.getNotifyKeySet().subscribe(res => {
				const response: any = res;
				this.workGroupNotification.header.map((val, index)=> {
					if(val.fieldName=='notifyKeySetId') {
						this.workGroupNotification.header[index]['dropDown'] = [];
					}
				})
				response.map((val) => {
					this.workGroupNotification.header.map((typeVal, index)=> {
						if(typeVal.fieldName=='notifyKeySetId') {
							this.workGroupNotification.header[index]['dropDown'].push(
									val.id
							);
						}
					})
				})
		});
	}
	getAllNotificationTypes(){
    this.taskService.getNotificationTypes().subscribe(res => {
      const response: any = res;
		this.workGroupNotification.header.map((val, index)=> {
			if(val.fieldName=='notificationTypeName') {
				this.workGroupNotification.header[index]['dropDown'] = [];
			}
    })
    response.systemParameterModels[0].systemParameterItem.map((val) => {
      this.workGroupNotification.header.map((typeVal, index)=> {
        if(typeVal.fieldName=='notificationTypeName') {
          this.workGroupNotification.header[index]['dropDown'].push(
              val.value +','+val.id 
          );
        }
      })
    })
  });
	}
	convertNumberToArray(count:number){
		this.tablePaginationData = [];
		for(let i =1;i<=count;i++){
		  this.tablePaginationData.push(i);
		}
	}

	getAllWorkGroupNotifications(header, field, actions) {
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
		this.workGroupNotification = {
			...this.workGroupNotification,
			add: add,
			editable: editable,
			deleteable: deleteable,
			sectionheader: header,
			header: field,
			tableData: [] 
		}
		this.getViewDataTable();
	}

	addNewRow(event) {
	
		this.iconEdit = true;
		
		event.pagedItems.unshift(
			{
				workGroupName: '', workGroupId: '', notifyKeySetId:'',notificationType : '', createdById: "", modifiedById: "", createdDtTm: new Date().toUTCString(),
				modifiedDtTm: new Date().toUTCString(), rowEdit: true
			}
		)
	}
	prepareRequest(requestObj) : any{
		let reqObj = {
      'workGroups' : [],
      'notifykeysets' : [],
			'notificationType' : []
    };
    if(Array.isArray(requestObj['workGroupName'])){
		for(let i =0;i<requestObj['workGroupName'].length;i++){

			if(requestObj['workGroupName'][i] != ""){
		
				reqObj['workGroups'].push(
					{
						'name' : requestObj['workGroupName'][i]
					}
				);
			}

    }
  }else{
    reqObj['workGroups'].push(
      {
        'name' : requestObj['workGroupName']
      }
    );
  }

  if(Array.isArray(requestObj['notifyKeySetId'])){
		for(let i =0;i<requestObj['notifyKeySetId'].length;i++){

			reqObj['notifykeysets'].push(
				{
					'id' : requestObj['notifyKeySetId'][i]
				}
			);

    }
  }else{
    reqObj['notifykeysets'].push(
      {
        'id' : requestObj['notifyKeySetId']
      }
    );
  }
    // for(let i =0;i<requestObj['notifyKeySetId'].length;i++){

			reqObj['notificationType'].push(
				{
					'id' : requestObj['notificationTypeName'].split(',').length>1?requestObj['notificationTypeName'].split(',')[1]:requestObj['notificationTypeId']
				}
			);

		// }
		return reqObj;
	}
	createWorkGroupNotification(pagedItems,rowIndex,requestObj) {
		let reqObj = this.prepareRequest(requestObj);
		requestObj['workGroups'] = reqObj['workGroups'];
    requestObj['notifykeysets'] = reqObj['notifykeysets'];
		requestObj['notificationType'] = reqObj['notificationType'];
		requestObj['modifiedById'] = requestObj['createdById'];
		
		
		// requestObj['taskType' : ]
		this.userProfileService.createWorkGroupNotification(requestObj).toPromise().then((response: any) => {
		

			let i = 0;
			response.forEach(wgNotifyKeySet => {
				if(pagedItems[i]['id']){
					pagedItems.unshift(wgNotifyKeySet);
					// this.pagination.totalRecords++;
				}else{
					pagedItems[i]=wgNotifyKeySet;
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
	
		this.workGroupNotification.tableData.forEach(row => {
			if (rowIndex == index) {
				row['rowEdit'] = true;
			}
			index++;
		});
	}


	onDeleteClick(data) {
		this.modalDetails = { ...this.modalDetails, isDeleteConfirm: true, 
			title: "Confirm", className: "deletemodal", 
			subTitle: "Are you sure that you want to delete the Workgroup Notification?", 
			from: "deleteworkgroupnotification", data: data };
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
			for (var val in this.workGroupNotification.tableData[rowIndex]) {
				this.workGroupNotification.tableData[rowIndex][val] = temp[tempIndex][val];
			}
		}
		this.workGroupNotification.tableData[rowIndex]['rowEdit'] = false;
		const rows = this.workGroupNotification.tableData;
		if (rows[rowIndex] && !rows[rowIndex].id) {
			rows.splice(rowIndex, 1);
		}
	}

	onSaveClick(event) {

		console.log(event);
		var pagedItems = event.pagedItems;
		var rowIndex = event.rowIndex;
		var row = pagedItems[rowIndex];

		// const rows = this.workGroupNotification.tableData;
		// let row = rows[event['rowIndex']];
		if (!row.id) {
			row['createdById'] = this.userInfo.cuid
			this.createWorkGroupNotification(pagedItems, rowIndex,row);
			return;
		}
		else {
			// update
      row['modifiedById'] = this.userInfo.cuid;
      let reqObj =this.prepareRequest(row);
      row['workGroups'] = reqObj['workGroups'];
      row['notifykeysets'] = reqObj['notifykeysets'];
      row['notificationType'] = reqObj['notificationType'];
			this.userProfileService.createWorkGroupNotification(row)
				.toPromise().then((response: any) => {
					// this.showMessage(response.text, 1);
					// this.IsSuccess = true;
					// this.message = response.text;
					// setTimeout(() => {
					// this.IsSuccess = false;
					// }, 15000);

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
}

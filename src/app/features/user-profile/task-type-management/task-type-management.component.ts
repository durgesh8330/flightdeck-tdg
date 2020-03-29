import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Type, ViewChild } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { NotificationService } from '@app/core/services';
import { TabService } from '@app/core/tab/tab-service';
import { Tab } from '@app/core/tab/tab.model';
import { SystemParametersDetailsComponent } from '@app/features/user-profile/system-parameters-details/system-parameters-details.component';
import { ModalComponent } from '@app/shared/modal/modal.component';
import { environment } from '@env/environment';
import { UserProfileService } from '../user-profile.service';
import { TableComponent } from '@app/shared/table/table.component';
declare var jsPDF: any;

@Component({
  selector: 'sa-task-type-management',
  templateUrl: './task-type-management.component.html',
  styleUrls: ['./task-type-management.component.css']
})
export class TaskTypeManagementComponent implements OnInit {
  @ViewChild(ModalComponent) modalChild: ModalComponent;
	@ViewChild(TableComponent) tableComponent: TableComponent;
	
	public currentPageLimit: number = 10;
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
	loaderSystemParameters = true;
	pagination: any = {};
	actionButton:any = [];
	actionColumn:any = [];
	error:any = {}
	systemParameter:any = {
			from: 'systemparameter',
			title: 'System Parameter',
			isSortAsc: false,
			globalSearch: ''
	};
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
        className: "deletemodal",
        from: "deletemodal",
        isDeleteConfirm: false 
	};

	constructor(private userProfileService: UserProfileService, private dialog: MatDialog,
		private snackBar: MatSnackBar, private notificationService: NotificationService, 
		private tabService: TabService, 
		private httpClient: HttpClient
		//@Inject(forwardRef(() => TableComponent)) private _parent:TableComponent
		) {
		userProfileService.getPageLayout('Task Type Management Table').toPromise().then(res => {
			var response: any = res;	
			this.pagination = response.pageLayoutTemplate[2].fieldsList[0];
			this.pagination.selectedLimit = 10;
			/* if (localStorage.systemParameterPerPage) {
				this.pagination.selectedLimit = localStorage.systemParameterPerPage;
			} */
			this.actionButton = response.pageLayoutTemplate[3].fieldsList;
			this.sectionheader = response.pageLayoutTemplate[0].sectionHeader
			this.actionColumn =  response.pageLayoutTemplate[1].fieldsList

			this.pagination.currentPageNumber = 1;
			this.pagination.allItems = [];
            this.pagination.pager = {startIndex: 0, endIndex:  this.pagination.selectedLimit - 1};
			
			this.getSystemParamters(response.pageLayoutTemplate[0].sectionHeader, response.pageLayoutTemplate[0].fieldsList, this.actionColumn)
		}).catch(error => { });

	}

	ngOnInit() {
		this.userInfo = JSON.parse(localStorage.getItem('fd_user'));
	}

	getSystemParamters(header, field, actions) {
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
		this.systemParameter = {
			...this.systemParameter,
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
		// this.userProfileService.getSystemData("?type=List of Values&name=System Parameter Types&include=spi")
		// .subscribe(res => {
		// 	this.filter = {};
		// 	var response: any = res;
		// 	this.systemParameter.header.map((val, index)=> {
		// 		if(val.fieldName=='type') {
		// 			this.systemParameter.header[index]['dropDown'] = [];
		// 		}
		// 	})
		// 	response.systemParameterModels[0].systemParameterItem.map((val) => {
		// 		this.systemParameter.header.map((typeVal, index)=> {
		// 			if(typeVal.fieldName=='type') {
		// 				this.systemParameter.header[index]['dropDown'].push(val.value)
		// 			}
		// 		})
		// 	})
		// }), (err) => {
		// }
		this.userProfileService.getTaskTypeData("")
			.subscribe((res: any) => {
			    console.log(res);
				this.systemParameter.tableData = [];
				this.systemParameter.tableData =  res;
				this.pagination.totalRecords = res.length;
				
				this.systemParameter.tableData.forEach(row => {
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
				this.pagination.allItems  = this.pagination.allItems.concat(this.systemParameter.tableData);
				this.loaderSystemParameters = false;
				this.systemParameter.tableData = this.systemParameter.tableData.slice(limit, this.pagination.selectedLimit * (limit + 1));
				this.pagination.currentPageNumber = 1;				
				this.convertNumberToArray(this.pagination.totalPage);
			}), (err) => {
			}
	}
	
	onSaveClick(data) {
		var pagedItems = data.pagedItems;
		var rowIndex = data.rowIndex;
		var sysParam = pagedItems[rowIndex];
		if (!sysParam.id) {
			sysParam['createdById'] = this.userInfo.cuid
			this.createSystemParameter(pagedItems, rowIndex, sysParam);
			return;
		}
		// update
		sysParam['modifiedById'] = this.userInfo.cuid
		this.httpClient.put(environment.apiUrl+"/Enterprise/v2/Work/taskType/"+sysParam.id, sysParam)
			.toPromise().then((response: any) => {
				this.setMessage(true, "Successfully updated the item with name: "+ response.taskName);
				pagedItems.splice(rowIndex, 1, response);
				this.tableComponent.updateItemInAllItems(response);
			}).catch(error => {
				this.setMessage(true, error.error.message);
			});
	}

	createSystemParameter(pagedItems, rowIndex, requestObj) {
		this.httpClient.post(environment.apiUrl+"/Enterprise/v2/Work/taskType", requestObj)
			.toPromise().then((response: any) => {
			pagedItems.splice(rowIndex, 1,response);
			this.pagination.allItems.push(response);
			this.pagination.totalRecords = this.pagination.allItems.length;
			this.tableComponent.setPage(this.tableComponent.pager.currentPage);
			this.setMessage(true, "Created new item with name: " + response.taskName);
		}).catch(error => {
			this.setMessage(false, error.error.message);
			this.tableComponent.setPage(this.tableComponent.pager.currentPage);
		});
	}

    onDeleteClick(data) {
        console.log("onDeleteClick(data)");
		this.modalDetails = { ...this.modalDetails, isDeleteConfirm: true, 
			title: "Confirm", className: "deletemodal", 
			subTitle: "Are you sure that you want to delete the Task Type Management?", 
			from: "deletetaskType", data: data };
        this.modalChild.showModal();
    }

	buttonClicked(fromModal) {
        console.log("buttonClicked(fromModal)");
		if(fromModal.modal.from == 'deletetaskType') {
          this.deleteSystemParameter(fromModal.modal.data);
        }
	}

    deleteSystemParameter(data) {
		var pagedItems = data.pagedItems;
		var rowIndex = data.rowIndex;
		var id = pagedItems[rowIndex]['id'];
		if (!id) {
			this.setMessage(false, "Task Type to be deleted does not have an ID");
			this.modalChild.setErrorMessage(this.message);
			return;
		}
        this.httpClient.delete(environment.apiUrl+'/Enterprise/v2/Work/taskType/' + id).
            toPromise().then((apiResp: any) => {
				if (apiResp.code == 200) {
					this.setMessage(true, apiResp.message);
					pagedItems.splice(rowIndex,1);
					this.tableComponent.removeItemFromAllItems(id);
					this.modalChild.hideModal();
				} else {
					this.setMessage(false, "Error from delete: " + apiResp.message);
					this.modalChild.hideModal();
				}
            })
            .catch(data => { 
				this.setMessage(false, data.error.message);
				//this.modalChild.setErrorMessage(data.message);
				this.modalChild.hideModal();});
	}
	
	addNewRow(event) {
		this.iconEdit = true;
		event.pagedItems.unshift({
            name: '', desc: '', createdById: "", modifiedById: "", createdDateTime: new Date().toUTCString(),
            modifiedDeteTime: new Date().toUTCString(), rowEdit: true
        });
        console.log(event.pagedItems);
	}
	
	openTab(event) {
		if (event.link) {
			localStorage.systemId = event.task.id;
			localStorage.TaskTypeName = event.name;
			localStorage.systempageLayoutName = 'taskTypeLayout'; //'taskTypeLayout';
			let tab = new Tab(this.getComponentType('SystemParametersDetailsComponent'),  event.name, '/TaskTypeDetails/', {});
			this.tabService.openTab(tab);
		}
	}

	getComponentType(componentStr: string): Type<any> {
		let componentType: Type<any>;
		switch (componentStr) {
			case 'SystemParametersDetailsComponent': componentType = SystemParametersDetailsComponent;
				break;
		}
		return componentType;
	}
		
	nextItems(){
		this.previousDisable= false;
		this.nextDisable = false;
		let totalPages = Math.ceil(this.pagination.totalRecords / 100) ;
		
		let nextPage = this.pagination.pageNumber +1;
		if( nextPage == totalPages){
		  this.nextDisable = true;
		}
		this.pagination.pageNumber = nextPage;
	}

	convertNumberToArray(count:number){
		this.tablePaginationData = [];
		for(let i =1;i<=count;i++){
		  this.tablePaginationData.push(i);
		}
	}

    private setMessage(success: boolean, message: string) {
        this.IsSuccess = success;
        this.IsError = !success;
		this.message = message;
		if (this.IsSuccess) {
			setTimeout(() => {
				this.IsSuccess = false;
			}, 5000);
		}

		if (this.IsError) {
			setTimeout(() => {
				this.IsError = false;
			}, 5000);
		}
	}

	onRefresh() {
		this.loaderSystemParameters = true;
        this.getViewDataTable();
	};
}

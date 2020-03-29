import { AfterViewInit, ChangeDetectorRef, Component, OnChanges, OnInit, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { TabService } from '@app/core/tab/tab-service';
import { UserProfileService } from '@app/features/user-profile/user-profile.service';
import * as _ from 'lodash';
import { BsModalService } from 'ngx-bootstrap/modal';
import printJS from 'print-js';
import { combineLatest, Subscription } from 'rxjs';
import { isArray, isBoolean, isObject } from 'util';
import { DataStorageService } from '../data-storage.service';
import { MyAbstractTask } from '../my-abstract-task';
import { TaskService } from '../task.service';


declare var jsPDF: any;
declare const $: any;

@Component({
	selector: 'sa-task-results',
	templateUrl: './task-results.component.html',
	styleUrls: ['./task-results.component.scss']
})
export class TaskResultsComponent extends MyAbstractTask {
	
	displayedColumns: string[] = ['view', 'appTaskInstanceId', 'taskStatus', 'application', 'claimId', 'sourceSystem', 'createdById', 'createdDateTime'];

	taskresultwodgetwa = 'taskresultwidget';

	searchText: string;
	selected = [];
	taskInstance: string = '';
	taskStatus: string = '';
	applicationName: string = '';
	assignedCuid: string = '';
	claimId: string = '';
	sourceSystem: string = '';
	createdById: string = '';
	hideTaskInstanceSearch: boolean = true;
	createdDateTime: string = '';
	isSortAsc: boolean = false;

	PageLength = 0;
	
	IsSuccess = false;
	message = '';
	IsError = false;
	
	//Json for search result//
	CustomerContacted: any = ['Yes', 'No'];
	RerouteResult: any = ['Affecting Service', 'Out of Service'];

	constructor(protected tabService: TabService, protected dataStorageService: DataStorageService
		, protected taskService: TaskService, protected snackBar: MatSnackBar,
		protected modalService: BsModalService, protected userProfileService: UserProfileService, public _ref: ChangeDetectorRef) {
		// var tableMinResult = this.dataStorageService.getData().slice(0, 5000);
		// console.log(tableMinResult);
		super(tabService, taskService, snackBar, dataStorageService, 'Task Results', modalService, userProfileService, _ref);
		
	}

	getWorkgroupListValues(){
		if(this.workgroupList != null && this.workgroupList.length==0){
			this.taskService.getWorkgroups().toPromise().then((response: any) => {
				this.taskService.workGroups.next(response);
				this.workgroupList = response;

			}).catch((errorObj: any) => {
				console.error(errorObj);
				this.loader = false;
				this.loaderLmosTaskPopup = false;
			});
		}
	}

	printData() {
		var columns = [];
		console.log(this.displayTaskHeaders);
		this.actionColumn.forEach(element => {
			if (element.visible === true) {
				const obj = {};
				obj['title'] = element.label;
				obj['dataKey'] = element.key;
				columns.push(element.key);
			}
		});
		console.log(columns);
		console.log(this.taskResults);

		printJS({ printable: this.taskResults, properties: columns, type: 'json' });
	}

	printPDF() {
		var columns = [];
		console.log(this.displayTaskHeaders);
		this.actionColumn.forEach(element => {
			if (element.visible === true) {
				const obj = {};
				obj['title'] = element.label;
				obj['dataKey'] = element.key;
				columns.push(obj);
			}
		});

		var rows = this.taskResults;
		var doc = new jsPDF('p', 'pt');
		doc.autoTable(columns, rows, {
			theme: 'grid',
			styles: { fontStyle: 'normal', fontSize: 8, overflow: 'linebreak' },
			addPageContent: function (data) {
				doc.text("Task Result", 30, 20);
			}
		});
		doc.save('TaskResult.pdf');

	}

	onTaskStatusEding(taskId: string, isEditing: boolean) {
		this.taskResults.map(item => {
			if (taskId === item.taskId && isEditing) {
				item.isStatusEditing = true;
			} else {
				item.isStatusEditing = false;
			}
		});
	}
	/* 
	  applyFilter(filterValue: string) {
		const searchValue = filterValue.trim().toLowerCase();
		this.dataSource.filter = searchValue;
	
		const temp = this.tempTaskResult.filter(function (item) {
		  if ((item.appTaskInstanceId.toLowerCase().indexOf(searchValue) !== -1 || (item.application && item.application.toLowerCase().indexOf(searchValue) != -1) ||
			(item.claimId && item.claimId.toLowerCase().indexOf(searchValue) != -1) ||
			(item.createdById && item.createdById.toLowerCase().indexOf(searchValue) != -1) ||
			(item.taskStatus.toString() && item.taskStatus.toString().toLowerCase().indexOf(searchValue) != -1))) {
			return true;
		  } else {
			return false;
		  }
		});
		this.taskResults = temp;
	  }
	 */

	editing = {};

	toggleExpandGroup(group) {
		console.log('Toggled Expand Group!', group);
	}

	onDetailToggle(event) {
		console.log('Detail Toggled', event);
	}

	filterTaskResult(columnName: string) {
		let thi = this;
		// console.log(thi);
		// console.log(this.systemParameter.globalSearch);
		const globalSearch = this.systemParameter.globalSearch;
		console.log("task results filter task results this.systemParameter ====>",this.systemParameter)

		// console.log(this.taskResults);
		let temp: any;
		if (globalSearch !== '') {
			temp = this.tempTaskResult.filter(row => {
				var result = {};
				for (var key in row) {
					let value = row[key];
					if (isBoolean(row[key])) {
						value = (row[key]) ? 'true' : 'false';
					}
					if (isObject(value) === false && isArray(value) === false) {
						if (row.hasOwnProperty(key) && value && value.toUpperCase().indexOf(globalSearch.toUpperCase()) !== -1) {
							result[key] = value;
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
			temp = this.tempTaskResult.filter(function (item) {
				let flag = true;
				// console.log(item);
				Object.keys(item).forEach((element) => {
					// console.log(thi.actionColumn[element], item[element]);
					if (flag && thi.actionColumn[element] && item[element] && thi.actionColumn[element] != "") {
						if (flag && item[element].toLowerCase().indexOf(thi.actionColumn[element].toLowerCase()) === -1) {
							flag = false;
						}
					}
				});
				return flag;
			});
		}
		this.taskResults = temp;
	}
	getRowClass = (row) => {
		return {
			'row-color': true
		};
	}

	viewerFn(fieldname) {
		if (fieldname == 'Pdf') {
			this.printPDF();
		} else if (fieldname == "Print") {
			this.printData();
		}
	}

	expandRow(event: any) {
		this.onRowDetailClick(event.data, event.index);
	}

	CloseLmosButtonPopup() {
		// this.showCancelSection = false;
		this.modalService.hide(1);
		setTimeout(() => {
			console.log('Update');
			this.showCancelSection = false;
		}, 500);

		this.IsOpenPopup = false;
	}
	
	private causeCodeChanged(fieldType: string) {
		setTimeout((fieldType: string) => {
			this.loaderLmosTaskPopup = true;
			if (fieldType == 'parent') {
				const selectedValue = this.closePopupObj.parentCauseCode.split(' - ')[0]
				var parentData = this.causeCodesObjArr.find(x => x.value == selectedValue);
				this.userProfileService.getV2SystemParameterItemData(parentData.id).toPromise().then((response: any) => {
					this.loaderLmosTaskPopup = false;
					var childData = response.systemParameterItem.find(x => x.value == selectedValue);
					this.causeCodesChildObjArr = response.systemParameterItem;
					console.log(response);
					console.log(this.causeCodesChildObjArr);
					this.causeChildCodes = [];
					this.causeCodesChildObjArr.forEach((parentObj: any) => {
						this.causeChildCodes.push(parentObj.value + ' - ' + parentObj.description);
					})
				});
			} else if (fieldType == 'child') {
				const parentValue = this.closePopupObj.parentCauseCode.split(' - ')[0];
				const selectedValue = this.closePopupObj.childCauseCode.split(' - ')[0];
				var parentData = this.causeCodesObjArr.find(x => x.value == parentValue);
				var childData = this.causeCodesChildObjArr.find(x => x.value == selectedValue);
				this.userProfileService.getV2SystemParameterItemData(childData.id).toPromise().then((response: any) => {
					this.loaderLmosTaskPopup = false;
					var childData = response.systemParameterItem.find(x => x.value == selectedValue);
					this.causeGrandChildCodes = [];
					response.systemParameterItem.forEach((parentObj: any) => {
						this.causeGrandChildCodes.push(parentObj.value + ' - ' + parentObj.description);
					})
				});
			}
		}, 100, fieldType);
	}

	private dispositionCodeChanged(fieldType: string) {
		setTimeout((fieldType: string) => {
			if (fieldType == 'parent') {
				const selectedValue = this.closePopupObj.parentDispositionCode.split(' - ')[0]
				this.dispositionChildCodes = [];
				const parentValue = this.closePopupObj.parentDispositionCode.split(' - ')[0];
				var parentData = this.dispositionCodesObjArr.find(x => x.value == parentValue);
				this.userProfileService.getV2SystemParameterItemData(parentData.id).toPromise().then((response: any) => {
					this.dispositionCodesChildObjArr = response.systemParameterItem;
					this.dispositionChildCodes = [];
					this.dispositionCodesChildObjArr.forEach((parentObj: any) => {
						this.dispositionChildCodes.push(parentObj.value + ' - ' + parentObj.description);
					})
				});
			} else if (fieldType == 'child') {
				const selectedValue = this.closePopupObj.childDispositionCode.split(' - ')[0]
				var childData = this.dispositionCodesChildObjArr.find(x => x.value == selectedValue);
				this.userProfileService.getV2SystemParameterItemData(childData.id).toPromise().then((response: any) => {
					this.dispositionGrandChildCodes = [];
					response.systemParameterItem.forEach((parentObj: any) => {
						this.dispositionGrandChildCodes.push(parentObj.value + ' - ' + parentObj.description);
					})
				});
			}
		}, 100, fieldType);
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
			// console.log(this.closePopupObj.parentDispositionCode, this.closePopupObj.childDispositionCode, this.closePopupObj.grandChildDispositionCode);
			// console.log(this.closePopupObj.parentCauseCode, this.closePopupObj.childCauseCode, this.closePopupObj.grandChildCauseCode);
			// console.log(this.closePopupObj.customerContacted);
			// console.log(this.closePopupObj.comment);
			// console.log(this.closePopupObj.fl2, this.closePopupObj.fl3);
			// console.log(this.closePopupObj.backtime, this.closePopupObj.closeOutDateTime, this.closePopupObj.timezone);
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
		} else if (this.showRerouteSection) {
			return (this.transferTo != '' && this.comment != '' && this.RerouteResultvalue != '') ? false : true;
		} else {
			return true;
		}
	}
}

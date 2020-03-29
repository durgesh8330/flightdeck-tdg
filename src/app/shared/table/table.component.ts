import { Component, EventEmitter, Input, OnInit, Output,ViewChild,ElementRef } from '@angular/core';
import * as _ from 'lodash';
import printJS from 'print-js';
import { PagerService } from './pager.service';
import { LocalDateTimeService } from '@app/core/services/local-date-time.service';
declare var jsPDF: any;
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { TaskService } from '@app/features/task/task.service';


@Component({
	selector: 'sa-table',
	templateUrl: './table.component.html',
	styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

	@Input('actionButton') actionButton: any = [];
	@Input('actionColumn') actionColumn: any = [];
	@Input('defaultActionColumns') defaultActionColumns: any = [];
	@Input('pagination') pagination: any = {};
	@Input('paginationLimitOption') paginationLimitOption: any = null;
	@Input('tableHeader') tableHeader: any = [];
	@Input('tableData') tableData: any = [];
	@Input('filter') filter: any = {};
	@Input('error') error: any = {};
	@Input('tablePaginationData') tablePaginationData: any = [];

	@Input('tableOtherContent') tableOtherContent: any = {
		title: 'Table data',
		globalSearch: '',
		from: ''
	};
	@Input('exportValues') exportValues : any = [];
	@Input('actionList') actionList: any = [];
	@Input('metaList') metaList: any = [];
	@Input('clikedMetaValue') clikedMetaValue: any;
	@Output() addNewRowParent = new EventEmitter();
	@Output() onSaveParent = new EventEmitter();
	@Output() pageChangedParent = new EventEmitter();
	@Output() onEditParent = new EventEmitter();
	@Output() onDeleteParent = new EventEmitter();
	@Output() onCloseParent = new EventEmitter();
	@Output() paginationChangeParent = new EventEmitter();
	@Output() openTabParent = new EventEmitter();
	@Output() onSortParent = new EventEmitter();
	@Output() expandRow = new EventEmitter();
	@Output() nextAll = new EventEmitter();
	@Output() onDeleteMember = new EventEmitter();
	@Output() OnActionChangeStatus = new EventEmitter();
	@Output() onActionStatusSubmit = new EventEmitter();
	@Output() CheckUncheckAllRows = new EventEmitter();
	@Output() SetActionDropdown = new EventEmitter();
	@Output() showAdditionalDetailsParent = new EventEmitter();
	@Output() refresh = new EventEmitter();
	@Output() metadetails = new EventEmitter();
	@Output() onMetaSubmit = new EventEmitter();
	@ViewChild('TABLE') table: ElementRef;
	// animate add button for 500ms
	activeAnimation = -1
	activeSort = '';
	dragIndex = 0;
	showfilter = true;

	isSortAsc: boolean = false;
	tempResult: any = [];

	options : any;
	loader: boolean = false;
	public listHeader;
	public userPreferedColumn;
	public draggedHeader=[];
	public uPreference;

	@Input('tableComponent') tableComponent: any = {
		title: 'sa-table'
	  };

	constructor(private pagerService: PagerService, private dateConvertor: LocalDateTimeService, private taskService: TaskService) {
	}

	// pager object
	pager: any = {};

	// paged items
	pagedItems: any[];
	filteredItems: any[];

	totalItemsCount: number = 0;
	metaClicked ='';
	fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
	fileExtension = '.xlsx';
	// public newHeader =["Task Status","Work Type"]
	public test = '';
	public displayheader;
	public getLocalUserPreference;

	ngOnInit() {
		console.log(this.pagination);
		console.log(this.tableData);
		console.log(this.tablePaginationData);
		console.log(this.tableOtherContent);

		this.tableHeader = this.filterUserPreferedColumn(this.tableHeader);
		this.options = {
			multiple: true,
			tags: true
		  };

		// initialize to page 1
		// setTimeout(() => {
			
		// }, 2000);
		this.setPage(this.pagination.currentPageNumber);
	}
	filterUserPreferedColumn(tableHeader):any {
		if(!(JSON.parse(localStorage.getItem('fd_user')).appsList[0].userPreference)){
          return tableHeader
		}else{
			try{
				this.userPreferedColumn = JSON.parse(JSON.parse(localStorage.getItem('fd_user')).appsList[0].userPreference)[this.tableOtherContent['from']];
   
			}catch(e){
			   this.userPreferedColumn = JSON.parse(localStorage.getItem('fd_user')).appsList[0].userPreference[this.tableOtherContent['from']];
   
			}
		}
		
		let newHeader = [];
		if (this.userPreferedColumn && this.userPreferedColumn.length > 0) {
			for (let index = 0; index < this.userPreferedColumn.length; index++) {
				for (let j = 0; j < tableHeader.length; j++) {
					if(!tableHeader[j]['position']){
						tableHeader[j].visible = false;
						if (tableHeader[j].label == this.userPreferedColumn[index]) {
						tableHeader[j].visible = true;
						tableHeader[j]['position']=index+1;
						newHeader.push(tableHeader[j]);
					
					}
				}
			}

			}
			for(let index=0; index<tableHeader.length;index++){
				if(!(tableHeader[index]['visible']==true)){
					newHeader.push(tableHeader[index]);
				}
			}
			this.actionColumn = newHeader;
			return newHeader;
		}
		/* GETCWM-13138 */
		else if (this.defaultActionColumns && this.defaultActionColumns.length > 0){
			this.actionColumn = this.defaultActionColumns;
			return this.defaultActionColumns;
		}
		return tableHeader;
	}
	
	sortTableColumnByPreferedOrder(tableHeader:[]) : any{
		let preferedOrderTableColumn = [];
		console.log("newwwww",tableHeader);
		// let high=0;
		for(let i = 0; i < tableHeader.length; i++)
		{
			if(tableHeader[i]['visible']==true){
				 //preferedOrderTableColumn[tableHeader[i]['position']]= tableHeader[i];
					preferedOrderTableColumn.push(tableHeader[i]);
					tableHeader.splice(i,1);


			}
			else {
				// preferedOrderTableColumn[preferedOrderTableColumn.length-1]=tableHeader[i];
				// preferedOrderTableColumn[preferedOrderTableColumn[preferedOrderTableColumn.length>0?preferedOrderTableColumn.length-1:preferedOrderTableColumn.length]]=tableHeader[i];
			}
		}
		
	
		
		console.log('old',tableHeader);
		//preferedOrderTableColumn.concat(tableHeader)
		console.log('orderedafter',preferedOrderTableColumn);
		return preferedOrderTableColumn;
		
	}
	setPage(page: number) {
		this.loader = true;
		// get current page of items
		if (this.pagination.allItems == undefined) {
			return;
		}
		this.filteredItems = this.filterResults();
		
		this.totalItemsCount = this.pagination.totalRecords;
		if(this.filteredItems.length < this.pagination.allItems.length) {
			this.totalItemsCount  = this.filteredItems.length;		
		} 

		// get pager object from service
		this.pager = this.pagerService.getPager(this.totalItemsCount, page, this.pagination.selectedLimit );
		
		this.pagination.currentPageNumber = page;
		if (this.pager.endIndex > this.filteredItems.length) {
			this.pagination.pageNumber = this.pagination.allItems.length; //this.pagination.pageNumber + this.pagination.maxPageLimit;
			this.calculatePaginationRange();
			//this.pagination.pageSize = this.pagination.maxPageLimit;
			this.nextTasks();
		} else {
			this.pagedItems = this.filteredItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
			for (let index = 0; index < this.pagedItems.length; index++) {
				this.pagedItems[index]['createdDtTm'] = this.dateConvertor.LocalDate(this.pagedItems[index]['createdDtTm']);
				this.pagedItems[index]['commitDate'] = this.dateConvertor.LocalDate(this.pagedItems[index]['commitDate']);
				this.pagedItems[index]['custRequestedDueDate'] = this.dateConvertor.LocalDate(this.pagedItems[index]['custRequestedDueDate']);
				this.pagedItems[index]['modifiedDtTm'] = this.dateConvertor.LocalDate(this.pagedItems[index]['modifiedDtTm']);
				this.pagedItems[index]['receipt'] = this.dateConvertor.LocalDate(this.pagedItems[index]['receipt']);
				this.pagedItems[index]['taskDueDate'] = this.dateConvertor.LocalDate(this.pagedItems[index]['taskDueDate']);
			}
			this.loader = false;
		}
		console.log(this.pagedItems);
		this.tempResult = this.pagedItems;
	}

	calculatePaginationRange() {
		var records = this.pagination.pageNumber;
		while (this.pager.endIndex > records) {
			this.pagination.pageSize += this.pagination.maxPageLimit;
			records = this.pagination.pageSize;
		}
		this.pagination.pageSize = this.pagination.pageSize - this.pagination.pageNumber;
	}

	setLastPage(page: number) {
		this.pagination.currentPageNumber = page;
		this.pagination.pageNumber = this.pagination.allItems.length; //this.pagination.pageNumber + this.pagination.maxPageLimit;
		this.pagination.pageSize = this.pagination.totalRecords;

		if (this.pagination.allItems.length < this.pagination.totalRecords) {
			this.nextTasks();
		} else {
			this.setPage(page);
		}
	}

	pageChanged(event) {
		if (this.tableOtherContent.from == 'systemparameter' || this.tableOtherContent.from == 'systemparameteritem' || this.tableOtherContent.from == 'systemparameteritem') {
			this.pageChangedParent.emit(event);
		} else {
			this.pageChangedParent.emit(event);
		}
	}

	filterColumn() { 
		this.filteredItems = this.filterResults();

		this.totalItemsCount = this.filteredItems.length;
		if(this.filteredItems.length === this.pagination.allItems.length) {
			this.totalItemsCount  = this.pagination.totalRecords;  
		} 
		for (let index = 0; index < this.pagination.allItems.length; index++) {
			this.pagination.allItems[index]['createdDtTm'] = this.dateConvertor.LocalDate(this.pagination.allItems[index]['createdDtTm']);
		}
		this.pager = this.pagerService.getPager(this.totalItemsCount, 1, this.pagination.selectedLimit );
		this.pagination.currentPageNumber = 1;
		this.pagedItems = this.filteredItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
	}

	filterResults() {
		let thi = this;
		const globalSearch = this.tableOtherContent.globalSearch;
		let temp = [];
		var tempFullData = this.pagination.allItems;

		for (var value in this.filter) {
			if(this.filter[value]=="") {
				delete  this.filter[value];
				continue;
			}
			temp = tempFullData.filter(row => {
				if (row[value] && row[value].toUpperCase().indexOf(this.filter[value].toUpperCase()) !== -1)
					return true;
				else
					return false;
			});
			tempFullData = temp;
		}

		if (Object.keys(this.filter).length == 0) {
			temp = JSON.parse(JSON.stringify(this.pagination.allItems));
		}
		
		var headerVisible = this.tableOtherContent.header.map((value)=> {
			if(value.visible) {
				return value.fieldName
			} 
		})
		if(this.tableOtherContent.globalSearch) {
			temp = temp.filter(row => {
				var result = {};
				for (var key in row) {
					if (headerVisible.indexOf(key) > -1 && row.hasOwnProperty(key) && row[key] && row[key].toUpperCase().indexOf(this.tableOtherContent.globalSearch.toUpperCase()) !== -1) {
							result[key] = row[key];
					}
				}
				if (Object.keys(result).length == 0) {
						return false;
					} else {
						return true;
					}
			});
		}

		return temp;
		
		/* if (globalSearch !== '') {
			temp = this.allItems.filter(row => {
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
			temp = this.allItems.filter(function (item) {
				let flag = true;
				Object.keys(item).forEach((element) => {
					if (flag && thi.actionColumn[element] && item[element] && thi.actionColumn[element] != "") {
						if(flag && item[element].toLowerCase() === null || item[element].toLowerCase().length ===0) {
							flag = false;
						} else if (flag && item[element].toLowerCase().indexOf(thi.actionColumn[element].toLowerCase()) === -1) {
							flag = false;
						}
					}
				});
				return flag;
			});
		}
		return temp; */
	}

	onSortSelection(columnName) {
		this.activeSort = columnName;
		if (this.tableOtherContent.from == 'systemparameter' || this.tableOtherContent.from == 'systemparameteritem' || this.tableOtherContent.from == 'systemparameteritem' ||  this.tableOtherContent.from == 'tasktypedependency') {
			columnName = { columnName };
			columnName = columnName.columnName;
		} 
		if (this.isSortAsc) {
			this.isSortAsc = false;
			this.tableOtherContent.isSortAsc = false;
			this.pagination.allItems.sort(this.dynamicSort(columnName, 1));
		} else {
			this.isSortAsc = true;
			this.tableOtherContent.isSortAsc = true;
			this.pagination.allItems.sort(this.dynamicSort(columnName, -1));
		}

		this.setPage(this.pager.currentPage);
	}

	dynamicSort(property, sortOrder) {
		return function (a, b) {
			if (a[property] === '' || a[property] === null || typeof a[property] === 'undefined') {
				return 1 * sortOrder;
				}
				if (b[property] === '' || b[property] === null || typeof b[property] === 'undefined') {
				return -1 * sortOrder;
				}
			  if(a[property] < b[property]){
				return -1 * sortOrder;
			  }
			  else if( a[property] > b[property]){
				return 1 * sortOrder;
			  }
			  else{
				return 0;
			  }
		}
	}

	addNewRow() {
		if (this.tableOtherContent.from == 'systemparameter' || this.tableOtherContent.from == 'manageapplication' 
		    || this.tableOtherContent.from == 'systemparameteritem' || this.tableOtherContent.from == 'tableviewworkgroupmember' 
			|| this.tableOtherContent.from == 'notifykeyset' || this.tableOtherContent.from == 'workgroupnotification'
			|| this.tableOtherContent.from == 'createtaskdetails' || this.tableOtherContent.from == 'globalNotes' 
			|| this.tableOtherContent.from == 'taskdetails' || this.tableOtherContent.from == 'tasktypedependency') {
			this.activeAnimation = 1;
			setTimeout(() => {
				this.activeAnimation = -1;
			}, 500)
			let event = {pagedItems: this.pagedItems, from: this.tableOtherContent.from};
			this.addNewRowParent.emit(event);
		}
	}

	onEditClick(rowIndex) {
		if (this.tableOtherContent.from == 'systemparameter' || this.tableOtherContent.from == 'systemparameteritem' || this.tableOtherContent.from == 'manageapplication' || this.tableOtherContent.from == 'notifykeyset' || this.tableOtherContent.from == 'workgroupnotification' 
		|| this.tableOtherContent.from == 'createtaskdetails' || this.tableOtherContent.from == 'tasktypedependency') {
			// this.onEditParent.emit(rowIndex);
		}
        this.pagedItems[rowIndex]['rowEdit'] = true;
	}
	
	updateItemInAllItems(response: any) {
		for (var x = 0; x < this.pagination.allItems.length; x++) {
			if (this.pagination.allItems[x].id == response.id) {
				this.pagination.allItems.splice(x, 1, response);
				break;
			}
		}
	}

	onSaveClick(rowIndex) {
		if (this.tableOtherContent.from == 'systemparameter' || this.tableOtherContent.from == 'manageapplication' 
		|| this.tableOtherContent.from == 'systemparameteritem' ||
			this.tableOtherContent.from == 'tableviewworkgroupmember'
			|| this.tableOtherContent.from == 'notifykeyset'
			|| this.tableOtherContent.from == 'workgroupnotification'
			|| this.tableOtherContent.from == 'createtaskdetails'
			|| this.tableOtherContent.from == 'taskdetails'
			|| this.tableOtherContent.from == 'globalNotes'
			|| this.tableOtherContent.from == 'tasktypedependency' 
			) {
			if (!this.pagedItems[rowIndex].id) {
				this.pagedItems[rowIndex]['rowEdit'] = false;
			} else {
				this.pagedItems[rowIndex]['rowEdit'] = true;
			}
			let event = {pagedItems:this.pagedItems, rowIndex: rowIndex, from:this.tableOtherContent.from};
			this.onSaveParent.emit(event);
		}
	}

	onDeleteClick(rowIndex) {
		if (this.tableOtherContent.from == 'systemparameter' || this.tableOtherContent.from == 'systemparameteritem' 
		|| this.tableOtherContent.from == 'systemparameteritem'	|| this.tableOtherContent.from == 'manageapplication' 
		|| this.tableOtherContent.from == 'tableviewworkgroupmember'
		|| this.tableOtherContent.from == 'notifykeyset'
		|| this.tableOtherContent.from == 'workgroupnotification'
		|| this.tableOtherContent.from == 'createtaskdetails'
		|| this.tableOtherContent.from == 'taskdetails'
		|| this.tableOtherContent.from == 'tasktypedependency') {
			let data = {pagedItems: this.pagedItems, rowIndex: rowIndex};
			this.onDeleteParent.emit(data);
		}
	}

	removeItemFromAllItems(id) {
		for (var x = 0; x < this.pagination.allItems.length; x++) {
			if (this.pagination.allItems[x].id == id) {
				this.pagination.allItems.splice(x, 1);
				break;
			}
		}

		this.pagination.totalRecords = this.pagination.allItems.length;
		this.setPage(this.pager.currentPage);
	}

	onCloseClick(rowIndex) {
		console.log(this.tableOtherContent.from);
		if (this.tableOtherContent.from == 'systemparameter' || this.tableOtherContent.from == 'manageapplication' || this.tableOtherContent.from == 'systemparameteritem'
			|| this.tableOtherContent.from == 'notifykeyset'
			|| this.tableOtherContent.from == 'workgroupnotification'
			|| this.tableOtherContent.from == 'tableviewworkgroupmember'
			|| this.tableOtherContent.from == 'createtaskdetails' 
			|| this.tableOtherContent.from == 'globalNotes' 
			|| this.tableOtherContent.from == 'taskdetails'
			|| this.tableOtherContent.from == 'tasktypedependency') {
			console.log(true);
	        this.pagedItems[rowIndex]['rowEdit'] = false;
	        const rows = this.pagedItems;
	        if (rows[rowIndex] && (!rows[rowIndex].id||rows[rowIndex].id == "") ) {
	            rows.splice(rowIndex, 1);
	        }
		}
	}
	paginationChange() {
		this.changePageLimit(this.pagination.selectedLimit);
		this.pager.startIndex = 0;
		this.pager.endIndex = this.pager.pageSize - 1;
		this.setPage(this.pager.currentPage);
	}

	private changePageLimit(limit: any): void {
		this.pagination.selectedLimit = parseInt(limit, 10);
	};

	onRowClick(rowIndex, link, name, task) {
		console.log(task);
		if (link) {
			this.openTabParent.emit({ link, rowIndex, name, task })
		}
	}

	dragstartheader(event, index) {
		this.dragIndex = index;
	}
	dragoverheader(event, index) {
		event.preventDefault();
	}
	dropheader(event, index) {
		// var data = event.dataTransfer.getData("text");
		// console.log(event.dataTransfer,data )
		// var dragIndex = Number(document.getElementById(data).getAttribute('index'))
		// console.log(index, dragIndex);
		[this.tableHeader[index], this.tableHeader[this.dragIndex]] = [this.tableHeader[this.dragIndex], this.tableHeader[index]]
	
		this.draggedHeader = this.tableHeader.filter(function(updatedHeader) {
			return updatedHeader.visible;
		  }).map(function(obj) { return obj.label; });
		this.setPreferenceHeaders()
	}
	setPreferenceHeaders(){
		this.getLocalUserPreference= JSON.parse(localStorage.getItem('fd_user'));
		try{
			this.uPreference =JSON.parse(this.getLocalUserPreference.appsList[0].userPreference);

		}
		catch(e){
				this.uPreference =this.getLocalUserPreference.appsList[0].userPreference;
		}
		let tableOf = this.uPreference[this.tableOtherContent['from']];
		tableOf=this.draggedHeader;
		this.uPreference[this.tableOtherContent['from']]=tableOf;
		this.getLocalUserPreference.appsList[0].userPreference = this.uPreference;

	//	localStorage.setItem('fd_user',JSON.stringify(getLocalUserPreference))

		// JSON.parse(getLocalUserPreference.appsList[0].userPreference)[this.tableOtherContent['from']]= this.draggedHeader;
		// console.log("hjhgjhgjh",JSON.parse(getLocalUserPreference.appsList[0].userPreference)[this.tableOtherContent['from']])	
			let data = {
			'resourceCuid': this.getLocalUserPreference.cuid,
			'appName': 'FlightDeck',
			'preferenceJson': JSON.stringify(this.getLocalUserPreference.appsList[0].userPreference)
		  }
		this.taskService
		.updatePreference(`/Enterprise/v2/Work/resource/${this.getLocalUserPreference.id}/userPreferences`, data)
		.subscribe(
		  result => {
			console.log("loc",this.getLocalUserPreference)


		   
		  localStorage.setItem('fd_user',JSON.stringify(this.getLocalUserPreference))
			  
			setTimeout(() => {
			  

			}, 15000);
		
		  },
		  error => {
		
			setTimeout(() => {
			
			}, 15000);
		
		  }
		);
	}

	viewerFn(fieldname) {
		var rows = this.pagedItems; // this.tableData;
		if (fieldname == 'Pdf') {
			this.printPdf(rows)
		} else if (fieldname == "Print") {
			this.printView(rows)
		} else if (fieldname == "Filter") {
			this.showfilter = !this.showfilter;
		}//Calling printexcel() according to fieldValue of Export button  
		else if (fieldname == "AllFields" || fieldname == "VisibleFields") {
			this.printexcel(rows, this.tableOtherContent.title+"_"+fieldname, fieldname)
		}
	}
	printPdf(rows) {
		var columns = [];
		var header = this.tableHeader;
		for (var i = 0; i < header.length; i++) {
			if (header[i].visible) {
				columns.push({ 'title': header[i].label, 'dataKey': header[i].fieldName });
			}
		}
		var doc = new jsPDF('p', 'pt');
		doc.autoTable(columns, rows, {
			theme: 'grid',
			styles: { fontStyle: 'normal', fontSize: 8, overflow: 'linebreak' },
			addPageContent: (data) => {
				doc.text(this.tableOtherContent.title, 30, 20);
			}
		});
		doc.save(this.tableOtherContent.title + '.pdf');

	}
	
	// Method to export table in excel format
	printexcel(rows: any[], fileName: string, fieldName: string) {
		var columns = [];
		var columnsForAllFields = [];
		var header = this.tableHeader;
		for (var i = 0; i < header.length; i++) {
			if (header[i].visible) {
				columns.push({'dataKey': header[i].fieldName });
				
			}
			 columnsForAllFields.push({ 'dataKey': header[i].fieldName });
		}	
		
	var ws: XLSX.WorkSheet;
	if(fieldName == "VisibleFields")
	ws = XLSX.utils.json_to_sheet(this.mergeDataWithColumns(rows, columns));
	else
	ws = XLSX.utils.json_to_sheet(this.mergeDataWithColumns(rows, columnsForAllFields));
    var wb: XLSX.WorkBook = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    var excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    this.saveExcelFile(excelBuffer, fileName);
  	}

  	private saveExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {type: this.fileType});
    FileSaver.saveAs(data, fileName + this.fileExtension);
	}

	private mergeDataWithColumns(data: any[], columns: any[]){
		const table = [];
		let tempRow: object;
	
		if (columns) {
		  data.forEach(row => {
			tempRow = {};
			columns.forEach(({dataKey }) => {
				tempRow[dataKey] = row[dataKey];
			});
			table.push(tempRow);
		  });
		  return table;
		}
		return data;
	  }

	printView(rows) {
		console.log(rows);
		var columns = [];
		columns = this.tableHeader.filter(function(value) {
			if (value.visible) {
				return true;
				}
				return false;
		}).map((value) => {
			return value.fieldName;
		});
		printJS({ printable: rows, properties: columns, type: 'json' });
	}
	onClosed() {
		this.error = {};
	}
	expandAddRow(rowdata: any, rowIndex: number) {
		let eventData = { data: rowdata, index: rowIndex }
		this.expandRow.emit(eventData);

		let taskelement = {
			...rowdata,
			isRowDetailOpen: true,
			isSelected: false,
			isStatusEditing: false,
			isIconMinus: false
		};

		let openedTask = this.pagedItems[rowIndex + 1];
		if (openedTask && openedTask.isRowDetailOpen) {
			rowdata.isIconMinus = false;
			this.pagedItems.splice(rowIndex + 1, 1);
		} else {
			rowdata.isIconMinus = true;

			if (rowIndex == 9) {
				this.pagedItems.push(taskelement);
			} else {
				this.pagedItems.splice(rowIndex + 1, 0, taskelement);
			}
		}
	}

	nextTasks() {
		this.nextAll.emit();
	}

	onDeleteMemberClick(rowData, i) {
		this.onDeleteMember.emit({ rowData, i });
	}
	onActionChange(status) {
		this.OnActionChangeStatus.emit(status);
	}
	onActionStatus() {
		let eventData = { data: this.filteredItems }
		this.onActionStatusSubmit.emit(eventData);
	}

	checkAllRows(event) {
		// this.CheckUncheckAllRows.emit(data);
		if (event.target.checked) {
			this.pagedItems.map((item) => {
				item.isChecked = true;
			});
		} else {
			this.pagedItems.map((item) => {
				item.isChecked = false;
			});
		}
	}

	OnChecked(rowIndex, event) {
		let temp: any = this.pagedItems;
		if (event.target.checked) {
			temp[rowIndex].isChecked = true;
		} else {
			temp[rowIndex].isChecked = false;
		}

		var checkedRowList = _.filter(temp, function (task) {
			return task.isChecked;
		});

		let eventData = { data: checkedRowList }
		this.SetActionDropdown.emit(eventData);
	}

	onRefresh() {
		this.pagination.currentPageNumber = 1;
		this.pagination.pageNumber = 0;
		this.pagination.pageSize = this.pagination.maxPageLimit;
		this.pagination.maxPageLimit = this.pagination.maxPageLimit;
		this.pagination.pager = { startIndex: 0, endIndex: this.pagination.selectedLimit - 1 };
		this.pagination.allItems = [];
		for(let i =0 ; i<this.tableHeader.length;i++){
			this.tableHeader[i]['position']=undefined;
		}
		this.refresh.emit();
	}

	additionalDetails(rowdata: any, rowIndex: number) {
		let eventData = { data: rowdata, index: rowIndex }
		this.showAdditionalDetailsParent.emit(eventData);
	}

	//Added Methods to store the clicked value and pass it on click of Go button
	onMetaChange(event){
		this.metaClicked = event;
	}

	onMetaStatus() {
		this.onMetaSubmit.emit(this.metaClicked);
	}
}
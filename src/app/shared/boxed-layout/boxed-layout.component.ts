import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { TaskService } from '../../features/task/task.service';
import { ConfDialogComponent } from '@app/features/task/conf-dialog/conf-dialog.component';

@Component({
  selector: 'sa-boxed-layout',
  templateUrl: './boxed-layout.component.html',
  styleUrls: ['./boxed-layout.component.css']
})
export class BoxedLayoutComponent implements OnInit {

  @Input('isShow') isShow: any;
  @Input('pageLayout') pageLayout: any;
  @Input('modelValue') modelValue: any = {};
  @Input('leftSideTabs') leftSideTabs: any = {};
  @Input('taskDetails') taskDetails: any = {};
  @Input('logPageLayout') logPageLayout: any = {};
  @Input('logData') logData: any = [];
  @Input('loaderTaskDetail') loaderTaskDetail: any;
  @Input('activityLog') activityLog:any = {};
  @Input('data') data: any = [];
  @Input('CustomerAttributorData') CustomerAttributorData: any = [];
  @Input('NewV2Data') NewV2Data: any = [];
  @Input('layOutCounter') layOutCounter:any;
  @Input('errorMessage') errorMessage:any;
  @Input('pagination') pagination: any;
  @Input('actionButton') actionButton: any;
  @Input('actionColumn') actionColumn: any;
  @Input('tableHeader') tableHeader: any;
  @Input('tableData') tableData: any;
  @Input('tableOtherContent') tableOtherContent: any;
  @Input('filter') filter:any;
  @Input('tablePaginationData') tablePaginationData: any={};

  @Output() filterValue = new EventEmitter();
  @Output() SearchTask = new EventEmitter();
  @Output() ClearData = new EventEmitter();
  @Output() OpenDuaDateDialog = new EventEmitter();
  @Output() OpenCancelDialog = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() pageChangedParent = new EventEmitter();
  @Output() paginationChangeParent = new EventEmitter();
  @Output() filterColumnParent = new EventEmitter();
  @Output() onSortParent = new EventEmitter();
  @Output() previous = new EventEmitter();
  @Output() next = new EventEmitter();
  @Output() previousAll = new EventEmitter();
  @Output() nextAll = new EventEmitter();
  @Output() showAdditionalDetailsParent = new EventEmitter();

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  
  /* public pageLayout: any; */
  public workGroupNamenew: string[] = new Array();
  /* public isShow = false; */
  logDetails = [];
  IsSuccess:boolean=false;
  message:any;
  //TaskDetails: any = {};
  CustomerData: any = [];
  NewJsonFormate: any = {};
  IsSucess: boolean = false;
  IsError: boolean = false;
  public options: any;

  constructor(
    private taskService: TaskService,
    public dialog: MatDialog
  ) { 
    console.log(this.taskDetails);
    console.log(this.pageLayout);
  }

  ngOnInit() {
    console.log(this.pageLayout);
    //console.log(this.tableOtherContent);
    this.options = {
      multiple: true,
      tags: true
    };
  }

  filterTaskResult(value) {
    this.filterValue.emit(value);
  }

  searchTask(value) {
    this.SearchTask.emit(value);
  }

  Refresh(){
    this.refresh.emit();
  }

  clear(layoutElem) {
    this.ClearData.emit(layoutElem);
  }

  OpenDuaDateDialogClick() {
    this.OpenDuaDateDialog.emit();
  }

  OpenCancelDialogClick() {
    this.OpenCancelDialog.emit();
  }

  onPaginateInnerGrid(Data) {
    this.pageChangedParent.emit(Data)
  }

  onLimitChange(Data) {
    this.paginationChangeParent.emit(Data);
  }

  LogfilterTaskResult(Data) {
    this.filterColumnParent.emit(Data);
  }

  onLogSortSelection(Data) {
    this.onSortParent.emit(Data);
  }

  previousTasks() {
    this.previousAll.emit();
  }

  onGridPrevious() {
    this.previous.emit();
  }

  nextTasks() {
    this.nextAll.emit();
  }

  onGridNext() {
    this.next.emit();
  }

  showAdditionalDetails(event, taskDetails){
    let task: any = taskDetails.id;
		let log: any = event.data.id;
		let url: any = '/Enterprise/v2/Work/task/'+task+'/activityLog/'+log+'/additionalDetails'
		// console.log("Log additional Details url< == >", url);
    this.taskService.getAddionalDetails(url).toPromise().then((Logresp: any) => {
			// console.log("Log Details < == >", Logresp);
			// console.log("taskDetails < == >", taskDetails);
			// console.log("eventdata < == >", event);

			let details : any = "";
			//var parser, xmlDoc;
			if(Logresp){
        details = Logresp;
				// parser = new DOMParser();
				// xmlDoc = parser.parseFromString(details,"text/xml");
				// console.log("xmlDoc < == >", xmlDoc);
			}else{
				details = "No Additional Details.";
			}
			
			let dialogRef = this.dialog.open(ConfDialogComponent, {
				disableClose: false, data: {
					message: details,
					okText: "Close"
				}
			});
			
		}).catch((errorObj: any) => {
			console.error(errorObj);
    });
  }

}

import { Component, OnInit, TemplateRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { TaskService } from '@app/features/task/task.service';
@Component({
  selector: 'sa-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {  
  @ViewChild('modalDialog') modalDialog: ModalDirective;
  @Input('modal') modal: any = {
    title: 'Title',
    isClose: true,
    field: [],
    buttons: [],
    blockingReasons: [],
    pageLayoutData:[],
    output: {},
    size: '',
    blockingGlNote:'',
    blockingTimestamp:''
  };
  @Input('arrayOfCategory') arrayOfCategory;
  blockingGlNotes:string='';
  resolutionTask:string='';
  isBlockTimeStamp:boolean=false;
  blockingTstmp:string='';
   minDate:Date =new Date();
  completePageLayoutResp: any = [{ "id": "105665", "name": "EC", "value": "123", "jsonDescriptor": null, "pageLayoutFieldName": null, "combinedJsonDesc": null, "pageLayoutFieldId": null, "createdDateTime": "2019-10-02 02:08:10", "createdById": "AC39739", "createdByName": null, "modifiedById": "AC39739", "modifiedDateTime": "2019-10-02 02:08:10", "systemParameterItems": [] }, { "id": "105666", "name": "Skills", "value": "", "jsonDescriptor": null, "pageLayoutFieldName": null, "combinedJsonDesc": null, "pageLayoutFieldId": null, "createdDateTime": "2019-10-02 02:08:11", "createdById": "AC39739", "createdByName": null, "modifiedById": "AC39739", "modifiedDateTime": "2019-10-02 02:08:11", "systemParameterItems": [{ "name": "Skills", "id": "136", "systemParameterId": "63", "parentId": null, "status": "Active", "sortOrder": 0, "value": "ETHERNET", "description": null, "createdDateTime": "2019-05-03 10:27:30", "createdById": "VXKUM16", "modifiedById": "VXKUM16", "modifiedDateTime": "2019-05-03 10:27:30", "pageLayoutName": "", "layoutTemplateId": "", "params": [], "systemParameterItem": [] }, { "name": "Skills", "id": "137", "systemParameterId": "63", "parentId": null, "status": "Active", "sortOrder": 0, "value": "GFAST", "description": null, "createdDateTime": "2019-05-03 10:27:46", "createdById": "VXKUM16", "modifiedById": "VXKUM16", "modifiedDateTime": "2019-05-03 10:27:46", "pageLayoutName": "", "layoutTemplateId": "", "params": [], "systemParameterItem": [] }, { "name": "Skills", "id": "135", "systemParameterId": "63", "parentId": null, "status": "Active", "sortOrder": 0, "value": "GPON", "description": null, "createdDateTime": "2019-05-03 10:27:05", "createdById": "VXKUM16", "modifiedById": "VXKUM16", "modifiedDateTime": "2019-05-03 10:27:05", "pageLayoutName": "", "layoutTemplateId": "", "params": [], "systemParameterItem": [] }, { "name": "Skills", "id": "1244", "systemParameterId": "63", "parentId": null, "status": "Active", "sortOrder": 0, "value": "LMOS", "description": null, "createdDateTime": "2019-05-30 10:21:31", "createdById": "KKADALI", "modifiedById": "AC04395", "modifiedDateTime": "2019-06-07 12:56:53", "pageLayoutName": "spiLayout_ListOfValues", "layoutTemplateId": "80", "params": [], "systemParameterItem": [] }, { "name": "Skills", "id": "4948", "systemParameterId": "63", "parentId": null, "status": "Active", "sortOrder": 0, "value": "OVC", "description": "SPR -OVC-Skill", "createdDateTime": "2019-06-18 05:32:45", "createdById": "AC39339", "modifiedDateTime": null, "pageLayoutName": "", "layoutTemplateId": "", "params": [], "systemParameterItem": [] }] }, { "id": "105667", "name": "Work Type", "value": "", "jsonDescriptor": null, "pageLayoutFieldName": null, "combinedJsonDesc": null, "pageLayoutFieldId": null, "createdDateTime": "2019-10-02 02:08:20", "createdById": "AC39739", "createdByName": null, "modifiedById": "AC39739", "modifiedDateTime": "2019-10-02 02:08:20", "systemParameterItems": [{ "name": "Work Type", "id": "7967", "systemParameterId": "5342", "parentId": null, "status": "Active", "sortOrder": 1, "value": "Large Business", "description": null, "createdDateTime": "2019-08-28 06:00:49", "createdById": "AC04395", "modifiedById": "AC04395", "modifiedDateTime": "2019-08-28 06:00:49", "pageLayoutName": "spiLayout_ListOfValues", "layoutTemplateId": "80", "params": [], "systemParameterItem": [] }, { "name": "Work Type", "id": "7970", "systemParameterId": "5342", "parentId": null, "status": "Active", "sortOrder": 1, "value": "Residence", "description": null, "createdDateTime": "2019-08-28 06:00:51", "createdById": "AC04395", "modifiedById": "AC04395", "modifiedDateTime": "2019-08-28 06:00:51", "pageLayoutName": "spiLayout_ListOfValues", "layoutTemplateId": "80", "params": [], "systemParameterItem": [] }] }]
  @Output() buttonClicked = new EventEmitter();
  @Output() buttonClickedTD = new EventEmitter();
  @Output() modalClosed = new EventEmitter();
  DropdownList: any = [];
  mandatoryAlert = '';
  errorMessage: string;
  loader = false;
  constructor(private taskService: TaskService) {

  }
  ngOnInit() {

  }

// for blocking category based on blocking reason
blockReasonChange(blockingReason){

  // if (this.modal.Category !== null && this.modal.Category !== "") {
  //   this.modal.Reason = blockingReason.value;
  // }
  //else {
    
    this.loader = true;
    this.resolutionTask = '';
    this.isBlockTimeStamp = false;
    this.blockingTstmp = '';
    const mapped = Object.entries(this.arrayOfCategory).map(([type, value]) => ({ type, value }));
    mapped.filter(item => {
      let x = Object.entries(item.value).map(([type, value]) => ({ type, value }));
      for (var i = 0; i < x.length; i++) {
        if (x[i].type === blockingReason.value) {          
         // this.modal.blockingCategory.push(item.type)
          this.modal.Category = item.type;
          this.modal.Reason = blockingReason.value;          
          this.blockCategoryChange(item.type, true);


        }
      }
    });

    this.modal.Reason = blockingReason.value;
   // this.isBlockTimeStamp=true;
    //THIS BLOCK WILL DISPLAY THE RESOLUTION TASK FOR THE AVAILABLE TASK AND IF NOT AVAILABLE DATETIME BLOCK WILL BE DISPLAYED
    //if(this.modal.Reason){
   	this.taskService.getTaskTypeForParam("Blocking Reasons",blockingReason.value).toPromise().then((result: any) => {	      
      
      if(result!=null){
       if(result[0]!=null && result[0].taskName!=null)
        {
        this.resolutionTask=result[0].taskName;
        }
        
      }
      else{
        this.isBlockTimeStamp=true;
      }
      this.loader=false;
		}, (error: any) => {
      this.loader=false;
		}).catch((errorObj: any) => {
			this.loader=false;
		});
    //}
//}
  this.loader=false;
}


// for blocking category based on blockCategoryChange

blockCategoryChange(blockingCategory, bValue){  
  if(blockingCategory == ''){
    for (var key in this.arrayOfCategory) {
      if (this.arrayOfCategory.hasOwnProperty(key)) {
        //this.blockingCategory.push(key);
        for (var key in this.arrayOfCategory[key]) {
          this.modal.blockingReasons.push(key);
        }
      }
        
    }
    
  }else {
  this.modal.blockingReasons = [];
  
  this.loader = true;
  this.resolutionTask = '';
  //this.isBlockTimeStamp = false;
  this.blockingTstmp = '';
  const mapped = Object.entries(this.arrayOfCategory).map(([type, value]) => ({ type, value }));
  mapped.filter(item => {
    if ((!bValue && item.type === blockingCategory.value) || (bValue && item.type === blockingCategory)) {
      let x = Object.entries(item.value).map(([type, value]) => ({ type, value }))
      for (var elem of x) {
        this.modal.blockingReasons.push(elem.type)
        this.modal.Reason = item.type;       
      }
      if(this.modal.Category !== null){       
        this.isBlockTimeStamp = false;
        this.modal.Reason = item.type;
      }
    }
  });
  
  this.loader = false;
  }
  
}
  showModal(): void {
  this.blockingGlNotes='';
      this.blockingTstmp='';
      this.resolutionTask='';
      this.isBlockTimeStamp=false;
    setTimeout(() => {      
      if (this.modal.from == "taskassignedcuid") {
        this.DropdownList = this.modal.fields[0].dropdownList;
        
      }
    }, 2000)
    this.modalDialog.show();
  }

  hideModal(): void {
    this.mandatoryAlert = '';
    this.errorMessage = '';
    this.modalDialog.hide();
    this.modalClosed.emit();
  }
  // blockReasonChange(blockingReason){
  //   this.loader=true;
  //   this.resolutionTask='';
  //   this.isBlockTimeStamp=false;
  //   this.blockingTstmp='';
	// 	this.taskService.getTaskTypeForParam("Blocking Reasons",blockingReason).toPromise().then((result: any) => {
		
      
      
  //     if(result!=null){
  //      if(result[0]!=null && result[0].taskName!=null)
  //       {
  //       this.resolutionTask=result[0].taskName;
  //       }
        
  //     }
  //     else{
  //       this.isBlockTimeStamp=true;
  //     }
  //     this.loader=false;
	// 	}, (error: any) => {
  //     this.loader=false;
	// 	}).catch((errorObj: any) => {
	// 		this.loader=false;
	// 	});
  //   }
  focusFunction(): void {
    this.mandatoryAlert = '';
    this.errorMessage = '';
  }

  setErrorMessage(errorMessage) {
    this.errorMessage = errorMessage;
    this.modalDialog.show();
  }

  onButtonClick(fieldName) {
    if (fieldName == 'cancel' || fieldName == 'Cancel') {
      this.hideModal();
     
    }
    else if(fieldName && fieldName.toLowerCase() == 'save'){
      if(this.modal.isFromTD){
        this.buttonClickedTD.emit({ fieldName, modal: this.modal });
      } else {
        this.buttonClicked.emit({ fieldName, modal: this.modal });
      }
    }
    else if(this.modal.title=='Copy Task'){
      if(this.modal.taskType==undefined){
        this.errorMessage = 'Please select Task Type';
      }
      else{
        if(this.modal.isFromTD){
        this.buttonClickedTD.emit({ fieldName, modal: this.modal });
      } else {
        this.buttonClicked.emit({ fieldName, modal: this.modal });
      }}
    }
    else if (this.modal.fields && this.modal.fields.length > 0) {
            
      if (this.modal.fields[0].mandatory && !this.modal.Reason && !this.modal.DispatchWorkgroup
        && !(this.modal.fields[0].fieldValue) ) {
          this.mandatoryAlert = this.modal.fields[0].error;
      } 
     else if(this.blockingTstmp=='' && this.resolutionTask=='' && this.modal.title=='Block'){
        this.errorMessage = 'Must enter block date/time';
      }
      else {
        localStorage.setItem('Reason', this.modal.Reason);
        this.modal.blockingGlNote=this.blockingGlNotes;
        this.modal.blockingTimestamp=this.blockingTstmp;
       
        localStorage.setItem('DispatchWorkgroup', this.modal.DispatchWorkgroup);
        if(this.modal.isFromTD){
          this.buttonClickedTD.emit({ fieldName, modal: this.modal });
        } else {
          this.buttonClicked.emit({ fieldName, modal: this.modal });
        }
      }
    
    } else {
      if(this.modal.isFromTD){
        this.buttonClickedTD.emit({ fieldName, modal: this.modal });
      } else {
        this.buttonClicked.emit({ fieldName, modal: this.modal });
      }
    }
  }

  filter(name) {
    const filterValue = name.toLowerCase();
    this.DropdownList = this.modal.fields[0].dropdownList.filter(option => (
      (option.cuid.toLowerCase().indexOf(filterValue) === 0)
      || (option.fullName.toLowerCase().indexOf(filterValue) === 0)
    ));
  }
  categoryfilter(name) {
    const filterValue = name.toLowerCase();
    this.modal.blockingCategory = this.modal.blockingCategory.filter(option => (
      (option.cuid.toLowerCase().indexOf(filterValue) === 0)
      || (option.fullName.toLowerCase().indexOf(filterValue) === 0)
    ));
  }
}
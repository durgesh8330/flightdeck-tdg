import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TaskService } from '@app/features/task/task.service';
import { debug } from 'util';

@Component({
  selector: 'sa-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  @Input('rowData') rowData: any;
  @Input('subLoader') subLoader: any;
  @Input('childHistoryList') childHistoryList: any;
  @Input('grandChildList') grandChildList: any;
  @Input('TableFiedls') TableFiedls: any;

  @Output() GetStatusHistory = new EventEmitter();
  @Output() GetGrandChildList = new EventEmitter();
  @Output() ForceCompleteId = new EventEmitter();
  @Output() RetryServiceMessage = new EventEmitter();
  public pagelayout :any ={};
  public pageHeader: any =[];
  public buttons: any=[];
  public infousedbyServiceButtons: any=[];
  public allowedactions: any=["Edit & Retry", "Cancel", "Retry Service"];
  public buttonVisible: boolean = true;
  public showRetry = false;
  public retryMethodType = false;
  public retryRequestHeader = false;
  public retryRequestURL = false;


  cardTabs: any = {
    tab: 'child-summary'
  };

  constructor(
    private taskService: TaskService
    
    
  ) {
   
    this.taskService.callGetUrl('/PageLayoutTemplate/Get/SME_ChildDetails').toPromise().then(response =>{
      if(response){
        this.pageHeader = response["pageLayoutTemplate"][1];
        this.buttons = response["pageLayoutTemplate"][0];
        this.infousedbyServiceButtons = response["pageLayoutTemplate"][2];        
      }
    });
    
   }

  ngOnInit() {
    if (this.rowData.taskSectionModels && this.rowData.taskSectionModels.length > 0) {
      this.assignEditable(this.rowData.taskSectionModels);
      this.retryEnable(this.rowData.taskSectionModels);
    }   
   
  }

  retryEnable(models: any[]) {
    console.log("are we here");
    models.forEach(model => {
      if(model.header = 'Reference'){
      model.paramList.forEach(param => {
          if(param.name){
            if ( param.name == 'retryMethodType'){
              this.retryMethodType=true;
            }
              else if (param.name == 'retryRequestHeader'){
                this.retryRequestHeader=true;
              }
              else if (param.name == 'retryRequestURL'){
                this.retryRequestURL=true;
              }
          }
         
      });
      if (this.retryRequestURL && this.retryMethodType && this.retryRequestHeader){
        this.showRetry=true;
      }
    }
    });
   
  }

  onActionButtonClick(fieldName,rowData){
    switch(fieldName){
      case "cancel":
      this.cancelRetry(rowData);
      break;
      case "retryservice":
      this.GetRetryServices();
      break;
      case "edit&retryansfter":
      this.editAndRetry(rowData);
      break;
    }
  }
  assignEditable(models: any[]) {
    models.forEach(model => {
      model.paramList.forEach(param => {
     if ( param.paramFieldLayout) {
        var editField = (param.paramFieldLayout.editable && (param.paramFieldLayout.editable == true || param.paramFieldLayout.editable == "true"))?true:false;
        if (!(typeof param.paramFieldLayout.isEditableField === "undefined")){
            editField = (param.paramFieldLayout.isEditableField && (param.paramFieldLayout.isEditableField == true || param.paramFieldLayout.isEditableField == "true"))?true:false;
        }
        param.isEditable = editField;
        param.paramFieldLayout.editable = editField;
        param.type = param.paramFieldLayout.type;
        if(param.paramFieldLayout.dropdown){
        var str=param.paramFieldLayout.dropdown;
        str = str.replace(/'/g,'"') // replace all ' by "
        param.dropdown = JSON.parse(str);
      }

    }else {
      if (param.jsonDescriptor && JSON.parse(param.jsonDescriptor)) {
        param.isEditable = JSON.parse(param.jsonDescriptor).isEditableField;
        param.type = JSON.parse(param.jsonDescriptor).type;
        if(JSON.parse(param.jsonDescriptor).dropdown){
          var str=param.paramFieldLayout.dropdown;
        str = str.replace(/'/g,'"') // replace all ' by "
        param.dropdown = JSON.parse(str);
        }
      }   
    }
      });
    });
  }

  getStatusHistory(value) {
    this.GetStatusHistory.emit(value);
  }

  getGrandChildList(value) {
    this.GetGrandChildList.emit(value);
  }

  expandAddRow(data, index) {
    console.log(index);
    let taskelement = {
      ...data,
      isRowDetailOpen: true,
      isSelected: false,
      isStatusEditing: false,
      isIconMinus: false
    };

    let openedTask = this.grandChildList[index + 1];
    if (data.isIconMinus) {

        data.isIconMinus = false;
        this.subLoader = true;
        this.taskService.getTask(data.id, data.sourceSystemName).toPromise().then((response: any) => {
            let element = {
                ...response,
                isRowDetailOpen: true,
                isSelected: false,
                isStatusEditing: false,
                isIconMinus: false,
                isLoader: false
            };
            if (index == 9) {
                this.grandChildList.push(element);
            } else {
                this.grandChildList.splice(index + 1, 1);
                this.grandChildList.splice(index + 1, 0, element);
            }
            this.subLoader = false;
        }).catch((error: any) => {
            console.log(error);
            this.subLoader = false;
        });

      if (index == 9) {
        this.grandChildList.push(taskelement);
      } else {
        this.grandChildList.splice(index + 1, 0, taskelement);
      }
    } else {
      data.isIconMinus = true;
      this.grandChildList.splice(index + 1, 1);
    }
    console.log(this.grandChildList);
  }

  ForceComplete() {
    console.log(this.rowData);
    this.ForceCompleteId.emit(this.rowData.id);
  }

  GetRetryServices () {
    console.log(this.rowData);
    this.rowData.isLoader = true;
    let userData: any = JSON.parse(localStorage.getItem("fd_user"));
    const Payload = {
      "action": "Retry",
      "paramRequests": [],
      "taskId": this.rowData['id'],
      "modifiedById": userData.cuid
    };

    this.rowData['taskSectionModels'].forEach(element => {
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
      this.rowData.isLoader = false;
      // if (res.code == '200') {
        this.rowData = this.rowData.OriginalData;
        this.setButtonVisiblity();
        this.rowData.isEditing = false;
        this.RetryServiceMessage.emit({status: true, message: res.message});
      // } else {
      //   this.RetryServiceMessage.emit({status: true, message: res.message});
      // }
      
    }).catch((error) => {
      this.rowData.isLoader = false;
      console.log(error);
      this.rowData = this.rowData.OriginalData;
      this.setButtonVisiblity();
      this.rowData.isEditing = false;
      this.RetryServiceMessage.emit({status: false, message: error.error.message});
    });
  }

  cancelRetry(rowData){
    this.setButtonVisiblity();
    rowData.taskSectionModels = JSON.parse(JSON.stringify(rowData.OriginalData.taskSectionModels));
    setTimeout(() => {
      rowData.isEditing=false;
    }, 500);
  }

  editAndRetry(rowData){
    this.setButtonVisiblity();    
    rowData.isEditing=true;
    rowData.OriginalData = JSON.parse(JSON.stringify(rowData));
  }
  setButtonVisiblity(){
    this.infousedbyServiceButtons.fieldsList.map(elem=>{
      if(elem.fieldName== 'cancel' ||elem.fieldName=='retryservice' ){
        if(elem.visible == false){
        elem.visible =true;
        }
        else{
          elem.visible =false;
        }
      }
     
      if(elem.fieldName=='edit&retryansfter'){
        if(elem.visible == true){
        elem.visible = false;
        }else{
          elem.visible = true;
        }
       
      }
      
    })
   
  }
  
}

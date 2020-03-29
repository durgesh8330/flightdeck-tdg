import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, Type, ViewChild } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { NotificationService } from '@app/core/services';
import { TabService } from '@app/core/tab/tab-service';
import { Tab } from '@app/core/tab/tab.model';
import { ModalComponent } from '@app/shared/modal/modal.component';
import { environment } from '@env/environment';
import { UserProfileService } from '../user-profile.service';
import { TableComponent } from '@app/shared/table/table.component';
import { TaskService } from '../../task/task.service';
import { isArray } from 'util';
import { AppService } from '../../../app.service';
import { ThemeService } from 'ng2-charts';
import { s } from '@angular/core/src/render3';
declare var jsPDF: any;

@Component({
    selector: 'sa-system-parameters-details',
    templateUrl: './system-parameters-details.component.html',
    styleUrls: ['./system-parameters-details.component.scss']
})
export class SystemParametersDetailsComponent implements OnInit {
    @ViewChild(ModalComponent) modalChild: ModalComponent;
    @ViewChild(TableComponent) tableComponent: TableComponent;
    public skillTabs = [];
    filterParams = {};
    loading = true;
    iconSave = false;
    iconEdit = true;
    iconDelete = false;
    tabObj: any;
    tabdata: any;
    userInfo: any;
    isSortAsc = false;
    systemDetail = [];
    systemParameterId = '';
    url = '';
    level = 2;
    pagination: any = {};
    IsSuccess = false;
    IsError = false;
    message: string;
    taskType;
    totalPage = 1;
    filter = {};
    activeAnimation = -1;
    paramsList = [];
    parentId = "";
    modification = [];
    modificationheader = "";
    levelsystemParameterId = "";
    activeparamAnimation = -1;
    paramsRequest: any = {};
    paramsBackUp = [];
    paramsHeadText = '';
    itemHeadText = "";
    isButtonDisable = false;
    tabList = [];
    currentlyActiveSections = ["System Parameter Details", "Items", "Modification Information"]
    routerParameters = {};
    allPageLayout = [];
    activeSort = '';
    systemDetailHead = '';
    systemDetailHeadName = "";
    actionButton: any = [];
    actionColumn: any = [];
    actionParamsColumn: any = []
    systemParameterItem: any = {
        from: 'systemparameteritem',
        title: 'System Parameter Item',
        isSortAsc: false,
        globalSearch: ''
    };
    systemParameterParams: any = {
        from: 'systemparameterparams',
        title: 'System Parameter Params',
        isSortAsc: false,
        globalSearch: '',
        header: [],
        tableData: []
    };
    itemsBackUp = [];
    //paginationParams:any = {}
    error: any = {}
    loaderOnSection = false;
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
    tablePaginationData: any = [];
    ParamsTablePaginationData: any = [];
    paramHeader: any = [];
    resObject: any = {};
    options: any;
    loader: boolean = true;
    nextDisable: boolean = false;
    previousDisable: boolean = true;
    PageLayoutTemplateName = '';

    WorkgroupresourceLayout: any = {};
    WorkgroupresourceLayoutResp: any = [];
    Workgroupparamfieldstatus: any = false;

    sectionheader;

    systemParameter:any = {
        from: 'tasktypedependency',
        title: 'Task Dependency',
        isSortAsc: false,
        globalSearch: ''
};
loaderSystemParameters:boolean = false;

    constructor(private userProfileService: UserProfileService, private dialog: MatDialog,
        private snackBar: MatSnackBar, private notificationService: NotificationService,
        private tabService: TabService,
        private httpClient: HttpClient,
        private taskService: TaskService,
        public  Utility: AppService
        //@Inject(forwardRef(() => TableComponent)) private _parent:TableComponent
    ) {
        this.pagination.allItems = [];
        //this.paginationParams.allItems = [];
        this.url = this.tabService.lastUrl;   
        var pageLayoutTemplateName = 'System Paramter Detailed View'
        if (this.url != '/SystemParameter/') {
            pageLayoutTemplateName = localStorage.systempageLayoutName;
            this.PageLayoutTemplateName = pageLayoutTemplateName;
            console.log(pageLayoutTemplateName);
            this.level = 3;
            this.tabList.map((value) => {
                if (value.default) {
                    this.currentlyActiveSections = value.activeSection
                }
            })
            this.taskService.callGetUrl('/PageLayoutTemplate/Get/tblTask_Type_Dependency').toPromise().then(res=>{
                // debugger;
                var response: any = res;            
                this.pagination = Object.create(response.pageLayoutTemplate[1].fieldsList[0]);
                this.pagination.selectedLimit = this.pagination.pageLimitOptions[0];
                /* if (localStorage.systemParameterPerPage) {
                    this.pagination.selectedLimit = localStorage.systemParameterPerPage;
                } */
                this.actionButton = response.pageLayoutTemplate[2].fieldsList;
                this.sectionheader = response.pageLayoutTemplate[0].sectionHeader;
                this.actionColumn =  response.pageLayoutTemplate[3].fieldsList;
    
                this.pagination.currentPageNumber = 1;
                this.pagination.allItems = [];
                this.pagination.pager = {startIndex: 0, endIndex:  this.pagination.selectedLimit - 1};
                
                this.getSystemParamters(response.pageLayoutTemplate[0].sectionHeader, response.pageLayoutTemplate[0].fieldsList, this.actionColumn)
            }).catch(error => { });
        }
        this.systemParameterId = localStorage.systemId;
        console.log(this.level);
        console.log("Processing pageLayoutTemplateName: " + pageLayoutTemplateName);
        console.log(this.tabObj);
        console.log(this.tabdata);
        userProfileService.getPageLayout(pageLayoutTemplateName).toPromise().then(res => {
            var response: any = res;
            var itemheader = [];
            console.log('Template', response);
            for (var x = 0; x < response.pageLayoutTemplate.length; x++) {
                var pageLayoutTemplate = response.pageLayoutTemplate[x];
                var sectionHeader = pageLayoutTemplate.sectionHeader;
                if (sectionHeader == "System Parameter Details" || sectionHeader == "Details") {
                    var fieldVal = pageLayoutTemplate.fieldsList;
                    this.systemDetailHead = sectionHeader;
                    console.log("this.systemDetailHead", this.systemDetailHead);
                    for (var i = 0; i < fieldVal.length; i++) {
                        if (fieldVal[i].levelType) {
                            if (fieldVal[i].level.indexOf(this.level) > -1) {
                                this.systemDetail.push(fieldVal[i]);
                            }
                        } else {
                            this.systemDetail.push(fieldVal[i]);
                        }
                    }
                }
                if (sectionHeader == "Pagination") {
                    this.pagination = pageLayoutTemplate.fieldsList[0];
                    //this.paginationParams = pageLayoutTemplate.fieldsList[0];
                    //this.paginationParams.selectedLimit = 10;
                    this.pagination.selectedLimit = 10;
                }
                if (sectionHeader == "Items") {
                    this.itemHeadText = pageLayoutTemplate.sectionHeader;
                    var responseField = pageLayoutTemplate.fieldsList;
                    for (var i = 0; i < responseField.length; i++) {
                        if (responseField[i].visible) {
                            itemheader.push(responseField[i])
                        }
                    }
                }
                if (sectionHeader == "Modification Information") {
                    this.modification = pageLayoutTemplate.fieldsList;
                    this.modificationheader = pageLayoutTemplate.sectionHeader;
                }
                if (sectionHeader == "Buttons") {
                    this.actionColumn = pageLayoutTemplate.fieldsList;
                    this.actionParamsColumn = pageLayoutTemplate.fieldsList;
                }
                if (sectionHeader == "Params" || sectionHeader == "Parameters") {
                    this.paramHeader = pageLayoutTemplate.fieldsList;
                    this.paramsHeadText = pageLayoutTemplate.sectionHeader;
                    for (var i = 0; i < this.paramHeader.length; i++) {
                        if (this.paramHeader[i].visible) {
                            this.paramHeader[i].selectedItems = [];
                            this.systemParameterParams.header.push(this.paramHeader[i])
                        }
                    }
                }
                if (sectionHeader == "tabList") {
                    this.tabList = pageLayoutTemplate.fieldsList;
                }
                if (sectionHeader == "System Parameter details button") {
                    this.actionButton = pageLayoutTemplate.fieldsList;
                }
            }

            if (this.level == 3) {
                this.tabList.map((value) => {
                    if (value.default) {
                        this.currentlyActiveSections = value.activeSection
                    }
                })
            }
            this.setActionButtons(itemheader, this.actionColumn);
        }).catch((error) => {
            this.loading = false;
            console.log(JSON.stringify(error), this.loading);
        });
    }

    ngOnInit() {
        this.userInfo = JSON.parse(localStorage.getItem('fd_user'));    
        this.pagination.allItems = [];
        //this.paginationParams.allItems = [];
        this.options = {
            multiple: true,
            tags: true,
            'width': '100%'
        };

        this.taskService.callGetUrl('/PageLayoutTemplate/Get/paramsLayout_TaskType').toPromise().then((resp) => {
            // this.resourceLayout = resp;
            this.WorkgroupresourceLayout = resp;
        }).catch((err: any) => {
            console.log(err);
        });
    }

    setActionButtons(field, actions) {
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

        this.systemParameterItem = {
            ...this.systemParameterItem,
            add: add,
            editable: editable,
            deleteable: deleteable,
            header: field,
            tableData: []
        }
        this.systemParameterParams = {
            ...this.systemParameterParams,
            add: add,
            editable: editable,
            deleteable: deleteable,
        }
        if (this.url == "/TaskTypeDetails/") {
            this.getTaskTypeDetails();
        }
        else {
            this.getViewDataTable();
        }
    }

    getTaskTypeDetails() {        
        console.log(localStorage.systemId);
        this.userProfileService.getTaskTypeDetailsById(localStorage.systemId)
            .subscribe(res => {
                this.loading = false;
                this.isButtonDisable = false;
                this.systemParameterItem.tableData = [];
                this.loaderOnSection = false;
                var thisDetail = res;
                var resParaText = 'systemParameterItem';
                if (this.level == 3) {
                    var resParaText = 'systemParameterItem';
                    this.resObject = res;
                    this.WorkgroupresourceLayoutResp = res['params'];
                    res = {
                        "systemParameterItem": [res]
                    }
                    this.systemParameterParams.tableData = thisDetail['params'];
                    //[0]['systemParameterItems']
                    var paramsList = thisDetail['params']
                    //console.log("paramsList: ");
                    //console.log(paramsList);
                    console.log(this.paramHeader, ":::::::::::::::::::::::=>")
                    this.paramHeader = this.paramHeader.map((templateParam, index) => {
                        if (templateParam.type == 'MultiSelect') {
                            templateParam.selectedItems = [];
                            templateParam['systemParameterItemModels'].map((model, modelIndex) => {
                                // ng-select2 expects a field named "text" to contain the value to be selected
                                model.text = model.value;
                            })
                            console.log( templateParam['systemParameterItemModels'], "++++++++++++++++++++++++++++++++++++");
                        }
                        paramsList.map((paramsValue, paramsIndex) => {
                            console.log("Processing: " + templateParam.type + ", " + templateParam.fieldName + ", " + paramsValue.name);
                            if (templateParam.fieldName == paramsValue.name) {
                                templateParam = { ...templateParam, fieldValue: paramsValue.value }
                                //console.log("matched fieldName to name: " + templateParam.fieldName + ", and set value: " + templateParam.fieldValue);
                                if (templateParam.type == 'select') {
                                    /* TODO: Can probably update this to work from the selected system parameter item
                                     * rather than from the value of that item. i.e. make it work like MultiSelect
                                     */
                                    paramsList[paramsIndex]['systemParameterItems'].map((spi) => {
                                        templateParam = { ...templateParam, fieldValue: spi.value }
                                    })
                                    console.log("templateParam after setting value for 'select'");
                                    console.log(templateParam);
                                }
                                if (templateParam.type == 'MultiSelect') {
                                    paramsList[paramsIndex]['systemParameterItems'].map((spi) => {
                                        // ng2-select expects the ID of each selected item
                                        templateParam.selectedItems.push(spi.id);
                                    })
                                }
                            }
                        })
                        return templateParam;
                    })
                    //console.log("paramHeader: ");
                    console.log(this.paramHeader);
                }
                this.systemParameterItem.tableData = thisDetail['systemParameterItem'];
                console.log(this.systemParameterItem.tableData);
                this.levelsystemParameterId = thisDetail['id'];
                if (this.level == 3) {
                    this.levelsystemParameterId = thisDetail['systemParameterId'];
                    this.parentId = thisDetail['id'];
                    this.systemDetailHeadName = thisDetail['value'];
                }

                this.paramsRequest = {
                    status: thisDetail['status'],
                    sortOrder: thisDetail['sortOrder'],
                    value: thisDetail['value'],
                    description: thisDetail['description'],
                    layoutTemplateId: thisDetail['layoutTemplateId']
                }
                this.systemDetail = this.systemDetail.map((value, index) => {
                    console.log(thisDetail);
                    console.log(value.fieldName);
                    console.log(thisDetail["createdDtTm"]);
                    if (value.fieldName == "createdDateTime") {
                        value.fieldName = "createdDtTm"
                    }
                    return { ...value, fieldValue: thisDetail[value.fieldName] };
                })
                this.modification = this.modification.map((value, index) => {
                    if (value.fieldName == "createdDateTime") {
                        value.fieldName = "createdDtTm"
                    }

                    return { ...value, fieldValue: thisDetail[value.fieldName] };
                })


                console.log(res);
            }, (err) => {
                console.log(err);
                this.loading = false;
            });
    }

    getViewDataTable() {
        console.log("getViewDataTable for level: " + this.level);
        if (!this.pagination.allItems) {
            this.pagination.allItems = [];
        }
        var requestUrl = "";
        if (this.level == 2) {
            requestUrl = "/Enterprise/v2/Work/systemParameter/" + this.systemParameterId + "?include=spi";
        } else {
            requestUrl = "/Enterprise/v2/Work/systemParameterItem/" + this.systemParameterId;
        }
        this.systemParameterItem.header.map((value) => {
            if (value.fieldName == 'pageLayoutName') {
                value.dropDown = [];
            } else if (value.type == 'dropdown'
                && value.systemParameterItemModels
                && value.systemParameterItemModels.length > 0) {
                value.dropDown = [];
                value.systemParameterItemModels.map((model) => {
                    value.dropDown.push(model.value);
                })
            }
        })
        this.userProfileService.getAllPageLayout().toPromise().then(res => {
            var response: any = res;
            this.filter = {};
            this.allPageLayout = response;
            response.map((val) => {
                if (val.name && val.name.startsWith('spiLayout')) {
                    this.systemParameterItem.header.map((value) => {
                        if (value.fieldName == 'pageLayoutName') {
                            value.dropDown.push(val.name);
                        }
                    })
                }
            })
        }).catch(error => console.log(error));
        this.userProfileService.getSystemDetailData(requestUrl)
            .subscribe(res => {

                this.isButtonDisable = false;
                this.systemParameterItem.tableData = [];
                this.loaderOnSection = false;
                var thisDetail = res;
                var resParaText = 'systemParameterItem';
                if (this.level == 3) {
                    var resParaText = 'systemParameterItem';
                    this.resObject = res;
                    res = {
                        "systemParameterItem": [res]
                    }
                    this.systemParameterParams.tableData = thisDetail['params'];
                    //[0]['systemParameterItems']
                    var paramsList = thisDetail['params']
                    //console.log("paramsList: ");
                    //console.log(paramsList);
                    this.paramHeader = this.paramHeader.map((templateParam, index) => {
                        if (templateParam.type == 'MultiSelect') {
                            templateParam.selectedItems = [];
                            templateParam['systemParameterItemModels'].map((model, modelIndex) => {
                                // ng-select2 expects a field named "text" to contain the value to be selected
                                model.text = model.value;
                            })
                        }
                        paramsList.map((paramsValue, paramsIndex) => {
                            console.log("Processing: " + templateParam.type + ", " + templateParam.fieldName + ", " + paramsValue.name);
                            if (templateParam.fieldName == paramsValue.name) {
                                templateParam = { ...templateParam, fieldValue: paramsValue.value }
                                //console.log("matched fieldName to name: " + templateParam.fieldName + ", and set value: " + templateParam.fieldValue);
                                if (templateParam.type == 'select') {
                                    /* TODO: Can probably update this to work from the selected system parameter item
                                     * rather than from the value of that item. i.e. make it work like MultiSelect
                                     */
                                    paramsList[paramsIndex]['systemParameterItems'].map((spi) => {
                                        templateParam = { ...templateParam, fieldValue: spi.value }
                                    })
                                    console.log("templateParam after setting value for 'select'");
                                    console.log(templateParam);
                                }
                                if (templateParam.type == 'MultiSelect') {
                                    paramsList[paramsIndex]['systemParameterItems'].map((spi) => {
                                        // ng2-select expects the ID of each selected item
                                        templateParam.selectedItems.push(spi.id);
                                    })
                                }
                            }
                        })
                        return templateParam;
                    })
                    //console.log("paramHeader: ");
                    console.log(this.paramHeader);
                }
                this.systemParameterItem.tableData = thisDetail['systemParameterItem'];
                console.log(this.systemParameterItem.tableData);
                this.levelsystemParameterId = thisDetail['id'];
                if (this.level == 3) {
                    this.levelsystemParameterId = thisDetail['systemParameterId'];
                    this.parentId = thisDetail['id'];
                    this.systemDetailHeadName = thisDetail['value'];
                }

                this.paramsRequest = {
                    status: thisDetail['status'],
                    sortOrder: thisDetail['sortOrder'],
                    value: thisDetail['value'],
                    description: thisDetail['description'],
                    layoutTemplateId: thisDetail['layoutTemplateId']
                }
                this.systemDetail = this.systemDetail.map((value, index) => {
                    return { ...value, fieldValue: thisDetail[value.fieldName] };
                })
                this.modification = this.modification.map((value, index) => {
                    return { ...value, fieldValue: thisDetail[value.fieldName] };
                })

                this.systemParameterItem.tableData.forEach(row => {
                    row['rowEdit'] = false;
                });
                //                if (this.level == 3) {
                //                    this.Level3Details();
                //                } else {
                this.setupItemsTablePagination();
                //                }
                this.loading = false;
            }, (err) => {
                console.log(err);
                this.loading = false;
            });
    }

    onDeleteClick(data) {
        this.modalDetails = {
            ...this.modalDetails, isDeleteConfirm: true,
            title: "Confirm", className: "deletemodal",
            subTitle: "Are you sure that you want to delete the System Parameter Item?",
            from: "deletesystemparameteritem", data: data
        };
        this.modalChild.showModal();
    }

    //Modal popup for Task Type Dependency delete 
    onDeleteClickTaskDependency(data){
        this.modalDetails = {
            ...this.modalDetails, isDeleteConfirm: true,
            title: "Confirm", className: "deletemodal",
            subTitle: "Are you sure that you want to delete the Task Type Dependency?",
            from: "tasktypedependency", data: data
        };
        this.modalChild.showModal();
    }

    buttonClicked(fromModal) {
        if (fromModal.modal.from == 'deletesystemparameteritem') {
            this.deleteSystemParameterItem(fromModal.modal.data);
        }
        if (fromModal.modal.from == 'tasktypedependency') {
            this.deleteTaskTypeDependency(fromModal.modal.data);
        }
    }

    deleteSystemParameterItem(data) {
        var pagedItems = data.pagedItems;
        var rowIndex = data.rowIndex;
        this.loaderOnSection = true;
        var id = pagedItems[rowIndex]['id'];
        this.httpClient.delete(environment.apiUrl + '/Enterprise/v2/Work/systemParameterItem/' + id).
            toPromise().then((response: any) => {
                this.setMessage(true, "Successfully deleted system parameter item");
                pagedItems.splice(rowIndex, 1);
                this.tableComponent.removeItemFromAllItems(id);
                this.modalChild.hideModal();
            })
            .catch(error => {
                this.setMessage(false, error.error.text);
            });
    }

    //To Delete the Task Type Dependency
    deleteTaskTypeDependency(data){
        this.modalChild.hideModal();  
        this.loader = true;
        var pagedItems = data.pagedItems;
        var rowIndex = data.rowIndex;       
        var cuurentTaskId = localStorage.systemId; 
            var taskParamItem = {                
                dependentSuccTaskTypes:[],
                dependentPredTaskTypes:[]
                
            };
            taskParamItem["taskName"] = this.taskType["taskName"];
            taskParamItem["taskDesc"] = this.taskType["taskDesc"]   ;         
            taskParamItem["layoutTemplateId"]= this.taskType["layoutTemplateId"]
            taskParamItem["layoutTemplateName"]= this.taskType["layoutTemplateName"]
            taskParamItem["params"] = this.taskType["params"]
            taskParamItem["createdById"] = this.taskType["createdById"]
            taskParamItem["createdByName"]= this.taskType["createdByName"]
            taskParamItem["createdDtTm"]= this.taskType["createdDtTm"]
            taskParamItem["modifiedById"] = this.userInfo.cuid
            taskParamItem["modifiedByName"] = this.userInfo.displayName
            taskParamItem["modifiedDtTm"] = this.taskType["modifiedDtTm"]
            taskParamItem["taskTypeParam"] = this.taskType["taskTypeParam"]
            taskParamItem["id"] = this.taskType["id"];
                        
            pagedItems.splice(rowIndex,1);
           
            pagedItems.find(x => {
                if(x.dependencyType == 'successor') { 

                    delete x.dependencyType;                      
                    taskParamItem.dependentSuccTaskTypes.push(x);
                } 
               
                if(x.dependencyType == 'predecessor') {                    
                    delete x.dependencyType;                    
                    taskParamItem.dependentPredTaskTypes.push(x); 
                }
               
            }) 
            
        this.taskService.updateTaskTypeDependency( this.systemParameterId , taskParamItem)
            .toPromise().then((response: any) => {
                this.loader = false;
                this.setMessage(true, "Successfully Deleted Task Type Management");
                //pagedItems.splice(rowIndex, 1);  
                
            }).catch(error => {
                this.modalChild.hideModal();  
                this.setMessage(false, error.error.message);
            });       
        
    }

    checkfieldNameInHeader(fieldName){
        return  this.systemParameterItem.header.filter((value) =>  value.fieldName == fieldName).length>0?true:false;
    }

    getLabelByFieldName(fieldName){
        return this.systemParameterItem.header.filter((value) =>  value.fieldName == fieldName)[0].label;
    }

    onSaveClick(data) {             
        var pagedItems = data.pagedItems;
        var rowIndex = data.rowIndex;
        this.loaderOnSection = true;
        var sysParamItem = pagedItems[rowIndex]; 
        sysParamItem['rowEdit'] = true;            
         if (!this.isButtonDisable) {
            this.isButtonDisable = true;    

            if (this.checkfieldNameInHeader('value') && (!sysParamItem['value'] || !sysParamItem['value'].trim())) {
                this.setMessage(false, this.getLabelByFieldName('value')+" field cannot be empty. Please provide a value");
                return;
             }
             if(this.checkfieldNameInHeader('value')) {
                sysParamItem['value'] = sysParamItem['value'].trim();
             }
             
             
            if (this.checkfieldNameInHeader('pageLayoutName') && !sysParamItem['pageLayoutName']) {
               this.setMessage(false, this.getLabelByFieldName('pageLayoutName')+" field cannot be empty. Please provide a value");
               return;
            } 
            else  if (!this.checkfieldNameInHeader('pageLayoutName') && !sysParamItem['pageLayoutName']) {
                sysParamItem['pageLayoutName'] = "spiLayout_ListOfValues";
            }

            if(this.checkfieldNameInHeader('status') && !sysParamItem['status']) {
                this.setMessage(false, this.getLabelByFieldName('status')+" field cannot be empty. Please provide a value");
                return;
            }
            
            sysParamItem['rowEdit'] = false; 
           
                for (var i = 0; i < this.allPageLayout.length; i++) {
                    if (this.allPageLayout[i].name == sysParamItem['pageLayoutName']) {
                        sysParamItem['layoutTemplateId'] = this.allPageLayout[i].id;
                        break;
                    }
                }
            if (!sysParamItem.id) {
                sysParamItem['createdById'] = this.userInfo.cuid;
                sysParamItem['systemParameterId'] = this.levelsystemParameterId;
                if (!sysParamItem['sortOrder']) {
                    sysParamItem['sortOrder'] = 0;
                }
                if (this.level == 3) {
                    sysParamItem['parentId'] = this.parentId
                }
                this.createSystemParameterItem(pagedItems, rowIndex, sysParamItem);
                return;
            } else {
                // update - get the item before updating and saving it so that we don't lose
                // the parameters
                var requestUrl = "/Enterprise/v2/Work/systemParameterItem/" + sysParamItem.id + "?include=p";
                this.userProfileService.getSystemDetailData(requestUrl)
                    .toPromise().then(res => {
                        var freshItem: any = res;
                        freshItem['modifiedById'] = this.userInfo.cuid;
                        freshItem['value'] = sysParamItem['value'];
                        freshItem['layoutTemplateId'] = sysParamItem['layoutTemplateId'];
                        freshItem['sortOrder'] = sysParamItem['sortOrder'];
                        freshItem['description'] = sysParamItem['description'];
                        freshItem['status'] = sysParamItem['status'];
                        this.userProfileService.updateSystemParameterItem(freshItem)
                            .toPromise().then((response: any) => {
                                this.setMessage(true, "Successfully updated system parameter item");
                                pagedItems.splice(rowIndex, 1, response);
                                this.tableComponent.updateItemInAllItems(response);
                            }).catch(error => {
                                console.log("caught error from update");
                                console.log(error);
                                this.setMessage(false, error.error.message);
                            });
                    }, (err) => {
                        console.log(err)
                    });
            }
        
    }
       
    }
    //Adding new tasktype dependency
    //to Update the tasktypedepence create and update;
    onDependencySave(data){        
        var pagedItems = data.pagedItems;
        var rowIndex = data.rowIndex;
        this.loaderOnSection = true;
        var cuurentTaskId = localStorage.systemId;     
        for (var i = 0; i < pagedItems.length; i++) {
            delete pagedItems[i].createdById
            delete pagedItems[i].commitDate
            delete pagedItems[i].createdDtTm
            delete pagedItems[i].custRequestedDueDate
            delete pagedItems[i].modifiedDtTm
            delete pagedItems[i].modifiedById
            delete pagedItems[i].receipt
            delete pagedItems[i].taskDueDate
            delete pagedItems[i].rowEdit
        }   
        var taskParamItem = {                
            dependentSuccTaskTypes:[],
            dependentPredTaskTypes:[]
        };
        taskParamItem["taskName"] = this.taskType["taskName"]
        taskParamItem["taskDesc"] = this.taskType["taskDesc"]            
        taskParamItem["layoutTemplateId"]= this.taskType["layoutTemplateId"]
        taskParamItem["layoutTemplateName"]= this.taskType["layoutTemplateName"]
        taskParamItem["params"] = this.taskType["params"]
        taskParamItem["createdById"] = this.taskType["createdById"]
        taskParamItem["createdByName"]= this.taskType["createdByName"]
        taskParamItem["createdDtTm"]= this.taskType["createdDtTm"]
        taskParamItem["modifiedById"] = this.userInfo.cuid
        taskParamItem["modifiedByName"] = this.userInfo.displayName
        taskParamItem["modifiedDtTm"] = this.taskType["modifiedDtTm"]
        taskParamItem["taskTypeParam"] = this.taskType["taskTypeParam"] 
        taskParamItem["id"] = localStorage.systemId         
            pagedItems.map(x => {
                if(x.dependencyType == 'successor') {  
                    delete x.dependencyType;    
                    taskParamItem.dependentSuccTaskTypes.push(x);
                } 
               
                if(x.dependencyType == 'predecessor') {                    
                    delete x.dependencyType;
                    taskParamItem.dependentPredTaskTypes.push(x); 
                }
               
            })         
        
        this.httpClient.put(environment.apiUrl + "/Enterprise/v2/Work/taskType/" + this.systemParameterId, taskParamItem)
        .toPromise().then((response: any) => {              
            this.loaderOnSection = false;            
            this.setMessage(true, "Successfully updated Task Type Management");
            taskParamItem.dependentPredTaskTypes.forEach((key) => {
                key["dependencyType"] = 'predecessor';
              })
              taskParamItem.dependentSuccTaskTypes.forEach((key) => {
                key["dependencyType"] = 'successor';
              })
              this.onRefresh1();
            
        }).catch(error => {   
            this.setMessage(false, error.error.message);  
            this.onRefresh1();      
        });
   
             
    }    
    
    responseHandler(error) {
        console.log("response handler");
        console.log(error);
        if (error.text && error.text == "Success") {
            this.getViewDataTable();
            this.setMessage(true, "Success");
        } else {
            console.log(error)
            this.isButtonDisable = false;
            if (error.message && typeof error.message == 'string') {
                this.setMessage(false, error.error.text);
            } else {
                this.setMessage(false, 'Unable to determine error/success from response: ' + JSON.stringify(error));
            }
        }
    }

    private setMessage(success: boolean, message: string) {
        this.loaderOnSection = false;
        this.isButtonDisable = false;
        this.IsSuccess = success;
        this.IsError = !success;
        this.message = message;
        if (this.IsSuccess) {
            setTimeout(() => {
                this.IsSuccess = false;
            }, 5000);
        }
    }

    createSystemParameterItem(pagedItems, rowIndex, requestObj) {
        this.userProfileService.createSystemParameterItem(requestObj).toPromise()
            .then((response: any) => {
                this.setMessage(true, "Successfully created system parameter item");
                pagedItems.splice(rowIndex, 1, response);
                this.pagination.allItems.push(response);
                this.pagination.totalRecords = this.pagination.allItems.length;
                this.tableComponent.setPage(this.tableComponent.pager.currentPage);
            }).catch(error => {
                console.log("Caught error during create item");
                console.log(error);
                if (error.error && error.error.text) {
                    this.setMessage(false, error.error.text);
                }
                this.setMessage(false, error.error.message);
                this.tableComponent.setPage(this.tableComponent.pager.currentPage);
            });
    }

    onEditClick(rowIndex) {
        console.log("onEditClick");
        // this.iconEdit = false;
        // this.iconSave = true;
        let index = 0;
        this.systemParameterItem.tableData.forEach(row => {
            if (rowIndex == index) {
                row['rowEdit'] = true;
            }
            index++;
        });
    }

    onCloseClick(rowIndex) {
        let index = 0;
        const temp = this.itemsBackUp;
        var tempIndex = rowIndex

        if (this.pagination.pageNumber > 1) {
            tempIndex = ((this.pagination.pageNumber - 1) * this.pagination.selectedLimit) + rowIndex;
        }
        if (temp.length > rowIndex) {
            for (var val in this.systemParameterItem.tableData[rowIndex]) {
                this.systemParameterItem.tableData[rowIndex][val] = temp[tempIndex][val];
            }
        }
        this.systemParameterItem.tableData[rowIndex]['rowEdit'] = false;
        const roles = this.systemParameterItem.tableData;
        if (roles[rowIndex] && !roles[rowIndex].id) {
            roles.splice(rowIndex, 1);
        }
    }

    onDependencyCloseClick(rowIndex) {
        let index = 0;
        const temp = this.itemsBackUp;
        var tempIndex = rowIndex
        this.systemParameter.tableData.forEach(row => {
            if (rowIndex == index) {
                row['rowEdit'] = false;
            }
            index++;
        });
     

        if (this.pagination.pageNumber > 1) {
            tempIndex = ((this.pagination.pageNumber - 1) * this.pagination.selectedLimit) + rowIndex;
        }
        if (temp.length > rowIndex) {
            for (var val in this.systemParameter.tableData[rowIndex]) {
                this.systemParameterItem.tableData[rowIndex][val] = temp[tempIndex][val];
            }
        }
        this.systemParameter.tableData[rowIndex]['rowEdit'] = false;
        const roles = this.systemParameterItem.tableData;
        if (roles[rowIndex] && !roles[rowIndex].id) {
            roles.splice(rowIndex, 1);
        }
    }

    addNewRow(event) {
        console.log("addNewRow");
        this.iconEdit = true;
        event.pagedItems.unshift(
            {
                createdById: "", modifiedById: "", rowEdit: true
            }
        )       
    }

    addNewRowDependency(event) {
        console.log("addNewRow");
        this.iconEdit = true;        
        event.pagedItems.unshift({
            taskTypeDependencyId: '', taskTypeDependencyName: '', dependencyDescription: "", mandatory: "", rowEdit: true
        });
    }

    onSortSelection(event) {
        if (this.isSortAsc) {
            this.isSortAsc = false;
            this.itemsBackUp.sort(function (a, b) {
                return ((a[event.columnName] < b[event.columnName]) ? -1 : ((a[event.columnName] > b[event.columnName]) ? 1 : 0))
            });
        } else {
            this.isSortAsc = true;
            this.itemsBackUp.sort(function (a, b) {
                return ((a[event.columnName] < b[event.columnName]) ? -1 : ((a[event.columnName] > b[event.columnName]) ? 1 : 0)) * -1
            });
        }

        this.filterRows(this.pagination.currentPageNumber)
    }

    filterRows(isPagination = 0) {
        this.systemParameterItem.tableData = JSON.parse(JSON.stringify(this.itemsBackUp));
        var tempFullData = this.systemParameterItem.tableData;
        var temp = [];

        for (var value in this.filter) {
            if (this.filter[value] == "") {
                delete this.filter[value];
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
            temp = JSON.parse(JSON.stringify(this.itemsBackUp))
        }
        var headerVisible = this.systemParameterItem.header.map((value) => {
            if (value.visible) {
                return value.fieldName
            }
        })
        if (this.systemParameterItem.globalSearch) {
            temp = temp.filter(row => {
                var result = {};
                for (var key in row) {
                    if (headerVisible.indexOf(key) > -1 && row.hasOwnProperty(key) && row[key] && row[key].toUpperCase().indexOf(this.systemParameterItem.globalSearch.toUpperCase()) !== -1) {
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
        //console.log(temp);
        if (isPagination == 0) {
            isPagination = 1;
            setTimeout(() => {
                // this.pagination.pageNumber = 1;
            }, 100)
        } else {
            // this.pagination.pageNumber = isPagination;
        }

        //this.systemParameter.tableData = temp;
        this.pagination.totalRecords = temp.length;
        this.systemParameterItem.tableData = temp.slice((isPagination - 1) * this.pagination.selectedLimit, isPagination * this.pagination.selectedLimit);
        this.pagination.totalPage = Math.ceil(this.pagination.totalRecords / this.pagination.selectedLimit);
        //console.log(this.pagination.currentPageNumber);
        this.pagination.currentPageNumber = (isPagination > 0) ? isPagination : 1;
    }

    openTab(event) {
        
        if (event.link) {
            
            if (event.task && event.task.pageLayoutName) {
                localStorage.systemId = event.task.id;
                localStorage.systempageLayoutName = event.task.pageLayoutName;
                let tab = new Tab(this.getComponentType('SystemParametersDetailsComponent'), event.name, '/Enterprise/v2/Work/systemParameterItem/' + localStorage.systemId + '?include=p',{});
                this.tabService.openTab(tab);
            }
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

    paginationChange() {
        for (var value in this.filter) {
            this.filter[value] = '';
        }
        this.pagination.currentPageNumber = 1;
        var temp = JSON.parse(JSON.stringify([...this.itemsBackUp]));
        this.systemParameterItem.tableData = temp.slice(0, this.pagination.selectedLimit);
        this.pagination.totalRecords = this.itemsBackUp.length;
        this.pagination.totalPage = Math.ceil(this.pagination.totalRecords / this.pagination.selectedLimit);
        this.convertNumberToArray(this.pagination.totalPage);
    }

    nextItems() {
        this.loading = true;
        this.previousDisable = false;
        this.nextDisable = false;
        // let totalPages = Math.ceil(this.pagination.totalRecords / this.pagination.pageSize);
        let totalPages = Math.ceil(this.pagination.totalRecords / 100);

        let nextPage = this.pagination.pageNumber + 1;
        if (nextPage == totalPages) {
            this.nextDisable = true;
        }
        this.pagination.pageNumber = nextPage;
        //this.searchTask();
    }

    previousItems() {
        this.loading = true;
        this.previousDisable = false;
        this.nextDisable = false;

        let previousPage = this.pagination.pageNumber - 1;
        if (previousPage == 1) {
            this.previousDisable = true;
        }
        this.pagination.pageNumber = previousPage;
        //this.searchTask();
    }

    onGridNext() {
        if (this.pagination.currentPageNumber < this.tablePaginationData.length) {
            this.pagination.currentPageNumber += 1;
            this.pageChanged(this.pagination.currentPageNumber);
        }
    }

    onGridPrevious() {
        if (this.pagination.currentPageNumber != 1) {
            this.pagination.currentPageNumber -= 1;
            this.pageChanged(this.pagination.currentPageNumber);
        }
    }

    activateTab(index) {
        this.tabList.map((value, i) => {
            if (i == index) {
                this.tabList[i].default = true;
                this.currentlyActiveSections = this.tabList[i].activeSection;
                //if (this.tabList[i].fieldName === 'included') {
               // this.setupItemsTablePagination();
                //                } else {
                //                    this.Level3Details();
                //                }
            } else {
                this.tabList[i].default = false;
            }
        })
    }

    isSectionVisible(value) {
        //console.log("Section: " + value + " visible: " + (this.currentlyActiveSections.indexOf(value) > -1));
        return this.currentlyActiveSections.indexOf(value) > -1;
    }

    pageChanged(e) {
        this.filterRows(e);
    }
    //    pageParamsChanged(e) {
    //        this.filterParamsRoles(e.page);
    //    }

    convertNumberToArray(count: number) {
        this.tablePaginationData = [];
        for (let i = 1; i <= count; i++) {
            this.tablePaginationData.push(i);
        }
    }

    ParamsconvertNumberToArray(count: number) {
        this.ParamsTablePaginationData = [];
        for (let i = 1; i <= count; i++) {
            this.ParamsTablePaginationData.push(i);
        }
    }

    setupItemsTablePagination() {
        this.itemsBackUp = JSON.parse(JSON.stringify(this.systemParameterItem.tableData));
        this.pagination.totalRecords = this.itemsBackUp.length;
        this.pagination.totalPage = Math.ceil(this.pagination.totalRecords / this.pagination.selectedLimit);
        this.pagination.currentPageNumber = 1;
        if(!this.pagination.allItems){
            this.pagination.allItems = [];
        }
        this.pagination.allItems = this.pagination.allItems.concat(this.itemsBackUp);
        this.convertNumberToArray(this.pagination.totalPage);
        var limit = 0;
        if (this.pagination.totalRecords > 0 && this.loading) {
            this.pagination.currentPageNumber = 1;
        } else {
            if (this.pagination.pageNumber == 0 && this.pagination.totalRecords > 0) {
                // this.pagination.pageNumber = 1;
                this.pagination.currentPageNumber = 1;
            } else if (this.pagination.totalRecords > 0) {
                limit = Number(this.pagination.pageNumber - 1) * Number(this.pagination.selectedLimit)
            }
        }
        this.systemParameterItem.tableData = this.systemParameterItem.tableData.slice(limit, this.pagination.selectedLimit * (limit + 1));
        console.log("paginated tableData");
        console.log(this.systemParameterItem.tableData);
    }

    saveAndUpdate() {
        console.log("Starting saveAndUpdate for params");
        console.log("Params from SPI object before mapping");
        console.log(this.resObject['params']);
        console.log("Params from page layout before mapping");
        console.log(this.paramHeader);
        /*
         * This is done backwards. Need to loop through the template parameters and map the 
         * values for each to the resObject params.  And need to create any missing params.
        */
        this.paramHeader.map((pltParam, index) => {
            var foundIt = false;
            this.resObject['params'] = this.resObject['params'].map((spiParam, paramsIndex) => {
                if (pltParam.fieldName == spiParam.name) {
                    foundIt = true;
                    if (pltParam.systemParameterItemModels) {
                        /* Value comes from related system parameter item (SPI). Loop through the SPIs for
                         * the pltParam and find the SPI that matches the value on the pltParam.
                         * 
                         * TODO: This only works for single select fields. We're using the fieldValue that 
                         * was set in the UI for the single select field and then finding the matching SPI
                         * for that value. Then set that SPI in the appropriate spiParam item. At some point
                         * we need to support mulit-select, which means changing the way the selection field
                         * works so that it's linked directly to the SPIs with the values.
                         */
                        console.log("Setting SPI for Param: " + pltParam.fieldName + " with type: '" + pltParam.type + "'");
                        if (pltParam.type == 'select') {
                            console.log(pltParam.systemParameterItemModels);
                            pltParam.systemParameterItemModels.map((spim, spiIndex) => {
                                console.log(spim);
                                console.log(spim.value);
                                if (spim.value == pltParam.fieldValue) {
                                    console.log("set SPI in spiParam with value: " + spim.value);
                                    spiParam.systemParameterItems[0] = spim;
                                }
                            });
                        } else if (pltParam.selectedItems && pltParam.selectedItems.length > 0) {
                            console.log("setting multiple values");
                            console.log(pltParam.selectedItems);
                            /* selectedItems will contain the IDs of each selected item. So need to find
                             * those items and copy them from models to spiParam.systemParameterItems 
                             */
                            spiParam.systemParameterItems = [];
                            pltParam.selectedItems.map((selected, selectedIndex) => {
                                pltParam.systemParameterItemModels.map((spim, spiIndex) => {
                                    if (spim.id == selected) {
                                        spiParam.systemParameterItems.push(spim);
                                    }
                                });
                            });
                        } else {
                            console.log("type != 'select' and selectedItems null or empty");
                            spiParam.systemParameterItems = [];
                        }
                    } else {
                        /* Value comes from value field of pltParam */
                        spiParam = { ...spiParam, value: pltParam.fieldValue };
                    }
                }
                return spiParam;
            });
            if (!foundIt && ((pltParam.fieldValue && pltParam.fieldValue != null) || (pltParam.selectedItems != null && pltParam.selectedItems.length > 0))) {
                /*
                 * TODO: Need to handle the condition where there is a pltParam with a value but there is no matching spiParam  
                 */
                console.log("TODO: Create new param for: " + pltParam.fieldName + " with value: " + pltParam.fieldValue);
                var spiParam = {
                    name: pltParam.fieldName,
                    value: pltParam.fieldValue,
                    systemParameterItems: []
                }
                if (pltParam.type == 'select') {

                } else if (pltParam.type == 'MultiSelect') {
                    /*
                      * TODO: This is duplicate code, same as above - need to clean this up 
                      */
                    if (pltParam.selectedItems && pltParam.selectedItems.length > 0) {
                        console.log("setting multiple values");
                        console.log(pltParam.selectedItems);
                        /* selectedItems will contain the IDs of each selected item. So need to find
                         * those items and copy them from models to spiParam.systemParameterItems 
                         */
                        spiParam.systemParameterItems = [];
                        pltParam.selectedItems.map((selected, selectedIndex) => {
                            pltParam.systemParameterItemModels.map((spim, spiIndex) => {
                                if (spim.id == selected) {
                                    spiParam.systemParameterItems.push(spim);
                                }
                            });
                        });
                    }
                }
                this.resObject['params'].push(spiParam);
            }
        });
        console.log("About to put this.resObject");
        console.log(this.resObject);
        this.userProfileService.putSystemDetailData(
            '/Enterprise/v2/Work/systemParameterItem/' + this.systemParameterId,
            this.resObject,
            JSON.parse(localStorage.fd_user).cuid)
            .subscribe(res => {
                console.log(res);
                this.setMessage(true, "Success");
            }, (error) => {
                this.responseHandler(error.error);
            });
    }

    saveAndUpdateTaskType(event) {
        //this.loading = true;
        this.Utility.showLoader();
        console.log("event", event);
        let tmpReqData: any;
        let resourceParams: any = [];
        let RESData = this.Utility.GetResponcesInPramaeData(event);
        tmpReqData = RESData.tmpReqData;
        resourceParams = RESData.workgroupParams;
        /* if (isArray(event)) {
            event.forEach((taskTypeEl: any) => {
                tmpReqData = taskTypeEl.fieldsList.map((pltParam, index) => {
                    if (pltParam.fieldValue) {
                        return pltParam;
                    }
                    else if(pltParam.selectedItems && pltParam.selectedItems.length > 0){
                        return pltParam;
                    }

                });
    
                taskTypeEl.fieldsList.map((pltParam, index) => {
                    var spiParam = {
                        name: pltParam.fieldName,
                        value: pltParam.fieldValue,
                        systemParameterItems: []
                    }
                    if (pltParam.type == 'select') {
                        pltParam.systemParameterItemModels.map((spim, spiIndex) => {
                        if (spim.value == pltParam.fieldValue) {
                            console.log(pltParam);
                            spim.name= pltParam.fieldName;
                            spiParam.systemParameterItems[0] = spim;
                            //spiParam.value = spim.value;
                            resourceParams.push(spim);
                        }
                        });
                    } else if (pltParam.type == 'MultiSelect') {
                        if (pltParam.selectedItems && pltParam.selectedItems.length > 0) {
                        spiParam.systemParameterItems = [];
                        pltParam.selectedItems.map((selected, selectedIndex) => {
                            pltParam.systemParameterItemModels.map((spim, spiIndex) => {
                            if (spim.value == selected) {
                                spiParam.systemParameterItems.push(spim);
                            }
                            });
                        });
                        resourceParams.push(spiParam);
                        }
                    }
                    else{
                        spiParam.value = pltParam.fieldValue;
                        resourceParams.push(spiParam);
                        }
                });
            });
        } else {
            tmpReqData = event.fieldsList.map((pltParam, index) => {
                if (pltParam.fieldValue) {
                    return pltParam;
                }
                else if(pltParam.selectedItems && pltParam.selectedItems.length > 0){
                    return pltParam;
                }

            });

            event.fieldsList.map((pltParam, index) => {
                var spiParam = {
                    name: pltParam.fieldName,
                    value: pltParam.fieldValue,
                    systemParameterItems: []
                }
                if (pltParam.type == 'select') {
                    pltParam.systemParameterItemModels.map((spim, spiIndex) => {
                    if (spim.value == pltParam.fieldValue) {
                        console.log(pltParam);
                        spim.name= pltParam.fieldName;
                        spiParam.systemParameterItems[0] = spim;
                        //spiParam.value = spim.value;
                        resourceParams.push(spim);
                    }
                    });
                } else if (pltParam.type == 'MultiSelect') {
                    if (pltParam.selectedItems && pltParam.selectedItems.length > 0) {
                    spiParam.systemParameterItems = [];
                    pltParam.selectedItems.map((selected, selectedIndex) => {
                        pltParam.systemParameterItemModels.map((spim, spiIndex) => {
                        if (spim.value == selected) {
                            spiParam.systemParameterItems.push(spim);
                        }
                        });
                    });
                    resourceParams.push(spiParam);
                    }
                }
                else{
                    spiParam.value = pltParam.fieldValue;
                    resourceParams.push(spiParam);
                    }
            });
        } */
        
        console.log(tmpReqData);
        let param = [];
        tmpReqData.forEach(element => {
            if (element != undefined) {
                if (element.type == 'MultiSelect') {
                    param.push({name: element.fieldName, value: element.selectedItems});
                } else {
                    param.push({name: element.fieldName, value: element.fieldValue});
                }
            }
        });

        this.resObject.params = resourceParams;
        console.log(this.resObject);
        console.log(param);
        
        this.userProfileService.updateSTaskTypeParamsItem(this.resObject).toPromise().then((res: any) => {
            console.log(res);
            this.loading = false;
            this.Utility.hideLoader();
            this.IsSuccess = true;
            this.message = res.message || "Success!";
            setTimeout(() => {
                this.IsSuccess = false;
            }, 7000);
        }).catch((err) => {
            console.log(err);
            this.IsError = true;
            this.message = err.error.message;
            this.Utility.hideLoader();
            setTimeout(() => {
                this.IsError = false;
            }, 7000);
            this.loading = false;
        });
    }

    onRefresh() {
        this.loading = true;
        this.getViewDataTable();
        // if (this.url != '/SystemParameter/') {        
        // this.getViewDataTable1();
        // }
    };
    onRefresh1(){
        this.loader = true;
        this.taskTypeDependency = false;
        this.getViewDataTable1();
      
    }

    //To get the Table header and action coulms for the taskdependency section
    getSystemParamters(header, field, actions) {
		var add = true,
			editable = true,
			deleteable = true;
	
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
		this.getViewDataTable1();
	}
	//added to display the data into the Task Dependency Table;
    taskTypeDependency: boolean = false;
    getViewDataTable1() {
        var cuurentTaskId = localStorage.systemId;    
		this.taskService.getTaskType( this.systemParameterId).subscribe(res => {		
               this.loader = true;                
               this.taskType = res
               let dependentPredTaskTypes =[];
               let dependentSuccTaskTypes =[] 
                this.systemParameter.tableData = [];
                if(res['dependentPredTaskTypes']){
                    for (var i = 0; i < res['dependentPredTaskTypes'].length; i++) {
                        dependentPredTaskTypes.push(res['dependentPredTaskTypes'][i]);
                        dependentPredTaskTypes[i].dependencyType = 'predecessor';
                    }
                }
                if(res['dependentSuccTaskTypes']){
                    for (var i = 0; i < res['dependentSuccTaskTypes'].length; i++) {
                        dependentSuccTaskTypes.push(res['dependentSuccTaskTypes'][i]);  
                        dependentSuccTaskTypes[i].dependencyType = 'successor';                      
                    }
                }
               
                this.systemParameter.tableData = dependentPredTaskTypes.concat(...dependentSuccTaskTypes);
                this.pagination.totalRecords = this.systemParameter.tableData.length;
                this.pagination.allItems = dependentPredTaskTypes.concat(...dependentSuccTaskTypes);
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
                this.loader = false;
				this.systemParameter.tableData = this.systemParameter.tableData.slice(limit, this.pagination.selectedLimit * (limit + 1));
				this.pagination.currentPageNumber = 1;				
                this.convertNumberToArray(this.pagination.totalPage);
                setTimeout(() => {
                    this.taskTypeDependency = true; 
                  }, 1000);   
                this.loader = false;
			}), (err) => {
                console.log(err.error);
                this.loader = false;
            }
            this.loader = true;
	}
}

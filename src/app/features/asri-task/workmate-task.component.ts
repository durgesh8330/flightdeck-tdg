import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import {
  MatSnackBar,
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material';
import { WorkmateService } from '@app/features/asri-task/workmate.service';
import { isArray, isObject } from 'util';

@Component({
  selector: 'sa-workmate-task',
  templateUrl: './workmate-task.component.html',
  styleUrls: ['./workmate-task.component.css']
})
export class WorkmateTaskComponent implements OnInit {
  public loader = false;
  public taskDetails: any = {};
  public taskDetailsBackup: any = {};
  header: string;
  label: string;
  fieldName: string;
  fieldValue: string;
  editable: false;
  mandatory: false;
  type: string;
  fieldsData: any = {};
  data: any = {};
  userInfo: any;

  options: any;
  pageLayout: any = {};
  Jsondata: any = {};
  IsShowData = false;
  SearchTaskId = '';
  modelValue: any = [];

  constructor(
    private workMateService: WorkmateService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.options = {
      multiple: true,
      tags: true
    };
    this.pageLayout = {
      "pageLayoutTemplate": [
        {
          "sectionHeader": "Trouble Report",
          "fieldsList": [
            {
              "fieldName": "TTN",
              "visible": "true",
              "editable": "false",
              "label": "TTN",
              "type": "input",
              "fieldValue": ""
            },
            {
              "fieldName": "Fetch",
              "visible": "true",
              "editable": "false",
              "label": "Fetch",
              "type": "button",
              "fieldValue": ""
            }
          ]
        },
        {
          "sectionHeader": "summary",
          "fieldsList": [
            {
              "button": false,
              "fieldName": "assignedCuid",
              "textarea": false,
              "label": "Assigned To",
              "key": "status_code"
            },
            {
              "button": false,
              "fieldName": "assignedName",
              "textarea": false,
              "label": "Assigned To Name",
              "key": "status_code"
            },
            {
              "button": false,
              "fieldName": "workgroupList",
              "textarea": false,
              "label": "Assigned Workgroup(s)",
              "key": "description"
            }
          ]
        },
        {
          "sectionHeader": "Form",
          "fieldsList": [
            {
              "button": false,
              "fieldName": "CCM NAME",
              "textarea": false,
              "label": "CCM NAME",
              "key": "status_code",
              "type": "TextBox"
            },
            {
              "button": false,
              "fieldName": "CCM Contact",
              "textarea": false,
              "label": "CCM Contact",
              "key": "status_code",
              "type": "TextBox"
            },
            {
              "button": false,
              "fieldName": "Originator CUID",
              "textarea": false,
              "label": "Originator CUID",
              "key": "description",
              "type": "TextBox"
            },
            {
              "button": false,
              "fieldName": "Bandwidth",
              "textarea": false,
              "label": "Bandwidth",
              "key": "description",
              "type": "TextBox"
            },
            {
              "button": false,
              "fieldName": "A Loc Dark Green POP",
              "textarea": false,
              "label": "A Loc Dark Green POP",
              "key": "description",
              "type": "TextBox"
            },
            {
              "button": false,
              "fieldName": "Z Loc Dark Green POP",
              "textarea": false,
              "label": "Z Loc Dark Green POP",
              "key": "description",
              "type": "TextBox"
            },
            {
              "button": false,
              "fieldName": "ROCID",
              "textarea": false,
              "label": "ROCID",
              "key": "description",
              "type": "TextBox"
            },
            {
              "button": false,
              "fieldName": "AMS",
              "textarea": false,
              "label": "AMS",
              "key": "description",
              "type": "TextBox"
            }
          ]
        }
      ],
      "templateName": "LMOS TaskDetails",
      "createdById": "AC30161"
    };
    console.log(this.Jsondata);
    this.getWorkMateForm();
  }

  getWorkMateForm() {
    this.loader = true;
    this.userInfo = JSON.parse(localStorage.getItem('fd_user'));
    this.workMateService
      .getWorkMateForm().toPromise()
      .then((response: any) => {
        console.log('RESPONSE....', response);

        this.taskDetails['modifiedById'] = this.userInfo['cuid'];
        this.loader = false;
        if (
          response &&
          response['taskCommonFields'] &&
          response['taskCommonFields']['fieldList']
        ) {
          response['taskCommonFields']['fieldList'].forEach(element => {
            if (element.fieldName == 'createdById') {
              element.fieldValue = this.userInfo['cuid'];
              element.editable = false;
            }
          });
        }
        this.taskDetails = response;
        this.populateValuesForLookup();
        this.taskDetails.taskSpecificFieldsList = [];
        this.taskDetailsBackup = JSON.parse(JSON.stringify(this.taskDetails));
      })
      .catch((error: any) => {
        this.loader = false;
        console.error(error);
        this.snackBar.open('Error loading Task Details..', 'Okay', {
          duration: 15000
        });
      });
  }

  populateValuesForLookup() {
    this.taskDetails.taskCommonFields.fieldList.forEach(field => {
      if (field.type === 'lookup' || field.type === 'select') {
        this.workMateService
          .getDropDownValues(field.service)
          .toPromise()
          .then((response: any) => {
            field.dropdownList = response;
          });
      }
    });
  }

  createWorkMateTask() {
    this.loader = true;

    let reqObj = {
      appTaskInstanceId: '',
      taskInstDesc: '',
      application: {
        applicationName: 'ASRI'
      },
      sourceSystem: '',
      escalated: false,
      taskStatus: '',
      taskInstNotes: '',
      actionType: '',
      claimId: '',
      taskType: {
        taskName: ''
      },
      workgroupList: [],
      skillList: [],
      createdById: '',
      modifiedById: '',
      taskFieldList: []
    };

    if (
      this.taskDetails &&
      this.taskDetails['taskCommonFields'] &&
      this.taskDetails['taskCommonFields']['fieldList']
    ) {
      this.taskDetails['taskCommonFields']['fieldList'].forEach(element => {
        if (element.fieldName == 'appTaskInstanceId') {
          reqObj['appTaskInstanceId'] = element.fieldValue;
        } else if (element.fieldName == 'taskInstDesc') {
          reqObj['taskInstDesc'] = element.fieldValue;
        } else if (element.fieldName == 'SourceSystem') {
          reqObj['SourceSystem'] = element.fieldValue;
        } else if (element.fieldName == 'taskType') {
          reqObj['taskType']['taskName'] = element.fieldValue[0];
        } else if (element.fieldName == 'workgroupList') {
          reqObj['workgroupList'].push({
            workgroupName: element.fieldValue[0]
          });
        } else if (element.fieldName == 'skillList') {
          reqObj['skillList'].push({ skillName: element.fieldValue[0] });
        } else if (element.fieldName == 'taskInstNotes') {
          reqObj['taskInstNotes'] = element.fieldValue;
        } else if (element.fieldName == 'taskStatus') {
          reqObj['taskStatus'] = element.fieldValue;
        } else if (element.fieldName == 'claimId') {
          reqObj['claimId'] = element.fieldValue;
        } else if (element.fieldName == 'createdById') {
          reqObj['createdById'] = element.fieldValue;
        }
      });
    }

    reqObj['taskFieldList'] = this.taskDetails['taskSpecificFieldsList'];

    this.workMateService
      .createWorkMateTask(reqObj)
      .toPromise()
      .then((data: any) => {
        this.loader = false;
        this.snackBar.open(data.message, 'Okay', {
          duration: 15000
        });
      })
      .catch((error: any) => {
        this.loader = false;
        this.snackBar.open(error.message, 'Okay', {
          duration: 15000
        });
      });
    // this.workMateService.createWorkMateTask(this.taskDetails);
  }

  reset() {
    this.IsShowData = false;
    this.SearchTaskId = '';
    // this.taskDetails = JSON.parse(JSON.stringify(this.taskDetailsBackup));
    // this.populateValuesForLookup();
  }

  addAttribute(index) {
    this.taskDetails.taskCommonFields.fieldList.splice(
      index + 1,
      0,
      this.taskDetails.taskCommonFields.fieldList[index]
    );
  }

  addNewSection() {
    const dialogRef = this.dialog.open(DialogOverviewSectionDialog, {
      width: 'auto',
      data: {
        header: this.header
      }
    });

    dialogRef.componentInstance.onSectionAdd.subscribe(result => {
      if (result) {
        const newSection = {
          header: result.header,
          fieldList: []
        };
        if (this.taskDetails.taskSpecificFieldsList) {
          this.taskDetails.taskSpecificFieldsList.push(newSection);
        } else {
          this.taskDetails.taskSpecificFieldsList = [];
          this.taskDetails.taskSpecificFieldsList.push(newSection);
        }
        // this.taskDetails.taskSpecificFieldsList[0].fieldList.push(newSection);
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed' + result);
    });
  }

  submitSection(data) {
    if (data) {
      const newSection = {
        header: data.header,
        fieldList: []
      };
      if (this.taskDetails.taskSpecificFieldsList) {
        this.taskDetails.taskSpecificFieldsList.push(newSection);
      } else {
        this.taskDetails.taskSpecificFieldsList = [];
        this.taskDetails.taskSpecificFieldsList.push(newSection);
      }
      //this.addSectionModal.hide();
      // this.taskDetails.taskSpecificFieldsList[0].fieldList.push(newSection);
    }
  }

  submitFields(result) {
    if (result) {
      const newSection = {
        label: result.label,
        fieldName: result.fieldName,
        fieldValue: result.fieldValue,
        editable: result.editable ? result.editable : false,
        mandatory: result.mandatory ? result.mandatory : false,
        type: result.type,
        dropdownList: ['string'],
        service: null
      };

      this.taskDetails.taskSpecificFieldsList[result.id].fieldList.push(
        newSection
      );
      //this.addFieldsModal.hide();
    }
  }

  onChange() {
    this.options.mode = this.options.inline ? 'inline' : 'popup';
  }

  addNewFields(idx) {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '455px',
      data: {
        label: this.label,
        fieldName: this.fieldName,
        fieldValue: this.fieldValue,
        editable: this.editable,
        mandatory: this.editable,
        type: this.type
      }
    });

    dialogRef.componentInstance.onAdd.subscribe(result => {
      if (result) {
        const newSection = {
          label: result.label,
          fieldName: result.fieldName,
          fieldValue: result.fieldValue ? result.fieldValue.trim() : '' || '',
          editable: !!result.editable,
          mandatory: result.mandatory ? result.mandatory : false,
          type: result.type,
          service: null,
          dropdownList: result.selectOptions
            ? result.selectOptions
                .trim()
                .split(',')
                .map(o => o.trim())
            : [] || []
        };

        this.taskDetails.taskSpecificFieldsList[idx].fieldList.push(newSection);
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed' + result);
    });
  }

  onSourceChange(event, field: any) {
    console.log(event);
    if (field.fieldName == 'SourceSystem') {
      this.getAllTaskName(event.value[0]);
    }
  }

  getAllTaskName(event) {
    this.workMateService
      .getAllTaskNames(event)
      .toPromise()
      .then((response: any) => {
        this.taskDetails.taskCommonFields.fieldList.forEach(element => {
          if (element.fieldName == 'taskType') {
            element.dropdownList = response;
          }
        });
      });
  }

  fetchData() {
    this.IsShowData = true;
    this.Jsondata = {
      "sourceTaskId": "Siva_Test-12",
      "taskInstDesc": "no description",
      "sourceSystemName": "AUTOPILOT",
      "orderId": null,
      "escalatedId": "N",
      "taskStatus": "Ready",
      "assignedCuid": "AC42355",
      "assignedName": "Al-Zubidy, Ahmed",
      "taskType": {
        "id": "789",
        "taskName": "DHP",
        "taskDesc": "no description",
        "layoutTemplateId": "134",
        "layoutTemplateName": "SME TaskDetails",
        "params": [
          {
            "id": "85915",
            "name": "requestType",
            "value": "request",
            "jsonDescriptor": null,
            "pageLayoutFieldName": null,
            "combinedJsonDesc": null,
            "pageLayoutFieldId": null,
            "createdDateTime": "2019-07-25 01:28:25",
            "createdById": "SME",
            "createdByName": null,
            "modifiedById": "SME",
            "modifiedDateTime": "2019-07-25 01:28:25",
            "systemParameterItems": []
          },
          {
            "id": "86279",
            "name": "Task Status Life Cycle",
            "value": null,
            "jsonDescriptor": null,
            "pageLayoutFieldName": null,
            "combinedJsonDesc": null,
            "pageLayoutFieldId": null,
            "createdDateTime": "2019-07-25 05:20:13",
            "createdById": "SME",
            "createdByName": null,
            "modifiedById": "SME",
            "modifiedDateTime": "2019-07-25 05:20:13",
            "systemParameterItems": [
              {
                "name": "Status Life Cycles",
                "id": "341",
                "systemParameterId": "326",
                "parentId": null,
                "status": "Active",
                "sortOrder": 0,
                "value": "Standard Status Life Cycle",
                "description": "",
                "createdDateTime": "2019-05-10 01:14:39",
                "createdById": "thomsen.dean",
                "modifiedById": "AC04395",
                "modifiedDateTime": "2019-08-11 01:19:24",
                "pageLayoutName": "spiLayout_StatusLifeCycle",
                "layoutTemplateId": "138",
                "params": [],
                "systemParameterItem": []
              }
            ]
          },
          {
            "id": "86811",
            "name": "Task Status Life Cycle",
            "value": null,
            "jsonDescriptor": null,
            "pageLayoutFieldName": null,
            "combinedJsonDesc": null,
            "pageLayoutFieldId": null,
            "createdDateTime": "2019-07-25 07:10:32",
            "createdById": "SME",
            "createdByName": null,
            "modifiedById": "SME",
            "modifiedDateTime": "2019-07-25 07:10:32",
            "systemParameterItems": [
              {
                "name": "Status Life Cycles",
                "id": "341",
                "systemParameterId": "326",
                "parentId": null,
                "status": "Active",
                "sortOrder": 0,
                "value": "Standard Status Life Cycle",
                "description": "",
                "createdDateTime": "2019-05-10 01:14:39",
                "createdById": "thomsen.dean",
                "modifiedById": "AC04395",
                "modifiedDateTime": "2019-08-11 01:19:24",
                "pageLayoutName": "spiLayout_StatusLifeCycle",
                "layoutTemplateId": "138",
                "params": [],
                "systemParameterItem": []
              }
            ]
          },
          {
            "id": "88907",
            "name": "autoComplete",
            "value": "true",
            "jsonDescriptor": null,
            "pageLayoutFieldName": null,
            "combinedJsonDesc": null,
            "pageLayoutFieldId": null,
            "createdDateTime": "2019-07-29 08:48:03",
            "createdById": "AUTOPILOT",
            "createdByName": null,
            "modifiedById": "AUTOPILOT",
            "modifiedDateTime": "2019-07-29 08:48:03",
            "systemParameterItems": []
          },
          {
            "id": "90439",
            "name": "Task Status Life Cycle",
            "value": null,
            "jsonDescriptor": null,
            "pageLayoutFieldName": null,
            "combinedJsonDesc": null,
            "pageLayoutFieldId": null,
            "createdDateTime": "2019-07-31 01:34:54",
            "createdById": "SME",
            "createdByName": null,
            "modifiedById": "SME",
            "modifiedDateTime": "2019-07-31 01:34:54",
            "systemParameterItems": [
              {
                "name": "Status Life Cycles",
                "id": "341",
                "systemParameterId": "326",
                "parentId": null,
                "status": "Active",
                "sortOrder": 0,
                "value": "Standard Status Life Cycle",
                "description": "",
                "createdDateTime": "2019-05-10 01:14:39",
                "createdById": "thomsen.dean",
                "modifiedById": "AC04395",
                "modifiedDateTime": "2019-08-11 01:19:24",
                "pageLayoutName": "spiLayout_StatusLifeCycle",
                "layoutTemplateId": "138",
                "params": [],
                "systemParameterItem": []
              }
            ]
          },
          {
            "id": "90611",
            "name": "Task Status Life Cycle",
            "value": null,
            "jsonDescriptor": null,
            "pageLayoutFieldName": null,
            "combinedJsonDesc": null,
            "pageLayoutFieldId": null,
            "createdDateTime": "2019-07-31 04:26:32",
            "createdById": "SME",
            "createdByName": null,
            "modifiedById": "SME",
            "modifiedDateTime": "2019-07-31 04:26:32",
            "systemParameterItems": [
              {
                "name": "Status Life Cycles",
                "id": "7307",
                "systemParameterId": "326",
                "parentId": null,
                "status": "Active",
                "sortOrder": 1,
                "value": "SME Status Life Cycle",
                "description": "",
                "createdDateTime": "2019-07-31 11:56:11",
                "createdById": "AC04395",
                "modifiedById": "AC04395",
                "modifiedDateTime": "2019-08-11 01:22:18",
                "pageLayoutName": "spiLayout_StatusLifeCycle",
                "layoutTemplateId": "138",
                "params": [],
                "systemParameterItem": []
              }
            ]
          },
          {
            "id": "90621",
            "name": "Task Status Life Cycle",
            "value": null,
            "jsonDescriptor": null,
            "pageLayoutFieldName": null,
            "combinedJsonDesc": null,
            "pageLayoutFieldId": null,
            "createdDateTime": "2019-07-31 08:05:58",
            "createdById": "SME",
            "createdByName": null,
            "modifiedById": "SME",
            "modifiedDateTime": "2019-07-31 08:05:58",
            "systemParameterItems": [
              {
                "name": "Status Life Cycles",
                "id": "341",
                "systemParameterId": "326",
                "parentId": null,
                "status": "Active",
                "sortOrder": 0,
                "value": "Standard Status Life Cycle",
                "description": "",
                "createdDateTime": "2019-05-10 01:14:39",
                "createdById": "thomsen.dean",
                "modifiedById": "AC04395",
                "modifiedDateTime": "2019-08-11 01:19:24",
                "pageLayoutName": "spiLayout_StatusLifeCycle",
                "layoutTemplateId": "138",
                "params": [],
                "systemParameterItem": []
              }
            ]
          },
          {
            "id": "91243",
            "name": "Task Status Life Cycle",
            "value": null,
            "jsonDescriptor": null,
            "pageLayoutFieldName": null,
            "combinedJsonDesc": null,
            "pageLayoutFieldId": null,
            "createdDateTime": "2019-08-02 06:19:25",
            "createdById": "SME",
            "createdByName": null,
            "modifiedById": "SME",
            "modifiedDateTime": "2019-08-02 06:19:25",
            "systemParameterItems": [
              {
                "name": "Status Life Cycles",
                "id": "341",
                "systemParameterId": "326",
                "parentId": null,
                "status": "Active",
                "sortOrder": 0,
                "value": "Standard Status Life Cycle",
                "description": "",
                "createdDateTime": "2019-05-10 01:14:39",
                "createdById": "thomsen.dean",
                "modifiedById": "AC04395",
                "modifiedDateTime": "2019-08-11 01:19:24",
                "pageLayoutName": "spiLayout_StatusLifeCycle",
                "layoutTemplateId": "138",
                "params": [],
                "systemParameterItem": []
              }
            ]
          },
          {
            "id": "91244",
            "name": "Task Status Life Cycle",
            "value": null,
            "jsonDescriptor": null,
            "pageLayoutFieldName": null,
            "combinedJsonDesc": null,
            "pageLayoutFieldId": null,
            "createdDateTime": "2019-08-02 06:27:32",
            "createdById": "SME",
            "createdByName": null,
            "modifiedById": "SME",
            "modifiedDateTime": "2019-08-02 06:27:32",
            "systemParameterItems": [
              {
                "name": "Status Life Cycles",
                "id": "341",
                "systemParameterId": "326",
                "parentId": null,
                "status": "Active",
                "sortOrder": 0,
                "value": "Standard Status Life Cycle",
                "description": "",
                "createdDateTime": "2019-05-10 01:14:39",
                "createdById": "thomsen.dean",
                "modifiedById": "AC04395",
                "modifiedDateTime": "2019-08-11 01:19:24",
                "pageLayoutName": "spiLayout_StatusLifeCycle",
                "layoutTemplateId": "138",
                "params": [],
                "systemParameterItem": []
              }
            ]
          },
          {
            "id": "104635",
            "name": "Task Status Life Cycle",
            "value": null,
            "jsonDescriptor": null,
            "pageLayoutFieldName": null,
            "combinedJsonDesc": null,
            "pageLayoutFieldId": null,
            "createdDateTime": "2019-09-23 10:39:19",
            "createdById": "SME",
            "createdByName": null,
            "modifiedById": "SME",
            "modifiedDateTime": "2019-09-23 10:39:19",
            "systemParameterItems": [
              {
                "name": "Status Life Cycles",
                "id": "341",
                "systemParameterId": "326",
                "parentId": null,
                "status": "Active",
                "sortOrder": 0,
                "value": "Standard Status Life Cycle",
                "description": "",
                "createdDateTime": "2019-05-10 01:14:39",
                "createdById": "thomsen.dean",
                "modifiedById": "AC04395",
                "modifiedDateTime": "2019-08-11 01:19:24",
                "pageLayoutName": "spiLayout_StatusLifeCycle",
                "layoutTemplateId": "138",
                "params": [],
                "systemParameterItem": []
              }
            ]
          }
        ],
        "createdById": "SME",
        "createdByName": "SME",
        "createdDtTm": "2019-06-26 23:08:22.0",
        "modifiedById": "AC04395",
        "modifiedByName": "Thomsen, Dean S",
        "modifiedDtTm": "2019-09-23 22:39:19.0",
        "taskTypeParam": null
      },
      "dependencyFlag": false,
      "hideTask": false,
      "statusCode": "202",
      "statusMessage": "publish plan",
      "version": false,
      "workgroupList": [
        {
          "workgroupId": "10938",
          "workgroupName": "SM-DOCS",
          "roles": null
        }
      ],
      "createdById": "SME",
      "createdByName": "SME",
      "createdDtTm": "2019-09-27 03:02:57.0",
      "modifiedById": "AUTOPILOT",
      "modifiedByName": "AUTOPILOT",
      "modifiedDtTm": "2019-09-27 03:02:57.0",
      "allowedactions": [
        "Accept",
        "Assign",
        "Dispatch",
        "Block",
        "Cancel"
      ],
      "taskInstParamRequests": [
        {
          "type": null,
          "header": "AdditionalMicroserviceDetailsList",
          "name": "retryRequestURL",
          "value": null,
          "jsonDescriptor": "{\r\n\"fieldName\" : \"Edit&Retry\",\r\n\"label\" : \"Edit&Retry\",\r\n\"editable\" : true,\r\n\"visible\" : false\r\n}",
          "paramFieldLayout": null,
          "pageLayoutFieldId": null,
          "pageLayoutlabel": null
        },
        {
          "type": null,
          "header": "AdditionalRequestDetails",
          "name": "orderingSystem",
          "value": "AUTOPILOT",
          "jsonDescriptor": null,
          "paramFieldLayout": null,
          "pageLayoutFieldId": null,
          "pageLayoutlabel": null
        },
        {
          "type": null,
          "header": "AdditionalRequestDetails",
          "name": "orderRefId",
          "value": "2393",
          "jsonDescriptor": null,
          "paramFieldLayout": null,
          "pageLayoutFieldId": null,
          "pageLayoutlabel": null
        },
        {
          "type": null,
          "header": "AdditionalRequestDetails",
          "name": "privateUserID",
          "value": "Test",
          "jsonDescriptor": null,
          "paramFieldLayout": null,
          "pageLayoutFieldId": null,
          "pageLayoutlabel": null
        },
        {
          "type": null,
          "header": "AdditionalRequestDetails",
          "name": "publicUserID",
          "value": "Test",
          "jsonDescriptor": null,
          "paramFieldLayout": null,
          "pageLayoutFieldId": null,
          "pageLayoutlabel": null
        },
        {
          "type": "Column",
          "header": "Layer3FirewallRules",
          "name": "Comment",
          "value": "Siva",
          "jsonDescriptor": "{\r\n\"fieldName\" : \"Comment\",\r\n\"label\" : \"Comment\",\r\n\"editable\" : true,\r\n\"visible\" : false\r\n}",
          "paramFieldLayout": null,
          "pageLayoutFieldId": null,
          "pageLayoutlabel": null
        },
        {
          "type": "Header",
          "header": "Layer3FirewallRules",
          "name": "Layer3FirewallRules",
          "value": "",
          "jsonDescriptor": null,
          "paramFieldLayout": null,
          "pageLayoutFieldId": null,
          "pageLayoutlabel": null
        },
        {
          "type": "Column",
          "header": "Layer3FirewallRules",
          "name": "Policy",
          "value": "Siva",
          "jsonDescriptor": "{\r\n\"fieldName\" : \"Policy\",\r\n\"label\" : \"Policy\",\r\n\"editable\" : true,\r\n\"visible\" : false\r\n}",
          "paramFieldLayout": null,
          "pageLayoutFieldId": null,
          "pageLayoutlabel": null
        },
        {
          "type": "Column",
          "header": "Layer3FirewallRules",
          "name": "SRCCIDR",
          "value": "test",
          "jsonDescriptor": " {\r\n\"fieldName\" : \"SRCCIDR\",\r\n\"label\" : \"SRCCIDR\",\r\n\"editable\" : true,\r\n\"visible\" : false\r\n}",
          "paramFieldLayout": null,
          "pageLayoutFieldId": null,
          "pageLayoutlabel": null
        },
        {
          "type": "Column",
          "header": "Layer3FirewallRules",
          "name": "SRCPORT",
          "value": "test",
          "jsonDescriptor": "{\r\n\"fieldName\" : \"SRCPORT\",\r\n\"label\" : \"SRCPORT\",\r\n\"editable\" : true,\r\n\"visible\" : false\r\n}",
          "paramFieldLayout": null,
          "pageLayoutFieldId": null,
          "pageLayoutlabel": null
        },
        {
          "type": null,
          "header": "OriginatorInfo",
          "name": "originatorName",
          "value": "AUTOPILOT",
          "jsonDescriptor": null,
          "paramFieldLayout": null,
          "pageLayoutFieldId": null,
          "pageLayoutlabel": null
        },
        {
          "type": null,
          "header": "Other Information",
          "name": "Actionable Date",
          "value": "2019-09-27 03:03:21",
          "jsonDescriptor": null,
          "paramFieldLayout": null,
          "pageLayoutFieldId": "2720",
          "pageLayoutlabel": null
        },
        {
          "type": "Date",
          "header": "Taskkeydate",
          "name": "customerCommitmentDate",
          "value": null,
          "jsonDescriptor": null,
          "paramFieldLayout": null,
          "pageLayoutFieldId": null,
          "pageLayoutlabel": null
        }
      ],
      "taskSectionModels": [
        {
          "header": "AdditionalMicroserviceDetailsList",
          "paramList": [
            {
              "type": "TextBox",
              "header": "AdditionalMicroserviceDetailsList",
              "name": "retryRequestURL",
              "value": null,
              "jsonDescriptor": "{\r\n\"fieldName\" : \"Edit&Retry\",\r\n\"label\" : \"Edit&Retry\",\r\n\"editable\" : true,\r\n\"visible\" : false\r\n}",
              "paramFieldLayout": null,
              "pageLayoutFieldId": null,
              "pageLayoutlabel": null
            }
          ]
        },
        {
          "header": "OriginatorInfo",
          "paramList": [
            {
              "type": "TextBox",
              "header": "OriginatorInfo",
              "name": "originatorName",
              "value": "AUTOPILOT",
              "jsonDescriptor": null,
              "paramFieldLayout": {
                "visible": "true",
                "editable": "false",
                "disabled": "true",
                "label": "originatorName",
                "type": "textbox",
                "required": "false",
                "labelCssClass": "col-xs-12 col-sm-6 col-md-6 col-lg-6 control-label"
              },
              "pageLayoutFieldId": null,
              "pageLayoutlabel": "originatorName"
            }
          ]
        },
        {
          "header": "Layer3FirewallRules",
          "paramList": [
            {
              "type": "TextBox",
              "header": "Layer3FirewallRules",
              "name": "Comment",
              "value": "Siva",
              "jsonDescriptor": "{\r\n\"fieldName\" : \"Comment\",\r\n\"label\" : \"Comment\",\r\n\"editable\" : true,\r\n\"visible\" : false\r\n}",
              "paramFieldLayout": null,
              "pageLayoutFieldId": null,
              "pageLayoutlabel": null
            },
            {
              "type": "TextBox",
              "header": "Layer3FirewallRules",
              "name": "Layer3FirewallRules",
              "value": "",
              "jsonDescriptor": null,
              "paramFieldLayout": {
                "visible": "true",
                "editable": "false",
                "disabled": "true",
                "label": "Layer3FirewallRules",
                "type": "textbox",
                "required": "false",
                "labelCssClass": "col-xs-12 col-sm-6 col-md-6 col-lg-6 control-label"
              },
              "pageLayoutFieldId": null,
              "pageLayoutlabel": "Layer3FirewallRules"
            },
            {
              "type": "TextBox",
              "header": "Layer3FirewallRules",
              "name": "Policy",
              "value": "Siva",
              "jsonDescriptor": "{\r\n\"fieldName\" : \"Policy\",\r\n\"label\" : \"Policy\",\r\n\"editable\" : true,\r\n\"visible\" : false\r\n}",
              "paramFieldLayout": null,
              "pageLayoutFieldId": null,
              "pageLayoutlabel": null
            },
            {
              "type": "TextBox",
              "header": "Layer3FirewallRules",
              "name": "SRCCIDR",
              "value": "test",
              "jsonDescriptor": " {\r\n\"fieldName\" : \"SRCCIDR\",\r\n\"label\" : \"SRCCIDR\",\r\n\"editable\" : true,\r\n\"visible\" : false\r\n}",
              "paramFieldLayout": null,
              "pageLayoutFieldId": null,
              "pageLayoutlabel": null
            },
            {
              "type": "TextBox",
              "header": "Layer3FirewallRules",
              "name": "SRCPORT",
              "value": "test",
              "jsonDescriptor": "{\r\n\"fieldName\" : \"SRCPORT\",\r\n\"label\" : \"SRCPORT\",\r\n\"editable\" : true,\r\n\"visible\" : false\r\n}",
              "paramFieldLayout": null,
              "pageLayoutFieldId": null,
              "pageLayoutlabel": null
            }
          ]
        },
        {
          "header": "Other Information",
          "paramList": [
            {
              "type": "TextBox",
              "header": "Other Information",
              "name": "Actionable Date",
              "value": "2019-09-27 03:03:21",
              "jsonDescriptor": null,
              "paramFieldLayout": {
                "visible": "false",
                "size": "100",
                "editable": "false",
                "label": "Actionable Date",
                "type": "TextBox"
              },
              "pageLayoutFieldId": "2720",
              "pageLayoutlabel": "Actionable Date"
            }
          ]
        },
        {
          "header": "AdditionalRequestDetails",
          "paramList": [
            {
              "type": "TextBox",
              "header": "AdditionalRequestDetails",
              "name": "orderingSystem",
              "value": "AUTOPILOT",
              "jsonDescriptor": null,
              "paramFieldLayout": {
                "visible": "true",
                "editable": "false",
                "disabled": "true",
                "label": "orderingSystem",
                "type": "textbox",
                "required": "false",
                "labelCssClass": "col-xs-12 col-sm-6 col-md-6 col-lg-6 control-label"
              },
              "pageLayoutFieldId": null,
              "pageLayoutlabel": "orderingSystem"
            },
            {
              "type": "TextBox",
              "header": "AdditionalRequestDetails",
              "name": "orderRefId",
              "value": "2393",
              "jsonDescriptor": null,
              "paramFieldLayout": {
                "visible": "true",
                "editable": "false",
                "disabled": "true",
                "label": "orderRefId",
                "type": "textbox",
                "required": "false",
                "labelCssClass": "col-xs-12 col-sm-6 col-md-6 col-lg-6 control-label"
              },
              "pageLayoutFieldId": null,
              "pageLayoutlabel": "orderRefId"
            },
            {
              "type": "TextBox",
              "header": "AdditionalRequestDetails",
              "name": "privateUserID",
              "value": "Test",
              "jsonDescriptor": null,
              "paramFieldLayout": {
                "visible": "true",
                "editable": "false",
                "disabled": "true",
                "label": "privateUserID",
                "type": "textbox",
                "required": "false",
                "labelCssClass": "col-xs-12 col-sm-6 col-md-6 col-lg-6 control-label"
              },
              "pageLayoutFieldId": null,
              "pageLayoutlabel": "privateUserID"
            },
            {
              "type": "TextBox",
              "header": "AdditionalRequestDetails",
              "name": "publicUserID",
              "value": "Test",
              "jsonDescriptor": null,
              "paramFieldLayout": {
                "visible": "true",
                "editable": "false",
                "disabled": "true",
                "label": "publicUserID",
                "type": "textbox",
                "required": "false",
                "labelCssClass": "col-xs-12 col-sm-6 col-md-6 col-lg-6 control-label"
              },
              "pageLayoutFieldId": null,
              "pageLayoutlabel": "publicUserID"
            }
          ]
        },
        {
          "header": "Taskkeydate",
          "paramList": [
            {
              "type": "Date",
              "header": "Taskkeydate",
              "name": "customerCommitmentDate",
              "value": null,
              "jsonDescriptor": null,
              "paramFieldLayout": {
                "visible": "true",
                "editable": "false",
                "disabled": "true",
                "label": "customerCommitmentDate",
                "type": "textbox",
                "required": "false",
                "labelCssClass": "col-xs-12 col-sm-6 col-md-6 col-lg-6 control-label"
              },
              "pageLayoutFieldId": null,
              "pageLayoutlabel": "customerCommitmentDate"
            }
          ]
        },
        {
          "header": "Form",
          "paramList": [
            {
              "type": "TextBox",
              "header": "Form",
              "name": "CCM NAME",
              "value": "Test",
              "jsonDescriptor": null,
              "paramFieldLayout": {
                "visible": "false",
                "size": "100",
                "editable": "false",
                "label": "Actionable Date",
                "type": "TextBox"
              },
              "pageLayoutlabel": "Actionable Date"
            },
            {
              "type": "TextBox",
              "header": "Form",
              "name": "CCM Contact",
              "value": "9876542365",
              "jsonDescriptor": null,
              "paramFieldLayout": {
                "visible": "false",
                "size": "100",
                "editable": "false",
                "label": "Actionable Date",
                "type": "TextBox"
              },
              "pageLayoutlabel": "Actionable Date"
            },
            {
              "type": "TextBox",
              "header": "Form",
              "name": "ROCID",
              "value": "INS-6542365",
              "jsonDescriptor": null,
              "paramFieldLayout": {
                "visible": "false",
                "size": "100",
                "editable": "false",
                "label": "Actionable Date",
                "type": "TextBox"
              },
              "pageLayoutlabel": "Actionable Date"
            }
          ]
        }
      ],
      "id": "34032",
      "taskName": "DHP",
      "sourceSystemId": "970",
      "parentTaskId": null,
      "isParent": true,
      "notes": "Test Task",
      "childStatusCounts": {
        "totalCounts": 0,
        "complete": 0,
        "inProgress": 0,
        "cancelled": 0,
        "failed": 0
      },
      "taskKeyDatesList": null,
      "parentSourceTaskId": null,
      "skillList": null,
      "application": null,
      "taskInstNotes": null,
      "appTaskInstanceId": null,
      "sourceSystem": null,
      "escalated": false,
      "createdDateTime": null,
      "modifiedDateTime": null
    };

    this.modelValue = [];
    this.pageLayout.pageLayoutTemplate.forEach(element => {
      if (element.sectionHeader == 'Form') {
        element.fieldsList.forEach(list => {
          const ParamList = this.Jsondata.taskSectionModels.find((x) => x.header == element.sectionHeader);
          console.log("ParamLIst", ParamList, isObject(ParamList));
          if (isObject(ParamList)) {
            const Data = ParamList.paramList.find((x) => x.name == list.label);
            console.log(Data);
            if (isObject(Data)) {
              this.modelValue.push({label: list.label, value: Data.value});
            } else {
              this.modelValue.push({label: list.label, value: ''});
            }
          } else {
            this.modelValue.push({label: list.label, value: ''});
          }
        });
        console.log("modelValue", this.modelValue);
      }
    });
  }

  submitData() {
    console.log(this.modelValue);
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html'
})
export class DialogOverviewExampleDialog {
  model: any = {};
  onAdd = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onSubmit() {
    this.dialogRef.close();
    this.onAdd.emit(this.model);
  }

  onNoClick(): boolean {
    this.dialogRef.close();
    return false;
  }
}

@Component({
  selector: 'dialog-overview-section-dialog',
  templateUrl: 'dialog-overview-section-dialog.html'
})
export class DialogOverviewSectionDialog {
  data: any = {};
  onSectionAdd = new EventEmitter();
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewSectionDialog>,
    @Inject(MAT_DIALOG_DATA) public data1: any
  ) {}

  onNoClick(): boolean {
    this.dialogRef.close();
    return false;
  }

  onSectionSubmit() {
    this.dialogRef.close();
    this.onSectionAdd.emit(this.data);
  }
}

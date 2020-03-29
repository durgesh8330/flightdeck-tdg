import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import * as $ from 'jquery';
import Masonry from 'masonry-layout';

import { TaskService } from '../task.service';
import { SprtaskdialogComponent } from './sprtaskdialog/sprtaskdialog.component';
import { SprtaskcanceldialogComponent } from './sprtaskcanceldialog/sprtaskcanceldialog.component';
import { isArray, isObject } from 'util';


@Component({
  selector: 'sa-sprtask',
  templateUrl: './sprtask.component.html',
  styleUrls: ['./sprtask.component.css']
})
export class SPRTaskComponent implements OnInit {

  @Input() processData: any;
  public leftSideTabs: any = {
    tab: 'task-details'
  }
  public loaderTaskDetail = false;
  public pageLayout: any;
  public workGroupNamenew: string[] = new Array();
  public isShow = false;
  logPageLayout: any = [];
  data: any = [];
  logData = [];
  logDetails = [];
  public activityLog = {};
  IsSuccess:boolean=false;
  message:any;
  hideDueDate: boolean = false;
  hideCancel: boolean = false;
  TaskDetails: any = 
  {
    "sectionHeader": "Task General Details",
    "fieldsList": [
    {
      "fieldName": "TaskInstanceId",
      "visible": true,
      "editable": true,
      "validationMessage": "App task instance id is required",
      "inputWrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6",
      "label": "Task Instance Id",
      "type": "TextBox",
      "fieldValue": "",
      "required": false,
      "wrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6 no-padding-right ",
      "size": 100,
      "inputClass": "form-control",
      "model": "sourceTaskId",
      "disabled": true,
      "labelCssClass": "col-xs-12 col-sm-6 col-md-6 col-lg-6 control-label"
    },
    {
      "fieldName": "taskInstDesc",
      "visible": true,
      "editable": true,
      "validationMessage": "Task Desc is required",
      "inputWrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6",
      "label": "Task Desc",
      "type": "TextBox",
      "fieldValue": "",
      "required": false,
      "wrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6 no-padding-right ",
      "size": 100,
      "inputClass": "form-control",
      "model": "taskInstDesc",
      "disabled": true,
      "labelCssClass": "col-xs-12 col-sm-6 col-md-6 col-lg-6 control-label"
    },
    {
      "fieldName": "applicationName",
      "visible": true,
      "editable": true,
      "validationMessage": "Task Desc is required",
      "inputWrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6",
      "label": "Source System",
      "type": "TextBox",
      "fieldValue": "SVMM130582",
      "required": false,
      "wrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6 no-padding-right ",
      "size": 100,
      "inputClass": "",
      "service": "/GetAllSourceSystems",
      "options": {
        "multiple": true,
        "tags": true
      },
      "model": "sourceSystemName",
      "disabled": true,
      "dataSource": [],
      "labelCssClass": "col-xs-12 col-sm-6 col-md-6 col-lg-6 control-label"
    },
    {
      "fieldName": "taskStatus",
      "visible": true,
      "editable": true,
      "validationMessage": "Task status is required",
      "inputWrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6",
      "label": "Task Status",
      "type": "TextBox",
      "fieldValue": "",
      "required": true,
      "wrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6 no-padding-right ",
      "size": 100,
      "inputClass": "form-control",
      "model": "taskStatus",
      "disabled": true,
      "labelCssClass": "col-xs-12 col-sm-6 col-md-6 col-lg-6 control-label"
    },
    {
      "fieldName": "escalated",
      "visible": true,
      "editable": true,
      "change": "onChange",
      "inputWrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6",
      "label": "Escalated",
      "type": "switch",
      "fieldValue": "true",
      "wrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6 no-padding-right ",
      "inputClass": "",
      "model": "escalatedId",
      "disabled": true,
      "labelCssClass": "col-xs-12 col-sm-6 col-md-6 col-lg-6 control-label"
    },
    {
      "fieldName": "taskInstNotes",
      "visible": true,
      "editable": true,
      "validationMessage": "Task notes is required",
      "inputWrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6",
      "label": "Task Notes",
      "type": "textarea",
      "rows": 2,
      "fieldValue": "",
      "required": false,
      "wrapperCssClass": "col-xs-12 col-md-12 col-sm-12 col-lg-12 no-padding-right ",
      "inputClass": "form-control",
      "model": "taskInstNotes",
      "disabled": true,
      "labelCssClass": "col-xs-12 col-sm-6 col-md-6 col-lg-6 control-label"
    },
    {
      "fieldName": "ng2Taskdd",
      "visible": true,
      "editable": true,
      "systemParameterName": "Task Type",
      "inputWrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6",
      "label": "Task type",
      "type": "TextBox",
      "fieldValue": "",
      "systemParameterType": "List of Values",
      "wrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6 no-padding-right ",
      "size": 100,
      "inputClass": "",
      "service": "/TaskType/GetAll",
      "options": {
        "multiple": true,
        "tags": true
      },
      "model": "taskType",
      "disabled": false,
      "dataSource": [],
      "labelCssClass": "col-xs-12 col-sm-6 col-md-6 col-lg-6 control-label"
    },
    {
      "fieldName": "dependencyFlag",
      "visible": true,
      "editable": true,
      "inputWrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6",
      "label": "Dependency Flag",
      "type": "TextBox",
      "fieldValue": "",
      "wrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6 no-padding-right ",
      "size": 100,
      "inputClass": "form-control",
      "model": "dependencyFlag",
      "disabled": true,
      "labelCssClass": "col-xs-12 col-sm-6 col-md-6 col-lg-6 control-label"
    },
    {
      "fieldName": "assignedCuid",
      "visible": true,
      "editable": true,
      "inputWrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6",
      "label": "Assigned Cuid",
      "type": "TextBox",
      "fieldValue": "",
      "wrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6 no-padding-right ",
      "size": 100,
      "inputClass": "form-control",
      "model": "assignedCuid",
      "disabled": true,
      "labelCssClass": "col-xs-12 col-sm-6 col-md-6 col-lg-6 control-label"
    },
    {
      "fieldName": "hideTask",
      "visible": true,
      "editable": true,
      "inputWrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6",
      "label": "Hide Task",
      "type": "TextBox",
      "fieldValue": "",
      "wrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6 no-padding-right ",
      "size": 100,
      "inputClass": "form-control",
      "model": "hideTask",
      "disabled": true,
      "labelCssClass": "col-xs-12 col-sm-6 col-md-6 col-lg-6 control-label"
    },
    {
      "fieldName": "statusCode",
      "visible": true,
      "editable": true,
      "inputWrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6",
      "label": "Status Code",
      "type": "TextBox",
      "fieldValue": "",
      "required": false,
      "wrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6 no-padding-right ",
      "size": 100,
      "inputClass": "form-control",
      "model": "statusCode",
      "disabled": true,
      "labelCssClass": "col-xs-12 col-sm-6 col-md-6 col-lg-6 control-label"
    },
    {
      "fieldName": "statusMessage",
      "visible": true,
      "editable": true,
      "inputWrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6",
      "label": "Status Message",
      "type": "TextBox",
      "fieldValue": "",
      "required": false,
      "wrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6 no-padding-right ",
      "size": 100,
      "inputClass": "form-control",
      "model": "statusMessage",
      "disabled": true,
      "labelCssClass": "col-xs-12 col-sm-6 col-md-6 col-lg-6 control-label"
    },
    {
      "fieldName": "version",
      "visible": true,
      "editable": true,
      "inputWrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6",
      "label": "Version",
      "type": "TextBox",
      "fieldValue": "",
      "required": false,
      "wrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6 no-padding-right ",
      "size": 100,
      "inputClass": "form-control",
      "model": "version",
      "disabled": true,
      "labelCssClass": "col-xs-12 col-sm-6 col-md-6 col-lg-6 control-label"
    },
    {
      "fieldName": "workgroupList",
      "visible": true,
      "editable": true,
      "systemParameterName": "Workgroup List",
      "inputWrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6",
      "label": "Workgroup List",
      "type": "MultiSelect",
      "fieldValue": "",
      "systemParameterType": "List of Values",
      "wrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6 no-padding-right ",
      "inputClass": "",
      "service": "/Workgroup/GetAll",
      "options": {
        "multiple": true,
        "tags": true
      },
      "model": "workgroupList",
      "disabled": false,
      "dataSource": [],
      "labelCssClass": "col-xs-12 col-sm-6 col-md-6 col-lg-6 control-label"
    },
    {
      "fieldName": "createdById",
      "visible": true,
      "editable": true,
      "inputWrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6",
      "label": "Created By Id",
      "type": "TextBox",
      "fieldValue": "",
      "wrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6 no-padding-right ",
      "size": 100,
      "inputClass": "form-control",
      "model": "createdById",
      "disabled": true,
      "labelCssClass": "col-xs-12 col-sm-6 col-md-6 col-lg-6 control-label"
    },
    {
      "fieldName": "createdDateTime",
      "visible": true,
      "editable": true,
      "inputWrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6",
      "label": "Created Date Time",
      "type": "TextBox",
      "fieldValue": "",
      "wrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6 no-padding-right ",
      "size": 100,
      "inputClass": "form-control",
      "model": "createdDtTm",
      "disabled": true,
      "labelCssClass": "col-xs-12 col-sm-6 col-md-6 col-lg-6 control-label"
    },
    {
      "fieldName": "modifiedById",
      "visible": true,
      "editable": true,
      "inputWrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6",
      "label": "Modified By Id",
      "type": "TextBox",
      "fieldValue": "",
      "wrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6 no-padding-right ",
      "size": 100,
      "inputClass": "form-control",
      "model": "modifiedById",
      "disabled": true,
      "labelCssClass": "col-xs-12 col-sm-6 col-md-6 col-lg-6 control-label"
    },
    {
      "fieldName": "modifiedTime",
      "visible": true,
      "editable": true,
      "inputWrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6",
      "label": "Modified Date Time",
      "type": "TextBox",
      "fieldValue": "",
      "wrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6 no-padding-right ",
      "size": 100,
      "inputClass": "form-control",
      "model": "modifiedDtTm",
      "disabled": true,
      "labelCssClass": "col-xs-12 col-sm-6 col-md-6 col-lg-6 control-label"
    }
  ]
};
  CustomerData: any = [
    { 'commonName': 'Ray Beagley', 'BUSINESS': '8012380348', 'EMAIL': 'sneha.polu@centurylink.com', 'type': 'AC' },
    { 'commonName': 'Brian Galloway', 'BUSINESS': '4025784871', 'EMAIL': 'bgalloway@americanlaboratories.com', 'type': 'BILL' },
    { 'commonName': 'Brian Galloway', 'BUSINESS': '4025784871', 'EMAIL': 'bgalloway@americanlaboratories.com', 'type': 'LCON' },
    { 'commonName': 'Brian Galloway', 'BUSINESS': '4025784871', 'EMAIL': 'bgalloway@americanlaboratories.com', 'type': 'MAIN' },
    { 'commonName': 'Ray Beagley', 'BUSINESS': '8012380348', 'EMAIL': 'rbeagle@centurylink.com', 'type': 'ORDR' },
    { 'commonName': 'siva kasina', 'BUSINESS': '858586', 'EMAIL': 'bgalloway@americanlaboratories.com', 'type': 'PNCO' },
    { 'commonName': 'Patricia Thomas', 'BUSINESS': '6146896918', 'EMAIL': 'patricia.thomas@centurylink.com', 'type': 'RI' },
    { 'commonName': 'Kyle Wilson', 'BUSINESS': '8663728783', 'EMAIL': 'kyle.wilson@centurylink.com', 'type': 'SLSR-AE' },
    { 'commonName': 'Brian Galloway', 'BUSINESS': '4025784871', 'EMAIL': 'bgalloway@americanlaboratories.com', 'type': 'TCON' },
    { 'commonName': 'Brian Galloway', 'BUSINESS': '4025784871', 'EMAIL': 'bgalloway@americanlaboratories.com', 'type': 'TCON' }
  ];

  NewJsonFormate: any = {
    "taskinstid": "1574",
    "sourceTaskId": "UNI_178448533_NEW_CONNECT_51",
    "taskInstDesc": "SPR Testing",
    "sourceSystemName": "AUTOPILOT",
    "escalatedId": "N",
    "taskStatus": "Cancelled",
    "assignedCuid": null,
    "assignedName": null,
    "taskType": "spiTaskEnrichment",
    "dependencyFlag": false,
    "hideTask": false,
    "statusCode": "202",
    "statusMessage": "Task Ready for...",
    "version": false,
    "workgroupList": [
      "CDP",
      "FD_HOOVER",
      "OWS-ASP",
      "QMV-WRP1",
      "BPMS-ASP",
      "ASRI-ASP123",
      "ASRI-CDP123",
      "ASRI-CDP1",
      "ASRI_CID ",
      "TST_1",
      "ASRI_TEST1",
      "ASRI_TEST3",
      "ASRIRECON",
      "WCM-TEST1",
      "KaranSample123",
      "ASP-E",
      "CDP_DEV",
      "OV_Team",
      "ASRI-WORKGROUP",
      "string",
      "test",
      "SOA_TEST1",
      "ASRI",
      "ASP1",
      "TT_SCREENERS_WORKGROUP",
      "CDP_TEST",
      "LMOS_SCREENING",
      "ASP",
      "TestAt8:51"
    ],
    "createdById": "OC",
    "createdByName": null,
    "createdDtTm": "2019-06-01 04:44:48.0",
    "modifiedById": "AUTOPILOT",
    "modifiedByName": null,
    "modifiedDtTm": "2019-06-03 18:47:23.0",
    "allowedactions": [],
    "CustomerData": [
      { 'commonName': 'Ray Beagley', 'BUSINESS': '8012380348', 'EMAIL': 'sneha.polu@centurylink.com', 'type': 'AC' },
      { 'commonName': 'Brian Galloway', 'BUSINESS': '4025784871', 'EMAIL': 'bgalloway@americanlaboratories.com', 'type': 'BILL' },
      { 'commonName': 'Brian Galloway', 'BUSINESS': '4025784871', 'EMAIL': 'bgalloway@americanlaboratories.com', 'type': 'LCON' },
      { 'commonName': 'Brian Galloway', 'BUSINESS': '4025784871', 'EMAIL': 'bgalloway@americanlaboratories.com', 'type': 'MAIN' },
      { 'commonName': 'Ray Beagley', 'BUSINESS': '8012380348', 'EMAIL': 'rbeagle@centurylink.com', 'type': 'ORDR' },
      { 'commonName': 'siva kasina', 'BUSINESS': '858586', 'EMAIL': 'bgalloway@americanlaboratories.com', 'type': 'PNCO' },
      { 'commonName': 'Patricia Thomas', 'BUSINESS': '6146896918', 'EMAIL': 'patricia.thomas@centurylink.com', 'type': 'RI' },
      { 'commonName': 'Kyle Wilson', 'BUSINESS': '8663728783', 'EMAIL': 'kyle.wilson@centurylink.com', 'type': 'SLSR-AE' },
      { 'commonName': 'Brian Galloway', 'BUSINESS': '4025784871', 'EMAIL': 'bgalloway@americanlaboratories.com', 'type': 'TCON' },
      { 'commonName': 'Brian Galloway', 'BUSINESS': '4025784871', 'EMAIL': 'bgalloway@americanlaboratories.com', 'type': 'TCON' }
    ],
    "taskInstParams": [
      {
        "header": "Customer Details",
        "fieldList": [
          {
            "fieldName": "Customer Name",
            "fieldValue": "AMERICAN LABORATORIES INC.",
            "pageLayoutId": "676",
            "paramfieldlayout": {
              "visible": "true",
              "size": "100",
              "wrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6 no-padding-right ",
              "editable": "true",
              "disabled": "true",
              "type": "TextBox",
              "required": "true"
            }
          },
          {
            "fieldName": "PHONE",
            "fieldValue": "4025784871",
            "pageLayoutId": "676",
            "paramfieldlayout": {
              "visible": "true",
              "size": "100",
              "wrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6 no-padding-right ",
              "editable": "true",
              "disabled": "true",
              "type": "TextBox",
              "required": "true"
            }
          }
        ]
      },
      {
        "header": "Customer Facing Service Details",
        "fieldList": [
          {
            "fieldName": null,
            "fieldValue": null,
            "pageLayoutId": null,
            "paramfieldlayout": null
          },
          {
            "fieldName": "action",
            "fieldValue": "s",
            "pageLayoutId": "676",
            "paramfieldlayout": {
              "visible": "true",
              "size": "100",
              "wrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6 no-padding-right ",
              "editable": "true",
              "disabled": "true",
              "type": "TextBox",
              "required": "true"
            }
          },
          {
            "fieldName": "AdditionalInfo",
            "fieldValue": "OC-Federated Inventory;",
            "pageLayoutId": "676",
            "paramfieldlayout": {
              "visible": "true",
              "size": "100",
              "wrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6 no-padding-right ",
              "editable": "true",
              "disabled": "true",
              "type": "TextBox",
              "required": "true"
            }
          },
          {
            "fieldName": "addressFormatType",
            "fieldValue": "S",
            "pageLayoutId": "676",
            "paramfieldlayout": {
              "visible": "true",
              "size": "100",
              "wrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6 no-padding-right ",
              "editable": "true",
              "disabled": "true",
              "type": "TextBox",
              "required": "true"
            }
          },
          {
            "fieldName": "allToOneBundling",
            "fieldValue": "true",
            "pageLayoutId": "676",
            "paramfieldlayout": {
              "visible": "true",
              "size": "100",
              "wrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6 no-padding-right ",
              "editable": "true",
              "disabled": "true",
              "type": "TextBox",
              "required": "true"
            }
          },
          {
            "fieldName": "Bandwidth",
            "fieldValue": "52",
            "pageLayoutId": "676",
            "paramfieldlayout": {
              "visible": "true",
              "size": "100",
              "wrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6 no-padding-right ",
              "editable": "true",
              "disabled": "true",
              "type": "TextBox",
              "required": "true"
            }
          },
          {
            "fieldName": "bundling",
            "fieldValue": "false",
            "pageLayoutId": "676",
            "paramfieldlayout": {
              "visible": "true",
              "size": "100",
              "wrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6 no-padding-right ",
              "editable": "true",
              "disabled": "true",
              "type": "TextBox",
              "required": "true"
            }
          },
          {
            "fieldName": "CCNA",
            "fieldValue": "LNP",
            "pageLayoutId": "676",
            "paramfieldlayout": {
              "visible": "true",
              "size": "100",
              "wrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6 no-padding-right ",
              "editable": "true",
              "disabled": "true",
              "type": "TextBox",
              "required": "true"
            }
          },
          {
            "fieldName": "commonName",
            "fieldValue": "Naveen",
            "pageLayoutId": "676",
            "paramfieldlayout": {
              "visible": "true",
              "size": "100",
              "wrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6 no-padding-right ",
              "editable": "true",
              "disabled": "true",
              "type": "TextBox",
              "required": "true"
            }
          },
          {
            "fieldName": "EgressScheduler",
            "fieldValue": "O",
            "pageLayoutId": "676",
            "paramfieldlayout": {
              "visible": "true",
              "size": "100",
              "wrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6 no-padding-right ",
              "editable": "true",
              "disabled": "true",
              "type": "TextBox",
              "required": "true"
            }
          },
          {
            "fieldName": "GETO",
            "fieldValue": "W",
            "pageLayoutId": "676",
            "paramfieldlayout": {
              "visible": "true",
              "size": "100",
              "wrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6 no-padding-right ",
              "editable": "true",
              "disabled": "true",
              "type": "TextBox",
              "required": "true"
            }
          },
          {
            "fieldName": "ICSC",
            "fieldValue": "NW01",
            "pageLayoutId": "676",
            "paramfieldlayout": {
              "visible": "true",
              "size": "100",
              "wrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6 no-padding-right ",
              "editable": "true",
              "disabled": "true",
              "type": "TextBox",
              "required": "true"
            }
          },
          {
            "fieldName": "id",
            "fieldValue": "AMERICAN LABORATORIES INC.",
            "pageLayoutId": "676",
            "paramfieldlayout": {
              "visible": "true",
              "size": "100",
              "wrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6 no-padding-right ",
              "editable": "true",
              "disabled": "true",
              "type": "TextBox",
              "required": "true"
            }
          },
          {
            "fieldName": "locality",
            "fieldValue": "utah",
            "pageLayoutId": "676",
            "paramfieldlayout": {
              "visible": "true",
              "size": "100",
              "wrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6 no-padding-right ",
              "editable": "true",
              "disabled": "true",
              "type": "TextBox",
              "required": "true"
            }
          },
          {
            "fieldName": "mefServiceInterfaceStatusMaxVc",
            "fieldValue": "1",
            "pageLayoutId": "676",
            "paramfieldlayout": {
              "visible": "true",
              "size": "100",
              "wrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6 no-padding-right ",
              "editable": "true",
              "disabled": "true",
              "type": "TextBox",
              "required": "true"
            }
          },
          {
            "fieldName": "noOfLinks",
            "fieldValue": "7",
            "pageLayoutId": "676",
            "paramfieldlayout": {
              "visible": "true",
              "size": "100",
              "wrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6 no-padding-right ",
              "editable": "true",
              "disabled": "true",
              "type": "TextBox",
              "required": "true"
            }
          },
          {
            "fieldName": "objectID",
            "fieldValue": "81817861",
            "pageLayoutId": "676",
            "paramfieldlayout": {
              "visible": "true",
              "size": "100",
              "wrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6 no-padding-right ",
              "editable": "true",
              "disabled": "true",
              "type": "TextBox",
              "required": "true"
            }
          },
          {
            "fieldName": "PhysicalLayerDuplexMode",
            "fieldValue": "Auto",
            "pageLayoutId": "676",
            "paramfieldlayout": {
              "visible": "true",
              "size": "100",
              "wrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6 no-padding-right ",
              "editable": "true",
              "disabled": "true",
              "type": "TextBox",
              "required": "true"
            }
          },
          {
            "fieldName": "PIU",
            "fieldValue": "100",
            "pageLayoutId": "676",
            "paramfieldlayout": {
              "visible": "true",
              "size": "100",
              "wrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6 no-padding-right ",
              "editable": "true",
              "disabled": "true",
              "type": "TextBox",
              "required": "true"
            }
          },
          {
            "fieldName": "PortSpeed",
            "fieldValue": "100BASE-TX",
            "pageLayoutId": "676",
            "paramfieldlayout": {
              "visible": "true",
              "size": "100",
              "wrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6 no-padding-right ",
              "editable": "true",
              "disabled": "true",
              "type": "TextBox",
              "required": "true"
            }
          },
          {
            "fieldName": "postcode",
            "fieldValue": "85296",
            "pageLayoutId": "676",
            "paramfieldlayout": {
              "visible": "true",
              "size": "100",
              "wrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6 no-padding-right ",
              "editable": "true",
              "disabled": "true",
              "type": "TextBox",
              "required": "true"
            }
          },
          {
            "fieldName": "Quantity",
            "fieldValue": "11",
            "pageLayoutId": "676",
            "paramfieldlayout": {
              "visible": "true",
              "size": "100",
              "wrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6 no-padding-right ",
              "editable": "true",
              "disabled": "true",
              "type": "TextBox",
              "required": "true"
            }
          },
          {
            "fieldName": "reuseUni",
            "fieldValue": "false",
            "pageLayoutId": "676",
            "paramfieldlayout": {
              "visible": "true",
              "size": "100",
              "wrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6 no-padding-right ",
              "editable": "true",
              "disabled": "true",
              "type": "TextBox",
              "required": "true"
            }
          },
          {
            "fieldName": "serviceMultiplexing",
            "fieldValue": "false",
            "pageLayoutId": "676",
            "paramfieldlayout": {
              "visible": "true",
              "size": "100",
              "wrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6 no-padding-right ",
              "editable": "true",
              "disabled": "true",
              "type": "TextBox",
              "required": "true"
            }
          },
          {
            "fieldName": "serviceType",
            "fieldValue": "UNO",
            "pageLayoutId": "676",
            "paramfieldlayout": {
              "visible": "true",
              "size": "100",
              "wrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6 no-padding-right ",
              "editable": "true",
              "disabled": "true",
              "type": "TextBox",
              "required": "true"
            }
          },
          {
            "fieldName": "ServingWireCenter",
            "fieldValue": "OMAHNEOS",
            "pageLayoutId": "676",
            "paramfieldlayout": {
              "visible": "true",
              "size": "100",
              "wrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6 no-padding-right ",
              "editable": "true",
              "disabled": "true",
              "type": "TextBox",
              "required": "true"
            }
          },
          {
            "fieldName": "stateOrProvince",
            "fieldValue": "NE",
            "pageLayoutId": "676",
            "paramfieldlayout": {
              "visible": "true",
              "size": "100",
              "wrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6 no-padding-right ",
              "editable": "true",
              "disabled": "true",
              "type": "TextBox",
              "required": "true"
            }
          },
          {
            "fieldName": "streetName",
            "fieldValue": "xyhh",
            "pageLayoutId": "676",
            "paramfieldlayout": {
              "visible": "true",
              "size": "100",
              "wrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6 no-padding-right ",
              "editable": "true",
              "disabled": "true",
              "type": "TextBox",
              "required": "true"
            }
          },
          {
            "fieldName": "streetNamePrefix",
            "fieldValue": "Y",
            "pageLayoutId": "676",
            "paramfieldlayout": {
              "visible": "true",
              "size": "100",
              "wrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6 no-padding-right ",
              "editable": "true",
              "disabled": "true",
              "type": "TextBox",
              "required": "true"
            }
          },
          {
            "fieldName": null,
            "fieldValue": null,
            "pageLayoutId": null,
            "paramfieldlayout": null
          },
          {
            "fieldName": null,
            "fieldValue": null,
            "pageLayoutId": null,
            "paramfieldlayout": null
          },
          {
            "fieldName": "streetType",
            "fieldValue": "ST",
            "pageLayoutId": "676",
            "paramfieldlayout": {
              "visible": "true",
              "size": "100",
              "wrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6 no-padding-right ",
              "editable": "true",
              "disabled": "true",
              "type": "TextBox",
              "required": "true"
            }
          },
          {
            "fieldName": "synchronousMode",
            "fieldValue": "false",
            "pageLayoutId": "676",
            "paramfieldlayout": {
              "visible": "true",
              "size": "100",
              "wrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6 no-padding-right ",
              "editable": "true",
              "disabled": "true",
              "type": "TextBox",
              "required": "true"
            }
          },
          {
            "fieldName": "uniResiliency",
            "fieldValue": "None",
            "pageLayoutId": "676",
            "paramfieldlayout": {
              "visible": "true",
              "size": "100",
              "wrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6 no-padding-right ",
              "editable": "true",
              "disabled": "true",
              "type": "TextBox",
              "required": "true"
            }
          }
        ]
      },
      {
        "header": "Task Specific Details",
        "fieldList": [
          {
            "fieldName": "ACNA",
            "fieldValue": "LGT",
            "pageLayoutId": "676",
            "paramfieldlayout": {
              "visible": "true",
              "size": "100",
              "wrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6 no-padding-right ",
              "editable": "true",
              "disabled": "true",
              "type": "TextBox",
              "required": "true"
            }
          },
          {
            "fieldName": "action",
            "fieldValue": "N",
            "pageLayoutId": "676",
            "paramfieldlayout": {
              "visible": "true",
              "size": "100",
              "wrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6 no-padding-right ",
              "editable": "true",
              "disabled": "true",
              "type": "TextBox",
              "required": "true"
            }
          },
          {
            "fieldName": "BAN",
            "fieldValue": "88786312",
            "pageLayoutId": "676",
            "paramfieldlayout": {
              "visible": "true",
              "size": "100",
              "wrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6 no-padding-right ",
              "editable": "true",
              "disabled": "true",
              "type": "TextBox",
              "required": "true"
            }
          },
          {
            "fieldName": "CCNA",
            "fieldValue": "LNP",
            "pageLayoutId": "676",
            "paramfieldlayout": {
              "visible": "true",
              "size": "100",
              "wrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6 no-padding-right ",
              "editable": "true",
              "disabled": "true",
              "type": "TextBox",
              "required": "true"
            }
          },
          {
            "fieldName": "CustomerOrderID",
            "fieldValue": "178448533",
            "pageLayoutId": "676",
            "paramfieldlayout": {
              "visible": "true",
              "size": "100",
              "wrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6 no-padding-right ",
              "editable": "true",
              "disabled": "true",
              "type": "TextBox",
              "required": "true"
            }
          },
          {
            "fieldName": "dueDate",
            "fieldValue": "7019-12-25",
            "pageLayoutId": "676",
            "paramfieldlayout": {
              "visible": "true",
              "size": "100",
              "wrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6 no-padding-right ",
              "editable": "true",
              "disabled": "true",
              "type": "TextBox",
              "required": "true"
            }
          },
          {
            "fieldName": "MOBServiceOrderID",
            "fieldValue": "750285",
            "pageLayoutId": "676",
            "paramfieldlayout": {
              "visible": "true",
              "size": "100",
              "wrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6 no-padding-right ",
              "editable": "true",
              "disabled": "true",
              "type": "TextBox",
              "required": "true"
            }
          },
          {
            "fieldName": "orderCreationDate",
            "fieldValue": "2017-09-22",
            "pageLayoutId": "676",
            "paramfieldlayout": {
              "visible": "true",
              "size": "100",
              "wrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6 no-padding-right ",
              "editable": "true",
              "disabled": "true",
              "type": "TextBox",
              "required": "true"
            }
          },
          {
            "fieldName": "purchaseOrderNumber",
            "fieldValue": "178548236AN0001",
            "pageLayoutId": "676",
            "paramfieldlayout": {
              "visible": "true",
              "size": "100",
              "wrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6 no-padding-right ",
              "editable": "true",
              "disabled": "true",
              "type": "TextBox",
              "required": "true"
            }
          },
          {
            "fieldName": "RTR",
            "fieldValue": "S",
            "pageLayoutId": "676",
            "paramfieldlayout": {
              "visible": "true",
              "size": "100",
              "wrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6 no-padding-right ",
              "editable": "true",
              "disabled": "true",
              "type": "TextBox",
              "required": "true"
            }
          },
          {
            "fieldName": "supType",
            "fieldValue": "1",
            "pageLayoutId": "676",
            "paramfieldlayout": {
              "visible": "true",
              "size": "100",
              "wrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6 no-padding-right ",
              "editable": "true",
              "disabled": "true",
              "type": "TextBox",
              "required": "true"
            }
          },
          {
            "fieldName": "transactionType",
            "fieldValue": "SWITCHED_ETHERNET_SVC",
            "pageLayoutId": "676",
            "paramfieldlayout": {
              "visible": "true",
              "size": "100",
              "wrapperCssClass": "col-xs-12 col-md-6 col-sm-6 col-lg-6 no-padding-right ",
              "editable": "true",
              "disabled": "true",
              "type": "TextBox",
              "required": "true"
            }
          }
        ]
      },
      {
        "header": "UnMappedFields",
        "fieldList": [
          {
            "fieldName": "message",
            "fieldValue": "Test",
            "pageLayoutId": "592",
            "paramfieldlayout": {
              "type": "text"
            }
          },
          {
            "fieldName": "version",
            "fieldValue": "9",
            "pageLayoutId": "592",
            "paramfieldlayout": {
              "type": "text"
            }
          }
        ]
      }
    ],
    "id": null,
    "taskName": null,
    "sourceSystemId": null
  };
  NewV2Data: any = [];
  IsSucess: boolean = false;
  IsError: boolean = false;
  CustomerAttributorData: any = [];
  public errorMessage = '';
  public authorizedSPRUser: boolean = false;

  constructor(
    private taskService: TaskService,
    public dialog: MatDialog,
    public _ref: ChangeDetectorRef
  ) {

  }

  handleModelForTask() {
    const section = this.pageLayout.pageLayoutTemplate.find(element => element.sectionHeader === "Task General Details");
    if (section) {
      const field = section.fieldsList.find(el => el.fieldName === "ng2Taskdd");
      if (field) {
        field.model = "taskName";
      }
    }
  }

  async ngOnInit() {
    console.log('SPR component');
    console.log("this.processData ==> ", this.processData);
    this.CustomerAttributorData = [];
    const userDetails = JSON.parse(localStorage.getItem('fd_user'));
			const authorizations = userDetails && userDetails.authorizations ? userDetails.authorizations : [];
			if(authorizations.indexOf('Task_View') > -1 || authorizations.indexOf('Task_Edit') > -1){
				this.authorizedSPRUser = true;
			}else{
        this.errorMessage = 'You do not have access to view SPR Task Details';
        return;
			}
    this.loaderTaskDetail = true;
    await this.taskService.callGetUrl('/PageLayoutTemplate/Get/SPR%20Viewer').toPromise().then( async(resp) => {
      this.pageLayout = resp;
      console.log("this.pageLayout", this.pageLayout);
      await this.checkTaskPermissions();
    });
    await this.taskService.callGetUrl('/PageLayoutTemplate/Get/Log%20Details%20Table').toPromise().then((resp) => {
      this.logPageLayout = resp;
      
		});

    console.log(localStorage.getItem('AutopilotAppTaskInstanceId'));
    // this.taskService.getautopailotdata('/Task/V3/get/AUTOPILOT/' + localStorage.getItem('AutopilotAppTaskInstanceId')).toPromise().then((res) => {
    //   this.loaderTaskDetail = false;
    //   console.log(res);

    //   this.workGroupNamenew = JSON.parse(JSON.stringify(res['workgroupList']));
    //   console.log("workGroupName ==> ", this.workGroupNamenew);
    //   this.isShow = true;

    //   localStorage.setItem('AutopilotTaskinstid', res['taskinstid']);
    //   this.data = res;

    //   console.log("data.taskInstParams ==> ", this.data.taskInstParams);
    // });

    //this.taskService.getautopailotdata('/Enterprise/v2/Work/task?sourceTaskId='+localStorage.getItem('AutopilotAppTaskInstanceId')+'&sourceSystemName=AUTOPILOT&include=tsm').toPromise().then(res => {
      this.taskService.getautopailotdata('/Enterprise/v2/Work/task/'+ this.processData.id +'?include=aa,tsm').toPromise().then(res => {
      this.NewV2Data = res['taskSectionModels'];
      if (isArray(this.NewV2Data)) {
        this.NewV2Data.forEach(element => {
        
          if (element.header === 'Customer Attributes') {
            element.paramList.forEach(filed => {
              this.CustomerAttributorData.push(JSON.parse(filed.value));
            });
          }
        });
      }
      
      this.loaderTaskDetail = false;
      this.isShow = true;
      localStorage.setItem('AutopilotTaskinstid', res['id']);
      this.data = [];
      this.data.push(res);
      console.log("this.data", this.data);
      this.taskService.callGetUrl('/Enterprise/v2/Work/task/'+res['id']+'/activityLog').toPromise().then((Logresp: any) => {
        console.log("Log Details < == >", Logresp);
        this.logData = Logresp;
        this.logDetails = Logresp;
        for (let index = 0; index < this.logData.length; index++) {
          this.logData[index]['activityDetails'] = this.logData[index]['activityDetails'].replace('/n', '\n');
          
        }
      });
      console.log(new Date().getMilliseconds());
      // res['taskInstParamRequests'].forEach(element => {
      //   const obj = {};
      //   if (this.NewV2Data.findIndex(e => e.header === element.header) === -1) {
      //     const data: any = [];
      //     obj['header'] = element.header;
      //     data.push(element);
      //     obj['fieldList'] = data;
      //     this.NewV2Data.push(obj);
      //   } else {
      //     this.NewV2Data[this.NewV2Data.findIndex(e => e.header === element.header)].fieldList.push(element);
      //   }
      // });
      // console.log(this.NewV2Data);
      // console.log(new Date().getMilliseconds());
      // var elem = document.querySelector('.grid');
      // var msnry = new Masonry(elem, {
      //   itemSelector: 'grid-item',
      //   columnWidth: 200
      // });

      /* $('.grid').masonry({
        itemSelector: '.col-sm-6',
        columnWidth: 160,
        gutter: 20
      }); */
    });
  }

  checkTaskPermissions(){
		const userDetails = JSON.parse(localStorage.getItem('fd_user'));
    let userAuthorizations = userDetails && userDetails.authorizations ? userDetails.authorizations : [];
		if(userAuthorizations.indexOf('Button_cancel') == -1){
      this.hideCancel = true;
    }
    if(userAuthorizations.indexOf('Button_dueDate') == -1){
      this.hideDueDate = true;
    }
  }

  getDueDate(data){
    if(data && data[0] && data[0].taskSectionModels){
      for (let index = 0; index < data[0].taskSectionModels.length; index++) {
        const element = data[0].taskSectionModels[index];
        if(element.header=="Customer Order" && element.paramList){
        for (let index = 0; index < element.paramList.length; index++) {
          const prmDetails = element.paramList[index];
          if(prmDetails.name == "dueDate"){
            console.log("000", prmDetails.value);
            return prmDetails.value ? prmDetails.value : '';
          }
        }
      }
      }
    }
  }
  
  OpenDuaDateDialog() {
    this.data && this.data[0] ? localStorage.setItem('taskName',this.data[0].taskName) : '';
    console.log("Data <<==>> ", this.data);
    console.log("Id <<==>> ", this.data.sourceTaskId);
    let dueDate:any = this.getDueDate(this.data);
    console.log("dueDate", dueDate);
    const dialogRef = this.dialog.open(SprtaskdialogComponent, {
      data:{sourceTaskId: this.data.sourceTaskId, dueDate:dueDate }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (isObject(result)) {
        this.loaderTaskDetail = true;
        this.taskService.updateSprDueTask(localStorage.getItem('AutopilotTaskinstid'), 2, result.date, result.reason).toPromise().then((res: any) => {

          this.message = res.message;
          if (res.code === '200') {
            this.ngOnInit();
            this.IsSucess = true;
            this.loaderTaskDetail = false;
            setTimeout(() => {
              this.IsSucess = false;
            }, 5000);
          } else {
            this.IsError = true;
            this.loaderTaskDetail = false;
            setTimeout(() => {
              this.IsError = false;
            }, 5000);
          }
        }, (errorRes:any)=>{
          this.message = errorRes.error.message;
          this.IsError = true;
          this.loaderTaskDetail = false;
          setTimeout(() => {
            this.IsError = false;
          }, 5000);
        });
      }
      
      /* return false;
      if (result) {
        console.log("Save called : ");
       
        this.ngOnInit();

        if(result.code=="200"){
          this.IsSuccess=true;
          this.message=result.message;
        }
        // this.data.taskInstParams[0]['fieldList'][0]['fieldValue'] = result;

        // Save data
        // this.taskService.updateSprTask(this.data.sourceTaskId,'Sup1',{dueDate:result}).toPromise().then((res) => {
        //   console.log(res);
        this.message = result.message;
        if (result.code == "200") {
          this.IsSucess = true;

          setTimeout(() => {
            this.IsSucess = false;
          }, 5000);
        }
        else {
          this.IsError = true;

          setTimeout(() => {
            this.IsError = false;
          }, 5000);
        }

      } else {
        console.log('The dialog was closed'); 
     

      }
      console.log(result);
      // this.animal = result; */
    });
  }

  OpenCancelDialog() {
    const dialogRef = this.dialog.open(SprtaskcanceldialogComponent, this.data.sourceTaskId);

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (isObject(result)) {
        this.loaderTaskDetail = true;
        this.taskService.updateSprDueTask(localStorage.getItem('AutopilotTaskinstid'), 1, '', result.reason).toPromise().then((res: any) => {
          console.log(res.code);
          
          this.message = res.message;
          if (res.code === '200') {
            this.loaderTaskDetail = false;
            this.ngOnInit();
            this.IsSucess = true;
            setTimeout(() => {
              this.IsSucess = false;
            }, 5000);
          } else {
            this.IsError = true;
            this.loaderTaskDetail = false;
            this.ngOnInit();
            setTimeout(() => {
              this.IsError = false;
            }, 5000);
          }
            
        }, (errorRes:any)=>{
          this.message = errorRes.error.message;
          this.IsError = true;
          this.loaderTaskDetail = false;
          setTimeout(() => {
            this.IsError = false;
          }, 5000);
        });
      }
      
      /* if (result) {
        console.log("Save called : ");
        this.ngOnInit();
        // this.data.taskInstParams[0]['fieldList'][0]['fieldValue'] = result;

        // Save data
        // this.taskService.updateSprTask(this.data.sourceTaskId,'Sup1',{dueDate:result}).toPromise().then((res) => {
        //   console.log(res);
        // });;
        this.message = result.message;
        if (result.code == "200") {
          this.IsSucess = true;

          setTimeout(() => {
            this.IsSucess = false;
          }, 5000);
        }
        else {
          this.IsError = true;

          setTimeout(() => {
            this.IsError = false;
          }, 5000);
        }

      } else {
        console.log('The dialog was closed');
      }
      console.log(result);
      // this.animal = result; */
    });
  }

  refresh(){
    this.ngOnInit();
  }

  filterTaskResult(columnName: string) {
		let thi = this;
		const temp = this.logDetails.filter(function (item) {
		let flag = true;
		Object.keys(item).forEach((element) => {
			let searchelem = element;
			if (element === 'createdById') {
				searchelem = 'logdetailscreatedById';
			} else if (element === 'createdDateTime') {
				searchelem = 'logdeatilscreatedDateTime';
			}
			if (flag && thi.activityLog[searchelem] && item[element] && thi.activityLog[searchelem] != "") {
				if (flag && item[element].toLowerCase().indexOf(thi.activityLog[searchelem].toLowerCase()) === -1) {
					flag = false;
				}
			}
		});
		return flag;
		});
		this.logData = temp;
	}
  
}
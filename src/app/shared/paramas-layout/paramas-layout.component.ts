import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {WidgetComponent} from '../widgets/widget/widget.component';
import {WidgetsGridComponent} from "../widgets/widgets-grid/widgets-grid.component";
import jarvisWidgetsDefaults from  '../widgets/widget.defaults';
import 'smartadmin-plugins/smartwidgets/jarvis.widget.ng2.js';
import {ActivatedRoute, Router} from "@angular/router";
declare var $: any;

@Component({
  selector: 'sa-paramas-layout',
  templateUrl: './paramas-layout.component.html',
  styleUrls: ['./paramas-layout.component.css']
})
export class ParamasLayoutComponent implements OnInit, AfterViewInit {
  // import widgets grid and other data from the parent component
  @ViewChild('widgetsgrid') el:ElementRef;
  @ViewChild('widget') elwidget:ElementRef;

  @Input("pageLayoutData") pageLayoutData: any = {
    pageLayoutTemplate: []
  };
  @Input("pageLayoutValues") pageLayoutValues: any = {};
  @Input("templateName") templateName: any = {};
  @Input("paramfieldstatus") paramfieldstatus: any;
  @Input("columnWidth") columnWidth: any;
  @Output() saveAndUpdate = new EventEmitter();
  options: any;
  userdetailswodgetwa: any = "taskresultwidget";

  widgetId: string;
  

  name: string;
  colorbutton: boolean = true;
  editbutton: boolean = true;
  togglebutton: boolean = true;
  deletebutton: boolean = true;
  fullscreenbutton: boolean = true;
  custombutton: boolean = false;
  collapsed: boolean = false;
  sortable: boolean = true;
  hidden: boolean = false;
  color: string;
  load: boolean = false;
  refresh: boolean = false;

  collapsedBody = true;


  static counter: number = 0;

  constructor(private router: Router) { }

  ngOnInit() {
    this.options = {
      multiple: true,
      tags: true
    };
    console.log("this.pageLayoutValues", this.pageLayoutValues);
    console.log("this.templateName", this.templateName);
   // this.pageLayoutData.pageLayoutTemplate.map((layoutDetails) => {
      /* if (layoutDetails.sectionHeader == "Parameters") { */

        // Converting data for UI format to render on
        this.pageLayoutData.fieldsList = this.pageLayoutData.fieldsList.map((templateParam) => {
          
          if (templateParam.type == 'MultiSelect') {
            templateParam.selectedItems = [];
            if (templateParam['systemParameterItemModels']) {
              templateParam['systemParameterItemModels'].map((model, modelIndex) => {
                // ng-select2 expects a field named "text" to contain the value to be selected
                model.text = model.value;
              })
            }
          }
        this.pageLayoutValues.map((paramsValue, paramsIndex) => {
          if (templateParam.fieldName == paramsValue.name) {
            templateParam = { ...templateParam, fieldValue: paramsValue.value }
            // re-foratting data based on param type so it can be rendered on UI easily
            // Assign values to page layout params
            if (templateParam.type == 'select') {
              if(this.pageLayoutValues[paramsIndex]['systemParameterItems']){
              this.pageLayoutValues[paramsIndex]['systemParameterItems'].map((spi) => {
                templateParam = { ...templateParam, fieldValue: spi.value }
              })
            }
            }
            if (templateParam.type == 'MultiSelect') {              
             if(this.pageLayoutValues[paramsIndex]['systemParameterItems']){
              this.pageLayoutValues[paramsIndex]['systemParameterItems'].map((spi) => {
                console.log(spi);
                templateParam.selectedItems.push(spi.value);
              })
            }
            }
          }
        });
        // console.log("templateParam.selectedItems", templateParam.selectedItems);
        return templateParam;
      });
      /* } */
    //});

    this.widgetId = this.genId();
    let widget = this.elwidget.nativeElement;
    widget.className += ' jarviswidget';
    if (this.sortable) {
      widget.className += ' jarviswidget-sortable';
    }

    if (this.color) {
      widget.className += (' jarviswidget-color-' + this.color);
    }

    ['colorbutton',
      'editbutton',
      'togglebutton',
      'deletebutton',
      'fullscreenbutton',
      'custombutton',
      'sortable'
    ].forEach((option) => {
      if (!this[option]) {
        widget.setAttribute('data-widget-' + option, 'false')
      }
    });

    [
      'hidden',
      'fullscreenbutton',
      'togglebutton',
      'collapsed'
    ].forEach((option) => {
      if (this[option]) {
        widget.setAttribute('data-widget-' + option, 'true')
      }
    });
  }

  private genId() {
    if (this.name) {
      return this.name
    } else {
      let heading = this.elwidget.nativeElement.querySelector('header h2');
      let id = heading ? heading.textContent.trim() : 'jarviswidget-' + WidgetComponent.counter++;
      id = id.toLowerCase().replace(/\W+/gm, '-');

      let url = this.router.url.substr(1).replace(/\//g, '-');
      id = url + '--' + id;

      return id
    }

  }

  ngAfterViewInit() {
    // Initializing widgets grid UI after view is initialized
    setTimeout(()=> {
      if($('#widgets-grid').length) {
        $('#widgets-grid', this.el.nativeElement).jarvisWidgets(jarvisWidgetsDefaults);
        $('.jarviswidget-fullscreen-btn').off('click').on('click', function(){
        //$('.jarviswidget-fullscreen-btn').click(function(){
          if($('body').hasClass('jarvis_fullscreen')) {
            $('body').removeClass('jarvis_fullscreen');
            $("mat-tab-header").addClass("mat-tab-header")
          } else {
            $('body').addClass('jarvis_fullscreen');
            $("mat-tab-header").removeClass("mat-tab-header")
          }
        })
      }
    }, 100);

    const $widget = $(this.elwidget.nativeElement);
    if (this.editbutton) {
      $widget.find('.widget-body').prepend('<div class="jarviswidget-editbox"><input class="form-control" type="text"></div>');
    }
  }

}

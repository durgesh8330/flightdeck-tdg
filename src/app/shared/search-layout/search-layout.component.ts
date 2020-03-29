import { Component, EventEmitter, Input, OnInit, Output,ElementRef,HostListener,Renderer,HostBinding } from '@angular/core';
import { MatDialog } from '@angular/material';
import { TaskService } from '../../features/task/task.service';
import { DatePipe } from '@angular/common';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { eventTarget } from '@amcharts/amcharts4/.internal/core/utils/DOM';

@Component({
  selector: 'sa-search-layout',
  templateUrl: './search-layout.component.html',
  styleUrls: ['./search-layout.component.css'],
  providers: [DatePipe]
})
export class SearchLayoutComponent implements OnInit {
  
  @Input('isShow') isShow: any;
  @Input('pageLayout') pageLayout: any;
  @Input('modelValue') modelValue: any = {};
  
  @Output() search = new EventEmitter();
  @Output() clear = new EventEmitter();

  private bsCfg: Partial<BsDatepickerConfig>;

  public options: any;
  public dataTypeToOperator = new Map();

  dateNumberOperators = ["equals", "greater or equal", "less or equal", "greater than", "less than", "between"];
  multiSelectDdOperators = ["IN", "NOT IN"];
  singleSelectDdOperators = ["equals", "not equals"];
  textboxOperators = ["equals", "not equals", "starts with", "ends with", "contains"]

  operator:string = null;
  

  constructor(private taskService: TaskService, public dialog: MatDialog, private datePipe: DatePipe, private el: ElementRef, private renderer: Renderer) {
    this.bsCfg  = Object.assign({},{
      showWeekNumbers:false,
      dateInputFormat:'YYYY-MM-DD',
      rangeInputFormat: 'YYYY-MM-DD'
    });
  }
  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    console.log(event);
}
  // @HostListener('mouseenter')
  // onMouseEnter() {
  //   if(document.querySelector('.select2-dropdown')){
  //   let part = document.querySelector('.select2-dropdown');          
  //   this.renderer.setElementStyle(part, 'display', 'block'); 
  //   }
  // }
  ngOnInit() {

    this.dataTypeToOperator = new Map([
      ["Date", this.dateNumberOperators],
      ["Number", this.dateNumberOperators],
      ["TextBox", this.textboxOperators],
      ["MultiSelect", this.multiSelectDdOperators],
      ["SingleSelect", this.singleSelectDdOperators],
      ["Select", this.singleSelectDdOperators],
      ["SearchTextBox", this.singleSelectDdOperators]
    ]);

    this.options = {
      multiple: true,
      tags: true
    };
  }

  getOperators(type) {
    if(!this.fieldHasValue(type)) {
      return this.textboxOperators;
    }
    return this.dataTypeToOperator.get(type);
  }

  filter(name, obj) {
   
    const filterValue = name.toLowerCase();
    obj.dataSource = obj.dropDownList.filter(option => (
      (option.data.toLowerCase().indexOf(filterValue) !== -1)
    ));
  }

  initOperatorToDefaultValue(obj) {
    if (obj == null) {
      return;
    }

    if (!this.fieldHasValue(obj.type)) {
      obj.operator = "equals";
      return;
    }

    switch (obj.type.toUpperCase()) {
      case "MULTISELECT": 
        obj.operator = "IN";
        break;
      default: 
        obj.operator = "equals";
        break;

    }
  }

  onChange(obj, event) {
    obj.operator = event.value;
  }

  dateUpdated(obj, input) {
    setTimeout(() => {
      let formattedVal:any = "";

       // Array when it is the date range selection. i.e when operator is "between" otherwise it is a String 
      if (input instanceof Date) {
        formattedVal = this.datePipe.transform(input, 'yyyy-MM-dd');

      } else if (input instanceof Array) {
        formattedVal = [];
        input.forEach(value => {
          if (value instanceof Date) {
            formattedVal.push(this.datePipe.transform(value, 'yyyy-MM-dd'));
          }
        });

        if (formattedVal.length != 2) {
          formattedVal = input;
        }
      }
      this.modelValue[obj.label] = formattedVal;
    });
  }

  searchData(value) {
    $("ng-select2>select").select2('close')
    this.search.emit(value);
  }

  clearData(layoutElem) {
    this.clear.emit(layoutElem);
  }

  fieldHasValue(field) {
    if (field == undefined || field == null || ("" + field).length < 1) {
      return false;
    }
    return true;
  }

}

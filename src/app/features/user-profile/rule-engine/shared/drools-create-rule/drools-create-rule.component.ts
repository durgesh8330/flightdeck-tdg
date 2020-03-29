import { Component, OnInit, HostBinding, Input, Optional, Self, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RuleSet } from '../models/ruleset.model';
import { Rule } from '../models/rule.model';
import { FormGroup, FormBuilder, FormControl, Validators, ControlValueAccessor, NgControl} from '@angular/forms';
import { MatFormFieldControl } from '@angular/material';
import { Subject } from 'rxjs';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

@Component({
  selector: 'app-drools-create-rule',
  templateUrl: './drools-create-rule.component.html',
  styleUrls: ['./drools-create-rule.component.css'],
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: DroolsCreateRuleComponent
    }]
})
export class DroolsCreateRuleComponent implements  ControlValueAccessor, MatFormFieldControl<Rule>, OnInit {
  shouldLabelFloat: boolean;
  controlType?: string;
  autofilled?: boolean;
  private static materialId = 0;
  stateChanges = new Subject<void>();
  private onChange = (_: Rule) => null;
  private onTouched = () => null;
  @HostBinding() id = `drools-create-rule.component-${ DroolsCreateRuleComponent.materialId++ }`;

  @HostBinding('attr.aria-describedby') describedBy = '';
  private _value: Rule;
  private _placeholder: string;
  private _focused = false;
  private _required = false;
  private _disabled = false;
  
  @Output() focusChange = new EventEmitter<boolean>();
  showRuleNameBox: Boolean = false;
  showTableSection: Boolean = false;
  showTable: Boolean = false;
  isEditScreen:Boolean = false;
  currentIndex: number = null;

  ruleSet: RuleSet;
  rule: Rule;
  private _editData:any;

  constructor(private http: HttpClient,   @Optional() @Self() public ngControl: NgControl) {
    this.ruleSet = { ruleSetName: '', rules: [] };
    // tslint:disable-next-line:max-line-length
     this.addRule();
  // mat
  if (this.ngControl != null) {
    this.ngControl.valueAccessor = this;
  }
  }

  ngOnInit() {
    if (this._editData!=undefined)
    {
        this.rule = { headings: this._editData['headings'], data: this._editData['data']};
        this.showTable = true;
        this.isEditScreen = this._editData.isEditScreen;
        this.writeValue(this.rule);
     }
  }

  // add a column
  addColumn() {
    // you must cycle all the rows and add a column
    this.rule.data.forEach((row) => {
      row.unshift({ 'value': '' });
    });
    this.rule.headings.unshift({ 'value': '' });
    this.writeValue(this.rule);
  }

  // remove the selected column
  removeColumn(index) {
    // remove the column specified in index
    // you must cycle all the rows and remove the item
    // row by row
    this.rule.data.forEach((row) => {
      if (row.length > 1) {
        row.splice(index, 1);
      } else {

      }
      // if no columns left in the row push a blank array
      if (row.length === 0) {
        row.data = [];
      }
    });
    if (this.rule.headings.length > 1) {
      this.rule.headings.splice(0, 1);
    }
    this.writeValue(this.rule);
  }

  // remove the selected row
  removeRow(index) {

    if (this.rule.data.length >= 1) {
      // remove the row specified in index
      this.rule.data.splice(index, 1);
      // if no rows left in the array create a blank array
      if (this.rule.data.length === 0) {
        this.rule.data = [];
      }
    } else {

    }
    this.writeValue(this.rule);
  }

  // add a row in the array
  addRow() {
    // create a blank array
    let newrow = [];

    // if array is blank add a standard item
    if (this.rule.data.length === 0) {
      for(let i=0; i<this.rule.headings.length; i++){
       // newrow = [{ 'value': '' }];
        newrow.push({ 'value': '' });
      }
      
    } else {
      // else cycle thru the first row's columns
      // and add the same number of items
      this.rule.data[0].forEach((row) => {
        newrow.push({ 'value': '' });
      });
    }
    // add the new row at the end of the array
    this.rule.data.push(newrow);
    this.writeValue(this.rule);
  }

  addRule() {
    // tslint:disable-next-line:max-line-length
    this.rule = { headings: [{ value: 'Results' }], data: [[{ value: '' }]]};
    this.showTable = true;
    this.currentIndex = null;
    this.writeValue(this.rule);
  }

  addRuleToRuleSet() {
    if (this.currentIndex != null) {
      this.ruleSet.rules[this.currentIndex] = this.rule;

    } else {
      this.ruleSet.rules.push(this.rule);
    }
    // tslint:disable-next-line:max-line-length
    this.rule = {headings: [{ value: 'Results' }], data: [[{ value: '' }]] };
    this.showTable = false;
    this.currentIndex = null;
  }

  loadRule(index) {
    this.rule = JSON.parse(JSON.stringify(this.ruleSet.rules[index]));
    this.showTable = true;
    this.currentIndex = index;
  }
 
  get value() {
    return this._value;
  }

  set value(value: Rule) {
    this._value = value;
    this.stateChanges.next();
  }

  
  registerOnChange(fn: (value: Rule) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  writeValue(value: Rule): void {
    if (value === null) {
      return;
    }
    this.value = value;
    this.rule = this.value;
    this.onChange(this.value);
  }
  @Input()
  get placeholder() {
    return this._placeholder;
  }

  set placeholder(plh) {
    this._placeholder = plh;
    this.stateChanges.next();
  }
  get focused() {
    return this._focused;
  }

  set focused(val) {
    this._focused = val;
    this.stateChanges.next();
  }
  focusChanged(focused: boolean) {
    this.onTouched();
    this.focused = focused;
    this.focusChange.emit(focused);
  }
  get empty() {
    return !this.value;
  }

  @Input()
  get required() {
    return this._required;
  }

  @Input() 
  set editData (value)
  {
    this._editData = value;
  }

  get editData ()
  {
   return this._editData;
  }

  set required(req) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }
  @Input()
  get disabled() {
    return this._disabled;
  }

  set disabled(dis) {
    this._disabled = coerceBooleanProperty(dis);
    this.stateChanges.next();
  }

  get errorState() {
    return this.ngControl && !this.ngControl.pristine && !this.ngControl.valid;
  }

  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent) {}
}

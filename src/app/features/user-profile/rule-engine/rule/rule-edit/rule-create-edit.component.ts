import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { RuleInputService } from '../rule-input/rule-input.service';
import { DragulaModule, DragulaService } from 'ng2-dragula';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { ProcessComponent } from '../../shared/process';
import { ToasterModule, ToasterService, ToasterConfig} from 'angular2-toaster';
import { RuleService } from '../../shared/services/rule/rule.service';
import { Filter } from '../../shared/models/filter.model';
import { FilterService } from '../../shared/services/rule/filter.service';
import { RuleInputEditComponent } from '../rule-input/rule-input-edit/rule-input-edit.component';
import { Resource } from './resource-field.model';

@Component({
  selector: 'sa-rule-create',
  templateUrl: './rule-create-edit.component.html',
  styleUrls: ['./rule-create-edit.component.scss']
})
export class RuleCreateEditComponent implements OnInit {


  @Input() processData: any;
  onDropModel: any;
  generalSettingsFormGroup: FormGroup;
  resourceSettingsFormGroup: FormGroup;
  taskSettingsFormGroup: FormGroup;
  ruleSettingsFormGroup: FormGroup;
  availableRuleInputs = [];
  availableRuleSets = [];
  availableOperators: string[];
  availResourceFilter: Resource[];
  availTaskFilter: Resource[];
  allDataTypeOperators: string[];
  intDataTypeOperators: string[];
  dateDataTypeOperators: string[];
  booleanDataTypeOperators: string[];
  showSkills: boolean = false;
  selectedRuleVaues: any[];
  draggedValues: any[];
  getNextRuleFetchedId: string;
  readOnly: boolean = false;
  getNextExistingData: any;
  dropDownSettings = {};
  tabId: number = 0;
  success: boolean = false;
  @Input() errorMessage: any;
  
  public config1 : ToasterConfig = new ToasterConfig({
    positionClass: 'toast-top-full-width',
    animation: 'fade',
    timeout: 10000
  });

  constructor(private _formBuilder: FormBuilder, private route: ActivatedRoute, 
    private filterService: FilterService, private ruleInputService: RuleInputService,
     private dragulaService: DragulaService, private matDialog: MatDialog, 
     private _Activatedroute: ActivatedRoute, private ruleService: RuleService,
      private toasterService: ToasterService) {
    this.selectedRuleVaues = [];
    this.draggedValues = [];
    this.dropDownSettings = {
      text: "Select Items",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      classes: "myclass custom-class",
      enableSearchFilter: true,
      lazyLoading: true,
      badgeShowLimit: 4
    };

    this.getNextRuleFetchedId = this._Activatedroute.snapshot.params['id'];
    this.readOnly = this._Activatedroute.snapshot.params['readOnly'];
    if (this.getNextRuleFetchedId != undefined) {
      this.getNextExistingData = this.ruleService.getRuleData(this.getNextRuleFetchedId);
    }
    this.booleanDataTypeOperators = ['=', '!='];
    this.allDataTypeOperators = ['=', '!=', 'IN', 'NOT IN'];
    this.intDataTypeOperators = ['<', '>', '<=', '>=', 'BETWEEN'];
    this.dateDataTypeOperators = ['<', '>', '<=', '>=', 'DATE BETWEEN'];
    this.availableOperators = [
      '=', '!=', '<', '>', '<=', '>=', 'IN', 'NOT IN', 'BETWEEN', 'LIKE'
    ];
    // this.getComponentData();
  }

  ngOnInit() {
    
    if (this.processData != undefined) {
      this.availResourceFilter = this.processData['availResourceFilter'];
      this.availTaskFilter = this.processData['availTaskFilter'];
      this.availableRuleInputs = this.processData['availableRuleInputs'];
      this.tabId = this.processData['tabId'];
      if (this.processData['uuid'] != undefined) {
        this.getNextRuleFetchedId = this.processData['uuid'];
        this.getNextExistingData = this.ruleService.getRuleData(this.getNextRuleFetchedId);
      }
      if (this.processData['readOnly'] != undefined) {
        this.readOnly = this.processData['readOnly'];
      }
    }
    else {
      this.route.data.subscribe(t => {
        this.availResourceFilter = t.myData[0];
        this.availTaskFilter = t.myData[1];
        this.availableRuleInputs = t.myData[2]
      });
    }
    if (this.getNextExistingData != undefined) {
      this.processRuleData();
    }
    else {
      this.generalSettingsFormGroup = this._formBuilder.group({
        ruleName: ['', Validators.required]
      });
      this.taskSettingsFormGroup = this._formBuilder.group({
        taskFilters: this._formBuilder.array([], Validators.compose([Validators.required, Validators.minLength(1)])),
      });
    }
    this.resourceSettingsFormGroup = this._formBuilder.group({
      resourceFilters: this._formBuilder.array([]),
    });


    this.ruleSettingsFormGroup = this._formBuilder.group({
      ruleSetCtrl: [''],
      description: [''],
      matchSkillsBasedOn: [''],
      skillMatchMandatory: [''],
      primaryOrSecondary: [''],
      skillLevelWeighting: [''],
      priorityOrder: [''],
      weightedAverage: [''],
      selectedRuleInputs: [''],
      inputWeightage: ['']
    });
    this.dragulaService.setOptions('bag-task' + this.tabId, {
      copy: true,
      drop: true,
      accepts: function (el, container, handle) {
        return container.id !== 'no-drop';
      }
    });
  }

  ngOnDestroy() {
    this.dragulaService.destroy("bag-task" + this.tabId);
  }

  get taskFilters(): FormArray {
    return this.taskSettingsFormGroup.get('taskFilters') as FormArray;
  }
  addRow() {

    this.taskFilters.push(this._formBuilder.group(new Filter()));
  }
  removeRow(index) {
    this.taskFilters.removeAt(index);
  }

  /*-- resource section start here ---*/
  get resourceFilters(): FormArray {
    return this.resourceSettingsFormGroup.get('resourceFilters') as FormArray;
  }
  addResourceRow() {
    this.resourceFilters.push(this._formBuilder.group(new Filter()));
  }
  removeResourceRow(index) {
    this.resourceFilters.removeAt(index);
  }
  /*-- resource section end here ---*/

  checkVisible(filter: any, type: String, isDateType: boolean) {

    let filterField: Resource[] = this.availTaskFilter.filter((availField: Resource) => availField.fieldName === filter.value.fieldName);
    if (filterField && filterField.length > 0) {
      filter.value.availableOperators = this.getOperators(filterField[0].fieldDataType);
      let options: any = filterField[0].optionsList;

      if (!options) {
        options = [];
      }
      if (filterField[0].fieldDataType != 'date' && isDateType == false) {
        if ((filter.value.fieldOperator === 'BETWEEN' || filter.value.fieldOperator === 'DATE BETWEEN') && type === 'double') {
          return true;
          // tslint:disable-next-line:max-line-length
        } else if (options.length === 0 && type === 'box' && (filter.value.fieldOperator != 'BETWEEN' && filter.value.fieldOperator != 'DATE BETWEEN')) {
          return true;
        } else if (filter.value.fieldOperator === 'IN' && options.length > 0 && type === 'multi') {
          return true;
          // tslint:disable-next-line:max-line-length
        } else if (filter.value.fieldOperator === 'NOT IN' && options.length > 0 && type === 'multi') {
          return true;
          // tslint:disable-next-line:max-line-length
        } else if ((filter.value.fieldOperator !== 'NOT IN' && filter.value.fieldOperator !== 'BETWEEN' && filter.value.fieldOperator !== 'IN') && options.length > 0 && type === 'single') {
          return true;
        } else {
          return false;
        }
      }
      else if (filterField[0].fieldDataType == 'date' && isDateType) {
        if ((filter.value.fieldOperator === 'BETWEEN' || filter.value.fieldOperator === 'DATE BETWEEN') && type === 'double') {
          return true;
          // tslint:disable-next-line:max-line-length
        } else if (options.length === 0 && type === 'box' && (filter.value.fieldOperator != 'BETWEEN' && filter.value.fieldOperator != 'DATE BETWEEN')) {
          return true;
        } else if (filter.value.fieldOperator === 'IN' && options.length > 0 && type === 'multi') {
          return true;
          // tslint:disable-next-line:max-line-length
        } else if (filter.value.fieldOperator === 'NOT IN' && options.length > 0 && type === 'multi') {
          return true;
          // tslint:disable-next-line:max-line-length
        } else if ((filter.value.fieldOperator !== 'NOT IN' && filter.value.fieldOperator !== 'BETWEEN' && filter.value.fieldOperator !== 'IN') && options.length > 0 && type === 'single') {
          return true;
        } else {
          return false;
        }
      }
    }
  }

  getOperators(fieldDataType) {
    switch (fieldDataType) {
      case "string":
        {
          return this.allDataTypeOperators;
        }
      case "number":
        {
          let operators: string[] = [];
          operators.push(...this.allDataTypeOperators);
          operators.push(...this.intDataTypeOperators);
          return operators;
        }
      case "date":
        {
          let operators: string[] = [];
          operators.push(...this.allDataTypeOperators);
          operators.push(...this.dateDataTypeOperators);
          return operators;
        }
      case "boolean":
        {
          let operators: string[] = [];
          operators.push(...this.booleanDataTypeOperators);
          return operators;
        }
      default:
        {
          return this.allDataTypeOperators;
        }
    }
  }
  getFieldValues(fieldName) {
    // tslint:disable-next-line:no-shadowed-variable
    let filterField: Resource[] = this.availTaskFilter.filter((availField: Resource) => availField.fieldName === fieldName);
    return filterField[0].optionsList;
  }
  createOrUpdateRule() {
    // tslint:disable-next-line:no-shadowed-variable
    console.log(this);
    let isValidated = this.validateInputWeightage();
    if (!isValidated) {
      this.errorMessage = "Rule Inputs weightage must be equal to 100%."
      return;
    }
    else {
      this.errorMessage = undefined;
    }
    let request: any = {};
    request.ruleName = this.generalSettingsFormGroup.value.ruleName;
    request.taskSearchRequest = {};
    request.taskSearchRequest.criterias = [];
    request.ruleMasterInputs = [];
    for (let j = 0; j < this.draggedValues.length; j++) {
      request.ruleMasterInputs.push(this.draggedValues[j]);
    }
    for (let i = 0; i < this.taskSettingsFormGroup.value.taskFilters.length; i++) {
      let taskFilter = this.taskSettingsFormGroup.value.taskFilters[i];
      let obj: any = {};
      obj.fieldName = taskFilter.fieldName;
      obj.value = Array.isArray(taskFilter.fieldValue) ? taskFilter.fieldValue.toString() : taskFilter.fieldValue;
      obj.operator = taskFilter.fieldOperator;
      obj.filterCriteria = 'AND';
      request.taskSearchRequest.criterias.push(obj);
    }

    let message = this.filterService.createOrUpdateRule(request).subscribe((response: Response) => {
      this.toasterService.pop('success', response['code'], response['message']);
      this.success = true;
    },
      error => {
        this.toasterService.pop('error', error['code'], error['message']);
        this.success = false;
      }
    );
    console.log(request);
  }

  viewRuleset(options: any) {
    if (options.value === 'SKILLS_MATCH') {
      this.showSkills = true;
    } else {
      this.showSkills = false;
    }
  }

  openDialog(index) {

    let dialogRef = this.matDialog.open(RuleInputEditComponent, {
      width: '900px',
      data: { rule: this.draggedValues[index], edit: true, showScript: false, isModal: true, modalIndex: index },
      height: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result != 'Cancel') {
        let ruleData = result['ruleData'];
        let modalIndex = result['modalIndex'];
        this.draggedValues[modalIndex]['data'] = ruleData['decisionTable']['data'];
        this.draggedValues[modalIndex]['headings'] = ruleData['decisionTable']['headings'];
      }
    });
  }

  validateInputWeightage() {
    let totalWeightage: number = 0;
    this.draggedValues.forEach(value => {
      let inputWeightage: number = parseInt(value.inputWeightage);
      totalWeightage = totalWeightage + inputWeightage;
    }
    );

    if (totalWeightage != 100) {
      return false;
    }
    return true;
  }

  deleteRuleSet(index: number) {
    this.draggedValues.splice(index, 1);
  }

  private processRuleData() {
    this.taskSettingsFormGroup = this._formBuilder.group({
      taskFilters: this._formBuilder.array([], Validators.compose([Validators.required, Validators.minLength(1)])),
    });
    if (this.getNextExistingData != undefined) {
      this.generalSettingsFormGroup = this._formBuilder.group({
        ruleName: [this.getNextExistingData.ruleName, Validators.required]
      });

      if (this.getNextExistingData.taskSearchRequest != undefined) {
        let criterias = this.getNextExistingData.taskSearchRequest.criterias;
        criterias.forEach(element => {
          let taskFilter: Filter = new Filter();
          let filterField: Resource[] = this.availTaskFilter.filter((availField: Resource) => availField.fieldName === element.fieldName);
          let options: any = filterField[0].optionsList;
          if (!options) {
            taskFilter.fieldValue = element.value;
          }
          else if (element.operator=='IN' || element.operator == 'NOT IN') {
            taskFilter.fieldValue = [element.value.split(",")];
          }
          else 
          {
            taskFilter.fieldValue = element.value;
          }
          taskFilter.fieldName = element.fieldName;


          taskFilter.fieldOperator = element.operator;
          this.taskFilters.push(this._formBuilder.group(taskFilter));
        });
      }

      if (this.getNextExistingData.dbRefRuleInputs != undefined) {
        let i = 0;
        this.getNextExistingData.customRuleInputs.forEach(element => {
          let dbRefRuleInput = this.getNextExistingData.dbRefRuleInputs.filter(ruleInput => ruleInput.name === element.name);
          if (dbRefRuleInput==undefined)
          {
            return;
          }
          let draggedValue: any = {};
          let ruleInput = dbRefRuleInput[0];
          draggedValue.description = ruleInput.description;
          draggedValue.name =ruleInput.name;
          draggedValue.inputWeightage = element.inputWeightage;
          draggedValue.data = element.data;
          draggedValue.headings = element.headings;
          draggedValue.script = ruleInput.script;
          draggedValue.id = ruleInput.id;
          this.draggedValues.push(draggedValue);
          i++;
        });
      }
    }
  }

  getComponentData(): void {
        forkJoin([this.filterService.getResourceFields(), this.filterService.getTaskFields(),
              this.ruleInputService.getAllRuleInputs()]).toPromise().then(results => {
                this.processData = { 'availResourceFilter': results[0], 'availTaskFilter': results[1],
                 'availableRuleInputs': results[2]['message']};

                 if (this.processData != undefined) {
                  this.availResourceFilter = this.processData['availResourceFilter'];
                  this.availTaskFilter = this.processData['availTaskFilter'];
                  this.availableRuleInputs = this.processData['availableRuleInputs'];
                  this.tabId = this.processData['tabId'];
                  if (this.processData['uuid'] != undefined) {
                    this.getNextRuleFetchedId = this.processData['uuid'];
                    this.getNextExistingData = this.ruleService.getRuleData(this.getNextRuleFetchedId);
                  }
                  if (this.processData['readOnly'] != undefined) {
                    this.readOnly = this.processData['readOnly'];
                  }
                }
                else {
                  this.route.data.subscribe(t => {
                    this.availResourceFilter = t.myData[0];
                    this.availTaskFilter = t.myData[1];
                    this.availableRuleInputs = t.myData[2]
                  });
                }
              });
   }
}

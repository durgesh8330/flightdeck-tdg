import { Component, OnInit, Inject, Input, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Rule } from '../../../shared/models/rule.model';
import { ProcessComponent } from '../../../shared/process';
import { RuleInputService } from '../rule-input.service';
import { ToasterModule, ToasterService, ToasterConfig} from 'angular2-toaster';

@Component({
  selector: 'app-rule-input-edit',
  templateUrl: './rule-input-edit.component.html',
  styleUrls: ['./rule-input-edit.component.scss']
})
export class RuleInputEditComponent implements OnInit, ProcessComponent {
  @Input() processData: any;
  ruleInputFormGroup: FormGroup;
  ruleData: any
  showScript: boolean = true;
  isModal: boolean = false;
  modalIndex: number = 0;
  compilationErrorMessage: any;
  @Input() editData: any;
  public config1 : ToasterConfig = new ToasterConfig({
    positionClass: 'toast-top-full-width',
    animation: 'fade',
    timeout: 10000
  });
  constructor(private _formBuilder: FormBuilder, @Optional() public thisDialogRef: MatDialogRef<RuleInputEditComponent>, @Optional() @Inject(MAT_DIALOG_DATA) public data: any, private ruleInputService: RuleInputService,private toasterService: ToasterService) {
    if (this.data != undefined) {
      this.ruleData = this.data['rule'];
      this.showScript = this.data['showScript'];
      this.isModal = this.data['isModal'];
      this.modalIndex = this.data['modalIndex'];
      this.editData = { headings: this.ruleData['headings'], data: this.ruleData['data'], isEditScreen: true };
    }
  }

  ngOnInit() {
    console.log('procees data detailas ' +this.processData);
    if (this.processData != undefined) {
      this.data = this.processData;
      this.ruleData = this.data['rule'];
      this.showScript = this.data['showScript'];
      this.isModal = this.data['isModal'];
      this.modalIndex = this.data['modalIndex'];
      this.editData = { headings: this.ruleData['headings'], data: this.ruleData['data'] };
    }
    var scriptText = this.ruleData['script'];
    this.ruleInputFormGroup = this._formBuilder.group({
      description: this.ruleData['description'],
      ruleInputName: this.ruleData['name'],
      decisionTable: new FormControl(),
      code: this.ruleData['script'],
      groovy: new FormControl(scriptText, [
        Validators.required,
      ]),
    });
  }

  onCloseConfirm() {
    this.thisDialogRef.close({ ruleData: this.ruleInputFormGroup.value, modalIndex: this.modalIndex });
  }

  onCloseCancel() {
    this.thisDialogRef.close('Cancel');
  }

  createOrUpdateRuleInput() {
    let request: any = {};
    this.compilationErrorMessage = '';
    request.description = this.ruleInputFormGroup.value.description;
    request.name = this.ruleInputFormGroup.value.ruleInputName;
    request.script = this.ruleInputFormGroup.value.groovy;
    if (this.ruleInputFormGroup.value.decisionTable) {
      request.headings = this.ruleInputFormGroup.value.decisionTable.headings;
      request.data = this.ruleInputFormGroup.value.decisionTable.data;
    }
      
    //this.ruleInputService.getAllRuleInputs();
    let message = this.ruleInputService.createOrUpdateRuleInput(request).subscribe((response: Response |any) => {
      this.toasterService.pop('success', response['code'], response['message']); 
      this.compilationErrorMessage = "Success";
    },
      error => { 
        let errorMessage = error.error;
        if (errorMessage.compilationIssue)
        {
          this.compilationErrorMessage = errorMessage.message 
        }
        else{
          this.toasterService.pop('error', errorMessage['code'], errorMessage['message']); 
        }
      }
    );
  }

}

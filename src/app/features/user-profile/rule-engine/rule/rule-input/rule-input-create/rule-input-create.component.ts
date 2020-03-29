import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { RuleInputService } from '../rule-input.service';

import { ProcessComponent } from '../../../shared/process';
import { ToasterModule, ToasterService, ToasterConfig} from 'angular2-toaster';

@Component({
  selector: 'sa-rule-input-create',
  templateUrl: './rule-input-create.component.html',
  styleUrls: ['./rule-input-create.component.scss']
})
// export class RuleInputCreateComponent implements OnInit {

//   constructor() { }

//   ngOnInit() {
//   }

// }


export class RuleInputCreateComponent implements OnInit, ProcessComponent {
  @Input() processData: any;
  ruleInputFormGroup: FormGroup;
  public config1 : ToasterConfig = new ToasterConfig({
    positionClass: 'toast-top-full-width',
    animation: 'fade',
    timeout: 10000
  });
  constructor(private _formBuilder: FormBuilder, private ruleInputService: RuleInputService,private toasterService: ToasterService) { }
  compilationErrorMessage: any;
  ngOnInit() {
    this.ruleInputFormGroup = this._formBuilder.group({
      description: '',
      ruleInputName: '',
      decisionTable: new FormControl(),
      code: '',
      groovy: new FormControl(`- just: write some rule logic here and it updates in real time.
      `, [
          Validators.required,
        ]),
    });
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

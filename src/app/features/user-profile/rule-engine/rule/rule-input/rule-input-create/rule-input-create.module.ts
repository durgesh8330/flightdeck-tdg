import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RuleInputCreateRoutingModule } from './rule-input-create-routing.module';
import { RuleInputCreateComponent } from './rule-input-create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import {MatCardModule} from '@angular/material/card';
import { MatCodemirrorModule } from '../../../shared/mat-codemirror/mat-codemirror.module';
import { DroolsCreateRuleComponent } from '../../../shared/drools-create-rule/drools-create-rule.component';
import { SharedModule } from '../../../shared/shared.module';
import { ToasterModule } from 'angular2-toaster';
import {MatInputModule} from '@angular/material/input';

@NgModule({
  imports: [
    CommonModule,
    RuleInputCreateRoutingModule,
    MatStepperModule,
    FormsModule, ReactiveFormsModule,
    MatFormFieldModule,
    MatCardModule,
    MatCodemirrorModule,
    SharedModule,
    ToasterModule,
    MatInputModule
  ],
  declarations: [RuleInputCreateComponent],
  exports : [RuleInputCreateComponent]
})
export class RuleInputCreateModule { }

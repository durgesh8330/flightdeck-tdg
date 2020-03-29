import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RuleEngineRoutingModule } from './rule-engine-routing.module';
import { RuleEngineComponent } from './rule-engine.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {ProcessComponent} from './shared/process';
import { MaterialModule } from './material.module';
import { RuleModule } from './rule/rule.module';
import { DroolsCreateRuleComponent } from './shared/drools-create-rule/drools-create-rule.component';
import { SharedModule } from './shared/shared.module';
import { ConfirmationDialogComponent } from './shared/confirmation-dialog/confirmation-dialog.component';
import { ToasterModule, ToasterService, ToasterConfig} from 'angular2-toaster';
@NgModule({
  imports: [
    CommonModule,
    RuleEngineRoutingModule,
    RuleModule,
    SharedModule,
    FormsModule, ReactiveFormsModule, ToasterModule.forRoot()

    
  ],
  declarations: [RuleEngineComponent,ConfirmationDialogComponent],
  exports: [SharedModule,ConfirmationDialogComponent],
  providers : [ToasterService]
})
export class RuleEngineModule { }

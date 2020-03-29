import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RuleImportRoutingModule } from './rule-import-routing.module';
import { RuleImportComponent } from './rule-import.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material';
import { DragulaModule } from 'ng2-dragula';
import { ToasterModule } from 'angular2-toaster';

@NgModule({
  imports: [
    CommonModule,
    RuleImportRoutingModule,
    ReactiveFormsModule,
    MatStepperModule,
    DragulaModule,
    FormsModule,
    ToasterModule
  ],
  declarations: [RuleImportComponent],
  exports : [RuleImportComponent]
})
export class RuleImportModule { }

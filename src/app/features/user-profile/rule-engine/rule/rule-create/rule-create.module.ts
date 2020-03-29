import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RuleCreateRoutingModule } from './rule-create-routing.module';
import { RuleCreateComponent } from './rule-create.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatStepperModule, MatFormField } from '@angular/material';
import { MaterialModule } from '../../material.module';
import { DragulaModule, DragulaService } from 'ng2-dragula';
import { ToasterModule } from 'angular2-toaster';

@NgModule({
  imports: [
    CommonModule,
    RuleCreateRoutingModule,
    ReactiveFormsModule,
    MatStepperModule,
    MaterialModule,
    DragulaModule,
    FormsModule,
    ToasterModule
  ],
  declarations: [RuleCreateComponent],
  exports : [RuleCreateComponent],
  providers :[DragulaService]
})
export class RuleCreateModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RuleEditRoutingModule } from './rule-edit-routing.module';
import { RuleEditComponent } from './rule-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragulaModule, DragulaService } from 'ng2-dragula';
import { MaterialModule } from '../../material.module';
import { MatStepperModule } from '@angular/material';
import { ToasterModule } from 'angular2-toaster';
import { RuleCreateEditComponent } from './rule-create-edit.component';

@NgModule({
  imports: [
    CommonModule,
    RuleEditRoutingModule,
    ReactiveFormsModule,
    MatStepperModule,
    MaterialModule,
    DragulaModule,
    FormsModule,
    ToasterModule
  ],
  declarations: [RuleEditComponent, RuleCreateEditComponent],
  exports : [RuleEditComponent,RuleCreateEditComponent],
  providers : [DragulaService]
})
export class RuleEditModule { }

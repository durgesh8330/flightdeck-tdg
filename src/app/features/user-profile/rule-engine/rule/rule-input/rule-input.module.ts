import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RuleInputRoutingModule } from './rule-input-routing.module';
import { RuleInputComponent } from './rule-input.component';
import { RuleInputCreateModule } from './rule-input-create/rule-input-create.module';
import {RuleInputService } from './rule-input.service';
import { ToasterService } from 'angular2-toaster';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    RuleInputRoutingModule,
    FormsModule, ReactiveFormsModule
    
    
  ],
  declarations: [RuleInputComponent],
  providers:[RuleInputService]
}) 
export class RuleInputModule { }

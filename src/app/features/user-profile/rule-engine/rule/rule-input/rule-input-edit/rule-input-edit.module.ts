import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RuleInputEditRoutingModule } from './rule-input-edit-routing.module';
import { RuleInputEditComponent } from './rule-input-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import {MatCardModule} from '@angular/material/card';
import { MatCodemirrorModule } from '../../../shared/mat-codemirror/mat-codemirror.module';
import { DroolsCreateRuleComponent } from '../../../shared/drools-create-rule/drools-create-rule.component';
import { MatButtonModule, MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import {MatCheckboxModule} from '@angular/material/checkbox';

import {MatInputModule} from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatListModule} from '@angular/material/list';

import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatIconModule} from '@angular/material/icon';
import { SharedModule } from '../../../shared/shared.module';
import { RuleInputSearchComponent } from './rule-input-search.component';
import { ToasterModule } from 'angular2-toaster';

@NgModule({
  imports: [
    CommonModule,
    RuleInputEditRoutingModule,
    ReactiveFormsModule,
    MatStepperModule,
    FormsModule, ReactiveFormsModule,
    MatFormFieldModule,
    MatCardModule,
    MatCodemirrorModule,
    SharedModule,
    ToasterModule
  ],
  declarations: [RuleInputEditComponent, RuleInputSearchComponent],
  exports : [RuleInputEditComponent, RuleInputSearchComponent]
})
export class RuleInputEditModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DistributedRuleComponent } from './distributed-rule-component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import {MatCardModule} from '@angular/material/card';

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
import { DragulaModule } from 'ng2-dragula';
import { ToasterModule } from 'angular2-toaster';
@NgModule({
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,MatFormFieldModule,MatStepperModule,MatCardModule, MatGridListModule, MatListModule
    , MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule, MatNativeDateModule,
    MatCheckboxModule,
    DragulaModule,
    ToasterModule
  ],
  declarations: [DistributedRuleComponent],
  exports: [DistributedRuleComponent]
})
export class DistributedRuleModule { }

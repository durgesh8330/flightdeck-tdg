import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileListComponent} from './profile-list.component';
import {
  MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule, MatButtonModule,
  MatSlideToggleModule, MatProgressSpinnerModule, MatTabsModule, MatTableModule, MatSortModule, MatPaginatorModule,
  MatDatepickerModule, MatCheckboxModule, MatRadioModule, MatDividerModule, MatSnackBarModule, MatExpansionModule,
  MatDialogModule
} from '@angular/material';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { UiDatepickerDirective } from '@app/shared/forms/input/ui-datepicker.directive';
import {SmartadminInputModule} from "@app/shared/forms/input/smartadmin-input.module";
import { NgSelect2Module } from 'ng-select2';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    NgSelect2Module,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatRadioModule,
    MatDividerModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatDialogModule,
    SmartadminInputModule
  ],
  declarations: []
})
export class ProfileListModule { }

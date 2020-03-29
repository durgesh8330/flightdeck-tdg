import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { R2DGTaskRoutingModule } from './r2dg-task-routing.module';
import { R2DGTaskComponent } from './r2dg-task.component';
import {
  MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule, MatButtonModule,
  MatSlideToggleModule, MatProgressSpinnerModule, MatTabsModule, MatTableModule, MatSortModule, MatPaginatorModule,
  MatDatepickerModule, MatCheckboxModule, MatRadioModule, MatDividerModule, MatSnackBarModule, MatExpansionModule,
  MatDialogModule
} from '@angular/material';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import {SmartadminInputModule} from "@app/shared/forms/input/smartadmin-input.module";
import { NgSelect2Module } from 'ng-select2';
import { R2dgSearchComponent } from './r2dg-search/r2dg-search.component';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    R2DGTaskRoutingModule,
    SharedModule,
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
    SmartadminInputModule,
    NgSelect2Module
  ],
  declarations: [R2DGTaskComponent, R2dgSearchComponent],
  exports: [R2DGTaskComponent]
})
export class R2DGTaskModule { }

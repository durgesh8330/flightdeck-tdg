import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UniSprRoutingModule } from './uni-spr-routing.module';
import { UniSprComponent } from './uni-spr.component';
import { FormsModule } from '@angular/forms';
import {
  MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule, MatButtonModule,
  MatSlideToggleModule, MatProgressSpinnerModule, MatTabsModule, MatTableModule, MatSortModule, MatPaginatorModule,
  MatDatepickerModule, MatCheckboxModule, MatRadioModule, MatDividerModule, MatSnackBarModule, MatExpansionModule,
  MatDialogModule
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    UniSprRoutingModule,
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
    MatDialogModule
  ],
  declarations: [UniSprComponent]
})
export class UniSprModule { }

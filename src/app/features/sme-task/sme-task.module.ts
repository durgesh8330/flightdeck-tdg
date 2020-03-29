import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchSmeComponent } from './search-sme/search-sme.component';
import {
  MatCardModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
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
  MAT_DATE_LOCALE
} from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AngularSplitModule } from 'angular-split';
import { SharedModule } from '@app/shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { NgSelect2Module } from 'ng-select2';
import { PaginationModule } from 'ngx-bootstrap';
import { AutosizeModule } from 'ngx-autosize';
import { NgMasonryGridModule } from 'ng-masonry-grid';
import { ChartsModule } from 'ng2-charts';

import { SmeTaskComponent } from './sme-task/sme-task.component';
import { SmetaskAddCommentDialogComponent } from './smetask-add-comment-dialog/smetask-add-comment-dialog.component';
import { FlotChartModule } from "@app/shared/graphs/flot-chart/flot-chart.module";
import { MorrisGraphModule } from "@app/shared/graphs/morris-graph/morris-graph.module";
import { SmeTaskAssignComponent } from './sme-task-assign/sme-task-assign.component';


@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
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
    AngularSplitModule,
    NgxDatatableModule,
    SelectDropDownModule,
    SmartadminInputModule,
    NgSelect2Module,
    AutosizeModule,
    NgMasonryGridModule,
    FlotChartModule,
    MorrisGraphModule,
    PaginationModule.forRoot(),
    ChartsModule
  ],
  declarations: [
    SearchSmeComponent,
    SmeTaskComponent,
    SmetaskAddCommentDialogComponent,
    SmeTaskAssignComponent
  ],
  entryComponents: [
    SmeTaskComponent,
    SmetaskAddCommentDialogComponent,
    SmeTaskAssignComponent
  ]
})
export class SmeTaskModule { }

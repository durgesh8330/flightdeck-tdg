import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {AngularSplitModule} from 'angular-split';
import {SharedModule} from '@app/shared/shared.module';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {SelectDropDownModule} from 'ngx-select-dropdown';
import {SmartadminInputModule} from '@app/shared/forms/input/smartadmin-input.module';
import {NgSelect2Module} from 'ng-select2';
import {PaginationModule} from 'ngx-bootstrap';
import {AutosizeModule} from 'ngx-autosize';
import { NgMasonryGridModule } from 'ng-masonry-grid';

import { WorkgroupTaskComponent } from './workgroup-task/workgroup-task.component';
import { DataStorageService } from './data-storage.service';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { MyTaskComponent } from './my-task/my-task.component';
import { TaskService } from '../task/task.service';

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
    PaginationModule.forRoot()
  ],
  declarations: [
    WorkgroupTaskComponent,
    TaskDetailsComponent,
    MyTaskComponent
  ],
  exports: [WorkgroupTaskComponent],
  providers: [
		TaskService, 
		DataStorageService
  ],
  entryComponents: [
    WorkgroupTaskComponent,
    TaskDetailsComponent,
    MyTaskComponent
  ]
})
export class LmosModule { }

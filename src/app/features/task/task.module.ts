import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  TaskDetailsComponent,
  ActivityLogDialog
} from './task-details/task-details.component';
import {SearchTaskComponent} from './search-task/search-task.component';
import {SearchResultComponent} from '@app/features/task/search-result/search-result.component';
import {TaskService} from './task.service';
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
  MAT_DATE_LOCALE,
  MatChipsModule
} from '@angular/material';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {TaskResultsComponent} from './task-results/task-results.component';
import {DataStorageService} from './data-storage.service';
import {AngularSplitModule} from 'angular-split';
import {SharedModule} from '@app/shared/shared.module';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {TaskRoutingModule} from './task-routing.module';
import {SelectDropDownModule} from 'ngx-select-dropdown';
import {SmartadminInputModule} from '@app/shared/forms/input/smartadmin-input.module';
import {NgSelect2Module} from 'ng-select2';
import {MyTaskComponent} from './my-task/my-task.component';
import {PaginationModule} from 'ngx-bootstrap';
import {MyWorkgroupTaskComponent} from './my-workgroup-task/my-workgroup-task.component';
import { SPRTaskComponent } from './sprtask/sprtask.component';
import { SprtaskdialogComponent } from './sprtask/sprtaskdialog/sprtaskdialog.component';
import { SprtaskcanceldialogComponent } from './sprtask/sprtaskcanceldialog/sprtaskcanceldialog.component';
import {AutosizeModule} from 'ngx-autosize';
import { NgMasonryGridModule } from 'ng-masonry-grid';
import { ChartsModule } from 'ng2-charts';
import { SmeTaskAssignComponent } from './sme-task-assign/sme-task-assign.component';
import { SmetaskAddCommentDialogComponent } from './smetask-add-comment-dialog/smetask-add-comment-dialog.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ConfDialogComponent } from './conf-dialog/conf-dialog.component';
import { TimezonePickerModule } from 'ng2-timezone-selector';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import {SmartadminWidgetsModule} from "../../shared/widgets/smartadmin-widgets.module";
import {ProfileModule} from '../profile/profile.module';


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
    TaskRoutingModule,
    SelectDropDownModule,
    SmartadminInputModule,
    NgSelect2Module,
    AutosizeModule,
    NgMasonryGridModule,
    PaginationModule.forRoot(),
    ChartsModule,
    MatChipsModule,
    ModalModule.forRoot(),
    TimezonePickerModule,
    OwlDateTimeModule, 
    OwlNativeDateTimeModule,
    SmartadminWidgetsModule,
    ProfileModule
  ],
  declarations: [TaskDetailsComponent, SearchTaskComponent, TaskResultsComponent,
		SearchResultComponent, ActivityLogDialog,
    MyTaskComponent,
    MyWorkgroupTaskComponent,
    SPRTaskComponent,
    SprtaskdialogComponent,
    SprtaskcanceldialogComponent,
    SmeTaskAssignComponent,
    SmetaskAddCommentDialogComponent,
    ConfDialogComponent
  ],
  exports: [TaskDetailsComponent, SearchTaskComponent, SearchResultComponent],
  providers: [
		TaskService, 
		DataStorageService
  ],
  entryComponents: [
    SmeTaskAssignComponent,
    SmetaskAddCommentDialogComponent,
    ConfDialogComponent
  ]
})
export class TaskModule { }

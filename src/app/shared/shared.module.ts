import { NgModule, ModuleWithProviders, NO_ERRORS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { SmartadminLayoutModule } from "./layout";
import { ChartJsModule } from "./graphs/chart-js/chart-js.module"
import {I18nModule} from "./i18n/i18n.module";
import { UserModule } from "./user/user.module";
import { BootstrapModule } from "@app/shared/bootstrap.module";
import {VoiceControlModule} from "./voice-control/voice-control.module";

import {SmartadminWidgetsModule} from "./widgets/smartadmin-widgets.module";

import {UtilsModule} from "./utils/utils.module";
import {PipesModule} from "./pipes/pipes.module";
import {ChatModule} from "./chat/chat.module";
import {StatsModule} from "./stats/stats.module";
import {InlineGraphsModule} from "./graphs/inline/inline-graphs.module";
import {SmartadminFormsLiteModule} from "./forms/smartadmin-forms-lite.module";
import {SmartProgressbarModule} from "./ui/smart-progressbar/smart-progressbar.module";
import { CalendarComponentsModule } from "@app/shared/calendar/calendar-components.module";
import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';
import { SmartadminWizardsModule } from '@app/shared/forms/wizards/smartadmin-wizards.module';
import { TableComponent } from '@app/shared/table/table.component';
import { AlertComponent } from '@app/shared/alert/alert.component';
import { PaginationModule, BsDatepickerModule } from 'ngx-bootstrap';
import { ModalComponent } from './modal/modal.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { OnOffSwitchModule } from './forms/input/on-off-switch/on-off-switch.module';
import { OrderModule } from 'ngx-order-pipe';
import { QueryHistoryDetailsComponent} from '@app/features/query-history-details/query-history-details.component';

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
  MatAutocompleteModule,
  MatDialogModule
} from '@angular/material';
//import { TextareaAutosizeModule } from 'ngx-textarea-autosize';
import {AutosizeModule} from 'ngx-autosize';
import { BoxedLayoutComponent } from './boxed-layout/boxed-layout.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {NgSelect2Module} from 'ng-select2';
import { SmartadminFormsModule } from './forms/smartadmin-forms.module';
import { CardComponent } from './card/card.component';
import { LoaderComponent } from './loader/loader.component';
import { ParamasLayoutComponent } from './paramas-layout/paramas-layout.component';
import { PagerService } from "./table/pager.service";
import { pipe } from "rxjs";
import { SearchLayoutComponent } from "./search-layout/search-layout.component";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    PaginationModule,
    BsDropdownModule,
    //TextareaAutosizeModule,
    AutosizeModule,
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
    MatAutocompleteModule,
    MatDialogModule,
    SmartadminLayoutModule,
    BootstrapModule,
    NgSelect2Module,
    OnOffSwitchModule,
    OrderModule,
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    OwlDateTimeModule, 
    OwlNativeDateTimeModule
  ],
  declarations: [
    TableComponent,
    AlertComponent,
    BoxedLayoutComponent,
    SearchLayoutComponent,
    ModalComponent,
    NotFoundComponent,
    CardComponent,
    LoaderComponent,
    ParamasLayoutComponent
  ],
  exports: [
    AlertComponent,
    TableComponent,
    ModalComponent,
    NotFoundComponent,
    CommonModule,
    FormsModule,
    RouterModule,
    BoxedLayoutComponent,
    SearchLayoutComponent,
    CardComponent,
    LoaderComponent,
    ParamasLayoutComponent,
    

    UserModule,
    SmartadminLayoutModule,
    BootstrapModule,

    I18nModule,

    UtilsModule,
    PipesModule,

    SmartadminFormsLiteModule,
    SmartadminFormsModule,

    SmartProgressbarModule,

    InlineGraphsModule,

    SmartadminWidgetsModule,
    SmartadminDatatableModule,
    SmartadminWizardsModule,

    ChatModule,

    StatsModule,

    VoiceControlModule,

    CalendarComponentsModule,
    
    ChartJsModule,
    OnOffSwitchModule
  ],
  providers: [
    PagerService
  ],
  entryComponents:[LoaderComponent],
  schemas:[NO_ERRORS_SCHEMA]
})
export class SharedModule {}

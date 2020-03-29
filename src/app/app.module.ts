import { ActivityLogService } from './features/activity-log/activity-log.service';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER, Injectable, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { NGXLogger } from 'ngx-logger';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TabService } from './core/tab/tab-service';
import {
  MatIconModule, MatInputModule, MatSelectModule, MatProgressSpinnerModule,
  MatCardModule, MatButtonModule, MatSlideToggleModule, MatTabsModule, MatTableModule,
  MatSortModule, MatPaginatorModule, MatDatepickerModule, MatCheckboxModule, MatRadioModule, MatStepperModule
} from '@angular/material';
import {CdkTableModule} from '@angular/cdk/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { TextareaAutosizeModule } from 'ngx-textarea-autosize';
import { SearchTaskComponent } from './features/task/search-task/search-task.component';
import { TaskDetailsComponent, ActivityLogDialog } from './features/task/task-details/task-details.component';
import { TaskModule } from "@app/features/task/task.module";
import { AnalyticsModule } from "@app/features/dashboard/analytics/analytics.module";
import { SearchResultComponent } from '@app/features/task/search-result/search-result.component';
import { WorkmateTaskModule } from '@app/features/asri-task/workmate-task.module';
import { WorkmateTaskComponent, DialogOverviewExampleDialog, DialogOverviewSectionDialog } from '@app/features/asri-task/workmate-task.component';
import { AppService } from './app.service';
import { AuthInterceptor } from './auth/auth.interceptor.service';
import { AnalyticsComponent } from '@app/features/dashboard/analytics/analytics.component';
import { AnalyticsComponentV2 } from '@app/features/dashboard/analytics/analyticsV2.component';
import { SessionExpirationAlertService } from './core/session-expiration-alert/session-expiration-alert.service';
import { SessionExpirationAlertComponent } from './core/session-expiration-alert/session-expiration-alert.component';
import { SessionExpiredAlertComponent } from './core/session-expiration-alert/session-expired-alert.component';
import { UniSprComponent } from '@app/features/uni-spr/uni-spr.component';
import { UniSprModule } from '@app/features/uni-spr/uni-spr.module';
import { EvcModule } from '@app/features/evc/evc.module';
import { EvcComponent } from '@app/features/evc/evc.component';
import { ProfileModule } from "@app/features/profile/profile.module";
import { ProfileInfoComponent } from '@app/features/profile/profile-info/profile-info.component';
import { UserProfileModule } from './features/user-profile/user-profile.module';
import { NgSelect2Module } from 'ng-select2';
import { ThemeBuilderModule } from './features/user-profile/theme-builder/theme-builder.module';
import { ThemeBuilderComponent } from './features/user-profile/theme-builder/theme-builder.component';
import { ManageUserModule } from './features/user-profile/manage-user/manage-user.module';
import { ManageUserComponent } from './features/user-profile/manage-user/manage-user.component';
import { SystemParametersComponent } from '@app/features/user-profile/system-parameters/system-parameters.component';
import { SystemParametersDetailsComponent } from '@app/features/user-profile/system-parameters-details/system-parameters-details.component';
import { environment } from '../environments/environment';
import { UiElementsModule } from './features/ui-elements/ui-elements.module';
import { SPRTaskComponent } from './features/task/sprtask/sprtask.component';
import { SprtaskdialogComponent } from './features/task/sprtask/sprtaskdialog/sprtaskdialog.component';
import { SprtaskcanceldialogComponent } from './features/task/sprtask/sprtaskcanceldialog/sprtaskcanceldialog.component';
import { ModalComponent } from "@app/shared/modal/modal.component";
import { AutosizeModule } from 'ngx-autosize';
import { NotFoundComponent } from '@app/shared/not-found/not-found.component';
import { SearchSmeComponent } from './features/sme-task/search-sme/search-sme.component';
import { SmeTaskModule } from '@app/features/sme-task/sme-task.module';
import { LmosModule } from '@app/features/lmos/lmos.module';
import { RuleEngineComponent } from './features/user-profile/rule-engine/rule-engine.component';
import { RuleEngineModule } from './features/user-profile/rule-engine/rule-engine.module';
import { RuleInputCreateComponent } from './features/user-profile/rule-engine/rule/rule-input/rule-input-create/rule-input-create.component';
import { RuleInputEditComponent } from './features/user-profile/rule-engine/rule/rule-input/rule-input-edit/rule-input-edit.component';
import { RuleCreateComponent } from './features/user-profile/rule-engine/rule/rule-create/rule-create.component';
import { RuleInputEditModule } from './features/user-profile/rule-engine/rule/rule-input/rule-input-edit/rule-input-edit.module';
import { RuleInputCreateModule } from './features/user-profile/rule-engine/rule/rule-input/rule-input-create/rule-input-create.module';
import { RuleCreateModule } from './features/user-profile/rule-engine/rule/rule-create/rule-create.module';
import { RuleEditComponent } from './features/user-profile/rule-engine/rule/rule-edit/rule-edit.component';
import { RuleImportComponent } from './features/user-profile/rule-engine/rule/rule-import/rule-import.component';
import { RuleEditModule } from './features/user-profile/rule-engine/rule/rule-edit/rule-edit.module';
import { RuleImportModule } from './features/user-profile/rule-engine/rule/rule-import/rule-import.module';
import { PageContentComponent } from './core/page-content/page-content.component';
import { DistributedRuleComponent } from './features/user-profile/rule-engine/rule/distributed-rule/distributed-rule-component';
import { DistributedRuleModule } from './features/user-profile/rule-engine/rule/distributed-rule/distributed-rule.module';
import { RuleInputSearchComponent } from './features/user-profile/rule-engine/rule/rule-input/rule-input-edit/rule-input-search.component';
import { ConfirmationDialogComponent } from './features/user-profile/rule-engine/shared/confirmation-dialog/confirmation-dialog.component';
import { RuleService } from './features/user-profile/rule-engine/rule/rule.service';
import { ToasterModule } from 'angular2-toaster';
import { RuleCreateEditComponent } from './features/user-profile/rule-engine/rule/rule-edit/rule-create-edit.component';
import { ManageNotificationComponent } from './features/user-profile/manage-notification/manage-notification.component';
import { ManageWorkgroupComponent } from './features/user-profile/manage-workgroup/manage-workgroup.component';
import { ManageWorkgroupNotificationComponent } from './features/user-profile/manage-workgroup-notification/manage-workgroup-notification.component';
import { ParamasLayoutComponent } from './shared/paramas-layout/paramas-layout.component';
import { R2DGTaskModule } from './features/r2dg-automation/r2dg-task.module';
import { R2DGTaskComponent } from './features/r2dg-automation/r2dg-task.component';
import { R2dgSearchComponent } from "./features/r2dg-automation/r2dg-search/r2dg-search.component";
import { LocalDateTimeService } from '@app/core/services/local-date-time.service.ts';
import { QueryHistoryDetailsModule} from './features/query-history-details/query-history-details.module';
import { QueryHistoryDetailsComponent } from './features/query-history-details/query-history-details.component';

@Injectable()
export class AppConfigService {
  private appConfig;

  constructor(private http: HttpClient) { }

  loadAppConfig() {

    if (document.URL.indexOf('dev1') > -1) {
      environment.apiUrl = environment.smartadmin.apiDev1Url;
      environment.swiftOrderBrokerUrl = environment.swiftOrderBrokerUrls.dev1;
    } else if (document.URL.indexOf('test4') > -1) {
      environment.apiUrl = environment.smartadmin.apiTest4Url;
      environment.swiftOrderBrokerUrl = environment.swiftOrderBrokerUrls.test4;
    } else if (document.URL.indexOf('test3') > -1) {
      environment.apiUrl = environment.smartadmin.apiTest3Url;
      environment.swiftOrderBrokerUrl = environment.swiftOrderBrokerUrls.test3;
    } else if (document.URL.indexOf('test2') > -1) {
      environment.apiUrl = environment.smartadmin.apiTest2Url;
      environment.swiftOrderBrokerUrl = environment.swiftOrderBrokerUrls.test2;
    } else if (document.URL.indexOf('test1') > -1) {
      environment.apiUrl = environment.smartadmin.apiTest1Url;
      environment.swiftOrderBrokerUrl = environment.swiftOrderBrokerUrls.test1;
    } else if (document.URL.indexOf('prod') > -1) {
      environment.apiUrl = environment.smartadmin.apiProdUrl;
      environment.swiftOrderBrokerUrl = environment.swiftOrderBrokerUrls.prod;
    } else {
       environment.apiUrl = environment.smartadmin.apiDev2Url;
      environment.swiftOrderBrokerUrl = environment.swiftOrderBrokerUrls.dev2;
      // environment.apiUrl = environment.smartadmin.apiTest4Url;
      // environment.apiUrl = environment.smartadmin.apiProdUrl;
      // environment.apiUrl = environment.smartadmin.apiTest2Url;
      // environment.apiUrl = environment.smartadmin.apiTest1Url;
    }
  }
  getConfig() {
    return this.appConfig;
  }
}
export const appInitializerFn = (config: AppConfigService) => {
  return () => {
    return config.loadAppConfig();
  };
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    SharedModule,
    CoreModule,
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
    MatStepperModule,
    CdkTableModule,
    //TextareaAutosizeModule,
    AnalyticsModule,
    TaskModule,
    ProfileModule,
    WorkmateTaskModule,
    UniSprModule,
    EvcModule,
    UserProfileModule,
    NgSelect2Module,
    ThemeBuilderModule,
    ManageUserModule,
    UiElementsModule,
    AutosizeModule,
    SmeTaskModule,
    LmosModule,
    RuleEngineModule,
    RuleInputCreateModule,
    RuleInputEditModule,
    DistributedRuleModule,
    QueryHistoryDetailsModule,
    //  **** here for logger, here you can set levels according to environment
    LoggerModule.forRoot({
      level: environment.production ? NgxLoggerLevel.LOG :
        environment.production ? NgxLoggerLevel.INFO : NgxLoggerLevel.DEBUG,
      serverLogLevel: NgxLoggerLevel.OFF
    }),
    RuleCreateModule,
    RuleEditModule,
    RuleImportModule,
    DistributedRuleModule,
    R2DGTaskModule,
    ToasterModule.forRoot()

  ],
  providers: [TabService, AppService, AuthInterceptor, SessionExpirationAlertService,
    ActivityLogService,
    AppConfigService,LocalDateTimeService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {
      provide: APP_INITIALIZER, useFactory: appInitializerFn, multi: true, deps: [AppConfigService]
    }],
  bootstrap: [AppComponent],
  entryComponents: [AnalyticsComponent, AnalyticsComponentV2, ManageUserComponent, SearchTaskComponent, TaskDetailsComponent, SearchResultComponent, NotFoundComponent,
    WorkmateTaskComponent, DialogOverviewExampleDialog, DialogOverviewSectionDialog, ActivityLogDialog, SessionExpirationAlertComponent,
    SessionExpiredAlertComponent, UniSprComponent, EvcComponent, ProfileInfoComponent, ThemeBuilderComponent, SystemParametersComponent, ManageNotificationComponent, ManageWorkgroupNotificationComponent, SystemParametersDetailsComponent, SPRTaskComponent, SprtaskdialogComponent, SprtaskcanceldialogComponent, ModalComponent,
    SearchSmeComponent, RuleEngineComponent, RuleInputCreateComponent, RuleInputEditComponent, RuleCreateComponent, RuleEditComponent, RuleImportComponent
    , RuleEngineComponent, RuleInputCreateComponent, RuleInputEditComponent, PageContentComponent,
    DistributedRuleComponent, RuleInputSearchComponent, ConfirmationDialogComponent,
    RuleCreateEditComponent, ParamasLayoutComponent, R2DGTaskComponent,QueryHistoryDetailsComponent, R2dgSearchComponent
  ],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
  constructor(private logger: NGXLogger) {
    this.showEnvironment();
  }

  showEnvironment() {
    this.logger.warn('Environment : ' + environment.envName);
  }

}

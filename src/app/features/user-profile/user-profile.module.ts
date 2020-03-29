// import { CreateWorkgroupModalComponent } from './manage-workgroup/create-workgroup-modal/create-workgroup-modal.component';
// import { ManageWorkgroupComponent } from './manage-workgroup/manage-workgroup.component';
// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { AdministrationComponent } from './administration/administration.component';
// import { SharedModule } from '@app/shared/shared.module';
// import { UserProfileService } from './user-profile.service';
// import { ManageApplicationComponent } from './manage-application/manage-application.component';
// import { CreateApplicationModalComponent } from './manage-application/create-application-modal/create-application-modal.component';
// import { ManageSkillComponent } from './manage-skill/manage-skill.component';
// @NgModule({
//   imports: [
//     CommonModule,
//     SharedModule
//   ],
//   declarations: [ManageSkillComponent,ManageWorkgroupComponent, AdministrationComponent, CreateWorkgroupModalComponent,
//     ManageApplicationComponent, CreateApplicationModalComponent],
//   entryComponents: [ManageWorkgroupComponent, AdministrationComponent, CreateWorkgroupModalComponent,
//     ManageApplicationComponent, CreateApplicationModalComponent],
//   providers: [UserProfileService]

// })
// export class UserProfileModule { }
import { CreateWorkgroupModalComponent } from './manage-workgroup/create-workgroup-modal/create-workgroup-modal.component';
import { ManageWorkgroupComponent } from './manage-workgroup/manage-workgroup.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdministrationComponent } from './administration/administration.component';
import { SharedModule } from '@app/shared/shared.module';
import { UserProfileService } from './user-profile.service';
import { ManageApplicationComponent } from './manage-application/manage-application.component';
import { CreateApplicationModalComponent } from './manage-application/create-application-modal/create-application-modal.component';
import { ManageSkillComponent } from './manage-skill/manage-skill.component';
import { CreateSkillModalComponent } from './manage-skill/create-skill-modal/create-skill-modal.component';
import { CreateRoleModalComponent } from './manage-workgroup/create-role-modal/create-role-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddAttributeDialog } from './manage-workgroup/add-attribute-modal/add-attribute-modal.component';
import { ManageWorkgroupParameters } from './manage-workgroup/manage-workgroup-params.component';
import { NgSelect2Module } from 'ng-select2';
import { SystemParametersComponent } from '@app/features/user-profile/system-parameters/system-parameters.component';
import { SystemParametersDetailsComponent } from '@app/features/user-profile/system-parameters-details/system-parameters-details.component';
import { PaginationModule } from 'ngx-bootstrap';
import { SharedService } from './shared/shared.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { RuleEngineModule } from './rule-engine/rule-engine.module';
import { ManageNotificationComponent } from './manage-notification/manage-notification.component';
import { ManageWorkgroupNotificationComponent } from './manage-workgroup-notification/manage-workgroup-notification.component';
import { TaskTypeManagementComponent } from './task-type-management/task-type-management.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    PaginationModule.forRoot(),
    BsDropdownModule.forRoot(),
    NgSelect2Module,
    RuleEngineModule
  ],
  declarations: [ManageWorkgroupComponent, AdministrationComponent, CreateWorkgroupModalComponent,
    ManageApplicationComponent, CreateApplicationModalComponent, ManageSkillComponent, CreateSkillModalComponent, CreateRoleModalComponent, SystemParametersComponent, SystemParametersDetailsComponent, AddAttributeDialog, ManageWorkgroupParameters, ManageNotificationComponent, ManageWorkgroupNotificationComponent, TaskTypeManagementComponent],
  entryComponents:[ManageWorkgroupComponent, AdministrationComponent, CreateWorkgroupModalComponent,CreateRoleModalComponent,
    ManageApplicationComponent, CreateApplicationModalComponent, ManageSkillComponent, CreateSkillModalComponent, AddAttributeDialog],
  providers: [UserProfileService, SharedService]

})
export class UserProfileModule { }

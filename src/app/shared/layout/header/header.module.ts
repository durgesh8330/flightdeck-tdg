import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {NgModule} from "@angular/core";

import {PopoverModule} from "ngx-popover";

import {CollapseMenuComponent} from "./collapse-menu/collapse-menu.component";
import {RecentProjectsComponent} from "./recent-projects/recent-projects.component";
import {FullScreenComponent} from "./full-screen/full-screen.component";

import {ActivitiesComponent} from "./activities/activities.component";
import {ActivitiesMessageComponent} from "./activities/activities-message/activities-message.component";
import {ActivitiesNotificationComponent} from "./activities/activities-notification/activities-notification.component";
import {ActivitiesTaskComponent} from "./activities/activities-task/activities-task.component";
import {HeaderComponent} from "./header.component";

import {UtilsModule} from "@app/shared/utils/utils.module";
import {PipesModule} from "@app/shared/pipes/pipes.module";
import {I18nModule} from "@app/shared/i18n/i18n.module";
import {UserModule} from "@app/shared/user/user.module";
import {VoiceControlModule} from "@app/shared/voice-control/voice-control.module";
import {BsDropdownModule} from "ngx-bootstrap";

import {MatSelectModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, MatAutocompleteModule } from '@angular/material';
import {EmitterService} from "@app/features/home/emitter.service";
import {UiDatepickerDirective} from "@app/shared/forms/input/ui-datepicker.directive";
import {SmartadminInputModule} from "@app/shared/forms/input/smartadmin-input.module";
import { NgSelect2Module } from "ng-select2";
import { ProfileMenuComponent } from './profile-menu/profile-menu.component';
import { RouterModule } from "@angular/router";

@NgModule({
  imports: [
    CommonModule,

    RouterModule,
    FormsModule,

    VoiceControlModule,

    BsDropdownModule,
    MatSelectModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule,
    UtilsModule,PipesModule, I18nModule, UserModule, PopoverModule, SmartadminInputModule, NgSelect2Module,
    MatAutocompleteModule
  ],
  declarations: [
    ActivitiesMessageComponent,
    ActivitiesNotificationComponent,
    ActivitiesTaskComponent,
    RecentProjectsComponent,
    FullScreenComponent,
    CollapseMenuComponent,
    ActivitiesComponent,
    HeaderComponent,
    ProfileMenuComponent],
  exports: [
    HeaderComponent
  ]
})
export class HeaderModule{}

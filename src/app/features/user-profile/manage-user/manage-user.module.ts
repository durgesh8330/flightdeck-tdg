import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageUserComponent } from './manage-user.component';
import { ManageUserRoutingModule } from './manage-user-routing.module';
import {
  MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule, MatButtonModule,
  MatSlideToggleModule, MatProgressSpinnerModule, MatTabsModule, MatTableModule, MatSortModule, MatPaginatorModule,
  MatDatepickerModule, MatCheckboxModule, MatRadioModule, MatDividerModule, MatSnackBarModule, MatExpansionModule,
  MatDialogModule
} from '@angular/material';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import {SmartadminInputModule} from "@app/shared/forms/input/smartadmin-input.module";
import { NgSelect2Module } from 'ng-select2';
import { ThemeBuilderModule } from '../../user-profile/theme-builder/theme-builder.module';
import { SmartadminWizardsModule } from '@app/shared/forms/wizards/smartadmin-wizards.module';

import {
  ModalModule,
  ButtonsModule,
  TooltipModule,
  BsDropdownModule,
  ProgressbarModule,
  AlertModule,
  TabsModule,
  AccordionModule,
  CarouselModule
} from "ngx-bootstrap";

import { FuelUxWizardWidgetComponent } from '../../forms/wizards/fuel-ux-wizard-widget/fuel-ux-wizard-widget.component';
import { BasicWizardWidgetComponent } from '../../forms/wizards/basic-wizard-widget/basic-wizard-widget.component';
import { UserWizardComponent } from './user-wizard.component';
import { UserDuallistboxComponent } from './user-duallistbox/user-duallistbox.component';
import { ProfileModule } from '../../profile/profile.module';
import { ProfileInfoComponent } from '@app/features/profile/profile-info/profile-info.component';

@NgModule({
  imports: [
    ModalModule,
  ButtonsModule,
  TooltipModule,
  BsDropdownModule,
  ProgressbarModule,
  AlertModule,
  TabsModule,
  AccordionModule,
  CarouselModule,
    FormsModule,
    ManageUserRoutingModule,
    CommonModule,
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
    NgSelect2Module,
    ThemeBuilderModule,
    SmartadminWizardsModule,
    ProfileModule
  ],
  declarations: [ManageUserComponent,UserDuallistboxComponent, UserWizardComponent, UserWizardComponent, UserDuallistboxComponent]
})
export class ManageUserModule { }

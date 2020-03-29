import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileInfoComponent } from './profile-info/profile-info.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileListComponent } from '../profile-list/profile-list.component';
import { ProfileListModule } from '../profile-list/profile-list.module';
import {
  MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule, MatButtonModule,
  MatSlideToggleModule, MatProgressSpinnerModule, MatTabsModule, MatTableModule, MatSortModule, MatPaginatorModule,
  MatDatepickerModule, MatCheckboxModule, MatRadioModule, MatDividerModule, MatSnackBarModule, MatExpansionModule,
  MatDialogModule
} from '@angular/material';

import { FormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { SmartadminInputModule } from "@app/shared/forms/input/smartadmin-input.module";
import { NgSelect2Module } from 'ng-select2';
import { ThemeBuilderModule } from '../user-profile/theme-builder/theme-builder.module';
import { PaginationModule } from 'ngx-bootstrap';
import { OnlyNumberDirective } from './only-number.directive';
//import { ParamasLayoutComponent } from '../../shared/paramas-layout/paramas-layout.component';

@NgModule({
  imports: [
    CommonModule,
    ProfileRoutingModule,
    ProfileListModule,
    FormsModule,
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
    PaginationModule.forRoot()
  ],
  declarations: [ProfileInfoComponent, ProfileListComponent, OnlyNumberDirective],
  exports: [ProfileListComponent, ProfileInfoComponent]
})
export class ProfileModule { }

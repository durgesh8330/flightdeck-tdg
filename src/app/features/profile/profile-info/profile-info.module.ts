import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileInfoComponent } from './profile-info.component';
import { NgSelect2Module } from 'ng-select2';

@NgModule({
  imports: [
    CommonModule,
    NgSelect2Module
  ],
  declarations: []
})
export class ProfileInfoModule { }

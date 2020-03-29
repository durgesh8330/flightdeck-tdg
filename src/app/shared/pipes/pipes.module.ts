import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldFilterPipe } from './field-filter.pipe';
import { MomentPipe } from './moment.pipe';
import {KeysPipe} from "@app/shared/pipes/keys.pipe";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [FieldFilterPipe, MomentPipe, KeysPipe],
  exports: [FieldFilterPipe, MomentPipe, KeysPipe]
})
export class PipesModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeBuilderComponent } from './theme-builder.component';
import { FormsModule } from '@angular/forms';
import {SharedModule} from "@app/shared/shared.module";
import { ColorPickerModule } from 'ngx-color-picker';
import { ThemeDefaultStyle, ThemeMatch } from './theme.model';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ColorPickerModule
  ],
  declarations: [ThemeBuilderComponent],
  providers: [ThemeDefaultStyle, ThemeMatch],
  exports: [ThemeBuilderComponent]
})
export class ThemeBuilderModule { }

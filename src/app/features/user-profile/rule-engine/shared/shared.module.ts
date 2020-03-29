import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DroolsCreateRuleComponent } from './drools-create-rule/drools-create-rule.component';
import { FormsModule } from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [DroolsCreateRuleComponent],
  exports: [DroolsCreateRuleComponent]
})
export class SharedModule { }
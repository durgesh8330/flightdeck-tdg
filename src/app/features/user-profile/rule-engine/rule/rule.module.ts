import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RuleRoutingModule } from './rule-routing.module';
import { RuleComponent } from './rule.component';
import { RuleInputModule } from './rule-input/rule-input.module';
import { SharedModule} from '../shared/shared.module';
@NgModule({
  imports: [
    CommonModule,
    RuleRoutingModule
  ],
  declarations: [RuleComponent],
  exports: [RuleComponent]
})
export class RuleModule { }

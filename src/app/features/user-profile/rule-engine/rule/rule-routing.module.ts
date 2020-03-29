import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RuleComponent } from './rule.component';

const routes: Routes = [
  {
    path: '',
    component: RuleComponent,
    children: [
     
      {
        path: 'create',
        loadChildren: './rule-create/rule-create.module#RuleCreateModule'
      },
      {
        path: 'update',
        loadChildren: './rule-edit/rule-edit.module#RuleEditModule'
      },
      {
        path: 'rule-input',
        loadChildren: './rule-input/rule-input.module#RuleInputModule'
      },
      {
        path: 'import',
        loadChildren: './rule-import/rule-import.module#RuleImportModule'
      },
      {
        path: 'distributed',
        loadChildren: './distributed-rule/distributed-rule.module#DistributedRuleModule'
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RuleRoutingModule { }

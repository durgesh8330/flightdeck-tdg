import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RuleInputComponent } from './rule-input.component';

const routes: Routes = [
  {
    path: '',
    component: RuleInputComponent,
    children: [
     
      {
        path: 'create',
        loadChildren: './rule-input-create/rule-input-create.module#RuleInputCreateModule'
      },
      {
        path: 'update',
        loadChildren: './rule-input-edit/rule-input-edit.module#RuleInputEditModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RuleInputRoutingModule { }

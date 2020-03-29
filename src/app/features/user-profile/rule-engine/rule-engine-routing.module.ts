import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RuleEngineComponent } from './rule-engine.component';

export const routes: Routes = [
  {
    path: "",
    component: RuleEngineComponent,
    // data: { pageTitle: "Rule Engine" },
    children: [
      {
        path: "rule",
        loadChildren : './rule/rule.module#RuleModule',
        data: { pageTitle: "Rule" }
      }
      // {
      //   path: "create-rule-input",
      //   component : RuleInputCreateComponent,
      //   data: { pageTitle: "Rule Input Create" }
      // },
      // {
      //   path: "update-rule-input",
      //   component : RuleInputUpdateComponent,
      //   data: { pageTitle: "Rule Input Update" }
      // },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RuleEngineRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RuleCreateComponent } from './rule-create.component';

const routes: Routes = [
  {
      path: '',
      component : RuleCreateComponent,
      data: { pageTitle: "Rule Create" },
      pathMatch : 'full'
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RuleCreateRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RuleInputCreateComponent } from './rule-input-create.component';

const routes: Routes = [
  {
      path: '',
      component : RuleInputCreateComponent,
      data: { pageTitle: "Rule Input Create" },
      pathMatch : 'full'
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RuleInputCreateRoutingModule { }

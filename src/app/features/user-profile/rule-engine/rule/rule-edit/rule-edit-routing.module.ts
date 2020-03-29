import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RuleEditComponent } from './rule-edit.component';

const routes: Routes = [
  {
      path: '',
      component : RuleEditComponent,
      data: { pageTitle: "Rule Edit" },
      pathMatch : 'full'
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RuleEditRoutingModule { }

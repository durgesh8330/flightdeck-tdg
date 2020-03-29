import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RuleInputEditComponent } from './rule-input-edit.component';
import { RuleInputSearchComponent } from './rule-input-search.component';

const routes: Routes = [
  {
      path: '',
      component : RuleInputSearchComponent,
      data: { pageTitle: "Rule Input Create" },
      pathMatch : 'full'
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RuleInputEditRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RuleImportComponent } from './rule-import.component';

const routes: Routes = [
  {
      path: '',
      component : RuleImportComponent,
      pathMatch : 'full'
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RuleImportRoutingModule { }

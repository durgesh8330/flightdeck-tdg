import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DistributedRuleComponent } from './distributed-rule-component';

const routes: Routes = [
  {
      path: '',
      component : DistributedRuleComponent,
      pathMatch : 'full'
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DistributedRoleRoutingModule { }

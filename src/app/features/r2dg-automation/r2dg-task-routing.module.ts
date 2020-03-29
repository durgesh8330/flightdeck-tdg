import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { R2DGTaskComponent } from './r2dg-task.component';

const routes: Routes = [{
  path: '',
  component: R2DGTaskComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class R2DGTaskRoutingModule { }

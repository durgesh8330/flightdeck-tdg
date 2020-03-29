import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkmateTaskComponent } from '@app/features/asri-task/workmate-task.component';

const routes: Routes = [{
  path: '',
  component: WorkmateTaskComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkmateTaskRoutingModule { }

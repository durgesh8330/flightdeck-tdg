import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { MainLayoutComponent } from "../../shared/layout/app-layouts/main-layout.component";
import { AuthLayoutComponent } from "../../shared/layout/app-layouts/auth-layout.component";
import {AuthGuard} from "@app/core/guards/auth.guard";
import {MyTaskComponent} from './my-task/my-task.component';
import {MyWorkgroupTaskComponent} from './my-workgroup-task/my-workgroup-task.component';
export const routes: Routes = [
  {
    path: 'task',
    loadChildren: './task.module#TaskModule'
  },
  {
    path: 'my-task',
    component: MyTaskComponent
  },
  {
    path: 'my-workgroup-task',
    component: MyWorkgroupTaskComponent
  }
  // {
  //   path: 'ckeditor',
  //   loadChildren: './ckeditor/ckeditor.module#CkeditorModule'
  // },
  // {
  //   path: 'email-template',
  //   loadChildren: './email-template/email-template.module#EmailTemplateModule'
  // },
  // {
  //   path: 'error404',
  //   loadChildren: './error404/error404.module#Error404Module'
  // },
  // {
  //   path: 'error500',
  //   loadChildren: './error500/error500.module#Error500Module'
  // },
  // {
  //   path: 'invoice',
  //   loadChildren: './invoice/invoice.module#InvoiceModule'
  // },
  // {
  //   path: 'pricing-tables',
  //   loadChildren: './pricing-tables/pricing-tables.module#PricingTablesModule'
  // },
  // {
  //   path: 'search',
  //   loadChildren: './search/search.module#SearchModule'
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskRoutingModule { }

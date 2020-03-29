import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { MainLayoutComponent } from "./shared/layout/app-layouts/main-layout.component";
import { AuthLayoutComponent } from "./shared/layout/app-layouts/auth-layout.component";
import { AuthGuard } from "@app/core/guards/auth.guard";
import { ManageWorkgroupComponent } from "./features/user-profile/manage-workgroup/manage-workgroup.component";
import { ManageApplicationComponent } from "./features/user-profile/manage-application/manage-application.component";
import { SystemParametersComponent } from "./features/user-profile/system-parameters/system-parameters.component";
import { RuleEngineComponent } from "./features/user-profile/rule-engine/rule-engine.component";
import { ManageNotificationComponent } from "./features/user-profile/manage-notification/manage-notification.component";
import { TaskTypeManagementComponent } from './features/user-profile/task-type-management/task-type-management.component';


const routes: Routes = [
  {
    path: "",
    component: MainLayoutComponent,
    data: { pageTitle: "Home" },
    canActivate: [AuthGuard],
    children: [
      {
        path: "",
        redirectTo: "",
        pathMatch: "full"
      },
      {
        path: "app-views",
        loadChildren: "./features/app-views/app-views.module#AppViewsModule",
        data: { pageTitle: "App Views" }
      },
      {
        path: "calendar",
        loadChildren:
          "app/features/calendar/calendar.module#CalendarFeatureModule"
      },
      {
        path: "dashboard",
        loadChildren: "./features/dashboard/dashboard.module#DashboardModule",
        data: { pageTitle: "Dashboard" }
      },
      {
        path: "task",
        loadChildren:
          "./features/task/task.module#TaskModule",
        data: { pageTitle: "Search Task" }
      },
      {
        path: "profile",
        loadChildren:
          "./features/profile/profile.module#ProfileModule",
        data: { pageTitle: "User Profile" }
      },
      {
        path: "manage-user",
        loadChildren:
          "./features/user-profile/manage-user/manage-user.module#ManageUserModule",
        data: { pageTitle: "Manage User" }
      },
      {
        path: "manage-workgroup",
        component: ManageWorkgroupComponent,
        data: { pageTitle: "Manage User" }
      },
      {
        path: "manage-application",
        component: ManageApplicationComponent,
        data: { pageTitle: "Manage Application" }
      },
      {
        path: "system-parameters",
        component: SystemParametersComponent,
        data: { pageTitle: "System Parameters" }
      },
      {
        path: "Task-Type-Management",
        component: TaskTypeManagementComponent,
        data: { pageTitle: "Task Type Management" }
      },
      {
        path: "manage-notification",
        component: ManageNotificationComponent,
        data: { pageTitle: "Manage Notification" }
      },
      {
        path: "rule-engine",
        loadChildren:
        "./features/user-profile/rule-engine/rule-engine.module#RuleEngineModule",
        data: { pageTitle: "Rule Engine" },
      },
      {
        path: "asri-task",
        loadChildren:
          "./features/asri-task/workmate-task.module#WorkmateTaskModule",
        data: { pageTitle: "Workmate" }
      },
      {
        path: "r2dg-task",
        loadChildren:
          "./features/r2dg-automation/r2dg-task.module#R2DGTaskModule",
        data: { pageTitle: "r2dg" }
      }, {
        path: "theme",
        loadChildren:
          "./features/user-profile/theme-builder/theme-builder.module#ThemeBuilderModule",
        data: { pageTitle: "Theme Builder" }
      },
      {
        path: "uni-spr",
        loadChildren:
          "./features/uni-spr/uni-spr.module#UniSprModule",
        data: { pageTitle: "Uni Spr" }
      },
      {
        path: "evc",
        loadChildren:
          "./features/evc/evc.module#EvcModule",
        data: { pageTitle: "Evc" }
      },
      {
        path: "e-commerce",
        loadChildren: "./features/e-commerce/e-commerce.module#ECommerceModule",
        data: { pageTitle: "E-commerce" }
      },


      {
        path: "forms",
        loadChildren: "./features/forms/forms-showcase.module#FormsShowcaseModule",
        data: { pageTitle: "Forms" }
      },

      {
        path: "graphs",
        loadChildren:
          "./features/graphs/graphs-showcase.module#GraphsShowcaseModule",
        data: { pageTitle: "Graphs" }
      },


      {
        path: "maps",
        loadChildren: "./features/maps/maps.module#MapsModule",
        data: { pageTitle: "Maps" }
      },

      {
        path: "miscellaneous",
        loadChildren:
          "./features/miscellaneous/miscellaneous.module#MiscellaneousModule",
        data: { pageTitle: "Miscellaneous" }
      },
      {
        path: "outlook",
        loadChildren: "./features/outlook/outlook.module#OutlookModule",
        data: { pageTitle: "Outlook" }
      },
      {
        path: "smartadmin",
        loadChildren:
          "./features/smartadmin-intel/smartadmin-intel.module#SmartadminIntelModule",
        data: { pageTitle: "Smartadmin" }
      },

      {
        path: "tables",
        loadChildren: "./features/tables/tables.module#TablesModule",
        data: { pageTitle: "Tables" }
      },

      {
        path: "ui",
        loadChildren: "./features/ui-elements/ui-elements.module#UiElementsModule",
        data: { pageTitle: "Ui" }
      },

      {
        path: "widgets",
        loadChildren:
          "./features/widgets/widgets-showcase.module#WidgetsShowcaseModule",
        data: { pageTitle: "Widgets" }
      }
    ]
  },
  {
    path: "",
    component: AuthLayoutComponent,
    children: [
      {
        path: "",
        redirectTo: "auth/login",
        pathMatch: "full"
      },
      {
        path: "auth",
        component: AuthLayoutComponent,
        loadChildren: "./features/auth/auth.module#AuthModule"
      }
    ]
  },
  { path: "**", redirectTo: "miscellaneous/error404" }


];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

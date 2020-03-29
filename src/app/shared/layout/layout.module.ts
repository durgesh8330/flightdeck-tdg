import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

import {HeaderModule} from "./header/header.module";
import {FooterComponent} from "./footer/footer.component";
import {NavigationModule} from "./navigation/navigation.module";
import {RibbonComponent} from "./ribbon/ribbon.component";
import {ShortcutComponent} from "./shortcut/shortcut.component";
import {ToggleActiveDirective} from "../utils/toggle-active.directive";
import {LayoutSwitcherComponent} from "./layout-switcher.component";
import { MainLayoutComponent } from './app-layouts/main-layout.component';
import { EmptyLayoutComponent } from './app-layouts/empty-layout.component';
import {RouterModule} from "@angular/router";
import { AuthLayoutComponent } from './app-layouts/auth-layout.component';
import {TooltipModule, BsDropdownModule, ModalModule} from "ngx-bootstrap";
import { RouteBreadcrumbsComponent } from './ribbon/route-breadcrumbs.component';
import {UtilsModule} from "../utils/utils.module";
import {MatTabsModule} from '@angular/material';
import { PageContentComponent } from "@app/core/page-content/page-content.component";
import { TabContentDirective } from "@app/core/tab/tab-content.directive";

@NgModule({
  imports: [
    CommonModule,
    HeaderModule,
    NavigationModule,
    FormsModule,
    RouterModule,
    UtilsModule,
    TooltipModule,
    BsDropdownModule,
    MatTabsModule,
    ModalModule.forRoot()
  ],
  declarations: [
    FooterComponent,
    RibbonComponent,
    ShortcutComponent,
    LayoutSwitcherComponent,
    MainLayoutComponent,
    EmptyLayoutComponent,
    AuthLayoutComponent,
    RouteBreadcrumbsComponent,
    PageContentComponent,
    TabContentDirective
  ],
  exports:[
    HeaderModule,
    NavigationModule,
    FooterComponent,
    RibbonComponent,
    ShortcutComponent,
    LayoutSwitcherComponent,
    PageContentComponent
  ]
})
export class SmartadminLayoutModule{

}

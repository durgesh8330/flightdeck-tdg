
import { MatInputModule, MatButtonModule } from '@angular/material';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlightDeckMenuComponent } from './flight-deck-menu/fl-menu.component';
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {I18nModule} from "../../i18n/i18n.module";
import {BigBreadcrumbsComponent} from "./big-breadcrumbs.component";
import {MinifyMenuComponent} from "./minify-menu.component";
import {NavigationComponent} from "./navigation.component";
import {SmartMenuDirective} from "./smart-menu.directive";
import {UserModule} from "../../user/user.module";
import {RouterModule} from "@angular/router";
import {ChatModule} from "../../chat/chat.module";
import {SmartadminWidgetsModule} from "@app/shared/widgets/smartadmin-widgets.module";
import { SmeMenuComponent } from "./sme-menu/sme-menu.component";
import { LmosMenuComponent } from "./lmos-menu/lmos-menu.component";
import { NoLeftmenuComponent } from "./no-leftmenu/no-leftmenu.component";
import { IpvpnMenuComponent } from "./IPVPN-menu/ipvpn-menu.component";
import { MatTooltipModule } from '@angular/material';
import {D3Module} from "@app/shared/graphs/d3/d3.module";
import {FlotChartModule} from "@app/shared/graphs/flot-chart/flot-chart.module";
import {MorrisGraphModule} from "@app/shared/graphs/morris-graph/morris-graph.module";
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { RcmacMenuComponent } from './rcmac-menu/rcmac-menu.component';
import { RuleMenuComponent } from './rule-menu/rule-menu.component';
import {CreateTaskComponent } from './createTask/create-task.component';
import {MatSelectModule} from '@angular/material/select';
import {MatTableModule} from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';
import { QueryHistoryComponent } from "./query-history/query-history.component";


@NgModule({
  imports: [
    SmartadminWidgetsModule,
    FormsModule,
    CommonModule,
    RouterModule,
    I18nModule,
    UserModule,
    ChatModule,
    
    ReactiveFormsModule,
    FormsModule,
    MatTooltipModule,
    MatInputModule, 
    MatButtonModule,
    D3Module,
    FlotChartModule,
    MorrisGraphModule,
    AccordionModule,
    MatSelectModule,
    MatTableModule
  ],
  declarations: [
    BigBreadcrumbsComponent,
    MinifyMenuComponent,
    NavigationComponent,
    SmartMenuDirective,
    SmeMenuComponent,
    FlightDeckMenuComponent,
    RuleMenuComponent,
    LmosMenuComponent,
    IpvpnMenuComponent,
    NoLeftmenuComponent,
    RcmacMenuComponent,
    CreateTaskComponent,
    QueryHistoryComponent
  ],
  exports: [
    BigBreadcrumbsComponent,
    MinifyMenuComponent,
    NavigationComponent,
    SmartMenuDirective,
    SmeMenuComponent,
    FlightDeckMenuComponent,
    RuleMenuComponent,
    LmosMenuComponent,
    IpvpnMenuComponent,
    NoLeftmenuComponent,
    RcmacMenuComponent,
    CreateTaskComponent,
    QueryHistoryComponent
  ]
})
export class NavigationModule{}

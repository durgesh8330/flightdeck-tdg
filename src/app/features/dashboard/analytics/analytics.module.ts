import {NgModule} from '@angular/core';

import {SharedModule} from '@app/shared/shared.module'

import {AnalyticsRoutingModule} from './analytics-routing.module';
import {AnalyticsComponent} from './analytics.component';
import {AnalyticsComponentV2} from './analyticsV2.component';
import {SocialNetworkComponent} from "./live-feeds/social-network.component";
import {LiveFeedsComponent} from "./live-feeds/live-feeds.component";
import {LiveStatsComponent} from "./live-feeds/live-stats.component";
import {RevenueComponent} from "./live-feeds/revenue.component";
import {BirdEyeComponent} from './bird-eye/bird-eye.component';
import { TodoWidgetComponent } from './todo-widget/todo-widget.component';
import { TodoListComponent } from './todo-widget/todo-list.component';
import {FlotChartModule} from "@app/shared/graphs/flot-chart/flot-chart.module";
import {MorrisGraphModule} from "@app/shared/graphs/morris-graph/morris-graph.module";
import {D3Module} from "@app/shared/graphs/d3/d3.module";
import { DashboardService } from '@app/features/dashboard/dashboard.service';
import { MatTableModule } from '@angular/material';
import {CdkTableModule} from '@angular/cdk/table';

@NgModule({
  imports: [
    SharedModule,
    AnalyticsRoutingModule,
    FlotChartModule,
    MorrisGraphModule,
    D3Module,
    MatTableModule,
    CdkTableModule
  ],
  declarations: [
    AnalyticsComponent,
    AnalyticsComponentV2,

    LiveFeedsComponent,
    LiveStatsComponent,
    RevenueComponent,
    SocialNetworkComponent,

    BirdEyeComponent,

    TodoWidgetComponent,

    TodoListComponent
  ],
  exports: [
    AnalyticsComponent,
    AnalyticsComponentV2
  ],
  providers: [DashboardService],
})
export class AnalyticsModule {

}

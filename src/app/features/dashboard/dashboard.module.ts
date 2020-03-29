import {NgModule} from '@angular/core';
import { DashboardService } from './dashboard.service';
import {routing} from './dashboard.routing';
import { SharedModule } from '@app/shared/shared.module';


@NgModule({
  imports: [
    SharedModule,
    routing,
  ],
  declarations: [],
  providers: [ DashboardService ],
})
export class DashboardModule {

}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QueryHistoryDetailsComponent } from '@app/features/query-history-details/query-history-details.component';
import { ProfileModule } from '@app/features/profile/profile.module';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ProfileModule,
    SharedModule
    
  ],
  declarations: [QueryHistoryDetailsComponent],
  exports: [QueryHistoryDetailsComponent]
})
export class QueryHistoryDetailsModule { 
  
}


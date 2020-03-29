import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {routing} from './tables.routing';


@NgModule({
  declarations: [],
  imports: [    
    routing
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class TablesModule {}

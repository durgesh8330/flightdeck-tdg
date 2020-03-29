import {Component} from '@angular/core';

import * as fromLayout from '@app/core/store/layout';
import { Store } from '@ngrx/store';
import { LayoutService } from '@app/core/services';

@Component({
  selector: 'sa-minify-menu',
  template: `<span class="minifyme" (click)="toggle()">
</span>`,
})
export class MinifyMenuComponent {
isHidden:boolean=false;
  constructor( private layoutService: LayoutService,
   private store: Store<any>
  ) {
  }

  toggle() {
    this.isHidden = !this.isHidden;
    this.store.dispatch(new fromLayout.MinifyMenu())
    this.layoutService.onMouseToggleMenu(this.isHidden);
  }
}

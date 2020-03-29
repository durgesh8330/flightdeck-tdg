import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {LayoutService} from "@app/core/services/layout.service";
import * as $ from 'jquery';

@Component({
  selector: 'sa-collapse-menu',
  templateUrl: './collapse-menu.component.html'
})
export class CollapseMenuComponent {
menuTultip = 'Collapse Menu';
@Input() toggleLeftNavigationIcon;
HideShowClass = true;
@Output() CollapsMenuIcon = new EventEmitter;
CollapsIcon = true;
  constructor(
    private layoutService: LayoutService
  ) {

  }

  onToggle() {
    this.CollapsIcon = !this.CollapsIcon;
    this.CollapsMenuIcon.emit(this.CollapsIcon);
    this.layoutService.onCollapseMenu()
    if (this.HideShowClass) {
      this.HideShowClass = false;
      $('.collapsebar').hide();
      $('.handsymbol').show();
      this.menuTultip = 'Expand Menu';
    } else {
      this.HideShowClass = true;
      $('.collapsebar').show();
      $('.handsymbol').hide();
      this.menuTultip = 'Collapse Menu';
    }
  }
}

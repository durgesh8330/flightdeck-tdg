import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[tab-content]',
})

export class TabContentDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
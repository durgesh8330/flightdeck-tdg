import { Component, AfterViewInit } from '@angular/core';

import jarvisWidgetsDefaults from  '../widget.defaults';
import {ElementRef} from "@angular/core";

import 'smartadmin-plugins/smartwidgets/jarvis.widget.ng2.js'

declare var $: any;

@Component({

  selector: 'sa-widgets-grid',
  template: `
     <section id="widgets-grid" class="sortable-grid">
       <ng-content></ng-content>
     </section>
  `,
  styles: []
})
export class WidgetsGridComponent implements AfterViewInit {

  constructor(public el: ElementRef) {}

  ngAfterViewInit() {
      setTimeout(()=> {
        if($('#widgets-grid').length) {
          $('#widgets-grid', this.el.nativeElement).jarvisWidgets(jarvisWidgetsDefaults);
			$('.jarviswidget-fullscreen-btn').off('click').on('click', function(){
          //$('.jarviswidget-fullscreen-btn').click(function(){
            if($('body').hasClass('jarvis_fullscreen')) {
              $('body').removeClass('jarvis_fullscreen');
	            $("mat-tab-header").addClass("mat-tab-header")
            } else {
              $('body').addClass('jarvis_fullscreen');
	            $("mat-tab-header").removeClass("mat-tab-header")
            }
          })
        }
      }, 100)
  }

}

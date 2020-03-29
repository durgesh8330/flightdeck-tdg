import { Component, OnInit, ViewChild, ComponentFactoryResolver, Input, AfterViewInit, ComponentRef } from '@angular/core';
import {TabContentDirective} from './../tab/tab-content.directive';
import { Tab } from './../tab/tab.model';
import {ProcessComponent} from './process';

@Component({
  selector: 'app-page-content',
  templateUrl: './page-content.component.html',
  styleUrls: ['./page-content.component.scss']
})
export class PageContentComponent implements OnInit, AfterViewInit  {

  @ViewChild(TabContentDirective) tabContent: TabContentDirective;
  @Input() tabs;
  @Input() tab;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  ngOnInit() {
    //let tab:Tab = this.tabs[this.tabs.length-1];
    let tab:Tab = this.tab;
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(tab.component);
    let viewContainerRef = this.tabContent.viewContainerRef;
     let cmpRef = viewContainerRef.createComponent(componentFactory); 
     (<ProcessComponent>cmpRef.instance).processData = tab.tabData;
   }

  ngAfterViewInit(){
   
  }

  ngOnDestroy() {  
  }

}

import { Injectable, Inject } from '@angular/core';
import {Subject, Observable} from 'rxjs';
import {Tab} from './tab.model';
import { Router } from '@angular/router';

@Injectable()
export class TabService {

  public tabs = new Array<Tab>();
  public lastUrl = '';
  constructor(private router:Router){}
  // Subject
  public contentComponentService = new Subject<Tab[]>();
  public mySubject = new Subject<string>();

public graphService = new Subject<Tab[]>();

public getWorkGroupname(wName: string){
  this.mySubject.next(wName);
}

getname(): Observable<any> {
  return this.mySubject.asObservable();
}
  //Service Method
  public openTab(tab:Tab){
    this.lastUrl = tab.url;
    const tabIndex = this.tabs.findIndex(x => x.title === tab.title);
    for(let i=0; i<this.tabs.length; i++){
      this.tabs[i].active = false;
    }
    if(tabIndex === -1 || tab.url === 'searchTask'){
      tab.active = true;
      // tab.tabData.id = this.tabs.length;
      this.tabs.push(tab);
    }else{
      this.tabs[tabIndex].active = true;
    }
    //Adding data to subscriber and publishing
    this.contentComponentService.next(this.tabs);
  }

  public removeTab(index:any){
    this.tabs[index] = null;
    this.tabs.splice(index, 1);
    if (this.tabs.length > 0) {
      this.tabs[this.tabs.length - 1].active = true;
    }
    
    this.contentComponentService.next(this.tabs);
    // this.openTab(this.tabs[this.tabs.length - 1]);
  }
  public removeAllTab() {
    //this.tabs = [];
  }
  updateGraphService() {
    this.graphService.next();
  }

  getTabData(): Observable<any> {
    return this.contentComponentService.asObservable();
}
}

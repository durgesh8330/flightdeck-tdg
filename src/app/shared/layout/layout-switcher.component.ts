import { Component, OnInit, OnDestroy, Type } from '@angular/core';
import { config } from '@app/core/smartadmin.config';
import { LayoutService } from '@app/core/services/layout.service'
import { Subscription } from 'rxjs';
import { Tab } from '@app/core/tab/tab.model';
import { TabService } from '@app/core/tab/tab-service';
import { AnalyticsComponent } from '@app/features/dashboard/analytics/analytics.component';
import { ProfileInfoComponent } from '@app/features/profile/profile-info/profile-info.component';
import { SearchTaskComponent } from '@app/features/task/search-task/search-task.component';
declare var $: any;

@Component({
  selector: 'sa-layout-switcher',
  templateUrl: './layout-switcher.component.html'
})
export class LayoutSwitcherComponent implements OnInit, OnDestroy {
  isActivated: boolean;
  smartSkin: string;
  store: any;
  private sub: Subscription;

  constructor(public layoutService: LayoutService, private tabService: TabService) { }

  ngOnInit() {
    console.log('switcher')
    this.sub = this.layoutService.subscribe((store) => {
      this.store = store;
    });
    this.store = this.layoutService.store;
    var defaultValue = null
    if (localStorage.defaultValue) {
      var defaultValue = JSON.parse(localStorage.defaultValue);
    }
    if (defaultValue && defaultValue.defaultTab && defaultValue.defaultTab.indexOf(';') >= 0) {
      var getLevel = defaultValue.defaultTab.split(';');
      if (getLevel[0] == 'FIRST LEVEL') {
        this.openTab('AnalyticsComponent', getLevel[1] + ' Dashboard', 'getSystemTaskCount');
      } else if (getLevel[0] == 'SECOND LEVEL') {
        this.openTab('AnalyticsComponent', getLevel[1] + ' Dashboard', 'getSystemTaskCount/' + getLevel[1].trim());
      } else if (getLevel[0] == 'THIRD LEVEL') {
        this.openTab('AnalyticsComponent', getLevel[2] + ' Dashboard', getLevel[1].trim() + '/' + getLevel[2].trim());
      }
    } else if (defaultValue && defaultValue.defaultTab == "SEARCH") {
      this.openTab('SearchTaskComponent', 'Search', 'searchTask');
    }
  }
  openTab(componentStr, title, url) {
    let tab = new Tab(this.getComponentType(componentStr), title, url, {});
    this.tabService.openTab(tab);
  }
  getComponentType(componentStr: string) {
    console.log()
    let componentType;
    switch (componentStr) {
      case 'AnalyticsComponent': componentType = AnalyticsComponent;
        break;
      case 'SearchTaskComponent': componentType = SearchTaskComponent;
        break;
    }
    return componentType;
  }
  ngOnDestroy() {
    this.sub.unsubscribe()
  }


  onToggle(e) {
    e.stopPropagation();
    //this.isActivated = !this.isActivated
    var settingEle = document.querySelector('.demo.activate');
    if (settingEle) {
      settingEle.classList.remove('activate');
    } else {
      settingEle = document.querySelector('.demo');
      settingEle.classList.add('activate');
    }
  }


  onSmartSkin(skin) {
    this.layoutService.onSmartSkin(skin)
  }


  onFixedHeader() {
    this.layoutService.onFixedHeader()
  }


  onFixedNavigation() {
    this.layoutService.onFixedNavigation()
  }


  onFixedRibbon() {
    this.layoutService.onFixedRibbon()
  }


  onFixedPageFooter() {
    this.layoutService.onFixedPageFooter()
  }


  onInsideContainer() {
    this.layoutService.onInsideContainer()
  }


  onRtl() {
    this.layoutService.onRtl()
  }


  onMenuOnTop() {
    this.layoutService.onMenuOnTop()
  }


  onColorblindFriendly() {
    this.layoutService.onColorblindFriendly()
  }


  factoryReset() {
    this.layoutService.factoryReset()
  }
}

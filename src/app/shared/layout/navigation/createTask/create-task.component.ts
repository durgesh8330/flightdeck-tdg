import { Component, OnInit, AfterViewInit, Type, EventEmitter, Output, Input } from "@angular/core";

import { TabService } from '@app/core/tab/tab-service';
import { Tab } from "@app/core/tab/tab.model";
import { R2DGTaskComponent } from "@app/features/r2dg-automation/r2dg-task.component";
import { SearchTaskComponent } from "@app/features/task/search-task/search-task.component";
import { R2dgSearchComponent } from "@app/features/r2dg-automation/r2dg-search/r2dg-search.component";
import {LayoutService} from '@app/core/services';
import { TaskService } from '@app/features/task/task.service';
import { DataStorageService } from '@app/features/task/data-storage.service';
import { SearchResultComponent } from '@app/features/task/search-result/search-result.component';
import { TaskDetailsComponent } from '@app/features/task/task-details/task-details.component';
import * as $ from 'jquery';

@Component({
    selector: 'create-task',
    templateUrl: './create-task.component.html',
    styleUrls: ['./create-task.component.scss']
  })
  export class CreateTaskComponent implements OnInit  {
    @Output() showMainMenu = new EventEmitter();
    @Output() AutoSelectCall = new EventEmitter();
    @Output() MainLoader = new EventEmitter();
    @Output() message = new EventEmitter();
    public disableSearch: boolean = false;

      constructor(
        private tabService: TabService,
        private layoutService: LayoutService,
        private taskService: TaskService,
        private dataStorageService: DataStorageService,
      ){
        this.getTemplateData();
      }

    public leftMenuData: any;

    ngOnInit(){


    }
    // createTask(){
    //    // window.alert('hi');
    //     let tab = new Tab(R2DGTaskComponent, "R2DG Automation", "r2dg-task",'');
    //     this.tabService.openTab(tab);
    // }
    // searchTask(){
    //     let tab = new Tab(SearchTaskComponent, "Search Task", "search-task",'');
    //   this.tabService.openTab(tab);
    // }

    getTemplateData(){

      let parsedJSON = JSON.parse(localStorage.getItem('r2dgLeftNavigation'));

      this.leftMenuData = parsedJSON;
      const userObj = JSON.parse(localStorage.getItem('fd_user'));
      this.checkAccessLevels(userObj.authorizations);
    }


    checkAccessLevels(authorizations: any){
      const usersLeftPermissions = authorizations.filter((authElement: any) => authElement.startsWith('LeftMenu'));
      for(let i=0; i<this.leftMenuData['pageLayoutTemplate'].leftMenu.length; i++){
          const menuItem: any = this.leftMenuData['pageLayoutTemplate'].leftMenu[i];
          if(menuItem && ((menuItem['label'] == 'R2DG Task' && usersLeftPermissions.indexOf('LeftMenu_R2DG_create') == -1) ||
             (menuItem['label'] == 'Search' && usersLeftPermissions.indexOf('LeftMenu_advancedTaskSearch') == -1))){
            this.leftMenuData['pageLayoutTemplate'].leftMenu.splice(i, 1);
            i--;
          }
      }
    }

    toggleOnHover(state) {
      this.layoutService.onMouseToggleMenu(state);
    }

    openTab(componentStr, title, url) {
      if (componentStr) {
        let tab = new Tab(this.getComponentType(componentStr), title, url, {});
        this.tabService.openTab(tab);
      }
    }

    getComponentType(componentStr: string): Type<any> {
      let componentType: Type<any>;
      switch (componentStr) {
        case 'SearchTaskComponent':
          componentType = R2dgSearchComponent;
          break;
        case 'R2DGTaskComponent':
          componentType = R2DGTaskComponent;
          break;
      }
      return componentType;
    }

    searchTask(fieldsList) {
      this.MainLoader.emit({status : true});
      let searchFields = [];
      fieldsList.forEach(element => {
        let obj = {};
        if (element.fieldValue != '') {
          obj['fieldName'] = element.fieldName;
          obj['value'] = [element.fieldValue];
          obj['operator'] = 'equals';
          searchFields.push(obj);
        }

      });

      let searchCriteria = {
        "searchFields": searchFields
      };

      this.taskService.advancedSearchV3Task(searchCriteria).toPromise().then((result: any) => {
        this.disableSearch = false;
        this.MainLoader.emit({status : false});
        if (result && result.taskResults && result.taskResults.length > 0) {
          //this.dataStorageService.setData(result.taskResults);
          //remove below line when backend is ready
          //result.pagination = {pageNumber: 1, pageSize: 100, totalRecords: result.taskResults.length};
          //this.dataStorageService.setPagination(result.pagination);
          //this.dataStorageService.setSearchCriteria(this.request);
          // this.showResultsTemp = true;
          if (result.taskResults.length > 1) {
            this.dataStorageService.setData(result.taskResults);
            this.dataStorageService.setPagination(result.pagination);
            this.dataStorageService.setSearchCriteria(searchCriteria);
            let tab = new Tab(SearchResultComponent, 'Search Result', 'searchTask', {});
            this.tabService.openTab(tab);
          } else {
            let tab = new Tab(TaskDetailsComponent, 'Task : '+result.taskResults[0]['sourceTaskId'], 'TaskDetailsComponent', result.taskResults[0]);
            this.tabService.openTab(tab);
          }

        } else {
          this.message.emit({status: false, message: "No Data Found for the provided criteria, Please try searching with valid data."});
          // this.snackBar.open("No Data Found for the provided criteria, Please try searching with valid data.", "Okay", {
          //   duration: 15000,
          // });
        }
      }, (error: any) => {
        //this.loader = false;
        console.log(error);
       this.MainLoader.emit({status : false});
        this.message.emit({status: false, message: error.error.message});
        this.disableSearch = false;
       // this.snackBar.open(error.error.message, "Okay", {
         //   duration: 15000,
      // });
      });
    }

    keyPress(event) {
      if (event.target.value == '') {
        $(event.target).parent().find('span').removeClass('hide')
      } else {
        $(event.target).parent().find('span').addClass('hide')
      }
    }
  }

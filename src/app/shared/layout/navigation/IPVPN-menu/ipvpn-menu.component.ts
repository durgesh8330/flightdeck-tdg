import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, Type, EventEmitter, Output, AfterViewInit } from '@angular/core';
import {SearchTaskComponent} from '@app/features/task/search-task/search-task.component';
import {TabService} from '@app/core/tab/tab-service';
import {LayoutService} from '@app/core/services';
import {Tab} from '@app/core/tab/tab.model';
import { environment } from '@env/environment';
import {AnalyticsComponent} from '@app/features/dashboard/analytics/analytics.component';
import {WorkmateTaskComponent} from '@app/features/asri-task/workmate-task.component';
import {UniSprComponent} from '@app/features/uni-spr/uni-spr.component';
import {EvcComponent} from '@app/features/evc/evc.component';
import {ThemeBuilderComponent} from '@app/features/user-profile/theme-builder/theme-builder.component';
import {ManageUserComponent} from '@app/features/user-profile/manage-user/manage-user.component';
import {UserProfileService} from '@app/features/user-profile/user-profile.service';
import {MyTaskComponent} from '@app/features/task/my-task/my-task.component';
import {MyWorkgroupTaskComponent} from '@app/features/task/my-workgroup-task/my-workgroup-task.component';
import { Error404Component } from '@app/features/miscellaneous/error404/error404.component';
import { NotFoundComponent } from '@app/shared/not-found/not-found.component';
import * as examples from "@app/features/graphs/flot-charts/flot-examples";
import {FakeDataSource} from "@app/features/graphs/flot-charts/flot-examples";
import { MatSnackBar } from '@angular/material';
import { DashboardService } from '@app/features/dashboard/dashboard.service';
import { Store } from '@ngrx/store';

@Component({
  selector: 'ipvpn-menu',
  templateUrl: './ipvpn-menu.component.html',
  styleUrls: ['./ipvpn-menu.component.scss']
})
export class IpvpnMenuComponent implements OnInit,  AfterViewInit  {
  public permissionList:any = [];
  public leftMenuData:any = {leftMenu: []};
  public pageLayout: any;
  public flotExamples:any;
  public smeSearch: any = {};
  public showSearchMenu: boolean = false;
  @Output() showMainMenu = new EventEmitter();
  swithcToMainMenu(){
    this.showMainMenu.emit();
  }
  public updatingData: Array<any>;
  public isSourceSystem = false;
  public topLevel = [];
  sourceChart = [];
  public chartjsData: any = {
    "weeklyOptions":{
        "legend": {
          "display": true,
        },
        "scales": {
          "xAxes": [{
            "display": true,
            categoryPercentage: 1.0,
            maxBarThickness: 20,
          }],
          "yAxes": [{
            "display": true, ticks: {
              beginAtZero: true,
              callback: function(value) {if (value % 1 === 0) {return value;}}
            }
          }]
        }
    },
    "sourceMonthlyOptions":{
        "legend": {
          "display": false,
        },
        "scales": {
          "xAxes": [{
            barPercentage: 0.8
          }],
          "yAxes": [{
            barPercentage: 0.8
          }]
        }
    },
   "sourceData": [],       
    "tableData":{"body":[]},
    "offerCombined":{"headLabels":'Total of all by status', 'body': [{"color":"#00c0ef", "icon":"fa fa-bars", "label":'Total', "count":0 }, {"color":"#00c0ef", "icon":"fa fa-bars", "label":'Total', "count":0 }, {"color":"#387fa9", "icon":"  fa fa-exclamation-circle", "label":"In Progress", "count":0},{"color":"#4da944", "icon":"fa fa-check-circle-o", "label":'Completed', "count":0 }]},
    //{"color":"#f39c11", "icon":"fa fa-ban","label":'Cancelled', "count":0 }
    "statusSummary" : {
    }, "monthlyStatusData" : {
    }, "weeklyStatusData":  {
      "labels": ["Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "datasets": []
    }
  };
  level:any;
  tabTitle:any;
  startDate:any = '';
  endDate:any = '';
  public isMonthlyStatusLoading = false;
  public isWeeklyStatusLoading = false;

  public monthlyOptions = {
    resize: true,
    xkey: 'period',
    ykeys: [],
    parseTime: false,
    labels: [],
    pointSize: [2],
    hideHover: 'auto'
 }
  constructor(
    private store: Store<any>,
    private tabService: TabService, private snackBar: MatSnackBar,
     private dashboardService:DashboardService,
    private layoutService: LayoutService, private httpClient: HttpClient
  ) {
   
  }

  ngOnInit() {
    var d = new Date();
    // Get all the other Mondays in the month
    var pushDate = new Date(d.getTime());
    this.endDate = pushDate;
    d.setDate(d.getDate() - 6);
    var pushDate = new Date(d.getTime());
    this.startDate = pushDate;
    let themeLink = JSON.parse(localStorage.getItem('themeLink'));
    if (themeLink && themeLink.leftMenu) {
      this.permissionList = themeLink.leftMenu.split(';');
      if (!this.permissionList) {
        this.permissionList = [];
      }
    }
    this.getTemplateData();
    this.flotExamples = examples;
    this.interval = setInterval(()=>{
      this.updateStats()
    }, 1000);
    this.updateStats()

    
    var monthly, weekly, taskTypeCount,taskStatus;
    // if(this.tabService.lastUrl == 'getSystemTaskCount') {
      this.level = 'getSystemTaskCount';
      this.tabTitle = 'FLIGHTDECK';
      taskStatus = 'getSystemTaskCount';
    /*   monthly = '/Dashboard/getSystemMonthlyTaskCount';
      weekly = '/Dashboard/getSystemWeeklyTaskCount';
      taskTypeCount = '/Dashboard/getSystemSummaryCount';
      
    } else if(this.tabService.lastUrl.includes('getSystemTaskCount')) {
      var exPath = this.tabService.lastUrl.substring(this.tabService.lastUrl.lastIndexOf('/')+1)
      this.level = exPath;
      this.tabTitle = exPath;
      taskStatus = 'getSystemTaskTypeCount/'+exPath;
      monthly = '/Dashboard/getMonthlyCount/'+exPath;
      weekly = '/Dashboard/getWeeklyCount/'+exPath;
      taskTypeCount = '/Dashboard/getTaskCountBySourceSystem/'+exPath;
    } else {
      var exPath = this.tabService.lastUrl;
      this.tabTitle = this.tabService.lastUrl.substring(this.tabService.lastUrl.lastIndexOf('/')+1);
      this.level = 3;
      taskStatus = 'getTaskCountByTaskName/'+exPath;
      monthly = '/Dashboard/getMonthlyCount/'+exPath;
      weekly = '/Dashboard/getWeeklyCount/'+exPath;
      taskTypeCount = '/Dashboard/getTaskCountByTaskName/'+exPath;
    } */
    this.topLevel = []
    this.dashboardService.sourceSystem(taskStatus).toPromise().then((result:any)=>{
      if(result && result.length > 0) {
        if(this.level != 3) {
         
          this.sourceChart = [];
          result.map((x) => { x.taskCountList.map((z) => { 
            if(this.sourceChart.indexOf(z.taskStatus) == -1) 
              { this.sourceChart.push(z.taskStatus);}
          })});
          var chartResult = [];
          result.map((x, perentIndex) => 
         {
        var taskName;
                if(x.criteriaKey) {
                  taskName = x.criteriaKey;
                } else {
                  taskName = x.taskName;
                }
                chartResult.push({total:x.total, percentage:x.percentage, criteriaKey: taskName, task:{}, taskCountList:[] });
                this.sourceChart.map((a)=> {chartResult[perentIndex]['task'][a] = 0})
                for(var i = 0; i < x.taskCountList.length; i++) {
                  chartResult[perentIndex]['task'][x.taskCountList[i].taskStatus] = x.taskCountList[i].taskCount;
                }
        });
        var graphData = [];
        for(var i = 0; i < chartResult.length; i++) {
          
          graphData.push({"label": chartResult[i].criteriaKey,"data": chartResult[i].percentage})
          for(var val in chartResult[i].task) {
            chartResult[i]['taskCountList'].push(chartResult[i].task[val]);
          }
        }
      
        this.chartjsData.tableData.body = chartResult;
        this.chartjsData.sourceData = graphData;
      } else {
        for(var i = 0; i < result.length; i++) {
          result[i]['icon'] = (this.chartjsData.offerCombined.body[i] && this.chartjsData.offerCombined.body[i]) ? this.chartjsData.offerCombined.body[i].icon: 'fa fa-exclamation-circle'
          result[i]['color'] = (this.chartjsData.offerCombined.body[i] && this.chartjsData.offerCombined.body[i]) ? this.chartjsData.offerCombined.body[i].color: 'fa fa-exclamation-circle'
          result[i]['label'] = result[i]['taskStatus']
          result[i]['count'] = result[i]['taskCount']
              }
              this.topLevel = result;
      }
        this.isSourceSystem = true;
      }
    }, (error:any)=>{})
    //RestService/Dashboard/getSystemMonthlyTaskCount
    /* this.dashboardService.monthlyStatus(monthly).toPromise().then((result:any)=>{
      
      if(result && result.length >0) {
        var chartLabel = [];
        var label = [];
        result.map((x)=> {  if(chartLabel.indexOf(x.taskStatus) == -1) { chartLabel.push(x.taskStatus);}  })
        this.monthlyOptions.ykeys = chartLabel;
        this.monthlyOptions.labels = chartLabel;
        var sales = [];
        for(var i = 0; i < result.length; i++) {
          var pos = label.indexOf(result[i].year +'-'+result[i].month);
        if(pos == -1) {
          pos = label.push(result[i].year +'-'+result[i].month) -1;
          var obj = { period:result[i].year +'-'+ ("0" +result[i].month).slice(-2) }
          chartLabel.map((x)=> obj[x] = null)
          sales.push(obj);
        }
          sales[pos][result[i].taskStatus] = result[i].taskCount;  
        }
       
        this.chartjsData.monthlyStatusData = sales;
        this.isMonthlyStatusLoading = true;
      }
    
    }, (error:any)=>{})
    this.dashboardService.monthlyStatus(weekly).toPromise().then((result:any)=>{
      if(result && result.length >0) {
        var barchartLabel = [];
        result.map((x)=> { if(barchartLabel.indexOf(x.taskStatus) == -1) { barchartLabel.push(x.taskStatus);}});
        var barChart = [];
          barchartLabel.map((x)=> {barChart.push({
          "label": x, backgroundColor : this.getRandomColor(), data:[0,0,0,0,0,0, 0]
        })});

        for(var j = 0; j < barchartLabel.length; j++) {
          for (var i = 0; i < result.length; i++) {
            if(result[i].taskStatus == barChart[j].label) {
               barChart[j].data[result[i].dayOfWeek -1] = result[i].taskCount;
            }
          }
        }
        this.chartjsData.weeklyStatusData.datasets = barChart;
        this.isWeeklyStatusLoading = true;
      } 
    }, (error:any)=>{})
    this.dashboardService.getSystemSummary(taskTypeCount).toPromise().then((result:any)=>{
      if(result) {
        for(var i = 0; i < result.length; i++) {
          result[i]['icon'] = (this.chartjsData.offerCombined.body[i] && this.chartjsData.offerCombined.body[i]) ? this.chartjsData.offerCombined.body[i].icon: 'fa fa-exclamation-circle'
          result[i]['color'] = (this.chartjsData.offerCombined.body[i] && this.chartjsData.offerCombined.body[i]) ? this.chartjsData.offerCombined.body[i].color: '#4da944'
          result[i]['label'] = result[i]['taskStatus']
          result[i]['count'] = result[i]['taskCount']
              }
          this.topLevel = result;
      }
    }, (error:any)=>{}) */
  }
  templateObj: any = {};
  searchTypes: any = [];
  searchType: string = 'Request';
  searchTypeLabel = [];
  showChildMenu:any = -1;

  getTemplateData() {
   let parsedJSON = JSON.parse(localStorage.getItem('ipvpnLeftNavigation'));
    // let parsedJSON = {
    //   "pageLayoutTemplate": {
    //           "leftMenu": [
    //             {
    //               "headerExpandedIcon": "icon-minus",
    //               "headerCollapsedIcon": "icon-plus",
    //               "children": [
    //                 {
    //                   "componentString": "AnalyticsComponent",
    //                   "routerLink": "/dashboard",
    //                   "label": "FLIGHTDECK Dashboard",
    //                   "title": "FLIGHTDECK Dashboard",
    //                   "url": "getSystemTaskCount"
    //                 }
    //               ],
    //               "headerLabel": "Dashboard",
    //               "chart": true,
    //               "headerIcon": "fa fa-lg fa-fw fa-tachometer"
    //             },
    //             {
    //               "headerExpandedIcon": "icon-minus",
    //               "headerCollapsedIcon": "icon-plus",
    //               "children": [
    //                 {
    //                   "componentString": "SearchTaskComponent",
    //                   "routerLink": "/task",
    //                   "label": "Advanced Search",
    //                   "title": "Advanced Search",
    //                   "url": "searchTask"
    //                 }
    //               ],
    //               "headerLabel": "Task",
    //               "chart": false,
    //               "headerIcon": "fa fa-lg fa-fw fa-search"
    //             },
    //             {
    //               "headerExpandedIcon": "icon-minus",
    //               "headerCollapsedIcon": "icon-plus",
    //               "children": [],
    //               "headerLabel": "Create",
    //               "chart": false,
    //               "headerIcon": "fa fa-lg fa-fw fa-plus-square",
    //               "componentString": "CreateTaskComponent",
    //               "title": "Create Tasks",
    //               "url": ""
    //             },
    //             {
    //               "headerExpandedIcon": "",
    //               "componentString": "MyTaskComponent",
    //               "routerLink": "/task/my-task",
    //               "headerCollapsedIcon": "",
    //               "children": [],
    //               "headerLabel": "My Tasks",
    //               "title": "My Tasks",
    //               "url": "",
    //               "chart": false,
    //               "headerIcon": "fa fa-lg fa-fw fa-tasks"
    //             },
    //             {
    //               "headerExpandedIcon": "",
    //               "componentString": "MyWorkgroupTaskComponent",
    //               "routerLink": "/task/my-workgroup-task",
    //               "headerCollapsedIcon": "",
    //               "children": [],
    //               "headerLabel": "My Workgroup Tasks",
    //               "title": "My Workgroup Tasks",
    //               "url": "",
    //               "chart": false,
    //               "headerIcon": "fa fa-lg fa-fw fa-object-group"
    //             }
    //        ],
    //        "leftBottomMenu": [
    //          {
    //             "routerLink": "/app-views/profile",
    //             "data-action": "UserProfile",
    //             "subMenuIcon": "fa fa-user",
    //             "link": false,
    //             "componentString": "UsersComponent",
    //             "title": "User",
    //             "url":""
    //          },
    //          {
    //             "routerLink": "/auth/login",
    //             "data-action": "userLogout",
    //             "subMenuIcon": "fa fa-sign-out",
    //             "link": true,
    //             "componentString": "MyWorkgroupTaskComponent",
    //             "title": "Logout",
    //             "url":""
    //         }
    //        ], 
    //         "templateName": "IpvpnleftMenu",
    //         "createdById": "AC30164"
    //       }
    //   };
    if (parsedJSON) {
      this.leftMenuData = parsedJSON.pageLayoutTemplate;
       const userObj = JSON.parse(localStorage.getItem('fd_user'));
       if(userObj && userObj.authorizations && userObj.authorizations.length > 0){
         this.checkAccessLevels(userObj.authorizations);
       }else{
         this.leftMenuData.leftMenu = [];
       }
    }
    this.httpClient.get(environment.apiUrl+'/PageLayoutTemplate/Get/SME Search').toPromise().then((response: any) =>{
      this.pageLayout = response.pageLayoutTemplate;
      if(this.pageLayout && this.pageLayout.length > 0){
         this.pageLayout.forEach((section: any)=>{
          const searchType = section.sectionHeader.split(' ')[0];
          this.templateObj[searchType] = section.fieldsList;
          if(searchType != 'Buttons' && searchType !='Search') {
            this.searchTypes.push(searchType);
          } else if(searchType =='Search') {
            this.searchTypeLabel = section.fieldsList;
          }
         });
      }
    }).catch(errorObj => console.error(errorObj));
      // const userObj = JSON.parse(localStorage.getItem('fd_user'));
      // if(userObj && userObj.authorizations && userObj.authorizations.length > 0){
      //   this.checkAccessLevels(userObj.authorizations);
      // }else{
      //   this.leftMenuData.leftMenu = [];
      // }
  }
  
  checkAccessLevels(authorizations: any){   
    const usersLeftPermissions = authorizations.filter((authElement: any) => authElement.startsWith('Button'));
    for(let i=0; i<this.leftMenuData.leftMenu.length; i++){
        const menuItem: any = this.leftMenuData.leftMenu[i];  
        if(menuItem && (menuItem['headerLabel'] == 'Create' && usersLeftPermissions.indexOf('Button_ASRITask_create') == -1)){
          this.leftMenuData.leftMenu.splice(i, 1);
          i--;
        }
    }
  }
  private newMethod(): any {
    return 'LeftMenu_dashboard';
  }

  updateStats() {
    this.updatingData = [FakeDataSource.getRandomData()]
  }
  getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color; 
  }
  private interval;
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
        componentType = SearchTaskComponent;
        break;
      case 'WorkmateTaskComponent':
        componentType = WorkmateTaskComponent;
        break;
      case 'AnalyticsComponent':
        componentType = AnalyticsComponent;
        break;
      case 'UniSprComponent':
        componentType = UniSprComponent;
        break;
      case 'EvcComponent':
        componentType = EvcComponent;
        break;
      case 'ThemeBuilderComponent':
        componentType = ThemeBuilderComponent;
        break;
      case 'MyTaskComponent':
        componentType = MyTaskComponent;
        break;
      case 'MyWorkgroupTaskComponent':
        componentType = MyWorkgroupTaskComponent;
        break;
      default:
        componentType = NotFoundComponent;
        break;
      // case 'ManageUserComponent': componentType = ManageUserComponent;
      // break;
    }
    return componentType;
  }

  toggleOnHover(state) {
    this.layoutService.onMouseToggleMenu(state);
  }

  onClickLink(state, e) {}
  showChildMenuFn(i:any) {
    if(this.showChildMenu == 'child'+i ) {
      this.showChildMenu = -1;
    } else {
      this.showChildMenu = 'child'+i;
    }
  }

  ngAfterViewInit() {
   
  }
}

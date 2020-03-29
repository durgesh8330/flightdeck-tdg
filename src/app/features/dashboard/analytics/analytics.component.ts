import { Component, OnInit, Type, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { JsonApiService } from '@app/core/services';
import * as examples from "@app/features/graphs/flot-charts/flot-examples";
import {FakeDataSource} from "@app/features/graphs/flot-charts/flot-examples";
import { DashboardService } from '@app/features/dashboard/dashboard.service';
import * as fromCalendar from "@app/core/store/calendar";
import { Tab } from '@app/core/tab/tab.model';
import { TabService } from '@app/core/tab/tab-service';
import { SearchResultComponent } from '@app/features/task/search-result/search-result.component';
import { TaskService } from '@app/features/task/task.service';
import { DataStorageService } from '@app/features/task/data-storage.service';
import { SearchTaskComponent } from '@app/features/task/search-task/search-task.component';
import * as moment from 'moment';
import { MatSnackBar } from '@angular/material';
import { SearchDataService } from "@app/features/dashboard/search-data/search-data.service";

declare var $: any;

@Component({
  selector: 'sa-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit,  AfterViewInit {

  public calendar$;
  public activeIndex = -1;
  public isLoading = false;
  public isSourceSystem = false;
  public morrisDemoData:any;
  public isMonthlyStatusLoading = false;
  public isWeeklyStatusLoading = false;
  public flotData:any;
  public flotExamples:any;
  public newTabTitle:any;
  public topLevel = [];
  public updatingData: Array<any>;
  public searchFields
  sourceChart = []; 
  public workType:any;
  public readyAssignTotal:any;
  public workTypeSearch:any;
  public advanceSearchData:any;
  public monthlyOptions = {
    resize: true,
    xkey: 'period',
    ykeys: [],
    parseTime: false,
    labels: [],
    pointSize: [2],
    hideHover: 'auto'
 }
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
    "offerCombined":{"headLabels":'Total of all by status', 'body': [ {"color":"#387fa9", "icon":"fa fa-exclamation-circle", "label":'Total', "count":0 },{"color":"#00c0ef", "icon":"fa fa-bars", "label":'Total', "count":0 }, {"color":"#4da944", "icon":"  fa fa-check-circle-o", "label":"In Progress", "count":0},{"color":"#4da944", "icon":"fa fa-check-circle-o", "label":'Completed', "count":0 }]},    
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
  
  constructor(
    private store: Store<any>,
    private jsonApiService: JsonApiService,
    private tabService: TabService,
    private taskService: TaskService,
    private dashboardService:DashboardService,
    private dataStorageService: DataStorageService,
    private snackBar: MatSnackBar,
    private searchDataService: SearchDataService
  ) {
    this.calendar$ = this.store.select(fromCalendar.getCalendarState);
  }

  ngOnInit() {
    this.isLoading = true;    
    var d = new Date();
    // Get all the other Mondays in the month
    var pushDate = new Date(d.getTime());
    this.endDate = pushDate;
    d.setDate(d.getDate() - 6);
    var pushDate = new Date(d.getTime());
    this.startDate = pushDate;
    this.flotExamples = examples;
    this.interval = setInterval(()=>{
      this.updateStats()
    }, 1000);

    this.updateStats()
    this.workTypeSearch =this.searchDataService.getSearchTaskDetails().subscribe(
      (data) => { this.searchFields = data; },
      (err) => console.log(err)
    );
    var monthly, weekly, taskTypeCount,taskStatus;
    if(this.tabService.lastUrl == 'getSystemTaskCount') {
      this.level = '/Dashboard/getSystemTaskCount';
      this.tabTitle = 'FLIGHTDECK';
      taskStatus = this.tabService.lastUrl;
      //monthly = '/Dashboard/getSystemMonthlyTaskCount';
      //weekly = '/Dashboard/getSystemWeeklyTaskCount';
      taskTypeCount = 'getSystemSummaryCount';
      
    } else if(this.tabService.lastUrl.includes('getSystemTaskCount')) {
      var exPath = this.tabService.lastUrl.substring(this.tabService.lastUrl.lastIndexOf('/')+1)      
      this.level = exPath;
      if(exPath == 'LMOS'){
        this.tabTitle = 'LMOS_SCREENERS';
      }
      else{
        this.tabTitle = 'RCMAC BOISE';
        var exPath = 'LMOS';        
      }
      //taskStatus = '/Dashboard/getSystemTaskTypeCount/'+ exPath + '/' + this.tabTitle;
      //monthly = '/Dashboard/getMonthlyCount/'+exPath;
      //weekly = '/Dashboard/getWeeklyCount/'+exPath;
      taskTypeCount = 'getTaskCountBySourceSystem/'+exPath + '/' + this.tabTitle;
    } else {
      var exPath = this.tabService.lastUrl;
      this.tabTitle = this.tabService.lastUrl.substring(this.tabService.lastUrl.lastIndexOf('/')+1);
      this.level = 3;
      //taskStatus = '/Dashboard/getTaskCountByTaskName/'+exPath+ '/' + this.tabTitle;;
      //monthly = '/Dashboard/getMonthlyCount/'+exPath;
      //weekly = '/Dashboard/getWeeklyCount/'+exPath;
      taskTypeCount = 'getTaskCountByTaskName/'+exPath +'/' + this.tabTitle;;
    }
    this.topLevel = []
    this.dashboardService.sourceSystem(taskTypeCount).toPromise().then((result:any)=>{
      this.isLoading = false;  
      this.workType=result["workTypeCount"]
      this. readyAssignTotal=result["readyAssignTotal"];
      if(this.workType &&  this.workType.length > 0 &&  this.workType ) {
        if(this.level != 3) {         
          this.sourceChart = [];
          this.workType.map((x) => { 
            if(this.sourceChart.indexOf(x.worktype) == -1)            
              { this.sourceChart.push(x);}
          });
          var chartResult = [];         
          this.workType.map((x, perentIndex) => 
         {
        var taskName;
                if(x.worktype) {
                  taskName = x.worktype;
                } else {
                  taskName = x.taskName;
                }
                chartResult.push({total:x.total,Assigned:x.assignedCount,Ready:x.readyCount, percentage:x.percentage,average:x.avgAge,criteriaKey: x.worktype, Total:x.total,task:{}, taskCountList:[] });
                this.sourceChart.map((a)=> {chartResult[perentIndex]['task'][a] = 0});
                
        });
        var graphData = [];
        for(var i = 0; i < chartResult.length; i++) {
          if(chartResult[i].criteriaKey!='Totals:'){
          graphData.push({"label": chartResult[i].criteriaKey,"data": chartResult[i].percentage})
         }
          for(var val in chartResult[i].task) {
            chartResult[i]['taskCountList'].push(chartResult[i].task[val]);
          }
        }
      
        this.chartjsData.tableData.body = chartResult;
        this.chartjsData.sourceData = graphData;
      } else {
        for(var i = 0; i <  this.workType.length; i++) {
          this.workType[i]['icon'] = (this.chartjsData.offerCombined.body[i] && this.chartjsData.offerCombined.body[i]) ? this.chartjsData.offerCombined.body[i].icon: 'fa fa-exclamation-circle'
          this.workType[i]['color'] = (this.chartjsData.offerCombined.body[i] && this.chartjsData.offerCombined.body[i]) ? this.chartjsData.offerCombined.body[i].color: 'fa fa-exclamation-circle'          
          this.workType[i]['label'] = this.workType[i]['taskStatus']
          this.workType[i]['count'] = this.workType[i]['taskCount']
              }
              this.topLevel = this.workType;              
         // this.chartjsData.offerCombined.body = result
        // for(var i = 0; i < result.length; i++) {
        //   if(this.chartjsData.offerCombined.body[i] &&this.chartjsData.offerCombined.body[i].label) {
        //       this.chartjsData.offerCombined.body[i].label = result[i].taskStatus;
        //       this.chartjsData.offerCombined.body[i].count = result[i].taskCount;
        //     }  else {
        //       this.chartjsData.offerCombined.body.push(this.chartjsData.offerCombined.body[0])
        //       this.chartjsData.offerCombined.body[i].label = result[i].taskStatus;
        //       this.chartjsData.offerCombined.body[i].count = result[i].taskCount;
        //     }
        //   }
      }
        this.isSourceSystem = true;
    }
   
    //RestService/Dashboard/getSystemMonthlyTaskCount
    // this.dashboardService.monthlyStatus(monthly).toPromise().then((result:any)=>{
      
    //   if(result && result.length >0) {
    //     var chartLabel = [];
    //     var label = [];
    //     result.map((x)=> {  if(chartLabel.indexOf(x.taskStatus) == -1) { chartLabel.push(x.taskStatus);}  })
    //     this.monthlyOptions.ykeys = chartLabel;
    //     this.monthlyOptions.labels = chartLabel;
    //     var sales = [];
    //     for(var i = 0; i < result.length; i++) {
    //       var pos = label.indexOf(result[i].year +'-'+result[i].month);
    //     if(pos == -1) {
    //       pos = label.push(result[i].year +'-'+result[i].month) -1;
    //       var obj = { period:result[i].year +'-'+ ("0" +result[i].month).slice(-2) }
    //       chartLabel.map((x)=> obj[x] = null)
    //       sales.push(obj);
    //     }
    //       sales[pos][result[i].taskStatus] = result[i].taskCount;  
    //     }
       
    //     this.chartjsData.monthlyStatusData = sales;
    //     this.isMonthlyStatusLoading = true;
    //   }
    
    // }, (error:any)=>{})
    // this.dashboardService.monthlyStatus(weekly).toPromise().then((result:any)=>{
    //   if(result && result.length >0) {
    //     var barchartLabel = [];
    //     result.map((x)=> { if(barchartLabel.indexOf(x.taskStatus) == -1) { barchartLabel.push(x.taskStatus);}});
    //     var barChart = [];
    //       barchartLabel.map((x)=> {barChart.push({
    //       "label": x, backgroundColor : this.getRandomColor(), data:[0,0,0,0,0,0, 0]
    //     })});

    //     for(var j = 0; j < barchartLabel.length; j++) {
    //       for (var i = 0; i < result.length; i++) {
    //         if(result[i].taskStatus == barChart[j].label) {
    //            barChart[j].data[result[i].dayOfWeek -1] = result[i].taskCount;
    //         }
    //       }
    //     }
    //     this.chartjsData.weeklyStatusData.datasets = barChart;
    //     this.isWeeklyStatusLoading = true;
    //   } 
    // }, (error:any)=>{})  
      if(this.readyAssignTotal) {        
        for(var i = 0; i < this.readyAssignTotal.length; i++) {
          this.readyAssignTotal[i]['icon'] = (this.chartjsData.offerCombined.body[i] && this.chartjsData.offerCombined.body[i]) ? this.chartjsData.offerCombined.body[i].icon: 'fa fa-exclamation-circle'
          this.readyAssignTotal[i]['color'] = (this.chartjsData.offerCombined.body[i] && this.chartjsData.offerCombined.body[i]) ? this.chartjsData.offerCombined.body[i].color: '#4da944'
          this.readyAssignTotal[i]['label'] = this.readyAssignTotal[i]['taskStatus']
          this.readyAssignTotal[i]['count'] = this.readyAssignTotal[i]['taskCount']
              }
          this.topLevel = this.readyAssignTotal;          
        // for(var i = 0; i < result.length; i++) {
        //   if(this.chartjsData.offerCombined.body[i] &&this.chartjsData.offerCombined.body[i].label) {
        //       this.chartjsData.offerCombined.body[i].label = result[i].taskStatus;
        //       this.chartjsData.offerCombined.body[i].count = result[i].taskCount;
        //     }  else {
        //       this.chartjsData.offerCombined.body.push(this.chartjsData.offerCombined.body[0])
        //       this.chartjsData.offerCombined.body[i].label = result[i].taskStatus;
        //       this.chartjsData.offerCombined.body[i].count = result[i].taskCount;
        //     }
        //   }
        
      }
    }, (error:any)=>{})
  }
 
  summaryCount(label, count, index) {
    
    if(count > 0) {
    this.isLoading = true;
    this.activeIndex = index;
    let tabName = this.tabTitle + ' ' + label;
    var tabTitle = this.tabTitle.substring(0,this.tabTitle.lastIndexOf('_'));    
    
    if(label!='TOTAL'){
      if(tabTitle =='LMOS'){
      this.newTabTitle = 'Screening';
      tabTitle = this.tabTitle.substring(0,this.tabTitle.lastIndexOf('_'));
   
    }
    else{
      tabTitle = 'LMOS';
      this.newTabTitle = this.tabTitle.substring(this.tabTitle.lastIndexOf(' ')+1);     
    }
  }
    setTimeout(()=> {this.activeIndex = -1}, 500);
    var request = {}
    if(label && label.toLowerCase() == 'Total') {
      label = '';      
      request['sourceSystemList'] = ['LMOS']
      //this.newTabTitle = 'Total'
    }
    if(this.level == 'getSystemTaskCount') {
      request['taskStatus'] = label;
      request['sourceSystemList'] = [tabTitle]

    } else if(this.level == 3) {
      request['taskStatus'] = label;
      request['sourceSystemList'] = [tabTitle]
    } else  {
      request['taskStatus'] = label;
      request['sourceSystemList'] = ['LMOS']
      
      
      if (this.tabTitle != 'LMOS') {
        request["workgroupList"] = [this.tabTitle]
        
      } 

    }
    this.taskService.searchTask(request).toPromise().then((result: any) => {
      this.isLoading = false;
      if (result && result.taskResults && result.taskResults.length > 0) {
        this.dataStorageService.setData(result.taskResults);
        this.dataStorageService.setPagination(result.pagination);
        this.dataStorageService.setSearchCriteria(request);
        let tab = new Tab(SearchResultComponent, this.newTabTitle +' Search Result', 'searchTask', {});
        this.tabService.openTab(tab);
      } else {
        this.snackBar.open("No Data Found for the provided criteria, Please try searching with valid data.", "Okay", {
          duration: 15000,
        });
      }
    }, (error: any) => {
      this.isLoading = false;      
      console.log(error);
    });
    }
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

  openWorkTypeTab(worktype, taskStatus) {
    setTimeout(()=> {this.isLoading = true;}, 500);
    this.isLoading = true;
    let taskType = this.tabTitle.substring(this.tabTitle.lastIndexOf('_')+1);
    if(taskType == "SCREENERS"){
    this.advanceSearchData= {"searchFields":[ 
      {"fieldName":"taskType","value":["Screening Trouble-Ticket"],"operator":"IN"},     
      {"fieldName":"sourceSystem","value":["LMOS"],"operator":"IN"},
      {"fieldName":"workType","value":[worktype],"operator":"IN"},
      {"fieldName":"taskStatus","value":[taskStatus],"operator":"IN"},
      {
        "fieldName": "workgroup",
        "value": [this.tabTitle],
        "operator": "IN"
    }
      ]};
    }
    else{
      this.advanceSearchData= {"searchFields":[ 
        {"fieldName":"taskType","value":["RCMAC Trouble-Ticket"],"operator":"IN"},     
        {"fieldName":"sourceSystem","value":["LMOS"],"operator":"IN"},
        {"fieldName":"workType","value":[worktype],"operator":"IN"},
        {"fieldName":"taskStatus","value":[taskStatus],"operator":"IN"}, 
        {
          "fieldName": "workgroup",
          "value": [this.tabTitle],
          "operator": "IN"
      }
        ]};
    }
      this.isLoading = true;
    this.taskService.advancedSearchV3Task(this.advanceSearchData).toPromise().then((result: any) => {           
      if (result && result.taskResults && result.taskResults.length > 0) {              
        if (result.taskResults.length > 0) {
          this.dataStorageService.setData(result.taskResults);
          this.dataStorageService.setPagination(result.pagination);
          this.dataStorageService.setSearchCriteria(this.advanceSearchData);
          let tab = new Tab(SearchResultComponent, 'Search Result', 'searchTask', {});
          this.tabService.openTab(tab);
          this.isLoading = false; 
        }
        this.isLoading = false;
        
      } 
      this.isLoading = false;
    }, (error: any) => {
      this.isLoading = false; 
      //console.log(error);
      //this.MainLoader.emit({status : false});
      //this.message.emit({status: false, message: error.error.message});
      //this.disableSearch = false;
      this.snackBar.open("Error Searching for Task", "Okay", {
       duration: 15000,
      });
    });







    
    /*this.workTypeSearch =this.taskService.advancedSearchV3Task(data).toPromise().then((result: any) => {
      (data) => { this.searchFields = data; },
     (err) => console.log(err)
    );*/
    
    //console.log(componentStr); 
    //let tab = new Tab(this.getComponentType(componentStr), title, url, {});
    //let tab = new Tab(SearchResultComponent, this.newTabTitle +' Search Result', 'searchTask', data);
    //this.tabService.openTab(tab);
    //this.isLoading = false;
    //this.isLoading = true;  
    //console.log(componentStr); 
    //let tab = new Tab(this.getComponentType(componentStr), title, url, {});
    //this.tabService.openTab(tab);
    //this.isLoading = false;
  }
  getComponentType(componentStr: string): Type<any> {   
    let componentType: Type<any>;
    switch (componentStr) {
       case 'AnalyticsComponent': componentType = AnalyticsComponent;
        break;
    }
    return componentType;
  }

  ngAfterViewInit() {
   
  }

}

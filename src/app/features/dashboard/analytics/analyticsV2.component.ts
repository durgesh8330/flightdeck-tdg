import { Component, OnInit, Type, AfterViewInit } from '@angular/core';
import { DashboardService } from '@app/features/dashboard/dashboard.service';
import { Tab } from '@app/core/tab/tab.model';
import { TabService } from '@app/core/tab/tab-service';
import { TaskService } from '@app/features/task/task.service';
import { SearchResultComponent } from '@app/features/task/search-result/search-result.component';
import { DataStorageService } from '@app/features/task/data-storage.service';
import { MatSnackBar } from '@angular/material';
import { SearchDataService } from "@app/features/dashboard/search-data/search-data.service";

@Component({
    selector: 'sa-analyticsV2',
    templateUrl: './analyticsV2.component.html',
    styleUrls: ['./analytics.component.scss']
})

export class AnalyticsComponentV2 implements OnInit, AfterViewInit {

    public loader = false;
    public pageLayout = "";
    public templateLayout ="";
    public activeIndex = -1;
    public tabTitle = "";
    public newTabTitle = "";

    constructor(
        private tabService: TabService,
        private taskService: TaskService,
        private dashboardService:DashboardService,
        private dataStorageService: DataStorageService,
        private snackBar: MatSnackBar,
        private searchDataService: SearchDataService
    ) {
    
    }

    ngOnInit() {
        const userObj = JSON.parse(localStorage.getItem('fd_user'));
        console.log("userObj", userObj);
        this.loader = true;
        var templateName = "dashboardLayout_managerDashByUser";
        var templatePath = '/PageLayoutTemplate/Get/' + templateName;//this.tabService.lastUrl;
        this.dashboardService.getDashboardTemplate(templatePath).toPromise().then((result:any)=>{
            this.pageLayout = result
            this.templateLayout = this.pageLayout['pageLayoutTemplate'];
            console.log("Dashboard templateLayout ==>", this.templateLayout);
            this.getDataFromApi();
        }, (error:any)=>{console.log(error);})
        
    }

    ngAfterViewInit(): void {
        //throw new Error("Method not implemented.");
    }

    getDataFromApi() {
        for (let i = 0; this.templateLayout.length > i; i++){
            if(this.templateLayout[i]["URLPath"]){
                var self = this;
                (function(i, self) {
                    self.dashboardService.sourceSystem(self.templateLayout[i]["URLPath"]).toPromise().then((result:any)=>{
                        if(self.templateLayout[i]["key"]){
                            for (var key in result) {
                                if(key == self.templateLayout[i]["key"]){
                                    self.templateLayout[i]["data"] = result[key];
                                }
                            }
                        }else{
                            self.templateLayout[i]["data"] = result;
                        }
                        if(self.templateLayout[i]["sectionStyle"] == "Buttons"){
                            //match button data with layouts fields list
                            /* for(let j = 0; self.templateLayout[i]["fieldsList"].length > j; j++){
                                for(let h = 0; self.templateLayout[i]["data"].length > h; h++){
                                    if(self.templateLayout[i]["fieldsList"][j].key == self.templateLayout[i]["data"][h].taskStatus){
                                        self.templateLayout[i]["fieldsList"][j].fieldValue = self.templateLayout[i]["data"][h].taskCount;
                                        break;
                                    }
                                }
                            } */
                            //match data with fields list and add missing fields to fields list
                            for(let h = 0; self.templateLayout[i]["data"].length > h; h++){
                                var found = false;
                                for(let j = 0; self.templateLayout[i]["fieldsList"].length > j; j++){
                                    if(self.templateLayout[i]["fieldsList"][j].key == self.templateLayout[i]["data"][h].taskStatus){
                                        self.templateLayout[i]["fieldsList"][j].fieldValue = self.templateLayout[i]["data"][h].taskCount;
                                        found = true;
                                        break;
                                    }
                                }
                                if(!found){
                                    if(self.templateLayout[i]["data"][h].taskStatus && self.templateLayout[i]["data"][h].taskStatus != "Complete" && self.templateLayout[i]["data"][h].taskStatus != "Completed" && self.templateLayout[i]["data"][h].taskStatus != "Cancelled"){
                                        var newButton={
                                            "visible": true,
                                            "label": self.templateLayout[i]["data"][h].taskStatus,
                                            "fieldValue": self.templateLayout[i]["data"][h].taskCount,
                                            "key": self.templateLayout[i]["data"][h].taskStatus,
                                            "icon": "fa fa-bars",
                                            "color": "#4da944"
                                        };
                                        self.templateLayout[i]["fieldsList"].splice(self.templateLayout[i]["fieldsList"].length-1, 0, newButton);
                                    }
                                }
                            }

                        }
                        if(self.templateLayout.length-1 == i){
                            self.loader = false;
                        }
                    }, (error:any)=>{console.log(error);self.loader = false;});
                })(i,self);
                console.log("this.templateLayout ==>", this.templateLayout);
                
            }
            if(this.templateLayout[i]["sectionStyle"] == "Table"){
            
                var tableColumns = [];
                for(let j = 0; this.templateLayout[i]["fieldsList"].length > j; j++){
                    tableColumns.push( this.templateLayout[i]["fieldsList"][j].key);
                }
                this.templateLayout[i]["tableColumns"] = tableColumns;
                console.log("this.templateLayout[i][tableColumns] ==>", this.templateLayout[i]["tableColumns"]);
            
            }
        }
    }

    summaryCount(label, count, index) {
    
         if(count > 0) {
            const userObj = JSON.parse(localStorage.getItem('fd_user'));
            this.loader = true;
            this.activeIndex = index;
            //let tabName = this.tabTitle + ' ' + label;
            //var tabTitle = this.tabTitle.substring(0,this.tabTitle.lastIndexOf('_'));    
            this.newTabTitle = label;

            setTimeout(()=> {this.activeIndex = -1}, 500);
            
            
            var request = {};
            //simple search
            /*request['taskStatus'] = label;
            request["workgroupList"] = []; */
            //advance search
            var workGroups = [];

            //by workgroupRolesList
            /* for(let i = 0; i < userObj.workgroupRolesList.length; i++){
                request["workgroupList"].push(userObj.workgroupRolesList[i].workgroupName)
            } */
            //by workgroupsList
            for(let i = 0; i < userObj.workgroupsList.length; i++){
                //request["workgroupList"].push(userObj.workgroupsList[i].name);//simple search
                workGroups.push(userObj.workgroupsList[i].name);//advance search
            }

            //advance search
            if(label != "Total"){
                request = {"searchFields":[
                    {"fieldName":"taskStatus","value":[label],"operator":"IN"}, 
                    {"fieldName": "workgroup", "value": workGroups, "operator": "IN"}
                ]};
            }else{
                request = {"searchFields":[
                    {"fieldName":"taskStatus","value":["Complete","Completed","Cancelled"],"operator":"NOT IN"}, 
                    {"fieldName": "workgroup", "value": workGroups, "operator": "IN"}
                ]}; 
            }
            

            //this.taskService.searchTask(request).toPromise().then((result: any) => {//simple search
            this.taskService.advancedSearchV3Task(request).toPromise().then((result: any) => {//advance search
                this.loader = false;
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
                this.loader = false;      
                console.log(error);
            });
        } 
    }

}
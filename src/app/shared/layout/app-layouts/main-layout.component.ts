import {Component, ElementRef, OnInit} from "@angular/core";
import { routerTransition } from "@app/shared/utils/animations";
import { Tab } from "@app/core/tab/tab.model";
import { TabService } from "@app/core/tab/tab-service";
import {MatTabChangeEvent} from "@angular/material";
import { NotificationService } from "@app/core/services";
import { TaskDetailsComponent } from "@app/features/task/task-details/task-details.component";
import { DataStorageService } from "@app/features/task/data-storage.service";
import { Router } from "@angular/router";
import {AppService} from '@app/app.service'
import { TaskService } from "@app/features/task/task.service";
import { MyTaskComponent } from '@app/features/task/my-task/my-task.component';

declare var $: any;

@Component({
	selector: "app-main-layout",
	templateUrl: "./main-layout.component.html",
	styles: [`.main-tab-group {
    border: none;
  }
  
  .close-icon:hover{
    color: red;
  }
  
  .close-icon{
    margin-left: 30px;
	}
	
  `],
	animations: [routerTransition]
})
export class MainLayoutComponent implements OnInit {

	public tabs = new Array<Tab>();
	selectedTab:number;
	menuLevel:any="";
	IsSuccess = false;
	message = '';
	IsError = false;
	loader = false;
	Headermenustatus = true;

	constructor(private appService: AppService, private tabService: TabService, private elRef: ElementRef,
		private notificationService: NotificationService, private taskService: TaskService, private dataStorageService: DataStorageService,
		private router: Router) {			
			let userObj: any = JSON.parse(localStorage.getItem('fd_user'));
		this.tabService.contentComponentService.subscribe((tabs) =>{			
			this.tabs = tabs;
			this.selectedTab = tabs.findIndex(x => x.active);			
		});
		
		if (userObj && userObj.authorizations){
			if(userObj.authorizations.indexOf("LeftMenu_LMOS") > -1) {
				this.menuLevel = "LeftMenu_LMOS";
			}else if(userObj.authorizations.indexOf("LeftMenu_WG_ASRI") > -1){
				this.menuLevel = "LeftMenu_WG_ASRI";
			}else{
				// No template assigned Component
				this.menuLevel = "LeftMenu_Basic";	
			}
		} else{
			// No template assigned Component
			this.menuLevel = "LeftMenu_Basic";
		}
		let paramUrl = this.router.url;
		//let paramDetails = paramUrl.split('?')[1].split('=')[1].split('&');
		let paramDetails = paramUrl.split('=')[1];
		console.log('router element  ' + paramDetails);
		if(paramUrl.includes('id')){
			console.log('router element  ' + paramDetails);
			this.displayMailTask(paramDetails);
			//console.log('router element  after' + paramDetails);
		}
		if(this.appService.taskMailDetails) {
			console.log('login after db instance value '+ this.appService.taskMailurl);
			const dbInstanceVal = this.appService.taskMailurl['id'];
			console.log('object value '+ dbInstanceVal);
			this.displayMailTask(dbInstanceVal);
		}
	}

	ngOnInit() {
		if(this.tabService.tabs.length > 0) {
			this.notificationService.smartMessageBox({
					title: "Confirm",
					content: "Do you want to keep your previous session Active?",
					buttons: '[No][Yes]'
				}, (ButtonPressed) => {
					if (ButtonPressed === "Yes") {
							this.tabService.contentComponentService.next(this.tabService.tabs);						
					}
					if (ButtonPressed === "No") {
							this.tabService.tabs = new Array<Tab>();
							this.tabService.contentComponentService.next(this.tabService.tabs)
					}   
					                   
				});
				this.selectedTab = this.tabService.tabs.length - 1;
			}
	}

	removeTab(index: any): void {
		this.tabService.removeTab(index);
	}

	tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {		
		$('body').removeClass('jarvis_fullscreen');
		$("div[id=jarviswidget-fullscreen-mode]").removeAttr('id');
		this.tabService.updateGraphService();
		//console.log(this.tabs);
		let topNavigation = JSON.parse(localStorage.getItem("topNavigation"));
		let leftNavigation = JSON.parse(localStorage.getItem('leftNavigation'));
		let statusManagerLeftNavigation = JSON.parse(localStorage.getItem('statusManagerLeftNavigation'));
		let lmosLeftNavigation = JSON.parse(localStorage.getItem('lmosLeftNavigation'));
		let ipvpnLeftNavigation = JSON.parse(localStorage.getItem('ipvpnLeftNavigation'));
		const entireLeftNav = [
			...leftNavigation.pageLayoutTemplate.leftMenu,
			...statusManagerLeftNavigation.pageLayoutTemplate.leftMenu,
			...lmosLeftNavigation.pageLayoutTemplate.leftMenu,
			...lmosLeftNavigation.pageLayoutTemplate.menuItems,
			...ipvpnLeftNavigation.pageLayoutTemplate.leftMenu,
			...ipvpnLeftNavigation.pageLayoutTemplate.leftBottomMenu
		]
		const topData = topNavigation.pageLayoutTemplate.topNavigation.myProfileSubMenu.find((menu) => menu.url === this.tabs[tabChangeEvent.index]['url']);
		const leftData = entireLeftNav.find(menu => menu.headerLabel === this.tabs[tabChangeEvent.index]['title']);
		if (topData) {			
			for(var i=0; i<this.tabs.length; i++){
				if(topData.title == "Manage Workgroups" && this.tabs[i].title == topData.title){
					let workGroupName= 	this.tabs[i]["tabData"].queryHistrory;
					this.tabService.getWorkGroupname(workGroupName);
				}
				else if(topData.title == "Manage User" && this.tabs[i].title==topData.title){
					//this.tabService.getWorkGroupname(this.tabs[i]["tabData"].requiredData);
				}
			}
			this.router.navigate([topData.routerLink]);
		} else if (leftData) {
			this.router.navigate([leftData.routerLink]);
		}
		try {
			if (this.tabs[tabChangeEvent.index] && this.tabs[tabChangeEvent.index]['url'] && this.tabs[tabChangeEvent.index]['url'] == 'TaskDetailsComponent') {
				// console.log($('body .modal.fade.in').attr('data-id'));
				// console.log($('.ng-tns-c0-0 .main-tab-group .mat-tab-header .mat-tab-label-container .mat-tab-list .mat-tab-labels .mat-tab-label-active .mat-tab-label-content').text().trim());
				// if ($('body .modal.fade.in').attr('data-id') == $('.ng-tns-c0-0 .main-tab-group .mat-tab-header .mat-tab-label-container .mat-tab-list .mat-tab-labels .mat-tab-label-active .mat-tab-label-content').text().trim()) {
					// $('body .modal.fade.in').removeClass('hide');
					window.scroll(0,0);
					this.elRef.nativeElement.ownerDocument.body.style.overflow = 'hidden';
					$($('body .modal.fade.in')).each(function(key, val) {
						if ($(val).attr('data-id') == $('.ng-tns-c0-0 .main-tab-group .mat-tab-header .mat-tab-label-container .mat-tab-list .mat-tab-labels .mat-tab-label-active .mat-tab-label-content').text().trim()) {
							// console.log(val);
							$(val).removeClass('hide');
						} else {
							$(val).addClass('hide');
						}
					});
				// }
			} else {
				$('body .modal.fade.in').addClass('hide');
				this.elRef.nativeElement.ownerDocument.body.style.overflow = 'auto';
			}
		} catch (e) {
			$('body .modal.fade.in').addClass('hide');
		}
	}

	autoselect() {
		
		this.loader = true;
		var UserDetails = JSON.parse(localStorage.getItem('defaultValue'));
	    this.taskService.GetNext(UserDetails.personalInfo.cuid).toPromise().then((result: any) => {
			let assignedIds = result.id.split(',');
			if(assignedIds.length==1){
				this.taskService.getTask(result.id, 'Screening').toPromise().then((response: any) => {
					this.loader = false;
					let tab = new Tab(TaskDetailsComponent, 'Task : '+response['sourceTaskId'], 'TaskDetailsComponent', response);
                     this.tabService.openTab(tab);
				});
			}else{  //GETCWM-10051 If more than one task is in response then my task should open
				this.loader = false;
				let tab = new Tab(MyTaskComponent, "My Tasks", "", {});
				this.tabService.openTab(tab);
				this.taskService.test.next(tab);
			}
	      this.IsSuccess = true;
	      this.message = result.message;
	      setTimeout(() => {
	        this.IsSuccess = false;
	      }, 7000);
	      // this.disableSearch = false;
	      //   this.snackBar.open(result.message, "Okay", {
	      //     duration: 15000,
	      //   });
	    }, (error: any) => {
				this.loader = false;
	      this.IsError = true;
	      this.message = error.error.message;
	      setTimeout(() => {
	        this.IsError = false;
	      }, 7000);
	      //this.loader = false;
	      // this.disableSearch = false;
	      // this.snackBar.open(error.error.message, "Okay", {
	      //   duration: 15000,
	      // });
	    }); 
	}

	displayMailTask(paramDetails) {
		
		this.loader = true;
		var UserDetails = JSON.parse(localStorage.getItem('defaultValue'));
	    this.taskService.getMailTask(paramDetails).toPromise().then((response: any) => {
			this.loader = false;
			let tab = new Tab(TaskDetailsComponent, 'Task : '+response['sourceTaskId'], 'TaskDetailsComponent', response);
  this.tabService.openTab(tab);
		}), (error: any) => {
				this.loader = false;
	      this.IsError = true;
	      this.message = error.error.message;
	      setTimeout(() => {
	        this.IsError = false;
	      }, 7000);
	      //this.loader = false;
	      // this.disableSearch = false;
	      // this.snackBar.open(error.error.message, "Okay", {
	      //   duration: 15000,
	      // });
	    };
	}

	LoaderStatus(data) {
		this.loader = data.status;
	}

	displayMessage(data) {
		
		if (data.status) {
			this.IsSuccess = true;
			this.message = data.message;
			setTimeout(() => {
				this.IsSuccess = false;
			}, 7000);
		} else {
			this.IsError = true;
			this.message = data.message;
			setTimeout(() => {
			  this.IsError = false;
			}, 7000);
		}
	}

	HeaderMenuStatus(Status) {
		
		this.Headermenustatus = Status;
		if (Status) {
			$("body nav .sbmt-btn").removeClass('auto-select-button-width-fullscreen');
        	$("body nav .sbmt-btn").parent().removeAttr('style');
		} else {
			$("body nav .sbmt-btn").addClass('auto-select-button-width-fullscreen');
        	$("body nav .sbmt-btn").parent().css({"margin-left": "-120px"});
		}
	}

}

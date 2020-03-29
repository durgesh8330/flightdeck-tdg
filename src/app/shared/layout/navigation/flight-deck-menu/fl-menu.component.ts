import { Component, OnInit, Type, EventEmitter, Output } from '@angular/core';
import { SearchTaskComponent } from '@app/features/task/search-task/search-task.component';
import { TabService } from '@app/core/tab/tab-service';
import { LayoutService } from '@app/core/services';
import { Tab } from '@app/core/tab/tab.model';
import { AnalyticsComponent } from '@app/features/dashboard/analytics/analytics.component';
import { AnalyticsComponentV2 } from '@app/features/dashboard/analytics/analyticsV2.component';
import { WorkmateTaskComponent } from '@app/features/asri-task/workmate-task.component';
import { UniSprComponent } from '@app/features/uni-spr/uni-spr.component';
import { EvcComponent } from '@app/features/evc/evc.component';
import { ThemeBuilderComponent } from '@app/features/user-profile/theme-builder/theme-builder.component';
import { ManageUserComponent } from '@app/features/user-profile/manage-user/manage-user.component';
import { UserProfileService } from '@app/features/user-profile/user-profile.service';
import { MyTaskComponent } from '@app/features/task/my-task/my-task.component';
import { MyWorkgroupTaskComponent } from '@app/features/task/my-workgroup-task/my-workgroup-task.component';

@Component({
	selector: 'fl-menu',
	templateUrl: './fl-menu.component.html',
	styles: ['.sbmt-btn{background: #49d597;border-color: #49d597;} .sbmt-btn:hover {background: #001e60 !important;border-color: #001e60 !important;}']
})
export class FlightDeckMenuComponent implements OnInit {
	public permissionList = [];
	public leftMenuData = { leftMenu: [] };

	@Output() AutoSelectCall = new EventEmitter();

	constructor(
		private tabService: TabService,
		private layoutService: LayoutService,
		private profileService: UserProfileService
	) {
		this.getTemplateData();
	}

	ngOnInit() {
		let themeLink = JSON.parse(localStorage.getItem('themeLink'));
		if (themeLink && themeLink.leftMenu) {
			this.permissionList = themeLink.leftMenu.split(';');
			if (!this.permissionList) {
				this.permissionList = [];
			}
		}
	}
	getTemplateData() {
		let parsedJSON = JSON.parse(localStorage.getItem('leftNavigation'));

		if (parsedJSON) {
			this.leftMenuData = parsedJSON.pageLayoutTemplate;
			/*const userObj = JSON.parse(localStorage.getItem('fd_user'));
			if (userObj && userObj.authorizations && userObj.authorizations.length > 0) {
				this.checkAccessLevels(userObj.authorizations);
			} else {
				this.leftMenuData.leftMenu = [];
			}*/
			//this.leftNavigationPermissions();
		}
	}

	checkAccessLevels(authorizations: any) {
		const usersLeftPermissions = authorizations.filter((authElement: any) => authElement.startsWith('LeftMenu'));
		for (let i = 0; i < this.leftMenuData.leftMenu.length; i++) {
			const menuItem: any = this.leftMenuData.leftMenu[i];
			if (menuItem && ((menuItem['headerLabel'] == 'Dashboard' && usersLeftPermissions.indexOf('LeftMenu_dashboard') == -1) ||
				(menuItem['headerLabel'] == 'Task' && usersLeftPermissions.indexOf('LeftMenu_advancedTaskSearch') == -1) ||
				(menuItem['headerLabel'] == 'Create' && usersLeftPermissions.indexOf('LeftMenu_ASRITask_Create') == -1) ||
				(menuItem['headerLabel'] == 'My Tasks' && usersLeftPermissions.indexOf('LeftMenu_myTasks') == -1) ||
				(menuItem['headerLabel'] == 'My Workgroup Tasks' && usersLeftPermissions.indexOf('LeftMenu_myGroupsTasks') == -1))) {
				this.leftMenuData.leftMenu.splice(i, 1);
				i--;
			}
		}
	}

	leftNavigationPermissions() {
		let accessLevelsJSON = JSON.parse(localStorage.getItem('accessLevels'));
		let menus = [];
		menus = accessLevelsJSON.Menus;

		let dashboard = false;
		let taskSearch = false
		let createTask = false;
		let mytasks = false;
		let myworkgroupTasks = false;

		if (menus && menus.length > 0) {
			for (let i = 0; i < menus.length; i++) {
				if (menus[i].permissionName == 'Dashboard' && menus[i].permissionLevel == 'Read/Write') {
					dashboard = true;
				} else if (menus[i].permissionName == 'Task_Advance_Search' && menus[i].permissionLevel == 'Read/Write') {
					taskSearch = true;
				} else if (menus[i].permissionName == 'Task_Create' && menus[i].permissionLevel == 'Read/Write') {
					createTask = true;
				} else if (menus[i].permissionName == 'My_Tasks' && menus[i].permissionLevel == 'Read/Write') {
					mytasks = true;
				} else if (menus[i].permissionName == 'My_Workgroup_Tasks' && menus[i].permissionLevel == 'Read/Write') {
					myworkgroupTasks = true;
				}
			}
		}

		if (!dashboard) {
			this.deleteItemFromLeftMenu('Dashboard');
		}

		if (!taskSearch) {
			this.deleteItemFromLeftMenu('Task');
		}

		if (!createTask) {
			this.deleteItemFromLeftMenu('Create');
		}

		if (!mytasks) {
			this.deleteItemFromLeftMenu('My Tasks');
		}

		if (!myworkgroupTasks) {
			this.deleteItemFromLeftMenu('My Workgroup Tasks');
		}

	}

	deleteItemFromLeftMenu(headerLabel: string) {
		for (let j = 0; j < this.leftMenuData.leftMenu.length; j++) {
			if (this.leftMenuData.leftMenu[j].headerLabel == headerLabel) {
				this.leftMenuData.leftMenu.splice(j, 1)
				break;
			}
		}
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
				componentType = SearchTaskComponent;
				break;
			case 'WorkmateTaskComponent':
				componentType = WorkmateTaskComponent;
				break;
			case 'AnalyticsComponent':
				componentType = AnalyticsComponent;
				break;
			case 'AnalyticsComponentV2':
				componentType = AnalyticsComponentV2;
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
			// case 'ManageUserComponent': componentType = ManageUserComponent;
			// break;
		}
		return componentType;
	}

	toggleOnHover(state) {
		this.layoutService.onMouseToggleMenu(state);
	}

	onClickLink(state, e) { }
	@Output() showMainMenu = new EventEmitter();
	swithcToMainMenu() {
		this.showMainMenu.emit();
	}

	AutoSelect() {
		this.AutoSelectCall.emit();
	}
}

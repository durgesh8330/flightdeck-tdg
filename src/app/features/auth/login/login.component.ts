import { Component, OnInit, Type } from '@angular/core';
import { Router } from "@angular/router";
import { AppService } from '../../../app.service';
import { environment } from '@env/environment';import { AuthService, UserService, LayoutService } from '@app/core/services';
import { SessionExpirationAlertService } from '@app/core/session-expiration-alert/session-expiration-alert.service';
import {config} from '@app/core/smartadmin.config';
import { UserProfileService } from '@app/features/user-profile/user-profile.service';

import {SearchTaskComponent} from '@app/features/task/search-task/search-task.component';
import {TabService} from '@app/core/tab/tab-service';
import {Tab} from '@app/core/tab/tab.model';
import {AnalyticsComponent} from '@app/features/dashboard/analytics/analytics.component';
import {WorkmateTaskComponent} from '@app/features/asri-task/workmate-task.component';
import {UniSprComponent} from '@app/features/uni-spr/uni-spr.component';
import {EvcComponent} from '@app/features/evc/evc.component';
import {ThemeBuilderComponent} from '@app/features/user-profile/theme-builder/theme-builder.component';
import {MyTaskComponent} from '@app/features/task/my-task/my-task.component';
import {MyWorkgroupTaskComponent} from '@app/features/task/my-workgroup-task/my-workgroup-task.component';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

    public userName;
    public password;

    errorMsg: string;
    authError: boolean = false;
    logintext = 'Login';

    constructor(public router: Router, private appService: AppService,
        private sessionTimeoutService: SessionExpirationAlertService,
        private tabService: TabService,
        private userService: UserService,
        private profileService:UserProfileService,
        private layoutService: LayoutService) { }


    ngOnInit() {
        console.log('login');
    }

    login(event) {
        event.preventDefault();

        console.log('on submit');
        const cuid = this.userName;
        const password = this.password;
        this.errorMsg = ''; // reset error message and authError flag
        this.authError = false;
        if (!cuid || !password) {
            this.authError = true;
            this.errorMsg = 'Please enter valid cuid/password.';
            return;
        }

        let loginData = { "cuid": cuid, "password": password };
        this.logintext = 'Logging In'
        //this.appService.authenticateUser(loginData).toPromise().then((data: any) => {
        this.appService.obtainAccessToken(loginData).toPromise().then((data: any) => {
            if(data.authorized == true && data.roles && data.roles.length > 0){
                localStorage.setItem('fd_access_token', '123456');
                localStorage.setItem('fd_refresh_token', '1231313');
                localStorage.setItem('fd_user', JSON.stringify(data));
                localStorage.setItem('fd_expires_in', environment.sessionDefaultTimeout.toString());
                //this.appService.checkAuthorizationNew(data.cuid).toPromise().then((response: any) => {
                this.appService.checkAuthorization(data.cuid).toPromise().then((response: any) => {
                    const appList = response.appsList;
                    const userDetails = {...response, ...data};
                    /* userDetails.authorizations = [...userDetails.authorizations, 'LeftMenu_WG_RCMAC','RCMACLeftMenuAutoSelect','RCMACLeftMenu_MenuItems',
                    'RCMACLeftMenu_SearchTask',
                    'RCMACLeftMenu_FrequentlyAccessed', 'RCMACTaskSearch', 'LMOSTaskSearch']; */
                    localStorage.setItem('fd_user', JSON.stringify(userDetails));
                    if (appList && appList.length > 0) {
                        for (let i = 0; i < appList.length; i++) {
                            if (appList[i].appName && (appList[i].appName === 'FlightDeck')) {

                                //this.layoutService.getUserPreferencesNew(data.cuid).toPromise().then((themeLink:any) => {
                                this.layoutService.getUserPreferences(data.cuid).toPromise().then((themeLink: any) => {
                                    this.layoutService.getUserPreferencesNew(data.cuid).subscribe((resps: any) => {
                                        console.log(" ====>>> Theme link : ", themeLink);
                                        let selectedTheme = 'century-link';
                                        let defaultTab = 'FIRST LEVEL; FLIGHTDECK';
                                        themeLink.userPreference = resps.appsList.find(app => app.appName === "FlightDeck").userPreference;
                                        if (themeLink.userPreference) {
                                            const userPreference = JSON.parse(themeLink.userPreference);
                                            selectedTheme = (userPreference && userPreference.selectedTheme) ? userPreference.selectedTheme : 'century-link';
                                            defaultTab = (userPreference && userPreference.defaultTab) ? userPreference.defaultTab : 'FIRST LEVEL; FLIGHTDECK';

                                            let $body = $('body');
                                            let bodyClass = [];
                                            if (userPreference.layoutOptions && userPreference.layoutOptions.length > 0) {
                                                if (userPreference.layoutOptions.indexOf('Fixed Header') !== -1) {
                                                    bodyClass.push('fixed-header');
                                                }
                                                if (userPreference.layoutOptions.indexOf('Fixed Footer') !== -1) {
                                                    bodyClass.push('fixed-page-footer');
                                                }
                                                if (userPreference.layoutOptions.indexOf('Fixed Navigation') !== -1) {
                                                    bodyClass.push('fixed-navigation');
                                                }
                                                if (userPreference.layoutOptions.indexOf('Fixed Ribbon') !== -1) {
                                                    bodyClass.push('fixed-ribbon');
                                                }
                                                if (bodyClass.length > 0) {
                                                    console.log("Adding class =>> ", bodyClass.join(' '));
                                                    $body.addClass(bodyClass.join(' '));
                                                }
                                            }
                                        }

                                        localStorage.defaultValue = JSON.stringify(themeLink)
                                        const path = "assets/css/" + selectedTheme + "/theme.css"
                                        console.log("changing css url : ", path);

                                        document.getElementById('custom-theme').setAttribute('href', path);

                                        let gotoRoute = 'task';
                                        let componentString = '';
                                        let title = '';
                                        let url = '';
                                        defaultTab = null;
                                        // Redirect Tab
                                        switch (defaultTab) {
                                            case 'FIRST LEVEL; FLIGHTDECK':
                                                gotoRoute = 'dashboard';
                                                componentString = 'AnalyticsComponent';
                                                title = 'FLIGHTDECK Dashboard';
                                                url = 'getSystemTaskCount';
                                                break;
                                            case 'SECOND LEVEL; ASRI':
                                                gotoRoute = 'dashboard';
                                                componentString = 'AnalyticsComponent';
                                                title = 'ASRI Dashboard';
                                                url = 'getSystemTaskCount/ASRI';
                                                break;
                                            case 'SECOND LEVEL; HOOVER':
                                                gotoRoute = 'dashboard';
                                                componentString = 'AnalyticsComponent';
                                                title = 'HOOVER Dashboard';
                                                url = 'getSystemTaskCount/HOOVER';
                                                break;
                                            case 'SECOND LEVEL; BPMS':
                                                gotoRoute = 'dashboard';
                                                componentString = 'AnalyticsComponent';
                                                title = 'BPMS Dashboard';
                                                url = 'getSystemTaskCount/BPMS';
                                                break;
                                            case 'THIRD LEVEL; BPMS; TEST':
                                                gotoRoute = 'dashboard';
                                                componentString = 'AnalyticsComponent';
                                                title = 'FLIGHTDECK Dashboard';
                                                url = 'getSystemTaskCount';
                                                break;
                                            case 'SECOND LEVEL; SPR,SEARCH':
                                                gotoRoute = 'dashboard';
                                                componentString = 'AnalyticsComponent';
                                                title = 'SPR Dashboard';
                                                url = 'getSystemTaskCount/SPR';
                                                break;
                                        }


                                        // localStorage.setItem('fd_profileAppsList', JSON.stringify(appList));
                                        // this.authError = false;
                                        // this.sessionTimeoutService.refreshSessionTimeout(localStorage.getItem('fd_expires_in'));
                                        // this.sessionTimeoutService.setUserActivity();
                                        // this.userService.subscribeUserInfo();

                                        this.profileService.getWorkgroupTemplateData("FlightDeckLeftMenu").toPromise().then((response: any) => {
                                            localStorage.setItem("leftNavigation", JSON.stringify(response));
                                            this.profileService.getWorkgroupTemplateData("FlightDeckTopMenu").toPromise().then((topNavResponse: any) => {
                                                localStorage.setItem("topNavigation", JSON.stringify(topNavResponse));
                                                this.profileService.getWorkgroupTemplateData("StatusManagerLeftMenu").toPromise().then((statusManagerResponse: any) => {
                                                    localStorage.setItem("statusManagerLeftNavigation", JSON.stringify(statusManagerResponse));
                                                    this.profileService.getWorkgroupTemplateData("LmosLeftMenu").toPromise().then((lmosResponse: any) => {
                                                        localStorage.setItem("lmosLeftNavigation", JSON.stringify(lmosResponse));
                                                        this.profileService.getWorkgroupTemplateData("IpvpnleftMenu").toPromise().then((ipvpnResponse: any) => {
                                                            localStorage.setItem("ipvpnLeftNavigation", JSON.stringify(ipvpnResponse));
                                                            this.profileService.getWorkgroupTemplateData("R2DG-LeftPanell").toPromise().then((R2DGResponse: any) => {
                                                                localStorage.setItem("r2dgLeftNavigation", JSON.stringify(R2DGResponse));
                                                                this.router.navigate(['/' + gotoRoute]);
                                                                this.openTab(componentString, title, url);
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });                                    
                                });
                                
                                localStorage.setItem('fd_profileAppsList', JSON.stringify(appList));
                                this.authError = false;
                                this.sessionTimeoutService.refreshSessionTimeout(localStorage.getItem('fd_expires_in'));
                                this.sessionTimeoutService.setUserActivity();
                                this.userService.subscribeUserInfo();
                                break;
                            }
                            this.authError = true;
                        };

                        if (this.authError) {
                            this.logintext = 'Login'
                            localStorage.removeItem('fd_access_token');
                            localStorage.removeItem('fd_user');
                            localStorage.removeItem('fd_refresh_token');
                            localStorage.removeItem('fd_expires_in');
                            this.errorMsg = cuid + " User does not have access to the apps, please check with Admin.";
                        }
                    } else {
                        this.logintext = 'Login'
                        this.authError = true;
                        localStorage.removeItem('fd_access_token');
                        localStorage.removeItem('fd_user');
                        localStorage.removeItem('fd_refresh_token');
                        localStorage.removeItem('fd_expires_in');
                        this.errorMsg = cuid + " User does not have profile, please check with Admin.";
                    }
                    
                }).catch((error: any) => {
                    this.logintext = 'Login'
                    this.authError = true;
                    localStorage.removeItem('fd_access_token');
                    localStorage.removeItem('fd_user');
                    localStorage.removeItem('fd_refresh_token');
                    localStorage.removeItem('fd_expires_in');
                    this.errorMsg = cuid + " User Not authorized. ";
                });
            }else{
                this.logintext = 'Login';
                this.authError = true;
                this.errorMsg = 'You do not have access to FlightDeck, Please request access using Audio';
            }
        }).catch((error: any) => {
            this.logintext = 'Login'
            this.authError = true;
            this.errorMsg = "Please enter valid cuid/password.";
        });
    }

    openTab(componentStr, title, url) {
        if (componentStr) {
            let thi = this;
            setTimeout(function(){
                console.log("set timeout called");
                let tab = new Tab(thi.getComponentType(componentStr), title, url, {});
                thi.tabService.openTab(tab);
            },1500);
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
          // case 'ManageUserComponent': componentType = ManageUserComponent;
          // break;
        }
        return componentType;
    }
}
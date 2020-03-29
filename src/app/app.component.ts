import { Component } from '@angular/core';
import { SessionExpirationAlertService } from './core/session-expiration-alert/session-expiration-alert.service';
import { ThemeDefaultStyle } from './features/user-profile/theme-builder/theme.model';
import { LayoutService } from './core/services';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  template: '<router-outlet *ngIf="themeLoaded==true"></router-outlet>' +
   '<div *ngIf="themeLoaded==false">Loading.....</div>',
})
export class AppComponent {
  title = 'sa';
  themeLoaded:any = true;
  // private themeWrapper = document.querySelector('body');
  private themeWrapper = document.querySelector('body');
  public themeDefaultStyle: ThemeDefaultStyle;

  color1 = '';
  color2 = '';
  color3 = '';
  color4 = '';
  color5 = '';
  color6 = '';
  color7 = '';
  color8 = '';
  color9 = '';
  color10 = '';
  color11 = '';
  color12 = '';
  color13 = '';
  color14 = '';
  color15 = '';
  
  constructor(private appService: AppService, private sessionExpirationService: SessionExpirationAlertService,public layoutService: LayoutService){
    // Commenting until we fix the Auth Service issues
    // this.sessionExpirationService.refreshAccessToken();
    // this.sessionExpirationService.setUserActivity();
    // this.getBodyClass();
    
    // this.setDefaultBodyClass();


    //document.querySelector('.mat-tab-header').setAttribute('id',"ribbon");

    console.log('app level routing '+ window.location);
    if(window.location.href.includes("id")) {
      let urlParamValue = window.location.href;
    let paramDetails= urlParamValue.split('=');
    let params ={};
    let name = paramDetails[0].split('?');
    params['id'] = paramDetails[1];
    console.log(params);
    this.appService.taskMailurl = params;
    this.appService.taskMailDetails = true;
    
    }
    

    const localStore = JSON.parse(localStorage.getItem("custom-theme"));
    if(localStore && localStore.themeName){
      layoutService.applyTheme(localStore.response);
    }

    const userInfo = JSON.parse(localStorage.getItem('fd_user'));
    if(userInfo && userInfo['cuid'])
    {
      // load user's theme on refresh
      this.layoutService.getUserPreferences(userInfo['cuid']).toPromise().then((themeLink:any) => {
        let selectedTheme = 'century-link'
        if(themeLink.userPreference) {
            const userPreference = JSON.parse(themeLink.userPreference);
            selectedTheme = (userPreference && userPreference.selectedTheme) ? userPreference.selectedTheme : 'century-link';

            // Set body calss based on user preference
            let $body = $('body');
            let bodyClass = [];
            if(userPreference.layoutOptions && userPreference.layoutOptions.length > 0) {
              if(userPreference.layoutOptions.indexOf('Fixed Header') !== -1){
                  bodyClass.push('fixed-header');
              }
              if(userPreference.layoutOptions.indexOf('Fixed Footer') !== -1){
                  bodyClass.push('fixed-page-footer');
              }
              if(userPreference.layoutOptions.indexOf('Fixed Navigation') !== -1){
                  bodyClass.push('fixed-navigation');
              }
              if(userPreference.layoutOptions.indexOf('Fixed Ribbon') !== -1){
                bodyClass.push('fixed-ribbon');
              }
              if(userPreference.layoutOptions.indexOf('Menu on Top') !== -1){
                bodyClass.push('menu-on-top');
              }
              if(bodyClass.length > 0){
                  bodyClass.join(' ');
                  $body.addClass(bodyClass.join(' '));
              }
          }
        }
        localStorage.defaultValue = JSON.stringify(themeLink);
        const path = "assets/css/"+ selectedTheme +"/theme.css"
  
        document.getElementById('custom-theme').setAttribute('href',path);
        this.themeLoaded = true;
      });
    }
    

  }

  setDefaultBodyClass() {
    let $body = $('body');
    let bodyClass = localStorage.getItem('sm-skin');
    if(!bodyClass) {
      bodyClass = 'smart-style-0';
    }
    // $body.removeClass();
    $body.addClass(bodyClass);
    if (bodyClass) {
      bodyClass = bodyClass.replace(/-/g, '');
    }
    this.setDefaultColors(bodyClass);
  }

  // getBodyClass() {
  //   this.themeDefaultStyle = new ThemeDefaultStyle();
  //   let bodyClass = localStorage.getItem('sm-skin');
  //   if(bodyClass) {
  //   bodyClass = bodyClass.replace(/-/g, '');
  //   if (this.themeDefaultStyle[bodyClass]) {
  //     this.setDefaultColors(bodyClass);
  //   }
  // }
  // }

  setDefaultColors(bodyClass) {
    this.themeDefaultStyle = new ThemeDefaultStyle();
    this.color1 = this.themeDefaultStyle[bodyClass].navigation_background;
    this.color2 = this.themeDefaultStyle[bodyClass].footer_background;
    this.color3 = this.themeDefaultStyle[bodyClass].footer_font;
    this.color4 = this.themeDefaultStyle[bodyClass].leftPanel_background;
    this.color5 = this.themeDefaultStyle[bodyClass].leftPanel_font;
    this.color6 = this.themeDefaultStyle[bodyClass].header_background;
    this.color7 = this.themeDefaultStyle[bodyClass].header_font;
    this.color8 = this.themeDefaultStyle[bodyClass].title_background;
    this.color9 = this.themeDefaultStyle[bodyClass].title_font;
    this.color10 = this.themeDefaultStyle[bodyClass].content_background;
    this.color11 = this.themeDefaultStyle[bodyClass].content_font;
    this.color12 = this.themeDefaultStyle[bodyClass].button_background;
    this.color13 = this.themeDefaultStyle[bodyClass].button_font;
    this.color14 = this.themeDefaultStyle[bodyClass].input_background;
    this.color15 = this.themeDefaultStyle[bodyClass].input_font;

    this.assignColor();
  }

  assignColor() {
    if (this.color1) {
      this.themeWrapper.style.setProperty('--navigation_background', this.color1);
    }

    if (this.color4) {
      this.themeWrapper.style.setProperty('--leftPanel_background', this.color4);
    }

    if (this.color2) {
      this.themeWrapper.style.setProperty('--footer_background', this.color2);
    }

    if (this.color6) {
      this.themeWrapper.style.setProperty('--header_background', this.color6);
    }

    if (this.color8) {
      this.themeWrapper.style.setProperty('--title_background', this.color8);
    }

    if (this.color5) {
      this.themeWrapper.style.setProperty('--leftPanel_font', this.color5);
    }

    if (this.color3) {
      this.themeWrapper.style.setProperty('--footer_font', this.color3);
    }

    if (this.color7) {
      this.themeWrapper.style.setProperty('--header_font', this.color7);
    }

    if (this.color12) {
      this.themeWrapper.style.setProperty('--button_background', this.color12);
    }

    if (this.color13) {
      this.themeWrapper.style.setProperty('--button_font', this.color13);
    }

    if (this.color14) {
      this.themeWrapper.style.setProperty('--input_background', this.color14);
    }

    if (this.color15) {
      this.themeWrapper.style.setProperty('--input_font', this.color15);
    }

    if (this.color9) {
      this.themeWrapper.style.setProperty('--title_font', this.color9);
    }

    if (this.color10) {
      this.themeWrapper.style.setProperty('--content_background', this.color10);
    }

    if (this.color11) {
      this.themeWrapper.style.setProperty('--content_font', this.color11);
    }
  }

}

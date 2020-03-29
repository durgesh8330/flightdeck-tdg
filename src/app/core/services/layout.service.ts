import {Component, OnInit, Injectable} from '@angular/core';
import {config} from '@app/core/smartadmin.config';
import {NotificationService} from "./notification.service";
import { Subject, fromEvent } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from '@env/environment';
import { ThemeDefaultStyle } from '@app/features/user-profile/theme-builder/theme.model';

const store = {
  smartSkin: localStorage.getItem('sm-skin') || config.smartSkin,
  skin: config.skins.find((_skin) => {
    return _skin.name == (localStorage.getItem('sm-skin') || config.smartSkin)
  }),
  skins: config.skins,
  fixedHeader: localStorage.getItem('sm-fixed-header') == 'true',
  fixedNavigation: localStorage.getItem('sm-fixed-navigation') == 'true',
  fixedRibbon: localStorage.getItem('sm-fixed-ribbon') == 'true',
  fixedPageFooter: localStorage.getItem('sm-fixed-page-footer') == 'true',
  insideContainer: localStorage.getItem('sm-inside-container') == 'true',
  rtl: localStorage.getItem('sm-rtl') == 'true',
  menuOnTop: localStorage.getItem('sm-menu-on-top') == 'true',
  colorblindFriendly: localStorage.getItem('sm-colorblind-friendly') == 'true',

  shortcutOpen: false,
  isMobile: 	(/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase())),
  device: '',

  mobileViewActivated: false,
  menuCollapsed: false,
  menuMinified: false,
};

@Injectable()
export class LayoutService {
  isActivated:boolean;
  smartSkin:string;

  store:any;

  // Theme related varialbes
  public themeDefaultStyle: ThemeDefaultStyle;
  private themeWrapper = document.querySelector('body');
  themeObjectModel = {};

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
  selectedFont = '';

  // -----------

  private subject:Subject<any>;

  trigger() {
    this.processBody(this.store);
    this.subject.next(this.store)
  }

  subscribe(next, err?, complete?) {
    return this.subject.subscribe(next, err, complete)
  }

  constructor(private notificationService: NotificationService, private httpClient: HttpClient) {
    this.subject = new Subject();
    this.store = store;
    this.trigger();

    fromEvent(window, 'resize').
      pipe(
        debounceTime(100),
        map(()=>{
          this.trigger()
        })
      )
    .subscribe()
  }


  getCustomTheme(uid) {
    const url = environment.apiUrl+'/theme/getThemeswithDefault/'+uid;
    return this.httpClient.get(url);
  }

  getCustomThemeByName(uid,themeName) {
    const url = environment.apiUrl+'/theme/getCss/'+uid+'/'+themeName;
    return this.httpClient.get(url);
  }

  // To get default css link for the user's theme
  getUserPreferences(cuid:string) {
    // return this.httpClient.get(environment.apiUrl + '/UserPreferences/GetUserPreferences/' + cuid);
    return this.httpClient.get(environment.apiUrl + '/Resource/GetResource/' + cuid);
  }

  getUserPreferencesNew(cuid:string) {
    let header = new HttpHeaders({'Content-Type': 'application/json'});
    header = header.set('X-Username', cuid);
    return this.httpClient.get(environment.apiUrl + "/Enterprise/v2/Work/resource?cuid=" + cuid + "&include=a,r,p,wg,jd", {headers: header});
  }

  saveThemeName(uid, themeName){
    const url = environment.apiUrl+'/theme/UpdateCssLinks/'+uid+'/'+themeName;
    return this.httpClient.post(url,'',{responseType: 'text'});
  }

  onSmartSkin(skin) {
    console.log("Skin details ==> ",skin);
    this.store.skin = skin;
    this.store.smartSkin = skin.name;
    this.dumpStorage();
    this.trigger()
  }

  applyDefaultCustomThemeOfUser(userId){
    let themes = [];
    let themeName = "";
    this.getCustomTheme(userId).toPromise().then((response: any)=>{
      const t = Object.keys(response);
      for(let i=0;i < t.length; i++){
        themes.push({
          name:t[i],
          value:t[i],
          isDefault:response[t[i]],
          isCustom: true
        });
        if(response[t[i]]){
          themeName = t[i];
        }

      }

      if(themeName !== ""){
        const localStore = JSON.parse(localStorage.getItem("custom-theme"));
        if(localStore && localStore.themeName && localStore.themeName === themeName){
          const response = localStore.response;
          this.applyTheme(response);
        } else {
          // set custom theme
          this.getCustomThemeByName(userId,themeName).toPromise().then((response: any)=>{
            console.log("Custom theme : ",themeName,":",response);
            if(response['base-theme']) {
              localStorage.setItem("custom-theme",JSON.stringify({themeName, response}));

              this.applyTheme(response);
            } else {
              console.log("Invalid data for custom theme");
            }
            
          });
        }
        
      }
    });
  }

  applyTheme(response){
    const baseName = response['base-theme'];
      
    let skinArray = this.store.skins.map((skin) => {
      return skin.name;
    });

    const index = skinArray.indexOf(baseName);
    if(index !== -1) {
      this.onSmartSkin(this.store.skins[index]);
    }

    this.getBodyClass(baseName);

    this.color1 = response['nav-bar-background'];
    this.color2 = response['footer-background'];
    this.color3 = response['footer-font-color'];
    this.color4 = response['menu-background'];
    this.color5 = response['menu-font-color'];
    this.color6 = response['header-background'];
    this.color7 = response['header-font-color'];
    this.color8 = response['title-background'];
    this.color9 = response['title-font-color'];
    this.color10 = response['content-background'];
    this.color11 = response['content-font-color'];
    this.color12 = response['button-background'];
    this.color13 = response['button-font-color'];
    this.color14 = response['input-background'];
    this.color15 = response['input-font-color'];
    this.selectedFont = response['font-family'];

    this.assignColor();
      
  }

  rgbToHex(rgb) {
    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgb && rgb.length === 4) ? "#" +
      ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
      ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
      ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
  }

  isHexValid(hex) {
    const isOk = /^#[0-9A-F]{6}$/i.test(hex);
    if (!isOk) {
      const isRgb = this.rgbToHex(hex);
      return isRgb;
    }
    return hex;
  }

  assignColor() {
    if (this.selectedFont) {
      this.themeWrapper.style.setProperty('--font_family', this.selectedFont);
    }

    if (this.color1) {
      const hexValue = this.isHexValid(this.color1);
      this.color1 = hexValue;
      if (hexValue && hexValue != '') {
        this.themeWrapper.style.setProperty('--navigation_background', this.color1);
        this.themeObjectModel['--navigation_background'] = this.color1;
        const labelColor = this.invertColor(this.color1, true);
        if (document.getElementById("color1")) {
          document.getElementById("color1").style.color = labelColor;
        }
      } else {
        this.themeWrapper.style.setProperty('--navigation_background', 'none');
      }
    }

    if (this.color4) {
      const hexValue = this.isHexValid(this.color4);
      this.color4 = hexValue;
      if (hexValue && hexValue != '') {
        this.themeWrapper.style.setProperty('--leftPanel_background', this.color4);
        this.themeObjectModel['--leftPanel_background'] = this.color4;
        const labelColor = this.invertColor(this.color4, true);
        if (document.getElementById("color4")) {
          document.getElementById("color4").style.color = labelColor;
        }
      }
    }

    if (this.color2) {
      const hexValue = this.isHexValid(this.color2);
      this.color2 = hexValue;
      if (hexValue && hexValue != '') {
        this.themeWrapper.style.setProperty('--footer_background', this.color2);
        this.themeObjectModel['--footer_background'] = this.color2;
        const labelColor = this.invertColor(this.color2, true);
        if (document.getElementById("color2")) {
          document.getElementById("color2").style.color = labelColor;
        }
      } else {
        this.themeWrapper.style.setProperty('--footer_background', 'none');
      }
    }

    if (this.color6) {
      const hexValue = this.isHexValid(this.color6);
      this.color6 = hexValue;
      if (hexValue && hexValue != '') {
        this.themeWrapper.style.setProperty('--header_background', this.color6);
        this.themeObjectModel['--header_background'] = this.color6;
        const labelColor = this.invertColor(this.color6, true);
        if (document.getElementById("color6")) { document.getElementById("color6").style.color = labelColor; }
      }
    }

    if (this.color8) {
      const hexValue = this.isHexValid(this.color8);
      this.color8 = hexValue;
      if (hexValue && hexValue != '') {
        this.themeWrapper.style.setProperty('--title_background', this.color8);
        this.themeObjectModel['--title_background'] = this.color8;
        const labelColor = this.invertColor(this.color8, true);
        if (document.getElementById("color8")) { document.getElementById("color8").style.color = labelColor; }
      }
    }

    if (this.color5) {
      const hexValue = this.isHexValid(this.color5);
      this.color5 = hexValue;
      if (hexValue && hexValue != '') {
        this.themeWrapper.style.setProperty('--leftPanel_font', this.color5);
        this.themeObjectModel['--leftPanel_font'] = this.color5;
        const labelColor = this.invertColor(this.color5, true);
        if (document.getElementById("color5")) { document.getElementById("color5").style.color = labelColor; }
      }
    }

    if (this.color3) {
      const hexValue = this.isHexValid(this.color3);
      this.color3 = hexValue;
      if (hexValue && hexValue != '') {
        this.themeWrapper.style.setProperty('--footer_font', this.color3);
        this.themeObjectModel['--footer_font'] = this.color3;
        const labelColor = this.invertColor(this.color3, true);
        if (document.getElementById("color3")) { document.getElementById("color3").style.color = labelColor; }
      }
    }

    if (this.color7) {
      const hexValue = this.isHexValid(this.color7);
      this.color7 = hexValue;
      if (hexValue && hexValue != '') {
        this.themeWrapper.style.setProperty('--header_font', this.color7);
        this.themeObjectModel['--header_font'] = this.color7;
        const labelColor = this.invertColor(this.color7, true);
        if (document.getElementById("color7")) {
          document.getElementById("color7").style.color = labelColor;
        }
      }
    }

    if (this.color12) {
      const hexValue = this.isHexValid(this.color12);
      this.color12 = hexValue;
      if (hexValue && hexValue != '') {
        this.themeWrapper.style.setProperty('--button_background', this.color12);
        this.themeObjectModel['--button_background'] = this.color12;
        const labelColor = this.invertColor(this.color12, true);
        if (document.getElementById("color12")) { document.getElementById("color12").style.color = labelColor; }
      }
    }

    if (this.color13) {
      const hexValue = this.isHexValid(this.color13);
      this.color13 = hexValue;
      if (hexValue && hexValue != '') {
        this.themeWrapper.style.setProperty('--button_font', this.color13);
        this.themeObjectModel['--button_font'] = this.color13;
        const labelColor = this.invertColor(this.color13, true);
        if (document.getElementById("color13")) { document.getElementById("color13").style.color = labelColor; }
      }
    }

    if (this.color14) {
      const hexValue = this.isHexValid(this.color14);
      this.color14 = hexValue;
      if (hexValue && hexValue != '') {
        this.themeWrapper.style.setProperty('--input_background', this.color14);
        this.themeObjectModel['--input_background'] = this.color14;
        const labelColor = this.invertColor(this.color14, true);
        if (document.getElementById("color14")) { document.getElementById("color14").style.color = labelColor; }
      }
    }

    if (this.color15) {
      const hexValue = this.isHexValid(this.color15);
      this.color15 = hexValue;
      if (hexValue && hexValue != '') {
        this.themeWrapper.style.setProperty('--input_font', this.color15);
        this.themeObjectModel['--input_font'] = this.color15;
        const labelColor = this.invertColor(this.color15, true);
        if (document.getElementById("color15")) { document.getElementById("color15").style.color = labelColor; }
      }
    }

    if (this.color9) {
      const hexValue = this.isHexValid(this.color9);
      this.color9 = hexValue;
      if (hexValue && hexValue != '') {
        this.themeWrapper.style.setProperty('--title_font', this.color9);
        this.themeObjectModel['--title_font'] = this.color9;
        const labelColor = this.invertColor(this.color9, true);
        if (document.getElementById("color9")) { document.getElementById("color9").style.color = labelColor; }
      }
    }

    if (this.color10) {
      const hexValue = this.isHexValid(this.color10);
      this.color10 = hexValue;
      if (hexValue && hexValue != '') {
        this.themeWrapper.style.setProperty('--content_background', this.color10);
        this.themeObjectModel['--content_background'] = this.color10;
        const labelColor = this.invertColor(this.color8, true);
        if (document.getElementById("color10")) { document.getElementById("color8").style.color = labelColor; }
      }
    }

    if (this.color11) {
      const hexValue = this.isHexValid(this.color11);
      this.color11 = hexValue;
      if (hexValue && hexValue != '') {
        this.themeWrapper.style.setProperty('--content_font', this.color11);
        this.themeObjectModel['--content_font'] = this.color11;
        const labelColor = this.invertColor(this.color11, true);
        if (document.getElementById("color11")) { document.getElementById("color11").style.color = labelColor; }
      }
    }
  }

  onFixedHeader() {
    this.store.fixedHeader = !this.store.fixedHeader;
    if (this.store.fixedHeader == false) {
      this.store.fixedRibbon = false;
      this.store.fixedNavigation = false;
    }
    this.dumpStorage();
    this.trigger()
  }

  onMouseToggleMenu(state) {
     if(this.store.menuCollapsed) {
        if(state) {
          $('.a-brand.logo__svg.logo-img-div').show();
          $('body').addClass('menu-hover');
          $('nav>ul>li>ul>li>a, nav>ul>li>ul>li>ul>li>a').css('visibility', 'hidden');
          $('.login-info a').css('visibility', 'hidden');
          $('nav ul span.menu-item-parent').css('visibility', 'hidden');
          $('body').removeClass('minified');
          setTimeout(()=> {
            $('nav>ul>li>ul>li>a, nav>ul>li>ul>li>ul>li>a').css('visibility', 'visible');
            $('nav ul span.menu-item-parent').css('visibility', 'visible');
            $('.login-info a').css('visibility', 'visible');
          }, 10);
        } else {
              $('.a-brand.logo__svg.logo-img-div').hide();
              $('body').removeClass('menu-hover');
              $('body').addClass('minified');
        }
     } else {
         $('body').removeClass('menu-hover');
         this.trigger();
     }
    
  }

  onFixedNavigation() {
    this.store.fixedNavigation = !this.store.fixedNavigation;

    if (this.store.fixedNavigation) {
      this.store.insideContainer = false;
      this.store.fixedHeader = true;
    } else {
      this.store.fixedRibbon = false;
    }
    this.dumpStorage();
    this.trigger();
  }


  onFixedRibbon() {
    this.store.fixedRibbon = !this.store.fixedRibbon;
    if (this.store.fixedRibbon) {
      this.store.fixedHeader = true;
      this.store.fixedNavigation = true;
      this.store.insideContainer = false;
    }
    this.dumpStorage();
    this.trigger()
  }


  onFixedPageFooter() {
    this.store.fixedPageFooter = !this.store.fixedPageFooter;
    this.dumpStorage();
    this.trigger()
  }


  onInsideContainer() {
    this.store.insideContainer = !this.store.insideContainer;
    if (this.store.insideContainer) {
      this.store.fixedRibbon = false;
      this.store.fixedNavigation = false;
    }
    this.dumpStorage();
    this.trigger()
  }


  onRtl() {
    this.store.rtl = !this.store.rtl;
    this.dumpStorage();
    this.trigger()
  }


  onMenuOnTop() {
    this.store.menuOnTop = !this.store.menuOnTop;
    this.dumpStorage();
    this.trigger()
  }


  onColorblindFriendly() {
    this.store.colorblindFriendly = !this.store.colorblindFriendly;
    this.dumpStorage();
    this.trigger()
  }

  onCollapseMenu(value?){
    if(typeof value !== 'undefined'){
      this.store.menuCollapsed = value
    } else {
      this.store.menuCollapsed = !this.store.menuCollapsed;
    }

    this.trigger();
  }


  onMinifyMenu(){
    this.store.menuMinified = !this.store.menuMinified;
    this.trigger();
  }

  onShortcutToggle(condition?: any){
    if(condition == null){
      this.store.shortcutOpen = !this.store.shortcutOpen;
    } else {
      this.store.shortcutOpen = !!condition;
    }

    this.trigger();
  }


  dumpStorage() {
    localStorage.setItem('sm-skin', this.store.smartSkin);
    localStorage.setItem('sm-fixed-header', this.store.fixedHeader);
    localStorage.setItem('sm-fixed-navigation', this.store.fixedNavigation);
    localStorage.setItem('sm-fixed-ribbon', this.store.fixedRibbon);
    localStorage.setItem('sm-fixed-page-footer', this.store.fixedPageFooter);
    localStorage.setItem('sm-inside-container', this.store.insideContainer);
    localStorage.setItem('sm-rtl', this.store.rtl);
    localStorage.setItem('sm-menu-on-top', this.store.menuOnTop);
    localStorage.setItem('sm-colorblind-friendly', this.store.colorblindFriendly);
  }

  factoryReset() {
    this.notificationService.smartMessageBox({
      title: "<i class='fa fa-refresh' style='color:green'></i> Want to Reset Your Theme?",
      content: "Would you like to reset your theme to Default Century link?",
      buttons: '[No][Yes]'
    }, (ButtonPressed) => {
      if (ButtonPressed == "Yes") {
      //if (ButtonPressed == "Yes" && localStorage) {
        let defaultTheme = 'century-link';
        console.log("setting default theme to ",defaultTheme);
        document.getElementById('custom-theme').setAttribute('href','assets/css/'+defaultTheme+'/theme.css');
        // localStorage.clear();
        // location.reload()
      }
    });
  }


  processBody(state) {
    let $body = $('body');
    $body.removeClass(state.skins.map((it)=>(it.name)).join(' '));
    $body.addClass(state.skin.name);
    $("#logo img").attr('src', state.skin.logo);

    //$body.toggleClass('fixed-header', state.fixedHeader);
    //$body.toggleClass('fixed-navigation', state.fixedNavigation);
    //$body.toggleClass('fixed-ribbon', state.fixedRibbon);
    //$body.toggleClass('fixed-page-footer', state.fixedPageFooter);
    $body.toggleClass('container', state.insideContainer);
    $body.toggleClass('smart-rtl', state.rtl);
    //$body.toggleClass('menu-on-top', state.menuOnTop);
    $body.toggleClass('colorblind-friendly', state.colorblindFriendly);
    $body.toggleClass('shortcut-on', state.shortcutOpen);


    state.mobileViewActivated = $(window).width() < 979;
    $body.toggleClass('mobile-view-activated', state.mobileViewActivated);
    if (state.mobileViewActivated) {
      //$body.removeClass('minified');
    }

    if(state.isMobile){
      $body.addClass("mobile-detected");
    } else {
      $body.addClass("desktop-detected");
    }

    if (state.menuOnTop) $body.removeClass('minified');


    if (!state.menuOnTop && !state.mobileViewActivated) {
      //$body.toggleClass("hidden-menu", state.menuCollapsed);
      if(!state.menuCollapsed) {
         $body.removeClass("minified");
      } else {
        $body.addClass("minified");
      }
      $body.toggleClass("hidden-menu-mobile-lock", state.menuCollapsed);
    } else if (state.menuOnTop && state.mobileViewActivated) {
      $body.toggleClass("hidden-menu-mobile-lock", state.menuCollapsed);
      $body.toggleClass("hidden-menu", state.menuCollapsed);
      //$body.removeClass("minified");
    }

    if(state.menuMinified && !state.menuOnTop && !state.mobileViewActivated){
       $body.addClass("minified");
       $body.removeClass("hidden-menu");
       $body.removeClass("hidden-menu-mobile-lock");
    }
    if(state.menuCollapsed && state.mobileViewActivated) {
      setTimeout(()=> {
        $body.addClass("minified");
      },100);
    } 
  }  
  
  getBodyClass(skinValue) {
    this.themeDefaultStyle = new ThemeDefaultStyle();
    // let bodyClass = localStorage.getItem('sm-skin');
    if (skinValue) {
      skinValue = skinValue.replace(/-/g, '');
      if (this.themeDefaultStyle[skinValue]) {
        this.setDefaultColors(skinValue);
      } else {
        let localSkinData = localStorage.getItem('Theme');
        localSkinData = JSON.parse(localSkinData);

        if (localSkinData[0]['--navigation_background']) {
          this.color1 = localSkinData[0]['--navigation_background'];
          const labelColor = this.invertColor(this.color1, true);
          document.getElementById("color1").style.color = labelColor;
        }
        if (localSkinData[0]['--footer_background']) {
          this.color2 = localSkinData[0]['--footer_background'];
          const labelColor = this.invertColor(this.color2, true);
          document.getElementById("color2").style.color = labelColor;
        }
        if (localSkinData[0]['--footer_font']) {
          this.color3 = localSkinData[0]['--footer_font'];
          const labelColor = this.invertColor(this.color3, true);
          document.getElementById("color2").style.color = labelColor;
        }
        if (localSkinData[0]['--leftPanel_background']) {
          this.color4 = localSkinData[0]['--leftPanel_background'];
          const labelColor = this.invertColor(this.color4, true);
          document.getElementById("color2").style.color = labelColor;
        }
        if (localSkinData[0]['--leftPanel_font']) {
          this.color5 = localSkinData[0]['--leftPanel_font'];
          const labelColor = this.invertColor(this.color5, true);
          document.getElementById("color5").style.color = labelColor;
        }
        if (localSkinData[0]['--header_background']) {
          this.color6 = localSkinData[0]['--header_background'];
          const labelColor = this.invertColor(this.color6, true);
          document.getElementById("color6").style.color = labelColor;
        }
        if (localSkinData[0]['--header_font']) {
          this.color7 = localSkinData[0]['--header_font'];
          const labelColor = this.invertColor(this.color7, true);
          document.getElementById("color7").style.color = labelColor;
        }
        if (localSkinData[0]['--title_background']) {
          this.color8 = localSkinData[0]['--title_background'];
          const labelColor = this.invertColor(this.color8, true);
          document.getElementById("color8").style.color = labelColor;
        }
        if (localSkinData[0]['--title_font']) {
          this.color9 = localSkinData[0]['--title_font'];
          const labelColor = this.invertColor(this.color9, true);
          document.getElementById("color9").style.color = labelColor;
        }
        if (localSkinData[0]['--content_background']) {
          this.color10 = localSkinData[0]['--content_background'];
          const labelColor = this.invertColor(this.color10, true);
          document.getElementById("color10").style.color = labelColor;
        }
        if (localSkinData[0]['--content_font']) {
          this.color11 = localSkinData[0]['--content_font'];
          const labelColor = this.invertColor(this.color11, true);
          document.getElementById("color11").style.color = labelColor;
        }
        if (localSkinData[0]['--button_background']) {
          this.color12 = localSkinData[0]['--button_background'];
          const labelColor = this.invertColor(this.color12, true);
          document.getElementById("color12").style.color = labelColor;
        }
        if (localSkinData[0]['--button_font']) {
          this.color13 = localSkinData[0]['--button_font'];
          const labelColor = this.invertColor(this.color13, true);
          document.getElementById("color13").style.color = labelColor;
        }
        if (localSkinData[0]['--input_background']) {
          this.color14 = localSkinData[0]['--input_background'];
          const labelColor = this.invertColor(this.color14, true);
          document.getElementById("color14").style.color = labelColor;
        }
        if (localSkinData[0]['--input_font']) {
          this.color15 = localSkinData[0]['--input_font'];
          const labelColor = this.invertColor(this.color15, true);
          document.getElementById("color15").style.color = labelColor;
        }

        this.assignColor();
      }
    }
  }

  setDefaultColors(bodyClass) {
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

  invertColor(hex, bw) {
    if (hex.indexOf('#') === 0) {
      hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
      throw new Error('Invalid HEX color.');
    }
    var r = parseInt(hex.slice(0, 2), 16),
      g = parseInt(hex.slice(2, 4), 16),
      b = parseInt(hex.slice(4, 6), 16);
    if (bw) {
      return (r * 0.299 + g * 0.587 + b * 0.114) > 186
        ? '#000000'
        : '#FFFFFF';
    }
    // invert color components
    r = parseInt((255 - r).toString(16));
    g = parseInt((255 - g).toString(16));
    b = parseInt((255 - b).toString(16));
    // pad each with zeros and return
    return "#" + this.padZero(r, r.toString().length) + this.padZero(g, g.toString().length) +
      this.padZero(b, b.toString().length);
  }

  padZero(str, len) {
    len = len || 2;
    var zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
  }
  getQueryRecord(id,resourceData){
    let h = new HttpHeaders({'Content-Type': 'application/json'});
    const url = environment.apiUrl+'/Enterprise/v2/Work/resource/'+id+'/'+'auditLog'+'/'+'search';
    return this.httpClient.post(url,JSON.stringify(resourceData),{headers: h});

  }
}

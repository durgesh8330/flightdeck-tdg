import { Component, OnInit, Inject, OnDestroy, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { LayoutService } from '@app/core/services/layout.service';
import { Subscription } from 'rxjs';
import { ThemeMatch, ThemeDefaultStyle } from './theme.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@env/environment';
import { MatSnackBar } from '@angular/material';
import { ActivityLogService } from '../../activity-log/activity-log.service';

@Component({
  selector: 'sa-theme-builder',
  templateUrl: './theme-builder.component.html',
  styleUrls: ['./theme-builder.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ThemeBuilderComponent implements OnInit, OnDestroy {
    private themeWrapper = document.querySelector('body');
    private sub: Subscription;
    public themeDefaultStyle: ThemeDefaultStyle;

    public userInfo = JSON.parse(localStorage.getItem('fd_user'));
    public selectedTheme="google";

    public themes = [{
        name:'Glass',
        value:'glass',
        image:'assets/img/demo/layout-skins/skin-glass.png'
    }, {
        name:'Google',
        value:'google-skin',
        image:'assets/img/demo/layout-skins/skin-google.png'
    }, {
        name:'PixelSmash',
        value:'pixel-smash',
        image:'assets/img/demo/layout-skins/skin-pixel.png'
    }, {
        name:'Dark Elegance',
        value:'dark-elegance',
        image:'assets/img/demo/layout-skins/skin-dark.png'
    }, {
        name:'Century Link',
        value:'century-link',
        image:'assets/img/demo/layout-skins/skin-default.png'
    }, {
        name:'Ultra Light',
        value:'ultra-light',
        image:'assets/img/demo/layout-skins/skin-ultralight.png'
    }];

    constructor(public layoutService: LayoutService, private httpClient: HttpClient, private snackBar: MatSnackBar, private activityLogService: ActivityLogService) {
        
    }

    ngOnInit() {
        // fetch default theme
        /*
        this.layoutService.getUserPreferences(this.userInfo['cuid']).toPromise().then((themeLink:any) => {
            console.log("Path : ",themeLink);
            //const path = "file://eldnp1515dm4/union_station/IT/TestAutomation/harsha/Balajee/CSS/custom/"+data.user.cuid+"/dark-elegance/theme.css";
            this.selectedTheme = (themeLink && themeLink.selectedTheme) ? themeLink.selectedTheme : 'century-link';
            const path = "assets/css/"+ this.selectedTheme +"/theme.css"
            console.log("changing css url : ",path);

            document.getElementById('custom-theme').setAttribute('href',path);
        });*/
    }

    ngOnDestroy() {
        this.sub.unsubscribe()
    }

    save(){
        console.log("Save called : ",this.selectedTheme);
        this.saveDefaultTheme(this.userInfo['cuid'],this.selectedTheme);
    }

    factoryReset(){
        console.log("Factory called ");
        this.saveDefaultTheme(this.userInfo['cuid'],"century-link");
    }

    saveDefaultTheme(cuid, themeName) {
        this.layoutService.saveThemeName(cuid,themeName).toPromise().then((response: any) => {
            const path = "file://eldnp1515dm4/union_station/IT/TestAutomation/harsha/Balajee/CSS/custom/"+cuid+"/"+themeName+"/theme.css";
            console.log("changing css url : ",path);
            // document.getElementById('custom-theme').setAttribute('href',path);
            console.log(response);
            this.snackBar.open("Theme has been updated", "Okay", {
                duration: 15000,
            });
        }).catch(error => {
            console.error(error);
            this.snackBar.open("Error while updating theme", "Okay", {
              duration: 15000,
            });
        });
    }

}
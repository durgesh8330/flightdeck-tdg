import { Component, OnInit, Input } from "@angular/core";
import { Router } from "@angular/router";
import { NotificationService } from "@app/core/services/notification.service";

import {UserService} from "@app/core/services/user.service";
import { AppService } from "@app/app.service";
import { TabService } from "@app/core/tab/tab-service";
@Component({
  selector: "sa-logout",
  template: `
<div id="logout" (click)="showPopup()" class="btn-header transparent pull-right button-spacenew">
        <span> <a title="Sign Out"><i [class]="signOutIcon"></i></a> </span>
    </div>
  `,
  styles: []
})
export class LogoutComponent implements OnInit {

  public user3
  @Input() signOutIcon;
  constructor(
    private userService: UserService,
    private router: Router,
    private notificationService: NotificationService,
    private appService : AppService,
    private  tablService: TabService
  ) {
  }

  showPopup() {
    this.notificationService.smartMessageBox(
      {
        title:
          "<i class='fa fa-sign-out txt-color-orangeDark'></i> Logout <span class='txt-color-orangeDark'><strong>" + this.userService.user$.value.displayName+"</strong></span> ?",
        content:
          "You can improve your security further after logging out by closing this opened browser",
        buttons: "[No][Yes]"
      },
      ButtonPressed => {
        if (ButtonPressed == "Yes") {
          this.logout();
        }
      }
    );
  }

  logout() {
    this.tablService.removeAllTab();
    this.userService.logout()
    this.appService.logout();
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(["/auth/login"]);
  }

  ngOnInit() {}
}

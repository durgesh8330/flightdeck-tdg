import {Component, OnInit} from '@angular/core';
import { UserService } from '@app/core/services/user.service';
import { LayoutService } from '@app/core/services/layout.service';

@Component({

  selector: 'sa-login-info',
  templateUrl: './login-info.component.html',
})
export class LoginInfoComponent implements OnInit {

public permissionList = [];
  constructor(
    public us: UserService,
              private layoutService: LayoutService) {
  }

  ngOnInit() {
    let themeLink = JSON.parse(localStorage.getItem("themeLink"));
    if(themeLink && themeLink.leftMenu){
      this.permissionList = themeLink.leftMenu.split(';');
      if(!this.permissionList){
        this.permissionList = [];
      }
    }
  }

  toggleShortcut() {
    this.layoutService.onShortcutToggle()
  }

}

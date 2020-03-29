import { Component, OnInit } from '@angular/core';
import { TabService } from '@app/core/tab/tab-service';
import { Tab } from '@app/core/tab/tab.model';
import { ProfileInfoComponent } from '@app/features/profile/profile-info/profile-info.component';
import { Router } from '@angular/router';

@Component({
  selector: 'sa-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.css']
})
export class ProfileMenuComponent implements OnInit {

  constructor(private tabService: TabService,private _router: Router,) { }

  ngOnInit() {
  }


  openProfileDetail(){
    const tab: Tab = new Tab(ProfileInfoComponent, 'Profile ', 'viewProfile', {id:1});
    this.tabService.openTab(tab);
    this._router.navigate(['/profile']);
  }
}

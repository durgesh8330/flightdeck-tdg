import { Component, OnInit } from '@angular/core';
import { UserProfileService } from '../user-profile.service';

@Component({
  selector: 'sa-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.css']
})
export class AdministrationComponent implements OnInit {

  public adminData = {app: ''};
  public userDetails = {profileAppsList: []};
  public administrationwodgetwa = 'administrationwidget';

 constructor() { }

  ngOnInit() { }
  
}

import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'sa-session-expiration-alert',
  templateUrl: './session-expiration-alert.component.html',
  styleUrls: []
})
export class SessionExpirationAlertComponent implements OnInit {

  private intervalId;

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: Dialog_Data) {
                
      this.intervalId =  setInterval(()=>{
            this.dialogData.count--;
            if(this.dialogData.count == 0){
                clearInterval(this.intervalId);
            }
      }, 1000);
      this.dialogData.actionType = 'Refresh_Token';
      this.dialogData.noThanks = "Logout";
  }

  ngOnInit() { }

}

interface Dialog_Data{
  userName: string;
  count: number;
  actionType: string;
  noThanks: string;
}

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { SessionExpirationAlertComponent } from './session-expiration-alert.component';
import { SessionExpiredAlertComponent } from './session-expired-alert.component';
import { environment } from '@env/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SessionExpirationAlertService {

  private sessionTimoutSec: number = environment.sessionDefaultTimeout;
  private intervalId;
  private lastActivityAt: number;
  private tokenNotFound = false;

  constructor(private router: Router, private dialog: MatDialog, private httpClient: HttpClient) { }

  refreshSessionTimeout(expiresIn) {

    if (!this.backgroundTimerIntervalId) {
      this.backgroundTimerIntervalId = setInterval(() => {
        this.backgroundTimer++;
        if (this.backgroundTimer == 60) {
          if (new Date().getTime() / 1000 - this.lastActivityAt <= 60) {
            this.refreshAccessToken();
          } else {
            this.backgroundTimer = 0;
          }
        }
      }, 1000);
    } else {
      this.backgroundTimer = 0;
    }
    if (expiresIn)
      this.sessionTimoutSec = expiresIn;
    else
      this.sessionTimoutSec = environment.sessionDefaultTimeout;

    if (!this.intervalId) {
      this.startTimer();
    } else if (this.sessionWarnDialogRef) {
      this.sessionWarnDialogRef.close();
      this.sessionWarnDialogRef = undefined;
    }
  }

  private startTimer() {
    this.intervalId = setInterval(() => {
      --this.sessionTimoutSec;
      if (!localStorage.getItem('fd_access_token')) {
        this.showSessionExpiredMessage();
        this.tokenNotFound = true;
        // As the token not available in Local Storage timer should not get stopped, refreshing the timer to default timeout
        // As user may login in browsers another tab in this case we should allow the user to continue working on FD
        this.sessionTimoutSec = environment.sessionDefaultTimeout;
        if (this.sessionWarnDialogRef) {
          this.sessionWarnDialogRef.close();
          this.sessionWarnDialogRef = undefined;
        }
      } else if (this.sessionTimoutSec == environment.sessionWarnAt) {
        this.showSessionWarning(this.sessionTimoutSec);
      } else if (this.sessionTimoutSec == 0) {
        this.dialog.closeAll();
        this.logout();
      } else if (this.tokenNotFound && localStorage.getItem('fd_access_token')) {
        this.tokenNotFound = false;
        this.sessionExpiredDialogRef.close();
        this.sessionExpiredDialogRef = undefined;
        this.refreshSessionTimeout(localStorage.getItem('fd_access_token'));
      }
    }, 1000);
  }

  private showSessionWarning(timeoutCount: number): void {
    let dialogData = { count: timeoutCount, userName: '' };
    if (localStorage.getItem('fd_user')) {
      dialogData.userName = JSON.parse(localStorage.getItem('fd_user')).displayName;
    }
    this.sessionWarnDialogRef = this.dialog.open(SessionExpirationAlertComponent, {
      width: '550px',
      data: dialogData,
      hasBackdrop: false
    });

    this.sessionWarnDialogRef.afterClosed().subscribe(result => {
      if (result == 'Refresh_Token') {
        this.refreshAccessToken();
        this.setUserActivity();
      } else if (result == "Logout") {
        this.logout();
      }
    });
  }

  logout() {
    //Invalidating token in SSO
    let headers = new HttpHeaders();
    this.httpClient.delete(environment.ssoUrl + 'oauth/token?client_id=' + environment.clientId + '&client_secret=' + environment.secret,
      { headers: headers }).toPromise().then((response: any) => {
        console.log('token revoked successfully');
      }).catch((error: any) => {
        console.error(error);
      });
    //Clearing session timeout warning dialog box interval
    clearInterval(this.intervalId);
    clearInterval(this.backgroundTimerIntervalId);
    this.backgroundTimerIntervalId = undefined;
    this.intervalId = undefined;
    var systemParam = localStorage.systemParameterPerPage;
    localStorage.clear();
    setTimeout(() => {
      if (systemParam) {
        localStorage.systemParameterPerPage = systemParam;
      }
    }, 100);
    this.router.navigate(['/auth/login']);

    // Closing all the open dialog boxes here
    this.sessionWarnDialogRef = undefined;
    this.sessionExpiredDialogRef = undefined;
    this.dialog.closeAll();
  }

  refreshAccessToken() {
    //  let params = new URLSearchParams();
    //  params.append('grant_type','refresh_token');
    //  params.append('refresh_token', localStorage.getItem('fd_refresh_token'));
    //  params.append('client_id', environment.clientId);
    //  params.append("client_secret", environment.secret);
    //  let headers = new HttpHeaders({'Content-type': 'application/x-www-form-urlencoded; charset=utf-8'});
    //  headers.append('Access-Control-Allow-Origin','*');
    // this.httpClient.post(environment.ssoUrl+'oauth/token', params.toString(), { headers: headers }).toPromise().then((response: any)=>{
    //    console.log(response);
    //    //Setting refresh_token, access_token and expires in time to local storage as refresh token generates a new token
    //    localStorage.setItem('fd_access_token', response.access_token);
    //    localStorage.setItem('fd_refresh_token', response.refresh_token);
    //    localStorage.setItem('fd_expires_in', response.expires_in);
    //    this.refreshSessionTimeout(response.expires_in);
    //  }).catch((error:any)=> {
    //      console.log(error);
    //      //Setting Dummy Values until Auth Token issue is resolved
    //      localStorage.setItem('fd_access_token', '123123');
    //      localStorage.setItem('fd_refresh_token', '123132');
    //      localStorage.setItem('fd_expires_in', environment.sessionDefaultTimeout.toString());
    //      this.refreshSessionTimeout(environment.sessionDefaultTimeout);
    //  });

    localStorage.setItem('fd_access_token', '123123');
    localStorage.setItem('fd_refresh_token', '123132');
    localStorage.setItem('fd_expires_in', environment.sessionDefaultTimeout.toString());
    this.refreshSessionTimeout(environment.sessionDefaultTimeout);
  }

  private sessionWarnDialogRef;
  private sessionExpiredDialogRef;

  showSessionExpiredMessage() {
    if (!this.sessionExpiredDialogRef) {
      this.sessionExpiredDialogRef = this.dialog.open(SessionExpiredAlertComponent, {
        width: '550px',
        data: null,
        hasBackdrop: false
      });
    }
  }

  private backgroundTimer = 0;
  private backgroundTimerIntervalId;

  setUserActivity() {
    this.lastActivityAt = new Date().getTime() / 1000;
  }

}

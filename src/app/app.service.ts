import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { SessionExpirationAlertService } from './core/session-expiration-alert/session-expiration-alert.service';
import { isArray } from 'util';
import { LoaderComponent } from "./shared/loader/loader.component";
import { MatDialog } from "@angular/material/dialog";

export class Foo {
  constructor(
    public id: number,
    public name: string) { }
}

@Injectable()
export class AppService {

  //Session timeout 
  idle: number;
  timeout: number = 20;
  ping: number = 120;
  lastPing: string;
  isWatching: boolean;
  isTimer: boolean;
  timeIsUp: boolean;
  public timerCount: number;
  public taskMailurl = {};
  public taskMailDetails: Boolean = false;

  dialogRef: any;

  constructor(private httpClient: HttpClient, private _router: Router, private sessionExpirationService: SessionExpirationAlertService, public dialog: MatDialog) { }

  obtainAccessToken(loginData) {
    if (loginData == null) {
      return;
    }

    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    headers = headers.set('X-Username', loginData.cuid);
    headers = headers.set('X-Password', loginData.password);
    return this.httpClient.get(environment.apiUrl + '/Enterprise/v2/Work/flightDeck/authenticate', { headers: headers });

  }

  authenticateUser(loginData) {
    if (loginData == null) {
      return;
    }
    var headers = new HttpHeaders({ 'Content-Type': 'application/json', "X-Username": loginData.cuid, "X-Password": loginData.password });
    return this.httpClient.get(environment.apiUrl + '/Enterprise/v2/Work/flightDeck/authenticate', { 'headers': headers });
  }

  checkAuthorization(cuid: string) {
    const header = new HttpHeaders({ 'Content-Type': 'application/json' });
    header.append('Access-Control-Allow-Origin', '*');
    header.append('X-Username', cuid);
    return this.httpClient.get(environment.apiUrl + "/Enterprise/v2/Work/resource?cuid=" + cuid + "&include=a,r,p,wg,jd", { 'headers': header });
    // return this.httpClient.get(environment.apiUrl + "/Resource/GetResource/" + cuid, {'headers': header});
  }

  checkAuthorizationNew(cuid: string) {
    const header = new HttpHeaders({ 'Content-Type': 'application/json' });
    header.append('Access-Control-Allow-Origin', '*');
    return this.httpClient.get(environment.apiUrl + "/Enterprise/v2/Work/resource?include=" + cuid, { 'headers': header });
  }

  getResource(resourceUrl) {
    return localStorage.getItem('fd_user');
  }

  checkCredentials() {
    if (localStorage.getItem('fd_access_token') == null) {
      this._router.navigate(['/login']);
    }
  }

  getAccessToken() {
    return localStorage.getItem('fd_access_token');
  }

  public logout() {
    localStorage.removeItem('fd_access_token');
    localStorage.removeItem('fd_profileAppsList');
    localStorage.removeItem('fd_refresh_token');
    localStorage.removeItem('fd_expires_in');
    localStorage.removeItem('fd_user');
    this.sessionExpirationService.logout();
  }

  // To get default pre-defined theme for user
  getPreDefinedThemeName(cuid: string) {
    return this.httpClient.get(environment.apiUrl + '/theme/getPredifinedCss/' + cuid);
  }

  fieldHasValue(field) {
    if (field == undefined || field == null || ("" + field).length < 1) {
      return false;
    }
    return true;
  }

  GetResponcesInPramaeData(event: any) {
    let workgroupParams: any = [];
    let tmpReqData: any;
    console.log(JSON.stringify(event));
    if (isArray(event)) {
      event.forEach((workgroup: any) => {
        tmpReqData = workgroup.fieldsList.map((pltParam, index) => {
          if (pltParam.fieldValue) {
            return pltParam;
          }
          else if (pltParam.selectedItems && pltParam.selectedItems.length > 0) {
            return pltParam;
          }
        });
        workgroup.fieldsList.map((pltParam, index) => {
          console.log(pltParam);
          var paramItem = {
            name: pltParam.fieldName,
            value: pltParam.fieldValue,
            systemParameterItems: []
          }
          if (pltParam.type == 'select') {
            pltParam.systemParameterItemModels.map((spim, spiIndex) => {
              if (spim.value == pltParam.fieldValue) {
                console.log(pltParam);
                spim.name = pltParam.fieldName;
                paramItem.systemParameterItems[0] = spim;
                //paramItem.value = spim.value;
                //Changed for GETCWM-10843 param value saved in params table for list of values
                 paramItem.value = null;
                // Changed for GETCWM-10824 task
                workgroupParams.push(paramItem);
              }
            });
          } else if (pltParam.type == 'MultiSelect') {
            if (pltParam.selectedItems && pltParam.selectedItems.length > 0) {
              paramItem.systemParameterItems = [];
              pltParam.selectedItems.map((selected, selectedIndex) => {
                pltParam.systemParameterItemModels.map((spim, spiIndex) => {
                  if (spim.value == selected) {
                    paramItem.systemParameterItems.push(spim);
                  }
                });
              });
              workgroupParams.push(paramItem);
            }
          } else {
            paramItem.value = pltParam.fieldValue;
              //If no EC code is saved or Assigned for User, it will save as null- currently was saving "00" which is incorrect//
            if (paramItem.value != null) {
              if (paramItem.name == "EC" && ((paramItem.value).trim()).length == 1) {
                paramItem.value = "00" + paramItem.value.trim();
              }
              else if (paramItem.name == "EC" && ((paramItem.value).trim()).length >= 2 && ((paramItem.value).trim()).length < 3) {
                paramItem.value = "0" + paramItem.value.trim();
              } else if (paramItem.name == "EC" && ((paramItem.value).trim()).length == 0) {
                paramItem.value = null;
              }
            }
            workgroupParams.push(paramItem);
          }
        });
      });
    } else {
      tmpReqData = event.fieldsList.map((pltParam, index) => {
        if (pltParam.fieldValue) {
          return pltParam;
        }
        else if (pltParam.selectedItems && pltParam.selectedItems.length > 0) {
          return pltParam;
        }
      });
      event.fieldsList.map((pltParam, index) => {
        console.log(pltParam);
        var paramItem = {
          name: pltParam.fieldName,
          value: pltParam.fieldValue,
          systemParameterItems: []
        }
        if (pltParam.type == 'select') {
          pltParam.systemParameterItemModels.map((spim, spiIndex) => {
            if (spim.value == pltParam.fieldValue) {
              console.log(pltParam);
              spim.name = pltParam.fieldName;
              paramItem.systemParameterItems[0] = spim;
                //Changed for GETCWM-10843 param value saved in params table for list of values
                 paramItem.value = null;
              //paramItem.value = spim.value;
              // Changed for GETCWM-10824 task
              workgroupParams.push(paramItem);
            }
          });
        } else if (pltParam.type == 'MultiSelect') {
          if (pltParam.selectedItems && pltParam.selectedItems.length > 0) {
            paramItem.systemParameterItems = [];
            pltParam.selectedItems.map((selected, selectedIndex) => {
              pltParam.systemParameterItemModels.map((spim, spiIndex) => {
                if (spim.value == selected) {
                  paramItem.systemParameterItems.push(spim);
                }
              });
            });
            workgroupParams.push(paramItem);
          }
        }
        else {
          paramItem.value = pltParam.fieldValue;
          if (paramItem.value != null) {
            if (paramItem.name == "EC" && ((paramItem.value).trim()).length == 1) {
              paramItem.value = "00" + paramItem.value.trim();
            }
            else if (paramItem.name == "EC" && ((paramItem.value).trim()).length >= 2 && ((paramItem.value).trim()).length < 3) {
              paramItem.value = "0" + paramItem.value.trim();
            } else if (paramItem.name == "EC" && ((paramItem.value).trim()).length == 0) {
              paramItem.value = null;
            }
          }
          workgroupParams.push(paramItem);
        }
      });
    }

    return { 'workgroupParams': workgroupParams, 'tmpReqData': tmpReqData };
  }

  // Common function to show the loading indicator
  showLoader() {
    this.dialogRef = this.dialog.open(LoaderComponent, {panelClass:'loading-dialog-css'})
  }

  // hide loader
  hideLoader() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

}
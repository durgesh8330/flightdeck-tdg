import { ActivityLog } from './../task/task-details/activity-log.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class ActivityLogService {

constructor(private httpClient: HttpClient) {}

public logActivity(logObj: ActivityLog){
  const header = new HttpHeaders({'Content-Type': 'application/json'});
  this.httpClient.post(environment.apiUrl+"/WmActivityLog/Create", JSON.stringify(logObj), {headers: header}).toPromise().then(response => {
    console.log(response);
  }).catch(e=>console.error(e));
}

}

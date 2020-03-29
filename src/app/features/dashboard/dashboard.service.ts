import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@env/environment';
import {of} from "rxjs/index";

@Injectable()
export class DashboardService {
  constructor(private httpClient: HttpClient) { }
 
  sourceSystem(params) {
    return this.httpClient.get(environment.apiUrl + "/Dashboard/"+params);
  }
  getSystemSummary(url) {
    return this.httpClient.get(environment.apiUrl + url);
  }
  monthlyStatus(url) {
    return this.httpClient.get(environment.apiUrl + url);
  }
  getDashboardTemplate(path){
    return this.httpClient.get(environment.apiUrl + path);
  }
}

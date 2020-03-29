import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http/';
import { environment } from '../../../../../../../../src/environments/environment';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators'
@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor(private http: HttpClient) {
  }

  getResourceFields() {
      return this.http.get(environment.ruleApiUrl + 'RestService/RuleConfigData/GetResourceData');
  }

  getTaskFields() {
      return this.http.get(environment.ruleApiUrl + 'RestService/RuleConfigData/GetTaskData');
  }

  createOrUpdateRule(requestData:string) {
      let headers = new HttpHeaders({'Content-Type': 'application/json'});
      return this.http.post(environment.ruleApiUrl + 'RestService/WeightRule/UpdateorCreateGetNextRule',requestData, {headers: headers}).pipe(map(this.extractData)
      ,catchError(this.handleError));
  }

  private extractData(res: Response) {
      
      return res;
    }

    private handleError (error: Response | any) {
      return Observable.throw(error);
  }


}

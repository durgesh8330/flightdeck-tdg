import { Injectable } from '@angular/core';
import { Response, Jsonp, Http, ResponseContentType } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../../../src/environments/environment';
import { map, catchError } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class RuleService {

  constructor(private http: HttpClient) { }
  ruleEntityData: Map<string, any>;
  setRuleData(key: string, data: any) {
    if (this.ruleEntityData == undefined) {
      this.ruleEntityData = new Map<string, any>();
    }
    this.ruleEntityData.set(key, data);
  }

  getRuleData(key: string) {
    return this.ruleEntityData.get(key);
  }

  findRule(ruleName: string) {
    return this.http.get(environment.ruleApiUrl + 'RestService/WeightRule/findRuleSet/' + ruleName);
  
    // let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    // let url = encodeURI(environment.ruleApiUrl + 'RestService/WeightRule/findRuleSet/' + ruleName);
    // return this.http.get(url, { headers: headers }).pipe(map(this.extractData)
    //   ,catchError(this.handleError));
  }


  exportRule(ruleName: string) {
    // return this.http.get(environment.ruleApiUrl + 'RestService/WeightRule/exportRule/' + ruleName);
  
    let headers = new HttpHeaders({ 'Content-Type': 'application/zip' });
    let url = encodeURI(environment.ruleApiUrl + 'RestService/WeightRule/exportRule/' + ruleName);
    return this.http.get(url, { headers: headers, responseType: 'blob' }).pipe(map(this.exractFileResponse)
      ,catchError(this.handleError));
  }

  importRule(file: File) {
    
    const formdata: FormData = new FormData();
    formdata.append('file', file);
    return this.http.post(environment.ruleApiUrl + 'RestService/WeightRule/importRule', formdata, {
      reportProgress: true,
      responseType: 'text'
    }
    ).pipe(map(res => this.extractData),catchError(this.handleError));
  }


  private exractFileResponse(res: Blob) {
    return res;
  }

  private extractData(res: Response) {

    return res["message"] || null;
  }

  private handleError(error: Response | any) {
    return Observable.throw(error);
  }

}

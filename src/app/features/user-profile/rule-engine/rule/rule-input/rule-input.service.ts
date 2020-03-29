import { Injectable } from '@angular/core';
import { Response, Jsonp, Http } from '@angular/http';
import { environment } from '../../../../../../../src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
  })
export class RuleInputService {
    ruleInputsData: Map<string, any>;

    constructor(private http: HttpClient) {

    }

    getAllRuleInputs() {
        return this.http.get(environment.ruleApiUrl + 'RestService/RuleInput/getAll');
        // let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        // return this.http.get(environment.ruleApiUrl + 'RestService/RuleInput/getAll', { headers: headers });
        // .pipe(map((any) => this.extractData),
        // catchError( error => this.handleError));
    }


    createOrUpdateRuleInput(requestData: string) {
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post(environment.ruleApiUrl + 'RestService/RuleInput/CreateRuleInput', requestData);
    }

    findRuleInput(name: string) {
        
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let url = encodeURI(environment.ruleApiUrl + 'RestService/RuleInput/get/' + name);
        return this.http.get(url);
        // return {
        //     "message": [{
        //             "id": "5be0187d327e300001a5ded0",
        //             "name": "test",
        //             "description": "test sample",
        //             "type": null,
        //             "headings": [{
        //                     "value": ""
        //                 }, {
        //                     "value": "Results"
        //                 }
        //             ],
        //             "data": [[{
        //                         "value": "test"
        //                     }, {
        //                         "value": "test"
        //                     }
        //                 ]],
        //             "script": "int a = 10;\n      ",
        //             "inputWeightage": 0,
        //             "createdDateTime": null,
        //             "modifiedDateTime": null,
        //             "createdByID": null,
        //             "modifiedByID": null
        //         }
        //     ],
        //     "code": 200
        // };
    }

    setRuleData(key: string, data: any) {
        if (this.ruleInputsData == undefined) {
            this.ruleInputsData = new Map<string, any>();
        }
        this.ruleInputsData.set(key, data);
    }

    getRuleData(key: string) {
        return this.ruleInputsData.get(key);
    }

    private extractData(res: Response) {

        return res["message"] || null;
    }

    private handleError(error: Response | any) {
        return Observable.throw(error);
    }

}
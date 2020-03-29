import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http/';
import { environment } from '../../../../../../environments/environment';
import { CreateResource } from './model/create-resource.model';
import { UpdateResource } from './model/update-resource.model';
import { SearchResource } from './model/search-resource.model';
import { NGXLogger } from 'ngx-logger';
import { Observable, pipe } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ResourceService {

    constructor(private logger: NGXLogger,private http: HttpClient) { }
    
    private extractData(res: Response) {
        return res;
    }

    private extractSearchResults(res: Response) {
        return res.json();
    }

    private handleError (error: Response | any) {
        this.logger.info(error);
        return Observable.throw(error);
    }
    
    public getApplications() {
        let url = environment.ruleApiUrl + "RestService/AdminData/GetApplications"; 
        return this.http.get(url);
    }
    
    public getSkills() {
        let url = environment.ruleApiUrl + "RestService/AdminData/GetSkills"; 
        return this.http.get(url);
    }
    
    public getWorkgroups() {
        let url = environment.ruleApiUrl + "RestService/AdminData/GetWorkgroups"; 
        return this.http.get(url);
    }
    
    public createResource( resource : CreateResource){
        let h = new HttpHeaders({'Content-Type': 'application/json'});
        return this.http.post(environment.ruleApiUrl + 'RestService/Enterprise/v2/Work/resource', JSON.stringify(resource), {headers: h})
        .pipe(map((any) => this.extractData));
    }

    public updateResource( resource : UpdateResource){
        let h = new HttpHeaders({'Content-Type': 'application/json'});
        let user = JSON.parse(localStorage.getItem('user'));
        resource.modifiedByID = user && user.cuid ? user.cuid.toUpperCase() : '';
        return this.http.put(environment.ruleApiUrl + 'RestService/Enterprise/v2/Work/resource/' + resource.modifiedByID, JSON.stringify(resource), {headers: h})
        .pipe(map((any) => this.extractData));
    }

    public getResource(id : any){
        let url = environment.ruleApiUrl + "RestService/Enterprise/v2/Work/resource/"+id; 
        return this.http.get(url);
    }
    
    public searchResource(searchRequest : SearchResource){
        let h = new HttpHeaders({'Content-Type': 'application/json'});
        return this.http.post(environment.ruleApiUrl + 'RestService/Resource/Search', JSON.stringify(searchRequest), {headers: h})
        .pipe(map((any) => this.extractData));
    }

    public deleteResource(id : any){        
        return this.http.delete(environment.ruleApiUrl + 'RestService/Enterprise/v2/Work/resource/'+id).
        pipe(map((any) => this.extractData));
    }
}

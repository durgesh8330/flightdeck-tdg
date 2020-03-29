import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { HttpHeaders } from '@angular/common/http';
import { InvokeApiModel } from '@app/core/models/InvokeApiModel';


@Injectable({
  providedIn: 'root'
})
export class R2DGService {

  constructor(private httpClient: HttpClient) { }

  getPageLevelTemplate(templateName) {
    let header = new HttpHeaders({ 'Content-Type': 'application/json' });
    var UserDetails = JSON.parse(localStorage.getItem('defaultValue'));
    header = header.set('X-Username', UserDetails.personalInfo.cuid);
    return this.httpClient.get(environment.apiUrl + "/PageLayoutTemplate/Get/" + templateName, { headers: header });
  }
  getTaskDetails(sourceTaskId, sourceSystemName) {
    let header = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.get(environment.apiUrl + "/Enterprise/v2/Work/task?sourceTaskId=" + sourceTaskId + "&sourceSystemName=" + sourceSystemName, { headers: header });
  }
  taskCreateSubmit(sourceSystemData) {
    let header = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post(environment.apiUrl + '/Enterprise/v2/Work/task', JSON.stringify(sourceSystemData), { headers: header });
  }
  getTaskDetailsByTaskId(taskId: string) {
    let header = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.get(environment.apiUrl + "/Enterprise/v2/Work/task/" + taskId, { headers: header });
  }

  getSwiftOrderDetails(orderId: string) {
    return this.invoketheAPI(environment.swiftOrderBrokerUrl + "order/" + orderId + "version/0", "GET");
  }

  invoketheAPI(url: string, httpMethod: string) {
    let header = new HttpHeaders({ 'Content-Type': 'application/json' });
    var invokeApiModel = new InvokeApiModel(url, httpMethod);
    return this.httpClient.post(environment.apiUrl + "/Enterprise/v2/InvokeAPI", invokeApiModel, { headers: header });
  }

  getSwiftOrderDetailsFromMediation(orderId: string) {
    let CryptoJS = require("crypto-js");
    let digestTime = (new Date).getTime();
    let digest = CryptoJS.HmacSHA256(digestTime.toString(), environment.appSecret);
    var hashInBase64 =digest.toString(CryptoJS.enc.Base64);
    let header = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Level3-Application-Key': environment.appKey,
      'X-Level3-Digest': hashInBase64,
      'X-Level3-Digest-Time': digestTime.toString(),
      'Accept': 'application/json'
    });
    return this.httpClient.get(environment.swiftOrderBrokerUrl + "order/" + orderId, { headers: header });
  }

  getResource(url: string) {
    return this.httpClient.get(url);
  }
}

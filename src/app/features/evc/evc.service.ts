import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EvcService {

  constructor(private httpClient: HttpClient) { }

  /*public getXml(url) {
    return this.httpClient.get("https://demo5549398.mockable.io/getxmlspr");

  }*/
}

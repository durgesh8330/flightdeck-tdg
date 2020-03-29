import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppService } from '../app.service';
import { SessionExpirationAlertService } from '@app/core/session-expiration-alert/session-expiration-alert.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private _service: AppService, private sessionExpirationService: SessionExpirationAlertService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const authToken = this.getToken();

    let userData: any = JSON.parse(localStorage.getItem("fd_user"));
    var header = req.headers; //new HttpHeaders({ 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' });
    if (userData) {
      if (!req.url.includes("sso-auth")) {
        header = header.set('X-Username', userData.cuid)
        .set('Access-Control-Allow-Origin', '*')
        .set('Content-Type', 'application/json');

        //  header = new HttpHeaders({ 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json', 'X-Username': userData.cuid });
      }
    }

    const authReq = req.clone({
      headers: header
    });

    if (authToken) {
      if (req.url.indexOf("auth/token") < 0) {
        this.sessionExpirationService.setUserActivity();
      }
      return next.handle(authReq);
    }
    return next.handle(req);

  }

  getToken(): String {
    return this._service.getAccessToken();
  }
}

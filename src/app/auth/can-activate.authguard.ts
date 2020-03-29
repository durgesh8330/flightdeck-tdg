import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AppService } from '../app.service';
 
@Injectable()
export class CanActivateAuthGuard implements CanActivate {
 
  constructor(private router: Router, private _service:AppService) {}
 
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this._service.checkCredentials()!=null) {
            // logged in so return true
            return true;
        }
        return false;
    }
}
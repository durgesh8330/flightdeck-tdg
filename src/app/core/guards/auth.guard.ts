import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AppService } from '@app/app.service';

@Injectable({
	providedIn: 'root',
})
export class AuthGuard implements CanActivate {
	constructor(private appService: AppService, private router: Router) {}

	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot): boolean {
		let url: string = state.url;

		return this.checkLogin(url);
	}

	checkLogin(url: string): boolean {
		if (this.appService.getAccessToken()) {
		  	return true;
		}
		// Navigate to the login page with extras
		this.router.navigate(['/auth/login']);
		return false;
	}
}
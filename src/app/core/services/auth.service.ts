import { Injectable } from '@angular/core';
import {Router} from "@angular/router";

@Injectable()
export class AuthService {
  isLoggedIn: boolean = false;

  constructor(private router: Router){

  }

  // store the URL so we can redirect after logging in
  redirectUrl: string;

  login(username, password) {
    if(username && password){
	    this.isLoggedIn = true;
	    this.router.navigate(['/dashboard/analytics']);
    }
  }

  logout(): void {
    this.isLoggedIn = false;
  }
}

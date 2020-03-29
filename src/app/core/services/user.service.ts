import { Injectable } from "@angular/core";

import { BehaviorSubject } from "rxjs";
import { JsonApiService } from "@app/core/services/json-api.service";



const defaultUser = {
  username: "Guest",
  displayName:""
}
@Injectable()
export class UserService {
  public user$ = new BehaviorSubject({...defaultUser});

  constructor(private jsonApiService: JsonApiService) {
    //this.jsonApiService.fetch("/user/login-info.json").subscribe(this.user$)
  }

  subscribeUserInfo(){
    let userInfo = JSON.parse(localStorage.getItem('fd_user'));
    this.user$ = new BehaviorSubject({...userInfo});
  }

  public logout(){
    this.user$.next({...defaultUser})
  }

}

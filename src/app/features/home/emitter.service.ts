import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmitterService {
  private pageSubject = new Subject<any>();

  constructor() {}

  goToPage(pageToNavigate: any) {
    this.pageSubject.next({ page: pageToNavigate });
  }

  getPageToNavigate(): Observable<any> {
    return this.pageSubject.asObservable();
  }
}

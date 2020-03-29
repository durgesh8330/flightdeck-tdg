import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot, ROUTER_CONFIGURATION } from '@angular/router';
import { Observable ,forkJoin}  from 'rxjs';
import { RuleInputService } from '../rule-input/rule-input.service';
import { FilterService } from '../../shared/services/rule/filter.service';
@Injectable()
export class FilterDataResolver implements Resolve<any> {
  constructor(private ruleInputService: RuleInputService, private filterService: FilterService, 
    private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
   return forkJoin([ 
      this.filterService.getResourceFields(),
      this.filterService.getTaskFields(),
      this.ruleInputService.getAllRuleInputs()
  ]);
  }
}
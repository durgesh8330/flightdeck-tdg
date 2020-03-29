import { Component, OnInit, Input } from '@angular/core';
import { RuleService } from '../../../shared/services/rule/rule.service';
import { NgForm } from "@angular/forms/src/forms";
import { Router } from '@angular/router';
import { UUID } from 'angular2-uuid';
import { ProcessComponent } from '../../../shared/process';
import { RuleInputService } from '../rule-input.service';
import { FilterService } from '../../../shared/services/rule/filter.service';
import { forkJoin } from 'rxjs';
import { RuleInputEditComponent } from '../rule-input-edit/rule-input-edit.component';
import { ToasterService } from 'angular2-toaster';
import { Tab } from '@app/core/tab/tab.model';
import { TabService } from '@app/core/tab/tab-service';


@Component({
  selector: 'app-rule-input-search',
  templateUrl: './rule-input-search.component.html',
  styleUrls: ['./rule-input-search.component.scss']
})
export class RuleInputSearchComponent implements OnInit, ProcessComponent {

  @Input() processData: any;
  ruleInputName: string;
  ruleInputs: any[];
  displayResults: boolean;
  loader:boolean = false;
  @Input() data: any;
  constructor(private ruleInputService: RuleInputService, public router: Router, private tabService: TabService, private filterService: FilterService,private toasterService: ToasterService) { }

  ngOnInit() {
  }

  search() {
    this.loader = true;
    this.ruleInputService.findRuleInput(this.ruleInputName).toPromise().then((response: any) => {
      console.log("response...." + response);
      this.ruleInputs = response.message;
      console.log(this.ruleInputs);
      
      this.displayResults = true;
      this.loader = false;
    },
    error => { 
      let errorMessage = error.error;
      this.loader = false;
      this.toasterService.pop('error', errorMessage['code'], errorMessage['message']); 
    });

  }
  onClear() {
    this.ruleInputName = "";
  } 

  onView(res) {
    let uuid = UUID.UUID();
    this.ruleInputService.setRuleData(uuid, res);
    let tab = new Tab(RuleInputEditComponent, "Rule:" + res.name, 'edit',{ rule: res, edit: true, showScript: true, isModal: false});
      this.tabService.openTab(tab);
  }

  onEdit(res) {
    let uuid = UUID.UUID();
    this.ruleInputService.setRuleData(uuid, res);
    forkJoin([this.filterService.getResourceFields(), this.filterService.getTaskFields(), this.ruleInputService.getAllRuleInputs()]).subscribe(results => {
      let tab = new Tab(RuleInputEditComponent, "Rule:" + res.name, 'edit',{ rule: res, edit: true, showScript: true, isModal: false});
      this.tabService.openTab(tab);
    }
    );
  }

}

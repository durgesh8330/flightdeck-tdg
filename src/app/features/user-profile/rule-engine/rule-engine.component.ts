import { Component, OnInit } from '@angular/core';
import { ToasterModule, ToasterService, ToasterConfig} from 'angular2-toaster';
@Component({
  selector: 'sa-rule-engine',
  templateUrl: './rule-engine.component.html',
  styleUrls: ['./rule-engine.component.css']
})
export class RuleEngineComponent implements OnInit {

  constructor() { }
  public config1 : ToasterConfig = new ToasterConfig({
    positionClass: 'toast-top-full-width',
    animation: 'fade',
    timeout: 10000
  });

  ngOnInit() {
  }

}

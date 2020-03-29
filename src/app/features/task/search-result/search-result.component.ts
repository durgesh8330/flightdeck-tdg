import { Component, OnInit, Input } from '@angular/core';
import { ProcessComponent } from '@app/core/page-content/process';

@Component({
  selector: 'sa-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit, ProcessComponent {

  @Input() processData: any;

  public request: any = {};
  public skillList: Array<string>;
  public workgroupList: Array<string>;
  public applicationList: Array<string>;
  public taskTypeList: Array<string>;
  public loader: boolean = false;
  public showResults: boolean = false; 
  public taskResults = []

  constructor() {
  }
  
  ngOnInit() { }
}

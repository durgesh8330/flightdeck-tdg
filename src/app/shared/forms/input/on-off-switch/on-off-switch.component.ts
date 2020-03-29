import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'on-off-switch',
  templateUrl: './on-off-switch.component.html',
})
export class OnOffSwitchComponent implements OnInit {

  @Input() title:string;
  @Input() disabled:string;
  @Input() model:any;
  @Output() modelChange = new EventEmitter();

  @Input() value:any;

  public widgetId;

  constructor() {
  }


  ngOnInit() {
    //this.value = this.model;
    if(this.model=="Y"){
      this.value=true;
    }
    else{
      this.value=false;
    }
    console.log("value ==> ",this.value);
    this.widgetId = 'on-off-switch' + OnOffSwitchComponent.widgetsCounter++;
  }

  onChange() {
    console.log(this.value);
    this.modelChange.emit(this.value)
  }


  static widgetsCounter = 0
}

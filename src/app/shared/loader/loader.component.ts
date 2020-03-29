import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'sa-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {

  loader: any;

  constructor() { }

  ngOnInit() {

  }

}

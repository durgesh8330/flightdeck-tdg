import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
	selector: 'sa-alert',
	templateUrl: './alert.component.html',
	styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {


	@Input('error') error:any = {};
	
	constructor() {
	}
	ngOnInit() {
	}
	onClosed() {
		this.error = {};
	}
}
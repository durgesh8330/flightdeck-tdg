import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'sa-create-application-modal',
  templateUrl: './create-application-modal.component.html',
  styleUrls: ['./create-application-modal.component.scss']
})
export class CreateApplicationModalComponent implements OnInit {

  onCreateApplication = new EventEmitter();

  constructor(@Inject(MAT_DIALOG_DATA) public application: application_Dialog_Data) { }

  ngOnInit() { }

  closeModal(){
    this.onCreateApplication.emit(this.application);
  }

  createApplication(){
    this.application.buttonClicked = 'createapplication';
    this.onCreateApplication.emit(this.application);
  }

}

interface application_Dialog_Data{
  applicationName: string;
  desc: string;
  createdById: string;
  buttonClicked: string;
}

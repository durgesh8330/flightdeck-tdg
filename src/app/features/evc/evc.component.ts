import { Component, OnInit } from '@angular/core';
import { EvcService } from '@app/features/evc/evc.service';

@Component({
  selector: 'sa-evc',
  templateUrl: './evc.component.html',
  styleUrls: ['./evc.component.css']
})
export class EvcComponent implements OnInit {

  constructor(private evcService: EvcService) { }

  ngOnInit() {
    /*this.evcService.getXml(null).subscribe((response: any) => {
      console.log(response);
    })*/

  }

}

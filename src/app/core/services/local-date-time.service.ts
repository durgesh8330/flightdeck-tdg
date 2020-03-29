import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class LocalDateTimeService {

  constructor() { }

	
public convertUTCtoLocalTime(dateString,timeString) {
  //var dateObj = new Date(dateString+'Z');
  //dateObj = $filter('date')(dateObj,"yyyy-MM-dd HH:mm:ss");
  var dateObj =null;
  if(dateString && timeString){
    if(dateString.length > 7 && timeString.length>4){
       
      var hourInString = timeString.substring(0, 2);
        var minInString = timeString.substring(2, 4);
        var dateHr;
        var dateHrMin;
        if (timeString.substring(4)==="A") {
					if (hourInString === "12") {
            dateHr=dateString.concat(" 00");
					} else {
            dateHr=dateString.concat(" " + hourInString);
					}
					dateHrMin =dateHr.concat(":"+minInString);
				} else {
					dateHr=dateString.concat(" " + (((Number(hourInString)) % 12) + 12));
					dateHrMin=dateHr.concat(":"+minInString);
        }
        var dateUtc = moment.utc(dateHrMin);
       var localDate = moment(dateUtc);
      dateObj=localDate.format('YYYY-MM-DD HH:mm');  
    }else{
       dateObj = dateString+timeString;
    }
  }
   return dateObj; 
};
public LocalDate(dateString:string):string{
  var dateObj =null;
  if(dateString){
    if(dateString.length > 10){
      var dateUtc = moment.utc(dateString);
      var localDate = moment(dateUtc).local();
      dateObj=localDate.format('YYYY-MM-DD HH:mm:ss'); 
    }else{
       dateObj = dateString;
    }
  }
          
   return dateObj; 
};

}
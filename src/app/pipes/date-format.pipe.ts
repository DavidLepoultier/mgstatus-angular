import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe extends DatePipe implements PipeTransform {

  DATE_FMT = 'EEE, dd/MM/yyyy - HH:mm:ss';

  transform(value: any, args?: any): any {
    //Downtime
    if (value === -1) {
      return "Never"
    } else {
      return super.transform(value, this.DATE_FMT);
    }
  }

}

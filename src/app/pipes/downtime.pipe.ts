import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'downtime'
})
export class DowntimePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    //Downtime
    var seconds = Math.floor((Date.now() - value) / 1000 );
    var days = Math.floor(seconds / (3600*24));
    seconds  -= days*3600*24;
    var hrs   = Math.floor(seconds / 3600);
    seconds  -= hrs*3600;
    var mnts = Math.floor(seconds / 60);
    seconds  -= mnts*60;
    var downtime = days+' days, '+hrs+':'+mnts+':'+seconds;
    return downtime;
  }

}

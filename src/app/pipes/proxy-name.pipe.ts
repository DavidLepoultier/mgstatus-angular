import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'proxyName'
})
export class ProxyNamePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value.split(args.split('*')[0])[1];
  }

}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unique'
})
export class UniquePipe implements PipeTransform {

  transform(items: any[], args?: any): any {
    console.log('allItems:', args)

    let allItems = items.map(data => data[args]);
    let resource = allItems.filter((x, i, a) => x && a.indexOf(x) === i);
    return resource;
  }

}
